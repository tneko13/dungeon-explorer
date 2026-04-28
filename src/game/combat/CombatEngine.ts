import type { Character, Enemy, EnemySkill, ElementType, StatusEffect, StatusEntry, BuffType, BuffEntry, FloorPlan, Stance, ActiveCombatState, StanceModifiers, SkillCard, SkillAutoCondition, PendingCombatMod } from '../../types'
import {
  getMpCostRatio, getElementBoostMul, getLifestealRate,
  getCritBonus, getLastStandMul, getHpRegenRate, getMpRegenRate,
  getWeaponElement, getElementResist, hasAutoRevive,
} from '../equipment/EquipmentData'

// 素早さ(speed)から行動間隔(ms)を導出: 後方互換のため残す（内部では使用しない）
export function speedToInterval(speed: number): number {
  return speed > 0 ? Math.round(60000 / speed) : 3000
}

/** 1ターン = 1秒（ゲーム内時間）*/
export const ROUND_MS = 1000

// ダメージ計算: ±15%の分散 + 1%で天機（2倍）
function rollDamage(base: number): { damage: number; isCrit: boolean } {
  const variance = 0.85 + Math.random() * 0.30
  const isCrit = Math.random() < 0.01
  return {
    damage: Math.max(1, Math.round(base * variance * (isCrit ? 2 : 1))),
    isCrit,
  }
}

function rollCrit(): boolean { return Math.random() < 0.01 }

// 属性相性
// 状態異常
export const STATUS_LABEL: Record<StatusEffect, string> = {
  poison: '腐毒', stagger: '硬直', bind: '束縛', seal_atk: '封力', seal_def: '封守',
}
const STATUS_DURATION: Record<StatusEffect, number> = {
  poison: 4, stagger: 1, bind: 3, seal_atk: 4, seal_def: 4,
}
const STATUS_CHANCE: Record<StatusEffect, number> = {
  poison: 0.55, stagger: 0.40, bind: 0.50, seal_atk: 0.55, seal_def: 0.55,
}
const STACKABLE_DEBUFFS: StatusEffect[] = ['seal_atk', 'seal_def', 'bind']
const MAX_STACKS = 3

export function tryAddStatus(statuses: StatusEntry[], type: StatusEffect): { statuses: StatusEntry[]; applied: boolean } {
  if (Math.random() >= STATUS_CHANCE[type]) return { statuses, applied: false }
  return { statuses: addStatus(statuses, type), applied: true }
}
export function addStatus(statuses: StatusEntry[], type: StatusEffect): StatusEntry[] {
  const i = statuses.findIndex((s) => s.type === type)
  if (i >= 0) {
    const upd = [...statuses]
    const newStacks = STACKABLE_DEBUFFS.includes(type) ? Math.min((upd[i].stacks ?? 1) + 1, MAX_STACKS) : 1
    upd[i] = { type, actionsLeft: STATUS_DURATION[type], stacks: newStacks }
    return upd
  }
  return [...statuses, { type, actionsLeft: STATUS_DURATION[type], stacks: 1 }]
}
function tickStatuses(statuses: StatusEntry[]): StatusEntry[] {
  return statuses.map((s) => ({ ...s, actionsLeft: s.actionsLeft - 1 })).filter((s) => s.actionsLeft > 0)
}

// ============================================================
// バフシステム
// ============================================================
export const BUFF_LABEL: Record<BuffType, string> = {
  atk_up: '攻↑', def_up: '守↑', spd_up: '速↑', regen: '再生', barrier: '結界', focus: '集中', guard: '加護',
}
const BUFF_DURATION: Record<BuffType, number> = {
  atk_up: 3, def_up: 3, spd_up: 3, regen: 4, barrier: 50, focus: 50, guard: 50,
}
const STACKABLE_BUFFS: BuffType[] = ['atk_up', 'def_up', 'spd_up']
const BUFF_COUNTERS: Partial<Record<BuffType, StatusEffect>> = {
  atk_up: 'seal_atk', def_up: 'seal_def', spd_up: 'bind',
}

export function addBuff(buffs: BuffEntry[], type: BuffType): BuffEntry[] {
  const i = buffs.findIndex((b) => b.type === type)
  if (i >= 0) {
    const upd = [...buffs]
    const stacks = STACKABLE_BUFFS.includes(type) ? Math.min(upd[i].stacks + 1, MAX_STACKS) : 1
    upd[i] = { type, actionsLeft: BUFF_DURATION[type], stacks }
    return upd
  }
  return [...buffs, { type, actionsLeft: BUFF_DURATION[type], stacks: 1 }]
}
function tickBuffs(buffs: BuffEntry[]): BuffEntry[] {
  return buffs.map((b) => ({ ...b, actionsLeft: b.actionsLeft - 1 })).filter((b) => b.actionsLeft > 0)
}

// スタック別乗数
function buffAtkMul(s: number)     { return [1.25, 1.5, 1.7][s - 1] ?? 1.0 }
function buffDefMul(s: number)     { return [1.25, 1.5, 1.7][s - 1] ?? 1.0 }
function debuffAtkMul(s: number)   { return [0.70, 0.50, 0.35][s - 1] ?? 1.0 }
function debuffDefMul(s: number)   { return [0.70, 0.50, 0.35][s - 1] ?? 1.0 }

export type CombatLogType = 'ally_attack' | 'ally_heal' | 'ally_buff' | 'enemy_attack' | 'enemy_heal' | 'enemy_buff'
export interface CombatLogEntry { message: string; type: CombatLogType }
const allyAtk   = (msg: string): CombatLogEntry => ({ message: msg, type: 'ally_attack' })
const allyHeal  = (msg: string): CombatLogEntry => ({ message: msg, type: 'ally_heal' })
const allyBuff  = (msg: string): CombatLogEntry => ({ message: msg, type: 'ally_buff' })
const enemyAtk  = (msg: string): CombatLogEntry => ({ message: msg, type: 'enemy_attack' })
const enemyBuff = (msg: string): CombatLogEntry => ({ message: msg, type: 'enemy_buff' })

export const ELEMENT_LABEL: Record<ElementType, string> = {
  none: '無', fire: '火', ice: '氷', thunder: '雷', light: '光', dark: '闇',
}

// 火は雷に弱い / 氷は火に弱い / 雷は氷に弱い
const ELEMENT_BEATEN_BY: Partial<Record<ElementType, ElementType>> = {
  fire: 'thunder', ice: 'fire', thunder: 'ice',
}

export function calcElementMul(attackElem: ElementType = 'none', defElem: ElementType = 'none'): number {
  if (attackElem === 'none' || defElem === 'none') return 1
  const isLightDark = (e: ElementType) => e === 'light' || e === 'dark'
  if (isLightDark(attackElem) || isLightDark(defElem)) {
    if (attackElem === defElem) return 0.5
    if (isLightDark(attackElem) && isLightDark(defElem)) return 1.5
    return 1
  }
  // 火/氷/雷: 弱点属性に1.5倍、苦手属性に0.5倍
  if (ELEMENT_BEATEN_BY[defElem as ElementType] === attackElem) return 1.5
  if (ELEMENT_BEATEN_BY[attackElem] === defElem) return 0.5
  return 1
}

export const STANCE_LABELS: Record<Stance, string> = {
  normal:     '様子見',
  aggressive: '全力攻撃',
  defensive:  '守り重視',
  conserve:   'MP温存',
  magic:      '魔法集中',
  swift:      '手数重視',
  healer:     '回復専念',
  support:    '補助専念',
}

export const STANCE_DESCRIPTIONS: Record<Stance, string> = {
  normal:     '全スキルを状況に応じて使う。バランス型。',
  aggressive: '攻撃・特殊スキルのみ使用。火力全振り。',
  defensive:  '回復・強化スキルのみ使用。守り番。',
  conserve:   'スキルを一切使わずMPon存。',
  magic:      '攻撃・特殊スキルのみ使用。呼文特化。',
  swift:      'スキルを使わず手数で押す。',
  healer:     '回復スキルのみ使用。回復特化。',
  support:    '強化・弱化スキルのみ使用。補助特化（バフ実装待ち）。',
}

export const STANCE_MODIFIERS: Record<Stance, StanceModifiers> = {
  normal:     { atkMul: 1.0, defMul: 1.0, intervalMul: 1.0, skillDmgMul: 1.0, mpCostMul: 1.0, mpRecoveryMul: 1.0, skillFilter: null },
  aggressive: { atkMul: 1.0, defMul: 1.0, intervalMul: 1.0, skillDmgMul: 1.0, mpCostMul: 1.0, mpRecoveryMul: 1.0, skillFilter: ['attack'] },
  defensive:  { atkMul: 1.0, defMul: 1.0, intervalMul: 1.0, skillDmgMul: 1.0, mpCostMul: 1.0, mpRecoveryMul: 1.0, skillFilter: ['heal', 'buff'] },
  conserve:   { atkMul: 1.0, defMul: 1.0, intervalMul: 1.0, skillDmgMul: 1.0, mpCostMul: 1.0, mpRecoveryMul: 1.0, skillFilter: [] },
  magic:      { atkMul: 1.0, defMul: 1.0, intervalMul: 1.0, skillDmgMul: 1.0, mpCostMul: 1.0, mpRecoveryMul: 1.0, skillFilter: ['attack'] },
  swift:      { atkMul: 1.0, defMul: 1.0, intervalMul: 1.0, skillDmgMul: 1.0, mpCostMul: 1.0, mpRecoveryMul: 1.0, skillFilter: [] },
  healer:     { atkMul: 1.0, defMul: 1.0, intervalMul: 1.0, skillDmgMul: 1.0, mpCostMul: 1.0, mpRecoveryMul: 1.0, skillFilter: ['heal'] },
  support:    { atkMul: 1.0, defMul: 1.0, intervalMul: 1.0, skillDmgMul: 1.0, mpCostMul: 1.0, mpRecoveryMul: 1.0, skillFilter: ['buff', 'debuff'] },
}

export const STANCE_COOLDOWN_ACTIONS = 3

export interface CombatStepResult {
  combat: ActiveCombatState
  partyHp: number[]
  partyMp: number[]
  done: boolean
  victory: boolean
  expGained: number
  goldGained: number
  consumedMs: number
  log: CombatLogEntry[]
}

export function createCombatState(floor: FloorPlan, party: Character[], stances: Stance[], pendingMods: PendingCombatMod[] = []): ActiveCombatState {
  const initialBuffs: BuffEntry[][] = party.map(() => [])
  const initialStatuses: StatusEntry[][] = party.map(() => [])
  const autoReviveUsed: boolean[] = party.map(() => false)

  for (const mod of pendingMods) {
    const indices = mod.memberIdx !== null ? [mod.memberIdx] : party.map((_, i) => i)
    for (const idx of indices) {
      if (idx >= party.length) continue
      if (mod.type === 'curse') {
        initialStatuses[idx] = addStatus(addStatus(initialStatuses[idx], 'seal_atk'), 'seal_def')
      } else if (mod.type === 'confusion') {
        initialStatuses[idx] = addStatus(initialStatuses[idx], 'bind')
      } else if (mod.type === 'shrine') {
        initialBuffs[idx] = addBuff(initialBuffs[idx], 'def_up')
      }
    }
  }

  return {
    enemyHp: floor.enemies.map((e) => e.hp),
    enemyMp: floor.enemies.map((e) => e.maxMp ?? 0),
    nextMemberAttackMs: party.map((m, i) =>
      Math.round(speedToInterval(m.speed) * STANCE_MODIFIERS[stances[i]].intervalMul),
    ),
    nextEnemyAttackMs: floor.enemies.map((e) => speedToInterval(e.speed ?? 24)),
    skillCooldownMs: party.map((m) => m.skills.map(() => 0)),
    enemySkillCooldownMs: floor.enemies.map((e) => (e.skills ?? []).map(() => 0)),
    playerTargets: party.map(() => -1),
    elapsedMs: 0,
    enemyStatuses: floor.enemies.map(() => [] as StatusEntry[]),
    stanceCooldowns: party.map(() => 0),
    partyBuffs: initialBuffs,
    partyStatuses: initialStatuses,
    autoReviveUsed,
    summons: [],
  }
}

const DEBUFF_COUNTER_BUFF: Partial<Record<StatusEffect, BuffType>> = {
  seal_atk: 'atk_up', seal_def: 'def_up', bind: 'spd_up',
}

function applyDebuffToPlayer(
  partyBuffs: BuffEntry[][],
  partyStatuses: StatusEntry[][],
  idx: number,
  type: StatusEffect,
  memberName: string,
): CombatLogEntry {
  const counterBuff = DEBUFF_COUNTER_BUFF[type]
  if (counterBuff) {
    const bi = partyBuffs[idx].findIndex((b) => b.type === counterBuff)
    if (bi >= 0) {
      const cur = partyBuffs[idx][bi]
      if (cur.stacks <= 1) {
        partyBuffs[idx] = partyBuffs[idx].filter((_, i) => i !== bi)
      } else {
        const upd = [...partyBuffs[idx]]
        upd[bi] = { ...cur, stacks: cur.stacks - 1 }
        partyBuffs[idx] = upd
      }
      return enemyBuff(`${memberName}の${BUFF_LABEL[counterBuff]}が崩された！（1段階低下）`)
    }
  }
  partyStatuses[idx] = addStatus(partyStatuses[idx], type)
  return enemyBuff(`${memberName}は${STATUS_LABEL[type]}状態になった！`)
}

export function stepCombat(
  combat: ActiveCombatState,
  floor: FloorPlan,
  party: Character[],
  partyHp: number[],
  partyMp: number[],
  stances: Stance[],
  deltaMs: number,
): CombatStepResult {
  const enemyHp = [...combat.enemyHp]
  const enemyMp: number[] = combat.enemyMp ? [...combat.enemyMp] : floor.enemies.map((e) => e.maxMp ?? 0)
  const hp = [...partyHp]
  const mp = [...partyMp]
  const skillCooldown = combat.skillCooldownMs.map((row) => [...row])
  const enemySkillCooldown: number[][] = combat.enemySkillCooldownMs
    ? combat.enemySkillCooldownMs.map((row) => [...row])
    : floor.enemies.map((e) => (e.skills ?? []).map(() => 0))
  let elapsed = combat.elapsedMs
  const enemyStatuses: StatusEntry[][] = (combat.enemyStatuses ?? floor.enemies.map(() => [])).map((s) => [...s])
  const stanceCooldowns = [...(combat.stanceCooldowns ?? Array(party.length).fill(0))]
  const partyBuffs: BuffEntry[][] = (combat.partyBuffs ?? party.map(() => [])).map((b) => [...b])
  const partyStatuses: StatusEntry[][] = (combat.partyStatuses ?? party.map(() => [])).map((s) => [...s])
  const autoReviveUsed = [...(combat.autoReviveUsed ?? party.map(() => false))]
  const log: CombatLogEntry[] = []
  let remaining = deltaMs

  while (remaining >= ROUND_MS) {
    if (enemyHp.every((h) => h <= 0)) {
      const expGained = floor.enemies.reduce((s, e) => s + e.expReward, 0)
      const goldGained = floor.enemies.reduce((s, e) => s + e.goldReward, 0)
      return {
        combat: { ...combat, enemyHp, enemyMp, nextMemberAttackMs: party.map(() => ROUND_MS), nextEnemyAttackMs: floor.enemies.map(() => ROUND_MS), skillCooldownMs: skillCooldown, enemySkillCooldownMs: enemySkillCooldown, elapsedMs: elapsed, enemyStatuses, stanceCooldowns, partyBuffs, partyStatuses, autoReviveUsed },
        partyHp: hp, partyMp: mp,
        done: true, victory: true, expGained, goldGained,
        consumedMs: deltaMs, log,
      }
    }

    if (hp.every((h) => h <= 0)) {
      return {
        combat: { ...combat, enemyHp, enemyMp, nextMemberAttackMs: party.map(() => ROUND_MS), nextEnemyAttackMs: floor.enemies.map(() => ROUND_MS), skillCooldownMs: skillCooldown, enemySkillCooldownMs: enemySkillCooldown, elapsedMs: elapsed, enemyStatuses, stanceCooldowns, partyBuffs, partyStatuses, autoReviveUsed },
        partyHp: hp, partyMp: mp,
        done: true, victory: false, expGained: 0, goldGained: 0,
        consumedMs: deltaMs, log,
      }
    }

    const aliveMembers = party.map((_, i) => i).filter((i) => hp[i] > 0)
    const aliveEnemyIdxs = floor.enemies.map((_, i) => i).filter((i) => enemyHp[i] > 0)

    // ラウンド開始時に全スキルクールダウンを ROUND_MS 減少
    for (let i = 0; i < party.length; i++) {
      for (let j = 0; j < skillCooldown[i].length; j++) {
        skillCooldown[i][j] = Math.max(0, skillCooldown[i][j] - ROUND_MS)
      }
    }
    for (let i = 0; i < floor.enemies.length; i++) {
      for (let j = 0; j < (enemySkillCooldown[i]?.length ?? 0); j++) {
        enemySkillCooldown[i][j] = Math.max(0, enemySkillCooldown[i][j] - ROUND_MS)
      }
    }

    // 行動順を素早さで決定（高いほど先）。同値はパーティ → 敵の順
    // spd_up: 有効速度上昇  bind: 有効速度低下（順番が後ろになる）
    const SPD_BUFF_MUL  = [1.33, 1.67, 2.0]   // spd_up stack 1/2/3
    const BIND_SPD_MUL  = [0.67, 0.5,  0.4]   // bind   stack 1/2/3
    type TurnUnit = { kind: 'member' | 'enemy'; idx: number; effSpeed: number }
    const units: TurnUnit[] = [
      ...aliveMembers.map((i) => {
        const spdBuff = partyBuffs[i].find((b) => b.type === 'spd_up')
        const bindSt  = partyStatuses[i].find((s) => s.type === 'bind')
        const mul = (spdBuff ? SPD_BUFF_MUL[Math.min(spdBuff.stacks - 1, 2)] : 1.0)
                  * (bindSt  ? BIND_SPD_MUL[Math.min((bindSt.stacks ?? 1) - 1, 2)] : 1.0)
        return { kind: 'member' as const, idx: i, effSpeed: party[i].speed * mul }
      }),
      ...aliveEnemyIdxs.map((i) => {
        const bindSt = (enemyStatuses[i] ?? []).find((s) => s.type === 'bind')
        const mul = bindSt ? BIND_SPD_MUL[Math.min((bindSt.stacks ?? 1) - 1, 2)] : 1.0
        return { kind: 'enemy' as const, idx: i, effSpeed: (floor.enemies[i].speed ?? 24) * mul }
      }),
    ]
    units.sort((a, b) => {
      if (b.effSpeed !== a.effSpeed) return b.effSpeed - a.effSpeed
      if (a.kind !== b.kind) return a.kind === 'member' ? -1 : 1
      return a.idx - b.idx
    })

    for (const unit of units) {
      if (unit.kind === 'member') {
        const i = unit.idx
        if (hp[i] <= 0) continue  // このラウンド中に倒された

        const member = party[i]
        const mods = STANCE_MODIFIERS[stances[i]]

        // 硬直: 行動スキップ
        if (partyStatuses[i].some((s) => s.type === 'stagger')) {
          log.push(allyBuff(`${member.name}は硬直して動けない！`))
          partyBuffs[i] = tickBuffs(partyBuffs[i])
          partyStatuses[i] = tickStatuses(partyStatuses[i])
          if (stanceCooldowns[i] > 0) stanceCooldowns[i]--
          continue
        }

        let acted = false
        for (let si = 0; si < member.skills.length; si++) {
          const skill = member.skills[si]
          if (skillCooldown[i][si] > 0) continue
          if (mods.skillFilter && !mods.skillFilter.includes(skill.type)) continue
          const cost = Math.round(skill.mpCost * mods.mpCostMul * getMpCostRatio(member))
          if (mp[i] < cost) continue
          if (!checkCondition(skill.autoCondition, hp[i], member.maxHp, enemyHp, floor.enemies, elapsed)) continue

          mp[i] = Math.max(0, mp[i] - cost)
          skillCooldown[i][si] = skill.cooldownMs
          const res = applySkill(skill, i, party, hp, mp, floor.enemies, enemyHp, combat.playerTargets, mods, enemyStatuses, partyBuffs, partyStatuses)
          for (let j = 0; j < hp.length; j++) hp[j] = res.partyHp[j]
          for (let j = 0; j < mp.length; j++) mp[j] = res.partyMp[j]
          for (let j = 0; j < enemyHp.length; j++) enemyHp[j] = res.enemyHp[j]
          for (let j = 0; j < enemyStatuses.length; j++) enemyStatuses[j] = res.enemyStatuses[j]
          for (let j = 0; j < partyBuffs.length; j++) partyBuffs[j] = res.partyBuffs[j]
          for (let j = 0; j < partyStatuses.length; j++) partyStatuses[j] = res.partyStatuses[j]
          log.push(...res.log)
          acted = true
          break
        }

        if (!acted) {
          const tidx = pickTarget(combat.playerTargets[i], enemyHp)
          if (tidx !== -1) {
            const sealDefSt = (enemyStatuses[tidx] ?? []).find((s) => s.type === 'seal_def')
            const sealDefMul = sealDefSt ? debuffDefMul(sealDefSt.stacks ?? 1) : 1.0
            const atkBuff = partyBuffs[i].find((b) => b.type === 'atk_up')
            const sealAtkSt = partyStatuses[i].find((s) => s.type === 'seal_atk')
            const lastStand = getLastStandMul(member, hp[i])
            const atkMulTotal = mods.atkMul * (atkBuff ? buffAtkMul(atkBuff.stacks) : 1.0) * (sealAtkSt ? debuffAtkMul(sealAtkSt.stacks ?? 1) : 1.0) * lastStand
            const weaponElem = getWeaponElement(member)
            const elemMul = weaponElem !== 'none' ? calcElementMul(weaponElem, floor.enemies[tidx].element ?? 'none') : 1
            const elemBoost = weaponElem !== 'none' ? getElementBoostMul(member, weaponElem) : 1
            const baseDmg = Math.max(1, Math.round(member.attack * atkMulTotal * elemBoost) - Math.round(floor.enemies[tidx].defense * sealDefMul))
            const { damage: dmg, isCrit } = rollDamage(Math.round(baseDmg * elemMul))
            enemyHp[tidx] = Math.max(0, enemyHp[tidx] - dmg)
            const elemTag = elemMul > 1 ? '【弱点】' : elemMul < 1 ? '【耐性】' : ''
            if (isCrit) {
              log.push(allyAtk(`${member.name}の天機！ ${elemTag}${floor.enemies[tidx].name}に ${dmg}ダメージ！！`))
            } else {
              log.push(allyAtk(`${member.name}の攻撃！ ${elemTag}${floor.enemies[tidx].name}に ${dmg}ダメージ`))
            }
            if (enemyHp[tidx] === 0) log.push(allyAtk(`${floor.enemies[tidx].name}を倒した！`))
            // 吸血
            const ls = getLifestealRate(member)
            if (ls > 0 && hp[i] > 0) {
              const heal = Math.max(1, Math.round(dmg * ls))
              hp[i] = Math.min(member.maxHp, hp[i] + heal)
            }
          }
        }

        // 再生（バフ）
        const regenBuff = partyBuffs[i].find((b) => b.type === 'regen')
        if (regenBuff && hp[i] > 0) {
          const heal = Math.max(1, Math.floor(member.maxHp * 0.05))
          hp[i] = Math.min(member.maxHp, hp[i] + heal)
          log.push(allyHeal(`${member.name}は再生で${heal}回復`))
        }
        // 装備 HP 自動回復
        const hpRegenRate = getHpRegenRate(member)
        if (hpRegenRate > 0 && hp[i] > 0) {
          hp[i] = Math.min(member.maxHp, hp[i] + Math.max(1, Math.floor(member.maxHp * hpRegenRate)))
        }
        // 装備 MP 自動回復
        const mpRegenRate = getMpRegenRate(member)
        if (mpRegenRate > 0) {
          mp[i] = Math.min(member.maxMp, mp[i] + Math.max(1, Math.floor(member.maxMp * mpRegenRate)))
        }
        partyBuffs[i] = tickBuffs(partyBuffs[i])
        partyStatuses[i] = tickStatuses(partyStatuses[i])
        if (stanceCooldowns[i] > 0) stanceCooldowns[i]--

      } else {
        // 敵の行動
        const attackerIdx = unit.idx
        if (enemyHp[attackerIdx] <= 0) continue  // このラウンド中に倒された

        const attacker = floor.enemies[attackerIdx]
        const statuses = enemyStatuses[attackerIdx] ?? []

        // 腐毒: 行動時にダメージ
        const hasPoison = statuses.some((s) => s.type === 'poison')
        if (hasPoison) {
          const pdmg = Math.max(1, Math.floor(attacker.maxHp * 0.03))
          enemyHp[attackerIdx] = Math.max(0, enemyHp[attackerIdx] - pdmg)
          log.push(allyBuff(`${attacker.name}は腐毒で${pdmg}ダメージ！`))
          if (enemyHp[attackerIdx] === 0) {
            log.push(allyAtk(`${attacker.name}を倒した！`))
            enemyStatuses[attackerIdx] = tickStatuses(statuses)
            continue
          }
        }

        // 全ステータスをカウントダウン
        enemyStatuses[attackerIdx] = tickStatuses(statuses)
        const afterStatuses = enemyStatuses[attackerIdx]

        // 硬直: 行動スキップ
        if (statuses.some((s) => s.type === 'stagger')) {
          log.push(allyBuff(`${attacker.name}は硬直して動けない！`))
          continue
        }

        // MP自然回復（行動ごとに maxMp × 5%）
        if ((attacker.maxMp ?? 0) > 0) {
          enemyMp[attackerIdx] = Math.min(attacker.maxMp!, enemyMp[attackerIdx] + Math.round(attacker.maxMp! * 0.05))
        }

        const aliveParty = party.map((m, i) => ({ m, i })).filter((x) => hp[x.i] > 0)

        // スキル使用チェック
        let skillUsed = false
        const skills = attacker.skills ?? []
        for (let si = 0; si < skills.length; si++) {
          const skill = skills[si]
          if ((enemySkillCooldown[attackerIdx]?.[si] ?? 0) > 0) continue
          if (enemyMp[attackerIdx] < skill.mpCost) continue
          const hpRatio = enemyHp[attackerIdx] / attacker.maxHp
          if (skill.condition === 'hp_below_50' && hpRatio >= 0.5) continue
          if (skill.condition === 'hp_below_25' && hpRatio >= 0.25) continue

          executeEnemySkill(skill, attackerIdx, attacker, aliveParty, hp, enemyHp, partyStatuses, log)
          enemyMp[attackerIdx] = Math.max(0, enemyMp[attackerIdx] - skill.mpCost)
          if (!enemySkillCooldown[attackerIdx]) enemySkillCooldown[attackerIdx] = skills.map(() => 0)
          enemySkillCooldown[attackerIdx][si] = skill.cooldownMs
          skillUsed = true
          break
        }

        // 通常攻撃（スキルを使わなかった場合）
        if (!skillUsed) {
          if (aliveParty.length > 0) {
            const target = aliveParty[Math.floor(Math.random() * aliveParty.length)]
            const mods = STANCE_MODIFIERS[stances[target.i]]
            const sealAtkSt = afterStatuses.find((s) => s.type === 'seal_atk')
            const atkMul = sealAtkSt ? debuffAtkMul(sealAtkSt.stacks ?? 1) : 1.0
            const defBuff = partyBuffs[target.i]?.find((b) => b.type === 'def_up')
            const sealDefPSt = partyStatuses[target.i]?.find((s) => s.type === 'seal_def')
            const defMulTotal = mods.defMul * (defBuff ? buffDefMul(defBuff.stacks) : 1.0) * (sealDefPSt ? debuffDefMul(sealDefPSt.stacks ?? 1) : 1.0)
            const baseEnemyDmg = Math.max(1, Math.floor(attacker.attack * atkMul) - Math.round(target.m.defense * defMulTotal))
            const { damage: dmg, isCrit: enemyCrit } = rollDamage(baseEnemyDmg)

            const enemyElem: ElementType = attacker.element ?? 'none'
            const resistMul = 1 - getElementResist(target.m, enemyElem)
            const finalDmg = Math.max(1, Math.round(dmg * resistMul))

            const barrierIdx = partyBuffs[target.i]?.findIndex((b) => b.type === 'barrier') ?? -1
            if (barrierIdx >= 0) {
              partyBuffs[target.i] = partyBuffs[target.i].filter((_, bi) => bi !== barrierIdx)
              log.push(allyBuff(`${target.m.name}の結界が攻撃を弾いた！`))
            } else {
              const prevHp = hp[target.i]
              hp[target.i] = Math.max(0, hp[target.i] - finalDmg)
              if (enemyCrit) {
                log.push(enemyAtk(`${attacker.name}の天機！ ${target.m.name}に ${finalDmg}ダメージ！！`))
              } else {
                log.push(enemyAtk(`${attacker.name}の攻撃！ ${target.m.name}に ${finalDmg}ダメージ`))
              }
              if (hp[target.i] === 0 && prevHp > 0 && !autoReviveUsed[target.i] && hasAutoRevive(target.m)) {
                autoReviveUsed[target.i] = true
                hp[target.i] = 1
                log.push(allyBuff(`${target.m.name}は自動復活で生き残った！（HP1）`))
              } else if (hp[target.i] === 0) {
                log.push(enemyAtk(`${target.m.name}が倒れた！`))
              }
              if (attacker.debuffOnHit && Math.random() < attacker.debuffOnHit.chance) {
                log.push(applyDebuffToPlayer(partyBuffs, partyStatuses, target.i, attacker.debuffOnHit.type, target.m.name))
              }
            }
          }
        }
      }
    }

    elapsed += ROUND_MS
    remaining -= ROUND_MS
  }

  return {
    combat: { ...combat, enemyHp, enemyMp, nextMemberAttackMs: party.map(() => ROUND_MS), nextEnemyAttackMs: floor.enemies.map(() => ROUND_MS), skillCooldownMs: skillCooldown, enemySkillCooldownMs: enemySkillCooldown, elapsedMs: elapsed, enemyStatuses, stanceCooldowns, partyBuffs, partyStatuses, autoReviveUsed },
    partyHp: hp, partyMp: mp,
    done: false, victory: false, expGained: 0, goldGained: 0,
    consumedMs: deltaMs, log,
  }
}

// 敵スキルを実行する（stepCombat から呼ばれる）
function executeEnemySkill(
  skill: EnemySkill,
  attackerIdx: number,
  attacker: Enemy,
  aliveParty: Array<{ m: Character; i: number }>,
  hp: number[],
  enemyHp: number[],
  partyStatuses: StatusEntry[][],
  log: CombatLogEntry[],
): void {
  const { effect } = skill
  switch (effect.type) {
    case 'attack_single': {
      if (aliveParty.length === 0) return
      const target = aliveParty[Math.floor(Math.random() * aliveParty.length)]
      const power = effect.power ?? 1.5
      const baseDmg = Math.max(1, Math.floor(attacker.attack * power) - Math.round(target.m.defense))
      const { damage: dmg } = rollDamage(baseDmg)
      const elemResistMul = effect.element ? (1 - getElementResist(target.m, effect.element)) : 1
      const finalDmg = Math.max(1, Math.round(dmg * elemResistMul))
      const elemTag = effect.element && elemResistMul < 1 ? '【耐性】' : ''
      const prevHp = hp[target.i]
      hp[target.i] = Math.max(0, hp[target.i] - finalDmg)
      log.push(enemyAtk(`${attacker.name}の${skill.name}！${elemTag}${target.m.name}に${finalDmg}ダメージ！`))
      if (hp[target.i] === 0 && prevHp > 0) log.push(enemyAtk(`${target.m.name}が倒れた！`))
      break
    }
    case 'attack_all': {
      const power = effect.power ?? 1.5
      log.push(enemyAtk(`${attacker.name}の${skill.name}！全体攻撃！`))
      for (const target of aliveParty) {
        const baseDmg = Math.max(1, Math.floor(attacker.attack * power) - Math.round(target.m.defense))
        const { damage: dmg } = rollDamage(baseDmg)
        const elemResistMul = effect.element ? (1 - getElementResist(target.m, effect.element)) : 1
        const finalDmg = Math.max(1, Math.round(dmg * elemResistMul))
        const elemTag = effect.element && elemResistMul < 1 ? '【耐性】' : ''
        const prevHp = hp[target.i]
        hp[target.i] = Math.max(0, hp[target.i] - finalDmg)
        log.push(enemyAtk(`　${elemTag}${target.m.name}に${finalDmg}ダメージ`))
        if (hp[target.i] === 0 && prevHp > 0) log.push(enemyAtk(`${target.m.name}が倒れた！`))
      }
      break
    }
    case 'heal_self': {
      const healAmt = Math.max(1, Math.round(attacker.maxHp * (effect.healRate ?? 0.1)))
      enemyHp[attackerIdx] = Math.min(attacker.maxHp, enemyHp[attackerIdx] + healAmt)
      log.push(enemyBuff(`${attacker.name}の${skill.name}！${healAmt}HP回復！`))
      break
    }
    case 'debuff_all': {
      if (!effect.debuff) return
      const baseChance = effect.debuffChance ?? 1.0
      const applied: string[] = []
      for (const target of aliveParty) {
        if (Math.random() < baseChance) {
          partyStatuses[target.i] = addStatus(partyStatuses[target.i], effect.debuff)
          applied.push(target.m.name)
        }
      }
      log.push(enemyBuff(
        applied.length > 0
          ? `${attacker.name}の${skill.name}！${applied.join('・')}に${STATUS_LABEL[effect.debuff]}！`
          : `${attacker.name}の${skill.name}！（効果なし）`,
      ))
      break
    }
    case 'debuff_single': {
      if (!effect.debuff || aliveParty.length === 0) return
      const target = aliveParty[Math.floor(Math.random() * aliveParty.length)]
      const baseChance = effect.debuffChance ?? 1.0
      if (Math.random() < baseChance) {
        partyStatuses[target.i] = addStatus(partyStatuses[target.i], effect.debuff)
        log.push(enemyBuff(`${attacker.name}の${skill.name}！${target.m.name}に${STATUS_LABEL[effect.debuff]}！`))
      } else {
        log.push(enemyBuff(`${attacker.name}の${skill.name}！（${target.m.name}には効かなかった）`))
      }
      break
    }
  }
}

export function applySkill(
  skill: SkillCard,
  casterIdx: number,
  party: Character[],
  partyHp: number[],
  partyMp: number[],
  enemies: Enemy[],
  enemyHp: number[],
  playerTargets: number[],
  mods: StanceModifiers,
  inEnemyStatuses: StatusEntry[][] = [],
  inPartyBuffs: BuffEntry[][] = [],
  inPartyStatuses: StatusEntry[][] = [],
): { partyHp: number[]; partyMp: number[]; enemyHp: number[]; enemyStatuses: StatusEntry[][]; partyBuffs: BuffEntry[][]; partyStatuses: StatusEntry[][]; log: CombatLogEntry[] } {
  const hp = [...partyHp]
  const mp = [...partyMp]
  const ehp = [...enemyHp]
  const ests: StatusEntry[][] = enemies.map((_, i) => [...(inEnemyStatuses[i] ?? [])])
  const pbs: BuffEntry[][] = party.map((_, i) => [...(inPartyBuffs[i] ?? [])])
  const psts: StatusEntry[][] = party.map((_, i) => [...(inPartyStatuses[i] ?? [])])
  const log: CombatLogEntry[] = []
  const caster = party[casterIdx]
  const sdm = mods.skillDmgMul

  // 敵へのデバフ適用（耐性チェック込み）
  const tryEnemyDebuff = (tidx: number, type: StatusEffect): { applied: boolean; resisted: boolean } => {
    const resist = enemies[tidx].statusResist?.[type] ?? 0
    if (Math.random() < resist) return { applied: false, resisted: true }
    const r = tryAddStatus(ests[tidx], type)
    ests[tidx] = r.statuses
    return { applied: r.applied, resisted: false }
  }

  const isCrit = rollCrit()
  const critMul = isCrit ? 2 : 1
  const variance = () => 0.85 + Math.random() * 0.30
  const em = (tidx: number) => calcElementMul(skill.element, enemies[tidx].element)
  const defOf = (tidx: number) => {
    const sd = ests[tidx]?.find((s) => s.type === 'seal_def')
    return Math.round(enemies[tidx].defense * (sd ? debuffDefMul(sd.stacks ?? 1) : 1.0))
  }

  // キャスターのATKバフ/デバフを計算
  const atkBuff = pbs[casterIdx]?.find((b) => b.type === 'atk_up')
  const sealAtkSt = psts[casterIdx]?.find((s) => s.type === 'seal_atk')
  const casterAtkMul = (atkBuff ? buffAtkMul(atkBuff.stacks) : 1.0) * (sealAtkSt ? debuffAtkMul(sealAtkSt.stacks ?? 1) : 1.0)

  // 集中バフ（攻撃スキル使用時に×2、消費）
  const isAttackSkill = skill.type === 'attack'
  const focusIdx = isAttackSkill ? pbs[casterIdx]?.findIndex((b) => b.type === 'focus') ?? -1 : -1
  const focusMul = focusIdx >= 0 ? 2 : 1
  if (focusIdx >= 0) {
    pbs[casterIdx] = pbs[casterIdx].filter((_, bi) => bi !== focusIdx)
    log.push(allyBuff(`${caster.name}の集中発動！`))
  }

  const eqElemBoost = skill.element ? getElementBoostMul(caster, skill.element) : 1
  const eqLastStand = getLastStandMul(caster, partyHp[casterIdx])
  const eqCritBonus = getCritBonus(caster)
  const isCritFinal = isCrit || Math.random() < eqCritBonus

  const physDmg = (mul: number, tidx: number, eMul = 1) =>
    Math.max(1, Math.round((Math.ceil(caster.attack * mul * sdm * casterAtkMul * focusMul * eqLastStand * eqElemBoost) - defOf(tidx)) * variance() * (isCritFinal ? 2 : 1) * eMul))
  const magicDmg = (mul: number, tidx: number, eMul = 1) =>
    Math.max(1, Math.round((Math.ceil(caster.attack * mul * sdm * casterAtkMul * focusMul * eqLastStand * eqElemBoost) - Math.floor(defOf(tidx) * 0.5)) * variance() * (isCritFinal ? 2 : 1) * eMul))
  const critTag = isCrit ? `【天機】` : ''
  const elemTag = (eMul: number) => eMul > 1 ? '【弱点】' : eMul < 1 ? '【耐性】' : ''

  const dmgLog = (name: string, target: string, d: number, eMul = 1): CombatLogEntry =>
    allyAtk(isCrit ? `${name}の天機！ ${elemTag(eMul)}${target}に${d}ダメージ！！` : `${name}の${skill.name}！${elemTag(eMul)}${target}に${d}ダメージ！`)
  const healLog = (name: string, target: string, amt: number): CombatLogEntry =>
    allyHeal(isCrit ? `${name}の天機！ ${target}のHPが${amt}回復！！` : `${name}の${skill.name}！${target}のHPが${amt}回復！`)
  const buffLog = (name: string, effect: string): CombatLogEntry =>
    allyBuff(isCrit ? `${name}の天機！ ${effect}が大きく高まった！！` : `${name}の${skill.name}！${effect}`)

  switch (skill.id) {
    case 'slash': {
      const t = pickTarget(playerTargets[casterIdx], ehp)
      if (t === -1) break
      const d = physDmg(1.5, t)
      ehp[t] = Math.max(0, ehp[t] - d)
      log.push(dmgLog(caster.name, enemies[t].name, d))
      if (ehp[t] === 0) log.push(allyAtk(`${enemies[t].name}を倒した！`))
      break
    }
    case 'shield_bash': {
      const t = pickTarget(playerTargets[casterIdx], ehp)
      if (t === -1) break
      const d = physDmg(0.8, t)
      ehp[t] = Math.max(0, ehp[t] - d)
      let staggerMsg = ''
      if (ehp[t] > 0) {
        const r = tryEnemyDebuff(t, 'stagger')
        staggerMsg = r.resisted ? '（耐性で無効）' : r.applied ? '＋硬直！' : '（硬直不発）'
      }
      log.push(allyAtk(isCrit ? `${caster.name}の天機！ ${enemies[t].name}に${d}ダメージ${staggerMsg}！` : `${caster.name}のシールドバッシュ！${enemies[t].name}に${d}ダメージ${staggerMsg}`))
      if (ehp[t] === 0) log.push(allyAtk(`${enemies[t].name}を倒した！`))
      break
    }
    case 'fire_bolt': {
      const t = pickTarget(playerTargets[casterIdx], ehp)
      if (t === -1) break
      const d = magicDmg(1.8, t, em(t))
      ehp[t] = Math.max(0, ehp[t] - d)
      log.push(dmgLog(caster.name, enemies[t].name, d, em(t)))
      if (ehp[t] === 0) log.push(allyAtk(`${enemies[t].name}を倒した！`))
      break
    }
    case 'blizzard': {
      const alive = enemies.map((_, i) => i).filter((i) => ehp[i] > 0)
      for (const t of alive) {
        const d = magicDmg(1.4, t, em(t))
        ehp[t] = Math.max(0, ehp[t] - d)
        if (ehp[t] === 0) log.push(allyAtk(`${enemies[t].name}を倒した！`))
      }
      log.unshift(allyAtk(isCrit ? `${caster.name}の天機！ 猛烈な吹雪が敵全体を襲った！！` : `${caster.name}のブリザード！敵全体に魔法ダメージ！`))
      break
    }
    case 'meteor': {
      const alive = enemies.map((_, i) => i).filter((i) => ehp[i] > 0)
      for (const t of alive) {
        const d = magicDmg(2.5, t, em(t))
        ehp[t] = Math.max(0, ehp[t] - d)
        if (ehp[t] === 0) log.push(allyAtk(`${enemies[t].name}を倒した！`))
      }
      log.unshift(allyAtk(isCrit ? `${caster.name}の天機！ 超巨大隕石が降り注いだ！！` : `${caster.name}のメテオ！敵全体に巨大魔法ダメージ！`))
      break
    }
    case 'stab': {
      const t = pickTarget(playerTargets[casterIdx], ehp)
      if (t === -1) break
      const d = physDmg(1.3, t)
      ehp[t] = Math.max(0, ehp[t] - d)
      log.push(dmgLog(caster.name, enemies[t].name, d))
      if (ehp[t] === 0) log.push(allyAtk(`${enemies[t].name}を倒した！`))
      break
    }
    case 'poison_blade': {
      const t = pickTarget(playerTargets[casterIdx], ehp)
      if (t === -1) break
      const d = physDmg(1.0, t)
      ehp[t] = Math.max(0, ehp[t] - d)
      let pbMsg = ''
      if (ehp[t] > 0) { const r = tryEnemyDebuff(t, 'poison'); pbMsg = r.resisted ? '（耐性で無効）' : r.applied ? '＋腐毒！' : '（腐毒不発）' }
      log.push(allyAtk(isCrit ? `${caster.name}の天機！ ${enemies[t].name}に${d}ダメージ${pbMsg}！` : `${caster.name}のポイズンブレイド！${enemies[t].name}に${d}ダメージ${pbMsg}`))
      if (ehp[t] === 0) log.push(allyAtk(`${enemies[t].name}を倒した！`))
      break
    }
    case 'venom_strike': {
      const t = pickTarget(playerTargets[casterIdx], ehp)
      if (t === -1) break
      const d = physDmg(1.2, t)
      ehp[t] = Math.max(0, ehp[t] - d)
      let vsMsg = ''
      if (ehp[t] > 0) { const r = tryEnemyDebuff(t, 'poison'); vsMsg = r.resisted ? '（耐性で無効）' : r.applied ? '＋腐毒！' : '（腐毒不発）' }
      log.push(allyAtk(isCrit ? `${caster.name}の天機！ ${enemies[t].name}に${d}ダメージ${vsMsg}！` : `${caster.name}の毒牙！${enemies[t].name}に${d}ダメージ${vsMsg}`))
      if (ehp[t] === 0) log.push(allyAtk(`${enemies[t].name}を倒した！`))
      break
    }
    case 'poison_mist': {
      const alive = enemies.map((_, i) => i).filter((i) => ehp[i] > 0)
      const hits = alive.filter((t) => tryEnemyDebuff(t, 'poison').applied)
      log.push(allyBuff(isCrit ? `${caster.name}の天機！ 毒霧！${hits.length}体に腐毒付与！！` : `${caster.name}の毒霧！${hits.length}体に腐毒付与！`))
      break
    }
    case 'thorn_bind': {
      const t = pickTarget(playerTargets[casterIdx], ehp)
      if (t === -1) break
      const applied: string[] = []
      if (ehp[t] > 0) {
        const ra = tryEnemyDebuff(t, 'seal_atk'); if (ra.applied) applied.push('封力')
        const rb = tryEnemyDebuff(t, 'bind');     if (rb.applied) applied.push('束縛')
      }
      log.push(buffLog(caster.name, applied.length ? `${enemies[t].name}に${applied.join('＋')}付与` : `${enemies[t].name}への状態異常は不発`))
      break
    }
    case 'lullaby': {
      const alive = enemies.map((_, i) => i).filter((i) => ehp[i] > 0)
      const hits = alive.filter((t) => tryEnemyDebuff(t, 'seal_atk').applied)
      log.push(buffLog(caster.name, `${hits.length}体に封力付与`))
      break
    }
    case 'curse': {
      const t = pickTarget(playerTargets[casterIdx], ehp)
      if (t === -1) break
      const applied: string[] = []
      if (ehp[t] > 0) {
        const ra = tryEnemyDebuff(t, 'seal_atk'); if (ra.applied) applied.push('封力')
        const rb = tryEnemyDebuff(t, 'seal_def'); if (rb.applied) applied.push('封守')
      }
      log.push(buffLog(caster.name, applied.length ? `${enemies[t].name}に${applied.join('＋')}付与` : `${enemies[t].name}への状態異常は不発`))
      break
    }
    case 'death_curse': {
      const t = pickTarget(playerTargets[casterIdx], ehp)
      if (t === -1) break
      const applied: string[] = []
      if (ehp[t] > 0) {
        const ra = tryEnemyDebuff(t, 'seal_atk'); if (ra.applied) applied.push('封力')
        const rb = tryEnemyDebuff(t, 'seal_def'); if (rb.applied) applied.push('封守')
      }
      log.push(buffLog(caster.name, applied.length ? `${enemies[t].name}に${applied.join('＋')}付与` : `${enemies[t].name}への状態異常は不発`))
      break
    }
    case 'backstab': {
      const t = pickTarget(playerTargets[casterIdx], ehp)
      if (t === -1) break
      const d = physDmg(2.2, t)
      ehp[t] = Math.max(0, ehp[t] - d)
      log.push(allyAtk(isCrit ? `${caster.name}の天機！ ${enemies[t].name}に${d}ダメージ！！` : `${caster.name}のバックスタブ！${enemies[t].name}に${d}クリティカル！`))
      if (ehp[t] === 0) log.push(allyAtk(`${enemies[t].name}を倒した！`))
      break
    }
    case 'heal': {
      const lowestIdx = hp.reduce((minI, h, i) =>
        h / party[i].maxHp < hp[minI] / party[minI].maxHp ? i : minI, 0)
      const amt = Math.floor(party[lowestIdx].maxHp * 0.15 * sdm * critMul)
      hp[lowestIdx] = Math.min(party[lowestIdx].maxHp, hp[lowestIdx] + amt)
      log.push(healLog(caster.name, party[lowestIdx].name, amt))
      break
    }
    case 'holy_light': {
      const t = pickTarget(playerTargets[casterIdx], ehp)
      if (t === -1) break
      const d = magicDmg(1.6, t, em(t))
      ehp[t] = Math.max(0, ehp[t] - d)
      log.push(dmgLog(caster.name, enemies[t].name, d, em(t)))
      if (ehp[t] === 0) log.push(allyAtk(`${enemies[t].name}を倒した！`))
      break
    }
    case 'resurrection': {
      const downed = hp.findIndex((h) => h <= 0)
      if (downed === -1) break
      hp[downed] = Math.floor(party[downed].maxHp * 0.25)
      log.push(allyHeal(`${caster.name}のリザレクション！${party[downed].name}が復活！`))
      break
    }
    default: {
      if (skill.type === 'buff' && skill.buffEffects && skill.buffEffects.length > 0) {
        const targets = skill.buffTarget === 'party'
          ? party.map((_, ti) => ti).filter((ti) => hp[ti] > 0)
          : [casterIdx]
        for (const bt of skill.buffEffects) {
          for (const ti of targets) pbs[ti] = addBuff(pbs[ti], bt)
          // 対応デバフを解除（封力→攻↑、封守→守↑、束縛→速↑）
          const counter = BUFF_COUNTERS[bt]
          if (counter) {
            for (const ti of targets) {
              if (psts[ti].some((s) => s.type === counter)) {
                psts[ti] = psts[ti].filter((s) => s.type !== counter)
                log.push(allyBuff(`${party[ti].name}の${STATUS_LABEL[counter]}が解除された！`))
              }
            }
          }
        }
        const stackInfo = skill.buffEffects.map((bt) => {
          const entry = pbs[casterIdx]?.find((b) => b.type === bt)
          const s = entry?.stacks ?? 1
          return `${BUFF_LABEL[bt]}${STACKABLE_BUFFS.includes(bt) && s > 1 ? `×${s}` : ''}`
        }).join('・')
        const tStr = skill.buffTarget === 'party' ? 'パーティ全体に' : ''
        log.push(allyBuff(`${caster.name}の${skill.name}！${tStr}${stackInfo}`))
      } else if (skill.type === 'heal' && skill.cureEffect) {
        const targets = party.map((_, ti) => ti).filter((ti) => hp[ti] > 0)
        for (const ti of targets) {
          psts[ti] = skill.cureEffect === 'all' ? [] : psts[ti].filter((s) => s.type !== skill.cureEffect)
        }
        const effectName = skill.cureEffect === 'all' ? '全状態異常' : STATUS_LABEL[skill.cureEffect as StatusEffect]
        log.push(allyHeal(`${caster.name}の${skill.name}！パーティの${effectName}を回復！`))
      } else {
        log.push(allyAtk(`${critTag}${caster.name}が${skill.name}を使用！`))
      }
      break
    }
  }

  return { partyHp: hp, partyMp: mp, enemyHp: ehp, enemyStatuses: ests, partyBuffs: pbs, partyStatuses: psts, log }
}

function checkCondition(
  condition: SkillAutoCondition,
  memberHp: number,
  memberMaxHp: number,
  enemyHp: number[],
  enemies: Enemy[],
  elapsedMs: number,
): boolean {
  switch (condition) {
    case 'always': return true
    case 'hp_below_50': return memberHp / memberMaxHp < 0.5
    case 'hp_below_25': return memberHp / memberMaxHp < 0.25
    case 'combat_start': return elapsedMs < 5000
    case 'enemy_hp_above_75': return enemies.some((e, i) => ehp(enemyHp, i) > 0 && enemyHp[i] / e.maxHp > 0.75)
  }
}

function ehp(enemyHp: number[], i: number) { return enemyHp[i] }

function pickTarget(override: number, enemyHp: number[]): number {
  if (override >= 0 && override < enemyHp.length && enemyHp[override] > 0) return override
  const alive = enemyHp.map((h, i) => ({ h, i })).filter((x) => x.h > 0)
  if (alive.length === 0) return -1
  return alive[0].i
}

export function recoverMpBetweenFloors(
  partyMp: number[],
  party: Character[],
  stances: Stance[],
): number[] {
  return partyMp.map((mp, i) => {
    const m = party[i]
    if (!m || m.maxMp === 0) return mp
    const recovery = Math.floor(m.maxMp * 0.15 * STANCE_MODIFIERS[stances[i]].mpRecoveryMul)
    return Math.min(m.maxMp, mp + recovery)
  })
}
