import { useState } from 'react'
import { runSimulation, DEFAULT_CONFIG } from '../game/simulation/runSimulation'
import { DUNGEONS } from '../game/dungeon/DungeonData'
import { CLASS_LABEL } from '../game/party/CharacterData'
import type { SimConfig, SimReport, SimDungeonResult } from '../game/simulation/runSimulation'
import type { CharacterClass } from '../types'

const ALL_CLASSES = Object.keys(CLASS_LABEL) as CharacterClass[]

// ============================================================
// 結果フォーマット
// ============================================================
function DungeonRow({ d }: { d: SimDungeonResult }) {
  const [open, setOpen] = useState(false)
  const icon = d.cleared ? '✓' : '✗'
  const color = d.cleared ? '#5ab' : '#c66'
  const lvFrom = d.entryLevels[0]
  const lvTo   = d.exitLevels[0]
  return (
    <div className="sim-dungeon-row">
      <div className="sim-dungeon-header" onClick={() => setOpen(v => !v)}>
        <span className="sim-dungeon-icon" style={{ color }}>{icon}</span>
        <span className="sim-dungeon-name">{d.dungeonName}</span>
        <span className="sim-dungeon-meta">
          {d.floors}F / 難易度{d.difficulty} / 推奨Lv{d.recommendedLevel}
        </span>
        <span className="sim-dungeon-stat">
          {d.cleared ? `${d.runsNeeded}周 / 約${d.estimatedMinutes}分` : `${d.runsNeeded}周 未クリア`}
        </span>
        <span className="sim-dungeon-stat">Lv {lvFrom}→{lvTo}</span>
        <span className="sim-expand">{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div className="sim-run-list">
          {d.runs.map(r => (
            <div key={r.run} className={`sim-run-row ${r.victory ? 'victory' : 'defeat'}`}>
              <span>Run{r.run}</span>
              <span>{r.victory ? '✓クリア' : `✗ ${r.deathFloor}F全滅`}</span>
              <span>{r.floorsCleared}/{r.totalFloors}階</span>
              <span>HP:[{r.hpPct.map(p => `${p}%`).join(' ')}]</span>
              <span>EXP:{r.expGained}</span>
              <span>Drop:{r.drops}</span>
              <span>Lv→{r.levelsAfter[0]}</span>
              {r.enhLog && <span className="sim-enh-log">{r.enhLog}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ReportView({ report }: { report: SimReport }) {
  const [showSkills, setShowSkills] = useState(false)
  const totalH = (report.totalMinutes / 60).toFixed(1)

  return (
    <div className="sim-report">
      <div className="sim-report-title">
        シミュレーション結果 — {report.config.classes.map(c => CLASS_LABEL[c]).join('・')}
        <span className="sim-report-sub"> (強化目標+{report.config.enhanceTarget} / 最大{report.config.maxRuns}周)</span>
      </div>

      <div className="sim-dungeon-list">
        {report.dungeons.map(d => <DungeonRow key={d.dungeonId} d={d} />)}
      </div>

      <div className="sim-time-summary">
        総放置時間: 約{report.totalMinutes}分（{totalH}時間）　最終所持金: {report.goldFinal.toLocaleString()}Z
      </div>

      <div className="sim-final-party">
        <div className="sim-section-title">最終パーティ</div>
        {report.finalParty.map((m, i) => (
          <div key={i} className="sim-member-card">
            <div className="sim-member-header">
              <span className="sim-member-name">{m.name}</span>
              <span className="sim-member-class">{m.classLabel} Lv{m.level}</span>
              <span className="sim-member-stats">ATK:{m.atk} DEF:{m.def} HP:{m.hp} SPD:{m.spd}</span>
            </div>
            <div className="sim-member-equips">
              {m.equipment.length === 0 ? <span className="sim-no-equip">装備なし</span> :
                m.equipment.map((e, j) => (
                  <span key={j} className="sim-equip-tag">
                    {e.name}{e.enhancement > 0 ? `+${e.enhancement}` : ''}
                  </span>
                ))
              }
            </div>
            <div className="sim-member-skills">
              {m.skills.map((s, j) => (
                <span key={j} className={`sim-skill-tag skill-type-${s.type}`}>{s.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sim-skills-section">
        <button className="sim-toggle-btn" onClick={() => setShowSkills(v => !v)}>
          スキル自動発動確認 {showSkills ? '▲' : '▼'}
        </button>
        {showSkills && (
          <div className="sim-skills-note">
            <div className="sim-note-info">✓ 全スキルはautoCondition条件で自動発動（MPがある限り）</div>
            {report.skillsNote.split('\n').map((line, i) => (
              <div key={i} className="sim-skills-line">{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// メインパネル
// ============================================================
export function SimulationPanel() {
  const [open, setOpen]         = useState(false)
  const [running, setRunning]   = useState(false)
  const [report, setReport]     = useState<SimReport | null>(null)
  const [config, setConfig]     = useState<SimConfig>({ ...DEFAULT_CONFIG })

  const setClass = (i: number, cls: CharacterClass) =>
    setConfig(c => { const classes = [...c.classes] as CharacterClass[]; classes[i] = cls; return { ...c, classes } })

  const handleRun = () => {
    setRunning(true)
    setReport(null)
    // 非同期でUIを更新してからシミュレーション実行
    setTimeout(() => {
      try {
        const result = runSimulation(config)
        setReport(result)
      } finally {
        setRunning(false)
      }
    }, 10)
  }

  return (
    <div className="sim-panel">
      <button className="sim-toggle-header" onClick={() => setOpen(v => !v)}>
        ⚗ バランスシミュレーション {open ? '▲' : '▼'}
      </button>

      {open && (
        <div className="sim-body">
          {/* 設定 */}
          <div className="sim-config">
            <div className="sim-config-row">
              <span className="sim-config-label">パーティ職業</span>
              <div className="sim-class-selects">
                {config.classes.map((cls, i) => (
                  <select key={i} value={cls} onChange={e => setClass(i, e.target.value as CharacterClass)}
                    className="sim-class-select">
                    {ALL_CLASSES.map(c => (
                      <option key={c} value={c}>{CLASS_LABEL[c]}</option>
                    ))}
                  </select>
                ))}
              </div>
            </div>

            <div className="sim-config-row">
              <span className="sim-config-label">対象ダンジョン</span>
              <select value={config.targetDungeonId}
                onChange={e => setConfig(c => ({ ...c, targetDungeonId: e.target.value }))}
                className="sim-select">
                <option value="all">全ダンジョン（連続）</option>
                {DUNGEONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div className="sim-config-row">
              <span className="sim-config-label">強化目標</span>
              <select value={config.enhanceTarget}
                onChange={e => setConfig(c => ({ ...c, enhanceTarget: Number(e.target.value) }))}
                className="sim-select">
                {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>+{n}{n === 0 ? '（強化なし）' : n <= 3 ? '（安全圏）' : n <= 6 ? '（標準）' : n <= 8 ? '（積極的）' : '（限界強化）'}</option>
                ))}
              </select>

              <span className="sim-config-label" style={{ marginLeft: 12 }}>最大周回</span>
              <select value={config.maxRuns}
                onChange={e => setConfig(c => ({ ...c, maxRuns: Number(e.target.value) }))}
                className="sim-select">
                {[5, 10, 15, 20, 30].map(n => <option key={n} value={n}>{n}周</option>)}
              </select>
            </div>
          </div>

          <button className="sim-run-btn" onClick={handleRun} disabled={running}>
            {running ? '⏳ シミュレーション実行中...' : '▶ シミュレーション実行'}
          </button>

          {report && <ReportView report={report} />}
        </div>
      )}
    </div>
  )
}
