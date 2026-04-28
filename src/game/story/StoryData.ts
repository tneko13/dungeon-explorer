/**
 * Arveil Chronicle — ストーリーデータ
 * 各シーンは背景画像パスとテキスト行の配列で構成される。
 * 背景画像は public/images/story/ に配置予定。
 * 未配置の場合はフォールバック背景色を表示する。
 */

export interface StoryScene {
  bg: string           // 背景画像パス（BASE_URL相対）
  text: string         // 表示テキスト（改行は \n）
}

export interface StoryChapter {
  id: string           // 'prologue' | 'epilogue' | dungeon id
  title: string        // チャプタータイトル（回想画面用）
  triggerType: 'start' | 'dungeon_clear'  // start=初回起動 / dungeon_clear=ダンジョン踏破後
  dungeonId?: string   // dungeon_clear の場合にどのダンジョン踏破で発火するか
  scenes: StoryScene[]
}

const STORY_BASE = 'images/story/'

export const STORY_CHAPTERS: StoryChapter[] = [
  // ────────────────────────────────────────────────────────
  // プロローグ
  // ────────────────────────────────────────────────────────
  {
    id: 'prologue',
    title: 'プロローグ — アルヴェイルの黎明',
    triggerType: 'start',
    scenes: [
      {
        bg: `${STORY_BASE}prologue_01.jpg`,
        text: '遥か昔——\n天と大地を繋ぐ柱が砕け、世界は深淵に覆われた。',
      },
      {
        bg: `${STORY_BASE}prologue_02.jpg`,
        text: '人々は「アルヴェイル」と呼ばれる古の遺跡に希望を見出した。\nその奥深くに、砕けた柱の欠片が眠ると伝えられていた。',
      },
      {
        bg: `${STORY_BASE}prologue_03.jpg`,
        text: '多くの冒険者がアルヴェイルを目指したが、\n帰らぬ者も少なくなかった。',
      },
      {
        bg: `${STORY_BASE}prologue_04.jpg`,
        text: '君は小さな冒険者ギルドの長だ。\n仲間を集め、深淵の底に眠る真実を探れ。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // ゴブリンの洞窟 踏破後
  // ────────────────────────────────────────────────────────
  {
    id: 'story_goblin_cave',
    title: '第一章 — 洞窟の向こうへ',
    triggerType: 'dungeon_clear',
    dungeonId: 'goblin_cave',
    scenes: [
      {
        bg: `${STORY_BASE}goblin_cave_01.jpg`,
        text: 'ゴブリンの洞窟を抜けた先に、朽ちた石碑があった。\n刻まれた文字は古代語で「始まりの扉」を意味する。',
      },
      {
        bg: `${STORY_BASE}goblin_cave_02.jpg`,
        text: '「こんな洞窟の奥に……なぜ古代の碑が？」\nテッサが剣の汚れを拭いながら呟く。',
      },
      {
        bg: `${STORY_BASE}goblin_cave_03.jpg`,
        text: 'サーシャは石碑に手を触れ、静かに言った。\n「アルヴェイルへの道は、まだ先に続いている」',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 古代遺跡 踏破後
  // ────────────────────────────────────────────────────────
  {
    id: 'story_ancient_ruins',
    title: '第二章 — 忘れられた文明',
    triggerType: 'dungeon_clear',
    dungeonId: 'ancient_ruins',
    scenes: [
      {
        bg: `${STORY_BASE}ancient_ruins_01.jpg`,
        text: '遺跡の最奥で、リッチの亡骸が崩れ去った。\n瘴気が晴れると、巨大な壁画が姿を現した。',
      },
      {
        bg: `${STORY_BASE}ancient_ruins_02.jpg`,
        text: '壁画には、天を貫く巨柱と、それを守る六人の騎士が描かれていた。\nその騎士たちの姿は……どこか見覚えがある。',
      },
      {
        bg: `${STORY_BASE}ancient_ruins_03.jpg`,
        text: '「運命なんてものがあるとすれば」とサーシャは呟く。\n「私たちは初めからここへ来るよう定められていたのかも」',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 暗黒の森 踏破後
  // ────────────────────────────────────────────────────────
  {
    id: 'story_dark_forest',
    title: '第三章 — 闇に揺れる木漏れ日',
    triggerType: 'dungeon_clear',
    dungeonId: 'dark_forest',
    scenes: [
      {
        bg: `${STORY_BASE}dark_forest_01.jpg`,
        text: '暗黒の森を抜けた夜、焚き火を囲んで仲間たちが語り合った。\nそれぞれが胸に秘めた理由で、この旅を続けている。',
      },
      {
        bg: `${STORY_BASE}dark_forest_02.jpg`,
        text: 'フォレストガーディアンの核から、淡く光る種が落ちた。\nフィリはその種を大切に布に包んだ。\n「いつか、この森に光が戻るように」',
      },
      {
        bg: `${STORY_BASE}dark_forest_03.jpg`,
        text: '空が白み始めた頃、遠くに竜の棲む山脈が見えた。\n次なる試練が、彼らを待ち受けている。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 竜の棲み処 踏破後
  // ────────────────────────────────────────────────────────
  {
    id: 'story_dragon_lair',
    title: '第四章 — 古代竜の遺言',
    triggerType: 'dungeon_clear',
    dungeonId: 'dragon_lair',
    scenes: [
      {
        bg: `${STORY_BASE}dragon_lair_01.jpg`,
        text: '倒れた古代竜は、最後に人の言葉で語りかけてきた。\n「……お前たちが来るのを、ずっと待っていた」',
      },
      {
        bg: `${STORY_BASE}dragon_lair_02.jpg`,
        text: '竜の名はヴァルグレイン。\n数千年前、深淵の柱を守る番人として生まれた存在だった。',
      },
      {
        bg: `${STORY_BASE}dragon_lair_03.jpg`,
        text: '「奈落の底に、真の支配者が目覚めつつある。\n急げ——時間が、ない」\n竜の声は風に溶け、消えた。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 奈落の迷宮 踏破後
  // ────────────────────────────────────────────────────────
  {
    id: 'story_abyss_labyrinth',
    title: '第五章 — 奈落の底',
    triggerType: 'dungeon_clear',
    dungeonId: 'abyss_labyrinth',
    scenes: [
      {
        bg: `${STORY_BASE}abyss_labyrinth_01.jpg`,
        text: '奈落の覇王が砕け散った時、地鳴りが轟いた。\n何百年も閉ざされていた扉が、静かに開く。',
      },
      {
        bg: `${STORY_BASE}abyss_labyrinth_02.jpg`,
        text: '扉の向こうに続く階段は、光を飲み込むほどの闇に満ちていた。\n「……ここから先が、本当のアルヴェイルか」',
      },
      {
        bg: `${STORY_BASE}abyss_labyrinth_03.jpg`,
        text: 'テッサは仲間の顔を見渡し、静かに一歩を踏み出した。\n誰も止まらなかった。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 深淵の塔 踏破後
  // ────────────────────────────────────────────────────────
  {
    id: 'story_abyss_tower',
    title: '第六章 — 塔の頂で',
    triggerType: 'dungeon_clear',
    dungeonId: 'abyss_tower',
    scenes: [
      {
        bg: `${STORY_BASE}abyss_tower_01.jpg`,
        text: '深淵の支配者を倒した瞬間、塔全体が光に包まれた。\n長い間この場所に閉じ込められていた魂たちが、解放されていく。',
      },
      {
        bg: `${STORY_BASE}abyss_tower_02.jpg`,
        text: 'ゼラは静かに目を閉じた。\n「……私が求めていたのは、こういう終わりではなかったかもしれない。\n　でも、これが正しい」',
      },
      {
        bg: `${STORY_BASE}abyss_tower_03.jpg`,
        text: '塔の頂から見える景色は、世界の果てまで続いていた。\nそして遥か上空に——砕けた柱の欠片が、淡く輝いていた。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 聖域の廃墟 踏破後
  // ────────────────────────────────────────────────────────
  {
    id: 'story_sanctuary_ruins',
    title: '第七章 — 廃墟に宿る祈り',
    triggerType: 'dungeon_clear',
    dungeonId: 'sanctuary_ruins',
    scenes: [
      {
        bg: `${STORY_BASE}sanctuary_ruins_01.jpg`,
        text: '聖域の廃墟には、かつて神に仕えた者たちの記録が残されていた。\n彼らは深淵が訪れることを予言し、冒険者の来訪を祈り続けた。',
      },
      {
        bg: `${STORY_BASE}sanctuary_ruins_02.jpg`,
        text: 'ルカは古い祈祷書を手に取った。\n「誰かが……ずっと待っていてくれたんだ」',
      },
      {
        bg: `${STORY_BASE}sanctuary_ruins_03.jpg`,
        text: '廃墟の奥に、永遠の聖域への道が開かれた。\n混沌神が目を覚ます前に——終わらせなければならない。',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 永遠の聖域 踏破後
  // ────────────────────────────────────────────────────────
  {
    id: 'story_eternal_sanctuary',
    title: '終章 — アルヴェイルの夜明け',
    triggerType: 'dungeon_clear',
    dungeonId: 'eternal_sanctuary',
    scenes: [
      {
        bg: `${STORY_BASE}eternal_sanctuary_01.jpg`,
        text: '永遠神が砕け散り、世界を覆っていた深淵の霧が晴れていく。\n空に、砕けた柱の欠片たちが集まり始めた。',
      },
      {
        bg: `${STORY_BASE}eternal_sanctuary_02.jpg`,
        text: '仲間たちは誰も言葉を発しなかった。\nただ、光が世界を満たしていくのを、静かに見つめていた。',
      },
      {
        bg: `${STORY_BASE}eternal_sanctuary_03.jpg`,
        text: '柱は完全に修復されることはなかった。\nしかし、その欠片は空に散り——星となり、世界を照らし続けた。',
      },
      {
        bg: `${STORY_BASE}eternal_sanctuary_04.jpg`,
        text: 'ギルドに帰り着いた夜、テッサは空を見上げて笑った。\n「次はどこに行こうか」\n\nThe End.',
      },
    ],
  },

  // ────────────────────────────────────────────────────────
  // エピローグ（試練の闘技場 踏破後）
  // ────────────────────────────────────────────────────────
  {
    id: 'epilogue',
    title: 'エピローグ — 伝説のその後',
    triggerType: 'dungeon_clear',
    dungeonId: 'trial_arena',
    scenes: [
      {
        bg: `${STORY_BASE}epilogue_01.jpg`,
        text: '世界に平和が戻ってから、月日が流れた。\n君のギルドの名は、大陸中に知れ渡っている。',
      },
      {
        bg: `${STORY_BASE}epilogue_02.jpg`,
        text: '試練の闘技場で最後の戦いを終えた仲間たちは、\nそれぞれの道へと歩み始めた。',
      },
      {
        bg: `${STORY_BASE}epilogue_03.jpg`,
        text: 'しかし——噂では、深淵の底に\nまだ見ぬ扉があると言われている。',
      },
      {
        bg: `${STORY_BASE}epilogue_04.jpg`,
        text: '冒険は、終わらない。\n\n— Arveil Chronicle —',
      },
    ],
  },
]

/** ダンジョンIDからストーリーチャプターを取得 */
export function getStoryByDungeon(dungeonId: string): StoryChapter | undefined {
  return STORY_CHAPTERS.find(
    (c) => c.triggerType === 'dungeon_clear' && c.dungeonId === dungeonId
  )
}

/** プロローグチャプターを取得 */
export function getPrologue(): StoryChapter {
  return STORY_CHAPTERS.find((c) => c.id === 'prologue')!
}
