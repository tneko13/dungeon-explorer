import type { Dungeon } from '../../types'

export const DUNGEONS: Dungeon[] = [
  { id: 'goblin_cave',      name: 'ゴブリンの洞窟',   floors: 5,   difficulty: 1,  recommendedLevel: 1,  unlockedByDefault: true  },
  { id: 'ancient_ruins',    name: '古代遺跡',          floors: 12,  difficulty: 2,  recommendedLevel: 8,  unlockedByDefault: false },
  { id: 'dark_forest',      name: '暗黒の森',           floors: 25,  difficulty: 3,  recommendedLevel: 18, unlockedByDefault: false },
  { id: 'dragon_lair',      name: '竜の棲み処',         floors: 40,  difficulty: 4,  recommendedLevel: 28, unlockedByDefault: false },
  { id: 'abyss_labyrinth',  name: '奈落の迷宮',         floors: 55,  difficulty: 5,  recommendedLevel: 40, unlockedByDefault: false },
  { id: 'abyss_tower',      name: '深淵の塔',            floors: 75,  difficulty: 6,  recommendedLevel: 52, unlockedByDefault: false },
  { id: 'sacred_ruins',     name: '聖域の廃墟',          floors: 90,  difficulty: 7,  recommendedLevel: 62, unlockedByDefault: false },
  { id: 'eternal_sanctum',  name: '永遠の聖域',          floors: 120, difficulty: 8,  recommendedLevel: 70, unlockedByDefault: false },
  { id: 'trial_colosseum',  name: '試練の闘技場',        floors: 30,  difficulty: 5,  recommendedLevel: 65, unlockedByDefault: false },
  { id: 'chaos_trial',      name: '混沌の試練',          floors: 50,  difficulty: 10, recommendedLevel: 99, unlockedByDefault: false },
]

export const DUNGEON_MAP = new Map(DUNGEONS.map((d) => [d.id, d]))

export const UNLOCK_NEXT: Record<string, string> = {
  goblin_cave:     'ancient_ruins',
  ancient_ruins:   'dark_forest',
  dark_forest:     'dragon_lair',
  dragon_lair:     'abyss_labyrinth',
  abyss_labyrinth: 'abyss_tower',
  abyss_tower:     'sacred_ruins',
  sacred_ruins:    'eternal_sanctum',
  eternal_sanctum: 'trial_colosseum',
  trial_colosseum: 'chaos_trial',
}

export const UNLOCK_CLASSES: Record<string, string[]> = {
  goblin_cave:   ['knight', 'wizard', 'assassin', 'paladin', 'bard'],
  ancient_ruins: ['berserker', 'witch', 'monk', 'druid', 'dancer'],
  dark_forest:   ['dark_knight', 'necromancer', 'sage', 'summoner', 'enchanter'],
}
