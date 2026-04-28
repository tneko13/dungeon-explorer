import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import type { Character, Equipment, EquipmentSlot, Stance } from '../types'
import { useGameStore, exportSaveData, importSaveData } from '../store/gameStore'
import { getLearnedSkills } from '../game/skills/SkillMasterData'
import { expProgress } from '../game/CharacterEngine'
import { STANCE_LABELS, STANCE_DESCRIPTIONS, ELEMENT_LABEL } from '../game/combat/CombatEngine'
import { MyPartyPanel } from './MyPartyPanel'
import { EncyclopediaPanel } from './EncyclopediaPanel'
import { CollapsibleSection } from './CollapsibleSection'
import {
  ENHANCE_RATES, ENHANCE_COSTS, ENHANCE_MAX, ENHANCE_BREAK_CHANCE,
  getEnhancedStats, getItemDisplayName, canEquip,
  WEAPON_TAG_LABEL, ARMOR_TAG_LABEL,
} from '../game/equipment/EquipmentData'
import { EquipmentIcon } from './EquipmentIcon'
import { CLASS_LABEL, PORTRAIT_CROP } from '../game/party/CharacterData'
import { TITLES } from '../game/titles/TitleData'
import { imgFacility, imgCharacterPortrait } from '../utils/imagePaths'
import { STORY_CHAPTERS } from '../game/story/StoryData'
import { Dialog } from './Dialog'

const STORY_CHAPTERS_FOR_OPTIONS = STORY_CHAPTERS

type Tab = 'formation' | 'myparty' | 'encyclopedia' | 'forge' | 'titles' | 'options'
const SLOT_LABEL: Record<EquipmentSlot, string> = {
  weapon: '武器', armor: '防具', accessory: 'アクセサリ',
}
const SKILL_TYPE_LABEL: Record<string, string> = {
  attack: '攻撃', heal: '回復', buff: '強化', debuff: '弱体',
}

/** 職業の立ち絵を切り取って表示するコンポーネント
 * mode='bust': バストアップ（詳細パネル用、2.5x zoom）
 * mode='icon': 顔アップ・鎖骨〜頭頂部（サイドバーアイコン用、3.8x zoom）
 */
function CharPortrait({ cls, width, height, className, mode = 'bust' }: {
  cls: string; width: number; height: number; className?: string; mode?: 'bust' | 'icon'
}) {
  const crop = PORTRAIT_CROP[cls] ?? { x: 50, y: 0, ix: 50, iy: 0 }
  const zoom = mode === 'icon' ? 3.8 : 2.5
  const posX = mode === 'icon' ? crop.ix : crop.x
  const posY = mode === 'icon' ? crop.iy : crop.y
  const bgW = Math.round(width * zoom)
  return (
    <div
      className={`char-portrait-bg${className ? ' ' + className : ''}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${imgCharacterPortrait(cls)})`,
        backgroundSize: `${bgW}px auto`,
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}

interface ConfirmState {
  itemId: string
  wearerName: string
}

export function BaseScreen({ tab, onGoTitle, onShowStory }: { tab: Tab; onGoTitle: () => void; onShowStory: (id: string) => void }) {
  const { roster, party, ownedEquipment, resources, unlockedTitles, totalExpeditions, totalClears, totalGoldEarned, wipeCount, retreatCount, resetGame, equipItem, unequipItem, togglePartyMember, setActiveSkills, setCharacterStance, enhanceEquipment, sellEquipment, viewedStoryIds } = useGameStore()

  const [selectedId, setSelectedId] = useState<string | null>(roster[0]?.id ?? null)
  const [equipSlot, setEquipSlot] = useState<EquipmentSlot>('weapon')
  const [confirm, setConfirm] = useState<ConfirmState | null>(null)
  const [swapTarget, setSwapTarget] = useState<string | null>(null) // 追加したいキャラID
  const charDetailPanelRef = useRef<HTMLDivElement>(null)
  const charSidebarRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const sidebar = charSidebarRef.current
    const detail = charDetailPanelRef.current
    if (!sidebar || !detail) return
    const sync = () => { detail.style.maxHeight = sidebar.offsetHeight + 'px' }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(sidebar)
    return () => ro.disconnect()
  }, [roster.length])


  const partyIds = new Set(party.members.map((m) => m.id))
  const benched = roster.filter((c) => !partyIds.has(c.id))
  const char = roster.find((c) => c.id === selectedId) ?? null

  const handleEquipClick = (itemId: string) => {
    if (!char) return
    const wearer = roster.find((c) => c.id !== char.id && Object.values(c.equipment).some((e) => e?.id === itemId))
    if (wearer) {
      setConfirm({ itemId, wearerName: wearer.name })
    } else {
      equipItem(char.id, itemId)
    }
  }

  const handleToggleParty = (charId: string) => {
    const isInParty = partyIds.has(charId)
    if (isInParty) {
      togglePartyMember(charId)
    } else if (party.members.length >= 4) {
      // 満員 → 交代ダイアログを開く
      setSwapTarget(charId)
    } else {
      togglePartyMember(charId)
    }
  }

  return (
    <div className="base-screen">

      {tab === 'formation' ? (
        <>
        <div className="facility-banner">
          <img src={imgFacility('guild')} alt="" />
        </div>
        <div className="formation-body">
          {/* 左サイドバー：キャラ一覧 */}
          <div className="char-sidebar" ref={charSidebarRef}>
            {party.members.length > 0 && (
              <>
                <div className="sidebar-section-label">パーティ ({party.members.length}/4)</div>
                {party.members.map((c) => (
                  <div
                    key={c.id}
                    className={`char-list-item in-party ${selectedId === c.id ? 'selected' : ''}`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <CharPortrait cls={c.class} width={44} height={44} className="char-list-icon" mode="icon" />
                    <div className="char-list-info">
                      <span className="char-list-name">{c.name}</span>
                      <span className="char-list-meta"><span className={`class-badge ${c.class}`}>{CLASS_LABEL[c.class]}</span><span className="char-list-level">Lv.{c.level}</span></span>
                    </div>
                  </div>
                ))}
              </>
            )}
            {benched.length > 0 && (
              <>
                <div className="sidebar-section-label">スタンバイ</div>
                {benched.map((c) => (
                  <div
                    key={c.id}
                    className={`char-list-item ${selectedId === c.id ? 'selected' : ''}`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <CharPortrait cls={c.class} width={44} height={44} className="char-list-icon" mode="icon" />
                    <div className="char-list-info">
                      <span className="char-list-name">{c.name}</span>
                      <span className="char-list-meta"><span className={`class-badge ${c.class}`}>{CLASS_LABEL[c.class]}</span><span className="char-list-level">Lv.{c.level}</span></span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* 右：キャラ詳細 */}
          <div className="char-detail-panel" ref={charDetailPanelRef}>
            {char ? (
              <CharDetail
                char={char}
                inParty={partyIds.has(char.id)}
                partyFull={party.members.length >= 4}
                ownedEquipment={ownedEquipment}
                roster={roster}
                equipSlot={equipSlot}
                onEquipSlotChange={setEquipSlot}
                onEquipClick={handleEquipClick}
                onUnequip={(slot) => unequipItem(char.id, slot)}
                onToggleParty={() => handleToggleParty(char.id)}
                onSetActiveSkills={(ids) => setActiveSkills(char.id, ids)}
                onSetStance={(stance) => setCharacterStance(char.id, stance)}
                scrollContainerRef={charDetailPanelRef}
              />
            ) : (
              <div className="no-char-hint">← キャラクターを選択</div>
            )}
          </div>

          {/* メンバー交代ダイアログ */}
          {swapTarget && (() => {
            const addChar = roster.find((c) => c.id === swapTarget)
            if (!addChar) return null
            return (
              <Dialog open onClose={() => setSwapTarget(null)} className="swap-dialog">
                <div className="confirm-title">詰めに追加: {addChar.name}</div>
                <div className="confirm-sub">パーティから外すメンバーを選んでください</div>
                <div className="swap-member-list">
                  {party.members.map((m) => (
                    <button key={m.id} className="swap-member-btn" onClick={() => {
                      togglePartyMember(m.id)
                      togglePartyMember(swapTarget)
                      setSwapTarget(null)
                    }}>
                      <CharPortrait cls={m.class} width={40} height={40} mode="icon" />
                      <span className="swap-member-name">{m.name}</span>
                      <span className={`class-badge ${m.class}`}>{CLASS_LABEL[m.class]}</span>
                    </button>
                  ))}
                </div>
                <div className="confirm-actions">
                  <button className="confirm-cancel" onClick={() => setSwapTarget(null)}>キャンセル</button>
                </div>
              </Dialog>
            )
          })()}

          {/* 装備奪取確認ダイアログ */}
          {confirm && char && (
            <Dialog open onClose={() => setConfirm(null)}>
              <div className="confirm-message">
                <strong>{confirm.wearerName}</strong>が装備中です。<br />
                外して<strong>{char.name}</strong>に装備しますか？
              </div>
              <div className="confirm-actions">
                <button className="confirm-ok" onClick={() => { equipItem(char.id, confirm.itemId); setConfirm(null) }}>
                  装備する
                </button>
                <button className="confirm-cancel" onClick={() => setConfirm(null)}>キャンセル</button>
              </div>
            </Dialog>
          )}
        </div>
        </>
      ) : tab === 'myparty' ? (
        <MyPartyPanel />
      ) : tab === 'encyclopedia' ? (
        <EncyclopediaPanel />
      ) : tab === 'forge' ? (
        <ForgePanel
          ownedEquipment={ownedEquipment}
          gold={resources.gold}
          roster={roster}
          onEnhance={enhanceEquipment}
          onSell={sellEquipment}
        />
      ) : tab === 'titles' ? (
        <TitlesPanel unlockedTitles={unlockedTitles ?? []} />
      ) : (
        <OptionsPanel
          totalExpeditions={totalExpeditions ?? 0}
          totalClears={totalClears ?? 0}
          totalGoldEarned={totalGoldEarned ?? 0}
          wipeCount={wipeCount ?? 0}
          retreatCount={retreatCount ?? 0}
          onReset={resetGame}
          onGoTitle={onGoTitle}
          onShowStory={onShowStory}
          viewedStoryIds={viewedStoryIds ?? []}
        />
      )}
    </div>
  )
}

type EnhanceResult = 'success' | 'fail' | 'broken' | 'max' | 'no_gold'
type SortKey = 'enhancement' | 'atk' | 'def' | 'spd'
type SortDir = 'asc' | 'desc'
type EquipSortKey = 'enhancement' | 'atk' | 'def' | 'hp' | 'spd'
const EQUIP_SORT_LABELS: Record<EquipSortKey, string> = { enhancement: '強化', atk: 'ATK', def: 'DEF', hp: 'HP', spd: 'SPD' }

type ForgeModal =
  | { type: 'confirm-enhance'; item: Equipment }
  | { type: 'confirm-sell'; item: Equipment }
  | { type: 'result-enhance'; result: EnhanceResult; nameBefore: string; nameAfter: string; cost: number; newTitleIds: string[] }
  | { type: 'result-sold'; itemName: string; gold: number }

const EQUIPMENT_CAP = 300
const SLOT_LABEL_SHORT: Record<EquipmentSlot, string> = { weapon: '武器', armor: '防具', accessory: 'アクセ' }
const SORT_LABELS: Record<SortKey, string> = { enhancement: '強化値', atk: 'ATK', def: 'DEF', spd: 'SPD' }

function calcSellPrice(item: Equipment): number {
  const lvl = item.enhancement ?? 0
  return 50 + ENHANCE_COSTS.slice(0, lvl).reduce((s, c) => s + Math.floor(c * 0.2), 0)
}

function ForgePanel({ ownedEquipment, gold, roster, onEnhance, onSell }: {
  ownedEquipment: Equipment[]
  gold: number
  roster: Character[]
  onEnhance: (id: string) => { result: EnhanceResult; newTitleIds: string[] }
  onSell: (id: string) => number
}) {
  const { showTitleNotification } = useGameStore()
  const [modal, setModal] = useState<ForgeModal | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('enhancement')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [slotFilter, setSlotFilter] = useState<EquipmentSlot>('weapon')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  const confirmEnhance = () => {
    if (!modal || modal.type !== 'confirm-enhance') return
    const item = modal.item
    const nameBefore = getItemDisplayName(item)
    const cost = ENHANCE_COSTS[item.enhancement ?? 0]
    const { result, newTitleIds } = onEnhance(item.id)
    const nameAfter = result === 'success'
      ? getItemDisplayName({ ...item, enhancement: (item.enhancement ?? 0) + 1 })
      : nameBefore
    setModal({ type: 'result-enhance', result, nameBefore, nameAfter, cost, newTitleIds })
  }

  const confirmSell = () => {
    if (!modal || modal.type !== 'confirm-sell') return
    const item = modal.item
    const itemName = getItemDisplayName(item)
    const earned = onSell(item.id)
    setModal({ type: 'result-sold', itemName, gold: earned })
  }

  const sorted = [...ownedEquipment].filter((e) => e.slot === slotFilter).sort((a, b) => {
    let diff = 0
    if (sortKey === 'enhancement') diff = (b.enhancement ?? 0) - (a.enhancement ?? 0)
    else if (sortKey === 'atk') diff = getEnhancedStats(b).attackBonus - getEnhancedStats(a).attackBonus
    else if (sortKey === 'def') diff = getEnhancedStats(b).defenseBonus - getEnhancedStats(a).defenseBonus
    else diff = getEnhancedStats(b).speedBonus - getEnhancedStats(a).speedBonus
    return sortDir === 'asc' ? -diff : diff
  })

  const capClass = ownedEquipment.length >= EQUIPMENT_CAP ? 'forge-cap-full'
    : ownedEquipment.length >= EQUIPMENT_CAP * 0.8 ? 'forge-cap-warn' : ''

  return (
    <div className="forge-panel">
      <div className="facility-banner forge">
        <img src={imgFacility('forge')} alt="" />
      </div>
      {/* モーダル */}
      {modal && (
        <div className="forge-modal-overlay" onClick={() => modal.type !== 'result-enhance' && modal.type !== 'result-sold' ? setModal(null) : undefined}>
          <div className="forge-modal" onClick={(e) => e.stopPropagation()}>

            {modal.type === 'confirm-enhance' && (() => {
              const item = modal.item
              const lvl = item.enhancement ?? 0
              const cost = ENHANCE_COSTS[lvl]
              const rate = ENHANCE_RATES[lvl]
              const canAfford = gold >= cost
              return (
                <>
                  <div className="forge-modal-title">強化確認</div>
                  <div className="forge-modal-item">{getItemDisplayName(item)}</div>
                  <div className="forge-modal-preview">
                    → {getItemDisplayName({ ...item, enhancement: lvl + 1 })}（成功時）
                  </div>
                  <div className="forge-modal-info">強化成功率 <strong>{rate}%</strong></div>
                  <div className="forge-modal-info">費用 <strong>{cost.toLocaleString()} Zel</strong>
                    {!canAfford && <span className="forge-modal-warn"> (Zel不足)</span>}
                  </div>
                  <div className="forge-modal-info forge-modal-danger">
                    失敗時 {(ENHANCE_BREAK_CHANCE * 100).toFixed(0)}% の確率で装備が破壊されます
                  </div>
                  <div className="forge-modal-actions">
                    <button className="forge-modal-ok" onClick={confirmEnhance} disabled={!canAfford}>
                      強化する
                    </button>
                    <button className="forge-modal-cancel" onClick={() => setModal(null)}>キャンセル</button>
                  </div>
                </>
              )
            })()}

            {modal.type === 'result-enhance' && (() => {
              const { result, nameBefore, nameAfter, cost } = modal
              const isSuccess = result === 'success'
              const isBroken  = result === 'broken'
              return (
                <>
                  <div className={`forge-modal-title ${isSuccess ? 'result-success' : isBroken ? 'result-broken' : 'result-fail'}`}>
                    {isSuccess ? '強化成功！' : isBroken ? '装備破壊！' : '強化失敗'}
                  </div>
                  {isSuccess && (
                    <div className="forge-modal-body">
                      <div className="forge-modal-item">{nameBefore} →<br /><strong>{nameAfter}</strong></div>
                      <div className="forge-modal-sub">強化に成功した！</div>
                    </div>
                  )}
                  {result === 'fail' && (
                    <div className="forge-modal-body">
                      <div className="forge-modal-item">{nameBefore}</div>
                      <div className="forge-modal-sub">強化は失敗した…装備は無事だが、</div>
                      <div className="forge-modal-sub"><strong>{cost.toLocaleString()} Zel</strong> が失われた。</div>
                    </div>
                  )}
                  {isBroken && (
                    <div className="forge-modal-body forge-modal-broken-body">
                      <div className="forge-modal-item">{nameBefore}</div>
                      <div className="forge-modal-sub">強化に失敗し、装備が砕け散った！</div>
                      <div className="forge-modal-sub"><strong>{cost.toLocaleString()} Zel</strong> も失われた。</div>
                    </div>
                  )}
                  <div className="forge-modal-actions">
                    <button className="forge-modal-ok" onClick={() => {
                      if (modal.type === 'result-enhance' && modal.newTitleIds.length > 0) {
                        showTitleNotification(modal.newTitleIds)
                      }
                      setModal(null)
                    }}>OK</button>
                  </div>
                </>
              )
            })()}

            {modal.type === 'confirm-sell' && (
              <>
                <div className="forge-modal-title">売却確認</div>
                <div className="forge-modal-item">{getItemDisplayName(modal.item)}</div>
                <div className="forge-modal-info">売却額 <strong>{calcSellPrice(modal.item).toLocaleString()} Zel</strong></div>
                <div className="forge-modal-actions">
                  <button className="forge-modal-ok forge-modal-sell-ok" onClick={confirmSell}>売却する</button>
                  <button className="forge-modal-cancel" onClick={() => setModal(null)}>キャンセル</button>
                </div>
              </>
            )}

            {modal.type === 'result-sold' && (
              <>
                <div className="forge-modal-title result-success">売却完了</div>
                <div className="forge-modal-item">{modal.itemName}</div>
                <div className="forge-modal-sub"><strong>+{modal.gold.toLocaleString()} Zel</strong> を受け取った。</div>
                <div className="forge-modal-actions">
                  <button className="forge-modal-ok" onClick={() => setModal(null)}>OK</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="forge-slot-tabs">
        {(['weapon', 'armor', 'accessory'] as EquipmentSlot[]).map((slot) => {
          const count = ownedEquipment.filter((e) => e.slot === slot).length
          return (
            <button
              key={slot}
              className={`forge-slot-tab ${slotFilter === slot ? 'active' : ''}`}
              onClick={() => setSlotFilter(slot)}
            >
              {SLOT_LABEL_SHORT[slot]}
              <span className="forge-slot-tab-count">{count}</span>
            </button>
          )
        })}
        <span className={`forge-cap ${capClass}`}>所持 {ownedEquipment.length} / {EQUIPMENT_CAP}</span>
      </div>
      <div className="forge-toolbar">
        <div className="forge-sort-btns">
          {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
            <button key={k} className={`forge-sort-btn ${sortKey === k ? 'active' : ''}`} onClick={() => handleSort(k)}>
              {SORT_LABELS[k]}{sortKey === k ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
            </button>
          ))}
        </div>
      </div>
      {sorted.length === 0 ? (
        <div className="forge-empty">{SLOT_LABEL_SHORT[slotFilter]}の所持装備がありません</div>
      ) : sorted.map((item, idx) => {
        const level = item.enhancement ?? 0
        const isMax = level >= ENHANCE_MAX
        const cost = isMax ? 0 : ENHANCE_COSTS[level]
        const rate = isMax ? 0 : ENHANCE_RATES[level]
        const stats = getEnhancedStats(item)
        const canAfford = gold >= cost
        const sellPrice = calcSellPrice(item)

        const equippedBy = roster.filter((c) =>
          Object.values(c.equipment).some((e) => e?.id === item.id)
        )

        return (
          <div key={item.id + idx} className="forge-row">
            <div className="forge-item-info">
              <EquipmentIcon item={item} size={44} className="forge-item-icon" />
              <span className="forge-slot-badge">{SLOT_LABEL_SHORT[item.slot]}</span>
              {item.weaponTag && <span className="forge-tag">{WEAPON_TAG_LABEL[item.weaponTag]}</span>}
              {item.armorTag  && <span className="forge-tag">{ARMOR_TAG_LABEL[item.armorTag]}</span>}
              <span className="forge-item-name">{getItemDisplayName(item)}</span>
              {equippedBy.length > 0 && (
                <span className="forge-equipped-badge">
                  {equippedBy.map((c) => c.name).join('・')}装備中
                </span>
              )}
              <span className="forge-item-stats">
                {[stats.attackBonus > 0 && `ATK+${stats.attackBonus}`, stats.defenseBonus > 0 && `DEF+${stats.defenseBonus}`, stats.hpBonus > 0 && `HP+${stats.hpBonus}`, stats.speedBonus > 0 && `SPD+${stats.speedBonus}`].filter(Boolean).join(' ')}
              </span>
            </div>
            <div className="forge-action">
              {isMax ? (
                <span className="forge-max">MAX</span>
              ) : (
                <>
                  <span className="forge-rate">強化成功率 {rate}%</span>
                  <span className="forge-cost">{cost.toLocaleString()} Zel</span>
                  <button
                    className="forge-btn"
                    onClick={() => setModal({ type: 'confirm-enhance', item })}
                    disabled={!canAfford}
                  >
                    強化
                  </button>
                </>
              )}
              <button className="forge-sell-btn" onClick={() => setModal({ type: 'confirm-sell', item })}>
                売却 {sellPrice.toLocaleString()} Zel
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const OSS_LICENSES = [
  { name: 'React', version: '18.3', license: 'MIT', copyright: 'Copyright (c) Meta Platforms, Inc. and affiliates.' },
  { name: 'Zustand', version: '5.0', license: 'MIT', copyright: 'Copyright (c) 2019 Paul Henschel' },
  { name: 'Vite', version: '6.0', license: 'MIT', copyright: 'Copyright (c) 2019-present VoidZero Inc.' },
  { name: 'TypeScript', version: '5.6', license: 'Apache 2.0', copyright: 'Copyright (c) Microsoft Corporation' },
]

interface OptionsPanelProps {
  totalExpeditions: number
  totalClears: number
  totalGoldEarned: number
  wipeCount: number
  retreatCount: number
  onReset: () => void
  onGoTitle: () => void
  onShowStory: (chapterId: string) => void
  viewedStoryIds: string[]
}

type GameDialog =
  | { type: 'alert'; message: string; onOk: () => void }
  | { type: 'confirm'; message: string; sub?: string; onOk: () => void }

function OptionsPanel({ totalExpeditions, totalClears, totalGoldEarned, wipeCount, retreatCount, onReset, onGoTitle, onShowStory, viewedStoryIds }: OptionsPanelProps) {
  const { notifEnabled, setNotifEnabled, battleSpeed, setBattleSpeed, clearedDungeons } = useGameStore()
  const [flashMsg, setFlashMsg] = useState<string | null>(null)
  const [restoreOpen, setRestoreOpen] = useState(false)
  const [restoreInput, setRestoreInput] = useState('')
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  )
  const [dialog, setDialog] = useState<GameDialog | null>(null)

  const requestNotification = async () => {
    const perm = await Notification.requestPermission()
    setNotifPerm(perm)
    if (perm === 'granted') setNotifEnabled(true)
  }

  const flash = (msg: string) => {
    setFlashMsg(msg)
    setTimeout(() => setFlashMsg(null), 3000)
  }

  const handleBackup = () => {
    const data = exportSaveData()
    if (!data) return
    navigator.clipboard.writeText(data).then(() => flash('クリップボードにコピーしました'))
  }

  const handleRestoreConfirm = () => {
    const data = restoreInput.trim()
    if (!data) return
    if (importSaveData(data)) {
      setRestoreOpen(false)
      setDialog({ type: 'alert', message: '復元しました。ページをリロードします。', onOk: () => window.location.reload() })
    } else {
      flash('復元失敗：データが無効または改ざんされています')
      setRestoreOpen(false)
    }
  }

  const handleReset = () => {
    setDialog({
      type: 'confirm',
      message: '全ての進行データを初期化します。',
      sub: 'この操作は取り消せません。よろしいですか？',
      onOk: () => { onReset(); setDialog(null); flash('データを初期化しました') },
    })
  }

  return (
    <div className="options-panel">
      {flashMsg && <div className="options-flash">{flashMsg}</div>}

      {dialog && (
        <Dialog open onClose={dialog.type === 'alert' ? undefined : () => setDialog(null)}>
          <div className="confirm-title">{dialog.message}</div>
          {dialog.type === 'confirm' && dialog.sub && <div className="confirm-sub">{dialog.sub}</div>}
          <div className="confirm-actions">
            <button className="confirm-ok" onClick={() => { dialog.onOk() }}>
              {dialog.type === 'alert' ? 'OK' : '実行する'}
            </button>
            {dialog.type === 'confirm' && (
              <button className="confirm-cancel" onClick={() => setDialog(null)}>キャンセル</button>
            )}
          </div>
        </Dialog>
      )}

      {restoreOpen && (
        <Dialog open onClose={() => setRestoreOpen(false)} className="options-restore-dialog">
          <div className="confirm-title">データ復元</div>
          <div className="options-restore-desc">バックアップデータを貼り付けてください</div>
          <textarea
            className="options-restore-textarea"
            value={restoreInput}
            onChange={(e) => setRestoreInput(e.target.value)}
            placeholder="ここにバックアップデータを貼り付け..."
          />
          {restoreInput.length > 0 && (
            <div className="options-restore-count">{restoreInput.length.toLocaleString()} 文字</div>
          )}
          <div className="confirm-actions">
            <button className="confirm-ok" onClick={handleRestoreConfirm} disabled={!restoreInput.trim()}>
              復元する
            </button>
            <button className="confirm-cancel" onClick={() => setRestoreOpen(false)}>キャンセル</button>
          </div>
        </Dialog>
      )}

      {/* タイトルへ戻る */}
      <div className="options-section">
        <div className="options-section-title">ゲーム</div>
        <div className="options-row">
          <div className="options-row-info">
            <div className="options-row-label">タイトルへ戻る</div>
            <div className="options-row-desc">タイトル画面に戻ります（データは保存されます）</div>
          </div>
          <button className="options-btn" onClick={onGoTitle}>タイトルへ</button>
        </div>

        {/* 倍速設定（永遠の聖域クリア後に表示） */}
        {clearedDungeons.includes('eternal_sanctum') && (
          <div className="options-row">
            <div className="options-row-info">
              <div className="options-row-label">進行速度</div>
              <div className="options-row-desc">
                {!clearedDungeons.includes('chaos_trial')
                  ? '混沌の試練クリアで3倍速が解放されます'
                  : '最大3倍速が利用可能です'}
              </div>
            </div>
            <div className="options-speed-btns">
              {([1, 2, 3] as const).map((s) => {
                const unlocked = s === 1
                  || (s === 2 && clearedDungeons.includes('eternal_sanctum'))
                  || (s === 3 && clearedDungeons.includes('chaos_trial'))
                return (
                  <button
                    key={s}
                    className={`options-speed-btn ${battleSpeed === s ? 'active' : ''} ${!unlocked ? 'locked' : ''}`}
                    onClick={() => unlocked && setBattleSpeed(s)}
                    disabled={!unlocked}
                    title={!unlocked ? '未解放' : undefined}
                  >
                    {s}×
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ストーリー回想 */}
      <CollapsibleSection title="ストーリー回想" defaultCollapsed>
        {STORY_CHAPTERS_FOR_OPTIONS.filter((c) => viewedStoryIds.includes(c.id)).length === 0 && (
          <div className="options-row-desc" style={{ padding: '8px 12px', color: '#666' }}>まだ閲覧済みのストーリーがありません</div>
        )}
        {STORY_CHAPTERS_FOR_OPTIONS.filter((c) => viewedStoryIds.includes(c.id)).map((c) => (
          <div key={c.id} className="options-row">
            <div className="options-row-info">
              <div className="options-row-label">{c.title}</div>
            </div>
            <button className="options-btn" onClick={() => onShowStory(c.id)}>再生</button>
          </div>
        ))}
      </CollapsibleSection>

      {/* セーブデータ管理 */}
      <div className="options-section">
        <div className="options-section-title">セーブデータ管理</div>
        <div className="options-row">
          <div className="options-row-info">
            <div className="options-row-label">データバックアップ</div>
            <div className="options-row-desc">セーブデータをクリップボードにコピーします</div>
          </div>
          <button className="options-btn" onClick={handleBackup}>バックアップ</button>
        </div>
        <div className="options-row">
          <div className="options-row-info">
            <div className="options-row-label">データ復元</div>
            <div className="options-row-desc">バックアップデータを貼り付けて進行を復元します</div>
          </div>
          <button className="options-btn" onClick={() => { setRestoreInput(''); setRestoreOpen(true) }}>復元</button>
        </div>
        <div className="options-row">
          <div className="options-row-info">
            <div className="options-row-label">データリセット</div>
            <div className="options-row-desc">全ての進行データを消去して最初から始めます（取り消し不可）</div>
          </div>
          <button className="options-btn options-btn-danger" onClick={handleReset}>最初から</button>
        </div>
      </div>

      {/* ブラウザ通知 */}
      {'Notification' in window && (
        <div className="options-section">
          <div className="options-section-title">ブラウザ通知</div>
          <div className="options-row">
            <div className="options-row-info">
              <div className="options-row-label">探索完了・全滅通知</div>
              <div className="options-row-desc">タブを閉じていても探索が終わったら通知します</div>
            </div>
            {notifPerm === 'granted' && (
              <button
                className={`options-btn ${notifEnabled ? '' : 'options-btn-off'}`}
                onClick={() => setNotifEnabled(!notifEnabled)}
              >
                {notifEnabled ? 'ON' : 'OFF'}
              </button>
            )}
            {notifPerm === 'default' && (
              <button className="options-btn" onClick={requestNotification}>通知を許可</button>
            )}
            {notifPerm === 'denied' && (
              <span className="options-notif-denied">ブラウザ設定から許可してください</span>
            )}
          </div>
        </div>
      )}

      {/* プレイ統計 */}
      <div className="options-section">
        <div className="options-section-title">プレイ統計</div>
        <div className="options-stats-grid">
          <span className="options-stat-label">総探索回数</span>
          <span className="options-stat-val">{totalExpeditions.toLocaleString()} 回</span>
          <span className="options-stat-label">総クリア数</span>
          <span className="options-stat-val">{totalClears.toLocaleString()} 回</span>
          <span className="options-stat-label">累計獲得Zel</span>
          <span className="options-stat-val">{totalGoldEarned.toLocaleString()} Zel</span>
          <span className="options-stat-label">全滅回数</span>
          <span className="options-stat-val">{wipeCount.toLocaleString()} 回</span>
          <span className="options-stat-label">撤退回数</span>
          <span className="options-stat-val">{retreatCount.toLocaleString()} 回</span>
        </div>
      </div>

      {/* ライセンス */}
      <CollapsibleSection title="使用OSSライセンス" defaultCollapsed>
        <div className="options-license-list">
          {OSS_LICENSES.map((l) => (
            <div key={l.name} className="options-license-row">
              <span className="options-license-name">{l.name} {l.version}</span>
              <span className="options-license-type">{l.license}</span>
              <span className="options-license-copy">{l.copyright}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  )
}

type TitleFilter = 'all' | 'unlocked' | 'locked'
const TITLE_FILTER_LABELS: Record<TitleFilter, string> = { all: '全て', unlocked: '獲得済み', locked: '未獲得' }

function TitlesPanel({ unlockedTitles }: { unlockedTitles: string[] }) {
  const [filter, setFilter] = useState<TitleFilter>('all')
  const unlockedSet = new Set(unlockedTitles)
  const unlockedCount = TITLES.filter((t) => unlockedSet.has(t.id)).length

  const visible = TITLES.filter((t) => {
    if (filter === 'unlocked') return unlockedSet.has(t.id)
    if (filter === 'locked') return !unlockedSet.has(t.id)
    return true
  })

  return (
    <div className="titles-panel">
      <div className="titles-header">
        <div className="titles-count">{unlockedCount} / {TITLES.length} 称号獲得</div>
        <div className="titles-filter-btns">
          {(Object.keys(TITLE_FILTER_LABELS) as TitleFilter[]).map((f) => (
            <button key={f} className={`titles-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {TITLE_FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>
      <div className="titles-list">
        {visible.map((t) => {
          const isUnlocked = unlockedSet.has(t.id)
          if (!isUnlocked && t.hidden) {
            return (
              <div key={t.id} className="title-row locked hidden-title">
                <span className="title-desc">???</span>
              </div>
            )
          }
          return (
            <div key={t.id} className={`title-row ${isUnlocked ? 'unlocked' : 'locked'}`}>
              <span className="title-desc">{t.description}</span>
              {isUnlocked && <span className="title-name-badge">【{t.name}】</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface CharDetailProps {
  char: Character
  inParty: boolean
  partyFull: boolean
  ownedEquipment: Equipment[]
  roster: Character[]
  equipSlot: EquipmentSlot
  onEquipSlotChange: (slot: EquipmentSlot) => void
  onEquipClick: (itemId: string) => void
  onUnequip: (slot: EquipmentSlot) => void
  onToggleParty: () => void
  onSetActiveSkills: (ids: string[]) => void
  onSetStance: (stance: Stance) => void
  scrollContainerRef: React.RefObject<HTMLDivElement>
}

function CharDetail({
  char, inParty, partyFull, ownedEquipment, roster,
  equipSlot, onEquipSlotChange, onEquipClick, onUnequip, onToggleParty, onSetActiveSkills, onSetStance, scrollContainerRef,
}: CharDetailProps) {
  const hpPct = char.maxHp > 0 ? (char.hp / char.maxHp) * 100 : 0
  const [equipSortKey, setEquipSortKey] = useState<EquipSortKey>('enhancement')
  const [equipSortDir, setEquipSortDir] = useState<SortDir>('desc')
  const [swapSkillId, setSwapSkillId] = useState<string | null>(null)
  const candidates = ownedEquipment.filter((e) => e.slot === equipSlot && canEquip(e, char.class))
  const learnedSkills = getLearnedSkills(char.class, char.level)
  const equipSectionRef = useRef<HTMLDivElement>(null)
  const equippedItemId = char.equipment[equipSlot]?.id ?? null
  const prevStateRef = useRef({ charId: char.id, equippedItemId })
  useEffect(() => {
    const prev = prevStateRef.current
    const charChanged = prev.charId !== char.id
    prevStateRef.current = { charId: char.id, equippedItemId }
    if (charChanged || prev.equippedItemId === equippedItemId) return
    const panel = scrollContainerRef?.current
    const section = equipSectionRef.current
    if (!panel || !section) return
    panel.scrollTo({ top: section.offsetTop, behavior: 'smooth' })
  }, [equippedItemId, char.id])

  const handleEquipSort = (key: EquipSortKey) => {
    if (equipSortKey === key) setEquipSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setEquipSortKey(key); setEquipSortDir('desc') }
  }

  const sortedCandidates = [...candidates].sort((a, b) => {
    const ownA = char.equipment[equipSlot]?.id === a.id ? 1 : 0
    const ownB = char.equipment[equipSlot]?.id === b.id ? 1 : 0
    if (ownA !== ownB) return ownB - ownA
    const sa = getEnhancedStats(a), sb = getEnhancedStats(b)
    let diff = 0
    if (equipSortKey === 'enhancement') diff = (b.enhancement ?? 0) - (a.enhancement ?? 0)
    else if (equipSortKey === 'atk') diff = sb.attackBonus - sa.attackBonus
    else if (equipSortKey === 'def') diff = sb.defenseBonus - sa.defenseBonus
    else if (equipSortKey === 'hp') diff = sb.hpBonus - sa.hpBonus
    else diff = (sb.speedBonus ?? 0) - (sa.speedBonus ?? 0)
    return equipSortDir === 'asc' ? -diff : diff
  })
  const activeIds = char.skills.map((s) => s.id)

  const toggleSkill = (skillId: string) => {
    if (activeIds.includes(skillId)) {
      onSetActiveSkills(activeIds.filter((id) => id !== skillId))
    } else if (activeIds.length < 3) {
      onSetActiveSkills([...activeIds, skillId])
    } else {
      // スロットが埋まっている → 入れ替えダイアログを表示
      setSwapSkillId(skillId)
    }
  }

  const confirmSwap = (replaceId: string) => {
    if (!swapSkillId) return
    onSetActiveSkills(activeIds.map((id) => (id === replaceId ? swapSkillId : id)))
    setSwapSkillId(null)
  }

  const findWearer = (itemId: string) =>
    roster.find((c) => c.id !== char.id && Object.values(c.equipment).some((e) => e?.id === itemId))

  return (
    <div className="char-detail">
      <button
        className={`toggle-party-btn ${inParty ? 'remove' : 'add'} party-btn-corner`}
        onClick={onToggleParty}
      >
        {inParty ? 'パーティから外す' : partyFull ? 'メンバーを変更' : 'パーティに追加'}
      </button>
      {/* ヘッダー：バストアップ左 + ステータス右 */}
      <div className="char-detail-header">
        <CharPortrait cls={char.class} width={130} height={165} />
        <div className="char-detail-right">
          <div className="char-detail-identity">
            <span className="char-detail-name">{char.name}</span>
            <div className="char-detail-meta">
              <span className={`class-badge ${char.class}`}>{CLASS_LABEL[char.class]}</span>
              <span className="char-detail-level">Lv.{char.level}</span>
            </div>
          </div>
          <div className="hp-bar-wrap">
            <span className="hp-text">HP {char.hp}/{char.maxHp}</span>
            <div className="hp-bar"><div className="hp-fill" style={{ width: `${hpPct}%` }} /></div>
          </div>
          <div className="hp-bar-wrap">
            <span className="hp-text">MP {char.mp}/{char.maxMp}</span>
            <div className="hp-bar"><div className="mp-fill" style={{ width: `${char.maxMp > 0 ? (char.mp / char.maxMp) * 100 : 0}%` }} /></div>
          </div>
          <div className="stat-chips">
            <span className="stat-chip">ATK {char.attack}</span>
            <span className="stat-chip">DEF {char.defense}</span>
            <span className="stat-chip" title="高いほど行動が速い">SPD {char.speed}</span>
            {(() => {
              const { current, needed } = expProgress(char)
              return <span className="stat-chip">EXP {current}/{needed}</span>
            })()}
          </div>
        </div>
      </div>

      <div className="section-divider" />

      {/* スタンスセクション */}
      <div className="detail-section">
        <div className="detail-section-title">スタンス</div>
        <div className="stance-grid">
          {(Object.keys(STANCE_LABELS) as Stance[]).map((s) => (
            <button
              key={s}
              className={`stance-btn ${char.stance === s ? 'active' : ''}`}
              onClick={() => onSetStance(s)}
            >
              {STANCE_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="stance-desc">{STANCE_DESCRIPTIONS[char.stance]}</div>
      </div>

      <div className="section-divider" />

      {/* 装備セクション */}
      <div className="detail-section" ref={equipSectionRef}>
        <div className="detail-section-title">装備</div>
        <div className="equip-slot-filter">
          {(['weapon', 'armor', 'accessory'] as EquipmentSlot[]).map((slot) => {
            const equipped = char.equipment[slot]
            return (
              <button
                key={slot}
                className={`equip-filter-btn ${equipSlot === slot ? 'active' : ''}`}
                onClick={() => onEquipSlotChange(slot)}
              >
                {equipped
                  ? <EquipmentIcon item={equipped} size={20} className="equip-slot-icon" />
                  : null}
                {SLOT_LABEL[slot]}
              </button>
            )
          })}
        </div>

        {candidates.length > 0 && (
          <div className="equip-sort-toolbar">
            {(Object.keys(EQUIP_SORT_LABELS) as EquipSortKey[]).map((k) => (
              <button key={k} className={`equip-sort-btn ${equipSortKey === k ? 'active' : ''}`} onClick={() => handleEquipSort(k)}>
                {EQUIP_SORT_LABELS[k]}{equipSortKey === k ? (equipSortDir === 'asc' ? ' ↑' : ' ↓') : ''}
              </button>
            ))}
          </div>
        )}

        {candidates.length === 0 ? (
          <div className="equip-empty-slot">— {SLOT_LABEL[equipSlot]}の所持装備なし —</div>
        ) : (
          <div className="equip-list">
            {sortedCandidates.map((item, idx) => {
              const isOwn = char.equipment[equipSlot]?.id === item.id
              const wearer = findWearer(item.id)
              const currentEquipped = char.equipment[equipSlot]
              const s = getEnhancedStats(item)
              const base = currentEquipped && !isOwn ? getEnhancedStats(currentEquipped) : null
              const diffs = base
                ? [
                    { label: 'ATK', val: s.attackBonus - base.attackBonus },
                    { label: 'DEF', val: s.defenseBonus - base.defenseBonus },
                    { label: 'HP',  val: s.hpBonus - base.hpBonus },
                    { label: 'SPD', val: s.speedBonus - base.speedBonus },
                  ].filter((d) => d.val !== 0)
                : null
              return (
                <div
                  key={item.id + idx}
                  className={`equip-row ${isOwn ? 'own-equipped' : ''}`}
                  onClick={() => isOwn ? onUnequip(equipSlot) : onEquipClick(item.id)}
                >
                  <div className="equip-row-main">
                    <EquipmentIcon item={item} size={48} className={`equip-row-icon${isOwn ? ' equipped' : ''}`} />
                    {item.weaponTag && <span className="equip-tag">{WEAPON_TAG_LABEL[item.weaponTag]}</span>}
                    {item.armorTag  && <span className="equip-tag">{ARMOR_TAG_LABEL[item.armorTag]}</span>}
                    <span className="equip-row-name">{getItemDisplayName(item)}</span>
                    <span className="equip-stats">
                      {[s.attackBonus > 0 && `ATK+${s.attackBonus}`, s.defenseBonus > 0 && `DEF+${s.defenseBonus}`, s.hpBonus > 0 && `HP+${s.hpBonus}`, s.speedBonus > 0 && `SPD+${s.speedBonus}`].filter(Boolean).join(' ')}
                    </span>
                  </div>
                  <div className="equip-row-sub">
                    {isOwn
                      ? <span className="equip-equipped-label">装備中（クリックで外す）</span>
                      : wearer
                        ? <span className="equip-wearer">△ {wearer.name}が装備中</span>
                        : <span className="equip-hint">クリックで装備</span>
                    }
                    {diffs && diffs.length > 0 && (
                      <span className="equip-compare">
                        {diffs.map((d) => (
                          <span key={d.label} className={`equip-diff ${d.val > 0 ? 'up' : 'down'}`}>
                            {d.label}{d.val > 0 ? `+${d.val}` : d.val}
                          </span>
                        ))}
                      </span>
                    )}
                    {diffs && diffs.length === 0 && !isOwn && currentEquipped && (
                      <span className="equip-compare"><span className="equip-diff same">同等</span></span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="section-divider" />

      {/* スキル入れ替えダイアログ */}
      {swapSkillId !== null && (() => {
        const incoming = learnedSkills.find((s) => s.id === swapSkillId)!
        return (
          <Dialog open onClose={() => setSwapSkillId(null)} className="swap-dialog">
            <div className="confirm-title">どのスキルと入れ替えますか？</div>
            <div className="swap-incoming-skill">
              <span className={`skill-tag ${incoming.type}`}>{SKILL_TYPE_LABEL[incoming.type]}</span>
              <span className="swap-incoming-name">{incoming.name}</span>
              {incoming.mpCost > 0 && <span className="skill-mp-cost">MP{incoming.mpCost}</span>}
            </div>
            <div className="swap-member-list">
              {char.skills.map((skill) => (
                <button key={skill.id} className="swap-member-btn" onClick={() => confirmSwap(skill.id)}>
                  <span className={`skill-tag ${skill.type}`}>{SKILL_TYPE_LABEL[skill.type]}</span>
                  <span>{skill.name}</span>
                  {skill.mpCost > 0 && <span className="skill-mp-cost">MP{skill.mpCost}</span>}
                </button>
              ))}
            </div>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setSwapSkillId(null)}>キャンセル</button>
            </div>
          </Dialog>
        )
      })()}

      {/* スキルセクション */}
      <div className="detail-section">
        <div className="detail-section-title">スキルスロット（最大3）</div>

        <div className="skill-slots">
          {[0, 1, 2].map((i) => {
            const skill = char.skills[i]
            return (
              <div key={i} className={`skill-slot ${skill ? 'filled' : 'empty'}`}>
                {skill ? (
                  <>
                    <span className={`skill-tag ${skill.type}`}>{SKILL_TYPE_LABEL[skill.type]}</span>
                    <span className="skill-slot-name">{skill.name}</span>
                    {skill.mpCost > 0 && <span className="skill-mp-cost">MP{skill.mpCost}</span>}
                    <button className="skill-slot-remove" onClick={() => toggleSkill(skill.id)}>×</button>
                  </>
                ) : (
                  <span className="skill-slot-empty">空き</span>
                )}
              </div>
            )
          })}
        </div>

        {learnedSkills.length > 0 ? (
          <div className="skill-pool">
            <div className="skill-pool-label">習得済みスキル（クリックで追加／解除）</div>
            {learnedSkills.map((skill) => {
              const isActive = activeIds.includes(skill.id)
              return (
                <div
                  key={skill.id}
                  className={`skill-pool-item ${isActive ? 'active' : ''}`}
                  onClick={() => toggleSkill(skill.id)}
                >
                  <span className={`skill-tag ${skill.type}`}>{SKILL_TYPE_LABEL[skill.type]}</span>
                  <span className="skill-pool-name">{skill.name}</span>
                  {skill.element && skill.element !== 'none' && <span className={`elem-badge elem-${skill.element}`}>{ELEMENT_LABEL[skill.element]}</span>}
                  {skill.mpCost > 0 && <span className="skill-mp-cost">MP{skill.mpCost}</span>}
                  <span className="skill-pool-desc">{skill.description}</span>
                  {isActive && <span className="skill-pool-check">✓</span>}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="no-skills">スキルなし（レベルアップで習得）</div>
        )}
      </div>
    </div>
  )
}
