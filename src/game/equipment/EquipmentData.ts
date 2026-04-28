import type { Equipment, WeaponTag, ArmorTag, CharacterClass, Character, ElementType } from '../../types'

export const EQUIPMENT_MASTER: Equipment[] = [
  // 武器 tier1
  { id: 'iron_sword',    name: '鉄の剣',         slot: 'weapon',    weaponTag: 'sword',  attackBonus: 5,  defenseBonus: 0,  hpBonus: 0,  description: '頑丈な鉄剣', spriteCoord: { col: 1, row: 0 } },
  { id: 'holy_mace',     name: '聖なる鎚',        slot: 'weapon',    weaponTag: 'mace',   attackBonus: 4,  defenseBonus: 0,  hpBonus: 10, description: '神聖な力が宿る鎚', spriteCoord: { col: 5, row: 0 } },
  // 防具 tier1
  { id: 'leather_armor', name: '革の鎧',          slot: 'armor',     armorTag: 'light',   attackBonus: 0,  defenseBonus: 5,  hpBonus: 10, description: '軽い革製の鎧', spriteCoord: { col: 5, row: 0 } },
  // アクセサリ tier1（制限なし）
  { id: 'power_ring',    name: '力の指輪',        slot: 'accessory',                      attackBonus: 3,  defenseBonus: 0,  hpBonus: 0,  description: '攻撃力が上がる指輪', spriteCoord: { col: 0, row: 8 } },
  { id: 'iron_shield',   name: '鉄の盾',          slot: 'accessory',                      attackBonus: 0,  defenseBonus: 6,  hpBonus: 5,  description: '防御力が上がる小盾', spriteCoord: { col: 9, row: 4 } },

  // 武器 tier1 (弓)
  { id: 'short_bow',     name: '短弓',             slot: 'weapon',    weaponTag: 'bow',    attackBonus: 6,  defenseBonus: 0,  hpBonus: 0,  description: '扱いやすい短い弓', spriteCoord: { col: 1, row: 8 } },

  // 武器 tier2
  { id: 'magic_staff',   name: '魔法の杖',        slot: 'weapon',    weaponTag: 'staff',  attackBonus: 8,  defenseBonus: 0,  hpBonus: 0,  description: '魔力が込められた杖', spriteCoord: { col: 2, row: 6 } },
  { id: 'swift_dagger',  name: '俊敏の短剣',      slot: 'weapon',    weaponTag: 'dagger', attackBonus: 6,  defenseBonus: 0,  hpBonus: 0,  description: '素早い攻撃ができる短剣', spriteCoord: { col: 1, row: 4 } },
  { id: 'long_bow',      name: '長弓',             slot: 'weapon',    weaponTag: 'bow',    attackBonus: 10, defenseBonus: 0,  hpBonus: 0,  description: '遠くまで届く長弓', spriteCoord: { col: 3, row: 8 } },
  // 防具 tier2
  { id: 'chain_mail',    name: 'チェインメイル',  slot: 'armor',     armorTag: 'heavy',   attackBonus: 0,  defenseBonus: 8,  hpBonus: 20, description: '鎖で編んだ頑丈な鎧', spriteCoord: { col: 0, row: 0 } },
  { id: 'robe_of_mana',  name: 'マナのローブ',    slot: 'armor',     armorTag: 'robe',    attackBonus: 3,  defenseBonus: 3,  hpBonus: 0,  description: '魔力を高める魔法のローブ', spriteCoord: { col: 0, row: 5 } },
  // アクセサリ tier2（制限なし）
  { id: 'vitality_amulet', name: '生命力のお守り', slot: 'accessory',                     attackBonus: 0,  defenseBonus: 0,  hpBonus: 30, description: 'HPが大きく上がるお守り', spriteCoord: { col: 9, row: 9 } },

  // 武器 tier1 (拳)
  { id: 'iron_knuckle',  name: '鉄の拳帯',        slot: 'weapon',    weaponTag: 'fist',   attackBonus: 5,  defenseBonus: 0,  hpBonus: 0,  speedBonus: 3,  description: '動きを軽くする拳帯', spriteCoord: { col: 1, row: 2 } },

  // アクセサリ tier1 (靴)
  { id: 'leather_boots', name: '革の軽靴',        slot: 'accessory',                      attackBonus: 0,  defenseBonus: 0,  hpBonus: 0,  speedBonus: 4,  description: '足取りを軽くする革靴' },

  // 武器 tier2 (拳)
  { id: 'monks_fist',    name: '修羅の拳帯',      slot: 'weapon',    weaponTag: 'fist',   attackBonus: 9,  defenseBonus: 0,  hpBonus: 0,  speedBonus: 6,  description: '武術の真髄を宿す拳帯', spriteCoord: { col: 3, row: 2 } },
  // アクセサリ tier2 (靴)
  { id: 'wind_boots',    name: '風の靴',          slot: 'accessory',                      attackBonus: 0,  defenseBonus: 0,  hpBonus: 0,  speedBonus: 9,  description: '風を纏うかのような軽さの靴' },

  // 武器 tier3
  { id: 'dragon_fang',   name: '竜牙の剣',        slot: 'weapon',    weaponTag: 'sword',  attackBonus: 15, defenseBonus: 0,  hpBonus: 0,  description: '竜の牙から作られた剣', spriteCoord: { col: 7, row: 0 } },
  { id: 'ancient_staff', name: '古代の杖',        slot: 'weapon',    weaponTag: 'staff',  attackBonus: 18, defenseBonus: 0,  hpBonus: 0,  description: '古代魔法が封じられた杖', spriteCoord: { col: 8, row: 6 } },
  { id: 'elven_bow',     name: 'エルフの弓',      slot: 'weapon',    weaponTag: 'bow',    attackBonus: 20, defenseBonus: 0,  hpBonus: 0,  description: 'エルフの技術で作られた弓', spriteCoord: { col: 6, row: 8 } },
  // 武器 tier3 (拳)
  { id: 'dragon_claw',   name: '龍爪の拳帯',      slot: 'weapon',    weaponTag: 'fist',   attackBonus: 16, defenseBonus: 0,  hpBonus: 0,  speedBonus: 12, description: '龍の爪を模した最強の拳帯', spriteCoord: { col: 3, row: 6 } },
  // 防具 tier3
  { id: 'dragon_scale',  name: '竜鱗の鎧',        slot: 'armor',     armorTag: 'heavy',   attackBonus: 0,  defenseBonus: 18, hpBonus: 40, description: '竜の鱗で作られた鎧', spriteCoord: { col: 2, row: 0 } },
  // アクセサリ tier3 (靴)
  { id: 'gale_boots',    name: '疾風の靴',        slot: 'accessory',                      attackBonus: 0,  defenseBonus: 0,  hpBonus: 0,  speedBonus: 18, description: '疾風のごとく駆ける魔法の靴' },
  // アクセサリ tier3（制限なし）
  { id: 'dragon_amulet', name: '竜のお守り',      slot: 'accessory',                      attackBonus: 5,  defenseBonus: 5,  hpBonus: 50, description: '竜の加護を受けるお守り', spriteCoord: { col: 9, row: 4 } },

  // 武器 tier4（混沌の試練・ボス専用ドロップ）
  { id: 'chaos_sword',   name: '混沌の剣',        slot: 'weapon',    weaponTag: 'sword',  attackBonus: 30, defenseBonus: 0,  hpBonus: 0,  description: '混沌の力が宿る最強の剣',  bossOnly: true, spriteCoord: { col: 8, row: 1 } },
  { id: 'chaos_staff',   name: '混沌の杖',        slot: 'weapon',    weaponTag: 'staff',  attackBonus: 35, defenseBonus: 0,  hpBonus: 0,  description: '混沌の魔力が封じられた杖', bossOnly: true, spriteCoord: { col: 8, row: 7 } },
  { id: 'chaos_bow',     name: '混沌の弓',        slot: 'weapon',    weaponTag: 'bow',    attackBonus: 32, defenseBonus: 0,  hpBonus: 0,  description: '混沌の矢を放つ最強の弓',  bossOnly: true, spriteCoord: { col: 7, row: 9 } },
  { id: 'chaos_blade',   name: '混沌の短剣',      slot: 'weapon',    weaponTag: 'dagger', attackBonus: 28, defenseBonus: 0,  hpBonus: 0,  speedBonus: 15, description: '混沌の力を宿す短剣', bossOnly: true, spriteCoord: { col: 7, row: 5 } },
  { id: 'chaos_fist',    name: '混沌の拳帯',      slot: 'weapon',    weaponTag: 'fist',   attackBonus: 26, defenseBonus: 0,  hpBonus: 0,  speedBonus: 20, description: '混沌の力が宿る拳帯', bossOnly: true, spriteCoord: { col: 3, row: 3 } },
  { id: 'chaos_scythe',  name: '混沌の大鎌',      slot: 'weapon',    weaponTag: 'scythe', attackBonus: 38, defenseBonus: 0,  hpBonus: 0,  description: '魂を刈り取る混沌の鎌',  bossOnly: true, spriteCoord: { col: 7, row: 9 } },
  { id: 'chaos_greatsword', name: '混沌の大剣',   slot: 'weapon',    weaponTag: 'greatsword', attackBonus: 40, defenseBonus: 0, hpBonus: 0, description: '全てを断つ混沌の大剣', bossOnly: true, spriteCoord: { col: 9, row: 3 } },
  // 防具 tier4（混沌の試練・ボス専用ドロップ）
  { id: 'chaos_armor',   name: '混沌の重鎧',      slot: 'armor',     armorTag: 'heavy',   attackBonus: 0,  defenseBonus: 35, hpBonus: 80, description: '混沌の力が宿る最強の鎧',  bossOnly: true, spriteCoord: { col: 4, row: 4 } },
  { id: 'chaos_robe',    name: '混沌のローブ',    slot: 'armor',     armorTag: 'robe',    attackBonus: 10, defenseBonus: 20, hpBonus: 60, description: '混沌の魔力が宿るローブ', bossOnly: true, spriteCoord: { col: 4, row: 9 } },
  { id: 'chaos_leather', name: '混沌の軽鎧',      slot: 'armor',     armorTag: 'light',   attackBonus: 5,  defenseBonus: 28, hpBonus: 70, description: '混沌の力を纏う軽鎧',    bossOnly: true, spriteCoord: { col: 9, row: 4 } },
  // アクセサリ tier4（混沌の試練・ボス専用ドロップ）
  { id: 'chaos_ring',    name: '混沌の指輪',      slot: 'accessory',                      attackBonus: 15, defenseBonus: 0,  hpBonus: 0,  description: '圧倒的な攻撃力をもたらす指輪', bossOnly: true, spriteCoord: { col: 8, row: 9 } },
  { id: 'chaos_amulet',  name: '混沌のお守り',    slot: 'accessory',                      attackBonus: 8,  defenseBonus: 8,  hpBonus: 100, description: '混沌神の加護が宿るお守り', bossOnly: true, spriteCoord: { col: 9, row: 9 } },
  { id: 'chaos_boots',   name: '混沌の靴',        slot: 'accessory',                      attackBonus: 0,  defenseBonus: 0,  hpBonus: 0,  speedBonus: 25, description: '混沌の速さで駆ける靴', bossOnly: true },

  // ===== 特殊効果装備（属性・特殊効果の実装サンプル） =====
  // 属性武器
  { id: 'flame_blade',      name: '炎龍の聖剣',    slot: 'weapon',    weaponTag: 'sword',  attackBonus: 18, defenseBonus: 0, hpBonus: 0,
    element: 'fire',
    specialEffects: [{ type: 'element_boost', value: 0.5, element: 'fire' }],
    description: '炎龍の牙から鍛えた剣。炎属性を持ち、炎スキルの威力+50%', spriteCoord: { col: 1, row: 1 } },

  { id: 'frost_staff',      name: '氷晶の杖',      slot: 'weapon',    weaponTag: 'staff',  attackBonus: 20, defenseBonus: 0, hpBonus: 0,
    element: 'ice',
    specialEffects: [{ type: 'element_boost', value: 0.5, element: 'ice' }],
    description: '永久凍土の魔力が宿る杖。氷属性を持ち、氷スキルの威力+50%', spriteCoord: { col: 0, row: 7 } },

  // 特殊効果装備（回復極ぶり）
  { id: 'saints_mantle',    name: '聖者のマント',  slot: 'armor',     armorTag: 'holy_armor', attackBonus: 0,  defenseBonus: 8, hpBonus: 20,
    specialEffects: [{ type: 'mp_cost_ratio', value: 0.1 }, { type: 'healing_boost', value: 0.8 }],
    description: 'ATKは上がらないが、MPの消費を1/10にし、回復量を+80%にする。回復特化装備', spriteCoord: { col: 5, row: 5 } },

  // 特殊効果装備（吸血）
  { id: 'soul_reaper',      name: '魂喰いの大鎌',  slot: 'weapon',    weaponTag: 'scythe', attackBonus: 22, defenseBonus: 0, hpBonus: 0,
    element: 'dark',
    specialEffects: [{ type: 'lifesteal', value: 0.20 }],
    description: '魂を刈り取る闇の大鎌。与えたダメージの20%をHP回復する', spriteCoord: { col: 6, row: 4 } },

  // 特殊効果装備（瀕死強化）
  { id: 'berserk_knuckle',  name: '命懸けの拳帯',  slot: 'weapon',    weaponTag: 'fist',   attackBonus: 8,  defenseBonus: 0, hpBonus: 0,
    specialEffects: [{ type: 'last_stand', value: 2.0 }, { type: 'crit_chance', value: 0.15 }],
    description: 'HP25%以下でATKが+200%、会心率が+15%上昇する超ピーキーな拳帯', spriteCoord: { col: 2, row: 3 } },

  // 特殊効果装備（MP自動回復）
  { id: 'sages_robe',       name: '賢者のローブ',  slot: 'armor',     armorTag: 'robe',    attackBonus: 6,  defenseBonus: 3, hpBonus: 0,
    specialEffects: [{ type: 'mp_cost_ratio', value: 0.5 }, { type: 'mp_regen', value: 0.05 }],
    description: 'MP消費を半分にし、毎行動MaxMPの5%を自動回復する。長期戦に強い', spriteCoord: { col: 2, row: 5 } },

  // 特殊効果装備（属性耐性）
  { id: 'flame_guard',      name: '炎耐性の盾',    slot: 'accessory',                      attackBonus: 0,  defenseBonus: 5, hpBonus: 0,
    elementResist: { fire: 0.50 },
    description: '火属性ダメージを50%軽減する盾。溶岩地帯の探索者に愛用される' },

  { id: 'void_aegis',       name: '虚無の大盾',    slot: 'accessory',                      attackBonus: 0,  defenseBonus: 15, hpBonus: 50,
    elementResist: { dark: 0.60, light: 0.60 },
    specialEffects: [{ type: 'auto_revive' }],
    description: '光と闇を60%軽減し、1戦闘中1回だけ戦闘不能を防いでHP1で復帰する究極の盾', bossOnly: true },

  // ===== 追加装備（Tier1〜3 武器）=====
  // Tier1 武器（基本武器）
  { id: 'copper_sword',      name: '銅の剣',           slot: 'weapon', weaponTag: 'sword',      attackBonus: 4,  defenseBonus: 0, hpBonus: 0,  description: '鍛え始めの冒険者向けの軽い剣', spriteCoord: { col: 0, row: 0 } },
  { id: 'iron_greatsword',   name: '鉄の大剣',         slot: 'weapon', weaponTag: 'greatsword', attackBonus: 7,  defenseBonus: 0, hpBonus: 0,  description: '重さを活かした一撃が頼もしい鉄の大剣', spriteCoord: { col: 0, row: 2 } },
  { id: 'bronze_greatsword', name: '青銅の大剣',       slot: 'weapon', weaponTag: 'greatsword', attackBonus: 6,  defenseBonus: 0, hpBonus: 0,  description: '青銅を打ち込んだ重い大剣', spriteCoord: { col: 1, row: 2 } },
  { id: 'thief_knife',       name: '盗賊のナイフ',     slot: 'weapon', weaponTag: 'dagger',     attackBonus: 4,  defenseBonus: 0, hpBonus: 0,  description: '素早い攻撃に優れた細身の短剣', spriteCoord: { col: 0, row: 4 } },
  { id: 'apprentice_staff',  name: '見習いの杖',       slot: 'weapon', weaponTag: 'staff',      attackBonus: 5,  defenseBonus: 0, hpBonus: 0,  description: '魔力の通り道として作られた杖', spriteCoord: { col: 0, row: 6 } },
  { id: 'hunter_bow',        name: '狩人の弓',         slot: 'weapon', weaponTag: 'bow',        attackBonus: 5,  defenseBonus: 0, hpBonus: 0,  description: '森の猟師が愛用する実用弓', spriteCoord: { col: 0, row: 8 } },
  { id: 'oak_mace',          name: '樫のメイス',       slot: 'weapon', weaponTag: 'mace',       attackBonus: 5,  defenseBonus: 0, hpBonus: 4,  description: '頑丈な樫材と金属で作られた鎚', spriteCoord: { col: 0, row: 0 } },
  { id: 'training_gauntlet', name: '練習用の篭手',     slot: 'weapon', weaponTag: 'fist',       attackBonus: 5,  defenseBonus: 0, hpBonus: 0,  speedBonus: 3, description: '修練者の踏み込みを軽く補助する', spriteCoord: { col: 2, row: 0 } },
  { id: 'sun_charm',         name: '陽光の護符',       slot: 'weapon', weaponTag: 'holy',       attackBonus: 4,  defenseBonus: 1, hpBonus: 8,  description: '淡い光を放つ護符。治癒と癒しの力をわずかに高める', spriteCoord: { col: 4, row: 0 } },
  { id: 'bone_scythe',       name: '骨の鎌',           slot: 'weapon', weaponTag: 'scythe',     attackBonus: 5,  defenseBonus: 0, hpBonus: 0,  description: '魔物の骨から削り出した不気味な鎌', spriteCoord: { col: 6, row: 0 } },
  // Tier2 武器（中級武器）
  { id: 'steel_saber',       name: '鋼鉄のサーベル',   slot: 'weapon', weaponTag: 'sword',      attackBonus: 9,  defenseBonus: 0, hpBonus: 0,  description: '鋭い刃と鉄の鞘を持つ剣', spriteCoord: { col: 3, row: 0 } },
  { id: 'steel_greatsword',  name: '鋼の大剣',         slot: 'weapon', weaponTag: 'greatsword', attackBonus: 13, defenseBonus: 0, hpBonus: 0,  description: '鋼を鍛え上げた重厚な大剣。破壊力と耐久性を兼ね備える', spriteCoord: { col: 2, row: 2 } },
  { id: 'warbreaker',        name: '戦砕きの大剣',     slot: 'weapon', weaponTag: 'greatsword', attackBonus: 11, defenseBonus: 0, hpBonus: 10, description: '敵の防御を打ち砕く重量感ある大剣', spriteCoord: { col: 4, row: 2 } },
  { id: 'shadow_dagger',     name: '影縫いの短剣',     slot: 'weapon', weaponTag: 'dagger',     attackBonus: 8,  defenseBonus: 0, hpBonus: 0,  element: 'dark', description: '影を縫う短剣。通常攻撃が闇属性になる', spriteCoord: { col: 3, row: 4 } },
  { id: 'ember_staff',       name: '残火の杖',         slot: 'weapon', weaponTag: 'staff',      attackBonus: 10, defenseBonus: 0, hpBonus: 0,  element: 'fire', description: '火種を宿す杖。通常攻撃に火属性を付与する', spriteCoord: { col: 1, row: 6 } },
  { id: 'storm_bow',         name: '疾風の弓',         slot: 'weapon', weaponTag: 'bow',        attackBonus: 9,  defenseBonus: 0, hpBonus: 0,  description: '強いしなりを持つ長弓。風を裂くような飛距離が可能', spriteCoord: { col: 2, row: 8 } },
  { id: 'pilgrim_mace',      name: '巡礼者の槌',       slot: 'weapon', weaponTag: 'mace',       attackBonus: 8,  defenseBonus: 2, hpBonus: 12, description: '巡礼の道で守りを引き出す武器', spriteCoord: { col: 0, row: 1 } },
  { id: 'crusher_fist',      name: '粉砕の拳',         slot: 'weapon', weaponTag: 'fist',       attackBonus: 10, defenseBonus: 0, hpBonus: 0,  speedBonus: 4, description: '岩をも砕く強力な拳。踏み込みの速さを高める', spriteCoord: { col: 2, row: 1 } },
  { id: 'saint_relic',       name: '聖遺の秘符',       slot: 'weapon', weaponTag: 'holy',       attackBonus: 7,  defenseBonus: 2, hpBonus: 16, element: 'light', description: '聖遺物が封じられた秘符。光属性の通常攻撃を行う', spriteCoord: { col: 4, row: 1 } },
  { id: 'grave_scythe',      name: '墓守の大鎌',       slot: 'weapon', weaponTag: 'scythe',     attackBonus: 10, defenseBonus: 0, hpBonus: 0,  element: 'dark', description: '墓所の気配を帯びた大鎌。闇属性攻撃を行う', spriteCoord: { col: 6, row: 1 } },
  // Tier3 武器（高級・属性武器）
  { id: 'thunderbrand',      name: '雷鳴剣',           slot: 'weapon', weaponTag: 'sword',      attackBonus: 16, defenseBonus: 0, hpBonus: 0,  element: 'thunder', description: '雷神の力を宿した剣。通常攻撃が雷属性になる', spriteCoord: { col: 3, row: 1 } },
  { id: 'frostfang_blade',   name: '氷牙の大剣',       slot: 'weapon', weaponTag: 'greatsword', attackBonus: 18, defenseBonus: 0, hpBonus: 18, element: 'ice', description: '氷刃の核で固められた大剣。冷気を帯びた輝きを放つ', spriteCoord: { col: 4, row: 3 } },
  { id: 'dragon_greatsword', name: '竜鱗の大剣',       slot: 'weapon', weaponTag: 'greatsword', attackBonus: 21, defenseBonus: 0, hpBonus: 20, description: '竜の鱗を埋め込んだ豪奢な大剣。圧倒的な破壊力を誇る', spriteCoord: { col: 9, row: 2 } },
  { id: 'venom_dirk',        name: '毒牙のダーク',     slot: 'weapon', weaponTag: 'dagger',     attackBonus: 15, defenseBonus: 0, hpBonus: 0,  specialEffects: [{ type: 'crit_chance', value: 0.05 }], description: '毒のような鋭い短剣。会心率が5%上昇する', spriteCoord: { col: 6, row: 4 } },
  { id: 'oracle_staff',      name: '神言の杖',         slot: 'weapon', weaponTag: 'staff',      attackBonus: 17, defenseBonus: 0, hpBonus: 10, element: 'light', description: '神の示唆が宿る杖。光属性の通常攻撃を行う', spriteCoord: { col: 5, row: 7 } },
  { id: 'skybreaker_bow',    name: '天穿つ弓',         slot: 'weapon', weaponTag: 'bow',        attackBonus: 17, defenseBonus: 0, hpBonus: 0,  element: 'thunder', description: '稲妻を引く強弓。通常攻撃が雷属性になる', spriteCoord: { col: 2, row: 9 } },
  { id: 'crag_hammer',       name: '岩砕の槌',         slot: 'weapon', weaponTag: 'mace',       attackBonus: 16, defenseBonus: 3, hpBonus: 20, description: '岩山から削り出した重鉄の槌。防御と体力を高める', spriteCoord: { col: 1, row: 1 } },
  { id: 'tiger_knuckle',     name: '虎爪の篭手',       slot: 'weapon', weaponTag: 'fist',       attackBonus: 17, defenseBonus: 0, hpBonus: 0,  speedBonus: 6, description: '獣の爪を模した篭手。速さと威力を引き出す', spriteCoord: { col: 3, row: 1 } },
  { id: 'seraph_emblem',     name: '熾天使の護符',     slot: 'weapon', weaponTag: 'holy',       attackBonus: 15, defenseBonus: 2, hpBonus: 24, element: 'light', description: '熾天使の紋章を刻んだ護符。光属性攻撃と体力補助を両立する', spriteCoord: { col: 5, row: 1 } },
  { id: 'void_scythe_edge',  name: '虚無の刃鎌',       slot: 'weapon', weaponTag: 'scythe',     attackBonus: 18, defenseBonus: 0, hpBonus: 0,  element: 'dark', description: '奈落の裂け目を現す刃。闇属性の力を断ち切る', spriteCoord: { col: 7, row: 1 } },
  { id: 'runeblade',         name: '刻印の魔剣',       slot: 'weapon', weaponTag: 'sword',      attackBonus: 15, defenseBonus: 2, hpBonus: 12, description: '古代文字が刻まれた魔剣。攻守のバランスが良い', spriteCoord: { col: 5, row: 0 } },
  // Tier3 武器（特殊効果）
  { id: 'blooddrinker',      name: '血喰いの剣',       slot: 'weapon', weaponTag: 'sword',      attackBonus: 13, defenseBonus: 0, hpBonus: 0,  specialEffects: [{ type: 'lifesteal', value: 0.12 }], description: '敵の血を糧とする魔剣。与えたダメージの12%をHP回復する', spriteCoord: { col: 6, row: 0 } },
  { id: 'ruin_cleaver',      name: '破壊の大剣',       slot: 'weapon', weaponTag: 'greatsword', attackBonus: 14, defenseBonus: 0, hpBonus: 0,  specialEffects: [{ type: 'last_stand', value: 0.8 }], description: '窮地で真価を発揮する大剣。HP25%以下でATKが大きく上がる', spriteCoord: { col: 6, row: 2 } },
  { id: 'blink_knife',       name: '瞬歩のナイフ',     slot: 'weapon', weaponTag: 'dagger',     attackBonus: 12, defenseBonus: 0, hpBonus: 0,  speedBonus: 8, specialEffects: [{ type: 'crit_chance', value: 0.08 }], description: '瞬きの速さで潜り込む短剣。速度と会心率を高める', spriteCoord: { col: 8, row: 4 } },
  { id: 'manafont_staff',    name: '魔泉の杖',         slot: 'weapon', weaponTag: 'staff',      attackBonus: 12, defenseBonus: 0, hpBonus: 0,  specialEffects: [{ type: 'mp_regen', value: 0.04 }], description: '魔力が湧き続ける杖。毎行動MaxMPの4%を自動回復する', spriteCoord: { col: 6, row: 6 } },
  { id: 'wyrmshot_bow',      name: '竜殺しの弓',       slot: 'weapon', weaponTag: 'bow',        attackBonus: 13, defenseBonus: 0, hpBonus: 0,  element: 'fire', specialEffects: [{ type: 'crit_chance', value: 0.06 }], description: '火の竜を仕留めた強弓。火属性攻撃と会心補助を持つ', spriteCoord: { col: 1, row: 9 } },
  { id: 'martyr_mace',       name: '殉教者の槌',       slot: 'weapon', weaponTag: 'mace',       attackBonus: 11, defenseBonus: 4, hpBonus: 18, specialEffects: [{ type: 'healing_boost', value: 0.35 }], description: '神のために身を捧げた武器。回復量を35%上昇させる', spriteCoord: { col: 0, row: 7 } },
  { id: 'berserk_wraps',     name: '狂気の拳帯',       slot: 'weapon', weaponTag: 'fist',       attackBonus: 14, defenseBonus: 0, hpBonus: 0,  speedBonus: 7, specialEffects: [{ type: 'last_stand', value: 0.6 }], description: '死線で闘志が燃え上がる拳帯。速度を上げ、瀕死時にATKが増す', spriteCoord: { col: 3, row: 2 } },
  { id: 'eclipse_scythe',    name: '蝕の大鎌',         slot: 'weapon', weaponTag: 'scythe',     attackBonus: 13, defenseBonus: 0, hpBonus: 0,  element: 'dark', specialEffects: [{ type: 'element_boost', value: 0.4, element: 'dark' }], description: '月蝕の力を帯びた大鎌。闇属性スキルの威力が40%高くなる', spriteCoord: { col: 6, row: 3 } },

  // ===== 追加装備（Tier2〜3 防具）=====
  { id: 'steel_plate',       name: '鋼鉄の重鎧',       slot: 'armor', armorTag: 'heavy',     attackBonus: 0, defenseBonus: 10, hpBonus: 28, description: '分厚い鋼鉄板で全身を守る重鎧', spriteCoord: { col: 1, row: 0 } },
  { id: 'vanguard_mail',     name: '前線の軽鎧',       slot: 'armor', armorTag: 'light',     attackBonus: 2, defenseBonus: 9,  hpBonus: 24, description: '攻守のバランスに優れた前衛用の軽鎧', spriteCoord: { col: 6, row: 0 } },
  { id: 'mystic_robe',       name: '秘術のローブ',     slot: 'armor', armorTag: 'robe',      attackBonus: 3, defenseBonus: 8,  hpBonus: 20, description: '魔力制御に優れたローブ。攻守の補助を兼ねる', spriteCoord: { col: 1, row: 5 } },
  { id: 'blessed_vestment',  name: '神福の聖衣',       slot: 'armor', armorTag: 'holy_armor', attackBonus: 1, defenseBonus: 9, hpBonus: 30, elementResist: { dark: 0.25 }, description: '神の祝福で編まれた聖衣。闇属性ダメージを25%軽減する', spriteCoord: { col: 6, row: 5 } },
  { id: 'lava_plate',        name: '溶岩鎧',           slot: 'armor', armorTag: 'heavy',     attackBonus: 0, defenseBonus: 16, hpBonus: 45, elementResist: { fire: 0.35 }, description: '熱に強い火山岩で作られた鎧。火属性ダメージを35%軽減する', spriteCoord: { col: 3, row: 0 } },
  { id: 'shadow_leather',    name: '影走りの革鎧',     slot: 'armor', armorTag: 'light',     attackBonus: 3, defenseBonus: 12, hpBonus: 28, elementResist: { dark: 0.30 }, description: '影に溶け込む革鎧。闇への耐性と攻撃補助を備える', spriteCoord: { col: 8, row: 0 } },
  { id: 'frost_robe',        name: '氷晶のローブ',     slot: 'armor', armorTag: 'robe',      attackBonus: 4, defenseBonus: 11, hpBonus: 26, elementResist: { ice: 0.35 }, description: '冷気を取り込んで身を守るローブ。氷属性ダメージを35%軽減する', spriteCoord: { col: 3, row: 5 } },
  { id: 'hallowed_mail',     name: '聖加護の聖衣',     slot: 'armor', armorTag: 'holy_armor', attackBonus: 2, defenseBonus: 13, hpBonus: 42, elementResist: { light: 0.25, dark: 0.25 }, description: '聖加護騎士に与えられた聖衣。光と闇の両方に耐性を持つ', spriteCoord: { col: 7, row: 5 } },
  { id: 'storm_jacket',      name: '嵐被りの軽鎧',     slot: 'armor', armorTag: 'light',     attackBonus: 4, defenseBonus: 10, hpBonus: 25, elementResist: { thunder: 0.30 }, description: '雷雲を裂いて進む猟師の軽鎧。雷属性ダメージを30%軽減する', spriteCoord: { col: 7, row: 0 } },
  { id: 'grave_robe',        name: '謀闇のローブ',     slot: 'armor', armorTag: 'robe',      attackBonus: 5, defenseBonus: 12, hpBonus: 32, elementResist: { dark: 0.35 }, description: '死の気配を帯びた葬礼用ローブ。闇への耐性が高い', spriteCoord: { col: 4, row: 5 } },
  // Tier3〜4 防具（特殊効果）
  { id: 'bloodiron_armor',   name: '血鉄の鎧',         slot: 'armor', armorTag: 'heavy',     attackBonus: 2, defenseBonus: 15, hpBonus: 36, specialEffects: [{ type: 'hp_regen', value: 0.03 }], description: '裂傷者の血が鉄に染みた鎧。毎行動MaxHPの3%を自動回復する', spriteCoord: { col: 2, row: 1 } },
  { id: 'windstep_armor',    name: '風踏みの軽装',     slot: 'armor', armorTag: 'light',     attackBonus: 2, defenseBonus: 11, hpBonus: 22, speedBonus: 8, specialEffects: [{ type: 'hp_regen', value: 0.02 }], description: '風と共に動く軽装。速度を大きく上げ、少量の自己回復を持つ', spriteCoord: { col: 9, row: 1 } },
  { id: 'archsage_robe',     name: '大賢者の法衣',     slot: 'armor', armorTag: 'robe',      attackBonus: 5, defenseBonus: 10, hpBonus: 24, specialEffects: [{ type: 'mp_regen', value: 0.05 }, { type: 'mp_cost_ratio', value: 0.7 }], description: '深い叡智が宿る法衣。毎行動MP回復とスキルMP消費30%軽減を得る', spriteCoord: { col: 3, row: 6 } },
  { id: 'miracle_surcoat',   name: '奇跡の聖衣',       slot: 'armor', armorTag: 'holy_armor', attackBonus: 0, defenseBonus: 14, hpBonus: 48, specialEffects: [{ type: 'healing_boost', value: 0.45 }, { type: 'atk_zero' }], description: '攻撃力を捨てて癒しに徹した聖衣。ATKを0に固定し、回復量を45%高める', spriteCoord: { col: 8, row: 5 } },
  { id: 'phoenix_mail',      name: '不死鳥の鎧',       slot: 'armor', armorTag: 'heavy',     attackBonus: 3, defenseBonus: 20, hpBonus: 60, elementResist: { fire: 0.50 }, specialEffects: [{ type: 'auto_revive' }], description: '不死鳥の魂が宿る鎧。火属性50%軽減と1度だけ戦闘不能を防ぐ', bossOnly: true, spriteCoord: { col: 4, row: 3 } },
  { id: 'nightveil_robe',    name: '夜帳の法衣',       slot: 'armor', armorTag: 'robe',      attackBonus: 6, defenseBonus: 14, hpBonus: 40, elementResist: { dark: 0.45 }, specialEffects: [{ type: 'element_boost', value: 0.5, element: 'dark' }], description: '夜の帳で編まれた法衣。闇への耐性を持ち、闇スキルの威力が50%高くなる', spriteCoord: { col: 4, row: 8 } },

  // ===== 追加装備（アクセサリ）=====
  { id: 'ruby_ring',         name: '紅玉の指輪',       slot: 'accessory', attackBonus: 4, defenseBonus: 0, hpBonus: 18, description: '攻撃力と生命力を底上げする赤い指輪', spriteCoord: { col: 8, row: 1 } },
  { id: 'quicksilver_boots', name: '水銀の靴',         slot: 'accessory', attackBonus: 0, defenseBonus: 0, hpBonus: 0,  speedBonus: 6, description: '軽い水銀が染みた靴。速度を6上昇させる' },
  { id: 'amber_amulet',      name: '琥珀のお守り',     slot: 'accessory', attackBonus: 2, defenseBonus: 2, hpBonus: 30, description: '柔らかな加護が秘められたお守り。小さいが頼れる補助を与える', spriteCoord: { col: 9, row: 8 } },
  { id: 'frost_pendant',     name: '凍結びの首飾り',   slot: 'accessory', attackBonus: 0, defenseBonus: 4, hpBonus: 24, elementResist: { ice: 0.35 }, description: '冷気を閉じ込めた首飾り。氷属性ダメージを35%軽減する', spriteCoord: { col: 9, row: 3 } },
  { id: 'thunder_charm',     name: '雷避けの護符',     slot: 'accessory', attackBonus: 0, defenseBonus: 3, hpBonus: 20, elementResist: { thunder: 0.35 }, description: '雷から身を守る護符。雷属性ダメージを35%軽減する', spriteCoord: { col: 9, row: 2 } },
  { id: 'saints_rosary',     name: '聖者のロザリオ',   slot: 'accessory', attackBonus: 0, defenseBonus: 4, hpBonus: 35, specialEffects: [{ type: 'healing_boost', value: 0.40 }], description: '神への信仰が深いロザリオ。回復量を40%上昇させる', spriteCoord: { col: 9, row: 1 } },
  { id: 'assassin_feather',  name: '暗殺者の羽飾り',   slot: 'accessory', attackBonus: 3, defenseBonus: 0, hpBonus: 0,  speedBonus: 10, specialEffects: [{ type: 'crit_chance', value: 0.08 }], description: '羽のように軽い飾り。速度と会心率を高める' },
  { id: 'mana_loop',         name: '魔力循環の指輪',   slot: 'accessory', attackBonus: 0, defenseBonus: 2, hpBonus: 18, specialEffects: [{ type: 'mp_regen', value: 0.05 }], description: '魔力の流れを整える指輪。毎行動MaxMPの5%を回復する', spriteCoord: { col: 8, row: 4 } },
  { id: 'guardian_talisman', name: '守護者の護符',     slot: 'accessory', attackBonus: 0, defenseBonus: 8, hpBonus: 55, elementResist: { light: 0.25, dark: 0.25 }, description: '光と闇の衝突を受け止める護符。両属性の被ダメージを軽減する', spriteCoord: { col: 8, row: 8 } },
  { id: 'berserk_anklet',    name: '修羅の足輪',       slot: 'accessory', attackBonus: 6, defenseBonus: 0, hpBonus: 0,  speedBonus: 8, specialEffects: [{ type: 'last_stand', value: 0.7 }], description: '死地で力が漲る足輪。速度を上げ、瀕死時のATKを強化する', spriteCoord: { col: 8, row: 5 } },
  { id: 'angel_feather',     name: '天使の羽根',       slot: 'accessory', attackBonus: 0, defenseBonus: 8, hpBonus: 70, elementResist: { light: 0.50 }, specialEffects: [{ type: 'auto_revive' }], description: '天使の加護で1度だけ戦闘不能を防ぐ。光属性ダメージも50%軽減する', bossOnly: true, spriteCoord: { col: 5, row: 3 } },
  { id: 'void_locket',       name: '虚無の首輪',       slot: 'accessory', attackBonus: 8, defenseBonus: 6, hpBonus: 60, elementResist: { dark: 0.50 }, specialEffects: [{ type: 'element_boost', value: 0.6, element: 'dark' }], description: '虚無の深淵を封じた首輪。闇への耐性を高め、闇属性スキルをさらに強化する', bossOnly: true, spriteCoord: { col: 8, row: 6 } },

  // ===== 追加装備（Tier4 ボス専用・最終装備）=====
  { id: 'inferno_blade',       name: '獄炎魔剣',         slot: 'weapon', weaponTag: 'sword',      attackBonus: 28, defenseBonus: 0, hpBonus: 20, element: 'fire', specialEffects: [{ type: 'element_boost', value: 0.7, element: 'fire' }], description: '灼熱の業火が宿る魔剣。火属性攻撃と火スキル威力+70%を両立する', bossOnly: true, spriteCoord: { col: 4, row: 1 } },
  { id: 'worldrend_greatsword',name: '世界断ちの大剣',   slot: 'weapon', weaponTag: 'greatsword', attackBonus: 34, defenseBonus: 0, hpBonus: 40, specialEffects: [{ type: 'last_stand', value: 1.8 }], description: '世界をも断ち割ると謂われる大剣。瀕死時に圧倒的な破壊力を解き放つ', bossOnly: true, spriteCoord: { col: 8, row: 3 } },
  { id: 'godspeed_dagger',     name: '神速の短剣',       slot: 'weapon', weaponTag: 'dagger',     attackBonus: 24, defenseBonus: 0, hpBonus: 0,  speedBonus: 14, specialEffects: [{ type: 'crit_chance', value: 0.16 }], description: '極めて高い会心率と速度を持つ短剣', bossOnly: true, spriteCoord: { col: 9, row: 5 } },
  { id: 'starfall_staff',      name: '星墜の杖',         slot: 'weapon', weaponTag: 'staff',      attackBonus: 30, defenseBonus: 0, hpBonus: 24, element: 'thunder', specialEffects: [{ type: 'mp_regen', value: 0.08 }, { type: 'element_boost', value: 0.7, element: 'thunder' }], description: '星霊を灯す神杖。雷属性スキルを強化し、莫大な魔力が循環する', bossOnly: true, spriteCoord: { col: 9, row: 7 } },
  { id: 'celestial_bow',       name: '天穹の神弓',       slot: 'weapon', weaponTag: 'bow',        attackBonus: 29, defenseBonus: 0, hpBonus: 12, element: 'light', specialEffects: [{ type: 'crit_chance', value: 0.12 }], description: '天上の矢を放つ神弓。光属性攻撃と高い会心補助を持つ', bossOnly: true, spriteCoord: { col: 8, row: 9 } },
  { id: 'cataclysm_mace',      name: '破滅の槌',         slot: 'weapon', weaponTag: 'mace',       attackBonus: 27, defenseBonus: 8, hpBonus: 55, specialEffects: [{ type: 'healing_boost', value: 0.60 }], description: '神力と破壊を両立した終末の槌。体力と回復性能を大きく高める', bossOnly: true, spriteCoord: { col: 1, row: 4 } },
  { id: 'titan_fist',          name: '巨神の拳',         slot: 'weapon', weaponTag: 'fist',       attackBonus: 31, defenseBonus: 0, hpBonus: 0,  speedBonus: 12, specialEffects: [{ type: 'lifesteal', value: 0.22 }], description: '巨神の力を移した拳帯。高威力の攻めで自らの命を吸い上げる', bossOnly: true, spriteCoord: { col: 3, row: 8 } },
  { id: 'holy_grail',          name: '聖杯の秘符',       slot: 'weapon', weaponTag: 'holy',       attackBonus: 24, defenseBonus: 10, hpBonus: 80, element: 'light', specialEffects: [{ type: 'healing_boost', value: 0.80 }, { type: 'mp_cost_ratio', value: 0.3 }, { type: 'atk_zero' }], description: '絶対的な癒しに特化した聖杯。ATKを0に固定する代わりに回復量とMP効率を極限まで高める', bossOnly: true, spriteCoord: { col: 5, row: 0 } },
  { id: 'reaper_scythe',       name: '終焉の死鎌',       slot: 'weapon', weaponTag: 'scythe',     attackBonus: 32, defenseBonus: 0, hpBonus: 0,  element: 'dark', specialEffects: [{ type: 'lifesteal', value: 0.20 }, { type: 'element_boost', value: 0.7, element: 'dark' }], description: '終焉を刈る死鎌。闇属性の力を大幅に高めつつ命を奪う', bossOnly: true, spriteCoord: { col: 6, row: 8 } },
  { id: 'aeon_crown',          name: '永久の冠',         slot: 'accessory', attackBonus: 12, defenseBonus: 12, hpBonus: 110, speedBonus: 18, elementResist: { fire: 0.40, ice: 0.40, thunder: 0.40, light: 0.40, dark: 0.40 }, specialEffects: [{ type: 'auto_revive' }, { type: 'mp_regen', value: 0.06 }], description: '永久神の冠。全属性に強い耐性を持ち、1度だけ蘇りつつMPを回復する', bossOnly: true, spriteCoord: { col: 5, row: 7 } },
]

export const EQUIPMENT_MAP = new Map(EQUIPMENT_MASTER.map((e) => [e.id, e]))

// ===== 職業別装備制限 =====
export const CLASS_WEAPON_TAGS: Record<CharacterClass, WeaponTag[]> = {
  warrior:     ['sword', 'greatsword', 'mace'],
  mage:        ['staff'],
  rogue:       ['dagger', 'sword'],
  priest:      ['mace', 'holy'],
  ranger:      ['bow'],
  knight:      ['sword', 'greatsword', 'mace'],
  wizard:      ['staff'],
  assassin:    ['dagger'],
  paladin:     ['sword', 'holy'],
  bard:        ['dagger', 'bow'],
  berserker:   ['greatsword', 'fist'],
  witch:       ['staff', 'scythe'],
  monk:        ['fist'],
  druid:       ['staff', 'holy'],
  dancer:      ['dagger'],
  dark_knight: ['greatsword', 'scythe'],
  necromancer: ['staff', 'scythe'],
  sage:        ['staff', 'holy'],
  summoner:    ['staff'],
  enchanter:   ['sword', 'staff'],
}

export const CLASS_ARMOR_TAGS: Record<CharacterClass, ArmorTag[]> = {
  warrior:     ['heavy', 'light'],
  mage:        ['robe'],
  rogue:       ['light'],
  priest:      ['light', 'robe', 'holy_armor'],
  ranger:      ['light'],
  knight:      ['heavy'],
  wizard:      ['robe'],
  assassin:    ['light'],
  paladin:     ['heavy', 'holy_armor'],
  bard:        ['light'],
  berserker:   ['heavy', 'light'],
  witch:       ['robe'],
  monk:        ['light'],
  druid:       ['robe', 'light'],
  dancer:      ['light'],
  dark_knight: ['heavy'],
  necromancer: ['robe'],
  sage:        ['robe', 'holy_armor'],
  summoner:    ['robe'],
  enchanter:   ['light', 'robe'],
}

export const WEAPON_TAG_LABEL: Record<WeaponTag, string> = {
  sword: '剣', greatsword: '大剣', dagger: '短剣', staff: '杖',
  bow: '弓', mace: '鎚', fist: '拳', holy: '聖具', scythe: '鎌',
}
export const ARMOR_TAG_LABEL: Record<ArmorTag, string> = {
  heavy: '重鎧', light: '軽鎧', robe: 'ローブ', holy_armor: '聖装',
}

export function canEquip(item: Equipment, charClass: CharacterClass): boolean {
  if (item.slot === 'accessory') return true
  if (item.slot === 'weapon') {
    const allowed = CLASS_WEAPON_TAGS[charClass] ?? []
    return !item.weaponTag || allowed.includes(item.weaponTag)
  }
  if (item.slot === 'armor') {
    const allowed = CLASS_ARMOR_TAGS[charClass] ?? []
    return !item.armorTag || allowed.includes(item.armorTag)
  }
  return true
}

// ===== 強化システム =====
export const ENHANCE_RATES = [95, 88, 78, 68, 55, 42, 30, 18, 9, 3]
export const ENHANCE_COSTS = [100, 250, 500, 1000, 2000, 4000, 8000, 20000, 50000, 100000]
export const ENHANCE_BREAK_CHANCE = 0.10
export const ENHANCE_MAX = 10

export function getEnhancedStats(item: Equipment) {
  const e = item.enhancement ?? 0
  const boost = (base: number) => base > 0 ? base + e * Math.ceil(base * 0.2) : 0
  return {
    attackBonus:  boost(item.attackBonus),
    defenseBonus: boost(item.defenseBonus),
    hpBonus:      boost(item.hpBonus),
    speedBonus:   item.speedBonus ? boost(item.speedBonus) : 0,
  }
}

export function getItemDisplayName(item: Equipment): string {
  const e = item.enhancement ?? 0
  return e > 0 ? `${item.name} +${e}` : item.name
}

const STARTER_IDS = ['iron_sword', 'holy_mace', 'leather_armor', 'chain_mail', 'power_ring', 'iron_shield']
export const STARTER_EQUIPMENT = STARTER_IDS.map((id) => EQUIPMENT_MAP.get(id)!)

const POOL_BY_TIER: Record<number, string[]> = {
  1: ['iron_sword', 'holy_mace', 'leather_armor', 'power_ring', 'iron_shield', 'short_bow', 'iron_knuckle', 'leather_boots', 'iron_greatsword', 'bronze_greatsword'],
  2: ['magic_staff', 'swift_dagger', 'chain_mail', 'robe_of_mana', 'vitality_amulet', 'long_bow', 'monks_fist', 'wind_boots', 'steel_greatsword', 'warbreaker'],
  3: ['dragon_fang', 'ancient_staff', 'dragon_scale', 'dragon_amulet', 'elven_bow', 'dragon_claw', 'gale_boots', 'dragon_greatsword',
      'flame_blade', 'frost_staff', 'saints_mantle', 'soul_reaper', 'berserk_knuckle', 'sages_robe', 'flame_guard'],
  4: ['chaos_sword', 'chaos_staff', 'chaos_bow', 'chaos_blade', 'chaos_fist', 'chaos_scythe', 'chaos_greatsword', 'chaos_armor', 'chaos_robe', 'chaos_leather', 'chaos_ring', 'chaos_amulet', 'chaos_boots'],
}

// bossOnly・特殊効果・属性持ちはレア判定
export function getItemRarity(item: Equipment): 'common' | 'rare' {
  if (item.bossOnly) return 'rare'
  if ((item.specialEffects?.length ?? 0) > 0) return 'rare'
  if (item.element && item.element !== 'none') return 'rare'
  return 'common'
}

export function pickEquipment(difficulty: number, isBossFloor: boolean): Equipment | null {
  const allIds: string[] = []
  for (let t = 1; t <= difficulty; t++) allIds.push(...(POOL_BY_TIER[t] ?? []))

  const candidates = allIds
    .map((id) => EQUIPMENT_MAP.get(id))
    .filter((item): item is Equipment => item != null)
    .filter((item) => isBossFloor || !item.bossOnly)

  if (candidates.length === 0) return null

  // レア10%・通常90%の抽選
  const wantRare = Math.random() < 0.1
  const rarityPool = candidates.filter((item) => getItemRarity(item) === (wantRare ? 'rare' : 'common'))
  const finalPool = rarityPool.length > 0 ? rarityPool : candidates

  const base = finalPool[Math.floor(Math.random() * finalPool.length)]
  const instanceId = `${base.id}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
  return { ...base, id: instanceId, baseId: base.id }
}

export function createEquipmentDrop(itemId: string): Equipment | null {
  const base = EQUIPMENT_MAP.get(itemId)
  if (!base) return null
  const instanceId = `${itemId}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
  return { ...base, id: instanceId, baseId: itemId }
}

// ============================================================
// 特殊効果ヘルパー
// ============================================================
function collectEffects(char: Character) {
  return (Object.values(char.equipment) as Array<Equipment | undefined>)
    .flatMap(e => e?.specialEffects ?? [])
}

/** 装備による MP コスト倍率（複数装備は乗算合成）*/
export function getMpCostRatio(char: Character): number {
  return collectEffects(char).reduce(
    (r, e) => e.type === 'mp_cost_ratio' ? r * (e.value ?? 1) : r, 1)
}

/** 装備による回復量ボーナス（加算）*/
export function getHealingBoost(char: Character): number {
  return collectEffects(char).reduce(
    (s, e) => e.type === 'healing_boost' ? s + (e.value ?? 0) : s, 0)
}

/** 装備による特定属性の威力倍率（1.0 + 加算ボーナス）*/
export function getElementBoostMul(char: Character, element: ElementType): number {
  return collectEffects(char).reduce(
    (mul, e) => e.type === 'element_boost' && (!e.element || e.element === element)
      ? mul + (e.value ?? 0) : mul, 1)
}

/** 装備による吸血率（加算）*/
export function getLifestealRate(char: Character): number {
  return collectEffects(char).reduce(
    (s, e) => e.type === 'lifesteal' ? s + (e.value ?? 0) : s, 0)
}

/** 装備による会心率ボーナス（加算）*/
export function getCritBonus(char: Character): number {
  return collectEffects(char).reduce(
    (s, e) => e.type === 'crit_chance' ? s + (e.value ?? 0) : s, 0)
}

/** HP25%以下のときの ATK 乗数（瀕死強化）*/
export function getLastStandMul(char: Character, currentHp: number): number {
  if (currentHp / char.maxHp > 0.25) return 1
  return collectEffects(char).reduce(
    (mul, e) => e.type === 'last_stand' ? mul + (e.value ?? 0) : mul, 1)
}

/** 装備による毎行動 HP 自動回復率（MaxHP に対する割合）*/
export function getHpRegenRate(char: Character): number {
  return collectEffects(char).reduce(
    (s, e) => e.type === 'hp_regen' ? s + (e.value ?? 0) : s, 0)
}

/** 装備による毎行動 MP 自動回復率（MaxMP に対する割合）*/
export function getMpRegenRate(char: Character): number {
  return collectEffects(char).reduce(
    (s, e) => e.type === 'mp_regen' ? s + (e.value ?? 0) : s, 0)
}

/** 武器の属性（属性なし = 'none'）*/
export function getWeaponElement(char: Character): ElementType {
  return char.equipment.weapon?.element ?? 'none'
}

/** 装備による特定属性の耐性（0-0.9 にクランプ）*/
export function getElementResist(char: Character, element: ElementType): number {
  if (element === 'none') return 0
  const total = (Object.values(char.equipment) as Array<Equipment | undefined>)
    .reduce((s, e) => s + (e?.elementResist?.[element] ?? 0), 0)
  return Math.min(0.9, total)
}

/** auto_revive 効果を持つかどうか*/
export function hasAutoRevive(char: Character): boolean {
  return collectEffects(char).some(e => e.type === 'auto_revive')
}

// Returns items that can drop in a dungeon, with source.
// Accessories drop from chests, weapons/armor drop from enemy combat.
export function getDungeonDropList(dungeonDifficulty: number): { item: Equipment; source: 'enemy' | 'chest' }[] {
  const pool: string[] = []
  for (let t = 1; t <= dungeonDifficulty; t++) pool.push(...(POOL_BY_TIER[t] ?? []))
  // deduplicate while preserving order
  const seen = new Set<string>()
  return pool
    .filter((id) => { if (seen.has(id)) return false; seen.add(id); return true })
    .map((id) => {
      const item = EQUIPMENT_MAP.get(id)!
      return { item, source: item.slot === 'accessory' ? 'chest' : 'enemy' }
    })
}

// 行商人の販売プール：ダンジョンドロップリストからbossOnly除外
export function getMerchantPool(dungeonDifficulty: number): Equipment[] {
  const pool: string[] = []
  for (let t = 1; t <= dungeonDifficulty; t++) pool.push(...(POOL_BY_TIER[t] ?? []))
  const seen = new Set<string>()
  return pool
    .filter((id) => { if (seen.has(id)) return false; seen.add(id); return true })
    .map((id) => EQUIPMENT_MAP.get(id)!)
    .filter((item) => !item.bossOnly)
}
