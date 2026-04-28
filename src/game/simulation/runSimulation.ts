// ゲームバランスシミュレーションエンジン
// ブラウザのDebugPanelとCLIスクリプトの両方から使用する

import type { Character, Equipment, EquipmentSlot, CharacterClass, Stance } from '../../types'
import { calcMaxStats, applyExperience } from '../CharacterEngine'
import { getLearnedSkills } from '../skills/SkillMasterData'
import { DUNGEONS } from '../dungeon/DungeonData'
import { generateFloorPlan } from '../dungeon/FloorGenerator'
import { createCombatState, stepCombat } from '../combat/CombatEngine'
import {
  STARTER_EQUIPMENT, pickEquipment, canEquip, getEnhancedStats,
  ENHANCE_RATES, ENHANCE_COSTS, ENHANCE_BREAK_CHANCE, ENHANCE_MAX,
} from '../equipment/EquipmentData'
import { CLASS_LABEL } from '../party/CharacterData'

// ============================================================
// 設定型
// ============================================================
export interface SimConfig {
  classes: CharacterClass[]   // パーティ職業（4人）
  targetDungeonId: string     // 'all' または特定のダンジョンID
  maxRuns: number             // 1ダンジョンあたりの最大周回数
  enhanceTarget: number       // 強化目標値（0〜10）
  goldSpendRatio: number      // 所持金のうち強化に使う割合（0〜1）
}

export const DEFAULT_CONFIG: SimConfig = {
  classes: ['warrior', 'mage', 'priest', 'rogue'],
  targetDungeonId: 'all',
  maxRuns: 15,
  enhanceTarget: 6,
  goldSpendRatio: 0.6,
}

// ============================================================
// 結果型
// ============================================================
export interface SimRunDetail {
  run: number
  victory: boolean
  floorsCleared: number
  totalFloors: number
  deathFloor?: number
  expGained: number
  goldGained: number
  drops: number
  hpPct: number[]
  levelsAfter: number[]
  enhLog: string
}

export interface SimDungeonResult {
  dungeonId: string
  dungeonName: string
  floors: number
  difficulty: number
  recommendedLevel: number
  cleared: boolean
  runsNeeded: number
  entryLevels: number[]
  exitLevels: number[]
  estimatedMinutes: number
  runs: SimRunDetail[]
}

export interface SimMemberResult {
  name: string
  classLabel: string
  charClass: CharacterClass
  level: number
  atk: number; def: number; hp: number; spd: number
  equipment: { slot: EquipmentSlot; name: string; enhancement: number }[]
  skills: { name: string; type: string; level: number }[]
}

export interface SimReport {
  config: SimConfig
  dungeons: SimDungeonResult[]
  totalMinutes: number
  finalParty: SimMemberResult[]
  goldFinal: number
  skillsNote: string
}

// ============================================================
// 内部ヘルパー
// ============================================================
const COMBAT_STEP_MS    = 15_000
const COMBAT_TIMEOUT_MS = 300_000
const DROP_CHANCE       = 0.25
const MP_RECOVERY_FLOOR = 0.12

function makeChar(charClass: CharacterClass, index: number): Character {
  const base: Character = {
    id: `sim_${charClass}_${index}`,
    name: CLASS_LABEL[charClass] ?? charClass,
    class: charClass, level: 1, experience: 0,
    hp: 0, maxHp: 0, mp: 0, maxMp: 0,
    attack: 0, defense: 0, speed: 0,
    stance: 'normal',
    skills: getLearnedSkills(charClass, 1),
    equipment: {},
  }
  const s = calcMaxStats(base)
  return { ...base, ...s, hp: s.maxHp, mp: s.maxMp }
}

function equipScore(item: Equipment): number {
  const s = getEnhancedStats(item)
  return s.attackBonus * 2 + s.defenseBonus * 1.5 + s.hpBonus * 0.08 + (s.speedBonus ?? 0) * 0.4
}

function assignEquipment(chars: Character[], allItems: Equipment[]): Character[] {
  const assigned = new Set<string>()
  const result = chars.map(c => ({ ...c, equipment: { ...c.equipment } }))
  for (const slot of ['weapon', 'armor', 'accessory'] as EquipmentSlot[]) {
    const pairs: { ci: number; item: Equipment; score: number }[] = []
    for (let ci = 0; ci < chars.length; ci++)
      for (const item of allItems)
        if (item.slot === slot && canEquip(item, chars[ci].class))
          pairs.push({ ci, item, score: equipScore(item) })
    pairs.sort((a, b) => b.score - a.score)
    const done = new Set<number>()
    for (const { ci, item } of pairs) {
      if (done.has(ci) || assigned.has(item.id)) continue
      result[ci] = { ...result[ci], equipment: { ...result[ci].equipment, [slot]: item } }
      assigned.add(item.id); done.add(ci)
    }
  }
  return result.map(c => { const s = calcMaxStats(c); return { ...c, ...s, hp: s.maxHp, mp: s.maxMp } })
}

function runEnhancement(
  party: Character[], inventory: Equipment[], availableGold: number,
  target: number, spendRatio: number,
): { party: Character[]; inventory: Equipment[]; goldSpent: number; breakCount: number } {
  let budget = Math.floor(availableGold * spendRatio)
  let goldSpent = 0, breakCount = 0
  let inv = [...inventory]
  const p = party.map(c => ({ ...c, equipment: { ...c.equipment } }))

  for (const slot of ['weapon', 'armor', 'accessory'] as EquipmentSlot[]) {
    for (let ci = 0; ci < p.length; ci++) {
      let item = p[ci].equipment[slot]
      if (!item) continue
      while (budget > 0) {
        const cur: number = item.enhancement ?? 0
        if (cur >= target || cur >= ENHANCE_MAX) break
        const cost = ENHANCE_COSTS[cur]
        if (budget < cost) break
        budget -= cost; goldSpent += cost
        if (Math.random() < ENHANCE_RATES[cur] / 100) {
          item = { ...item, enhancement: cur + 1 }
        } else if (Math.random() < ENHANCE_BREAK_CHANCE) {
          breakCount++
          inv = inv.filter(i => i.id !== item!.id)
          const eq = { ...p[ci].equipment }; delete eq[slot]
          p[ci] = { ...p[ci], equipment: eq }
          item = undefined as any; break
        }
      }
      if (item) {
        const idx = inv.findIndex(i => i.id === item!.id)
        if (idx >= 0) inv[idx] = item
        p[ci] = { ...p[ci], equipment: { ...p[ci].equipment, [slot]: item } }
      }
    }
  }
  const finalParty = p.map(c => { const s = calcMaxStats(c); return { ...c, ...s, hp: s.maxHp, mp: s.maxMp } })
  return { party: finalParty, inventory: inv, goldSpent, breakCount }
}

interface RunResult {
  victory: boolean; floorsCleared: number; deathFloor?: number
  expGained: number; goldGained: number; drops: Equipment[]; finalHpPct: number[]
}

function simulateRun(party: Character[], dungeonId: string, floors: number, difficulty: number): RunResult {
  const plan = generateFloorPlan(dungeonId, floors)
  const stances: Stance[] = party.map(() => 'normal')
  let partyHp = party.map(c => c.maxHp)
  let partyMp = party.map(c => c.maxMp)
  let exp = 0, gold = 0
  const drops: Equipment[] = []
  let floorsCleared = 0

  for (const floor of plan) {
    if (partyHp.every(h => h <= 0)) break
    if (floor.type === 'event') {
      floorsCleared++
      if (floor.eventType === 'spring')
        partyHp = partyHp.map((h, i) => Math.min(party[i].maxHp, Math.round(h + party[i].maxHp * 0.4)))
      else if (floor.eventType === 'rest') {
        partyHp = partyHp.map((h, i) => Math.min(party[i].maxHp, Math.round(h + party[i].maxHp * 0.5)))
        partyMp = partyMp.map((m, i) => Math.min(party[i].maxMp, Math.round(m + party[i].maxMp * 0.5)))
      } else if (floor.eventType === 'treasure' || floor.eventType === 'merchant') {
        const item = pickEquipment(difficulty, false); if (item) drops.push(item)
      } else if (floor.eventType === 'trap')
        partyHp = partyHp.map((h, i) => h > 0 ? Math.max(1, h - Math.floor(party[i].maxHp * 0.15)) : h)
      continue
    }
    if (floor.enemies.length === 0) { floorsCleared++; continue }

    let combat = createCombatState(floor, party, stances)
    let elapsed = 0, victory = false
    while (elapsed < COMBAT_TIMEOUT_MS) {
      const res = stepCombat(combat, floor, party, partyHp, partyMp, stances, COMBAT_STEP_MS)
      combat = res.combat; partyHp = res.partyHp; partyMp = res.partyMp; elapsed += res.consumedMs
      if (res.done) { victory = res.victory; if (victory) { exp += res.expGained; gold += res.goldGained }; break }
    }
    if (!victory || partyHp.every(h => h <= 0))
      return { victory: false, floorsCleared, deathFloor: floor.floorNumber, expGained: exp, goldGained: gold, drops, finalHpPct: partyHp.map((h, i) => Math.round(h / party[i].maxHp * 100)) }

    floorsCleared++
    if (Math.random() < DROP_CHANCE) { const item = pickEquipment(difficulty, floor.type === 'boss'); if (item) drops.push(item) }
    partyMp = partyMp.map((m, i) => Math.min(party[i].maxMp, Math.round(m + party[i].maxMp * MP_RECOVERY_FLOOR)))
  }
  return { victory: !partyHp.every(h => h <= 0), floorsCleared, expGained: exp, goldGained: gold, drops, finalHpPct: partyHp.map((h, i) => Math.max(0, Math.round(h / party[i].maxHp * 100))) }
}

// ============================================================
// メインAPI
// ============================================================
export function runSimulation(config: SimConfig): SimReport {
  const { classes, targetDungeonId, maxRuns, enhanceTarget, goldSpendRatio } = config

  let party = classes.map((cls, i) => makeChar(cls, i))
  let inventory = [...STARTER_EQUIPMENT]
  let gold = 0
  party = assignEquipment(party, inventory)

  const dungeons = targetDungeonId === 'all'
    ? DUNGEONS
    : DUNGEONS.filter(d => d.id === targetDungeonId)

  let totalMinutes = 0
  const dungeonResults: SimDungeonResult[] = []

  for (const dungeon of dungeons) {
    const entryLevels = party.map(c => c.level)
    const runs: SimRunDetail[] = []
    let cleared = false

    for (let runNum = 1; runNum <= maxRuns; runNum++) {
      totalMinutes += dungeon.floors
      const result = simulateRun(party, dungeon.id, dungeon.floors, dungeon.difficulty)

      party = party.map(c => applyExperience(c, result.expGained))
      gold += result.goldGained
      inventory = [...inventory, ...result.drops]
      party = assignEquipment(party, inventory)

      let enhLog = ''
      if (gold > 0) {
        const er = runEnhancement(party, inventory, gold, enhanceTarget, goldSpendRatio)
        party = er.party; inventory = er.inventory; gold -= er.goldSpent
        if (er.goldSpent > 0) enhLog = `強化${er.goldSpent}Z${er.breakCount > 0 ? ` 破損${er.breakCount}` : ''}`
      }

      runs.push({
        run: runNum,
        victory: result.victory,
        floorsCleared: result.floorsCleared,
        totalFloors: dungeon.floors,
        deathFloor: result.deathFloor,
        expGained: result.expGained,
        goldGained: result.goldGained,
        drops: result.drops.length,
        hpPct: result.finalHpPct,
        levelsAfter: party.map(c => c.level),
        enhLog,
      })

      if (result.victory) { cleared = true; break }
    }

    const exitLevels = party.map(c => c.level)
    dungeonResults.push({
      dungeonId: dungeon.id,
      dungeonName: dungeon.name,
      floors: dungeon.floors,
      difficulty: dungeon.difficulty,
      recommendedLevel: dungeon.recommendedLevel,
      cleared,
      runsNeeded: runs.length,
      entryLevels,
      exitLevels,
      estimatedMinutes: runs.length * dungeon.floors,
      runs,
    })

    if (!cleared) break
  }

  // 最終パーティ情報
  const finalParty: SimMemberResult[] = party.map(c => {
    const skills = getLearnedSkills(c.class, c.level)
    const equipment = (['weapon', 'armor', 'accessory'] as EquipmentSlot[]).flatMap(slot => {
      const e = c.equipment[slot]
      return e ? [{ slot, name: e.name, enhancement: e.enhancement ?? 0 }] : []
    })
    return {
      name: c.name, classLabel: CLASS_LABEL[c.class] ?? c.class, charClass: c.class,
      level: c.level, atk: c.attack, def: c.defense, hp: c.maxHp, spd: c.speed,
      equipment,
      skills: skills.map(s => ({ name: s.name, type: s.type, level: 0 })),
    }
  })

  // スキル自動発動の説明
  const skillsNote = party.map(c =>
    `${c.name}(${CLASS_LABEL[c.class]} Lv${c.level}): ${
      getLearnedSkills(c.class, c.level).map(s => s.name).join(' / ')
    }`
  ).join('\n')

  return { config, dungeons: dungeonResults, totalMinutes, finalParty, goldFinal: gold, skillsNote }
}
