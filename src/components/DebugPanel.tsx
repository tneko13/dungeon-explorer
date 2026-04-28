import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { applyExperience, calcMaxStats, expForNextLevel } from '../game/CharacterEngine'
import { DUNGEONS } from '../game/dungeon/DungeonData'
import { CLASS_UNLOCK_CHARACTERS } from '../game/party/CharacterData'
import { EQUIPMENT_MASTER } from '../game/equipment/EquipmentData'
import { TITLES } from '../game/titles/TitleData'
import { SimulationPanel } from './SimulationPanel'
import type { Character } from '../types'

export function DebugPanel() {
  const [open, setOpen] = useState(false)
  const expedition = useGameStore((s) => s.expedition)
  const debugViewAllEnemies = useGameStore((s) => s.debugViewAllEnemies)
  const toggleDebugViewAllEnemies = useGameStore((s) => s.toggleDebugViewAllEnemies)
  const debugAddSummon = useGameStore((s) => s.debugAddSummon)

  const inCombat = !!expedition?.activeCombat
  const summonCount = expedition?.activeCombat?.summons.length ?? 0

  const addGold = (n: number) =>
    useGameStore.setState((s) => ({ resources: { ...s.resources, gold: s.resources.gold + n } }))

  const levelUpParty = (times: number) =>
    useGameStore.setState((s) => {
      const bump = (c: Character): Character => {
        let updated = c
        for (let i = 0; i < times; i++) {
          const need = expForNextLevel(updated.level) - updated.experience
          updated = applyExperience(updated, need)
        }
        const stats = calcMaxStats(updated)
        return { ...updated, ...stats, hp: stats.maxHp, mp: stats.maxMp }
      }
      const newMembers = s.party.members.map(bump)
      const newRoster = s.roster.map((r) => newMembers.find((m) => m.id === r.id) ?? bump(r))
      return { party: { ...s.party, members: newMembers }, roster: newRoster }
    })

  const unlockAll = () =>
    useGameStore.setState((s) => {
      const existingIds = new Set(s.roster.map((r) => r.id))
      const toAdd = Object.values(CLASS_UNLOCK_CHARACTERS).flat().filter((c) => !existingIds.has(c.id))
      return {
        unlockedDungeons: DUNGEONS.map((d) => d.id),
        unlockedClasses: [
          'warrior', 'mage', 'rogue', 'priest', 'ranger',
          'knight', 'wizard', 'assassin', 'paladin', 'bard',
          'berserker', 'witch', 'monk', 'druid', 'dancer',
          'dark_knight', 'necromancer', 'sage', 'summoner', 'enchanter',
        ],
        roster: [...s.roster, ...toAdd],
      }
    })

  const addAllEquipment = () =>
    useGameStore.setState((s) => {
      const ts = Date.now().toString(36)
      const toAdd = EQUIPMENT_MASTER.map((e) => ({
        ...e,
        id: `${e.id}_dbg_${ts}${Math.random().toString(36).slice(2, 5)}`,
        baseId: e.id,
      }))
      return {
        ownedEquipment: [...s.ownedEquipment, ...toAdd].slice(0, 300),
        discoveredEquipmentIds: [...new Set([...s.discoveredEquipmentIds, ...EQUIPMENT_MASTER.map((e) => e.id)])],
      }
    })

  const simulateTime = (ms: number) => {
    useGameStore.setState((s) =>
      s.expedition
        ? { expedition: { ...s.expedition, lastTickAt: s.expedition.lastTickAt - ms } }
        : {}
    )
    useGameStore.getState().tick()
  }

  const forceComplete = () =>
    useGameStore.setState((s) =>
      s.expedition
        ? { expedition: { ...s.expedition, status: 'complete', currentFloor: s.expedition.floorPlan.length } }
        : {}
    )

  const cancelExpedition = () =>
    useGameStore.setState({ expedition: null })

  const unlockAllTitles = () =>
    useGameStore.setState({ unlockedTitles: TITLES.map((t) => t.id) })

  return (
    <div className={`debug-panel ${open ? 'open' : ''}`}>
      <button className="debug-toggle" onClick={() => setOpen((v) => !v)}>
        🛠 DEBUG {open ? '▲' : '▼'}
      </button>
      {open && (
        <div className="debug-body">
          <div className="debug-group">
            <span className="debug-label">Zel</span>
            <button onClick={() => addGold(1_000)}>+1k</button>
            <button onClick={() => addGold(10_000)}>+10k</button>
            <button onClick={() => addGold(100_000)}>+100k</button>
          </div>
          <div className="debug-group">
            <span className="debug-label">Party Lv</span>
            <button onClick={() => levelUpParty(1)}>+1</button>
            <button onClick={() => levelUpParty(5)}>+5</button>
            <button onClick={() => levelUpParty(10)}>+10</button>
            <button onClick={() => levelUpParty(20)}>+20</button>
          </div>
          <div className="debug-group">
            <span className="debug-label">Unlock</span>
            <button onClick={unlockAll}>全ダンジョン＋職業</button>
            <button onClick={addAllEquipment}>全装備追加</button>
            <button onClick={unlockAllTitles}>全称号獲得</button>
            <button
              className={debugViewAllEnemies ? 'debug-active' : ''}
              onClick={toggleDebugViewAllEnemies}
            >
              {debugViewAllEnemies ? '敵図鑑：解放中 ✓' : '敵図鑑：全解放'}
            </button>
          </div>
          {expedition && (
            <div className="debug-group">
              <span className="debug-label">時間経過</span>
              <button onClick={() => simulateTime(60_000)}>+1分</button>
              <button onClick={() => simulateTime(10 * 60_000)}>+10分</button>
              <button onClick={() => simulateTime(60 * 60_000)}>+1時間</button>
              <button onClick={() => simulateTime(8 * 60 * 60_000)}>+8時間</button>
            </div>
          )}
          {expedition && (
            <div className="debug-group">
              <span className="debug-label">Expedition</span>
              <button onClick={forceComplete}>即完了</button>
              <button className="debug-danger" onClick={cancelExpedition}>強制キャンセル</button>
            </div>
          )}
          {expedition && (
            <div className="debug-group">
              <span className="debug-label">召喚テスト</span>
              <button
                onClick={debugAddSummon}
                disabled={!inCombat || summonCount >= 1}
                title={!inCombat ? '戦闘中のみ有効' : summonCount >= 1 ? '召喚は1体まで' : '召喚ユニットを追加'}
              >
                {summonCount >= 1 ? '召喚中（1/1）' : '召喚する'}
              </button>
            </div>
          )}

        </div>
      )}
      <SimulationPanel />
    </div>
  )
}
