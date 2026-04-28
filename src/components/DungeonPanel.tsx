import type { Character, Dungeon, ExpeditionSession } from '../types'
import { ENEMY_POOL, BOSS_DATA } from '../game/dungeon/EnemyData'
import { speedToInterval, STANCE_MODIFIERS } from '../game/combat/CombatEngine'

interface Props {
  dungeons: Dungeon[]
  expedition: ExpeditionSession | null
  party: Character[]
  onStart: (dungeonId: string) => void
}

function estimateDungeonMs(party: Character[], dungeon: Dungeon): number {
  const pool = ENEMY_POOL[dungeon.id] ?? []
  if (party.length === 0) return dungeon.floors * 75 * 1000

  const avgHp  = pool.length ? pool.reduce((s, e) => s + e.maxHp, 0)  / pool.length : 60
  const avgDef = pool.length ? pool.reduce((s, e) => s + e.defense, 0) / pool.length : 3

  // パーティのDPS（ms単位、スタンス考慮）
  const dpsPerMs = party
    .filter((m) => m.hp > 0)
    .reduce((s, m) => {
      const mods = STANCE_MODIFIERS[m.stance]
      const dmg = Math.max(1, Math.round(m.attack * mods.atkMul) - avgDef)
      const interval = speedToInterval(m.speed) * mods.intervalMul
      return s + dmg / interval
    }, 0)

  if (dpsPerMs <= 0) return dungeon.floors * 75 * 1000

  const killTimeMs = avgHp / dpsPerMs          // 敵1体撃破にかかるms
  const normalFloors = Math.max(0, dungeon.floors - 1)
  const avgEnemies = 2                          // 1フロア平均2体
  const normalMs = normalFloors * avgEnemies * killTimeMs * 0.9  // 10%はイベントフロア

  const boss = BOSS_DATA[dungeon.id]
  const bossMs = boss ? boss.maxHp / dpsPerMs : killTimeMs * 3

  return Math.round(normalMs + bossMs)
}

function formatEstimate(ms: number): string {
  const s = Math.ceil(ms / 1000)
  if (s < 60) return `約${s}秒`
  const m = Math.floor(s / 60)
  const rem = s % 60
  return rem > 0 ? `約${m}分${rem}秒` : `約${m}分`
}

export function DungeonPanel({ dungeons, expedition, party, onStart }: Props) {
  const isExploring = expedition !== null

  return (
    <div className="panel">
      <div className="panel-title">ダンジョン選択</div>
      {dungeons.map((dungeon) => {
        const estimatedMs = estimateDungeonMs(party, dungeon)
        return (
          <div key={dungeon.id} className={`dungeon-card ${isExploring ? 'disabled' : ''}`}>
            <div className="dungeon-name">{dungeon.name}</div>
            <div className="dungeon-meta">
              <span>{dungeon.floors}階層</span>
              <span>推奨Lv{dungeon.recommendedLevel}</span>
              <span>難易度 {'★'.repeat(Math.min(dungeon.difficulty, 5))}{dungeon.difficulty > 5 ? '+' : ''}</span>
              <span className="dungeon-estimate">{formatEstimate(estimatedMs)}</span>
            </div>
            {!isExploring && (
              <button className="btn-start" onClick={() => onStart(dungeon.id)}>
                探索開始
              </button>
            )}
          </div>
        )
      })}
      {isExploring && (
        <p style={{ marginTop: 8, fontSize: 11, color: '#6688aa' }}>
          ※ 探索中は出発できません
        </p>
      )}
    </div>
  )
}
