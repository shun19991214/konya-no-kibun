import type { Question } from "@/types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "今日は誰と食べる？",
    subtext: "シチュエーションで変わるよね",
    type: "score",
    choices: [
      {
        id: "1a",
        text: "ひとり",
        emoji: "🙋",
        scores: { heavyLight: 0, wafuYofu: 0, casualFormal: -2, adventurous: 0 },
      },
      {
        id: "1b",
        text: "恋人と",
        emoji: "💑",
        scores: { heavyLight: 0, wafuYofu: 1, casualFormal: 2, adventurous: 1 },
      },
      {
        id: "1c",
        text: "友達と",
        emoji: "👯",
        scores: { heavyLight: 1, wafuYofu: 0, casualFormal: -1, adventurous: 1 },
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
    id: 2,
    text: "今の気分は？",
    subtext: "直感で選んでね",
    type: "score",
    choices: [
      {
        id: "2a",
        text: "がっつり",
        emoji: "🍖",
        scores: { heavyLight: -3, wafuYofu: 0, casualFormal: -1, adventurous: -1 },
      },
      {
        id: "2b",
        text: "さっぱり",
        emoji: "🥗",
        scores: { heavyLight: 3, wafuYofu: -1, casualFormal: 0, adventurous: -1 },
      },
      {
        id: "2c",
        text: "おしゃれに",
        emoji: "✨",
        scores: { heavyLight: 0, wafuYofu: 1, casualFormal: 3, adventurous: 0 },
      },
      {
        id: "2d",
        text: "冒険したい",
        emoji: "🌍",
        scores: { heavyLight: 0, wafuYofu: 2, casualFormal: -1, adventurous: 3 },
      },
    ],
  },
  {
    id: 3,
    text: "予算はどのくらい？",
    subtext: "ひとり分の目安で",
    type: "score",
    choices: [
      {
        id: "3a",
        text: "〜1,000円",
        emoji: "💰",
        scores: { heavyLight: 0, wafuYofu: 0, casualFormal: -3, adventurous: 0 },
      },
      {
        id: "3b",
        text: "〜3,000円",
        emoji: "💰💰",
        scores: { heavyLight: 0, wafuYofu: 0, casualFormal: 0, adventurous: 0 },
      },
      {
        id: "3c",
        text: "〜5,000円",
        emoji: "💰💰💰",
        scores: { heavyLight: -1, wafuYofu: 0, casualFormal: 2, adventurous: 0 },
      },
      {
        id: "3d",
        text: "5,000円〜",
        emoji: "💎",
        scores: { heavyLight: -1, wafuYofu: 1, casualFormal: 3, adventurous: 1 },
      },
    ],
  },
  {
    id: 4,
    text: "お酒は飲みたい？",
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
        scores: { heavyLight: 1, wafuYofu: -1, casualFormal: 0, adventurous: -1 },
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
    id: 5,
    text: "今日の移動手段は？",
    subtext: "お店の検索範囲が変わるよ",
    type: "transport",
    choices: [
      { id: "5a", text: "徒歩", emoji: "🚶", range: 2 },
      { id: "5b", text: "自転車", emoji: "🚲", range: 3 },
      { id: "5c", text: "電車", emoji: "🚃", range: 4 },
      { id: "5d", text: "車", emoji: "🚗", range: 5 },
    ],
  },
  {
    id: 6,
    text: "重視するのは？",
    subtext: "一番大事なことを選んでね",
    type: "score",
    choices: [
      {
        id: "6a",
        text: "コスパ",
        emoji: "💪",
        scores: { heavyLight: 0, wafuYofu: 0, casualFormal: -2, adventurous: -1 },
      },
      {
        id: "6b",
        text: "雰囲気",
        emoji: "🕯️",
        scores: { heavyLight: 0, wafuYofu: 1, casualFormal: 2, adventurous: 0 },
      },
      {
        id: "6c",
        text: "ボリューム",
        emoji: "🍚",
        scores: { heavyLight: -2, wafuYofu: -1, casualFormal: -1, adventurous: -1 },
      },
      {
        id: "6d",
        text: "味の本格さ",
        emoji: "👨‍🍳",
        scores: { heavyLight: 0, wafuYofu: 0, casualFormal: 1, adventurous: 2 },
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
