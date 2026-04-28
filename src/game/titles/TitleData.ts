import type { GameState } from '../../types'
import { EQUIPMENT_MASTER } from '../equipment/EquipmentData'
import { DUNGEONS } from '../dungeon/DungeonData'

export interface TitleDef {
  id: string
  name: string
  description: string
  hidden?: boolean
  check: (s: GameState) => boolean
}

export const TITLES: TitleDef[] = [
  // ============================================================
  // 始まり
  // ============================================================
  {
    id: 'first_expedition',
    name: '旅立ち',
    description: '初めてダンジョンへ出発した',
    check: (s) => s.totalExpeditions >= 1,
  },
  {
    id: 'first_clear',
    name: '初陣',
    description: '初めてダンジョンをクリアした',
    check: (s) => s.clearedDungeons.length >= 1,
  },
  {
    id: 'first_wipe',
    name: '不屈の魂',
    description: '初めてパーティが全滅した',
    check: (s) => s.wipeCount >= 1,
  },
  {
    id: 'first_retreat',
    name: '勇気ある撤退',
    description: '初めて撤退した',
    check: (s) => s.retreatCount >= 1,
  },
  {
    id: 'first_equip',
    name: '初装備',
    description: '初めてキャラクターに装備を装備させた',
    check: (s) => s.roster.some((c) => c.equipment.weapon != null || c.equipment.armor != null || c.equipment.accessory != null),
  },
  {
    id: 'first_enhancement',
    name: '初強化',
    description: '初めて装備を強化した',
    check: (s) => s.ownedEquipment.some((e) => (e.enhancement ?? 0) >= 1),
  },

  // ============================================================
  // ダンジョン踏破
  // ============================================================
  {
    id: 'clear_goblin_cave',
    name: 'ゴブリン退治',
    description: 'ゴブリンの洞窟をクリアした',
    check: (s) => s.clearedDungeons.includes('goblin_cave'),
  },
  {
    id: 'clear_ancient_ruins',
    name: '遺跡探検家',
    description: '古代遺跡をクリアした',
    check: (s) => s.clearedDungeons.includes('ancient_ruins'),
  },
  {
    id: 'clear_dark_forest',
    name: '闇を歩む者',
    description: '暗黒の森をクリアした',
    check: (s) => s.clearedDungeons.includes('dark_forest'),
  },
  {
    id: 'clear_dragon_lair',
    name: '竜殺し',
    description: '竜の棲み処をクリアした',
    check: (s) => s.clearedDungeons.includes('dragon_lair'),
  },
  {
    id: 'clear_abyss_labyrinth',
    name: '奈落の探索者',
    description: '奈落の迷宮をクリアした',
    check: (s) => s.clearedDungeons.includes('abyss_labyrinth'),
  },
  {
    id: 'clear_abyss_tower',
    name: '深淵の踏破者',
    description: '深淵の塔をクリアした',
    check: (s) => s.clearedDungeons.includes('abyss_tower'),
  },
  {
    id: 'clear_chaos_trial',
    name: '混沌の征服者',
    description: '混沌の試練をクリアした',
    hidden: true,
    check: (s) => s.clearedDungeons.includes('chaos_trial'),
  },

  // ============================================================
  // 探索の広さ
  // ============================================================
  {
    id: 'cleared_3_dungeons',
    name: 'ダンジョン探索家',
    description: '3種類のダンジョンをクリアした',
    check: (s) => s.clearedDungeons.length >= 3,
  },
  {
    id: 'cleared_5_dungeons',
    name: '迷宮踏破者',
    description: '5種類のダンジョンをクリアした',
    check: (s) => s.clearedDungeons.length >= 5,
  },
  {
    id: 'cleared_all_dungeons',
    name: '迷宮制覇',
    description: '全てのダンジョンをクリアした',
    check: (s) => DUNGEONS.every((d) => s.clearedDungeons.includes(d.id)),
  },
  {
    id: 'all_dungeons_unlocked',
    name: '迷宮の支配者',
    description: '全てのダンジョンをアンロックした',
    check: (s) => DUNGEONS.every((d) => s.unlockedDungeons.includes(d.id)),
  },

  // ============================================================
  // 探索回数
  // ============================================================
  {
    id: 'exp_5',
    name: '冒険者の卵',
    description: '5回探索した',
    check: (s) => s.totalExpeditions >= 5,
  },
  {
    id: 'exp_20',
    name: '駆け出し冒険者',
    description: '20回探索した',
    check: (s) => s.totalExpeditions >= 20,
  },
  {
    id: 'exp_50',
    name: '旅慣れた冒険者',
    description: '50回探索した',
    check: (s) => s.totalExpeditions >= 50,
  },
  {
    id: 'exp_100',
    name: '百戦錬磨',
    description: '100回探索した',
    check: (s) => s.totalExpeditions >= 100,
  },
  {
    id: 'exp_200',
    name: '伝説の探索者',
    description: '200回探索した',
    hidden: true,
    check: (s) => s.totalExpeditions >= 200,
  },

  // ============================================================
  // 合計クリア数
  // ============================================================
  {
    id: 'clears_5',
    name: '迷宮の常連',
    description: '合計5回ダンジョンをクリアした',
    check: (s) => s.totalClears >= 5,
  },
  {
    id: 'clears_10',
    name: '踏破の達人',
    description: '合計10回ダンジョンをクリアした',
    check: (s) => s.totalClears >= 10,
  },
  {
    id: 'clears_30',
    name: '迷宮の主',
    description: '合計30回ダンジョンをクリアした',
    check: (s) => s.totalClears >= 30,
  },
  {
    id: 'clears_50',
    name: '迷宮の英雄',
    description: '合計50回ダンジョンをクリアした',
    check: (s) => s.totalClears >= 50,
  },
  {
    id: 'clears_100',
    name: '永遠の探求者',
    description: '合計100回ダンジョンをクリアした',
    hidden: true,
    check: (s) => s.totalClears >= 100,
  },

  // ============================================================
  // 個人レベル
  // ============================================================
  {
    id: 'any_lv5',
    name: '最初の壁',
    description: '誰かがLv5に到達した',
    check: (s) => s.roster.some((m) => m.level >= 5),
  },
  {
    id: 'any_lv10',
    name: '成長の証',
    description: '誰かがLv10に到達した',
    check: (s) => s.roster.some((m) => m.level >= 10),
  },
  {
    id: 'any_lv20',
    name: '一人前',
    description: '誰かがLv20に到達した',
    check: (s) => s.roster.some((m) => m.level >= 20),
  },
  {
    id: 'any_lv30',
    name: '中堅冒険者',
    description: '誰かがLv30に到達した',
    check: (s) => s.roster.some((m) => m.level >= 30),
  },
  {
    id: 'any_lv50',
    name: 'ベテラン',
    description: '誰かがLv50に到達した',
    check: (s) => s.roster.some((m) => m.level >= 50),
  },
  {
    id: 'any_lv70',
    name: '上位存在',
    description: '誰かがLv70に到達した',
    check: (s) => s.roster.some((m) => m.level >= 70),
  },
  {
    id: 'any_lv99',
    name: '頂点',
    description: 'いずれかのキャラクターがLv99に到達した',
    hidden: true,
    check: (s) => s.roster.some((m) => m.level >= 99),
  },

  // ============================================================
  // パーティレベル合計
  // ============================================================
  {
    id: 'party_sum_100',
    name: '成長するチーム',
    description: 'パーティのレベル合計が100以上',
    check: (s) => s.party.members.reduce((acc, m) => acc + m.level, 0) >= 100,
  },
  {
    id: 'party_sum_200',
    name: '合計戦力',
    description: 'パーティのレベル合計が200以上',
    check: (s) => s.party.members.reduce((acc, m) => acc + m.level, 0) >= 200,
  },
  {
    id: 'party_sum_300',
    name: '超精鋭部隊',
    description: 'パーティのレベル合計が300以上',
    check: (s) => s.party.members.reduce((acc, m) => acc + m.level, 0) >= 300,
  },
  {
    id: 'party_sum_396',
    name: '最強の布陣',
    description: 'パーティ全員がLv99（合計396）に到達した',
    hidden: true,
    check: (s) => s.party.members.length >= 4 && s.party.members.reduce((acc, m) => acc + m.level, 0) >= 396,
  },

  // ============================================================
  // Gold所持
  // ============================================================
  {
    id: 'gold_1k',
    name: '金持ちへの第一歩',
    description: '1,000 Zel以上を所持している',
    check: (s) => s.resources.gold >= 1_000,
  },
  {
    id: 'gold_10k',
    name: '小金持ち',
    description: '10,000 Zel以上を所持している',
    check: (s) => s.resources.gold >= 10_000,
  },
  {
    id: 'gold_100k',
    name: '万金の主',
    description: '100,000 Zel以上を所持している',
    check: (s) => s.resources.gold >= 100_000,
  },
  {
    id: 'gold_500k',
    name: '大金持ち',
    description: '500,000 Zel以上を所持している',
    hidden: true,
    check: (s) => s.resources.gold >= 500_000,
  },
  {
    id: 'gold_1m',
    name: '大富豪',
    description: '1,000,000 Zel以上を所持している',
    hidden: true,
    check: (s) => s.resources.gold >= 1_000_000,
  },

  // ============================================================
  // 累計Gold獲得
  // ============================================================
  {
    id: 'earned_10k',
    name: '初収入',
    description: '累計10,000 Zel以上獲得した',
    check: (s) => s.totalGoldEarned >= 10_000,
  },
  {
    id: 'earned_50k',
    name: '堅実な稼ぎ',
    description: '累計50,000 Zel以上獲得した',
    check: (s) => s.totalGoldEarned >= 50_000,
  },
  {
    id: 'earned_100k',
    name: '商売繁盛',
    description: '累計100,000 Zel以上獲得した',
    check: (s) => s.totalGoldEarned >= 100_000,
  },
  {
    id: 'earned_500k',
    name: '大商人',
    description: '累計500,000 Zel以上獲得した',
    check: (s) => s.totalGoldEarned >= 500_000,
  },
  {
    id: 'earned_1m',
    name: '黄金の覇者',
    description: '累計1,000,000 Zel以上獲得した',
    hidden: true,
    check: (s) => s.totalGoldEarned >= 1_000_000,
  },

  // ============================================================
  // 装備発見
  // ============================================================
  {
    id: 'equip_disc_5',
    name: '装備初心者',
    description: '5種類以上の装備を発見した',
    check: (s) => s.discoveredEquipmentIds.length >= 5,
  },
  {
    id: 'equip_disc_10',
    name: '装備収集家',
    description: '10種類以上の装備を発見した',
    check: (s) => s.discoveredEquipmentIds.length >= 10,
  },
  {
    id: 'equip_disc_20',
    name: '目利き',
    description: '20種類以上の装備を発見した',
    check: (s) => s.discoveredEquipmentIds.length >= 20,
  },
  {
    id: 'equip_disc_30',
    name: '武器商人の友',
    description: '30種類以上の装備を発見した',
    check: (s) => s.discoveredEquipmentIds.length >= 30,
  },
  {
    id: 'equip_disc_50',
    name: '武器庫の主',
    description: '50種類以上の装備を発見した',
    check: (s) => s.discoveredEquipmentIds.length >= 50,
  },
  {
    id: 'equip_disc_all',
    name: 'コレクター',
    description: '全ての装備を発見した',
    hidden: true,
    check: (s) => s.discoveredEquipmentIds.length >= EQUIPMENT_MASTER.length,
  },

  // ============================================================
  // 装備所持数
  // ============================================================
  {
    id: 'equip_count_10',
    name: '装備備蓄',
    description: '10個以上の装備を所持している',
    check: (s) => s.ownedEquipment.length >= 10,
  },
  {
    id: 'equip_count_50',
    name: '倉庫が必要',
    description: '50個以上の装備を所持している',
    check: (s) => s.ownedEquipment.length >= 50,
  },
  {
    id: 'equip_count_100',
    name: '装備マニア',
    description: '100個以上の装備を所持している',
    check: (s) => s.ownedEquipment.length >= 100,
  },
  {
    id: 'equip_count_200',
    name: '装備の山',
    description: '200個以上の装備を所持している',
    hidden: true,
    check: (s) => s.ownedEquipment.length >= 200,
  },

  // ============================================================
  // 強化
  // ============================================================
  {
    id: 'enhance_5',
    name: '強化の沼',
    description: '装備を+5まで強化した',
    check: (s) => s.ownedEquipment.some((e) => (e.enhancement ?? 0) >= 5),
  },
  {
    id: 'enhance_8',
    name: '強化マスター',
    description: '装備を+8まで強化した',
    check: (s) => s.ownedEquipment.some((e) => (e.enhancement ?? 0) >= 8),
  },
  {
    id: 'enhance_max',
    name: '究極の鍛冶師',
    description: '装備を最大強化（+10）した',
    hidden: true,
    check: (s) => s.ownedEquipment.some((e) => (e.enhancement ?? 0) >= 10),
  },
  {
    id: 'enhance_3x5',
    name: '強化コレクター',
    description: '+5以上の装備を3個以上所持している',
    check: (s) => s.ownedEquipment.filter((e) => (e.enhancement ?? 0) >= 5).length >= 3,
  },
  {
    id: 'enhance_5x5',
    name: '強化三昧',
    description: '+5以上の装備を5個以上所持している',
    check: (s) => s.ownedEquipment.filter((e) => (e.enhancement ?? 0) >= 5).length >= 5,
  },

  // ============================================================
  // 撤退
  // ============================================================
  {
    id: 'retreat_5',
    name: '生存優先',
    description: '5回撤退した',
    check: (s) => s.retreatCount >= 5,
  },
  {
    id: 'retreat_10',
    name: '臆病者？いや賢者',
    description: '10回撤退した',
    check: (s) => s.retreatCount >= 10,
  },
  {
    id: 'retreat_20',
    name: '撤退の美学',
    description: '20回撤退した',
    hidden: true,
    check: (s) => s.retreatCount >= 20,
  },
  {
    id: 'retreat_50',
    name: '撤退王',
    description: '50回撤退した',
    hidden: true,
    check: (s) => s.retreatCount >= 50,
  },

  // ============================================================
  // 職業・キャラクター
  // ============================================================
  {
    id: 'class_mid',
    name: '仲間との出会い',
    description: '10種類以上の職業のキャラクターを仲間にした',
    check: (s) => s.unlockedClasses.length >= 10,
  },
  {
    id: 'class_advanced',
    name: '集まる仲間たち',
    description: '15種類以上の職業のキャラクターを仲間にした',
    check: (s) => s.unlockedClasses.length >= 15,
  },
  {
    id: 'class_all',
    name: '全職業解放',
    description: '全ての職業を解放した',
    check: (s) => s.unlockedClasses.length >= 20,
  },

  // ============================================================
  // 装備・フル装備
  // ============================================================
  {
    id: 'party_all_weapons',
    name: '武装完了',
    description: 'パーティ全員が武器を装備している',
    check: (s) => s.party.members.length >= 4 && s.party.members.every((c) => c.equipment.weapon != null),
  },
  {
    id: 'party_all_armor',
    name: '鉄壁の守り',
    description: 'パーティ全員が防具を装備している',
    check: (s) => s.party.members.length >= 4 && s.party.members.every((c) => c.equipment.armor != null),
  },
  {
    id: 'full_equipped_char',
    name: 'フル装備',
    description: '1キャラクターが全スロット（武器・防具・アクセサリ）を装備した',
    check: (s) => s.roster.some((c) => c.equipment.weapon != null && c.equipment.armor != null && c.equipment.accessory != null),
  },
  {
    id: 'party_all_equipped',
    name: 'パーティフル装備',
    description: 'パーティ全員が全スロットを装備した',
    check: (s) => s.party.members.length >= 4 && s.party.members.every((c) => c.equipment.weapon != null && c.equipment.armor != null && c.equipment.accessory != null),
  },
  {
    id: 'party_sets_2',
    name: '編成マスター',
    description: 'マイパーティを2つ以上保存した',
    check: (s) => (s.partySets ?? []).filter((p) => p !== null).length >= 2,
  },

  // ============================================================
  // 隠し・特殊
  // ============================================================
  {
    id: 'exp_300',
    name: '冒険狂',
    description: '300回探索した',
    hidden: true,
    check: (s) => s.totalExpeditions >= 300,
  },
  {
    id: 'clears_200',
    name: '真の放浪者',
    description: '合計200回ダンジョンをクリアした',
    hidden: true,
    check: (s) => s.totalClears >= 200,
  },
  {
    id: 'earned_5m',
    name: '伝説の商人',
    description: '累計5,000,000 Zel以上獲得した',
    hidden: true,
    check: (s) => s.totalGoldEarned >= 5_000_000,
  },
  {
    id: 'full_roster_lv70',
    name: '精鋭の頂点',
    description: 'パーティ全員がLv70以上',
    hidden: true,
    check: (s) => s.roster.length > 0 && s.roster.every((m) => m.level >= 70),
  },
  {
    id: 'chaos_hero',
    name: '混沌の英雄',
    description: 'Lv99キャラクターを擁して混沌の試練をクリアした',
    hidden: true,
    check: (s) => s.clearedDungeons.includes('chaos_trial') && s.roster.some((m) => m.level >= 99),
  },
]

export function checkNewTitles(state: GameState): string[] {
  const current = new Set(state.unlockedTitles)
  return TITLES.filter((t) => !current.has(t.id) && t.check(state)).map((t) => t.id)
}
