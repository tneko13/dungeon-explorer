import { useState } from 'react'
import type { Character, Equipment, PartySet, PartySetMember, EquipmentSlot } from '../types'
import { useGameStore } from '../store/gameStore'
import { STANCE_LABELS } from '../game/combat/CombatEngine'
import { SKILL_MASTER } from '../game/skills/SkillMasterData'
import { Dialog } from './Dialog'
import { CLASS_LABEL, PORTRAIT_CROP } from '../game/party/CharacterData'
import { imgCharacterPortrait } from '../utils/imagePaths'

/** サイドバーと同じ顔アップアイコン */
function CharIcon({ cls }: { cls: string }) {
  const crop = PORTRAIT_CROP[cls] ?? { ix: 50, iy: 0 }
  const size = 36
  const bgW = Math.round(size * 3.8)
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`,
      backgroundImage: `url(${imgCharacterPortrait(cls)})`,
      backgroundSize: `${bgW}px auto`,
      backgroundPosition: `${crop.ix}% ${crop.iy}%`,
      backgroundRepeat: 'no-repeat',
      borderRadius: '4px',
      border: '1px solid #2a3a4a',
      flexShrink: 0,
    }} />
  )
}

const SKILL_NAME_MAP: Record<string, string> = Object.values(SKILL_MASTER)
  .flat()
  .reduce<Record<string, string>>((acc, e) => { acc[e.skill.id] = e.skill.name; return acc }, {})

interface ConflictItem {
  itemName: string
  fromName: string
  toName: string
}

function detectConflicts(partySet: PartySet, roster: Character[]): ConflictItem[] {
  const conflicts: ConflictItem[] = []
  for (const m of partySet.members) {
    const target = roster.find((c) => c.id === m.characterId)
    if (!target) continue
    for (const item of Object.values(m.equipment) as (Equipment | undefined)[]) {
      if (!item) continue
      const wearer = roster.find(
        (c) => c.id !== m.characterId && Object.values(c.equipment).some((e) => e?.id === item.id),
      )
      if (wearer) conflicts.push({ itemName: item.name, fromName: wearer.name, toName: target.name })
    }
  }
  return conflicts
}

export function MyPartyPanel() {
  const { roster, party, partySets, savePartySet, activatePartySet, clearPartySet } = useGameStore()

  const [savingSlot, setSavingSlot] = useState<number | null>(null)
  const [saveName, setSaveName] = useState('')
  const [loadWarning, setLoadWarning] = useState<{ slotIndex: number; conflicts: ConflictItem[] } | null>(null)

  const activeIds = new Set(party.members.map((m) => m.id))

  const openSave = (index: number) => {
    setSavingSlot(index)
    setSaveName(partySets[index]?.name ?? `パーティ ${index + 1}`)
  }

  const confirmSave = (index: number) => {
    const members: PartySetMember[] = party.members.map((m) => ({
      characterId: m.id,
      equipment: { ...m.equipment },
      activeSkillIds: m.skills.map((s) => s.id),
      stance: m.stance,
    }))
    savePartySet(index, saveName.trim() || `パーティ ${index + 1}`, members)
    setSavingSlot(null)
  }

  const handleLoad = (index: number) => {
    const ps = partySets[index]
    if (!ps) return
    const conflicts = detectConflicts(ps, roster)
    if (conflicts.length > 0) {
      setLoadWarning({ slotIndex: index, conflicts })
    } else {
      activatePartySet(index)
    }
  }

  const confirmLoad = () => {
    if (!loadWarning) return
    activatePartySet(loadWarning.slotIndex)
    setLoadWarning(null)
  }

  return (
    <div className="my-party-panel">
      {/* 装備移動警告ダイアログ */}
      {loadWarning && (
        <Dialog open onClose={() => setLoadWarning(null)}>
          <div className="confirm-title">装備の移動が発生します</div>
          <div className="conflict-list">
            {loadWarning.conflicts.map((c, i) => (
              <div key={i} className="conflict-item">
                ・ {c.itemName}：{c.fromName} → {c.toName}
              </div>
            ))}
          </div>
          <div className="confirm-sub">続けますか？</div>
          <div className="confirm-actions">
            <button className="confirm-ok" onClick={confirmLoad}>読み込む</button>
            <button className="confirm-cancel" onClick={() => setLoadWarning(null)}>キャンセル</button>
          </div>
        </Dialog>
      )}

      <div className="my-party-slots">
        {partySets.map((ps, i) => {
          const isSaving = savingSlot === i
          const isActive = ps !== null &&
            ps.members.length === party.members.length &&
            ps.members.every((m) => activeIds.has(m.characterId))

          return (
            <div key={i} className={`party-slot ${ps && !isSaving ? 'filled' : 'empty'}`}>
              <div className="party-slot-header">
                <span className="slot-number">スロット {i + 1}</span>
                {isActive && !isSaving && <span className="slot-active-badge">✓ 出撃中</span>}
              </div>

              {isSaving ? (
                /* 保存フォーム */
                <div className="save-form">
                  <div className="save-form-members">
                    {party.members.map((m) => (
                      <span key={m.id} className={`class-badge ${m.class}`}>{CLASS_LABEL[m.class]} {m.name}</span>
                    ))}
                  </div>
                  <input
                    className="name-input"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && confirmSave(i)}
                    placeholder="パーティ名"
                    autoFocus
                    maxLength={20}
                  />
                  <div className="slot-actions">
                    <button className="slot-btn activate" onClick={() => confirmSave(i)}>登録</button>
                    <button className="slot-btn clear" onClick={() => setSavingSlot(null)}>キャンセル</button>
                  </div>
                </div>
              ) : ps ? (
                /* 保存済みスロット */
                <>
                  <div className="slot-name">{ps.name}</div>
                  <div className="slot-member-list">
                    {ps.members.map((m) => {
                      const c = roster.find((r) => r.id === m.characterId)
                      if (!c) return null
                      const equips = (['weapon', 'armor', 'accessory'] as EquipmentSlot[])
                        .map((s) => m.equipment[s]?.name)
                        .filter(Boolean)
                      const skills = m.activeSkillIds.map((id) => SKILL_NAME_MAP[id] ?? id).join('・') || 'なし'
                      return (
                        <div key={m.characterId} className="slot-member-detail">
                          <div className="slot-member-row">
                            <CharIcon cls={c.class} />
                            <span className="slot-member-name">{c.name}</span>
                            <span className="slot-member-level">Lv{c.level}</span>
                            <span className="slot-member-stance">{STANCE_LABELS[m.stance]}</span>
                          </div>
                          {equips.length > 0 && (
                            <div className="slot-member-equip">装備: {equips.join(' / ')}</div>
                          )}
                          <div className="slot-member-skills">スキル: {skills}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="slot-actions">
                    <button className="slot-btn activate" onClick={() => handleLoad(i)}>読み込む</button>
                    <button className="slot-btn edit" onClick={() => openSave(i)}>上書き</button>
                    <button className="slot-btn clear" onClick={() => clearPartySet(i)}>削除</button>
                  </div>
                </>
              ) : (
                /* 空きスロット */
                <button className="slot-new-btn" onClick={() => openSave(i)}>
                  ＋ 現在の編成を登録
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="my-party-hint">
        編成タブでパーティを組んでから「現在の編成を登録」で保存できます
      </div>
    </div>
  )
}
