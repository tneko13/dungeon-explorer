# 装備品生成 指示書

## 概要

このドキュメントは、Dungeon Explorerゲームの新しい装備品データをTypeScriptで生成するためのAI向け指示書です。
生成したデータは `src/game/equipment/EquipmentData.ts` の `EQUIPMENT_MASTER` 配列に追加します。

---

## TypeScript型定義（参考）

```typescript
// src/types/index.ts より抜粋
type EquipmentSlot = 'weapon' | 'armor' | 'accessory'
type WeaponTag = 'sword' | 'greatsword' | 'dagger' | 'staff' | 'bow' | 'mace' | 'fist' | 'holy' | 'scythe'
type ArmorTag  = 'heavy' | 'light' | 'robe' | 'holy_armor'
type ElementType = 'none' | 'fire' | 'ice' | 'thunder' | 'light' | 'dark'

type SpecialEffectType =
  | 'mp_cost_ratio'   // MPコスト倍率（乗算合成）
  | 'atk_zero'        // ATKを0に固定
  | 'hp_regen'        // 毎行動MaxHP×valueを自動回復
  | 'mp_regen'        // 毎行動MaxMP×valueを自動回復
  | 'lifesteal'       // ダメージの一部をHP回復
  | 'element_boost'   // 特定属性スキルの威力アップ
  | 'healing_boost'   // 回復量アップ
  | 'crit_chance'     // 会心率追加
  | 'auto_revive'     // 1戦闘中1回、戦闘不能をHP1で防ぐ
  | 'last_stand'      // HP25%以下のときATK上昇

interface SpecialEffect {
  type: SpecialEffectType
  value?: number        // 効果量（auto_revive/atk_zeroは不要）
  element?: ElementType // element_boost で属性を指定
}

interface Equipment {
  id: string              // スネークケース（例: 'flame_sword'）
  name: string            // 日本語名
  slot: EquipmentSlot
  weaponTag?: WeaponTag   // weapon のみ
  armorTag?: ArmorTag     // armor のみ
  attackBonus: number
  defenseBonus: number
  hpBonus: number
  speedBonus?: number     // スピードボーナス（任意）
  element?: ElementType   // 武器属性（通常攻撃に付与）
  elementResist?: Partial<Record<ElementType, number>> // 属性耐性 0-1
  specialEffects?: SpecialEffect[]
  description: string     // 効果の説明（日本語、1〜2文）
  bossOnly?: boolean      // trueにするとティア4扱い（行商人から除外）
}
```

---

## 職業別装備制限（必ず守ること）

### 武器タグと使用可能職業

| weaponTag | 使用可能職業 |
|-----------|------------|
| sword（剣） | 戦士・盗賊・騎士・聖騎士・魔法剣士 |
| greatsword（大剣） | 戦士・騎士・狂戦士・闇騎士 |
| dagger（短剣） | 盗賊・暗殺者・吟遊詩人・踊り子 |
| staff（杖） | 魔法使い・魔導師・魔女・ドルイド・死霊術士・賢者・召喚士・魔法剣士 |
| bow（弓） | 弓使い・吟遊詩人 |
| mace（鎚） | 戦士・僧侶・騎士 |
| fist（拳） | 狂戦士・武道家 |
| holy（聖具） | 僧侶・聖騎士・ドルイド・賢者 |
| scythe（鎌） | 魔女・闇騎士・死霊術士 |

### 防具タグと使用可能職業

| armorTag | 使用可能職業 |
|---------|------------|
| heavy（重鎧） | 戦士・騎士・狂戦士・聖騎士・闇騎士・berserker |
| light（軽鎧） | 戦士・盗賊・弓使い・騎士・暗殺者・聖騎士・吟遊詩人・狂戦士・武道家・ドルイド・踊り子・魔法剣士 |
| robe（ローブ） | 魔法使い・魔導師・魔女・ドルイド・死霊術士・賢者・召喚士・魔法剣士 |
| holy_armor（聖装） | 僧侶・聖騎士・賢者 |

アクセサリ（slot: 'accessory'）は全職業が装備可能。weaponTag/armorTag不要。

---

## ドロップ難易度ティア

| ティア | 難易度 | 対象ダンジョン | ATK目安 | DEF目安 |
|--------|--------|-------------|---------|---------|
| 1 | 難易度1〜2 | ゴブリンの洞窟・古代遺跡 | +3〜+7 | +3〜+8 |
| 2 | 難易度2〜3 | 古代遺跡〜暗黒の森 | +6〜+12 | +6〜+12 |
| 3 | 難易度3〜5 | 暗黒の森〜奈落の迷宮 | +12〜+22 | +12〜+22 |
| 4 | ボス専用（bossOnly） | 混沌の試練・ラストボス | +25〜+45 | +25〜+40 |

**特殊効果装備はTier3〜4に配置する。**

---

## 生成するものの要件

### 数量・バリエーション目標

以下のカテゴリで **合計60〜80アイテム** を追加してほしい（既存40アイテムと合わせてゲームに飽きないだけのバリエーション）：

| カテゴリ | 目標数 | 注意 |
|---------|--------|------|
| Tier1 武器（各タグ） | 8〜10 | 基本武器を全タグ揃える |
| Tier2 武器（各タグ） | 8〜10 | 中級武器 |
| Tier3 通常武器 | 8〜10 | 高級武器・属性武器含む |
| Tier3 特殊効果武器 | 6〜8 | 個性的な効果 |
| Tier2〜3 防具 | 8〜10 | 各タグをカバー |
| Tier3〜4 特殊効果防具 | 4〜6 | 特化型装備 |
| アクセサリ（全ティア） | 8〜12 | SPD・HP・属性耐性・特殊効果 |
| Tier4 ボス専用 | 8〜10 | 超強力・特殊効果あり |

### 命名規則

- **id**: スネークケース英語（例: `thunder_lance`, `frost_ring`）
- **name**: 日本語（カタカナ・漢字混じり）
- 同じidは使わないこと（既存idとの重複禁止）

### 既存アイテムID（重複禁止）

```
iron_sword, holy_mace, leather_armor, power_ring, iron_shield, short_bow,
iron_knuckle, leather_boots, magic_staff, swift_dagger, long_bow, chain_mail,
robe_of_mana, vitality_amulet, monks_fist, wind_boots, dragon_fang,
ancient_staff, elven_bow, dragon_claw, dragon_scale, gale_boots, dragon_amulet,
chaos_sword, chaos_staff, chaos_bow, chaos_blade, chaos_fist, chaos_scythe,
chaos_greatsword, chaos_armor, chaos_robe, chaos_leather, chaos_ring,
chaos_amulet, chaos_boots, flame_blade, frost_staff, saints_mantle,
soul_reaper, berserk_knuckle, sages_robe, flame_guard, void_aegis
```

---

## バランスガイドライン

### ステータスの目安

| ティア | 武器ATK | 防具DEF | 防具HP | アクセサリ |
|--------|---------|---------|-------|-----------|
| 1 | +3〜+8 | +3〜+8 | +5〜+15 | ATK+2〜+5 or HP+15〜+25 or SPD+3〜+6 |
| 2 | +8〜+15 | +7〜+14 | +15〜+35 | 各上限の1.5倍 |
| 3 | +15〜+25 | +14〜+22 | +30〜+60 | 各上限の2〜2.5倍 |
| 4 | +25〜+45 | +25〜+40 | +60〜+120 | 各上限の3〜4倍 |

### 特殊効果のバランス

| 効果 | 弱め（Tier3） | 強め（Tier4） |
|------|-------------|-------------|
| lifesteal | 0.10〜0.15 | 0.20〜0.30 |
| hp_regen | 0.02〜0.03 | 0.04〜0.06 |
| mp_regen | 0.03〜0.05 | 0.06〜0.10 |
| healing_boost | 0.3〜0.5 | 0.6〜1.0 |
| element_boost | 0.3〜0.5 | 0.6〜1.0 |
| crit_chance | 0.05〜0.10 | 0.10〜0.20 |
| mp_cost_ratio | 0.5〜0.7 | 0.1〜0.3 |
| last_stand | 0.5〜1.0 | 1.5〜2.5 |
| elementResist（1属性） | 0.30〜0.50 | 0.50〜0.70 |
| elementResist（2属性） | 0.20〜0.35 each | 0.40〜0.60 each |

### ピーキーな装備の作り方（推奨）

- 強い特殊効果 → ステータス低め（例: 吸血20% だがATK+8）
- ステータス高め → 特殊効果なし or デメリット（例: ATK+40 だが hp_regen がない）
- 複数特殊効果 → ステータスを最小限に（例: MP系2つ組み合わせ）
- atk_zero は healing_boost や mp_cost_ratio とセットにして回復専用装備にする

---

## 出力フォーマット

以下のTypeScript形式で出力してください。各アイテムの直前に `// ティアX カテゴリ（テーマ）` のコメントを入れてください。

```typescript
// Tier2 武器（雷）
{ id: 'thunder_lance', name: '雷鳴の槍', slot: 'weapon', weaponTag: 'sword',
  attackBonus: 11, defenseBonus: 0, hpBonus: 0,
  element: 'thunder',
  description: '雷神の加護を受けた槍。雷属性の攻撃を行う' },

// Tier3 防具（MP回復）
{ id: 'arcane_robe', name: '魔力回復のローブ', slot: 'armor', armorTag: 'robe',
  attackBonus: 4, defenseBonus: 6, hpBonus: 0,
  specialEffects: [{ type: 'mp_regen', value: 0.04 }],
  description: '魔力が自然と湧き出るローブ。毎行動MaxMPの4%を自動回復する' },

// Tier4 アクセサリ（自動復活・属性耐性）
{ id: 'phoenix_feather', name: '不死鳥の羽根', slot: 'accessory',
  attackBonus: 0, defenseBonus: 10, hpBonus: 80,
  elementResist: { fire: 0.50 },
  specialEffects: [{ type: 'auto_revive' }],
  description: '炎の加護で1度だけ戦闘不能を防ぐ。火属性ダメージも50%軽減',
  bossOnly: true },
```

---

## テーマ・世界観のヒント

- **炎系**: 竜・火山・溶岩・炎龍・業火・煉獄
- **氷系**: 永久凍土・吹雪・氷晶・霜・雪女
- **雷系**: 雷神・稲妻・嵐・天空・電光
- **光系**: 聖剣・神・天使・神聖・浄化
- **闇系**: 死霊・冥界・呪い・腐敗・影・虚無
- **無属性物理系**: 覇王・鉄・剛・岩・大地
- **回復系**: 聖者・癒し・奇跡・信仰・守護
- **速度系**: 疾風・天馬・閃光・瞬歩

---

## 追加ルール

1. `attackBonus`, `defenseBonus`, `hpBonus` は必ず数値で設定（0でも省略しない）
2. `speedBonus` は拳帯・靴系アイテムにのみ設定（武器・防具への設定は最小限に）
3. `bossOnly: true` はTier4のみ
4. `element_boost` には必ず `element` フィールドを指定
5. `description` は効果を正確に表現する（プレイヤーが見る）
6. ダンジョンをまんべんなくカバーするよう、Tier1〜3を適切に配分すること
