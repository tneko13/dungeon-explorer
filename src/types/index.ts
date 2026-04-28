// ============================================================
// キャラクター
// ============================================================
export type CharacterClass = 'warrior' | 'mage' | 'rogue' | 'priest' | 'ranger' |
  'knight' | 'wizard' | 'assassin' | 'paladin' | 'bard' |
  'berserker' | 'witch' | 'monk' | 'druid' | 'dancer' |
  'dark_knight' | 'necromancer' | 'sage' | 'summoner' | 'enchanter'

export type EquipmentSlot = 'weapon' | 'armor' | 'accessory'
export type WeaponTag = 'sword' | 'greatsword' | 'dagger' | 'staff' | 'bow' | 'mace' | 'fist' | 'holy' | 'scythe'
export type ArmorTag  = 'heavy' | 'light' | 'robe' | 'holy_armor'

export type Stance = 'normal' | 'aggressive' | 'defensive' | 'conserve' | 'magic' | 'swift' | 'healer' | 'support'
export type ElementType = 'none' | 'fire' | 'ice' | 'thunder' | 'light' | 'dark'

// ============================================================
// 装備の特殊効果
// ============================================================
export type SpecialEffectType =
  | 'mp_cost_ratio'   // MPコスト倍率 (value: 0.1 → 1/10消費)
  | 'atk_zero'        // 自身のATKを0に固定（回復・補助特化用）
  | 'hp_regen'        // 毎行動MaxHP×valueを自動回復
  | 'mp_regen'        // 毎行動MaxMP×valueを自動回復
  | 'lifesteal'       // ダメージの一部をHP回復 (value: 0.15 → 15%)
  | 'element_boost'   // 特定属性の威力アップ (element+value: 0.5 → +50%)
  | 'healing_boost'   // 回復量アップ (value: 0.5 → +50%)
  | 'crit_chance'     // 会心率追加 (value: 0.10 → +10%)
  | 'auto_revive'     // 1戦闘中1回、戦闘不能を防いでHP1で復帰
  | 'last_stand'      // HP25%以下のとき ATK上昇 (value: 1.0 → +100%)

export interface SpecialEffect {
  type: SpecialEffectType
  value?: number
  element?: ElementType  // element_boost で属性を指定
}

export interface Equipment {
  id: string
  baseId?: string  // ドロップ品はインスタンスID。種類の識別は baseId ?? id
  name: string
  slot: EquipmentSlot
  weaponTag?: WeaponTag   // weapon のみ。未設定なら全職業OK
  armorTag?:  ArmorTag    // armor のみ。未設定なら全職業OK
  attackBonus: number
  defenseBonus: number
  hpBonus: number
  speedBonus?: number
  element?: ElementType                               // 武器属性（通常攻撃に属性追加）
  elementResist?: Partial<Record<ElementType, number>> // 属性耐性 0-1（その属性ダメージを軽減）
  specialEffects?: SpecialEffect[]                    // 特殊効果リスト
  description: string
  enhancement?: number // 0〜10
  bossOnly?: boolean   // 行商人の販売リストから除外
  spriteCoord?: { col: number; row: number } // スプライトシート座標
}

export interface Character {
  id: string
  name: string
  class: CharacterClass
  level: number
  experience: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  attack: number
  defense: number
  speed: number
  stance: Stance
  skills: SkillCard[]
  equipment: Partial<Record<EquipmentSlot, Equipment>>
}

// ============================================================
// スキル（職業×レベルで自動習得）
// ============================================================
export type SkillType = 'attack' | 'heal' | 'buff' | 'debuff'
export type SkillAutoCondition = 'always' | 'hp_below_50' | 'hp_below_25' | 'combat_start' | 'enemy_hp_above_75'

export interface SkillCard {
  id: string
  name: string
  type: SkillType
  description: string
  cooldownMs: number
  lastUsedAt: number
  mpCost: number
  autoCondition: SkillAutoCondition
  element?: ElementType
  buffEffects?: BuffType[]        // buff スキル: 付与するバフの種類（複数可）
  buffTarget?: 'self' | 'party'   // buff スキル: 対象（デフォルト self）
  cureEffect?: StatusEffect | 'all' // heal スキル: 解除する状態異常
}

// ============================================================
// パーティ
// ============================================================
export interface Party {
  members: Character[]
}

// ============================================================
// マイパーティセット
// ============================================================
export interface PartySetMember {
  characterId: string
  equipment: Partial<Record<EquipmentSlot, Equipment>>
  activeSkillIds: string[]
  stance: Stance
}

export interface PartySet {
  id: number
  name: string
  members: PartySetMember[]
}

// ============================================================
// ダンジョン
// ============================================================
export type DungeonStatus = 'exploring' | 'complete' | 'failed' | 'retreated'

export interface Dungeon {
  id: string
  name: string
  floors: number
  difficulty: number
  recommendedLevel: number
  unlockedByDefault: boolean
}

// ============================================================
// フロア
// ============================================================
export type FloorType = 'combat' | 'event' | 'boss'
export type EventType = 'treasure' | 'trap' | 'spring' | 'shrine' | 'rest' | 'merchant' | 'curse' | 'mana_drain' | 'confusion'

export interface FloorPlan {
  floorNumber: number
  type: FloorType
  eventType?: EventType
  enemies: Enemy[]
}

// ============================================================
// 敵スキル
// ============================================================
export type EnemySkillEffectType = 'attack_single' | 'attack_all' | 'heal_self' | 'debuff_all' | 'debuff_single'

export interface EnemySkill {
  id: string
  name: string
  mpCost: number
  cooldownMs: number
  condition: 'always' | 'hp_below_50' | 'hp_below_25'
  effect: {
    type: EnemySkillEffectType
    power?: number          // 攻撃倍率（デフォルト1.5）
    element?: ElementType
    debuff?: StatusEffect   // デバフ系
    debuffChance?: number   // デバフ付与確率（0-1、デフォルト1.0）
    healRate?: number       // 自己回復率（maxHpに対する割合）
  }
}

// ============================================================
// 敵ドロップ定義
// ============================================================
export interface EnemyDrop {
  itemId: string   // EQUIPMENT_MASTER のベースID
  chance: number   // 0-1 のドロップ確率
}

// ============================================================
// 敵
// ============================================================
export interface Enemy {
  id: string
  name: string
  hp: number
  maxHp: number
  mp?: number              // 現在MP（省略時0）
  maxMp?: number           // 最大MP
  attack: number
  defense: number
  speed?: number           // 行動速度（デフォルト24 = 2500ms間隔）
  expReward: number
  goldReward: number
  isBoss: boolean
  element?: ElementType
  debuffOnHit?: { type: StatusEffect; chance: number }  // 通常攻撃時にプレイヤーへデバフ付与
  skills?: EnemySkill[]                                  // スキルリスト（ボス用）
  statusResist?: Partial<Record<StatusEffect, number>>   // 状態異常耐性 0-1（ボス用）
  drops?: EnemyDrop[]                                    // 個別装備ドロップ定義
  floorMin?: number        // 出現最小フロア（ENEMY_POOL用）
  floorMax?: number        // 出現最大フロア（ENEMY_POOL用）
}

// ============================================================
// 状態異常
// ============================================================
export type StatusEffect = 'poison' | 'stagger' | 'bind' | 'seal_atk' | 'seal_def'
export interface StatusEntry { type: StatusEffect; actionsLeft: number; stacks?: number }

// ============================================================
// バフ
// ============================================================
export type BuffType = 'atk_up' | 'def_up' | 'spd_up' | 'regen' | 'barrier' | 'focus' | 'guard'
export interface BuffEntry { type: BuffType; actionsLeft: number; stacks: number }

// ============================================================
// 召喚ユニット（戦闘中のみ存在する一時的な味方）
// ============================================================
export interface SummonedUnit {
  instanceId: string      // 召喚インスタンスの一意ID
  id: string              // キャラ画像ID (images/characters/{id}.png)
  name: string
  maxHp: number
  hp: number
  attack: number
  defense: number
  speed: number
  summonedByMemberIdx: number  // 召喚したパーティメンバーのインデックス
}

// ============================================================
// 戦闘中状態（探索セッションに保存）
// ============================================================
export interface ActiveCombatState {
  enemyHp: number[]
  enemyMp: number[]              // [enemyIdx] 現在MP
  nextMemberAttackMs: number[]   // countdown to next normal attack per member
  nextEnemyAttackMs: number[]    // [enemyIdx] 各敵の次の行動までのカウントダウン
  skillCooldownMs: number[][]    // [memberIdx][skillSlotIdx] remaining cooldown
  enemySkillCooldownMs: number[][] // [enemyIdx][skillIdx] 敵スキルのクールダウン
  playerTargets: number[]        // target enemy index override per member (-1 = auto)
  elapsedMs: number
  enemyStatuses: StatusEntry[][]  // [enemyIdx] active status effects
  stanceCooldowns: number[]       // [memberIdx] actions remaining before stance can change
  partyBuffs: BuffEntry[][]       // [memberIdx] active buffs
  summons: SummonedUnit[]         // 戦闘中の召喚ユニット一覧
  partyStatuses: StatusEntry[][]  // [memberIdx] player-side debuffs (from enemy abilities)
  autoReviveUsed?: boolean[]      // [memberIdx] auto_revive 効果使用済みフラグ
}

// ============================================================
// スタンス修正値
// ============================================================
export interface StanceModifiers {
  atkMul: number
  defMul: number
  intervalMul: number
  skillDmgMul: number
  mpCostMul: number
  mpRecoveryMul: number  // between-floor MP recovery multiplier
  skillFilter: SkillType[] | null  // null = all skill types allowed
}

// ============================================================
// 探索セッション（出発〜帰還の1回分）
// ============================================================
// 次の戦闘に持ち越す事前モディファイア（curse/confusion/shrine）
export interface PendingCombatMod {
  type: 'curse' | 'confusion' | 'shrine'
  memberIdx: number | null  // null = パーティ全員
}

export interface ExpeditionSession {
  dungeonId: string
  startedAt: number
  currentFloor: number
  status: DungeonStatus
  floorPlan: FloorPlan[]
  partyHp: number[]
  partyMp: number[]
  partyStances: Stance[]
  dungeonTimeLimitMs: number
  activeCombat: ActiveCombatState | null
  floorClearPauseMs: number  // countdown after floor clear before advancing
  accumulatedGold: number
  accumulatedExp: number
  simulatedMs: number        // total dungeon time simulated (for time-limit checks)
  droppedItems: Equipment[]
  lastTickAt: number
  log: ExpeditionLog[]
  pendingCombatMods: PendingCombatMod[]
}

export interface ExpeditionLog {
  timestamp: number
  message: string
  type: 'system' | 'ally_attack' | 'ally_heal' | 'ally_buff' | 'enemy_attack' | 'enemy_heal' | 'enemy_buff' | 'reward' | 'event'
}

// ============================================================
// リソース
// ============================================================
export interface Resources {
  gold: number
  materials: Record<string, number>
}

// ============================================================
// 探索結果（帰還時の表示用）
// ============================================================
export interface MemberExpResult {
  name: string
  levelBefore: number
  levelAfter: number
  expGained: number
}

export interface ExpeditionResult {
  dungeonName: string
  status: DungeonStatus
  goldGained: number
  goldPenalty: number
  droppedItems: Equipment[]
  memberResults: MemberExpResult[]
}

// ============================================================
// ゲーム全体の状態
// ============================================================
// ============================================================
// 画面種別
// ============================================================
export type AppScreen = 'title' | 'game' | 'story'

// ============================================================
// ストーリー再生リクエスト
// ============================================================
export interface StoryPlayRequest {
  chapterId: string
  /** 完了後に遷移するアクション */
  onComplete: 'go_game' | 'stay'
}

export interface GameState {
  version: number
  lastSavedAt: number
  resources: Resources
  party: Party
  roster: Character[]
  ownedEquipment: Equipment[]
  discoveredEquipmentIds: string[]
  defeatedEnemyIds: string[]
  unlockedDungeons: string[]
  debugViewAllEnemies: boolean
  unlockedClasses: string[]
  expedition: ExpeditionSession | null
  expeditionResult: ExpeditionResult | null
  partySets: (PartySet | null)[]
  unlockedTitles: string[]
  newlyUnlockedTitles: string[]
  clearedDungeons: string[]
  wipeCount: number
  retreatCount: number
  totalExpeditions: number
  totalClears: number
  totalGoldEarned: number
  viewedStoryIds: string[]       // 既読ストーリーID一覧
  pendingStoryId: string | null  // 次に再生するストーリーID（ダンジョンクリア後にセット）
  notifEnabled: boolean          // アプリ内通知ON/OFF
  battleSpeed: 1 | 2 | 3        // 戦闘倍速（1=等速, 2=2倍速, 3=3倍速）
}
