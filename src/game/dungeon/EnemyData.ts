import type { Enemy } from '../../types'

// ダンジョンIDごとの通常敵プール
export const ENEMY_POOL: Record<string, Enemy[]> = {
  goblin_cave: [
    { id: 'goblin',        name: 'ゴブリン',           hp: 90,    maxHp: 90,    attack: 18,  defense: 6,   speed: 22, expReward: 15,   goldReward: 7,    isBoss: false, floorMin: 1, floorMax: 5 ,
    drops: [
      { itemId: 'copper_sword', chance: 0.05 },
    ]},
    { id: 'goblin_archer', name: 'ゴブリン弓兵',       hp: 65,    maxHp: 65,    attack: 22,  defense: 2,   speed: 26, expReward: 18,   goldReward: 8,    isBoss: false, floorMin: 1, floorMax: 4 ,
    drops: [
      { itemId: 'short_bow', chance: 0.05 },
    ]},
    { id: 'cave_bat',      name: 'ケイブバット',       hp: 50,    maxHp: 50,    attack: 14,  defense: 1,   speed: 32, expReward: 12,   goldReward: 4,    isBoss: false, floorMin: 1, floorMax: 3 ,
    drops: [
      { itemId: 'leather_boots', chance: 0.03 },
    ]},
    { id: 'goblin_shaman', name: 'ゴブリンシャーマン', hp: 75,    maxHp: 75,    attack: 20,  defense: 3,   speed: 18, expReward: 20,   goldReward: 10,   isBoss: false, floorMin: 2, floorMax: 5 ,
    drops: [
      { itemId: 'apprentice_staff', chance: 0.05 },
    ]},
    { id: 'kobold_raider', name: 'コボルドの略奪兵',   hp: 90,    maxHp: 90,    attack: 15,  defense: 6,   speed: 20, expReward: 15,   goldReward: 7,    isBoss: false, floorMin: 2, floorMax: 5 ,
    drops: [
      { itemId: 'thief_knife', chance: 0.04 },
    ]},
    { id: 'orc_brute',     name: 'オークの乱暴者',     hp: 120,   maxHp: 120,   attack: 18,  defense: 8,   speed: 16, expReward: 18,   goldReward: 10,   isBoss: false, floorMin: 3, floorMax: 5 ,
    drops: [
      { itemId: 'leather_armor', chance: 0.05 },
    ]},
    { id: 'goblin_slinger',name: 'ゴブリン投石兵',     hp: 75,    maxHp: 75,    attack: 22,  defense: 3,   speed: 30, expReward: 16,   goldReward: 8,    isBoss: false, floorMin: 1, floorMax: 5 ,
    drops: [
      { itemId: 'hunter_bow', chance: 0.04 },
    ]},
    { id: 'cave_imp',      name: 'ケイブインプ',       hp: 70,    maxHp: 70,    attack: 20,  defense: 2,   speed: 28, expReward: 17,   goldReward: 9,    isBoss: false, floorMin: 2, floorMax: 5 ,
    drops: [
      { itemId: 'power_ring', chance: 0.03 },
    ]},
  ],
  ancient_ruins: [
    { id: 'skeleton',      name: 'スケルトン',         hp: 250,   maxHp: 250,   attack: 55,  defense: 15,  speed: 20, expReward: 60,   goldReward: 25,   isBoss: false, element: 'dark', floorMin: 1, floorMax: 9 ,
    drops: [
      { itemId: 'steel_saber', chance: 0.05 },
    ]},
    { id: 'zombie',        name: 'ゾンビ',             hp: 320,   maxHp: 320,   attack: 45,  defense: 22,  speed: 16, expReward: 55,   goldReward: 22,   isBoss: false, element: 'dark', floorMin: 1, floorMax: 8 ,
    drops: [
      { itemId: 'chain_mail', chance: 0.04 },
    ]},
    { id: 'stone_golem',   name: 'ストーンゴーレム',   hp: 400,   maxHp: 400,   attack: 50,  defense: 35,  speed: 14, expReward: 80,   goldReward: 35,   isBoss: false, floorMin: 2, floorMax: 12 ,
    drops: [
      { itemId: 'steel_plate', chance: 0.05 },
    ]},
    { id: 'dark_mage',     name: 'ダークメイジ',       hp: 200,   maxHp: 200,   attack: 80,  defense: 8,   speed: 28, expReward: 70,   goldReward: 30,   isBoss: false, element: 'dark', floorMin: 4, floorMax: 12 ,
    drops: [
      { itemId: 'shadow_dagger', chance: 0.04 },
    ]},
    { id: 'cursed_guard',  name: '呪われた衛兵',       hp: 360,   maxHp: 360,   attack: 55,  defense: 28,  speed: 16, expReward: 72,   goldReward: 28,   isBoss: false, element: 'dark', floorMin: 7, floorMax: 12 ,
    drops: [
      { itemId: 'vanguard_mail', chance: 0.05 },
    ]},
    { id: 'grave_hound',   name: '墓場の猟犬',         hp: 260,   maxHp: 260,   attack: 82,  defense: 10,  speed: 30, expReward: 65,   goldReward: 24,   isBoss: false, element: 'dark', floorMin: 3, floorMax: 10 ,
    drops: [
      { itemId: 'quicksilver_boots', chance: 0.04 },
    ]},
    { id: 'hex_priest',    name: '呪詛の祭祀',         hp: 240,   maxHp: 240,   attack: 88,  defense: 9,   speed: 26, expReward: 75,   goldReward: 30,   isBoss: false, element: 'dark', floorMin: 6, floorMax: 12 ,
    drops: [
      { itemId: 'grave_robe', chance: 0.05 },
    ]},
    { id: 'ruin_watcher',  name: '遺跡の監視者',       hp: 310,   maxHp: 310,   attack: 68,  defense: 22,  speed: 22, expReward: 70,   goldReward: 27,   isBoss: false, floorMin: 1, floorMax: 8 ,
    drops: [
      { itemId: 'runeblade', chance: 0.04 },
    ]},
  ],
  dark_forest: [
    { id: 'wolf',           name: 'ダークウルフ',       hp: 420,   maxHp: 420,   attack: 85,  defense: 20,  speed: 30, expReward: 90,   goldReward: 40,   isBoss: false, floorMin: 1,  floorMax: 16 ,
    drops: [
      { itemId: 'storm_jacket', chance: 0.04 },
    ]},
    { id: 'treant',         name: 'トレント',           hp: 600,   maxHp: 600,   attack: 70,  defense: 45,  speed: 14, expReward: 110,  goldReward: 50,   isBoss: false, floorMin: 2,  floorMax: 20 ,
    drops: [
      { itemId: 'amber_amulet', chance: 0.05 },
    ]},
    { id: 'dark_elf',       name: 'ダークエルフ',       hp: 350,   maxHp: 350,   attack: 110, defense: 25,  speed: 32, expReward: 100,  goldReward: 45,   isBoss: false, element: 'dark', floorMin: 8,  floorMax: 25 ,
    drops: [
      { itemId: 'elven_bow', chance: 0.05 },
    ]},
    { id: 'shadow_beast',   name: 'シャドウビースト',   hp: 500,   maxHp: 500,   attack: 95,  defense: 30,  speed: 26, expReward: 120,  goldReward: 55,   isBoss: false, element: 'dark', floorMin: 13, floorMax: 25 ,
    drops: [
      { itemId: 'shadow_leather', chance: 0.05 },
    ]},
    { id: 'thorn_tortoise', name: '棘鱗の大亀',         hp: 620,   maxHp: 620,   attack: 82,  defense: 48,  speed: 14, expReward: 105,  goldReward: 46,   isBoss: false, floorMin: 1,  floorMax: 16 ,
    drops: [
      { itemId: 'guardian_talisman', chance: 0.04 },
    ]},
    { id: 'night_panther',  name: '夜駆けの豹',         hp: 440,   maxHp: 440,   attack: 118, defense: 22,  speed: 30, expReward: 112,  goldReward: 50,   isBoss: false, element: 'dark', floorMin: 16, floorMax: 25 ,
    drops: [
      { itemId: 'assassin_feather', chance: 0.05 },
    ]},
    { id: 'mire_wisp',      name: '沼地のウィスプ',     hp: 390,   maxHp: 390,   attack: 120, defense: 18,  speed: 28, expReward: 108,  goldReward: 48,   isBoss: false, element: 'dark', floorMin: 10, floorMax: 25 ,
    drops: [
      { itemId: 'mana_loop', chance: 0.05 },
    ]},
    { id: 'forest_howler',  name: '森の咆哮獣',         hp: 500,   maxHp: 500,   attack: 96,  defense: 32,  speed: 22, expReward: 110,  goldReward: 52,   isBoss: false, floorMin: 5,  floorMax: 22 ,
    drops: [
      { itemId: 'berserk_anklet', chance: 0.04 },
    ]},
    // ── 進化系・深層混入 ──
    { id: 'alpha_wolf',      name: 'αウルフ',             hp: 580,   maxHp: 580,   attack: 115, defense: 28,  speed: 30, expReward: 130,  goldReward: 55,   isBoss: false, element: 'dark', floorMin: 10, floorMax: 22, maxMp: 30,
    skills: [
      { id: 'aw_howl', name: '群れの咆哮', mpCost: 15, cooldownMs: 20000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_atk', debuffChance: 0.70 } },
    ],
    drops: [{ itemId: 'storm_jacket', chance: 0.04 }]},
    { id: 'dire_wolf',       name: 'ダイアウルフ',        hp: 780,   maxHp: 780,   attack: 148, defense: 38,  speed: 30, expReward: 180,  goldReward: 75,   isBoss: false, element: 'dark', floorMin: 19, floorMax: 25, maxMp: 35,
    skills: [
      { id: 'dw_death_howl', name: '死の咆哮', mpCost: 18, cooldownMs: 22000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'bind', debuffChance: 0.75 } },
    ],
    drops: [{ itemId: 'guardian_talisman', chance: 0.04 }]},
    { id: 'elder_treant',    name: '古老のトレント',      hp: 850,   maxHp: 850,   attack: 95,  defense: 62,  speed: 12, expReward: 160,  goldReward: 65,   isBoss: false, floorMin: 12, floorMax: 25, maxMp: 25,
    skills: [
      { id: 'et_root_bind', name: '根の拘束', mpCost: 12, cooldownMs: 18000, condition: 'always',
        effect: { type: 'debuff_single', debuff: 'bind', debuffChance: 0.85 } },
    ],
    drops: [{ itemId: 'amber_amulet', chance: 0.04 }]},
    { id: 'void_wisp',       name: 'ヴォイドウィスプ',    hp: 540,   maxHp: 540,   attack: 158, defense: 24,  speed: 28, expReward: 155,  goldReward: 65,   isBoss: false, element: 'dark', floorMin: 18, floorMax: 25, maxMp: 40,
    skills: [
      { id: 'vw_mana_drain', name: '魔力喰い', mpCost: 20, cooldownMs: 18000, condition: 'always',
        effect: { type: 'debuff_single', debuff: 'seal_atk', debuffChance: 0.80 } },
    ],
    drops: [{ itemId: 'mana_loop', chance: 0.05 }]},
    { id: 'shadow_panther',  name: 'シャドウパンサー',    hp: 610,   maxHp: 610,   attack: 155, defense: 30,  speed: 32, expReward: 165,  goldReward: 70,   isBoss: false, element: 'dark', floorMin: 20, floorMax: 25, maxMp: 30,
    skills: [
      { id: 'sp_shadow_claw', name: '影の爪撃', mpCost: 15, cooldownMs: 16000, condition: 'always',
        effect: { type: 'attack_single', power: 1.8, element: 'dark' } },
    ],
    drops: [{ itemId: 'assassin_feather', chance: 0.05 }]},
    { id: 'forest_demon',    name: 'フォレストデーモン',  hp: 700,   maxHp: 700,   attack: 130, defense: 42,  speed: 22, expReward: 170,  goldReward: 72,   isBoss: false, element: 'dark', floorMin: 20, floorMax: 25, maxMp: 35,
    skills: [
      { id: 'fd_fear_roar', name: '恐怖の叫び', mpCost: 18, cooldownMs: 22000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_def', debuffChance: 0.70 } },
    ],
    drops: [{ itemId: 'berserk_anklet', chance: 0.04 }]},
    { id: 'dark_elf_captain',name: 'ダークエルフ隊長',    hp: 490,   maxHp: 490,   attack: 142, defense: 34,  speed: 32, expReward: 145,  goldReward: 60,   isBoss: false, element: 'dark', floorMin: 17, floorMax: 25, maxMp: 35,
    skills: [
      { id: 'dec_barrage', name: '連続矢', mpCost: 18, cooldownMs: 18000, condition: 'always',
        effect: { type: 'attack_all', power: 1.2 } },
    ],
    drops: [{ itemId: 'elven_bow', chance: 0.04 }]},
    { id: 'thorn_overlord',  name: 'ソーンオーバーロード', hp: 880,  maxHp: 880,   attack: 108, defense: 65,  speed: 12, expReward: 165,  goldReward: 68,   isBoss: false, floorMin: 18, floorMax: 25, maxMp: 25,
    debuffOnHit: { type: 'poison', chance: 0.30 },
    skills: [
      { id: 'to_poison_spines', name: '猛毒の棘', mpCost: 12, cooldownMs: 20000, condition: 'always',
        effect: { type: 'debuff_single', debuff: 'poison', debuffChance: 0.90 } },
    ],
    drops: [{ itemId: 'guardian_talisman', chance: 0.04 }]},
  ],
  dragon_lair: [
    { id: 'wyvern',         name: 'ワイバーン',         hp: 800,   maxHp: 800,   attack: 140, defense: 50,  speed: 24, expReward: 180,  goldReward: 90,   isBoss: false, floorMin: 1,  floorMax: 22 ,
    drops: [
      { itemId: 'wyrmshot_bow', chance: 0.04 },
    ]},
    { id: 'fire_lizard',    name: 'ファイアリザード',   hp: 650,   maxHp: 650,   attack: 160, defense: 35,  speed: 28, expReward: 160,  goldReward: 80,   isBoss: false, element: 'fire', floorMin: 1,  floorMax: 28 ,
    drops: [
      { itemId: 'ember_staff', chance: 0.05 },
    ]},
    { id: 'dragon_knight',  name: 'ドラゴンナイト',     hp: 950,   maxHp: 950,   attack: 150, defense: 65,  speed: 20, expReward: 200,  goldReward: 100,  isBoss: false, element: 'fire', floorMin: 12, floorMax: 40 ,
    drops: [
      { itemId: 'dragon_fang', chance: 0.05 },
    ]},
    { id: 'lava_golem',     name: 'ラーヴァゴーレム',   hp: 1100,  maxHp: 1100,  attack: 120, defense: 80,  speed: 14, expReward: 220,  goldReward: 110,  isBoss: false, element: 'fire', floorMin: 18, floorMax: 40 ,
    drops: [
      { itemId: 'lava_plate', chance: 0.05 },
    ]},
    { id: 'basalt_drake',   name: '玄武岩の飛竜',       hp: 1100,  maxHp: 1100,  attack: 132, defense: 88,  speed: 16, expReward: 190,  goldReward: 92,   isBoss: false, element: 'fire', floorMin: 25, floorMax: 40 ,
    drops: [
      { itemId: 'dragon_scale', chance: 0.04 },
    ]},
    { id: 'ember_raptor',   name: '火花の迅竜',         hp: 820,   maxHp: 820,   attack: 172, defense: 42,  speed: 30, expReward: 175,  goldReward: 88,   isBoss: false, element: 'fire', floorMin: 1,  floorMax: 30 ,
    drops: [
      { itemId: 'flame_guard', chance: 0.04 },
    ]},
    { id: 'magma_caster',   name: '溶岩魔術師',         hp: 760,   maxHp: 760,   attack: 175, defense: 38,  speed: 24, expReward: 180,  goldReward: 90,   isBoss: false, element: 'fire', floorMin: 10, floorMax: 38 ,
    drops: [
      { itemId: 'flame_blade', chance: 0.03 },
    ]},
    { id: 'ashen_guardian', name: '灰燼の守護獣',       hp: 930,   maxHp: 930,   attack: 150, defense: 64,  speed: 22, expReward: 185,  goldReward: 95,   isBoss: false, floorMin: 28, floorMax: 40 ,
    drops: [
      { itemId: 'bloodiron_armor', chance: 0.04 },
    ]},
    // ── 進化系・深層混入 ──
    { id: 'elder_wyvern',    name: 'エルダーワイバーン',  hp: 1120,  maxHp: 1120,  attack: 185, defense: 68,  speed: 24, expReward: 260,  goldReward: 125,  isBoss: false, element: 'fire', floorMin: 15, floorMax: 40, maxMp: 40,
    skills: [
      { id: 'ew_flame_breath', name: '竜炎ブレス', mpCost: 20, cooldownMs: 18000, condition: 'always',
        effect: { type: 'attack_all', power: 1.3, element: 'fire' } },
    ],
    drops: [{ itemId: 'wyrmshot_bow', chance: 0.04 }]},
    { id: 'blazing_wyvern',  name: 'ブレイジングワイバーン', hp: 1550, maxHp: 1550, attack: 240, defense: 90,  speed: 24, expReward: 340,  goldReward: 165,  isBoss: false, element: 'fire', floorMin: 28, floorMax: 40, maxMp: 50,
    skills: [
      { id: 'bw_fire_storm', name: '龍炎嵐', mpCost: 28, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_all', power: 1.6, element: 'fire' } },
    ],
    drops: [{ itemId: 'flame_blade', chance: 0.04 }]},
    { id: 'inferno_lizard',  name: 'インフェルノリザード',  hp: 920,   maxHp: 920,   attack: 210, defense: 48,  speed: 28, expReward: 235,  goldReward: 115,  isBoss: false, element: 'fire', floorMin: 18, floorMax: 40, maxMp: 35,
    skills: [
      { id: 'il_fire_breath', name: '火炎の吐息', mpCost: 18, cooldownMs: 16000, condition: 'always',
        effect: { type: 'attack_all', power: 1.2, element: 'fire' } },
    ],
    drops: [{ itemId: 'ember_staff', chance: 0.04 }]},
    { id: 'volcanic_lizard', name: '火山リザード',         hp: 1280,  maxHp: 1280,  attack: 270, defense: 62,  speed: 26, expReward: 320,  goldReward: 160,  isBoss: false, element: 'fire', floorMin: 30, floorMax: 40, maxMp: 45,
    skills: [
      { id: 'vl_eruption', name: '爆炎噴射', mpCost: 25, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_all', power: 1.5, element: 'fire' } },
    ],
    drops: [{ itemId: 'inferno_blade', chance: 0.03 }]},
    { id: 'dragon_general',  name: 'ドラゴン将軍',         hp: 1340,  maxHp: 1340,  attack: 200, defense: 88,  speed: 20, expReward: 290,  goldReward: 145,  isBoss: false, element: 'fire', floorMin: 25, floorMax: 40, maxMp: 40,
    skills: [
      { id: 'dg_lance_charge', name: '竜騎突撃', mpCost: 22, cooldownMs: 18000, condition: 'always',
        effect: { type: 'attack_single', power: 2.0, element: 'fire' } },
    ],
    drops: [{ itemId: 'dragon_fang', chance: 0.04 }]},
    { id: 'magma_titan',     name: 'マグマタイタン',       hp: 1580,  maxHp: 1580,  attack: 165, defense: 108, speed: 12, expReward: 320,  goldReward: 155,  isBoss: false, element: 'fire', floorMin: 28, floorMax: 40, maxMp: 40,
    skills: [
      { id: 'mt_lava_flood', name: '溶岩洪水', mpCost: 25, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_all', power: 1.4, element: 'fire' } },
    ],
    drops: [{ itemId: 'lava_plate', chance: 0.04 }]},
    { id: 'cinder_beast',    name: 'シンダービースト',     hp: 950,   maxHp: 950,   attack: 178, defense: 56,  speed: 30, expReward: 195,  goldReward: 95,   isBoss: false, element: 'fire', floorMin: 8,  floorMax: 32,
    drops: [{ itemId: 'flame_guard', chance: 0.04 }]},
    { id: 'flame_hydra',     name: 'フレイムヒュドラ',     hp: 1200,  maxHp: 1200,  attack: 195, defense: 72,  speed: 20, expReward: 280,  goldReward: 138,  isBoss: false, element: 'fire', floorMin: 22, floorMax: 40, maxMp: 45,
    skills: [
      { id: 'fh_triple_fire', name: '三連炎', mpCost: 22, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_all', power: 1.1, element: 'fire' } },
    ],
    drops: [{ itemId: 'phoenix_mail', chance: 0.03 }]},
    { id: 'inferno_golem',   name: 'インフェルノゴーレム', hp: 1560,  maxHp: 1560,  attack: 178, defense: 118, speed: 14, expReward: 310,  goldReward: 150,  isBoss: false, element: 'fire', floorMin: 30, floorMax: 40, maxMp: 35,
    skills: [
      { id: 'ig_explosion', name: '爆熱崩壊', mpCost: 20, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_all', power: 1.3, element: 'fire' } },
    ],
    drops: [{ itemId: 'dragon_scale', chance: 0.04 }]},
    { id: 'nightprowler',    name: 'ナイトプロウラー',     hp: 620,   maxHp: 620,   attack: 158, defense: 32,  speed: 32, expReward: 160,  goldReward: 75,   isBoss: false, element: 'dark', floorMin: 22, floorMax: 38,
    drops: [{ itemId: 'shadow_leather', chance: 0.03 }]},
    { id: 'deep_forest_beast',name: '深森の闇獣',         hp: 710,   maxHp: 710,   attack: 130, defense: 42,  speed: 28, expReward: 175,  goldReward: 82,   isBoss: false, element: 'dark', floorMin: 26, floorMax: 40,
    drops: [{ itemId: 'shadow_leather', chance: 0.04 }]},
    { id: 'ashen_drake',     name: '灰燼ドレイク',         hp: 1320,  maxHp: 1320,  attack: 202, defense: 88,  speed: 22, expReward: 280,  goldReward: 138,  isBoss: false, floorMin: 33, floorMax: 40, maxMp: 30,
    skills: [
      { id: 'ad_ash_storm', name: '灰燼嵐', mpCost: 18, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_all', power: 1.2 } },
    ],
    drops: [{ itemId: 'bloodiron_armor', chance: 0.04 }]},
  ],
  abyss_labyrinth: [
    { id: 'abyss_wraith',       name: '奈落の亡霊',       hp: 1200,  maxHp: 1200,  attack: 220, defense: 80,  speed: 26, expReward: 320,  goldReward: 150,  isBoss: false, element: 'dark', floorMin: 1,  floorMax: 28 ,
    drops: [
      { itemId: 'eclipse_scythe', chance: 0.04 },
    ]},
    { id: 'shadow_demon',       name: 'シャドウデーモン', hp: 1500,  maxHp: 1500,  attack: 260, defense: 60,  speed: 30, expReward: 360,  goldReward: 170,  isBoss: false, element: 'dark', floorMin: 1,  floorMax: 38 ,
    drops: [
      { itemId: 'blooddrinker', chance: 0.04 },
    ]},
    { id: 'bone_colossus',      name: '骨の巨人',         hp: 1800,  maxHp: 1800,  attack: 190, defense: 110, speed: 14, expReward: 400,  goldReward: 190,  isBoss: false, element: 'dark', floorMin: 18, floorMax: 50 ,
    drops: [
      { itemId: 'crag_hammer', chance: 0.05 },
    ]},
    { id: 'void_knight',        name: 'ヴォイドナイト',   hp: 1400,  maxHp: 1400,  attack: 240, defense: 90,  speed: 22, expReward: 380,  goldReward: 180,  isBoss: false, element: 'dark', floorMin: 1,  floorMax: 40 ,
    drops: [
      { itemId: 'void_scythe_edge', chance: 0.05 },
    ]},
    { id: 'void_minotaur',      name: '虚無の牛頭魔',     hp: 1950,  maxHp: 1950,  attack: 210, defense: 118, speed: 16, expReward: 380,  goldReward: 165,  isBoss: false, element: 'dark', floorMin: 28, floorMax: 55 ,
    drops: [
      { itemId: 'ruin_cleaver', chance: 0.04 },
    ]},
    { id: 'nightmare_stalker',  name: '悪夢の追跡者',     hp: 1450,  maxHp: 1450,  attack: 278, defense: 72,  speed: 30, expReward: 345,  goldReward: 155,  isBoss: false, element: 'dark', floorMin: 22, floorMax: 55 ,
    drops: [
      { itemId: 'venom_dirk', chance: 0.04 },
    ]},
    { id: 'abyss_sorcerer',     name: '奈落の魔道師',     hp: 1320,  maxHp: 1320,  attack: 280, defense: 66,  speed: 26, expReward: 360,  goldReward: 160,  isBoss: false, element: 'dark', floorMin: 35, floorMax: 55 ,
    drops: [
      { itemId: 'nightveil_robe', chance: 0.03 },
    ]},
    { id: 'demon_jailer',       name: '魔族の看守',       hp: 1680,  maxHp: 1680,  attack: 235, defense: 96,  speed: 22, expReward: 370,  goldReward: 170,  isBoss: false, floorMin: 40, floorMax: 55 ,
    drops: [
      { itemId: 'bloodiron_armor', chance: 0.04 },
    ]},
    // ── 進化系・深層混入 ──
    { id: 'lost_soul',          name: '迷える魂',           hp: 880,   maxHp: 880,   attack: 168, defense: 55,  speed: 24, expReward: 240,  goldReward: 115,  isBoss: false, element: 'dark', floorMin: 1,  floorMax: 18,
    drops: [{ itemId: 'eclipse_scythe', chance: 0.03 }]},
    { id: 'abyss_reaper',       name: '奈落の死神',         hp: 1700,  maxHp: 1700,  attack: 292, defense: 105, speed: 26, expReward: 450,  goldReward: 210,  isBoss: false, element: 'dark', floorMin: 22, floorMax: 45, maxMp: 45,
    skills: [
      { id: 'ar_soul_reap', name: '魂刈り', mpCost: 25, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_single', power: 2.0, element: 'dark' } },
    ],
    drops: [{ itemId: 'eclipse_scythe', chance: 0.04 }]},
    { id: 'cursed_shade',       name: '呪われた影',         hp: 2100,  maxHp: 2100,  attack: 340, defense: 80,  speed: 28, expReward: 510,  goldReward: 240,  isBoss: false, element: 'dark', floorMin: 20, floorMax: 48, maxMp: 50,
    skills: [
      { id: 'cs_dark_burst', name: '暗黒爆発', mpCost: 28, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_all', power: 1.4, element: 'dark' } },
    ],
    drops: [{ itemId: 'blooddrinker', chance: 0.04 }]},
    { id: 'death_knight',       name: 'デスナイト',         hp: 1960,  maxHp: 1960,  attack: 316, defense: 118, speed: 22, expReward: 540,  goldReward: 255,  isBoss: false, element: 'dark', floorMin: 15, floorMax: 52, maxMp: 40,
    skills: [
      { id: 'dk_abyss_slash', name: '奈落の一撃', mpCost: 22, cooldownMs: 18000, condition: 'always',
        effect: { type: 'attack_single', power: 1.8, element: 'dark' } },
    ],
    drops: [{ itemId: 'void_scythe_edge', chance: 0.04 }]},
    { id: 'void_colossus',      name: 'ヴォイドコロッサス',  hp: 2580,  maxHp: 2580,  attack: 252, defense: 145, speed: 12, expReward: 570,  goldReward: 270,  isBoss: false, element: 'dark', floorMin: 28, floorMax: 55, maxMp: 35,
    skills: [
      { id: 'vc_bone_crush', name: '骨砕き', mpCost: 20, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_all', power: 1.2 } },
    ],
    drops: [{ itemId: 'crag_hammer', chance: 0.04 }]},
    { id: 'abyss_titan',        name: '奈落の巨人',         hp: 2750,  maxHp: 2750,  attack: 278, defense: 155, speed: 14, expReward: 580,  goldReward: 275,  isBoss: false, element: 'dark', floorMin: 38, floorMax: 55, maxMp: 40,
    skills: [
      { id: 'at_void_smash', name: '虚無粉砕', mpCost: 25, cooldownMs: 24000, condition: 'always',
        effect: { type: 'attack_all', power: 1.3, element: 'dark' } },
    ],
    drops: [{ itemId: 'ruin_cleaver', chance: 0.04 }]},
    { id: 'infernal_jailer',    name: '地獄の看守',         hp: 2400,  maxHp: 2400,  attack: 312, defense: 128, speed: 22, expReward: 560,  goldReward: 265,  isBoss: false, floorMin: 45, floorMax: 55, maxMp: 40,
    skills: [
      { id: 'ij_full_bind', name: '全拘束', mpCost: 22, cooldownMs: 22000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'bind', debuffChance: 0.90 } },
    ],
    drops: [{ itemId: 'bloodiron_armor', chance: 0.04 }]},
    { id: 'void_archer',        name: 'ヴォイドアーチャー', hp: 1200,  maxHp: 1200,  attack: 295, defense: 55,  speed: 28, expReward: 370,  goldReward: 170,  isBoss: false, element: 'dark', floorMin: 8,  floorMax: 40,
    drops: [{ itemId: 'elven_bow', chance: 0.04 }]},
    { id: 'abyss_beast',        name: '奈落の魔獣',         hp: 1380,  maxHp: 1380,  attack: 250, defense: 75,  speed: 28, expReward: 340,  goldReward: 160,  isBoss: false, element: 'dark', floorMin: 5,  floorMax: 30,
    drops: [{ itemId: 'shadow_leather', chance: 0.04 }]},
    { id: 'phantom_wyvern',     name: 'ファントムワイバーン', hp: 1560, maxHp: 1560,  attack: 298, defense: 95,  speed: 24, expReward: 390,  goldReward: 180,  isBoss: false, element: 'dark', floorMin: 18, floorMax: 42,
    drops: [{ itemId: 'wyrmshot_bow', chance: 0.03 }]},
    { id: 'cursed_samurai',     name: '呪われた侍',         hp: 1500,  maxHp: 1500,  attack: 268, defense: 100, speed: 24, expReward: 400,  goldReward: 185,  isBoss: false, floorMin: 10, floorMax: 42, maxMp: 35,
    skills: [
      { id: 'csa_helmet_split', name: '兜割り', mpCost: 18, cooldownMs: 18000, condition: 'always',
        effect: { type: 'debuff_single', debuff: 'seal_def', debuffChance: 0.90 } },
    ],
    drops: [{ itemId: 'dragon_fang', chance: 0.03 }]},
    { id: 'mana_devourer',      name: 'マナデヴァウラー',   hp: 1380,  maxHp: 1380,  attack: 300, defense: 72,  speed: 26, expReward: 420,  goldReward: 195,  isBoss: false, element: 'dark', floorMin: 22, floorMax: 55, maxMp: 50,
    skills: [
      { id: 'md_mana_drain', name: '魔力侵食', mpCost: 25, cooldownMs: 20000, condition: 'always',
        effect: { type: 'debuff_single', debuff: 'seal_atk', debuffChance: 0.85 } },
    ],
    drops: [{ itemId: 'nightveil_robe', chance: 0.03 }]},
    { id: 'rift_stalker',       name: 'リフトストーカー',   hp: 1500,  maxHp: 1500,  attack: 318, defense: 80,  speed: 32, expReward: 440,  goldReward: 205,  isBoss: false, element: 'dark', floorMin: 35, floorMax: 55,
    drops: [{ itemId: 'venom_dirk', chance: 0.04 }]},
    { id: 'abyss_serpent',      name: '奈落の大蛇',         hp: 1350,  maxHp: 1350,  attack: 262, defense: 78,  speed: 26, expReward: 380,  goldReward: 175,  isBoss: false, element: 'dark', floorMin: 12, floorMax: 45,
    debuffOnHit: { type: 'poison', chance: 0.25 },
    drops: [{ itemId: 'venom_dirk', chance: 0.05 }]},
    { id: 'dark_colossus',      name: 'ダークコロッサス',   hp: 2200,  maxHp: 2200,  attack: 255, defense: 132, speed: 16, expReward: 500,  goldReward: 235,  isBoss: false, element: 'dark', floorMin: 35, floorMax: 55, maxMp: 40,
    skills: [
      { id: 'dc_dark_fist', name: '暗黒の拳', mpCost: 22, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_single', power: 1.8, element: 'dark' } },
    ],
    drops: [{ itemId: 'bloodiron_armor', chance: 0.04 }]},
    { id: 'nightmare_archmage', name: '悪夢の大魔導師',     hp: 1860,  maxHp: 1860,  attack: 368, defense: 88,  speed: 26, expReward: 550,  goldReward: 260,  isBoss: false, element: 'dark', floorMin: 38, floorMax: 55, maxMp: 60,
    skills: [
      { id: 'nam_dark_circle', name: '暗黒魔法陣', mpCost: 32, cooldownMs: 24000, condition: 'always',
        effect: { type: 'attack_all', power: 1.5, element: 'dark' } },
    ],
    drops: [{ itemId: 'nightveil_robe', chance: 0.03 }]},
  ],
  abyss_tower: [
    { id: 'chaos_warrior',      name: '混沌の戦士',       hp: 2000,  maxHp: 2000,  attack: 320, defense: 130, speed: 22, expReward: 1200, goldReward: 260,  isBoss: false, element: 'dark', floorMin: 1,  floorMax: 35 ,
    drops: [
      { itemId: 'thunderbrand', chance: 0.04 },
    ]},
    { id: 'dark_oracle',        name: '闇の神官',         hp: 1600,  maxHp: 1600,  attack: 380, defense: 80,  speed: 26, expReward: 1300, goldReward: 275,  isBoss: false, element: 'dark', floorMin: 1,  floorMax: 45 ,
    drops: [
      { itemId: 'archsage_robe', chance: 0.05 },
    ]},
    { id: 'void_behemoth',      name: 'ヴォイドベヒモス', hp: 2600,  maxHp: 2600,  attack: 280, defense: 170, speed: 14, expReward: 1400, goldReward: 290,  isBoss: false, element: 'dark', floorMin: 15, floorMax: 60 ,
    drops: [
      { itemId: 'bloodiron_armor', chance: 0.05 },
    ]},
    { id: 'abyssal_mage',       name: '深淵の魔導師',     hp: 1800,  maxHp: 1800,  attack: 400, defense: 60,  speed: 28, expReward: 1350, goldReward: 280,  isBoss: false, element: 'dark', floorMin: 28, floorMax: 70 ,
    drops: [
      { itemId: 'manafont_staff', chance: 0.05 },
    ]},
    { id: 'chaos_colossus',     name: '混沌の巨兵',       hp: 2800,  maxHp: 2800,  attack: 300, defense: 180, speed: 14, expReward: 1400, goldReward: 280,  isBoss: false, element: 'dark', floorMin: 40, floorMax: 75 ,
    drops: [
      { itemId: 'bloodiron_armor', chance: 0.05 },
    ]},
    { id: 'rift_harpy',         name: '裂空のハーピー',   hp: 1950,  maxHp: 1950,  attack: 410, defense: 92,  speed: 32, expReward: 1250, goldReward: 265,  isBoss: false, element: 'dark', floorMin: 1,  floorMax: 55 ,
    drops: [
      { itemId: 'gale_boots', chance: 0.04 },
    ]},
    { id: 'abyss_librarian',    name: '深淵の書記',       hp: 1800,  maxHp: 1800,  attack: 420, defense: 86,  speed: 26, expReward: 1300, goldReward: 270,  isBoss: false, element: 'dark', floorMin: 48, floorMax: 75 ,
    drops: [
      { itemId: 'archsage_robe', chance: 0.05 },
    ]},
    { id: 'tower_executioner',  name: '塔場の処刑人',     hp: 2350,  maxHp: 2350,  attack: 340, defense: 140, speed: 22, expReward: 1350, goldReward: 275,  isBoss: false, floorMin: 60, floorMax: 75 ,
    drops: [
      { itemId: 'ruin_cleaver', chance: 0.05 },
    ]},
    // ── 進化系・深層混入 ──
    { id: 'void_soldier',       name: 'ヴォイドソルジャー', hp: 1500,  maxHp: 1500,  attack: 245, defense: 98,  speed: 22, expReward: 900,  goldReward: 195,  isBoss: false, element: 'dark', floorMin: 1,  floorMax: 25,
    drops: [{ itemId: 'thunderbrand', chance: 0.03 }]},
    { id: 'chaos_knight',       name: '混沌の騎士',         hp: 2800,  maxHp: 2800,  attack: 420, defense: 172, speed: 22, expReward: 1650, goldReward: 355,  isBoss: false, element: 'dark', floorMin: 20, floorMax: 50, maxMp: 50,
    skills: [
      { id: 'ck_chaos_charge', name: '混沌突撃', mpCost: 28, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_single', power: 2.0, element: 'dark' } },
    ],
    drops: [{ itemId: 'thunderbrand', chance: 0.04 }]},
    { id: 'chaos_overlord',     name: '混沌の覇者',         hp: 3800,  maxHp: 3800,  attack: 540, defense: 220, speed: 22, expReward: 2200, goldReward: 470,  isBoss: false, element: 'dark', floorMin: 45, floorMax: 75, maxMp: 65,
    skills: [
      { id: 'co_chaos_blast', name: '混沌爆撃', mpCost: 36, cooldownMs: 24000, condition: 'always',
        effect: { type: 'attack_all', power: 1.5, element: 'dark' } },
    ],
    drops: [{ itemId: 'warbreaker', chance: 0.04 }]},
    { id: 'twilight_oracle',    name: '黄昏の神官',         hp: 2200,  maxHp: 2200,  attack: 500, defense: 105, speed: 26, expReward: 1800, goldReward: 385,  isBoss: false, element: 'dark', floorMin: 20, floorMax: 60, maxMp: 60,
    skills: [
      { id: 'to_dusk_curse', name: '夕闇の呪詛', mpCost: 30, cooldownMs: 22000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_atk', debuffChance: 0.85 } },
    ],
    drops: [{ itemId: 'archsage_robe', chance: 0.04 }]},
    { id: 'dusk_archon',        name: '薄暮のアーコン',     hp: 3000,  maxHp: 3000,  attack: 650, defense: 135, speed: 26, expReward: 2400, goldReward: 510,  isBoss: false, element: 'dark', floorMin: 45, floorMax: 75, maxMp: 70,
    skills: [
      { id: 'da_underworld_judge', name: '冥府の裁き', mpCost: 38, cooldownMs: 26000, condition: 'always',
        effect: { type: 'attack_all', power: 1.6, element: 'dark' } },
    ],
    drops: [{ itemId: 'nightveil_robe', chance: 0.04 }]},
    { id: 'void_leviathan',     name: 'ヴォイドレヴィアタン', hp: 3600, maxHp: 3600,  attack: 370, defense: 222, speed: 12, expReward: 2000, goldReward: 430,  isBoss: false, element: 'dark', floorMin: 35, floorMax: 70, maxMp: 50,
    skills: [
      { id: 'vl_void_crush', name: '虚無の圧潰', mpCost: 28, cooldownMs: 24000, condition: 'always',
        effect: { type: 'attack_all', power: 1.3, element: 'dark' } },
    ],
    drops: [{ itemId: 'bloodiron_armor', chance: 0.04 }]},
    { id: 'abyssal_archmage',   name: '深淵の大魔導師',     hp: 2500,  maxHp: 2500,  attack: 528, defense: 80,  speed: 28, expReward: 2200, goldReward: 470,  isBoss: false, element: 'dark', floorMin: 45, floorMax: 75, maxMp: 70,
    skills: [
      { id: 'aam_abyss_blast', name: '深淵魔法炸裂', mpCost: 38, cooldownMs: 24000, condition: 'always',
        effect: { type: 'attack_all', power: 1.7, element: 'dark' } },
    ],
    drops: [{ itemId: 'manafont_staff', chance: 0.04 }]},
    { id: 'storm_harpy',        name: 'ストームハーピー',   hp: 2700,  maxHp: 2700,  attack: 538, defense: 120, speed: 32, expReward: 1800, goldReward: 385,  isBoss: false, element: 'dark', floorMin: 28, floorMax: 65, maxMp: 50,
    skills: [
      { id: 'sh_storm_wing', name: '嵐の翼撃', mpCost: 28, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_all', power: 1.3 } },
    ],
    drops: [{ itemId: 'gale_boots', chance: 0.04 }]},
    { id: 'cyclone_harpy',      name: 'サイクロンハーピー', hp: 3700,  maxHp: 3700,  attack: 700, defense: 155, speed: 32, expReward: 2400, goldReward: 510,  isBoss: false, element: 'dark', floorMin: 50, floorMax: 75, maxMp: 65,
    skills: [
      { id: 'ch_cyclone', name: 'サイクロン', mpCost: 36, cooldownMs: 26000, condition: 'always',
        effect: { type: 'attack_all', power: 1.6 } },
    ],
    drops: [{ itemId: 'gale_boots', chance: 0.05 }]},
    { id: 'grand_executioner',  name: '大断頭台の処刑人',   hp: 3200,  maxHp: 3200,  attack: 448, defense: 185, speed: 22, expReward: 2000, goldReward: 430,  isBoss: false, floorMin: 65, floorMax: 75, maxMp: 45,
    skills: [
      { id: 'ge_guillotine', name: '断頭台の刃', mpCost: 25, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_single', power: 2.2 } },
    ],
    drops: [{ itemId: 'ruin_cleaver', chance: 0.04 }]},
    { id: 'chaos_shaman',       name: '混沌のシャーマン',   hp: 1700,  maxHp: 1700,  attack: 350, defense: 80,  speed: 24, expReward: 1100, goldReward: 235,  isBoss: false, element: 'dark', floorMin: 8,  floorMax: 40,
    drops: [{ itemId: 'archsage_robe', chance: 0.03 }]},
    { id: 'shadow_colossus',    name: 'シャドウコロッサス', hp: 2400,  maxHp: 2400,  attack: 310, defense: 155, speed: 16, expReward: 1400, goldReward: 300,  isBoss: false, element: 'dark', floorMin: 18, floorMax: 55,
    drops: [{ itemId: 'bloodiron_armor', chance: 0.03 }]},
    { id: 'void_specter',       name: 'ヴォイドスペクター', hp: 1800,  maxHp: 1800,  attack: 390, defense: 75,  speed: 28, expReward: 1300, goldReward: 280,  isBoss: false, element: 'dark', floorMin: 10, floorMax: 50,
    debuffOnHit: { type: 'seal_atk', chance: 0.20 },
    drops: [{ itemId: 'eclipse_scythe', chance: 0.03 }]},
    { id: 'abyss_reaper_elite', name: '奈落の死神・強',     hp: 2400,  maxHp: 2400,  attack: 408, defense: 148, speed: 26, expReward: 1500, goldReward: 320,  isBoss: false, element: 'dark', floorMin: 22, floorMax: 55,
    drops: [{ itemId: 'eclipse_scythe', chance: 0.03 }]},
    { id: 'death_knight_elite', name: 'デスナイト・強',     hp: 2740,  maxHp: 2740,  attack: 442, defense: 165, speed: 22, expReward: 1600, goldReward: 340,  isBoss: false, element: 'dark', floorMin: 20, floorMax: 60,
    drops: [{ itemId: 'void_scythe_edge', chance: 0.03 }]},
    { id: 'rift_phantom',       name: 'リフトファントム',   hp: 2100,  maxHp: 2100,  attack: 420, defense: 100, speed: 30, expReward: 1400, goldReward: 300,  isBoss: false, element: 'dark', floorMin: 30, floorMax: 65,
    drops: [{ itemId: 'blink_knife', chance: 0.03 }]},
    { id: 'tower_specter',      name: '塔の亡霊',           hp: 2050,  maxHp: 2050,  attack: 440, defense: 95,  speed: 28, expReward: 1500, goldReward: 320,  isBoss: false, element: 'dark', floorMin: 38, floorMax: 65, maxMp: 45,
    skills: [
      { id: 'ts_wasting_curse', name: '消耗の呪い', mpCost: 24, cooldownMs: 22000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_def', debuffChance: 0.80 } },
    ],
    drops: [{ itemId: 'archsage_robe', chance: 0.04 }]},
    { id: 'chaos_goliath',      name: '混沌の巨神',         hp: 3200,  maxHp: 3200,  attack: 352, defense: 200, speed: 14, expReward: 1900, goldReward: 408,  isBoss: false, element: 'dark', floorMin: 42, floorMax: 75, maxMp: 45,
    skills: [
      { id: 'cg_dark_crush', name: '暗黒粉砕', mpCost: 25, cooldownMs: 24000, condition: 'always',
        effect: { type: 'attack_all', power: 1.2, element: 'dark' } },
    ],
    drops: [{ itemId: 'bloodiron_armor', chance: 0.04 }]},
    { id: 'rift_dragon',        name: 'リフトドラゴン',     hp: 2800,  maxHp: 2800,  attack: 380, defense: 165, speed: 20, expReward: 1700, goldReward: 365,  isBoss: false, element: 'fire', floorMin: 35, floorMax: 70, maxMp: 50,
    skills: [
      { id: 'rd_rift_flame', name: '竜炎嵐', mpCost: 28, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_all', power: 1.4, element: 'fire' } },
    ],
    drops: [{ itemId: 'dragon_fang', chance: 0.03 }]},
    { id: 'rift_wizard',        name: 'リフトウィザード',   hp: 2200,  maxHp: 2200,  attack: 480, defense: 90,  speed: 26, expReward: 2000, goldReward: 430,  isBoss: false, element: 'dark', floorMin: 52, floorMax: 75, maxMp: 65,
    skills: [
      { id: 'rw_dimension_slash', name: '次元断', mpCost: 35, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_single', power: 2.0, element: 'dark' } },
    ],
    drops: [{ itemId: 'manafont_staff', chance: 0.04 }]},
  ],
  sacred_ruins: [
    { id: 'sacred_golem',    name: '聖域のゴーレム',     hp: 2200,  maxHp: 2200,  attack: 250, defense: 85,  speed: 16, expReward: 1600, goldReward: 340,  isBoss: false, floorMin: 1,  floorMax: 42 ,
    drops: [
      { itemId: 'hallowed_mail', chance: 0.05 },
    ]},
    { id: 'holy_specter',    name: 'ホーリースペクター', hp: 1800,  maxHp: 1800,  attack: 300, defense: 60,  speed: 28, expReward: 1700, goldReward: 360,  isBoss: false, element: 'light', floorMin: 1,  floorMax: 52 ,
    drops: [
      { itemId: 'seraph_emblem', chance: 0.05 },
    ]},
    { id: 'ruin_guardian',   name: '廃墟の守護者',       hp: 2900,  maxHp: 2900,  attack: 220, defense: 115, speed: 18, expReward: 1800, goldReward: 380,  isBoss: false, floorMin: 20, floorMax: 75 ,
    drops: [
      { itemId: 'guardian_talisman', chance: 0.05 },
    ]},
    { id: 'fallen_paladin',  name: '堕ちた聖騎士',       hp: 2000,  maxHp: 2000,  attack: 340, defense: 70,  speed: 24, expReward: 1900, goldReward: 400,  isBoss: false, element: 'dark', floorMin: 8,  floorMax: 58 ,
    drops: [
      { itemId: 'oracle_staff', chance: 0.04 },
    ]},
    { id: 'penitent_giant',  name: '贖罪の巨兵',         hp: 3200,  maxHp: 3200,  attack: 240, defense: 130, speed: 16, expReward: 1750, goldReward: 360,  isBoss: false, floorMin: 32, floorMax: 88 ,
    drops: [
      { itemId: 'martyr_mace', chance: 0.04 },
    ]},
    { id: 'halo_hunter',     name: '光輪の狩人',         hp: 2200,  maxHp: 2200,  attack: 355, defense: 68,  speed: 30, expReward: 1820, goldReward: 375,  isBoss: false, element: 'light', floorMin: 12, floorMax: 68 ,
    drops: [
      { itemId: 'skybreaker_bow', chance: 0.05 },
    ]},
    { id: 'fallen_seraph',   name: '堕ちた熾天使',       hp: 2000,  maxHp: 2000,  attack: 360, defense: 62,  speed: 28, expReward: 1860, goldReward: 390,  isBoss: false, element: 'dark', floorMin: 45, floorMax: 90 ,
    drops: [
      { itemId: 'nightveil_robe', chance: 0.04 },
    ]},
    { id: 'cathedral_keeper',name: '大聖堂の守人',       hp: 2600,  maxHp: 2600,  attack: 290, defense: 100, speed: 22, expReward: 1780, goldReward: 370,  isBoss: false, element: 'light', floorMin: 58, floorMax: 90 ,
    drops: [
      { itemId: 'blessed_vestment', chance: 0.05 },
    ]},
    // ── 進化系・深層混入 ──
    { id: 'stone_herald',       name: '石の使者',           hp: 1600,  maxHp: 1600,  attack: 190, defense: 62,  speed: 16, expReward: 1200, goldReward: 255,  isBoss: false, floorMin: 1,  floorMax: 28,
    drops: [{ itemId: 'hallowed_mail', chance: 0.03 }]},
    { id: 'sacred_guardian',    name: '聖域の守護者',       hp: 3100,  maxHp: 3100,  attack: 330, defense: 112, speed: 16, expReward: 2200, goldReward: 465,  isBoss: false, floorMin: 22, floorMax: 55, maxMp: 50,
    skills: [
      { id: 'sg_sacred_ward', name: '聖域の加護', mpCost: 28, cooldownMs: 22000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_atk', debuffChance: 0.75 } },
    ],
    drops: [{ itemId: 'hallowed_mail', chance: 0.04 }]},
    { id: 'blessed_colossus',   name: '祝福の巨兵',         hp: 4200,  maxHp: 4200,  attack: 420, defense: 145, speed: 14, expReward: 3000, goldReward: 640,  isBoss: false, element: 'light', floorMin: 45, floorMax: 88, maxMp: 55,
    skills: [
      { id: 'bc_holy_smash', name: '聖の粉砕', mpCost: 32, cooldownMs: 26000, condition: 'always',
        effect: { type: 'attack_all', power: 1.3, element: 'light' } },
    ],
    drops: [{ itemId: 'miracle_surcoat', chance: 0.04 }]},
    { id: 'radiant_specter',    name: '輝く幽霊',           hp: 2500,  maxHp: 2500,  attack: 400, defense: 80,  speed: 28, expReward: 2500, goldReward: 530,  isBoss: false, element: 'light', floorMin: 22, floorMax: 65, maxMp: 55,
    skills: [
      { id: 'rs_light_burst', name: '光の爆発', mpCost: 30, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_all', power: 1.4, element: 'light' } },
    ],
    drops: [{ itemId: 'seraph_emblem', chance: 0.04 }]},
    { id: 'divine_phantom',     name: '神聖なる亡霊',       hp: 3400,  maxHp: 3400,  attack: 518, defense: 105, speed: 28, expReward: 3400, goldReward: 720,  isBoss: false, element: 'light', floorMin: 48, floorMax: 90, maxMp: 65,
    skills: [
      { id: 'dp_divine_bomb', name: '神聖爆弾', mpCost: 38, cooldownMs: 26000, condition: 'always',
        effect: { type: 'attack_all', power: 1.7, element: 'light' } },
    ],
    drops: [{ itemId: 'blessed_vestment', chance: 0.04 }]},
    { id: 'grand_guardian',     name: '大いなる守護者',     hp: 4100,  maxHp: 4100,  attack: 292, defense: 152, speed: 16, expReward: 2800, goldReward: 595,  isBoss: false, floorMin: 38, floorMax: 80, maxMp: 50,
    skills: [
      { id: 'gg_earth_ward', name: '大地の守護', mpCost: 28, cooldownMs: 24000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_atk', debuffChance: 0.80 } },
    ],
    drops: [{ itemId: 'guardian_talisman', chance: 0.04 }]},
    { id: 'fallen_champion',    name: '堕落した勇士',       hp: 2800,  maxHp: 2800,  attack: 450, defense: 95,  speed: 24, expReward: 2700, goldReward: 575,  isBoss: false, element: 'dark', floorMin: 22, floorMax: 72, maxMp: 55,
    skills: [
      { id: 'fc_fallen_strike', name: '堕落の一撃', mpCost: 30, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_single', power: 2.0, element: 'dark' } },
    ],
    drops: [{ itemId: 'oracle_staff', chance: 0.04 }]},
    { id: 'dark_apostate',      name: '闇の背教者',         hp: 3800,  maxHp: 3800,  attack: 580, defense: 125, speed: 24, expReward: 3600, goldReward: 765,  isBoss: false, element: 'dark', floorMin: 48, floorMax: 90, maxMp: 65,
    skills: [
      { id: 'da_dark_judgement', name: '闇の断罪', mpCost: 38, cooldownMs: 26000, condition: 'always',
        effect: { type: 'attack_all', power: 1.6, element: 'dark' } },
    ],
    drops: [{ itemId: 'nightveil_robe', chance: 0.04 }]},
    { id: 'titan_giant',        name: 'タイタンジャイアント', hp: 4500, maxHp: 4500,  attack: 320, defense: 172, speed: 14, expReward: 3200, goldReward: 680,  isBoss: false, floorMin: 50, floorMax: 90, maxMp: 45,
    skills: [
      { id: 'tg_earth_quake', name: '地響きの一撃', mpCost: 25, cooldownMs: 26000, condition: 'always',
        effect: { type: 'attack_all', power: 1.2 } },
    ],
    drops: [{ itemId: 'martyr_mace', chance: 0.04 }]},
    { id: 'divine_huntress',    name: '神聖なる狩人',       hp: 3100,  maxHp: 3100,  attack: 472, defense: 90,  speed: 30, expReward: 2800, goldReward: 595,  isBoss: false, element: 'light', floorMin: 32, floorMax: 78, maxMp: 55,
    skills: [
      { id: 'dh_halo_arrow', name: '光輪矢', mpCost: 30, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_single', power: 2.2, element: 'light' } },
    ],
    drops: [{ itemId: 'skybreaker_bow', chance: 0.04 }]},
    { id: 'seraph_sentry',      name: '熾天使の番人',       hp: 1900,  maxHp: 1900,  attack: 265, defense: 72,  speed: 22, expReward: 1400, goldReward: 295,  isBoss: false, element: 'light', floorMin: 1,  floorMax: 38,
    drops: [{ itemId: 'seraph_emblem', chance: 0.03 }]},
    { id: 'cursed_clergy',      name: '呪われた聖職者',     hp: 1750,  maxHp: 1750,  attack: 310, defense: 68,  speed: 24, expReward: 1600, goldReward: 340,  isBoss: false, element: 'dark', floorMin: 15, floorMax: 55,
    debuffOnHit: { type: 'seal_def', chance: 0.20 },
    drops: [{ itemId: 'oracle_staff', chance: 0.03 }]},
    { id: 'holy_knight',        name: '聖騎士',             hp: 2200,  maxHp: 2200,  attack: 290, defense: 90,  speed: 22, expReward: 1650, goldReward: 350,  isBoss: false, element: 'light', floorMin: 8,  floorMax: 50,
    drops: [{ itemId: 'hallowed_mail', chance: 0.03 }]},
    { id: 'ruin_specter',       name: '廃墟の亡霊',         hp: 1900,  maxHp: 1900,  attack: 320, defense: 70,  speed: 26, expReward: 1500, goldReward: 320,  isBoss: false, floorMin: 12, floorMax: 60,
    drops: [{ itemId: 'blessed_vestment', chance: 0.03 }]},
    { id: 'sanctified_beast',   name: '聖化された魔獣',     hp: 2600,  maxHp: 2600,  attack: 295, defense: 105, speed: 20, expReward: 1800, goldReward: 385,  isBoss: false, floorMin: 20, floorMax: 65,
    drops: [{ itemId: 'guardian_talisman', chance: 0.03 }]},
    { id: 'void_revenant',      name: 'ヴォイドレヴナント', hp: 2800,  maxHp: 2800,  attack: 440, defense: 148, speed: 24, expReward: 2000, goldReward: 425,  isBoss: false, element: 'dark', floorMin: 30, floorMax: 72,
    drops: [{ itemId: 'blooddrinker', chance: 0.03 }]},
    { id: 'chaos_enforcer',     name: '混沌の執行者',       hp: 3400,  maxHp: 3400,  attack: 480, defense: 185, speed: 20, expReward: 2400, goldReward: 510,  isBoss: false, element: 'dark', floorMin: 42, floorMax: 88,
    drops: [{ itemId: 'bloodiron_armor', chance: 0.03 }]},
    { id: 'light_aberration',   name: '光の異形',           hp: 2800,  maxHp: 2800,  attack: 360, defense: 108, speed: 24, expReward: 2000, goldReward: 425,  isBoss: false, element: 'light', floorMin: 35, floorMax: 80,
    drops: [{ itemId: 'seraph_emblem', chance: 0.03 }]},
    { id: 'fallen_archangel',   name: '堕ちた大天使',       hp: 2800,  maxHp: 2800,  attack: 478, defense: 85,  speed: 28, expReward: 3200, goldReward: 680,  isBoss: false, element: 'dark', floorMin: 62, floorMax: 90, maxMp: 60,
    skills: [
      { id: 'fa_fallen_impact', name: '堕天の衝撃', mpCost: 35, cooldownMs: 26000, condition: 'always',
        effect: { type: 'attack_all', power: 1.6, element: 'dark' } },
    ],
    drops: [{ itemId: 'nightveil_robe', chance: 0.04 }]},
    { id: 'cathedral_sentinel', name: '大聖堂の番兵',       hp: 3600,  maxHp: 3600,  attack: 385, defense: 135, speed: 22, expReward: 3000, goldReward: 640,  isBoss: false, element: 'light', floorMin: 70, floorMax: 90, maxMp: 55,
    skills: [
      { id: 'cs_cathedral_judge', name: '大聖堂の裁き', mpCost: 32, cooldownMs: 24000, condition: 'always',
        effect: { type: 'attack_single', power: 2.0, element: 'light' } },
    ],
    drops: [{ itemId: 'blessed_vestment', chance: 0.05 }]},
  ],
  eternal_sanctum: [
    { id: 'sanctum_sentinel',   name: '聖域の番兵',     hp: 3200,  maxHp: 3200,  attack: 290, defense: 105, speed: 20, expReward: 2000, goldReward: 450,  isBoss: false, floorMin: 1,  floorMax: 45 ,
    drops: [
      { itemId: 'vanguard_mail', chance: 0.04 },
    ]},
    { id: 'eternal_wraith',     name: '永遠の亡霊',     hp: 2500,  maxHp: 2500,  attack: 360, defense: 75,  speed: 26, expReward: 2100, goldReward: 470,  isBoss: false, element: 'dark', floorMin: 1,  floorMax: 60 ,
    drops: [
      { itemId: 'eclipse_scythe', chance: 0.05 },
    ]},
    { id: 'divine_construct',   name: '神聖な構造体',   hp: 4200,  maxHp: 4200,  attack: 260, defense: 140, speed: 14, expReward: 2200, goldReward: 490,  isBoss: false, element: 'light', floorMin: 25, floorMax: 80 ,
    drops: [
      { itemId: 'miracle_surcoat', chance: 0.04 },
    ]},
    { id: 'chaos_herald',       name: '混沌の使徒',     hp: 2800,  maxHp: 2800,  attack: 400, defense: 80,  speed: 28, expReward: 2300, goldReward: 510,  isBoss: false, element: 'dark', floorMin: 38, floorMax: 110 ,
    drops: [
      { itemId: 'soul_reaper', chance: 0.04 },
    ]},
    { id: 'judgement_colossus', name: '審判の巨兵',     hp: 4500,  maxHp: 4500,  attack: 280, defense: 150, speed: 14, expReward: 2350, goldReward: 500,  isBoss: false, element: 'light', floorMin: 55, floorMax: 120 ,
    drops: [
      { itemId: 'guardian_talisman', chance: 0.05 },
    ]},
    { id: 'eternal_lancer',     name: '永久の槍兵',     hp: 3000,  maxHp: 3000,  attack: 420, defense: 82,  speed: 28, expReward: 2250, goldReward: 470,  isBoss: false, floorMin: 15, floorMax: 70 ,
    drops: [
      { itemId: 'blink_knife', chance: 0.05 },
    ]},
    { id: 'astral_deacon',      name: '星詠みの助祭',   hp: 2700,  maxHp: 2700,  attack: 415, defense: 78,  speed: 26, expReward: 2280, goldReward: 480,  isBoss: false, element: 'light', floorMin: 28, floorMax: 100 ,
    drops: [
      { itemId: 'seraph_emblem', chance: 0.05 },
    ]},
    { id: 'apostle_of_dusk',    name: '黄昏の使徒',     hp: 3400,  maxHp: 3400,  attack: 360, defense: 110, speed: 22, expReward: 2320, goldReward: 495,  isBoss: false, element: 'dark', floorMin: 65, floorMax: 120 ,
    drops: [
      { itemId: 'guardian_talisman', chance: 0.05 },
    ]},
    // ── 進化系・深層混入 ──
    { id: 'sanctum_guard',      name: '聖域の衛兵',     hp: 2400,  maxHp: 2400,  attack: 218, defense: 78,  speed: 20, expReward: 1500, goldReward: 338,  isBoss: false, floorMin: 1,  floorMax: 30,
    drops: [{ itemId: 'vanguard_mail', chance: 0.03 }]},
    { id: 'sacred_sentinel',    name: '聖なる番兵',     hp: 4500,  maxHp: 4500,  attack: 385, defense: 140, speed: 20, expReward: 2800, goldReward: 630,  isBoss: false, floorMin: 22, floorMax: 60, maxMp: 55,
    skills: [
      { id: 'ss_sentinel_order', name: '番兵の号令', mpCost: 30, cooldownMs: 24000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_def', debuffChance: 0.80 } },
    ],
    drops: [{ itemId: 'vanguard_mail', chance: 0.04 }]},
    { id: 'eternal_guardian',   name: '永劫の守護者',   hp: 6200,  maxHp: 6200,  attack: 500, defense: 182, speed: 18, expReward: 4000, goldReward: 900,  isBoss: false, floorMin: 48, floorMax: 90, maxMp: 65,
    skills: [
      { id: 'eg_eternal_ward', name: '永劫の守護', mpCost: 36, cooldownMs: 28000, condition: 'always',
        effect: { type: 'attack_all', power: 1.3 } },
    ],
    drops: [{ itemId: 'miracle_surcoat', chance: 0.04 }]},
    { id: 'fallen_wraith',      name: '堕ちた亡霊',     hp: 1800,  maxHp: 1800,  attack: 270, defense: 55,  speed: 26, expReward: 1600, goldReward: 360,  isBoss: false, element: 'dark', floorMin: 1,  floorMax: 40,
    drops: [{ itemId: 'eclipse_scythe', chance: 0.03 }]},
    { id: 'void_wraith',        name: 'ヴォイドレイス',  hp: 3500,  maxHp: 3500,  attack: 478, defense: 100, speed: 26, expReward: 3200, goldReward: 720,  isBoss: false, element: 'dark', floorMin: 28, floorMax: 75, maxMp: 60,
    skills: [
      { id: 'vw_soul_erosion', name: '魂の侵食', mpCost: 32, cooldownMs: 24000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_atk', debuffChance: 0.85 } },
    ],
    drops: [{ itemId: 'soul_reaper', chance: 0.04 }]},
    { id: 'eternal_shade',      name: '永劫の闇',       hp: 4800,  maxHp: 4800,  attack: 620, defense: 132, speed: 26, expReward: 4500, goldReward: 1015, isBoss: false, element: 'dark', floorMin: 55, floorMax: 110, maxMp: 75,
    skills: [
      { id: 'es_eternal_dark', name: '永劫の暗黒', mpCost: 40, cooldownMs: 28000, condition: 'always',
        effect: { type: 'attack_all', power: 1.7, element: 'dark' } },
    ],
    drops: [{ itemId: 'soul_reaper', chance: 0.05 }]},
    { id: 'divine_enforcer',    name: '神聖な執行者',   hp: 5900,  maxHp: 5900,  attack: 345, defense: 185, speed: 14, expReward: 3800, goldReward: 855,  isBoss: false, element: 'light', floorMin: 42, floorMax: 100, maxMp: 60,
    skills: [
      { id: 'de_divine_crush', name: '神聖粉砕', mpCost: 35, cooldownMs: 26000, condition: 'always',
        effect: { type: 'attack_all', power: 1.4, element: 'light' } },
    ],
    drops: [{ itemId: 'miracle_surcoat', chance: 0.04 }]},
    { id: 'omega_construct',    name: 'オメガコンストラクト', hp: 8000, maxHp: 8000,  attack: 450, defense: 240, speed: 12, expReward: 5500, goldReward: 1240, isBoss: false, element: 'light', floorMin: 72, floorMax: 120, maxMp: 70,
    skills: [
      { id: 'oc_divine_judgement', name: '神の審判', mpCost: 42, cooldownMs: 30000, condition: 'always',
        effect: { type: 'attack_all', power: 1.6, element: 'light' } },
    ],
    drops: [{ itemId: 'angel_feather', chance: 0.04 }]},
    { id: 'chaos_apostle',      name: '混沌の使徒',     hp: 3900,  maxHp: 3900,  attack: 528, defense: 108, speed: 28, expReward: 4200, goldReward: 945,  isBoss: false, element: 'dark', floorMin: 55, floorMax: 115, maxMp: 65,
    skills: [
      { id: 'ca_chaos_binding', name: '混沌の呪縛', mpCost: 35, cooldownMs: 26000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'bind', debuffChance: 1.0 } },
    ],
    drops: [{ itemId: 'guardian_talisman', chance: 0.04 }]},
    { id: 'chaos_avatar',       name: '混沌の化身',     hp: 5200,  maxHp: 5200,  attack: 680, defense: 140, speed: 28, expReward: 6000, goldReward: 1350, isBoss: false, element: 'dark', floorMin: 82, floorMax: 120, maxMp: 80,
    skills: [
      { id: 'cav_chaos_doom', name: '混沌爆滅', mpCost: 45, cooldownMs: 30000, condition: 'always',
        effect: { type: 'attack_all', power: 1.8, element: 'dark' } },
    ],
    drops: [{ itemId: 'soul_reaper', chance: 0.05 }]},
    { id: 'titan_colossus',     name: 'タイタンコロッサス', hp: 6500, maxHp: 6500,  attack: 372, defense: 200, speed: 12, expReward: 5000, goldReward: 1125, isBoss: false, element: 'light', floorMin: 75, floorMax: 120, maxMp: 65,
    skills: [
      { id: 'tc_last_judgement', name: '最後の審判', mpCost: 40, cooldownMs: 30000, condition: 'always',
        effect: { type: 'attack_all', power: 1.5, element: 'light' } },
    ],
    drops: [{ itemId: 'guardian_talisman', chance: 0.05 }]},
    { id: 'cosmic_lancer',      name: 'コスミックランサー', hp: 4200, maxHp: 4200,  attack: 558, defense: 110, speed: 28, expReward: 3500, goldReward: 788,  isBoss: false, floorMin: 35, floorMax: 90, maxMp: 60,
    skills: [
      { id: 'cl_light_speed_thrust', name: '光速突撃', mpCost: 32, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_single', power: 2.2 } },
    ],
    drops: [{ itemId: 'blink_knife', chance: 0.04 }]},
    { id: 'divine_lancer',      name: '神聖なる槍兵',   hp: 5800,  maxHp: 5800,  attack: 728, defense: 145, speed: 28, expReward: 5000, goldReward: 1125, isBoss: false, floorMin: 65, floorMax: 120, maxMp: 75,
    skills: [
      { id: 'dl_godspeed_combo', name: '神速連突', mpCost: 42, cooldownMs: 28000, condition: 'always',
        effect: { type: 'attack_all', power: 1.5 } },
    ],
    drops: [{ itemId: 'blink_knife', chance: 0.05 }]},
    { id: 'high_deacon',        name: '高位助祭',       hp: 3800,  maxHp: 3800,  attack: 550, defense: 105, speed: 26, expReward: 3800, goldReward: 855,  isBoss: false, element: 'light', floorMin: 48, floorMax: 110, maxMp: 65,
    skills: [
      { id: 'hd_star_light', name: '星詠みの光', mpCost: 36, cooldownMs: 26000, condition: 'always',
        effect: { type: 'attack_all', power: 1.5, element: 'light' } },
    ],
    drops: [{ itemId: 'seraph_emblem', chance: 0.04 }]},
    { id: 'arch_deacon',        name: '大助祭',         hp: 5200,  maxHp: 5200,  attack: 715, defense: 138, speed: 26, expReward: 5500, goldReward: 1240, isBoss: false, element: 'light', floorMin: 78, floorMax: 120, maxMp: 80,
    skills: [
      { id: 'ad_star_burst', name: '天星爆裂', mpCost: 45, cooldownMs: 30000, condition: 'always',
        effect: { type: 'attack_all', power: 1.8, element: 'light' } },
    ],
    drops: [{ itemId: 'seraph_emblem', chance: 0.05 }]},
    { id: 'dusk_herald',        name: '黄昏の先触れ',   hp: 4800,  maxHp: 4800,  attack: 478, defense: 148, speed: 22, expReward: 4500, goldReward: 1015, isBoss: false, element: 'dark', floorMin: 82, floorMax: 120, maxMp: 65,
    skills: [
      { id: 'dh_twilight_end', name: '黄昏の終焉', mpCost: 38, cooldownMs: 28000, condition: 'always',
        effect: { type: 'attack_all', power: 1.5, element: 'dark' } },
    ],
    drops: [{ itemId: 'guardian_talisman', chance: 0.05 }]},
    { id: 'sanctum_specter',    name: '聖域の亡霊',     hp: 2600,  maxHp: 2600,  attack: 350, defense: 88,  speed: 24, expReward: 1800, goldReward: 405,  isBoss: false, element: 'dark', floorMin: 8,  floorMax: 55,
    drops: [{ itemId: 'eclipse_scythe', chance: 0.03 }]},
    { id: 'divine_beast',       name: '神聖なる魔獣',   hp: 3400,  maxHp: 3400,  attack: 380, defense: 118, speed: 22, expReward: 2200, goldReward: 495,  isBoss: false, element: 'light', floorMin: 18, floorMax: 70,
    drops: [{ itemId: 'seraph_emblem', chance: 0.03 }]},
    { id: 'void_golem',         name: 'ヴォイドゴーレム', hp: 4800,  maxHp: 4800,  attack: 320, defense: 178, speed: 14, expReward: 2800, goldReward: 630,  isBoss: false, element: 'dark', floorMin: 32, floorMax: 85,
    drops: [{ itemId: 'miracle_surcoat', chance: 0.03 }]},
    { id: 'blessed_revenant',   name: '祝福の亡霊',     hp: 3400,  maxHp: 3400,  attack: 480, defense: 148, speed: 24, expReward: 2600, goldReward: 585,  isBoss: false, element: 'light', floorMin: 45, floorMax: 95,
    drops: [{ itemId: 'hallowed_mail', chance: 0.03 }]},
    { id: 'dark_apostate_elite',name: '闇の背教者・強', hp: 5200,  maxHp: 5200,  attack: 760, defense: 165, speed: 24, expReward: 4000, goldReward: 900,  isBoss: false, element: 'dark', floorMin: 60, floorMax: 110,
    drops: [{ itemId: 'nightveil_robe', chance: 0.03 }]},
    { id: 'eternal_phantom',    name: '永劫の幻影',     hp: 3800,  maxHp: 3800,  attack: 450, defense: 120, speed: 26, expReward: 2800, goldReward: 630,  isBoss: false, element: 'dark', floorMin: 50, floorMax: 100,
    drops: [{ itemId: 'soul_reaper', chance: 0.03 }]},
    { id: 'astral_beast',       name: 'アストラルビースト', hp: 4500, maxHp: 4500,  attack: 420, defense: 150, speed: 22, expReward: 3200, goldReward: 720,  isBoss: false, element: 'light', floorMin: 62, floorMax: 110,
    drops: [{ itemId: 'guardian_talisman', chance: 0.03 }]},
    { id: 'cosmic_destroyer',   name: 'コスミックデストロイヤー', hp: 6000, maxHp: 6000, attack: 560, defense: 200, speed: 18, expReward: 5200, goldReward: 1170, isBoss: false, element: 'dark', floorMin: 82, floorMax: 120, maxMp: 70,
    skills: [
      { id: 'cd_cosmos_erase', name: '宇宙消去', mpCost: 40, cooldownMs: 30000, condition: 'always',
        effect: { type: 'attack_all', power: 1.6, element: 'dark' } },
    ],
    drops: [{ itemId: 'soul_reaper', chance: 0.04 }]},
  ],
  trial_colosseum: [
    { id: 'arena_beast',      name: '闘技場の猛獣',     hp: 2000,  maxHp: 2000,  attack: 310, defense: 70,  speed: 28, expReward: 2800, goldReward: 500,  isBoss: false, floorMin: 1,  floorMax: 18 ,
    drops: [
      { itemId: 'berserk_wraps', chance: 0.04 },
    ]},
    { id: 'gladiator',        name: 'グラディエーター', hp: 2500,  maxHp: 2500,  attack: 360, defense: 90,  speed: 22, expReward: 3000, goldReward: 550,  isBoss: false, floorMin: 1,  floorMax: 25 ,
    drops: [
      { itemId: 'warbreaker', chance: 0.05 },
    ]},
    { id: 'arena_mage',       name: '闘技場の魔導師',   hp: 1800,  maxHp: 1800,  attack: 420, defense: 55,  speed: 26, expReward: 3200, goldReward: 580,  isBoss: false, floorMin: 3,  floorMax: 25 ,
    drops: [
      { itemId: 'oracle_staff', chance: 0.05 },
    ]},
    { id: 'iron_golem',       name: 'アイアンゴーレム', hp: 3200,  maxHp: 3200,  attack: 280, defense: 120, speed: 14, expReward: 3500, goldReward: 620,  isBoss: false, floorMin: 8,  floorMax: 30 ,
    drops: [
      { itemId: 'steel_plate', chance: 0.05 },
    ]},
    { id: 'arena_crusher',    name: '闘技場の粉砕者',   hp: 3400,  maxHp: 3400,  attack: 320, defense: 120, speed: 16, expReward: 3400, goldReward: 610,  isBoss: false, floorMin: 14, floorMax: 30 ,
    drops: [
      { itemId: 'tiger_knuckle', chance: 0.04 },
    ]},
    { id: 'duel_champion',    name: '決闘者',           hp: 2500,  maxHp: 2500,  attack: 450, defense: 70,  speed: 30, expReward: 3250, goldReward: 590,  isBoss: false, floorMin: 18, floorMax: 30 ,
    drops: [
      { itemId: 'blink_knife', chance: 0.04 },
    ]},
    { id: 'battle_arcanist',  name: '戦闘魔術師',       hp: 2100,  maxHp: 2100,  attack: 448, defense: 62,  speed: 26, expReward: 3300, goldReward: 600,  isBoss: false, element: 'thunder', floorMin: 10, floorMax: 28 ,
    drops: [
      { itemId: 'archsage_robe', chance: 0.04 },
    ]},
    { id: 'chain_gladiator',  name: '鎖の剣闘士',       hp: 2900,  maxHp: 2900,  attack: 380, defense: 95,  speed: 22, expReward: 3350, goldReward: 605,  isBoss: false, floorMin: 16, floorMax: 30 ,
    drops: [
      { itemId: 'bloodiron_armor', chance: 0.04 },
    ]},
    // ── 進化系・新型 ──
    { id: 'arena_beast_alpha', name: '闘技場の猛獣α',    hp: 2800,  maxHp: 2800,  attack: 410, defense: 92,  speed: 28, expReward: 3900, goldReward: 695,  isBoss: false, floorMin: 10, floorMax: 25, maxMp: 40,
    skills: [
      { id: 'aba_beast_roar', name: '獣の咆哮', mpCost: 22, cooldownMs: 20000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_def', debuffChance: 0.75 } },
    ],
    drops: [{ itemId: 'berserk_wraps', chance: 0.04 }]},
    { id: 'battle_beast',      name: 'バトルビースト',    hp: 3800,  maxHp: 3800,  attack: 530, defense: 120, speed: 28, expReward: 5000, goldReward: 895,  isBoss: false, floorMin: 18, floorMax: 30, maxMp: 50,
    skills: [
      { id: 'bb_battle_cry', name: '戦場の鬨', mpCost: 28, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_all', power: 1.2 } },
    ],
    drops: [{ itemId: 'berserk_wraps', chance: 0.05 }]},
    { id: 'veteran_gladiator', name: '歴戦のグラディエーター', hp: 3500, maxHp: 3500, attack: 478, defense: 118, speed: 22, expReward: 4200, goldReward: 748,  isBoss: false, floorMin: 14, floorMax: 28, maxMp: 40,
    skills: [
      { id: 'vg_combo_slash', name: '闘士の連撃', mpCost: 22, cooldownMs: 18000, condition: 'always',
        effect: { type: 'attack_single', power: 1.8 } },
    ],
    drops: [{ itemId: 'warbreaker', chance: 0.04 }]},
    { id: 'grand_gladiator',   name: 'グランドグラディエーター', hp: 4800, maxHp: 4800, attack: 618, defense: 155, speed: 22, expReward: 5600, goldReward: 1000, isBoss: false, floorMin: 22, floorMax: 30, maxMp: 55,
    skills: [
      { id: 'gg_champion_blow', name: '覇者の一撃', mpCost: 30, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_single', power: 2.2 } },
    ],
    drops: [{ itemId: 'warbreaker', chance: 0.05 }]},
    { id: 'arcane_duelist',    name: '秘儀の決闘者',      hp: 2500,  maxHp: 2500,  attack: 558, defense: 72,  speed: 26, expReward: 4400, goldReward: 785,  isBoss: false, element: 'thunder', floorMin: 15, floorMax: 28, maxMp: 55,
    skills: [
      { id: 'ad_thunder_circle', name: '雷魔法陣', mpCost: 30, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_all', power: 1.4, element: 'thunder' } },
    ],
    drops: [{ itemId: 'oracle_staff', chance: 0.04 }]},
    { id: 'thunder_arcanist',  name: '雷の秘術師',        hp: 3400,  maxHp: 3400,  attack: 722, defense: 95,  speed: 26, expReward: 5800, goldReward: 1035, isBoss: false, element: 'thunder', floorMin: 22, floorMax: 30, maxMp: 65,
    skills: [
      { id: 'ta_super_thunder', name: '超雷撃', mpCost: 38, cooldownMs: 24000, condition: 'always',
        effect: { type: 'attack_all', power: 1.7, element: 'thunder' } },
    ],
    drops: [{ itemId: 'archsage_robe', chance: 0.04 }]},
    { id: 'steel_golem',       name: 'スチールゴーレム',  hp: 4500,  maxHp: 4500,  attack: 372, defense: 160, speed: 12, expReward: 4800, goldReward: 855,  isBoss: false, floorMin: 18, floorMax: 30, maxMp: 40,
    skills: [
      { id: 'sg_iron_storm', name: '鉄の嵐', mpCost: 25, cooldownMs: 24000, condition: 'always',
        effect: { type: 'attack_all', power: 1.2 } },
    ],
    drops: [{ itemId: 'steel_plate', chance: 0.04 }]},
    { id: 'colosseum_guardian',name: '闘技場の番人',      hp: 2600,  maxHp: 2600,  attack: 330, defense: 100, speed: 20, expReward: 3200, goldReward: 570,  isBoss: false, floorMin: 5,  floorMax: 20,
    drops: [{ itemId: 'steel_plate', chance: 0.03 }]},
    { id: 'blade_dancer',      name: 'ブレードダンサー',  hp: 2200,  maxHp: 2200,  attack: 480, defense: 65,  speed: 32, expReward: 3400, goldReward: 605,  isBoss: false, floorMin: 12, floorMax: 28,
    drops: [{ itemId: 'blink_knife', chance: 0.04 }]},
    { id: 'shadow_duelist',    name: '影の決闘者',        hp: 2400,  maxHp: 2400,  attack: 500, defense: 78,  speed: 30, expReward: 4000, goldReward: 715,  isBoss: false, element: 'dark', floorMin: 16, floorMax: 30, maxMp: 45,
    skills: [
      { id: 'sd_shadow_thrust', name: '影の連突', mpCost: 25, cooldownMs: 18000, condition: 'always',
        effect: { type: 'attack_single', power: 1.8, element: 'dark' } },
    ],
    drops: [{ itemId: 'venom_dirk', chance: 0.04 }]},
    { id: 'arena_tyrant',      name: '闘技場の暴君',      hp: 4000,  maxHp: 4000,  attack: 490, defense: 130, speed: 22, expReward: 5000, goldReward: 895,  isBoss: false, floorMin: 24, floorMax: 30, maxMp: 50,
    skills: [
      { id: 'at_tyrant_roar', name: '暴君の咆哮', mpCost: 28, cooldownMs: 24000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_atk', debuffChance: 0.85 } },
    ],
    drops: [{ itemId: 'bloodiron_armor', chance: 0.04 }]},
  ],
  chaos_trial: [
    { id: 'chaos_demon',       name: '混沌の悪魔',         hp: 6500,  maxHp: 6500,  attack: 360, defense: 170, speed: 24, expReward: 5000, goldReward: 2000, isBoss: false, element: 'dark', floorMin: 1,  floorMax: 28 ,
    drops: [
      { itemId: 'blooddrinker', chance: 0.04 },
    ]},
    { id: 'void_titan',        name: 'ヴォイドタイタン',   hp: 10000, maxHp: 10000, attack: 300, defense: 220, speed: 16, expReward: 5500, goldReward: 2200, isBoss: false, element: 'dark', floorMin: 1,  floorMax: 40 ,
    drops: [
      { itemId: 'bloodiron_armor', chance: 0.05 },
    ]},
    { id: 'chaos_phoenix',     name: '混沌のフェニックス', hp: 5000,  maxHp: 5000,  attack: 400, defense: 120, speed: 26, expReward: 5200, goldReward: 2100, isBoss: false, element: 'fire', floorMin: 3,  floorMax: 35 ,
    drops: [
      { itemId: 'phoenix_mail', chance: 0.04 },
    ]},
    { id: 'abyss_dragon',      name: '深淵竜',             hp: 11000, maxHp: 11000, attack: 330, defense: 240, speed: 14, expReward: 6000, goldReward: 2500, isBoss: false, element: 'dark', floorMin: 22, floorMax: 50 ,
    drops: [
      { itemId: 'dragon_fang', chance: 0.05 },
    ]},
    { id: 'rift_devourer',     name: '裂空喰らい',         hp: 11000, maxHp: 11000, attack: 315, defense: 230, speed: 16, expReward: 6200, goldReward: 2500, isBoss: false, element: 'dark', floorMin: 30, floorMax: 50 ,
    drops: [
      { itemId: 'ruin_cleaver', chance: 0.05 },
    ]},
    { id: 'chaos_blitzer',     name: '混沌の電撃獣',       hp: 7600,  maxHp: 7600,  attack: 400, defense: 130, speed: 32, expReward: 5600, goldReward: 2200, isBoss: false, element: 'fire', floorMin: 5,  floorMax: 40 ,
    drops: [
      { itemId: 'assassin_feather', chance: 0.05 },
    ]},
    { id: 'void_prophet',      name: '虚無の預言者',       hp: 6800,  maxHp: 6800,  attack: 392, defense: 128, speed: 26, expReward: 5750, goldReward: 2300, isBoss: false, element: 'dark', floorMin: 18, floorMax: 50 ,
    drops: [
      { itemId: 'manafont_staff', chance: 0.05 },
    ]},
    { id: 'catastrophe_core',  name: '災厄の核',           hp: 9800,  maxHp: 9800,  attack: 340, defense: 210, speed: 20, expReward: 6100, goldReward: 2450, isBoss: false, element: 'fire', floorMin: 35, floorMax: 50 ,
    drops: [
      { itemId: 'guardian_talisman', chance: 0.05 },
    ]},
    // ── 進化系・新型 ──
    { id: 'chaos_imp',          name: '混沌の小悪魔',       hp: 4800,  maxHp: 4800,  attack: 270, defense: 125, speed: 24, expReward: 3800, goldReward: 1520, isBoss: false, element: 'dark', floorMin: 1,  floorMax: 18,
    drops: [{ itemId: 'blooddrinker', chance: 0.03 }]},
    { id: 'chaos_archon',       name: '混沌のアーコン',     hp: 9100,  maxHp: 9100,  attack: 475, defense: 224, speed: 24, expReward: 7000, goldReward: 2800, isBoss: false, element: 'dark', floorMin: 15, floorMax: 38, maxMp: 65,
    skills: [
      { id: 'ca_chaos_flame', name: '混沌の炎', mpCost: 38, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_all', power: 1.4, element: 'dark' } },
    ],
    drops: [{ itemId: 'blooddrinker', chance: 0.04 }]},
    { id: 'supreme_demon',      name: '至高の悪魔',         hp: 12500, maxHp: 12500, attack: 618, defense: 292, speed: 24, expReward: 9500, goldReward: 3800, isBoss: false, element: 'dark', floorMin: 30, floorMax: 50, maxMp: 80,
    skills: [
      { id: 'sd_chaos_collapse', name: '混沌の崩壊', mpCost: 48, cooldownMs: 28000, condition: 'always',
        effect: { type: 'attack_all', power: 1.7, element: 'dark' } },
    ],
    drops: [{ itemId: 'soul_reaper', chance: 0.04 }]},
    { id: 'abyssal_titan',      name: '深淵のタイタン',     hp: 14000, maxHp: 14000, attack: 396, defense: 290, speed: 14, expReward: 7700, goldReward: 3080, isBoss: false, element: 'dark', floorMin: 22, floorMax: 48, maxMp: 65,
    skills: [
      { id: 'abt_void_crush', name: '虚無の圧潰', mpCost: 40, cooldownMs: 26000, condition: 'always',
        effect: { type: 'attack_all', power: 1.3, element: 'dark' } },
    ],
    drops: [{ itemId: 'bloodiron_armor', chance: 0.04 }]},
    { id: 'true_void_titan',    name: '真・虚無の巨人',     hp: 19000, maxHp: 19000, attack: 514, defense: 376, speed: 12, expReward: 11000, goldReward: 4400, isBoss: false, element: 'dark', floorMin: 38, floorMax: 50, maxMp: 80,
    skills: [
      { id: 'tvt_world_end', name: '世界消滅', mpCost: 50, cooldownMs: 32000, condition: 'always',
        effect: { type: 'attack_all', power: 1.6, element: 'dark' } },
    ],
    drops: [{ itemId: 'chaos_armor', chance: 0.04 }]},
    { id: 'inferno_phoenix',    name: 'インフェルノフェニックス', hp: 7000, maxHp: 7000, attack: 528, defense: 158, speed: 26, expReward: 7300, goldReward: 2920, isBoss: false, element: 'fire', floorMin: 18, floorMax: 42, maxMp: 65,
    skills: [
      { id: 'ip_immortal_flame', name: '不死鳥の炎', mpCost: 38, cooldownMs: 24000, condition: 'always',
        effect: { type: 'attack_all', power: 1.5, element: 'fire' } },
    ],
    drops: [{ itemId: 'phoenix_mail', chance: 0.04 }]},
    { id: 'eternal_phoenix',    name: '永遠のフェニックス', hp: 9500,  maxHp: 9500,  attack: 686, defense: 205, speed: 26, expReward: 10000, goldReward: 4000, isBoss: false, element: 'fire', floorMin: 35, floorMax: 50, maxMp: 80,
    skills: [
      { id: 'ep_end_inferno', name: '終焉の業火', mpCost: 50, cooldownMs: 30000, condition: 'always',
        effect: { type: 'attack_all', power: 1.8, element: 'fire' } },
    ],
    drops: [{ itemId: 'phoenix_mail', chance: 0.05 }]},
    { id: 'elder_abyss_dragon', name: '長老深淵竜',         hp: 15500, maxHp: 15500, attack: 435, defense: 318, speed: 12, expReward: 8500, goldReward: 3400, isBoss: false, element: 'dark', floorMin: 35, floorMax: 50, maxMp: 70,
    skills: [
      { id: 'ead_abyss_flame', name: '深淵の竜炎', mpCost: 45, cooldownMs: 28000, condition: 'always',
        effect: { type: 'attack_all', power: 1.4, element: 'dark' } },
    ],
    drops: [{ itemId: 'dragon_fang', chance: 0.04 }]},
    { id: 'void_blitzer',       name: 'ヴォイドブリッツァー', hp: 10640, maxHp: 10640, attack: 528, defense: 172, speed: 32, expReward: 7800, goldReward: 3120, isBoss: false, element: 'dark', floorMin: 20, floorMax: 45, maxMp: 65,
    skills: [
      { id: 'vb_hyper_charge', name: '超高速突撃', mpCost: 38, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_single', power: 2.0 } },
    ],
    drops: [{ itemId: 'assassin_feather', chance: 0.04 }]},
    { id: 'void_archprophet',   name: '虚無の大預言者',     hp: 9520,  maxHp: 9520,  attack: 518, defense: 168, speed: 26, expReward: 8000, goldReward: 3200, isBoss: false, element: 'dark', floorMin: 30, floorMax: 50, maxMp: 70,
    skills: [
      { id: 'vap_prophecy_judge', name: '預言の裁き', mpCost: 45, cooldownMs: 28000, condition: 'always',
        effect: { type: 'attack_all', power: 1.6, element: 'dark' } },
    ],
    drops: [{ itemId: 'manafont_staff', chance: 0.04 }]},
    { id: 'omega_catastrophe',  name: 'オメガカタストロフィー', hp: 13720, maxHp: 13720, attack: 449, defense: 277, speed: 18, expReward: 8800, goldReward: 3520, isBoss: false, element: 'fire', floorMin: 42, floorMax: 50, maxMp: 70,
    skills: [
      { id: 'oc_mega_catastrophe', name: '大災厄爆発', mpCost: 45, cooldownMs: 28000, condition: 'always',
        effect: { type: 'attack_all', power: 1.5, element: 'fire' } },
    ],
    drops: [{ itemId: 'guardian_talisman', chance: 0.04 }]},
    { id: 'chaos_golem',        name: '混沌ゴーレム',       hp: 7800,  maxHp: 7800,  attack: 320, defense: 210, speed: 16, expReward: 4500, goldReward: 1800, isBoss: false, floorMin: 8,  floorMax: 30,
    drops: [{ itemId: 'bloodiron_armor', chance: 0.03 }]},
    { id: 'rift_specter',       name: 'リフトスペクター',   hp: 6200,  maxHp: 6200,  attack: 420, defense: 155, speed: 28, expReward: 5000, goldReward: 2000, isBoss: false, element: 'dark', floorMin: 12, floorMax: 38,
    drops: [{ itemId: 'eclipse_scythe', chance: 0.03 }]},
    { id: 'void_beast_chaos',   name: 'ヴォイドビースト',   hp: 8500,  maxHp: 8500,  attack: 368, defense: 195, speed: 22, expReward: 5500, goldReward: 2200, isBoss: false, element: 'dark', floorMin: 18, floorMax: 45,
    drops: [{ itemId: 'bloodiron_armor', chance: 0.03 }]},
    { id: 'chaos_specter',      name: '混沌の亡霊',         hp: 7000,  maxHp: 7000,  attack: 445, defense: 162, speed: 26, expReward: 6000, goldReward: 2400, isBoss: false, element: 'dark', floorMin: 25, floorMax: 48,
    debuffOnHit: { type: 'seal_atk', chance: 0.20 },
    drops: [{ itemId: 'nightveil_robe', chance: 0.03 }]},
    { id: 'abyss_colossus',     name: '深淵のコロッサス',   hp: 12000, maxHp: 12000, attack: 360, defense: 270, speed: 14, expReward: 8000, goldReward: 3200, isBoss: false, element: 'dark', floorMin: 35, floorMax: 50, maxMp: 60,
    skills: [
      { id: 'ac_abyss_crush', name: '深淵粉砕', mpCost: 38, cooldownMs: 28000, condition: 'always',
        effect: { type: 'attack_all', power: 1.3, element: 'dark' } },
    ],
    drops: [{ itemId: 'bloodiron_armor', chance: 0.04 }]},
  ],
}

// ダンジョンIDごとのボス
export const BOSS_DATA: Record<string, Enemy> = {
  goblin_cave: {
    id: 'goblin_king', name: 'ゴブリンキング',
    hp: 280, maxHp: 280, attack: 25, defense: 10, speed: 22,
    expReward: 120, goldReward: 60, isBoss: true,
    statusResist: { stagger: 0.30, bind: 0.20 },
    drops: [
      { itemId: 'iron_sword', chance: 0.35 },
      { itemId: 'leather_armor', chance: 0.4 },
    ]},
  ancient_ruins: {
    id: 'lich', name: 'リッチ',
    hp: 1200, maxHp: 1200, attack: 100, defense: 30, speed: 18,
    maxMp: 80,
    expReward: 400, goldReward: 200, isBoss: true, element: 'dark',
    debuffOnHit: { type: 'seal_atk', chance: 0.25 },
    skills: [
      { id: 'lich_dark_blast', name: '冥府の魔弾', mpCost: 20, cooldownMs: 12000, condition: 'always',
        effect: { type: 'attack_single', power: 1.8, element: 'dark' } },
      { id: 'lich_curse_wave', name: '呪いの波動', mpCost: 25, cooldownMs: 20000, condition: 'hp_below_50',
        effect: { type: 'debuff_all', debuff: 'seal_atk', debuffChance: 0.80 } },
    ],
    statusResist: { stagger: 0.50, bind: 0.40, poison: 0.30 },
    drops: [
      { itemId: 'grave_robe', chance: 0.35 },
      { itemId: 'void_locket', chance: 0.2 },
    ]},
  dark_forest: {
    id: 'forest_guardian', name: 'フォレストガーディアン',
    hp: 2500, maxHp: 2500, attack: 150, defense: 55, speed: 20,
    maxMp: 100,
    expReward: 700, goldReward: 350, isBoss: true,
    debuffOnHit: { type: 'bind', chance: 0.30 },
    skills: [
      { id: 'fguard_vine_bind', name: '蔦の拘束', mpCost: 20, cooldownMs: 14000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'bind', debuffChance: 0.80 } },
      { id: 'fguard_nature_wrath', name: '大自然の怒り', mpCost: 35, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_all', power: 1.4 } },
    ],
    statusResist: { poison: 0.50, seal_atk: 0.40, stagger: 0.40 },
    drops: [
      { itemId: 'windstep_armor', chance: 0.35 },
      { itemId: 'guardian_talisman', chance: 0.3 },
    ]},
  dragon_lair: {
    id: 'ancient_dragon', name: '古代竜',
    hp: 6000, maxHp: 6000, attack: 220, defense: 100, speed: 20,
    maxMp: 120,
    expReward: 1500, goldReward: 750, isBoss: true, element: 'fire',
    debuffOnHit: { type: 'seal_def', chance: 0.20 },
    skills: [
      { id: 'adragon_flame_breath', name: '竜炎ブレス', mpCost: 35, cooldownMs: 18000, condition: 'always',
        effect: { type: 'attack_all', power: 1.5, element: 'fire' } },
      { id: 'adragon_regen', name: '鱗の再生', mpCost: 25, cooldownMs: 25000, condition: 'hp_below_50',
        effect: { type: 'heal_self', healRate: 0.06 } },
    ],
    statusResist: { poison: 0.60, stagger: 0.50, bind: 0.50, seal_def: 0.30 },
    drops: [
      { itemId: 'dragon_scale', chance: 0.5 },
      { itemId: 'inferno_blade', chance: 0.25 },
      { itemId: 'phoenix_mail', chance: 0.2 },
    ]},
  abyss_labyrinth: {
    id: 'abyss_lord', name: '奈落の覇王',
    hp: 12000, maxHp: 12000, attack: 350, defense: 150, speed: 22,
    maxMp: 150,
    expReward: 3000, goldReward: 1500, isBoss: true, element: 'dark',
    debuffOnHit: { type: 'seal_atk', chance: 0.35 },
    skills: [
      { id: 'alord_abyss_roar', name: '奈落の咆哮', mpCost: 30, cooldownMs: 16000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_def', debuffChance: 0.90 } },
      { id: 'alord_void_slash', name: '虚空斬', mpCost: 40, cooldownMs: 22000, condition: 'always',
        effect: { type: 'attack_all', power: 1.4, element: 'dark' } },
    ],
    statusResist: { stagger: 0.60, bind: 0.50, seal_atk: 0.50, poison: 0.40 },
    drops: [
      { itemId: 'void_scythe_edge', chance: 0.4 },
      { itemId: 'void_locket', chance: 0.25 },
      { itemId: 'reaper_scythe', chance: 0.2 },
    ]},
  abyss_tower: {
    id: 'abyss_overlord', name: '深淵の支配者',
    hp: 25000, maxHp: 25000, attack: 520, defense: 220, speed: 20,
    maxMp: 200,
    expReward: 15000, goldReward: 3000, isBoss: true, element: 'dark',
    debuffOnHit: { type: 'bind', chance: 0.35 },
    skills: [
      { id: 'aoverlord_dark_wave', name: '暗黒波動', mpCost: 40, cooldownMs: 18000, condition: 'always',
        effect: { type: 'attack_all', power: 1.5, element: 'dark' } },
      { id: 'aoverlord_total_seal', name: '全封印', mpCost: 45, cooldownMs: 25000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_atk', debuffChance: 0.90 } },
      { id: 'aoverlord_regen', name: '深淵の再生', mpCost: 35, cooldownMs: 30000, condition: 'hp_below_50',
        effect: { type: 'heal_self', healRate: 0.07 } },
    ],
    statusResist: { poison: 0.60, stagger: 0.70, bind: 0.60, seal_atk: 0.50, seal_def: 0.50 },
    drops: [
      { itemId: 'nightveil_robe', chance: 0.4 },
      { itemId: 'void_aegis', chance: 0.25 },
      { itemId: 'starfall_staff', chance: 0.2 },
    ]},
  sacred_ruins: {
    id: 'sacred_sovereign', name: '聖域の君主',
    hp: 20000, maxHp: 20000, attack: 450, defense: 180, speed: 22,
    maxMp: 180,
    expReward: 25000, goldReward: 5000, isBoss: true, element: 'light',
    debuffOnHit: { type: 'seal_def', chance: 0.30 },
    skills: [
      { id: 'ssov_sacred_radiance', name: '聖域の光', mpCost: 40, cooldownMs: 18000, condition: 'always',
        effect: { type: 'attack_all', power: 1.4, element: 'light' } },
      { id: 'ssov_divine_judgment', name: '神聖な裁き', mpCost: 45, cooldownMs: 25000, condition: 'always',
        effect: { type: 'attack_single', power: 2.0, element: 'light' } },
      { id: 'ssov_sacred_seal', name: '封聖の術', mpCost: 30, cooldownMs: 20000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_def', debuffChance: 0.80 } },
    ],
    statusResist: { poison: 0.70, stagger: 0.70, bind: 0.70, seal_atk: 0.60, seal_def: 0.60 },
    drops: [
      { itemId: 'hallowed_mail', chance: 0.45 },
      { itemId: 'angel_feather', chance: 0.25 },
      { itemId: 'holy_grail', chance: 0.2 },
    ]},
  eternal_sanctum: {
    id: 'eternal_god', name: '永遠神',
    hp: 40000, maxHp: 40000, attack: 580, defense: 250, speed: 20,
    maxMp: 250,
    expReward: 50000, goldReward: 10000, isBoss: true, element: 'light',
    debuffOnHit: { type: 'bind', chance: 0.40 },
    skills: [
      { id: 'egod_eternal_flame', name: '永遠の焔', mpCost: 45, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_all', power: 1.3, element: 'light' } },
      { id: 'egod_time_stop', name: '時間停止', mpCost: 40, cooldownMs: 28000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'bind', debuffChance: 1.0 } },
      { id: 'egod_divine_breath', name: '神の息吹', mpCost: 45, cooldownMs: 32000, condition: 'hp_below_50',
        effect: { type: 'heal_self', healRate: 0.06 } },
      { id: 'egod_erasure', name: '存在消去の一撃', mpCost: 60, cooldownMs: 40000, condition: 'always',
        effect: { type: 'attack_single', power: 2.0, element: 'light' } },
    ],
    statusResist: { poison: 0.80, stagger: 0.80, bind: 0.80, seal_atk: 0.70, seal_def: 0.70 },
    drops: [
      { itemId: 'aeon_crown', chance: 0.35 },
      { itemId: 'celestial_bow', chance: 0.25 },
      { itemId: 'angel_feather', chance: 0.3 },
    ]},
  trial_colosseum: {
    id: 'colosseum_champion', name: '闘技場の覇者',
    hp: 15000, maxHp: 15000, attack: 550, defense: 180, speed: 25,
    maxMp: 150,
    expReward: 20000, goldReward: 6000, isBoss: true,
    debuffOnHit: { type: 'seal_atk', chance: 0.25 },
    skills: [
      { id: 'colchamp_finisher', name: '闘士の必殺', mpCost: 35, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_single', power: 2.0 } },
      { id: 'colchamp_rage', name: '怒りの波動', mpCost: 30, cooldownMs: 18000, condition: 'hp_below_50',
        effect: { type: 'debuff_all', debuff: 'seal_def', debuffChance: 0.80 } },
    ],
    statusResist: { poison: 0.50, stagger: 0.60, bind: 0.50, seal_atk: 0.40 },
    drops: [
      { itemId: 'worldrend_greatsword', chance: 0.25 },
      { itemId: 'godspeed_dagger', chance: 0.25 },
      { itemId: 'titan_fist', chance: 0.25 },
    ]},
  chaos_trial: {
    id: 'chaos_god', name: '混沌神',
    hp: 70000, maxHp: 70000, attack: 580, defense: 280, speed: 22,
    maxMp: 500,
    expReward: 100000, goldReward: 50000, isBoss: true, element: 'dark',
    debuffOnHit: { type: 'seal_atk', chance: 0.30 },
    skills: [
      { id: 'cgod_chaos_wave', name: '混沌の波動', mpCost: 60, cooldownMs: 20000, condition: 'always',
        effect: { type: 'attack_all', power: 1.0, element: 'dark' } },
      { id: 'cgod_erasure', name: '存在消去', mpCost: 80, cooldownMs: 30000, condition: 'always',
        effect: { type: 'attack_single', power: 1.4, element: 'dark' } },
      { id: 'cgod_regen', name: '混沌の再生', mpCost: 70, cooldownMs: 35000, condition: 'hp_below_50',
        effect: { type: 'heal_self', healRate: 0.06 } },
      { id: 'cgod_all_seal', name: '全封印', mpCost: 90, cooldownMs: 40000, condition: 'always',
        effect: { type: 'debuff_all', debuff: 'seal_atk', debuffChance: 0.70 } },
    ],
    statusResist: { poison: 0.90, stagger: 0.90, bind: 0.90, seal_atk: 0.80, seal_def: 0.80 },
    drops: [
      { itemId: 'chaos_sword', chance: 0.3 },
      { itemId: 'chaos_staff', chance: 0.3 },
      { itemId: 'chaos_bow', chance: 0.3 },
      { itemId: 'chaos_armor', chance: 0.35 },
      { itemId: 'chaos_amulet', chance: 0.35 },
    ]},
}

// 敵をN体ランダムに選ぶ（フロア番号で出現範囲を絞る）
export function pickEnemies(dungeonId: string, count: number, floorNumber: number = 1): Enemy[] {
  const pool = ENEMY_POOL[dungeonId] ?? []
  let eligible = pool.filter((e) =>
    floorNumber >= (e.floorMin ?? 1) && floorNumber <= (e.floorMax ?? Infinity)
  )
  if (eligible.length === 0) eligible = pool  // フォールバック
  const result: Enemy[] = []
  for (let i = 0; i < count; i++) {
    const base = eligible[Math.floor(Math.random() * eligible.length)]
    result.push({ ...base, id: `${base.id}_${i}` })
  }
  return result
}

// 守護者（ミニボス）: フロアに出現可能な敵から1.4倍強化
export function pickMilestoneEnemies(dungeonId: string, floorNumber: number = 1): Enemy[] {
  const pool = ENEMY_POOL[dungeonId] ?? []
  let eligible = pool.filter((e) =>
    floorNumber >= (e.floorMin ?? 1) && floorNumber <= (e.floorMax ?? Infinity)
  )
  if (eligible.length === 0) eligible = pool
  const base = eligible[Math.floor(Math.random() * eligible.length)]
  return [{
    ...base,
    id: `${base.id}_guardian`,
    name: `${base.name}の守護者`,
    hp:      Math.round(base.hp      * 1.4),
    maxHp:   Math.round(base.maxHp   * 1.4),
    attack:  Math.round(base.attack  * 1.4),
    defense: Math.round(base.defense * 1.4),
    expReward: Math.round(base.expReward * 2),
    goldReward: Math.round(base.goldReward * 2),
    statusResist: { stagger: 0.30, bind: 0.20 },
  }]
}
