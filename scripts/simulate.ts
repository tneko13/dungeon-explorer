// scripts/simulate.ts
// ヘッドレス進行シミュレーター v2（装備強化対応）
// Run: npx tsx scripts/simulate.ts

import { STARTER_CHARACTERS } from '../src/game/party/CharacterData'
import { DUNGEONS } from '../src/game/dungeon/DungeonData'
import { generateFloorPlan } from '../src/game/dungeon/FloorGenerator'
import { createCombatState, stepCombat } from '../src/game/combat/CombatEngine'
import { applyExperience, calcMaxStats } from '../src/game/CharacterEngine'
import {
  STARTER_EQUIPMENT, pickEquipment, canEquip, getEnhancedStats,
  ENHANCE_RATES, ENHANCE_COSTS, ENHANCE_BREAK_CHANCE, ENHANCE_MAX,
} from '../src/game/equipment/EquipmentData'
import { CLASS_LABEL } from '../src/game/party/CharacterData'
import type { Character, Equipment, EquipmentSlot, Stance } from '../src/types'

// ============================================================
// 設定
// ============================================================
const COMBAT_STEP_MS    = 5_000   // tick幅
const COMBAT_TIMEOUT_MS = 600_000 // 10分タイムアウト
const DROP_CHANCE       = 0.25    // 戦闘フロアのドロップ率
const MP_RECOVERY_FLOOR = 0.12    // フロア間MP回復率
const MAX_RUNS          = 30      // 最大周回数/ダンジョン
const ENHANCE_TARGET    = 8       // 強化目標値（+8まで目指す）
const GOLD_SPEND_RATIO  = 0.70    // 所持金のうち強化に使う割合

// ============================================================
// 装備スコア
// ============================================================
function equipScore(item: Equipment): number {
  const s = getEnhancedStats(item)
  return s.attackBonus * 2.0 + s.defenseBonus * 1.5 + s.hpBonus * 0.08 + (s.speedBonus ?? 0) * 0.4
}

function assignEquipment(chars: Character[], allItems: Equipment[]): Character[] {
  const assigned = new Set<string>()
  const result: Character[] = chars.map(c => ({ ...c, equipment: { ...c.equipment } }))

  for (const slot of ['weapon', 'armor', 'accessory'] as EquipmentSlot[]) {
    const pairs: { ci: number; item: Equipment; score: number }[] = []
    for (let ci = 0; ci < chars.length; ci++) {
      for (const item of allItems) {
        if (item.slot !== slot || !canEquip(item, chars[ci].class)) continue
        pairs.push({ ci, item, score: equipScore(item) })
      }
    }
    pairs.sort((a, b) => b.score - a.score)
    const done = new Set<number>()
    for (const { ci, item } of pairs) {
      if (done.has(ci) || assigned.has(item.id)) continue
      result[ci] = { ...result[ci], equipment: { ...result[ci].equipment, [slot]: item } }
      assigned.add(item.id)
      done.add(ci)
    }
  }
  return result.map(c => { const s = calcMaxStats(c); return { ...c, ...s, hp: s.maxHp, mp: s.maxMp } })
}

// ============================================================
// 装備強化（強化後のアイテムをインベントリと装備両方に反映）
// ============================================================
interface EnhanceResult { party: Character[]; inventory: Equipment[]; goldSpent: number; breakCount: number }

function runEnhancement(
  party: Character[],
  inventory: Equipment[],
  availableGold: number,
): EnhanceResult {
  let budget = Math.floor(availableGold * GOLD_SPEND_RATIO)
  let goldSpent = 0
  let breakCount = 0
  let inv = [...inventory]
  const updatedParty = party.map(c => ({ ...c, equipment: { ...c.equipment } }))

  // 武器→防具→アクセサリの順で全員分を強化
  for (const slot of ['weapon', 'armor', 'accessory'] as EquipmentSlot[]) {
    for (let ci = 0; ci < updatedParty.length; ci++) {
      let item = updatedParty[ci].equipment[slot]
      if (!item) continue

      // 強化ループ（予算がある間 & 目標に達するまで）
      while (budget > 0) {
        const cur = item.enhancement ?? 0
        if (cur >= ENHANCE_TARGET || cur >= ENHANCE_MAX) break
        const cost = ENHANCE_COSTS[cur]
        if (budget < cost) break

        budget -= cost
        goldSpent += cost

        const rate = ENHANCE_RATES[cur] / 100
        if (Math.random() < rate) {
          // 成功
          item = { ...item, enhancement: cur + 1 }
        } else if (Math.random() < ENHANCE_BREAK_CHANCE) {
          // 破壊
          breakCount++
          inv = inv.filter(i => i.id !== item!.id)
          const newEquip = { ...updatedParty[ci].equipment }
          delete newEquip[slot]
          updatedParty[ci] = { ...updatedParty[ci], equipment: newEquip }
          item = undefined as any
          break
        }
        // 失敗（破壊なし）: 次の試みへ
      }

      if (item) {
        // インベントリ内の同IDアイテムを更新
        const idx = inv.findIndex(i => i.id === item!.id)
        if (idx >= 0) inv[idx] = item
        updatedParty[ci] = { ...updatedParty[ci], equipment: { ...updatedParty[ci].equipment, [slot]: item } }
      }
    }
  }

  // 強化後にステータス再計算
  const finalParty = updatedParty.map(c => { const s = calcMaxStats(c); return { ...c, ...s, hp: s.maxHp, mp: s.maxMp } })
  return { party: finalParty, inventory: inv, goldSpent, breakCount }
}

// ============================================================
// 1回の探索
// ============================================================
interface RunResult {
  victory: boolean; floorsCleared: number; finalHpPct: number[]
  expGained: number; goldGained: number; drops: Equipment[]
  deathFloor?: number
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
        partyHp = partyHp.map((h, i) => Math.min(party[i].maxHp, Math.round(h + party[i].maxHp * 0.40)))
      else if (floor.eventType === 'rest') {
        partyHp = partyHp.map((h, i) => Math.min(party[i].maxHp, Math.round(h + party[i].maxHp * 0.50)))
        partyMp = partyMp.map((m, i) => Math.min(party[i].maxMp, Math.round(m + party[i].maxMp * 0.50)))
      } else if (floor.eventType === 'treasure' || floor.eventType === 'merchant') {
        const item = pickEquipment(difficulty)
        if (item) drops.push(item)
      } else if (floor.eventType === 'trap') {
        partyHp = partyHp.map((h, i) => h > 0 ? Math.max(1, h - Math.floor(party[i].maxHp * 0.15)) : h)
      }
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
      return { victory: false, floorsCleared, finalHpPct: partyHp.map((h, i) => Math.round(h / party[i].maxHp * 100)), expGained: exp, goldGained: gold, drops, deathFloor: floor.floorNumber }

    floorsCleared++
    if (Math.random() < DROP_CHANCE) { const item = pickEquipment(difficulty); if (item) drops.push(item) }
    partyMp = partyMp.map((m, i) => Math.min(party[i].maxMp, Math.round(m + party[i].maxMp * MP_RECOVERY_FLOOR)))
  }

  return { victory: !partyHp.every(h => h <= 0), floorsCleared, finalHpPct: partyHp.map((h, i) => Math.max(0, Math.round(h / party[i].maxHp * 100))), expGained: exp, goldGained: gold, drops }
}

// ============================================================
// メイン
// ============================================================
const LINE = '─'.repeat(64)

function enhanceSummary(party: Character[]): string {
  return party.map(c => {
    const slots = ['weapon', 'armor', 'accessory'] as EquipmentSlot[]
    return slots.map(s => { const e = c.equipment[s]; return e?.enhancement ? `${e.name}+${e.enhancement}` : null })
      .filter(Boolean).join('/')
  }).filter(Boolean).join('  |  ')
}

function partyStatLine(party: Character[]): string {
  const avg = (fn: (c:Character) => number) => Math.round(party.reduce((s,c) => s+fn(c), 0) / party.length)
  return `ATK avg:${avg(c=>c.attack)}  DEF avg:${avg(c=>c.defense)}  HP avg:${avg(c=>c.maxHp)}`
}

function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log('║   ダンジョン探索 バランスシミュレーション（装備強化あり）    ║')
  console.log('╚══════════════════════════════════════════════════════════════╝\n')

  let party     = STARTER_CHARACTERS.slice(0, 4)
  let inventory = [...STARTER_EQUIPMENT]
  let gold      = 0
  party = assignEquipment(party, inventory)

  console.log('【初期パーティ】')
  party.forEach(c => {
    const equips = (['weapon','armor','accessory'] as EquipmentSlot[]).map(s => c.equipment[s]?.name).filter(Boolean).join(', ')
    console.log(`  ${c.name}(${CLASS_LABEL[c.class]} Lv${c.level})  ATK:${c.attack} DEF:${c.defense} HP:${c.maxHp}  装備:[${equips || 'なし'}]`)
  })
  console.log('')

  let totalTimeMs = 0
  const summary: string[] = []

  for (const dungeon of DUNGEONS) {
    const runTimeMs = dungeon.floors * 60_000
    const lvLine = party.map(c => `${c.name}:Lv${c.level}`).join(' ')

    console.log(LINE)
    console.log(`【${dungeon.name}】  ${dungeon.floors}階 / 難易度:${dungeon.difficulty} / 推奨Lv:${dungeon.recommendedLevel}`)
    console.log(`  入場時 — ${lvLine}`)
    console.log(`         — ${partyStatLine(party)}`)
    const enh = enhanceSummary(party)
    if (enh) console.log(`         — 強化済み: ${enh}`)

    let cleared = false, dungeonTotalMs = 0

    for (let run = 1; run <= MAX_RUNS; run++) {
      dungeonTotalMs += runTimeMs
      totalTimeMs    += runTimeMs

      const lvBefore = party.map(c => c.level)
      const result   = simulateRun(party, dungeon.id, dungeon.floors, dungeon.difficulty)

      // 経験値適用
      party = party.map(c => applyExperience(c, result.expGained))
      gold += result.goldGained

      // 装備取得・最適配分
      inventory = [...inventory, ...result.drops]
      party = assignEquipment(party, inventory)

      // 装備強化（所持金の一部を使用）
      let enhLog = ''
      if (gold > 0) {
        const enhResult = runEnhancement(party, inventory, gold)
        party     = enhResult.party
        inventory = enhResult.inventory
        gold     -= enhResult.goldSpent
        if (enhResult.goldSpent > 0 || enhResult.breakCount > 0) {
          enhLog = `  強化: ${enhResult.goldSpent}Z使用${enhResult.breakCount > 0 ? ` 破損${enhResult.breakCount}件` : ''}`
        }
      }

      const lvAfter  = party.map(c => c.level)
      const lvUps    = party.map((c,i) => lvAfter[i] > lvBefore[i] ? `${c.name}:${lvBefore[i]}→${lvAfter[i]}` : '').filter(Boolean)
      const hpStr    = result.finalHpPct.map(p => `${String(p).padStart(3)}%`).join(' ')
      const visible  = run <= 5 || run % 5 === 0 || result.victory

      if (visible) {
        if (result.victory) {
          console.log(`  Run${String(run).padStart(2)}: ✓クリア  HP残:[${hpStr}]  EXP:${result.expGained}  Gold:${result.goldGained}  Drop:${result.drops.length}件`)
        } else {
          console.log(`  Run${String(run).padStart(2)}: ✗ ${result.deathFloor}F全滅  (${result.floorsCleared}/${dungeon.floors}階)  HP残:[${hpStr}]  EXP:${result.expGained}`)
        }
        if (lvUps.length)  console.log(`         LV↑ ${lvUps.join('  ')}`)
        if (enhLog)        console.log(`        ${enhLog}  所持金:${gold}Z`)
      }

      if (result.victory) { cleared = true; break }
    }

    if (!cleared) console.log(`  ⚠ ${MAX_RUNS}回試行もクリア不可`)

    const mins = Math.round(dungeonTotalMs / 60_000)
    console.log(`\n  → ${cleared ? 'クリア✓' : '未クリア✗'}  ${mins}分放置相当  クリア後: ${partyStatLine(party)}`)
    console.log(`     強化状況: ${enhanceSummary(party) || 'なし'}`)

    summary.push(`${dungeon.name.padEnd(14)} 難易度:${dungeon.difficulty}  推奨:Lv${String(dungeon.recommendedLevel).padStart(2)}  ${cleared?'✓':'✗'}  Lv avg:${Math.round(party.reduce((s,c)=>s+c.level,0)/party.length)}  ${cleared?'':'(未クリア)'}`)
    if (!cleared) break
    console.log('')
  }

  console.log(LINE)
  console.log('\n【サマリー】')
  summary.forEach(r => console.log('  '+r))
  const h = (totalTimeMs/3_600_000).toFixed(1)
  console.log(`\n  総放置時間: 約${Math.round(totalTimeMs/60_000)}分 (${h}時間)`)
  console.log(`  最終所持金: ${gold}Z`)
  console.log('\n  最終パーティ:')
  party.forEach(c => {
    const equips = (['weapon','armor','accessory'] as EquipmentSlot[]).map(s => {
      const e = c.equipment[s]; return e ? `${e.name}${e.enhancement?'+'+e.enhancement:''}` : ''
    }).filter(Boolean).join(', ')
    console.log(`    ${c.name}(${CLASS_LABEL[c.class]} Lv${c.level})  ATK:${c.attack}  DEF:${c.defense}  HP:${c.maxHp}  [${equips}]`)
  })

  // ---- 数値分析 ----
  console.log('\n' + LINE)
  console.log('【バランス分析：混沌の試練の問題点】')
  console.log('  通常敵の防御力: 350〜700')
  console.log(`  Lv99+最強装備のATK上限（魔法使い +10混沌の杖）:`)
  const mage = party.find(c => c.class === 'mage') ?? party[1]
  console.log(`    ${mage.name} ATK:${mage.attack}`)
  console.log(`    vs 防御700の敵: ${Math.max(1, mage.attack - 700)} ダメージ/攻撃（実質0〜1ダメ）`)
  console.log(`    vs 防御500の敵: ${Math.max(1, mage.attack - 500)} ダメージ/攻撃`)
  console.log('  → 敵の防御力が高すぎてダメージが通らないのが根本原因')
  console.log('')
  console.log('  ボス（混沌神）: DEF 1500, HP 500,000')
  console.log(`    ${mage.name} ATK ${mage.attack} vs DEF 1500: ${Math.max(1, mage.attack-1500)} ダメージ → ボスは実質無敵`)
  console.log('')
  console.log('  【推奨修正値（chaos_trialの敵）】')
  console.log('  通常敵:  ATK 1000〜1400 → 400〜600  DEF 350〜700 → 80〜150  HP 10000〜18000 → 5000〜10000')
  console.log('  混沌神:  ATK 3500 → 1200  DEF 1500 → 300  HP 500,000 → 80,000')
}

main()
