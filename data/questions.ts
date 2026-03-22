import type { Question } from "@/types";

// 質問設計方針:
// - 「気分で決まる」コンセプトに沿い、感情・感覚にフォーカス
// - 各質問は担当する軸を明確に分離（軸の独立性確保）
// - Q1: casualFormal主担当, Q2: adventurous+wafuYofu主担当
// - Q3: heavyLight主担当, Q4: wafuYofu+adventurous補強, Q5: casualFormal+heavyLight補強

export const QUESTIONS: Question[] = [
  {
    // Q1: シーン設定 → casualFormal主担当 + adventurous副担当
    id: 1,
    text: "今日は誰と食べる？",
    subtext: "シチュエーションで変わるよね",
    type: "score",
    choices: [
      {
        id: "1a",
        text: "ひとり",
        emoji: "🙋",
        scores: { heavyLight: 0, wafuYofu: 0, casualFormal: -3, adventurous: -1 },
      },
      {
        id: "1b",
        text: "恋人と",
        emoji: "💑",
        scores: { heavyLight: 0, wafuYofu: 0, casualFormal: 3, adventurous: 1 },
      },
      {
        id: "1c",
        text: "友達と",
        emoji: "👯",
        scores: { heavyLight: 0, wafuYofu: 0, casualFormal: -1, adventurous: 2 },
      },
      {
        id: "1d",
        text: "家族と",
        emoji: "👨‍👩‍👧‍👦",
        scores: { heavyLight: 0, wafuYofu: -1, casualFormal: 1, adventurous: -1 },
      },
    ],
  },
  {
    // Q2: 感情・気分 → adventurous主担当 + wafuYofu副担当
    // 食ジャンルを直接連想させない感情ベースの聞き方
    id: 2,
    text: "今夜の気分に近いのは？",
    subtext: "直感で選んでね",
    type: "score",
    choices: [
      {
        id: "2a",
        text: "元気いっぱい、パワーチャージ",
        emoji: "💪",
        scores: { heavyLight: -2, wafuYofu: 0, casualFormal: -1, adventurous: -1 },
      },
      {
        id: "2b",
        text: "ほっとしたい、癒されたい",
        emoji: "☕",
        scores: { heavyLight: 1, wafuYofu: -2, casualFormal: 0, adventurous: -2 },
      },
      {
        id: "2c",
        text: "特別な時間を過ごしたい",
        emoji: "✨",
        scores: { heavyLight: 0, wafuYofu: 1, casualFormal: 3, adventurous: 0 },
      },
      {
        id: "2d",
        text: "いつもと違うものに出会いたい",
        emoji: "🌍",
        scores: { heavyLight: 0, wafuYofu: 2, casualFormal: 0, adventurous: 3 },
      },
    ],
  },
  {
    // Q3: 身体感覚 → heavyLight主担当 + wafuYofu副担当
    // 「何が食べたいか」ではなく「体がどう感じてるか」
    id: 3,
    text: "今日の体の感覚は？",
    subtext: "体の声を聞いてみて",
    type: "score",
    choices: [
      {
        id: "3a",
        text: "お腹ぺこぺこ、がっつり食べたい",
        emoji: "🔥",
        scores: { heavyLight: -3, wafuYofu: 0, casualFormal: 0, adventurous: 0 },
      },
      {
        id: "3b",
        text: "軽めがいい、胃に優しく",
        emoji: "🌿",
        scores: { heavyLight: 3, wafuYofu: -1, casualFormal: 0, adventurous: 0 },
      },
      {
        id: "3c",
        text: "辛いもの・刺激が欲しい",
        emoji: "🌶️",
        scores: { heavyLight: 0, wafuYofu: 3, casualFormal: -1, adventurous: 2 },
      },
      {
        id: "3d",
        text: "温かいものでほっこりしたい",
        emoji: "♨️",
        scores: { heavyLight: -1, wafuYofu: -2, casualFormal: 0, adventurous: -1 },
      },
    ],
  },
  {
    // Q4: お酒 → wafuYofu副担当 + コンテキストペナルティの入力
    id: 4,
    text: "お酒は飲みたい？",
    subtext: "今夜のテンションは？",
    type: "score",
    choices: [
      {
        id: "4a",
        text: "飲みたい",
        emoji: "🍺",
        scores: { heavyLight: -1, wafuYofu: 0, casualFormal: -1, adventurous: 1 },
      },
      {
        id: "4b",
        text: "飲まない",
        emoji: "🚗",
        scores: { heavyLight: 1, wafuYofu: 0, casualFormal: 0, adventurous: 0 },
      },
      {
        id: "4c",
        text: "どちらでも",
        emoji: "🤷",
        scores: { heavyLight: 0, wafuYofu: 0, casualFormal: 0, adventurous: 0 },
      },
    ],
  },
  {
    // Q5: 最後の一押し → casualFormal + heavyLight補強（予算感+価値観を統合）
    // 具体的な金額ではなく気分に沿った聞き方
    id: 5,
    text: "お店に求めるのは？",
    subtext: "最後の決め手を選んでね",
    type: "score",
    choices: [
      {
        id: "5a",
        text: "リーズナブルにサクッと",
        emoji: "⚡",
        scores: { heavyLight: 0, wafuYofu: 0, casualFormal: -3, adventurous: 0 },
      },
      {
        id: "5b",
        text: "ちょうどいいバランスで",
        emoji: "👌",
        scores: { heavyLight: 0, wafuYofu: 0, casualFormal: 0, adventurous: 0 },
      },
      {
        id: "5c",
        text: "ちょっと奮発して特別に",
        emoji: "💎",
        scores: { heavyLight: 0, wafuYofu: 1, casualFormal: 3, adventurous: 1 },
      },
      {
        id: "5d",
        text: "とにかく満腹になりたい",
        emoji: "🍚",
        scores: { heavyLight: -3, wafuYofu: -1, casualFormal: -2, adventurous: -1 },
      },
    ],
  },
];

export const INITIAL_SCORES = {
  heavyLight: 0,
  wafuYofu: 0,
  casualFormal: 0,
  adventurous: 0,
};
