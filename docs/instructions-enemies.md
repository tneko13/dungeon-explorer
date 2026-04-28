# 敵データ生成 指示書

## 概要

このドキュメントは、Dungeon Explorerゲームの新しい敵データをTypeScriptで生成するためのAI向け指示書です。
生成したデータは `src/game/dungeon/EnemyData.ts` の `ENEMY_POOL` および `BOSS_DATA` に追加・補強します。

---

## TypeScript型定義（参考）

```typescript
// src/types/index.ts より抜粋
type ElementType = 'none' | 'fire' | 'ice' | 'thunder' | 'light' | 'dark'
type StatusEffect = 'poison' | 'stagger' | 'bind' | 'seal_atk' | 'seal_def'
type EnemySkillEffectType = 'attack_single' | 'attack_all' | 'heal_self' | 'debuff_all' | 'debuff_single'

interface EnemySkill {
  id: string          // スネークケース英語（例: 'lich_dark_bolt'）
  name: string        // 日本語スキル名
  mpCost: number      // MP消費量
  cooldownMs: number  // クールダウン（ミリ秒）例: 20000 = 20秒
  condition: 'always' | 'hp_below_50' | 'hp_below_25'  // 発動条件
  effect: {
    type: EnemySkillEffectType
    power?: number        // 攻撃倍率（ATK × power）デフォルト1.5
    element?: ElementType // 攻撃属性
    debuff?: StatusEffect // デバフ系で付与するデバフ
    debuffChance?: number // デバフ付与確率 0-1（デフォルト1.0）
    healRate?: number     // 自己回復率（maxHpに対する割合）例: 0.05 = 5%
  }
}

interface Enemy {
  id: string              // スネークケース英語（例: 'fire_golem'）
  name: string            // 日本語名
  hp: number
  maxHp: number           // hp と同じ値を設定
  mp?: number             // 現在MP（maxMpと同じ値を設定、省略時0）
  maxMp?: number          // 最大MP（スキルを持つ場合は必須）
  attack: number
  defense: number
  speed?: number          // 行動速度（省略時24。60000/speedがms間隔）
  expReward: number
  goldReward: number
  isBoss: boolean         // 通常敵はfalse、ボスはtrue
  element?: ElementType   // 属性（なければ省略）
  debuffOnHit?: {
    type: StatusEffect    // 攻撃時に付与するデバフの種類
    chance: number        // 付与確率（0.0〜1.0）
  }
  skills?: EnemySkill[]                              // スキルリスト（主にボス用）
  statusResist?: Partial<Record<StatusEffect, number>> // 状態異常耐性 0-1
  drops?: EnemyDrop[]                                // 個別装備ドロップ定義
}

interface EnemyDrop {
  itemId: string   // EQUIPMENT_MASTER のベースID（例: 'iron_sword'）
  chance: number   // ドロップ確率 0〜1（例: 0.05 = 5%）
}
```

---

## 敵の役割分類

各ダンジョンの通常敵プールには、以下の**4つの役割**を必ず揃えること（タンク・アタッカー・魔法型・バランス型）：

| 役割 | 特徴 | HPの傾向 | ATKの傾向 | DEFの傾向 | speedの傾向 |
|------|------|---------|---------|---------|-----------|
| タンク型 | 硬くて遅い | 高（約×1.4） | 低（約×0.8） | 高（約×1.5） | 低（14〜18） |
| アタッカー型 | 速くて脆い | 中 | 高（約×1.3） | 低（約×0.6） | 高（28〜32） |
| 魔法型 | 中程度HP・高ATK | 低〜中 | 高（約×1.4） | 低（約×0.5） | 中〜高（24〜30） |
| バランス型 | 全体的に標準値 | 中 | 中 | 中 | 中（20〜24） |

**1ダンジョンあたり4体** が基本（既存プールに追加する場合は役割の穴埋めを優先）。

---

## speed（行動速度）について

`speed` は行動間隔を決める値。**高いほど行動が速い**。

```
攻撃間隔(ms) = round(60000 / speed)
```

| speed | 間隔 | 目安 |
|-------|------|------|
| 14 | 4286ms | 非常に遅い（タンク系） |
| 18 | 3333ms | 遅い |
| 22 | 2727ms | 標準 |
| 24 | 2500ms | 標準（デフォルト） |
| 28 | 2143ms | 速い（アタッカー系） |
| 32 | 1875ms | 非常に速い（アタッカー系） |

- `speed` を省略すると 24 扱い
- タンク型: 14〜18、アタッカー型: 28〜32、バランス: 22〜24

---

## ダンジョン別ステータス基準値

### 通常敵のステータス目安（4体の平均）

| ダンジョン | 難易度 | 推奨Lv | HP基準 | ATK基準 | DEF基準 | EXP基準 | Gold基準 |
|----------|--------|-------|-------|---------|---------|---------|---------|
| ゴブリンの洞窟 | 1 | Lv1〜10 | 60〜100 | 14〜22 | 2〜8 | 12〜20 | 5〜12 |
| 古代遺跡 | 2 | Lv8〜20 | 200〜420 | 45〜85 | 8〜35 | 55〜85 | 22〜40 |
| 暗黒の森 | 3 | Lv18〜30 | 350〜650 | 70〜120 | 20〜50 | 90〜125 | 40〜60 |
| 竜の棲み処 | 4 | Lv28〜42 | 650〜1200 | 120〜175 | 35〜90 | 155〜230 | 80〜115 |
| 奈落の迷宮 | 5 | Lv40〜55 | 1100〜2000 | 190〜280 | 60〜120 | 300〜420 | 145〜200 |
| 深淵の塔 | 6 | Lv52〜65 | 1600〜2800 | 280〜420 | 80〜185 | 1100〜1500 | 255〜310 |
| 聖域の廃墟 | 7 | Lv62〜72 | 1800〜3200 | 220〜360 | 60〜130 | 1500〜2000 | 330〜420 |
| 永遠の聖域 | 8 | Lv70〜85 | 2500〜4500 | 260〜420 | 75〜150 | 2000〜2500 | 445〜530 |
| 試練の闘技場 | 5 | Lv65〜80 | 1800〜3500 | 280〜450 | 55〜130 | 2800〜3600 | 490〜650 |
| 混沌の試練 | 10 | Lv99 | 5000〜11000 | 300〜400 | 120〜240 | 5000〜6500 | 2000〜2600 |

---

## ボスのステータス目安

ボスは通常敵より大幅に強く、`debuffOnHit` で攻撃時デバフを持つことが多い。
**ボスには必ず `speed`・`maxMp`・`skills`・`statusResist` を設定すること。**

| ダンジョン | HP | ATK | DEF | EXP | Gold | 属性候補 | debuffOnHit候補 |
|----------|-----|-----|-----|-----|------|---------|----------------|
| ゴブリンの洞窟 | 250〜350 | 22〜30 | 8〜14 | 100〜150 | 55〜80 | なし | なし or stagger |
| 古代遺跡 | 1000〜1500 | 90〜120 | 25〜40 | 350〜500 | 180〜250 | 闇 | seal_atk |
| 暗黒の森 | 2000〜3000 | 130〜180 | 50〜70 | 600〜800 | 300〜400 | なし・闇 | bind |
| 竜の棲み処 | 5000〜8000 | 200〜260 | 80〜120 | 1300〜1800 | 700〜900 | 火 | seal_def |
| 奈落の迷宮 | 10000〜15000 | 320〜400 | 130〜180 | 2500〜3500 | 1300〜1700 | 闇 | seal_atk |
| 深淵の塔 | 22000〜28000 | 480〜580 | 200〜250 | 12000〜18000 | 2800〜3500 | 闇 | bind |
| 聖域の廃墟 | 18000〜22000 | 420〜480 | 160〜200 | 22000〜28000 | 4500〜6000 | 光 | seal_def |
| 永遠の聖域 | 35000〜45000 | 550〜620 | 230〜270 | 45000〜55000 | 9000〜12000 | 光 | bind |
| 試練の闘技場 | 12000〜18000 | 500〜600 | 160〜200 | 18000〜22000 | 5500〜7000 | なし | seal_atk |
| 混沌の試練 | 65000〜80000 | 550〜650 | 260〜300 | 90000〜110000 | 45000〜55000 | 闇 | seal_atk |

---

## ボスのスキル設計ガイド

### スキルの数と種類
- **小ボス（Lv1〜3ダンジョン）**: スキルなし or 1種類
- **中ボス（Lv4〜6ダンジョン）**: 2〜3種類（攻撃系1〜2 + デバフ or 回復）
- **大ボス（Lv7〜10ダンジョン）**: 3〜4種類（攻撃系2 + 回復1 + デバフ1）

### スキルのMPコストとクールダウン目安

| スキル種類 | mpCost目安 | cooldownMs目安 |
|-----------|-----------|---------------|
| 単体攻撃（高威力） | 60〜80 | 25000〜35000 |
| 全体攻撃（中威力） | 50〜70 | 18000〜25000 |
| 自己回復 | 50〜80 | 30000〜45000 |
| デバフ全体 | 40〜90 | 30000〜45000 |
| デバフ単体 | 20〜40 | 15000〜25000 |

- ボスのmaxMpは `(スキルMPコストの合計 × 3〜5回分)` を目安に設定
- 条件 `hp_below_50` / `hp_below_25` は回復・緊急スキルに使う
- 同じスキルが連発されないよう cooldownMs は十分に長く設定すること

### 攻撃スキルのpower（ATK倍率）目安

ダメージ = max(1, floor(ATK × power) - DEF)

| ダンジョン難易度 | 単体攻撃power | 全体攻撃power |
|--------------|------------|------------|
| 1〜3 | 1.5〜2.0 | 1.2〜1.5 |
| 4〜6 | 1.5〜2.0 | 1.2〜1.5 |
| 7〜8 | 2.0〜2.5 | 1.3〜1.5 |
| 10（混沌） | 1.4〜1.6 | 1.0〜1.2 |

**注意**: 全体攻撃は4人全員に当たるため、powerを高くしすぎると即壊滅する。
特にATKが高いボスの全体攻撃は `power 1.0〜1.2` に抑えること。

---

## statusResist（状態異常耐性）について

ボスクラスに設定する。値は0〜1で「その確率で耐性により無効化」。

### ダンジョン難易度別の推奨耐性値

| ダンジョン難易度 | stagger | bind | poison | seal_atk | seal_def |
|--------------|---------|------|--------|---------|---------|
| 1（ゴブリン洞窟） | 0.30 | 0.20 | — | — | — |
| 2〜3 | 0.40 | 0.30 | 0.20 | — | — |
| 4〜5 | 0.50 | 0.40 | 0.30 | 0.20 | 0.20 |
| 6〜7 | 0.60 | 0.60 | 0.50 | 0.40 | 0.40 |
| 8 | 0.70 | 0.70 | 0.60 | 0.50 | 0.50 |
| 10（混沌神） | 0.90 | 0.90 | 0.90 | 0.80 | 0.80 |

- 小ボスは stagger/bind のみに低耐性を与え、poison/seal系は耐性なしでよい
- 大ボスほど全状態異常に高い耐性を持たせることで「状態異常ゲー」を防ぐ

---

## 属性の使い方

### ダンジョン別おすすめ属性

| ダンジョン | メイン属性 | サブ属性 |
|----------|-----------|---------|
| ゴブリンの洞窟 | なし | なし |
| 古代遺跡 | 闇 | なし |
| 暗黒の森 | 闇 | なし |
| 竜の棲み処 | 火 | なし |
| 奈落の迷宮 | 闇 | なし |
| 深淵の塔 | 闇 | なし |
| 聖域の廃墟 | 光・闇 | なし（混在可） |
| 永遠の聖域 | 光・闇 | なし（混在可） |
| 試練の闘技場 | 混合 | 火・雷・氷も可 |
| 混沌の試練 | 闇・火 | なし |

各プールで**全体の50〜70%に属性を付与**し、残りは無属性にすることでバリエーションが生まれる。

---

## debuffOnHit の設定ガイド

通常敵への `debuffOnHit` は**推奨しない**（ボス専用）。
付与する場合は確率を低めに（0.15〜0.25）。

| デバフ | 効果 | ボス使用例 |
|--------|------|---------|
| seal_atk | プレイヤーATK低下 | 攻撃型ボスに有効（高頻度で当てると壊滅するため確率控えめに） |
| seal_def | プレイヤーDEF低下 | 防御型ボスに有効 |
| bind | 行動間隔延長 | 速いボスに有効 |
| poison | 毎行動HPダメージ | 持続戦闘ボスに有効 |
| stagger | 1回行動スキップ | 短期戦ボスに有効 |

**注意**: `debuffOnHit: { chance: 0.40〜0.50 }` はほぼ毎攻撃でデバフが入るため強力すぎる。
ボスの場合は `chance: 0.20〜0.30` を目安にすること。

---

## 命名ガイド

### 既存のid（重複禁止）

```
goblin, goblin_archer, cave_bat, goblin_shaman,
skeleton, zombie, stone_golem, dark_mage,
wolf, treant, dark_elf, shadow_beast,
wyvern, fire_lizard, dragon_knight, lava_golem,
abyss_wraith, shadow_demon, bone_colossus, void_knight,
chaos_warrior, dark_oracle, void_behemoth, abyssal_mage,
sacred_golem, holy_specter, ruin_guardian, fallen_paladin,
sanctum_sentinel, eternal_wraith, divine_construct, chaos_herald,
arena_beast, gladiator, arena_mage, iron_golem,
chaos_demon, void_titan, chaos_phoenix, abyss_dragon,
goblin_king, lich, forest_guardian, ancient_dragon, abyss_lord,
abyss_overlord, sacred_sovereign, eternal_god, colosseum_champion, chaos_god
```

### 命名テーマ

ダンジョンのテーマに沿った名前をつけること：

- **ゴブリン系**: ゴブリン〇〇・コボルト・オーク
- **遺跡系**: アンデッド・ゴーレム・呪われた〇〇
- **森系**: トレント・エルフ・ビースト・草食系魔物
- **竜系**: ドラゴン・リザード・ワイバーン・炎の〇〇
- **奈落系**: デーモン・シャドウ・ヴォイド・魔族
- **深淵系**: 混沌・ベヒモス・タイタン・カオス
- **聖域系**: ゴーレム・スペクター・守護者・聖騎士・天使・神聖
- **闘技場系**: グラディエーター・ファイター・チャンピオン・ゴーレム
- **混沌系**: カオス・ヴォイド・次元断裂・深淵・滅神

---

## 出力フォーマット

### 通常敵の追加

```typescript
// ダンジョン名のプールに追加する敵
goblin_cave: [
  // 既存の敵はそのまま残す...
  // 追加する敵:
  { id: 'kobold', name: 'コボルド', hp: 80, maxHp: 80, attack: 16, defense: 4, speed: 24,
    expReward: 14, goldReward: 6, isBoss: false },
  { id: 'orc_scout', name: 'オークの斥候', hp: 110, maxHp: 110, attack: 20, defense: 7, speed: 20,
    expReward: 17, goldReward: 9, isBoss: false },
],
```

### ボスの追加

```typescript
// 小ボス例（スキルなし）
goblin_cave: {
  id: 'goblin_king', name: 'ゴブリンキング',
  hp: 300, maxHp: 300, attack: 25, defense: 10, speed: 20,
  maxMp: 0,
  expReward: 120, goldReward: 65, isBoss: true,
  debuffOnHit: { type: 'stagger', chance: 0.20 },
  statusResist: { stagger: 0.30, bind: 0.20 },
},

// 中ボス例（2スキル）
ancient_ruins: {
  id: 'lich', name: 'リッチ',
  hp: 1200, maxHp: 1200, attack: 100, defense: 30, speed: 18,
  mp: 80, maxMp: 80,
  expReward: 400, goldReward: 200, isBoss: true, element: 'dark',
  debuffOnHit: { type: 'seal_atk', chance: 0.25 },
  skills: [
    { id: 'lich_dark_bolt', name: '冥府の魔弾', mpCost: 30, cooldownMs: 20000, condition: 'always',
      effect: { type: 'attack_single', power: 1.8, element: 'dark' } },
    { id: 'lich_curse', name: '呪いの波動', mpCost: 50, cooldownMs: 30000, condition: 'always',
      effect: { type: 'debuff_all', debuff: 'seal_atk', debuffChance: 0.60 } },
  ],
  statusResist: { poison: 0.30, stagger: 0.40, bind: 0.30 },
},
```

---

## drops（個別装備ドロップ）の設定ガイド

敵が特定の装備をドロップするよう設定できる。`EQUIPMENT_MASTER` に存在するベースIDのみ使用可能。

### ドロップ確率とレア度表示

`chance` の値はゲーム内図鑑で以下のレア度ラベルに変換されて表示される（数値は非表示）：

| chance | 図鑑表示ラベル | 目安 |
|--------|--------------|------|
| 0.30 以上 | 普通 | 頻繁に出る |
| 0.10〜0.29 | 珍しい | たまに出る |
| 0.03〜0.09 | レア | 滅多に出ない |
| 0.03 未満 | 超レア | 極めて稀 |

**各敵種別の推奨 chance 範囲：**

| 敵種別 | chance目安 | 対応レア度 |
|--------|-----------|---------|
| 通常敵 | 0.03〜0.08 | レア |
| ミニボス（マイルストーン） | 0.08〜0.15 | レア〜珍しい |
| ボス（通常装備） | 0.30〜0.50 | 普通〜珍しい |
| ボス（戦利品 bossOnly） | 0.20〜0.40 | 珍しい |

### 設定ルール

1. `bossOnly: true` の装備（戦利品）は**ボスの `drops` にのみ設定**すること（通常敵には設定しない）
2. 敵のテーマ・属性に合った装備を選ぶ（例：炎系の敵には `element: 'fire'` の武器など）
3. 1体に複数のドロップを設定してもよいが、合計ドロップ期待値が高くなりすぎないよう注意
4. 通常敵のドロップは装備の入手難易度に影響するため、ゲーム全体のバランスを考慮すること

### 出力フォーマット例

```typescript
// 通常敵のドロップ例
{ id: 'fire_lizard', name: 'ファイアリザード', ..., isBoss: false,
  drops: [
    { itemId: 'flame_blade', chance: 0.05 },   // 炎龍の聖剣 5%
  ]
},

// ボスのドロップ例（戦利品を含む）
dragon_lair: {
  id: 'ancient_dragon', name: '古代竜', ..., isBoss: true,
  drops: [
    { itemId: 'inferno_blade',  chance: 0.30 },  // 獄炎魔剣 30%（戦利品）
    { itemId: 'dragon_scale',   chance: 0.50 },  // 竜鱗の鎧 50%（通常装備）
  ],
},
```

---

## 追加ルール・注意事項

1. `hp` と `maxHp` は**必ず同じ値**にすること（`mp` と `maxMp` も同様）
2. `isBoss: false`（通常敵）には `debuffOnHit` を基本的に設定しない
3. ステータスは**整数**にすること（小数なし）
4. 各ダンジョンのプールに敵を追加する場合、既存の4体との**バランスが崩れないよう**にする
5. EXPとGoldは大まかに `gold ≈ EXP × 0.45〜0.50` の比率を参考にすること
6. タンク型の `defense` は同ダンジョンの平均の**1.5〜2倍**が目安
7. アタッカー型の `attack` は同ダンジョンの平均の**1.2〜1.4倍**が目安
8. **ボスには必ず `speed`・`maxMp`・`statusResist` を設定すること**
9. ボスにスキルを設定する場合、`mp` フィールドも `maxMp` と同じ値で設定すること
10. 全体攻撃スキル（`attack_all`）は power を控えめにすること（全員に当たるため威力過剰になりやすい）

---

## 補強が必要なダンジョン（優先度高）

現状、以下のダンジョンの通常敵プールはバリエーションが少ない（各4体のみ）。
プールを**6〜8体**に拡充すると戦闘に飽きにくくなる：

1. **ゴブリンの洞窟** → コボルド・オーク・スライム系を追加
2. **古代遺跡** → より多様なアンデッド・ゴーレム系を追加
3. **暗黒の森** → 森の生物・植物系・昆虫系モンスターを追加
4. **竜の棲み処** → 小型竜・蜥蜴・炎の魔物を追加
5. **試練の闘技場** → 多様なファイタータイプを追加（EXPが高いため重要）

新ダンジョン（聖域の廃墟・永遠の聖域・混沌の試練）は各4体を確保済みだが、6体以上あるとより好ましい。
