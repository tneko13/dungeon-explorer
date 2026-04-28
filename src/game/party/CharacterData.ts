import type { Character } from '../../types'
import { calcMaxStats } from '../CharacterEngine'
import { getLearnedSkills } from '../skills/SkillMasterData'

function makeCharacter(id: string, name: string, charClass: Character['class'], level = 1): Character {
  const base: Character = {
    id, name, class: charClass,
    level, experience: 0,
    hp: 0, maxHp: 0, mp: 0, maxMp: 0,
    attack: 0, defense: 0, speed: 0,
    stance: 'normal',
    skills: getLearnedSkills(charClass, level),
    equipment: {},
  }
  const stats = calcMaxStats(base)
  return { ...base, ...stats, hp: stats.maxHp, mp: stats.maxMp }
}

export const STARTER_CHARACTERS: Character[] = [
  makeCharacter('warrior_01', 'テッサ',   'warrior', 1),
  makeCharacter('mage_01',    'サーシャ', 'mage',    1),
  makeCharacter('priest_01',  'ルカ',     'priest',  1),
  makeCharacter('rogue_01',   'ナジャ',   'rogue',   1),
  makeCharacter('ranger_01',  'リン',     'ranger',  1),
]

export const CLASS_UNLOCK_CHARACTERS: Record<string, Character[]> = {
  goblin_cave: [
    makeCharacter('knight_01',   'イゼルト',   'knight',   1),
    makeCharacter('wizard_01',   'セラフィ',   'wizard',   1),
    makeCharacter('assassin_01', 'シャーキア', 'assassin', 1),
    makeCharacter('paladin_01',  'セレスト',   'paladin',  1),
    makeCharacter('bard_01',     'リラ',       'bard',     1),
  ],
  ancient_ruins: [
    makeCharacter('berserker_01', 'ブリュン', 'berserker', 1),
    makeCharacter('witch_01',     'モーヴァ', 'witch',     1),
    makeCharacter('monk_01',      'リョウ',   'monk',      1),
    makeCharacter('druid_01',     'フィリ',   'druid',     1),
    makeCharacter('dancer_01',    'ルミエ',   'dancer',    1),
  ],
  dark_forest: [
    makeCharacter('dark_knight_01', 'モルガ',     'dark_knight', 1),
    makeCharacter('necromancer_01', 'ゼラ',       'necromancer', 1),
    makeCharacter('sage_01',        'イリス',     'sage',        1),
    makeCharacter('summoner_01',    'カレン',     'summoner',    1),
    makeCharacter('enchanter_01',   'エデア',     'enchanter',   1),
  ],
}

/**
 * キャラクター切り取り位置（CSS background-position %）
 * x/y: 詳細パネルのバストアップ用
 * ix/iy: サイドバーアイコン用（顔アップ・鎖骨〜頭頂部）
 */
export const PORTRAIT_CROP: Record<string, { x: number; y: number; ix: number; iy: number }> = {
  warrior:     { x: 55, y:  0, ix: 59, iy:  3 },
  mage:        { x: 55, y:  0, ix: 57, iy:  5 },
  priest:      { x: 55, y:  3, ix: 56, iy:  4 },
  rogue:       { x: 56, y:  -3, ix: 57, iy:  0 },
  ranger:      { x: 50, y:  0, ix: 56, iy:  2 },
  knight:      { x: 56, y:  -2, ix: 60, iy:  1 },
  wizard:      { x: 50, y:  -2, ix: 55, iy:  2 },
  assassin:    { x: 62, y:  -4, ix: 64, iy:  0 },
  paladin:     { x: 64, y:  -5, ix: 62, iy:  -1 },
  bard:        { x: 67, y:  -5, ix: 68, iy:  0 },
  berserker:   { x: 46, y:  -2, ix: 48, iy:  2 },
  witch:       { x: 60, y:  2, ix: 60, iy:  7 },
  monk:        { x: 56, y:  0, ix: 56, iy:  3 },
  druid:       { x: 55, y:  -2, ix: 57, iy:  1 },
  dancer:      { x: 50, y:  -3, ix: 54, iy:  1 },
  dark_knight: { x: 54, y:  -4, ix: 58, iy:  0 },
  necromancer: { x: 56, y:  -2, ix: 58, iy:  2 },
  sage:        { x: 59, y:  -1, ix: 60, iy:  4 },
  summoner:    { x: 54, y:  -6, ix: 55, iy:  -1 },
  enchanter:   { x: 60, y:  -5, ix: 61, iy:  0 },
}

export const CLASS_LABEL: Record<string, string> = {
  warrior:     '戦士',
  mage:        '魔法使い',
  rogue:       '盗賊',
  priest:      '僧侶',
  ranger:      '弓使い',
  knight:      '騎士',
  wizard:      '魔導師',
  assassin:    '暗殺者',
  paladin:     '聖騎士',
  bard:        '吟遊詩人',
  berserker:   '狂戦士',
  witch:       '魔女',
  monk:        '武道家',
  druid:       'ドルイド',
  dancer:      '踊り子',
  dark_knight: '闇騎士',
  necromancer: '死霊術士',
  sage:        '賢者',
  summoner:    '召喚士',
  enchanter:   '魔法剣士',
}
