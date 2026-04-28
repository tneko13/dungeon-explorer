import type { Character, CharacterClass } from '../types'
import { getLearnedSkills } from './skills/SkillMasterData'
import { getEnhancedStats } from './equipment/EquipmentData'

const CLASS_STATS: Record<CharacterClass, {
  hp: number; hpPerLevel: number
  attack: number; attackPerLevel: number
  defense: number; defensePerLevel: number
  mp: number; mpPerLevel: number
  speed: number; speedPerLevel: number
}> = {
  warrior:     { hp: 100, hpPerLevel: 15, attack: 15, attackPerLevel: 3,  defense: 10, defensePerLevel: 2, mp: 40,  mpPerLevel: 2, speed: 21, speedPerLevel: 0.3 },
  mage:        { hp: 60,  hpPerLevel: 8,  attack: 25, attackPerLevel: 5,  defense: 4,  defensePerLevel: 1, mp: 100, mpPerLevel: 6, speed: 30, speedPerLevel: 0.4 },
  rogue:       { hp: 75,  hpPerLevel: 10, attack: 20, attackPerLevel: 4,  defense: 6,  defensePerLevel: 1, mp: 60,  mpPerLevel: 3, speed: 40, speedPerLevel: 0.6 },
  priest:      { hp: 70,  hpPerLevel: 12, attack: 8,  attackPerLevel: 2,  defense: 6,  defensePerLevel: 2, mp: 80,  mpPerLevel: 4, speed: 17, speedPerLevel: 0.2 },
  ranger:      { hp: 80,  hpPerLevel: 11, attack: 18, attackPerLevel: 4,  defense: 5,  defensePerLevel: 1, mp: 60,  mpPerLevel: 3, speed: 33, speedPerLevel: 0.6 },
  knight:      { hp: 120, hpPerLevel: 18, attack: 12, attackPerLevel: 2,  defense: 15, defensePerLevel: 3, mp: 30,  mpPerLevel: 2, speed: 20, speedPerLevel: 0.2 },
  wizard:      { hp: 55,  hpPerLevel: 7,  attack: 30, attackPerLevel: 6,  defense: 3,  defensePerLevel: 1, mp: 120, mpPerLevel: 7, speed: 27, speedPerLevel: 0.4 },
  assassin:    { hp: 65,  hpPerLevel: 9,  attack: 28, attackPerLevel: 5,  defense: 4,  defensePerLevel: 1, mp: 70,  mpPerLevel: 3, speed: 50, speedPerLevel: 0.8 },
  paladin:     { hp: 95,  hpPerLevel: 14, attack: 14, attackPerLevel: 3,  defense: 12, defensePerLevel: 3, mp: 70,  mpPerLevel: 4, speed: 21, speedPerLevel: 0.3 },
  bard:        { hp: 70,  hpPerLevel: 10, attack: 10, attackPerLevel: 2,  defense: 5,  defensePerLevel: 1, mp: 90,  mpPerLevel: 5, speed: 30, speedPerLevel: 0.5 },
  berserker:   { hp: 110, hpPerLevel: 16, attack: 22, attackPerLevel: 5,  defense: 5,  defensePerLevel: 1, mp: 30,  mpPerLevel: 1, speed: 24, speedPerLevel: 0.3 },
  witch:       { hp: 60,  hpPerLevel: 8,  attack: 22, attackPerLevel: 5,  defense: 4,  defensePerLevel: 1, mp: 100, mpPerLevel: 6, speed: 29, speedPerLevel: 0.4 },
  monk:        { hp: 85,  hpPerLevel: 12, attack: 20, attackPerLevel: 4,  defense: 8,  defensePerLevel: 2, mp: 70,  mpPerLevel: 4, speed: 46, speedPerLevel: 0.8 },
  druid:       { hp: 75,  hpPerLevel: 11, attack: 12, attackPerLevel: 3,  defense: 7,  defensePerLevel: 2, mp: 100, mpPerLevel: 5, speed: 19, speedPerLevel: 0.2 },
  dancer:      { hp: 65,  hpPerLevel: 9,  attack: 15, attackPerLevel: 3,  defense: 5,  defensePerLevel: 1, mp: 90,  mpPerLevel: 5, speed: 43, speedPerLevel: 0.8 },
  dark_knight: { hp: 100, hpPerLevel: 14, attack: 20, attackPerLevel: 5,  defense: 8,  defensePerLevel: 2, mp: 80,  mpPerLevel: 4, speed: 23, speedPerLevel: 0.3 },
  necromancer: { hp: 55,  hpPerLevel: 7,  attack: 28, attackPerLevel: 6,  defense: 3,  defensePerLevel: 1, mp: 130, mpPerLevel: 7, speed: 17, speedPerLevel: 0.2 },
  sage:        { hp: 80,  hpPerLevel: 11, attack: 20, attackPerLevel: 4,  defense: 8,  defensePerLevel: 2, mp: 120, mpPerLevel: 6, speed: 17, speedPerLevel: 0.2 },
  summoner:    { hp: 75,  hpPerLevel: 10, attack: 18, attackPerLevel: 4,  defense: 6,  defensePerLevel: 1, mp: 130, mpPerLevel: 6, speed: 16, speedPerLevel: 0.2 },
  enchanter:   { hp: 80,  hpPerLevel: 11, attack: 18, attackPerLevel: 4,  defense: 7,  defensePerLevel: 2, mp: 90,  mpPerLevel: 5, speed: 26, speedPerLevel: 0.4 },
}

export function expForNextLevel(level: number): number {
  return level * level * 15
}

/** 現在レベルの進捗EXP表示用: { current: 現レベル内の積み, needed: 次レベルまでの必要量 } */
export function expProgress(char: { level: number; experience: number }): { current: number; needed: number } {
  const start  = expForNextLevel(char.level - 1)  // このレベルに達した時点の累積EXP
  const next   = expForNextLevel(char.level)       // 次のレベルに必要な累積EXP
  return {
    current: char.experience - start,
    needed:  next - start,
  }
}

export function calcMaxStats(char: Character): { maxHp: number; maxMp: number; attack: number; defense: number; speed: number } {
  const base = CLASS_STATS[char.class]
  const lv = char.level - 1
  const equips = Object.values(char.equipment).filter(Boolean)
  const equipBonus = equips.reduce(
    (acc, e) => {
      const stats = getEnhancedStats(e!)
      return { hp: acc.hp + stats.hpBonus, atk: acc.atk + stats.attackBonus, def: acc.def + stats.defenseBonus, spd: acc.spd + stats.speedBonus }
    },
    { hp: 0, atk: 0, def: 0, spd: 0 },
  )
  return {
    maxHp:   base.hp      + lv * base.hpPerLevel     + equipBonus.hp,
    maxMp:   base.mp      + lv * base.mpPerLevel,
    attack:  base.attack  + lv * base.attackPerLevel  + equipBonus.atk,
    defense: base.defense + lv * base.defensePerLevel + equipBonus.def,
    speed:   base.speed   + Math.floor(lv * base.speedPerLevel) + equipBonus.spd,
  }
}

export const MAX_LEVEL = 99

export function applyExperience(char: Character, expGained: number): Character {
  if (char.level >= MAX_LEVEL) return char
  let updated = { ...char, experience: char.experience + expGained }
  while (updated.level < MAX_LEVEL && updated.experience >= expForNextLevel(updated.level)) {
    updated = levelUp(updated)
  }
  return updated
}

function levelUp(char: Character): Character {
  const newLevel = char.level + 1
  const newStats = calcMaxStats({ ...char, level: newLevel })
  const allLearned = getLearnedSkills(char.class, newLevel)
  const currentIds = new Set(char.skills.map((s) => s.id))
  const skills = [...char.skills]
  for (const s of allLearned) {
    if (skills.length >= 3) break
    if (!currentIds.has(s.id)) skills.push(s)
  }
  return {
    ...char,
    level:   newLevel,
    maxHp:   newStats.maxHp,
    maxMp:   newStats.maxMp,
    hp:      newStats.maxHp,
    mp:      newStats.maxMp,
    attack:  newStats.attack,
    defense: newStats.defense,
    speed:   newStats.speed,
    skills,
  }
}
