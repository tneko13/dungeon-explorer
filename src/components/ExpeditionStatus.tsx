import { useEffect, useRef } from 'react'
import type { Dungeon, Stance, StanceModifiers } from '../types'
import { useGameStore } from '../store/gameStore'
import { STANCE_LABELS, STANCE_MODIFIERS, ELEMENT_LABEL, STATUS_LABEL, BUFF_LABEL, speedToInterval } from '../game/combat/CombatEngine'
import { CLASS_LABEL, PORTRAIT_CROP } from '../game/party/CharacterData'
import { getItemDisplayName } from '../game/equipment/EquipmentData'
import { imgCharacterPortrait, imgEnemyIcon, imgEnemyPortrait, imgDungeonBg } from '../utils/imagePaths'

function CharIcon({ cls, size = 30, className }: { cls: string; size?: number; className?: string }) {
  const crop = PORTRAIT_CROP[cls] ?? { ix: 50, iy: 0 }
  const bgW = Math.round(size * 3.8)
  return (
    <div
      className={className ?? 'member-char-icon'}
      style={{
        backgroundImage: `url(${imgCharacterPortrait(cls)})`,
        backgroundSize: `${bgW}px auto`,
        backgroundPosition: `${crop.ix}% ${crop.iy}%`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}

function ImgIcon({ src, className }: { src: string; className: string }) {
  return (
    <img src={src} className={className} alt=""
      onError={(e) => { e.currentTarget.style.display = 'none' }} />
  )
}
function StanceMods({ mods }: { mods: StanceModifiers }) {
  const items: { label: string; val: number }[] = [
    { label: 'ATK', val: mods.atkMul },
    { label: 'DEF', val: mods.defMul },
    { label: '速', val: 1 / mods.intervalMul },
    { label: 'SKL', val: mods.skillDmgMul },
    { label: 'MP', val: 1 / mods.mpCostMul },
  ]
  const changed = items.filter((x) => Math.abs(x.val - 1) >= 0.05)
  if (changed.length === 0) return null
  return (
    <div className="stance-mods">
      {changed.map(({ label, val }) => {
        const up = val >= 1
        const big = Math.abs(val - 1) >= 0.25
        return (
          <span key={label} className={`stance-mod ${up ? 'up' : 'down'}${big ? ' big' : ''}`}>
            {label}{up ? (big ? '↑↑' : '↑') : (big ? '↓↓' : '↓')}
          </span>
        )
      })}
    </div>
  )
}

function Bar({ value, max, className }: { value: number; max: number; className: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="mini-bar-wrap">
      <div className={`mini-bar ${className}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

interface Props {
  dungeon: Dungeon
  onFinish: () => void
  onRequestRetreat: () => void
}

export function ExpeditionStatus({ dungeon, onFinish, onRequestRetreat }: Props) {
  const { expedition, party, setCharacterStance, setTarget } = useGameStore()
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [expedition?.log.length])

  if (!expedition) return null

  const isFinished = expedition.status !== 'exploring'
  const combat = expedition.activeCombat

  const statusLabel: Record<string, string> = {
    exploring: '探索中',
    complete: '踏破！',
    failed: '全滅...',
    retreated: '撤退',
  }

  const floor = expedition.floorPlan[expedition.currentFloor - 1]
  const hasCombatFloor = floor && floor.type !== 'event'
  const isBossFloor = floor?.type === 'boss'
  const bgUrl = imgDungeonBg(dungeon.id, expedition.currentFloor, isBossFloor)

  return (
    <div className="expedition-panel">
      <div className="expedition-bg" style={{ backgroundImage: `url(${bgUrl})` }} />
      {/* ヘッダー */}
      <div className={`expedition-title ${isFinished ? 'expedition-complete-title' : ''}`}>
        <span>{statusLabel[expedition.status]} — {dungeon.name}（{expedition.currentFloor}/{dungeon.floors}階）</span>
        {isFinished && (
          <button className="btn-finish" onClick={onFinish}>
            {expedition.status === 'complete' ? '帰還・報酬受取' :
             expedition.status === 'retreated' ? '撤退帰還（部分報酬）' : '帰還'}
          </button>
        )}
      </div>

      {/* 戦闘シーン */}
      {hasCombatFloor && (
        <div className="combat-scene">
          <div className="combat-scene-bg" style={{ backgroundImage: `url(${bgUrl})` }} />
          <div className="combat-characters">
            {[...party.members].reverse().map((member) => {
              const i = party.members.indexOf(member)
              const hp = expedition.partyHp[i] ?? 0
              const isDead = hp <= 0
              return (
                <img
                  key={member.id}
                  className={`combat-char-portrait${isDead ? ' dead' : ''}`}
                  src={imgCharacterPortrait(member.class)}
                  alt={member.name}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              )
            })}
            {(combat?.summons ?? []).map((s) => (
              <img
                key={s.instanceId}
                className={`combat-char-portrait combat-summon-portrait${s.hp <= 0 ? ' dead' : ''}`}
                src={imgCharacterPortrait(s.id)}
                alt={s.name}
                title={s.name}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ))}
          </div>
          <div className="combat-enemies">
            {floor.enemies.map((enemy, ei) => {
              const floorCleared = !combat && (expedition.floorClearPauseMs ?? 0) > 0
              const ehp = combat ? (combat.enemyHp[ei] ?? 0) : (floorCleared || expedition.status === 'complete' ? 0 : enemy.hp)
              const isDead = ehp <= 0
              return (
                <img
                  key={enemy.id + ei}
                  className={`combat-enemy-portrait${isDead ? ' dead' : ''}`}
                  src={imgEnemyPortrait(enemy.id)}
                  alt={enemy.name}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* ログ（戦闘シーンとステータスの間） */}
      {expedition.log.length > 0 && (
        <div className="log-list" ref={logRef}>
          {expedition.log.slice(-30).map((entry, i) => (
            <div key={i} className={`log-entry ${entry.type}`}>
              {entry.message}
            </div>
          ))}
        </div>
      )}

      <div className="expedition-columns">
        {/* 左カラム: パーティ */}
        <div className="expedition-left">
          <div className="exp-party-section">
            {party.members.map((member, i) => {
              const hp = expedition.partyHp[i] ?? 0
              const mp = expedition.partyMp[i] ?? 0
              const stance = expedition.partyStances[i] ?? 'normal'
              const isDead = hp <= 0

              return (
                <div key={member.id} className={`exp-member-row ${isDead ? 'dead' : ''}`}>
                  <div className="exp-member-header">
                    <CharIcon cls={member.class} className="member-char-icon" />
                    <span className={`class-badge ${member.class}`}>{CLASS_LABEL[member.class]}</span>
                    <span className="exp-member-name">{member.name}</span>
                    <span className="exp-member-stance">{STANCE_LABELS[stance]}</span>
                  </div>
                  <div className="exp-member-bars">
                    <div className="exp-bar-row">
                      <span className="exp-bar-label">HP</span>
                      <Bar value={hp} max={member.maxHp} className="hp-bar-fill" />
                      <span className="exp-bar-num">{hp}/{member.maxHp}</span>
                    </div>
                    <div className="exp-bar-row">
                      <span className="exp-bar-label">MP</span>
                      <Bar value={mp} max={member.maxMp} className="mp-bar-fill" />
                      <span className="exp-bar-num">{mp}/{member.maxMp}</span>
                    </div>
                  </div>
                  {(() => {
                    const buffs = combat?.partyBuffs?.[i] ?? []
                    const psts = combat?.partyStatuses?.[i] ?? []
                    if (buffs.length === 0 && psts.length === 0) return null
                    return (
                      <div className="exp-party-effects">
                        {buffs.map((b) => (
                          <span key={b.type} className="buff-badge">
                            {BUFF_LABEL[b.type]}{b.stacks > 1 ? `×${b.stacks}` : ''}
                            <span className="effect-turns">{b.actionsLeft < 50 ? b.actionsLeft : ''}</span>
                          </span>
                        ))}
                        {psts.map((s) => (
                          <span key={s.type} className={`status-badge status-${s.type}`}>
                            {STATUS_LABEL[s.type]}{(s.stacks ?? 1) > 1 ? `×${s.stacks}` : ''}{s.actionsLeft}
                          </span>
                        ))}
                      </div>
                    )
                  })()}
                  {/* 装備 */}
                  {Object.values(member.equipment).some(Boolean) && (
                    <div className="exp-member-equips">
                      {(['weapon', 'armor', 'accessory'] as const).map((slot) => {
                        const item = member.equipment[slot]
                        if (!item) return null
                        const slotLabel = { weapon: '武', armor: '防', accessory: '飾' }[slot]
                        return (
                          <span key={slot} className="exp-equip-badge">
                            <span className="exp-equip-slot">{slotLabel}</span>
                            {getItemDisplayName(item)}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  {/* セットスキル */}
                  {member.skills.length > 0 && (
                    <div className="exp-member-skills">
                      {member.skills.map((skill, si) => {
                        const cdMs = combat?.skillCooldownMs?.[i]?.[si] ?? 0
                        const intervalMs = speedToInterval(member.speed) * STANCE_MODIFIERS[stance].intervalMul
                        const cdActions = cdMs > 0 ? Math.ceil(cdMs / intervalMs) : 0
                        return (
                          <span key={skill.id} className={`exp-skill-badge skill-type-${skill.type}${cdMs > 0 ? ' on-cd' : ''}`}>
                            {skill.name}
                            {cdActions > 0 && <span className="exp-skill-cd">{cdActions}</span>}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  {!isDead && !isFinished && (
                    <div className="exp-stance-row">
                      {(Object.keys(STANCE_LABELS) as Stance[]).map((s) => {
                        const mods = STANCE_MODIFIERS[s]
                        const cooldown = combat?.stanceCooldowns?.[i] ?? 0
                        const isCooling = cooldown > 0 && stance !== s
                        const filter = mods.skillFilter === null ? '全スキル' : mods.skillFilter.length === 0 ? 'スキルなし' : mods.skillFilter.join('/')
                        const tip = filter
                        return (
                          <div key={s} className="exp-stance-item">
                            <button
                              className={`exp-stance-btn ${stance === s ? 'active' : ''} ${isCooling ? 'cooling' : ''}`}
                              onClick={() => setCharacterStance(member.id, s)}
                              disabled={isCooling}
                              title={tip}
                            >
                              {STANCE_LABELS[s]}
                              {isCooling && <span className="stance-cd">{cooldown}</span>}
                            </button>
                            {stance === s && <StanceMods mods={mods} />}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* 召喚ユニット一覧 */}
          {(combat?.summons ?? []).length > 0 && (
            <div className="exp-summon-section">
              {(combat?.summons ?? []).map((s) => (
                <div key={s.instanceId} className={`exp-summon-row${s.hp <= 0 ? ' dead' : ''}`}>
                  <div className="exp-member-header">
                    <CharIcon cls={s.id} className="member-char-icon summon-icon" />
                    <span className="summon-badge">召喚</span>
                    <span className="exp-member-name">{s.name}</span>
                  </div>
                  <div className="exp-member-bars">
                    <div className="exp-bar-row">
                      <span className="exp-bar-label">HP</span>
                      <Bar value={s.hp} max={s.maxHp} className="hp-bar-fill" />
                      <span className="exp-bar-num">{s.hp}/{s.maxHp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 手動撤退ボタン */}
          {!isFinished && (
            <div className="exp-actions">
              <button className="retreat-btn" onClick={onRequestRetreat}>
                撤退（部分報酬で帰還）
              </button>
            </div>
          )}

          {/* 蓄積報酬表示 */}
          {(expedition.accumulatedGold > 0 || expedition.droppedItems.length > 0) && (
            <div className="exp-rewards">
              <span className="reward-label">獲得報酬：</span>
              {expedition.accumulatedGold > 0 && <span className="reward-gold">{expedition.accumulatedGold.toLocaleString()} Zel</span>}
              {expedition.droppedItems.map((item) => (
                <span key={item.id} className="reward-item">{item.name}</span>
              ))}
            </div>
          )}
        </div>

        {/* 右カラム: 敵 */}
        <div className="expedition-right">
          {hasCombatFloor ? (
            <div className="exp-enemy-section">
              {floor.enemies.map((enemy, ei) => {
                const floorCleared = !combat && (expedition.floorClearPauseMs ?? 0) > 0
                const ehp = combat ? (combat.enemyHp[ei] ?? 0) : (floorCleared || expedition.status === 'complete' ? 0 : enemy.hp)
                const isDead = ehp <= 0
                const isTargeted = !isDead && combat?.playerTargets.some((t) => t === ei)
                const statuses = combat ? (combat.enemyStatuses?.[ei] ?? []) : []
                const hpPct = Math.round((ehp / enemy.maxHp) * 100)

                return (
                  <div
                    key={enemy.id + ei}
                    className={`exp-enemy-card ${isTargeted ? 'targeted' : ''} ${isDead ? 'dead-enemy' : ''}`}
                    onClick={() => !isFinished && !isDead && combat && setTarget(ei)}
                  >
                    <div className="exp-enemy-nameline">
                      <ImgIcon src={imgEnemyIcon(enemy.id)} className="member-enemy-icon" />
                      <span className="exp-enemy-name">{enemy.name}{enemy.isBoss ? ' ★' : ''}</span>
                      {enemy.element && enemy.element !== 'none' && (
                        <span className={`elem-badge elem-${enemy.element}`}>{ELEMENT_LABEL[enemy.element]}</span>
                      )}
                      {isTargeted && <span className="target-mark">◀ターゲット</span>}
                    </div>
                    {statuses.length > 0 && (
                      <div className="exp-enemy-statuses">
                        {statuses.map((s) => (
                          <span key={s.type} className={`status-badge status-${s.type}`}>
                            {STATUS_LABEL[s.type]}{(s.stacks ?? 1) > 1 ? `×${s.stacks}` : ''}{s.actionsLeft}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="exp-enemy-hprow">
                      <Bar value={ehp} max={enemy.maxHp} className="enemy-bar-fill" />
                      <span className="exp-enemy-hp">
                        {isDead ? '撃破' : `${ehp} / ${enemy.maxHp} (${hpPct}%)`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="exp-event-notice">
              {floor?.eventType === 'trap'       && '⚠ 罠フロア'}
              {floor?.eventType === 'spring'     && '✦ 回復泉フロア'}
              {floor?.eventType === 'treasure'   && '◈ 宝箱フロア'}
              {floor?.eventType === 'shrine'     && '⛩ 祠フロア'}
              {floor?.eventType === 'rest'       && '🏕 野営地フロア'}
              {floor?.eventType === 'merchant'   && '🛒 行商人フロア'}
              {floor?.eventType === 'curse'      && '💀 呪いの間'}
              {floor?.eventType === 'mana_drain' && '🌀 魔力喰いの間'}
              {floor?.eventType === 'confusion'  && '🌫 混乱の霧'}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
