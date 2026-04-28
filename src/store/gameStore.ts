import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  GameState, PartySet, PartySetMember, Character, EquipmentSlot,
  Stance, ExpeditionLog, Equipment, FloorPlan, DungeonStatus, ExpeditionResult, MemberExpResult,
  PendingCombatMod, Enemy,
} from '../types'
import { STARTER_CHARACTERS, CLASS_UNLOCK_CHARACTERS } from '../game/party/CharacterData'
import { DUNGEONS, DUNGEON_MAP, UNLOCK_NEXT, UNLOCK_CLASSES } from '../game/dungeon/DungeonData'
import { generateFloorPlan } from '../game/dungeon/FloorGenerator'
import { applyExperience, calcMaxStats } from '../game/CharacterEngine'
import {
  pickEquipment, STARTER_EQUIPMENT, getMerchantPool,
  ENHANCE_RATES, ENHANCE_COSTS, ENHANCE_BREAK_CHANCE, ENHANCE_MAX,
} from '../game/equipment/EquipmentData'
import { getLearnedSkills } from '../game/skills/SkillMasterData'
import {
  createCombatState, stepCombat, applySkill, recoverMpBetweenFloors,
  STANCE_MODIFIERS, STANCE_COOLDOWN_ACTIONS,
} from '../game/combat/CombatEngine'
import { getStoryByDungeon } from '../game/story/StoryData'
import { checkNewTitles } from '../game/titles/TitleData'
const EQUIPMENT_CAP = 300

// ============================================================
// セーブデータ整合性チェック
// ============================================================

function fnv1a(str: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}

// UTF-8 対応 Base64 エンコード（難読化用）
function encodePayload(s: string): string {
  const bytes = new TextEncoder().encode(s)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

function decodePayload(s: string): string {
  const binary = atob(s)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

const SAVE_KEY = 'dungeon-explorer-save'

// createJSONStorage が JSON パース/文字列化を担当し、その内側でチェックサムを管理する
const secureRawStorage = {
  getItem: (name: string): string | null => {
    try {
      const raw = localStorage.getItem(name)
      if (!raw) return null
      const outer = JSON.parse(raw)
      if (outer.payload === undefined) return raw  // 旧フォーマット（チェックサムなし）をそのまま
      if (fnv1a(outer.payload) !== outer.checksum) {
        console.warn('[DE] セーブデータの改ざんを検出 — リセットします')
        return null
      }
      // Base64 デコードを試みる（旧フォーマット＝平文 JSON にも対応）
      try {
        const decoded = decodePayload(outer.payload)
        JSON.parse(decoded)
        return decoded
      } catch {
        return outer.payload
      }
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    const encoded = encodePayload(value)
    localStorage.setItem(name, JSON.stringify({ payload: encoded, checksum: fnv1a(encoded) }))
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name)
  },
}

// ============================================================
// セーブデータ エクスポート / インポート
// ============================================================
export function exportSaveData(): string | null {
  return localStorage.getItem(SAVE_KEY)
}

export function importSaveData(data: string): boolean {
  try {
    const outer = JSON.parse(data)
    if (!outer.payload || !outer.checksum) return false
    if (fnv1a(outer.payload) !== outer.checksum) return false
    // ペイロードが正常にデコード＆パースできるか検証
    const decoded = decodePayload(outer.payload)
    JSON.parse(decoded)
    localStorage.setItem(SAVE_KEY, data)
    return true
  } catch {
    return false
  }
}
const secureStorage = createJSONStorage(() => secureRawStorage)

function sanitizeCharacter(c: Character): Character {
  const maxHp = Math.max(1, c.maxHp ?? 1)
  const maxMp = Math.max(0, c.maxMp ?? 0)
  const clampEnhance = (e: Equipment | undefined) =>
    e ? { ...e, enhancement: Math.max(0, Math.min(ENHANCE_MAX, e.enhancement ?? 0)) } : undefined
  return {
    ...c,
    level: Math.max(1, Math.min(99, c.level ?? 1)),
    hp: Math.max(0, Math.min(maxHp, c.hp ?? maxHp)),
    mp: Math.max(0, Math.min(maxMp, c.mp ?? maxMp)),
    equipment: {
      weapon:    clampEnhance(c.equipment?.weapon),
      armor:     clampEnhance(c.equipment?.armor),
      accessory: clampEnhance(c.equipment?.accessory),
    },
  }
}

function sanitizeState(s: GameState): GameState {
  const MAX_GOLD = 999_999_999
  return {
    ...s,
    resources: { ...s.resources, gold: Math.max(0, Math.min(MAX_GOLD, s.resources?.gold ?? 0)) },
    roster: (s.roster ?? []).map(sanitizeCharacter),
    party: { ...s.party, members: (s.party?.members ?? []).map(sanitizeCharacter) },
    ownedEquipment: (s.ownedEquipment ?? [])
      .map((e) => ({ ...e, enhancement: Math.max(0, Math.min(ENHANCE_MAX, e.enhancement ?? 0)) }))
      .slice(0, EQUIPMENT_CAP),
    expedition: s.expedition ? {
      ...s.expedition,
      currentFloor: Math.max(1, s.expedition.currentFloor ?? 1),
      accumulatedGold: Math.max(0, s.expedition.accumulatedGold ?? 0),
      accumulatedExp:  Math.max(0, s.expedition.accumulatedExp  ?? 0),
      log: (s.expedition.log ?? []).filter((e) => typeof e.message === 'string'),
      pendingCombatMods: s.expedition.pendingCombatMods ?? [],
    } : null,
    defeatedEnemyIds: s.defeatedEnemyIds ?? [],
    debugViewAllEnemies: s.debugViewAllEnemies ?? false,
    unlockedTitles: s.unlockedTitles ?? [],
    newlyUnlockedTitles: s.newlyUnlockedTitles ?? [],
    clearedDungeons: s.clearedDungeons ?? [],
    wipeCount: Math.max(0, s.wipeCount ?? 0),
    retreatCount: Math.max(0, s.retreatCount ?? 0),
    totalExpeditions: Math.max(0, s.totalExpeditions ?? 0),
    totalClears: Math.max(0, s.totalClears ?? 0),
    totalGoldEarned: Math.max(0, s.totalGoldEarned ?? 0),
    viewedStoryIds: s.viewedStoryIds ?? [],
    pendingStoryId: s.pendingStoryId ?? null,
    notifEnabled: s.notifEnabled ?? true,
    battleSpeed: ([1, 2, 3].includes(s.battleSpeed as number) ? s.battleSpeed : 1) as 1 | 2 | 3,
  }
}

const MAX_OFFLINE_MS = 8 * 60 * 60 * 1000  // 最大8時間分の放置進行

const INITIAL_STATE: GameState = {
  version: 1,
  lastSavedAt: 0,
  resources: { gold: 0, materials: {} },
  party: {
    members: STARTER_CHARACTERS.slice(0, 4),
  },
  roster: STARTER_CHARACTERS,
  ownedEquipment: STARTER_EQUIPMENT,
  discoveredEquipmentIds: STARTER_EQUIPMENT.map((e) => e.id),
  defeatedEnemyIds: [],
  unlockedDungeons: DUNGEONS.filter((d) => d.unlockedByDefault).map((d) => d.id),
  debugViewAllEnemies: false,
  unlockedClasses: ['warrior', 'mage', 'rogue', 'priest', 'ranger'],
  expedition: null,
  expeditionResult: null,
  partySets: [null, null, null],
  unlockedTitles: [],
  newlyUnlockedTitles: [],
  clearedDungeons: [],
  wipeCount: 0,
  retreatCount: 0,
  totalExpeditions: 0,
  totalClears: 0,
  totalGoldEarned: 0,
  viewedStoryIds: [],
  pendingStoryId: null,
  notifEnabled: true,
  battleSpeed: 1,
}

interface GameStore extends GameState {
  startExpedition: (dungeonId: string) => void
  finishExpedition: () => void
  clearResult: () => void
  dismissTitleNotification: () => void
  manualRetreat: () => void
  tick: () => void
  resetGame: () => void
  savePartySet: (index: number, name: string, members: PartySetMember[]) => void
  activatePartySet: (index: number) => void
  clearPartySet: (index: number) => void
  equipItem: (characterId: string, itemId: string) => void
  unequipItem: (characterId: string, slot: EquipmentSlot) => void
  togglePartyMember: (characterId: string) => void
  setActiveSkills: (characterId: string, skillIds: string[]) => void
  setCharacterStance: (characterId: string, stance: Stance) => void
  triggerSkill: (memberIdx: number, skillSlotIdx: number) => void
  setTarget: (enemyIdx: number) => void
  enhanceEquipment: (equipmentId: string) => { result: 'success' | 'fail' | 'broken' | 'max' | 'no_gold'; newTitleIds: string[] }
  showTitleNotification: (ids: string[]) => void
  sellEquipment: (equipmentId: string) => number
  toggleDebugViewAllEnemies: () => void
  debugAddSummon: () => void
  markStoryViewed: (chapterId: string) => void
  setPendingStory: (chapterId: string | null) => void
  goToTitle: () => void
  setBattleSpeed: (speed: 1 | 2 | 3) => void
  setNotifEnabled: (v: boolean) => void
}

// ============================================================
// ミミック生成（パーティ平均レベル基準）
// ============================================================
function generateMimic(avgLevel: number): Enemy {
  const hp = Math.floor(avgLevel * 10 + 30)
  return {
    id: 'mimic',
    name: 'ミミック',
    hp, maxHp: hp,
    attack: Math.floor(avgLevel * 1.5 + 5),
    defense: Math.floor(avgLevel * 0.8 + 2),
    expReward: Math.floor(avgLevel * 4),
    goldReward: Math.floor(avgLevel * 6),
    isBoss: false,
  }
}

// ============================================================
// イベントフロア処理
// ============================================================
type EventResult = {
  partyHp: number[]
  partyMp: number[]
  droppedItem: Equipment | null
  gold: number
  log: ExpeditionLog[]
  pendingMods: PendingCombatMod[]
  mimicEnemy: Enemy | null  // null でなければ戦闘を起動
}

function processEventFloor(
  floor: FloorPlan,
  partyHp: number[],
  partyMp: number[],
  party: Character[],
  dungeon: { difficulty: number },
  currentGold: number,
): EventResult {
  const hp = [...partyHp]
  const mp = [...partyMp]
  const now = Date.now()
  const log: ExpeditionLog[] = []
  const pendingMods: PendingCombatMod[] = []
  const classes = party.map((m) => m.class)

  const hasTrapDetector = classes.some((c) => c === 'rogue' || c === 'assassin')
  const hasHolyClass    = classes.some((c) => c === 'priest' || c === 'paladin' || c === 'monk' || c === 'druid')
  const hasDarkClass    = classes.some((c) => c === 'dark_knight' || c === 'necromancer' || c === 'witch')
  const hasMageClass    = classes.some((c) => c === 'sage' || c === 'wizard' || c === 'enchanter')
  const hasMimicDetect  = classes.some((c) => c === 'rogue' || c === 'assassin' || c === 'ranger')
  const hasCurseBreaker = classes.some((c) => c === 'priest' || c === 'paladin' || c === 'monk')
  const hasConfusionDodge = classes.some((c) => c === 'ranger' || c === 'bard')

  // --- 罠 ---
  if (floor.eventType === 'trap') {
    if (hasTrapDetector) {
      log.push({ timestamp: now, message: '罠を察知して迂回した！', type: 'event' })
    } else {
      const pct = 0.10 + Math.random() * 0.15
      for (let i = 0; i < party.length; i++) {
        hp[i] = Math.max(1, Math.floor(hp[i] - party[i].maxHp * pct))
      }
      log.push({ timestamp: now, message: '罠にかかった！パーティ全体がダメージを受けた', type: 'event' })
    }

  // --- 回復の泉 ---
  } else if (floor.eventType === 'spring') {
    const mul = hasHolyClass ? 1.5 : hasDarkClass ? 0.5 : 1.0
    const hpPct = (0.20 + Math.random() * 0.20) * mul
    const mpPct = (0.30 + Math.random() * 0.20) * mul
    for (let i = 0; i < party.length; i++) {
      hp[i] = Math.min(party[i].maxHp, Math.floor(hp[i] + party[i].maxHp * hpPct))
      mp[i] = Math.min(party[i].maxMp, Math.floor(mp[i] + party[i].maxMp * mpPct))
    }
    const bonus = hasHolyClass ? '（聖職者の加護で効果UP）' : hasDarkClass ? '（闇の気配で効果DOWN）' : ''
    log.push({ timestamp: now, message: `回復の泉を発見！HPとMPが回復した${bonus}`, type: 'event' })

  // --- 宝箱（ミミック判定含む）---
  } else if (floor.eventType === 'treasure') {
    const isMimic = Math.random() < 0.25
    if (isMimic) {
      if (hasMimicDetect) {
        log.push({ timestamp: now, message: '宝箱が怪しい…見破った！中身を安全に回収', type: 'event' })
        // 通常宝箱として処理
        const item = pickEquipment(dungeon.difficulty, false)
        if (item) {
          log.push({ timestamp: now, message: `宝箱から${item.name}を入手！`, type: 'reward' })
          return { partyHp: hp, partyMp: mp, droppedItem: item, gold: 0, log, pendingMods, mimicEnemy: null }
        }
        const gold = dungeon.difficulty * 15 + Math.floor(Math.random() * 20)
        log.push({ timestamp: now, message: `宝箱を発見！${gold} Zelを入手`, type: 'reward' })
        return { partyHp: hp, partyMp: mp, droppedItem: null, gold, log, pendingMods, mimicEnemy: null }
      } else {
        log.push({ timestamp: now, message: '宝箱が突然動き出した！ミミックだ！', type: 'event' })
        const avgLevel = Math.max(1, Math.round(party.reduce((s, m) => s + m.level, 0) / party.length))
        return { partyHp: hp, partyMp: mp, droppedItem: null, gold: 0, log, pendingMods, mimicEnemy: generateMimic(avgLevel) }
      }
    }
    if (Math.random() < 0.30) {
      const item = pickEquipment(dungeon.difficulty, false)
      if (item) {
        log.push({ timestamp: now, message: `宝箱から${item.name}を入手！`, type: 'reward' })
        return { partyHp: hp, partyMp: mp, droppedItem: item, gold: 0, log, pendingMods, mimicEnemy: null }
      }
    }
    const gold = dungeon.difficulty * 15 + Math.floor(Math.random() * 20)
    log.push({ timestamp: now, message: `宝箱を発見！${gold} Zelを入手`, type: 'reward' })
    return { partyHp: hp, partyMp: mp, droppedItem: null, gold, log, pendingMods, mimicEnemy: null }

  // --- 祠 ---
  } else if (floor.eventType === 'shrine') {
    const randomIdx = Math.floor(Math.random() * party.length)
    pendingMods.push({ type: 'shrine', memberIdx: randomIdx })
    log.push({ timestamp: now, message: `祠を発見！${party[randomIdx].name}に加護が宿った（次の戦闘 被ダメ-20%）`, type: 'event' })
    // プリースト・パラディンがいれば本人も加護
    party.forEach((m, i) => {
      if (i !== randomIdx && (m.class === 'priest' || m.class === 'paladin')) {
        pendingMods.push({ type: 'shrine', memberIdx: i })
        log.push({ timestamp: now, message: `${m.name}にも神の加護が降り注いだ！`, type: 'event' })
      }
    })

  // --- 野営地 ---
  } else if (floor.eventType === 'rest') {
    for (let i = 0; i < party.length; i++) {
      hp[i] = party[i].maxHp
      mp[i] = party[i].maxMp
    }
    log.push({ timestamp: now, message: '野営地を発見！HP・MPが全快した', type: 'event' })

  // --- 行商人 ---
  } else if (floor.eventType === 'merchant') {
    const pool = getMerchantPool(dungeon.difficulty)
    if (pool.length > 0 && currentGold > 0) {
      const base = pool[Math.floor(Math.random() * pool.length)]
      const price = Math.max(1, Math.floor(currentGold * 0.2))
      const instanceId = `${base.id}_merch_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
      const item: Equipment = { ...base, id: instanceId, baseId: base.id }
      log.push({ timestamp: now, message: `行商人から${item.name}を${price.toLocaleString()} Zelで購入した`, type: 'reward' })
      return { partyHp: hp, partyMp: mp, droppedItem: item, gold: -price, log, pendingMods, mimicEnemy: null }
    }
    log.push({ timestamp: now, message: '行商人が現れたが、Zelが足りなかった…', type: 'system' })

  // --- 呪いの間 ---
  } else if (floor.eventType === 'curse') {
    if (hasCurseBreaker) {
      log.push({ timestamp: now, message: '呪いの間！しかし聖職者が解呪した', type: 'event' })
    } else {
      pendingMods.push({ type: 'curse', memberIdx: null })
      log.push({ timestamp: now, message: '呪いの間！次の戦闘でパーティのATK・DEFが低下する', type: 'event' })
    }

  // --- 魔力喰い ---
  } else if (floor.eventType === 'mana_drain') {
    const drainPct = hasMageClass ? 0.20 : 0.40
    for (let i = 0; i < party.length; i++) {
      mp[i] = Math.max(0, Math.floor(mp[i] - party[i].maxMp * drainPct))
    }
    const note = hasMageClass ? '（魔法使いが被害を軽減）' : ''
    log.push({ timestamp: now, message: `魔力喰いの部屋！パーティのMPが吸われた${note}`, type: 'event' })

  // --- 混乱の霧 ---
  } else if (floor.eventType === 'confusion') {
    if (hasConfusionDodge) {
      log.push({ timestamp: now, message: '混乱の霧！しかし看破して回避した', type: 'event' })
    } else {
      pendingMods.push({ type: 'confusion', memberIdx: null })
      log.push({ timestamp: now, message: '混乱の霧！次の戦闘でパーティの速度が低下する', type: 'event' })
    }
  }

  return { partyHp: hp, partyMp: mp, droppedItem: null, gold: 0, log, pendingMods, mimicEnemy: null }
}

// ============================================================
// ストア
// ============================================================
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      startExpedition: (dungeonId: string) => {
        const { expedition, party } = get()
        if (expedition) return
        const dungeon = DUNGEON_MAP.get(dungeonId)
        if (!dungeon) return
        const now = Date.now()
        const floorPlan = generateFloorPlan(dungeonId, dungeon.floors)
        set({
          expedition: {
            dungeonId,
            startedAt: now,
            currentFloor: 1,
            status: 'exploring',
            floorPlan,
            partyHp: party.members.map((m) => m.hp),
            partyMp: party.members.map((m) => m.mp),
            partyStances: party.members.map((m) => m.stance),
            dungeonTimeLimitMs: dungeon.floors * 75 * 1000,
            activeCombat: null,
            floorClearPauseMs: 0,
            accumulatedGold: 0,
            accumulatedExp: 0,
            simulatedMs: 0,
            droppedItems: [],
            lastTickAt: now,
            log: [{ timestamp: now, message: `${dungeon.name}への探索を開始！`, type: 'system' }],
            pendingCombatMods: [],
          },
        })
      },

      finishExpedition: () => {
        const { expedition, party, resources, ownedEquipment, discoveredEquipmentIds, unlockedDungeons, unlockedClasses, clearedDungeons, wipeCount, retreatCount, totalExpeditions, totalClears, totalGoldEarned, unlockedTitles, viewedStoryIds } = get()
        if (!expedition || expedition.status === 'exploring') return

        const dungeon = DUNGEON_MAP.get(expedition.dungeonId)
        const isSuccess = expedition.status === 'complete' || expedition.status === 'retreated'
        const isFailed = expedition.status === 'failed'
        const isComplete = expedition.status === 'complete'

        let updatedRoster = get().roster
        let newOwnedEquipment = ownedEquipment
        let newDiscoveredIds = discoveredEquipmentIds
        let newUnlocked = unlockedDungeons
        let newUnlockedClasses = unlockedClasses
        let goldGained = 0
        let goldPenalty = 0
        const expPerMember = Math.floor(expedition.accumulatedExp / Math.max(party.members.length, 1))
        const memberResults: MemberExpResult[] = []

        // 全キャラHP/MP全回復 ＋ 経験値適用（全滅時も経験値は付与）
        updatedRoster = updatedRoster.map((r) => {
          const m = party.members.find((pm) => pm.id === r.id)
          const base = m ?? r
          const leveled = m ? applyExperience(m, expPerMember) : base
          const stats = calcMaxStats(leveled)
          if (m) {
            memberResults.push({ name: m.name, levelBefore: m.level, levelAfter: leveled.level, expGained: expPerMember })
          }
          return { ...leveled, ...stats, hp: stats.maxHp, mp: stats.maxMp }
        })

        if (isSuccess) {
          goldGained = expedition.accumulatedGold
          const combined = [...ownedEquipment, ...expedition.droppedItems]
          newOwnedEquipment = combined.slice(0, EQUIPMENT_CAP)
          newDiscoveredIds = [...new Set([...discoveredEquipmentIds, ...expedition.droppedItems.map((e) => e.baseId ?? e.id)])]
          if (expedition.status === 'complete' && dungeon) {
            const nextId = UNLOCK_NEXT[expedition.dungeonId]
            if (nextId && !unlockedDungeons.includes(nextId)) {
              newUnlocked = [...unlockedDungeons, nextId]
            }
            // クラス解放
            const newClasses = UNLOCK_CLASSES[expedition.dungeonId] ?? []
            const toUnlock = newClasses.filter((c) => !newUnlockedClasses.includes(c))
            if (toUnlock.length > 0) {
              newUnlockedClasses = [...newUnlockedClasses, ...toUnlock]
              // 新職業のキャラクターをロスターに追加
              const newChars = CLASS_UNLOCK_CHARACTERS[expedition.dungeonId] ?? []
              const existingIds = new Set(updatedRoster.map((r) => r.id))
              const charsToAdd = newChars.filter((c) => !existingIds.has(c.id))
              updatedRoster = [...updatedRoster, ...charsToAdd]
            }
          }
        }

        if (isFailed) {
          goldPenalty = Math.floor(resources.gold / 2)
        }

        const result: ExpeditionResult = {
          dungeonName: dungeon?.name ?? expedition.dungeonId,
          status: expedition.status,
          goldGained,
          goldPenalty,
          droppedItems: isSuccess ? expedition.droppedItems : [],
          memberResults,
        }

        const updatedPartyMembers = party.members.map((m) =>
          updatedRoster.find((r) => r.id === m.id) ?? m,
        )

        const newClearedDungeons = isComplete
          ? [...new Set([...clearedDungeons, expedition.dungeonId])]
          : clearedDungeons

        // ダンジョンクリア時にストーリーをpendingにセット（未読のみ）
        const storyChapter = isComplete ? getStoryByDungeon(expedition.dungeonId) : undefined
        const newPendingStory = storyChapter && !viewedStoryIds.includes(storyChapter.id)
          ? storyChapter.id
          : null
        const newWipeCount = isFailed ? wipeCount + 1 : wipeCount
        const newRetreatCount = expedition.status === 'retreated' ? retreatCount + 1 : retreatCount
        const newTotalExpeditions = totalExpeditions + 1
        const newTotalClears = isComplete ? totalClears + 1 : totalClears
        const newGold = Math.max(0, resources.gold + goldGained - goldPenalty)
        const newTotalGoldEarned = totalGoldEarned + goldGained

        const stateForTitleCheck = {
          ...get(),
          resources: { ...resources, gold: newGold },
          ownedEquipment: newOwnedEquipment,
          discoveredEquipmentIds: newDiscoveredIds,
          unlockedDungeons: newUnlocked,
          roster: updatedRoster,
          party: { ...party, members: updatedPartyMembers },
          clearedDungeons: newClearedDungeons,
          wipeCount: newWipeCount,
          retreatCount: newRetreatCount,
          totalExpeditions: newTotalExpeditions,
          totalClears: newTotalClears,
          totalGoldEarned: newTotalGoldEarned,
        }
        const newTitleIds = checkNewTitles(stateForTitleCheck)
        const newUnlockedTitles = newTitleIds.length > 0
          ? [...new Set([...unlockedTitles, ...newTitleIds])]
          : unlockedTitles

        set({
          expedition: null,
          expeditionResult: result,
          newlyUnlockedTitles: newTitleIds,
          resources: { ...resources, gold: newGold },
          ownedEquipment: newOwnedEquipment,
          discoveredEquipmentIds: newDiscoveredIds,
          unlockedDungeons: newUnlocked,
          unlockedClasses: newUnlockedClasses,
          party: { ...party, members: updatedPartyMembers },
          roster: updatedRoster,
          clearedDungeons: newClearedDungeons,
          wipeCount: newWipeCount,
          retreatCount: newRetreatCount,
          totalExpeditions: newTotalExpeditions,
          totalClears: newTotalClears,
          totalGoldEarned: newTotalGoldEarned,
          unlockedTitles: newUnlockedTitles,
          pendingStoryId: newPendingStory,
        })
      },

      clearResult: () => set({ expeditionResult: null }),

      dismissTitleNotification: () => set({ newlyUnlockedTitles: [] }),

      markStoryViewed: (chapterId) =>
        set((s) => ({ viewedStoryIds: [...new Set([...s.viewedStoryIds, chapterId])] })),

      setPendingStory: (chapterId) => set({ pendingStoryId: chapterId }),

      goToTitle: () => set({ expedition: null, expeditionResult: null }),

      setBattleSpeed: (speed) => {
        const { clearedDungeons } = get()
        const canDouble = clearedDungeons.includes('eternal_sanctum')
        const canTriple = clearedDungeons.includes('chaos_trial')
        const maxSpeed: 1 | 2 | 3 = canTriple ? 3 : canDouble ? 2 : 1
        set({ battleSpeed: Math.min(speed, maxSpeed) as 1 | 2 | 3 })
      },

      setNotifEnabled: (v) => set({ notifEnabled: v }),

      manualRetreat: () => {
        set((state) => ({
          expedition: state.expedition?.status === 'exploring'
            ? { ...state.expedition, status: 'retreated', log: [...state.expedition.log, { timestamp: Date.now(), message: '撤退を決意した…部分報酬で帰還できます', type: 'system' as const }] }
            : state.expedition,
        }))
      },

      tick: () => {
        const { expedition, party, resources, defeatedEnemyIds } = get()
        if (!expedition || expedition.status !== 'exploring') return

        const { battleSpeed = 1 } = get()
        const now = Date.now()
        const rawElapsed = Math.min(
          expedition.lastTickAt > 0 ? now - expedition.lastTickAt : 1000,
          MAX_OFFLINE_MS,
        )
        const elapsed = rawElapsed * battleSpeed

        let { currentFloor, partyHp, partyMp, partyStances, activeCombat,
          accumulatedGold, accumulatedExp, simulatedMs, droppedItems, floorPlan,
          pendingCombatMods } = expedition
        let floorClearPauseMs = expedition.floorClearPauseMs ?? 0

        const dungeon = DUNGEON_MAP.get(expedition.dungeonId)
        if (!dungeon) return

        let status: DungeonStatus = expedition.status
        const newLog: ExpeditionLog[] = []
        let remaining = elapsed
        let newDefeatedIds: string[] = []


        while (remaining > 0 && status === 'exploring') {
          if (activeCombat) {
            const floor = floorPlan[currentFloor - 1]
            const result = stepCombat(activeCombat, floor, party.members, partyHp, partyMp, partyStances, remaining)
            partyHp = result.partyHp
            partyMp = result.partyMp
            activeCombat = result.combat
            simulatedMs += result.consumedMs
            remaining -= result.consumedMs

            if (result.log.length > 0) {
              newLog.push(...result.log.slice(-3).map((entry) => ({ timestamp: now, message: entry.message, type: entry.type })))
            }

            if (result.done) {
              if (!result.victory) {
                status = 'failed'
                newLog.push({ timestamp: now, message: 'パーティが全滅した...探索失敗', type: 'system' })
                break
              }

              accumulatedGold += result.goldGained
              accumulatedExp += result.expGained
              activeCombat = null

              // Track defeated enemy base IDs for encyclopedia
              newDefeatedIds = [...newDefeatedIds, ...floor.enemies.map((e) => e.id.replace(/_\d+$|_guardian$/, ''))]

              // Equipment drop (5% normal / 30% boss)
              const isBossFloor = floor.type === 'boss'
              const dropChance = isBossFloor ? 0.30 : 0.05
              if (Math.random() < dropChance) {
                const item = pickEquipment(dungeon.difficulty, isBossFloor)
                if (item) {
                  droppedItems = [...droppedItems, item]
                  newLog.push({ timestamp: now, message: `${item.name}を入手！`, type: 'reward' })
                }
              }

              // Between-floor MP recovery
              partyMp = recoverMpBetweenFloors(partyMp, party.members, partyStances)
              // 2秒間ポーズしてから次フロアへ進む
              floorClearPauseMs = 2000
            }
          } else {
            // フロアクリア後の一呼吸
            if (floorClearPauseMs > 0) {
              const consume = Math.min(remaining, floorClearPauseMs)
              remaining -= consume
              floorClearPauseMs -= consume
              if (floorClearPauseMs > 0) continue
              // ポーズ終了: 次フロアへ
              currentFloor++
              if (currentFloor > floorPlan.length) {
                currentFloor = floorPlan.length
                status = 'complete'
                newLog.push({ timestamp: now, message: 'ダンジョンを踏破した！帰還できます', type: 'system' })
                break
              }
              newLog.push({ timestamp: now, message: `${currentFloor}階層へ進む`, type: 'system' })
            }

            const floor = floorPlan[currentFloor - 1]
            if (!floor) {
              status = 'complete'
              newLog.push({ timestamp: now, message: 'ダンジョンを踏破した！帰還できます', type: 'system' })
              break
            }

            if (floor.type === 'event') {
              {
                const result = processEventFloor(floor, partyHp, partyMp, party.members, dungeon, resources.gold + accumulatedGold)
                partyHp = result.partyHp
                partyMp = result.partyMp
                newLog.push(...result.log)

                if (result.mimicEnemy) {
                  // ミミック戦闘起動（currentFloor はインクリメントしない）
                  const mimicFloor = { ...floor, type: 'combat' as const, enemies: [result.mimicEnemy] }
                  activeCombat = createCombatState(mimicFloor, party.members, partyStances, pendingCombatMods)
                  pendingCombatMods = []
                  simulatedMs += 500
                  remaining -= 500
                } else {
                  if (result.droppedItem) droppedItems = [...droppedItems, result.droppedItem]
                  if (result.gold > 0) accumulatedGold += result.gold
                  if (result.gold < 0) accumulatedGold = Math.max(0, accumulatedGold + result.gold)
                  pendingCombatMods = [...pendingCombatMods, ...result.pendingMods]
                  currentFloor++
                  simulatedMs += 3000
                  remaining -= 3000
                }
              }

              if (currentFloor > floorPlan.length && !activeCombat) {
                currentFloor = floorPlan.length
                status = 'complete'
                newLog.push({ timestamp: now, message: 'ダンジョンを踏破した！帰還できます', type: 'system' })
                break
              }
            } else {
              activeCombat = createCombatState(floor, party.members, partyStances, pendingCombatMods)
              pendingCombatMods = []
              newLog.push({ timestamp: now, message: `${currentFloor}階層 — 戦闘開始！`, type: 'system' })
            }
          }
        }

        const finalLog = [...expedition.log, ...newLog].slice(-30)
        set({
          ...(newDefeatedIds.length > 0 ? { defeatedEnemyIds: [...new Set([...defeatedEnemyIds, ...newDefeatedIds])] } : {}),
          expedition: {
            ...expedition,
            currentFloor,
            partyHp,
            partyMp,
            activeCombat,
            floorClearPauseMs,
            accumulatedGold,
            accumulatedExp,
            simulatedMs,
            droppedItems,
            lastTickAt: now,
            status,
            log: finalLog,
            pendingCombatMods,
          },
        })
      },

      toggleDebugViewAllEnemies: () => set((s) => ({ debugViewAllEnemies: !s.debugViewAllEnemies })),

      debugAddSummon: () => set((s) => {
        const expedition = s.expedition
        if (!expedition?.activeCombat) return {}
        const SUMMON_PRESETS = [
          { id: 'knight',     name: '召喚：守護騎士',   maxHp: 300, attack: 60,  defense: 30, speed: 20 },
          { id: 'mage',       name: '召喚：魔法使い',   maxHp: 180, attack: 90,  defense: 10, speed: 26 },
          { id: 'priest',     name: '召喚：神官',       maxHp: 220, attack: 40,  defense: 20, speed: 22 },
          { id: 'berserker',  name: '召喚：狂戦士',     maxHp: 260, attack: 110, defense: 15, speed: 24 },
          { id: 'ranger',     name: '召喚：レンジャー', maxHp: 200, attack: 75,  defense: 12, speed: 30 },
        ]
        const existing = expedition.activeCombat.summons
        const preset = SUMMON_PRESETS[existing.length % SUMMON_PRESETS.length]
        const newSummon = {
          ...preset,
          instanceId: `summon_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          hp: preset.maxHp,
          summonedByMemberIdx: 0,
        }
        return {
          expedition: {
            ...expedition,
            activeCombat: {
              ...expedition.activeCombat,
              summons: [...existing, newSummon],
            },
          },
        }
      }),

      resetGame: () => set(INITIAL_STATE),

      equipItem: (characterId, itemId) => {
        const { roster, party, ownedEquipment, unlockedTitles } = get()
        const item = ownedEquipment.find((e) => e.id === itemId)
        if (!item) return
        const updateChars = (chars: Character[]) =>
          chars.map((c) => {
            if (c.id === characterId) {
              const newEquip = { ...c.equipment, [item.slot]: item }
              const stats = calcMaxStats({ ...c, equipment: newEquip })
              return { ...c, equipment: newEquip, ...stats, hp: stats.maxHp, mp: stats.maxMp }
            }
            if (c.equipment[item.slot]?.id === itemId) {
              const newEquip = { ...c.equipment }
              delete newEquip[item.slot]
              const stats = calcMaxStats({ ...c, equipment: newEquip })
              return { ...c, equipment: newEquip, ...stats, hp: stats.maxHp, mp: stats.maxMp }
            }
            return c
          })
        const newParty = { ...party, members: updateChars(party.members) }
        const newRoster = updateChars(roster)
        const newTitleIds = checkNewTitles({ ...get(), party: newParty, roster: newRoster })
        set({
          party: newParty,
          roster: newRoster,
          ...(newTitleIds.length > 0 ? {
            newlyUnlockedTitles: newTitleIds,
            unlockedTitles: [...new Set([...unlockedTitles, ...newTitleIds])],
          } : {}),
        })
      },

      unequipItem: (characterId, slot) => {
        const { roster, party } = get()
        const updateChars = (chars: Character[]) =>
          chars.map((c) => {
            if (c.id !== characterId) return c
            const newEquip = { ...c.equipment }
            delete newEquip[slot]
            const stats = calcMaxStats({ ...c, equipment: newEquip })
            return { ...c, equipment: newEquip, ...stats, hp: stats.maxHp, mp: stats.maxMp }
          })
        set({ party: { ...party, members: updateChars(party.members) }, roster: updateChars(roster) })
      },

      togglePartyMember: (characterId) => {
        const { roster, party } = get()
        const inParty = party.members.some((m) => m.id === characterId)
        const char = roster.find((c) => c.id === characterId)
        if (!char) return
        const members = inParty
          ? party.members.filter((m) => m.id !== characterId)
          : party.members.length < 4 ? [...party.members, char] : party.members
        set({ party: { ...party, members } })
      },

      setActiveSkills: (characterId, skillIds) => {
        const { roster, party } = get()
        const char = roster.find((c) => c.id === characterId)
        if (!char) return
        const allSkills = getLearnedSkills(char.class, char.level)
        const activeSkills = skillIds
          .slice(0, 3)
          .map((id) => allSkills.find((s) => s.id === id))
          .filter((s): s is NonNullable<typeof s> => s != null)
        const updateChars = (chars: Character[]) =>
          chars.map((c) => c.id === characterId ? { ...c, skills: activeSkills } : c)
        set({ party: { ...party, members: updateChars(party.members) }, roster: updateChars(roster) })
      },

      setCharacterStance: (characterId, stance) => {
        const { roster, party, expedition } = get()
        const updateChars = (chars: Character[]) =>
          chars.map((c) => c.id === characterId ? { ...c, stance } : c)
        const newPartyMembers = updateChars(party.members)
        if (expedition) {
          const memberIdx = party.members.findIndex((m) => m.id === characterId)
          const combat = expedition.activeCombat
          if (combat && (combat.stanceCooldowns?.[memberIdx] ?? 0) > 0) return
          const newStances = expedition.partyStances.map((s, i) => i === memberIdx ? stance : s)
          const newCombat = combat && memberIdx >= 0
            ? { ...combat, stanceCooldowns: combat.stanceCooldowns.map((c, i) => i === memberIdx ? STANCE_COOLDOWN_ACTIONS : c) }
            : combat
          set({
            party: { ...party, members: newPartyMembers },
            roster: updateChars(roster),
            expedition: { ...expedition, partyStances: newStances, activeCombat: newCombat },
          })
        } else {
          set({ party: { ...party, members: newPartyMembers }, roster: updateChars(roster) })
        }
      },

      triggerSkill: (memberIdx, skillSlotIdx) => {
        const { expedition, party } = get()
        if (!expedition?.activeCombat || expedition.status !== 'exploring') return
        const member = party.members[memberIdx]
        if (!member) return
        const skill = member.skills[skillSlotIdx]
        if (!skill) return
        const combat = expedition.activeCombat
        const cd = combat.skillCooldownMs[memberIdx]?.[skillSlotIdx] ?? 0
        if (cd > 0) return
        const mods = STANCE_MODIFIERS[expedition.partyStances[memberIdx]]
        const cost = Math.round(skill.mpCost * mods.mpCostMul)
        if (expedition.partyMp[memberIdx] < cost) return

        const floor = expedition.floorPlan[expedition.currentFloor - 1]
        if (!floor) return

        const res = applySkill(
          skill, memberIdx, party.members,
          expedition.partyHp, expedition.partyMp,
          floor.enemies, combat.enemyHp,
          combat.playerTargets, mods,
          combat.enemyStatuses,
          combat.partyBuffs ?? [],
          combat.partyStatuses ?? [],
        )

        const newMp = [...expedition.partyMp]
        newMp[memberIdx] = Math.max(0, newMp[memberIdx] - cost)

        const newCooldowns = combat.skillCooldownMs.map((row) => [...row])
        if (newCooldowns[memberIdx]) newCooldowns[memberIdx][skillSlotIdx] = skill.cooldownMs

        set((state) => ({
          expedition: state.expedition ? {
            ...state.expedition,
            partyHp: res.partyHp,
            partyMp: newMp,
            activeCombat: {
              ...state.expedition.activeCombat!,
              enemyHp: res.enemyHp,
              enemyStatuses: res.enemyStatuses,
              partyBuffs: res.partyBuffs,
              partyStatuses: res.partyStatuses,
              skillCooldownMs: newCooldowns,
            },
            log: [...state.expedition.log, ...res.log.map((entry) => ({
              timestamp: Date.now(), message: entry.message, type: entry.type,
            }))].slice(-30),
          } : null,
        }))
      },

      setTarget: (enemyIdx: number) => {
        set((state) => {
          if (!state.expedition?.activeCombat) return {}
          const current = state.expedition.activeCombat.playerTargets[0]
          const val = current === enemyIdx ? -1 : enemyIdx
          const newTargets = state.expedition.activeCombat.playerTargets.map(() => val)
          return {
            expedition: {
              ...state.expedition,
              activeCombat: { ...state.expedition.activeCombat, playerTargets: newTargets },
            },
          }
        })
      },

      enhanceEquipment: (equipmentId) => {
        const { roster, party, ownedEquipment, resources, unlockedTitles } = get()
        const item = ownedEquipment.find((e) => e.id === equipmentId)
        if (!item) return { result: 'fail', newTitleIds: [] }
        const level = item.enhancement ?? 0
        if (level >= ENHANCE_MAX) return { result: 'max', newTitleIds: [] }
        const cost = ENHANCE_COSTS[level]
        if (resources.gold < cost) return { result: 'no_gold', newTitleIds: [] }

        const success = Math.random() < ENHANCE_RATES[level] / 100
        if (success) {
          const enhanced = { ...item, enhancement: level + 1 }
          const updateChars = (chars: Character[]) => chars.map((c) => {
            const hasItem = Object.values(c.equipment).some((e) => e?.id === equipmentId)
            if (!hasItem) return c
            const newEquip = {
              weapon:    c.equipment.weapon?.id    === equipmentId ? enhanced : c.equipment.weapon,
              armor:     c.equipment.armor?.id     === equipmentId ? enhanced : c.equipment.armor,
              accessory: c.equipment.accessory?.id === equipmentId ? enhanced : c.equipment.accessory,
            }
            const stats = calcMaxStats({ ...c, equipment: newEquip })
            return { ...c, equipment: newEquip, ...stats }
          })
          const nextEquip = ownedEquipment.map((e) => e.id === equipmentId ? enhanced : e)
          const nextRoster = updateChars(roster)
          const nextParty = { ...party, members: updateChars(party.members) }
          const newTitleIds = checkNewTitles({ ...get(), ownedEquipment: nextEquip, roster: nextRoster, party: nextParty })
          set({
            resources: { ...resources, gold: resources.gold - cost },
            ownedEquipment: nextEquip,
            roster: nextRoster,
            party: nextParty,
            ...(newTitleIds.length > 0 ? {
              unlockedTitles: [...new Set([...unlockedTitles, ...newTitleIds])],
            } : {}),
          })
          return { result: 'success', newTitleIds }
        }

        const broken = Math.random() < ENHANCE_BREAK_CHANCE
        if (broken) {
          const removeItem = (chars: Character[]) => chars.map((c) => {
            const hasItem = Object.values(c.equipment).some((e) => e?.id === equipmentId)
            if (!hasItem) return c
            const newEquip = {
              weapon:    c.equipment.weapon?.id    === equipmentId ? undefined : c.equipment.weapon,
              armor:     c.equipment.armor?.id     === equipmentId ? undefined : c.equipment.armor,
              accessory: c.equipment.accessory?.id === equipmentId ? undefined : c.equipment.accessory,
            }
            const stats = calcMaxStats({ ...c, equipment: newEquip })
            return { ...c, equipment: newEquip, ...stats }
          })
          set({
            resources: { ...resources, gold: resources.gold - cost },
            ownedEquipment: ownedEquipment.filter((e) => e.id !== equipmentId),
            roster: removeItem(roster),
            party: { ...party, members: removeItem(party.members) },
          })
          return { result: 'broken', newTitleIds: [] }
        }

        set({ resources: { ...resources, gold: resources.gold - cost } })
        return { result: 'fail', newTitleIds: [] }
      },

      showTitleNotification: (ids) => {
        if (ids.length === 0) return
        set({ newlyUnlockedTitles: ids })
      },

      sellEquipment: (equipmentId) => {
        const { roster, party, ownedEquipment, resources } = get()
        const item = ownedEquipment.find((e) => e.id === equipmentId)
        if (!item) return 0
        const enhanceLvl = item.enhancement ?? 0
        const sellPrice = 50 + ENHANCE_COSTS.slice(0, enhanceLvl).reduce((s, c) => s + Math.floor(c * 0.2), 0)
        const removeItem = (chars: Character[]) => chars.map((c) => {
          const hasItem = Object.values(c.equipment).some((e) => e?.id === equipmentId)
          if (!hasItem) return c
          const newEquip = {
            weapon:    c.equipment.weapon?.id    === equipmentId ? undefined : c.equipment.weapon,
            armor:     c.equipment.armor?.id     === equipmentId ? undefined : c.equipment.armor,
            accessory: c.equipment.accessory?.id === equipmentId ? undefined : c.equipment.accessory,
          }
          return { ...c, equipment: newEquip, ...calcMaxStats({ ...c, equipment: newEquip }) }
        })
        set({
          resources: { ...resources, gold: resources.gold + sellPrice },
          ownedEquipment: ownedEquipment.filter((e) => e.id !== equipmentId),
          roster: removeItem(roster),
          party: { ...party, members: removeItem(party.members) },
        })
        return sellPrice
      },

      savePartySet: (index, name, members) => {
        set((state) => {
          const newSets = [...state.partySets] as (PartySet | null)[]
          newSets[index] = { id: index, name, members }
          return { partySets: newSets }
        })
      },

      activatePartySet: (index) => {
        const { partySets, roster } = get()
        const partySet = partySets[index]
        if (!partySet) return

        const assignedItemIds = new Set<string>()
        for (const m of partySet.members) {
          for (const item of Object.values(m.equipment)) {
            if (item) assignedItemIds.add(item.id)
          }
        }

        const updatedMembers = partySet.members
          .map((m) => {
            const rosterChar = roster.find((c) => c.id === m.characterId)
            if (!rosterChar) return null
            const stats = calcMaxStats({ ...rosterChar, equipment: m.equipment })
            const allSkills = getLearnedSkills(rosterChar.class, rosterChar.level)
            const activeSkills = m.activeSkillIds.length > 0
              ? allSkills.filter((s) => m.activeSkillIds.includes(s.id))
              : allSkills
            return { ...rosterChar, equipment: m.equipment, ...stats, hp: stats.maxHp, mp: stats.maxMp, skills: activeSkills, stance: m.stance } as Character
          })
          .filter((c): c is Character => c !== null)

        const partyMemberIds = new Set(partySet.members.map((m) => m.characterId))
        const rosterUpdateMap = new Map(updatedMembers.map((c) => [c.id, c]))

        const newRoster = roster.map((c) => {
          if (rosterUpdateMap.has(c.id)) return rosterUpdateMap.get(c.id)!
          if (partyMemberIds.has(c.id)) return c
          const slots = Object.keys(c.equipment) as EquipmentSlot[]
          const stolen = slots.filter((s) => c.equipment[s] && assignedItemIds.has(c.equipment[s]!.id))
          if (stolen.length === 0) return c
          const newEquip = { ...c.equipment }
          stolen.forEach((s) => delete newEquip[s])
          const stats = calcMaxStats({ ...c, equipment: newEquip })
          return { ...c, equipment: newEquip, ...stats }
        })

        set({
          party: { members: updatedMembers },
          roster: newRoster,
        })
      },

      clearPartySet: (index) => {
        set((state) => {
          const newSets = [...state.partySets] as (PartySet | null)[]
          newSets[index] = null
          return { partySets: newSets }
        })
      },
    }),
    {
      name: 'dungeon-explorer-save',
      storage: secureStorage,
      version: 10,
      migrate: (state) => {
        const s = state as Partial<GameState>
        const migrateChar = (c: Character): Character => {
          if (c.speed != null) return c
          return { ...c, speed: calcMaxStats(c).speed }
        }
        const migrated: GameState = {
          ...INITIAL_STATE,
          resources: s.resources ?? INITIAL_STATE.resources,
          unlockedDungeons: s.unlockedDungeons ?? INITIAL_STATE.unlockedDungeons,
          unlockedClasses: s.unlockedClasses ?? INITIAL_STATE.unlockedClasses,
          ownedEquipment: s.ownedEquipment && s.ownedEquipment.length > 0
            ? [...STARTER_EQUIPMENT, ...s.ownedEquipment.filter((e) => !STARTER_EQUIPMENT.some((se) => se.id === e.id))]
            : INITIAL_STATE.ownedEquipment,
          discoveredEquipmentIds: s.discoveredEquipmentIds ?? STARTER_EQUIPMENT.map((e) => e.id),
          roster: s.roster ? s.roster.map(migrateChar) : INITIAL_STATE.roster,
          party: s.party
            ? { ...s.party, members: s.party.members.map(migrateChar) }
            : INITIAL_STATE.party,
          expedition: s.expedition ?? null,
          expeditionResult: s.expeditionResult ?? null,
          partySets: s.partySets ?? INITIAL_STATE.partySets,
          unlockedTitles: s.unlockedTitles ?? [],
          clearedDungeons: s.clearedDungeons ?? [],
          wipeCount: s.wipeCount ?? 0,
          retreatCount: s.retreatCount ?? 0,
          totalExpeditions: s.totalExpeditions ?? 0,
          totalClears: s.totalClears ?? 0,
          totalGoldEarned: s.totalGoldEarned ?? 0,
          viewedStoryIds: s.viewedStoryIds ?? [],
          pendingStoryId: s.pendingStoryId ?? null,
          notifEnabled: s.notifEnabled ?? true,
        }
        return sanitizeState(migrated) as unknown as GameStore
      },
    },
  ),
)
