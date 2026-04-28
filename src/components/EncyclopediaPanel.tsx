import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { DUNGEONS } from '../game/dungeon/DungeonData'
import { ENEMY_POOL, BOSS_DATA } from '../game/dungeon/EnemyData'
import { EQUIPMENT_MASTER, WEAPON_TAG_LABEL, ARMOR_TAG_LABEL, getItemRarity } from '../game/equipment/EquipmentData'
import { ELEMENT_LABEL } from '../game/combat/CombatEngine'
import { EquipmentIcon } from './EquipmentIcon'
import { CollapsibleSection } from './CollapsibleSection'
import type { EquipmentSlot, SpecialEffect, EnemySkill, Enemy } from '../types'

type EncTab = 'enemy' | 'equipment'
type EquipFilter = 'all' | EquipmentSlot

const SLOT_LABEL: Record<EquipmentSlot, string> = { weapon: '武器', armor: '防具', accessory: 'アクセサリ' }
const EQUIP_FILTER_LABELS: Record<EquipFilter, string> = { all: '全て', weapon: '武器', armor: '防具', accessory: 'アクセサリ' }

const SPECIAL_EFFECT_LABEL: Record<string, (value?: number, element?: string) => string> = {
  mp_cost_ratio:  (v) => `MPコスト×${v}`,
  atk_zero:       ()  => 'ATK固定0（回復特化）',
  hp_regen:       (v) => `毎行動HP+${Math.round((v ?? 0) * 100)}%回復`,
  mp_regen:       (v) => `毎行動MP+${Math.round((v ?? 0) * 100)}%回復`,
  lifesteal:      (v) => `ダメージの${Math.round((v ?? 0) * 100)}%をHP吸収`,
  element_boost:  (v, e) => `${e ? ELEMENT_LABEL[e as keyof typeof ELEMENT_LABEL] ?? e : ''}属性+${Math.round((v ?? 0) * 100)}%`,
  healing_boost:  (v) => `回復量+${Math.round((v ?? 0) * 100)}%`,
  crit_chance:    (v) => `会心率+${Math.round((v ?? 0) * 100)}%`,
  auto_revive:    ()  => '戦闘不能を1回防ぐ（HP1で復帰）',
  last_stand:     (v) => `HP25%以下でATK+${Math.round((v ?? 0) * 100)}%`,
}

function formatSpecialEffect(eff: SpecialEffect): string {
  const fn = SPECIAL_EFFECT_LABEL[eff.type]
  return fn ? fn(eff.value, eff.element) : eff.type
}

const BASE = import.meta.env.BASE_URL

function EnemyIcon({ enemy, isBoss }: { enemy: Enemy; isBoss?: boolean }) {
  const src = `${BASE}images/enemies/${enemy.id}_icon.png`
  return (
    <img
      src={src}
      alt={enemy.name}
      width={36}
      height={36}
      style={{
        borderRadius: 4,
        border: `1px solid ${isBoss ? '#6a2a2a' : '#2a2a4a'}`,
        flexShrink: 0,
        objectFit: 'cover',
        background: '#1a1a2e',
      }}
      onError={(e) => {
        const t = e.currentTarget
        t.style.display = 'none'
        const span = document.createElement('span')
        span.textContent = isBoss ? '💀' : '👾'
        span.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;font-size:20px;background:#1a1a2e;border-radius:4px;border:1px solid #2a2a4a;flex-shrink:0;'
        t.parentNode?.insertBefore(span, t)
      }}
    />
  )
}

function formatEnemySkillEffect(skill: EnemySkill): string {
  const e = skill.effect
  const parts: string[] = []
  if (e.type === 'attack_single') parts.push(`単体攻撃×${e.power ?? 1.5}`)
  else if (e.type === 'attack_all') parts.push(`全体攻撃×${e.power ?? 1.5}`)
  else if (e.type === 'heal_self') parts.push(`自己回復${Math.round((e.healRate ?? 0.1) * 100)}%`)
  else if (e.type === 'debuff_all') parts.push(`全体${e.debuff ?? ''}付与`)
  else if (e.type === 'debuff_single') parts.push(`単体${e.debuff ?? ''}付与`)
  if (e.element && e.element !== 'none') parts.push(ELEMENT_LABEL[e.element])
  if (e.debuffChance != null && e.debuffChance < 1) parts.push(`${Math.round(e.debuffChance * 100)}%`)
  const cdSec = Math.round(skill.cooldownMs / 1000)
  parts.push(`CD${cdSec}s  MP${skill.mpCost}`)
  const condLabel = skill.condition === 'hp_below_50' ? 'HP50%以下' : skill.condition === 'hp_below_25' ? 'HP25%以下' : null
  if (condLabel) parts.push(condLabel)
  return parts.join(' / ')
}

function EnemyRow({ enemy, debugMode, defeatedSet, discoveredSet, isBoss = false }: {
  enemy: Enemy
  debugMode: boolean
  defeatedSet: Set<string>
  discoveredSet: Set<string>
  isBoss?: boolean
}) {
  const known = debugMode || defeatedSet.has(enemy.id)
  const hasSkills = (enemy.skills?.length ?? 0) > 0
  const visibleDrops = enemy.drops
    ? (debugMode ? enemy.drops : enemy.drops.filter((d) => discoveredSet.has(d.itemId)))
    : []
  return (
    <div className={`enc-enemy-row ${isBoss ? 'enc-boss-row' : ''} ${known ? 'known' : 'unknown'}`}>
      {known ? (
        <div className="enc-enemy-main">
          <EnemyIcon enemy={enemy} isBoss={isBoss} />
          <div className="enc-enemy-info">
            <div className="enc-enemy-nameline">
              {isBoss && <span className="enc-boss-badge">BOSS</span>}
              <span className="enc-enemy-name">{enemy.name}</span>
              {enemy.element && enemy.element !== 'none' && (
                <span className={`elem-badge elem-${enemy.element}`}>{ELEMENT_LABEL[enemy.element]}</span>
              )}
              {hasSkills && <span className="enc-skill-badge">スキル</span>}
              {(enemy.floorMin != null || enemy.floorMax != null) && (
                <span className="enc-floor-badge">
                  {enemy.floorMin != null && enemy.floorMax != null
                    ? `${enemy.floorMin}〜${enemy.floorMax}F`
                    : enemy.floorMin != null
                    ? `${enemy.floorMin}F〜`
                    : `〜${enemy.floorMax}F`}
                </span>
              )}
            </div>
            <div className="enc-enemy-statline">
              <span>HP {enemy.maxHp}</span>
              {enemy.maxMp ? <span>MP {enemy.maxMp}</span> : null}
              <span>ATK {enemy.attack}</span>
              <span>DEF {enemy.defense}</span>
              <span>SPD {enemy.speed ?? 24}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="enc-enemy-main">
          {isBoss && <span className="enc-boss-badge">BOSS</span>}
          <span className="enc-enemy-name">???</span>
        </div>
      )}
      {known && hasSkills && (
        <div className="enc-skill-list">
          {enemy.skills!.map((sk) => (
            <div key={sk.id} className="enc-skill-row">
              <span className="enc-skill-name">{sk.name}</span>
              <span className="enc-skill-desc">{formatEnemySkillEffect(sk)}</span>
            </div>
          ))}
        </div>
      )}
      {known && visibleDrops.length > 0 && (
        <div className="enc-drop-list">
          {visibleDrops.map((d) => {
            const item = EQUIPMENT_MASTER.find((e) => e.id === d.itemId)
            if (!item) return null
            return (
              <div key={d.itemId} className="enc-drop-row">
                <span className="enc-drop-label">DROP</span>
                <span className="enc-drop-name">{item.name}</span>
                <span className="enc-drop-chance">{Math.round(d.chance * 100)}%</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function EncyclopediaPanel() {
  const { defeatedEnemyIds, discoveredEquipmentIds, unlockedDungeons, debugViewAllEnemies } = useGameStore()
  const [tab, setTab] = useState<EncTab>('enemy')
  const [equipFilter, setEquipFilter] = useState<EquipFilter>('all')
  const debugMode = debugViewAllEnemies

  const defeatedSet = new Set(defeatedEnemyIds)
  const discoveredSet = new Set(discoveredEquipmentIds)
  const unlockedSet = new Set(unlockedDungeons)

  const totalEnemyCount = Object.values(ENEMY_POOL).flat().length + Object.keys(BOSS_DATA).length
  const defeatedCount = debugMode ? totalEnemyCount : defeatedSet.size

  return (
    <div className="enc-panel">
      <div className="enc-tabs">
        {(['enemy', 'equipment'] as EncTab[]).map((t) => (
          <button key={t} className={`enc-tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'enemy' ? `敵図鑑 ${defeatedCount}/${totalEnemyCount}` : `装備図鑑 ${discoveredSet.size}/${EQUIPMENT_MASTER.length}`}
          </button>
        ))}
      </div>

      {tab === 'enemy' ? (
        <div className="enc-body">
          {DUNGEONS.map((dungeon) => {
            const isUnlocked = debugMode || unlockedSet.has(dungeon.id)
            const pool = ENEMY_POOL[dungeon.id] ?? []
            const boss = BOSS_DATA[dungeon.id]
            const dungeonDefeated = pool.filter((e) => debugMode || defeatedSet.has(e.id)).length
              + (boss && (debugMode || defeatedSet.has(boss.id)) ? 1 : 0)
            const totalCount = pool.length + (boss ? 1 : 0)

            if (isUnlocked) {
              return (
                <CollapsibleSection
                  key={dungeon.id}
                  title={dungeon.name}
                  count={`${dungeonDefeated} / ${totalCount}`}
                  countComplete={dungeonDefeated === totalCount}
                >
                  {pool.map((enemy) => (
                    <EnemyRow key={enemy.id} enemy={enemy} debugMode={debugMode} defeatedSet={defeatedSet} discoveredSet={discoveredSet} />
                  ))}
                  {boss && (
                    <EnemyRow enemy={boss} debugMode={debugMode} defeatedSet={defeatedSet} discoveredSet={discoveredSet} isBoss />
                  )}
                </CollapsibleSection>
              )
            }

            return (
              <div key={dungeon.id} className="enc-dungeon-group locked">
                <div className="enc-dungeon-header">
                  <span className="enc-dungeon-name">???</span>
                  <div className="enc-dungeon-header-right">
                    <span className="enc-count">? / ?</span>
                  </div>
                </div>
                <div className="enc-enemy-row unknown">
                  <div className="enc-enemy-main">
                    <span className="enc-enemy-name">???</span>
                  </div>
                </div>
                {boss && (
                  <div className="enc-enemy-row enc-boss-row unknown">
                    <div className="enc-enemy-main">
                      <span className="enc-boss-badge">BOSS</span>
                      <span className="enc-enemy-name">???</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="enc-body">
          <div className="enc-equip-filter">
            {(Object.keys(EQUIP_FILTER_LABELS) as EquipFilter[]).map((f) => (
              <button key={f} className={`enc-filter-btn ${equipFilter === f ? 'active' : ''}`} onClick={() => setEquipFilter(f)}>
                {EQUIP_FILTER_LABELS[f]}
              </button>
            ))}
          </div>

          {EQUIPMENT_MASTER
            .filter((e) => equipFilter === 'all' || e.slot === equipFilter)
            .map((item) => {
              const known = discoveredSet.has(item.id)
              return (
                <div key={item.id} className={`enc-equip-row ${known ? 'known' : 'unknown'}`}>
                  <div className="enc-equip-main">
                    <EquipmentIcon item={item} size={44} className="enc-equip-icon" />
                    <span className="enc-slot-badge">{SLOT_LABEL[item.slot]}</span>
                    {known ? (
                      <>
                        {item.weaponTag && <span className="enc-tag">{WEAPON_TAG_LABEL[item.weaponTag]}</span>}
                        {item.armorTag  && <span className="enc-tag">{ARMOR_TAG_LABEL[item.armorTag]}</span>}
                        {getItemRarity(item) === 'rare' && <span className="enc-rarity-badge rarity-rare">レア</span>}
                        {item.bossOnly  && <span className="enc-tag enc-boss-only">ボス限定</span>}
                        <span className="enc-equip-name">{item.name}</span>
                        {item.element && item.element !== 'none' && (
                          <span className={`elem-badge elem-${item.element}`}>{ELEMENT_LABEL[item.element]}</span>
                        )}
                      </>
                    ) : (
                      <span className="enc-equip-name unknown-name">???</span>
                    )}
                  </div>

                  {known && (
                    <>
                      <div className="enc-equip-stats">
                        {[
                          item.attackBonus  > 0 && `ATK+${item.attackBonus}`,
                          item.defenseBonus > 0 && `DEF+${item.defenseBonus}`,
                          item.hpBonus      > 0 && `HP+${item.hpBonus}`,
                          item.speedBonus && item.speedBonus > 0 && `SPD+${item.speedBonus}`,
                        ].filter(Boolean).join('  ')}
                        {item.elementResist && Object.entries(item.elementResist)
                          .filter(([, v]) => v && v > 0)
                          .map(([el, v]) => `  ${ELEMENT_LABEL[el as keyof typeof ELEMENT_LABEL]}耐性+${Math.round((v ?? 0) * 100)}%`)
                          .join('')}
                      </div>
                      {item.specialEffects && item.specialEffects.length > 0 && (
                        <div className="enc-equip-effects">
                          {item.specialEffects.map((eff, i) => (
                            <span key={i} className="enc-effect-chip">{formatSpecialEffect(eff)}</span>
                          ))}
                        </div>
                      )}
                      <div className="enc-equip-desc">{item.description}</div>
                    </>
                  )}
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
