import type { FloorPlan, EventType } from '../../types'
import { pickEnemies, pickMilestoneEnemies, BOSS_DATA } from './EnemyData'

// 21F未満と21F以降で重みテーブルを分ける（rest は深層のみ）
const BASE_EVENTS: { type: EventType; w: number }[] = [
  { type: 'treasure',   w: 25 },
  { type: 'trap',       w: 20 },
  { type: 'spring',     w: 20 },
  { type: 'shrine',     w: 15 },
  { type: 'merchant',   w: 10 },
  { type: 'curse',      w:  4 },
  { type: 'mana_drain', w:  3 },
  { type: 'confusion',  w:  3 },
]
const DEEP_EVENTS: { type: EventType; w: number }[] = [
  ...BASE_EVENTS,
  { type: 'rest', w: 15 },
]

function pickEventType(floorNumber: number): EventType {
  const entries = floorNumber >= 21 ? DEEP_EVENTS : BASE_EVENTS
  const total = entries.reduce((s, e) => s + e.w, 0)
  let r = Math.random() * total
  for (const e of entries) {
    r -= e.w
    if (r <= 0) return e.type
  }
  return entries[entries.length - 1].type
}

const EVENT_CHANCE = 0.10

export function generateFloorPlan(dungeonId: string, floors: number): FloorPlan[] {
  return Array.from({ length: floors }, (_, i) => {
    const floorNumber = i + 1
    const isBoss = floorNumber === floors

    if (isBoss) {
      const boss = BOSS_DATA[dungeonId]
      return { floorNumber, type: 'boss', enemies: boss ? [{ ...boss }] : [] }
    }

    // 1F・10の倍数フロアは強敵戦闘（イベントなし）
    if (floorNumber === 1 || floorNumber % 10 === 0) {
      return { floorNumber, type: 'combat', enemies: floorNumber % 10 === 0 ? pickMilestoneEnemies(dungeonId, floorNumber) : pickEnemies(dungeonId, 1, floorNumber) }
    }

    if (Math.random() < EVENT_CHANCE) {
      return { floorNumber, type: 'event', eventType: pickEventType(floorNumber), enemies: [] }
    }

    // 深淵の塔は常に2〜4体の大群で迎え撃つ（メタル系ではなく真っ向勝負のガントレット）
    const minCount = dungeonId === 'abyss_tower' ? 2 : 1
    const count = Math.floor(Math.random() * 3) + minCount
    return { floorNumber, type: 'combat', enemies: pickEnemies(dungeonId, count, floorNumber) }
  })
}
