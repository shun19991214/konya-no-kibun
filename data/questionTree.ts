import type { QuestionNode } from "@/types";
import { Q4_CHIPS } from "./q4chips";

// Q4チップのショートハンド
const h = Q4_CHIPS.private_room;       // 個室あり
const f = Q4_CHIPS.card_ok;            // カード可
const D = Q4_CHIPS.non_smoking;        // 禁煙席あり
const y = Q4_CHIPS.all_you_can_drink;  // 飲み放題
const x = Q4_CHIPS.late_night;         // 23時以降OK
const k = Q4_CHIPS.lunch;             // ランチあり
const j = Q4_CHIPS.parking;           // 駐車場あり

// ============================================================
// 質問ツリー v3: 間接質問方式
//
// 設計思想:
// 旧: 「何が食べたい？」→「どの肉？」→「予算は？」（直接質問＝答え丸わかり）
// 新: 「今日はどんな一日だった？」→「誰と？」→「気持ちは？」→「ピンとくるのは？」
//     （間接質問＝推論の飛躍が生まれる）
//
// 固定4ステップ:
// Q1: エネルギーレベル → ガッツリ系 or 軽め系
// Q2: シチュエーション → 客単価帯・雰囲気
// Q3: 感情・モード → 和洋中・味の方向性
// Q4: 五感の連想 → 最終ジャンル確定
// ============================================================

export const QUESTION_TREE: Record<string, QuestionNode> = {

  // ============================
  // Q1: 今日はどんな一日だった？
  // ============================
  q1: {
    id: "q1",
    question: "今日はどんな一日だった？",
    subtitle: "直感で選んでね",
    kibunExpression: "thinking",
    kibunSpeech: "うーん、今日はどんな日だった？",
    options: [
      { id: "exhausted", label: "ヘトヘト…がんばった", emoji: "😮‍💨", next: "q1-exhausted-q2" },
      { id: "hyper", label: "テンション高い！最高の日！", emoji: "🔥", next: "q1-hyper-q2" },
      { id: "normal", label: "まあまあ、いつも通り", emoji: "😌", next: "q1-normal-q2" },
      { id: "stressed", label: "モヤモヤ、ストレスたまった", emoji: "😤", next: "q1-stressed-q2" },
    ],
  },

  // ============================
  // Q2: 誰と食べる？（Q1の各分岐）
  // ============================

  // --- Q1:ヘトヘト → Q2 ---
  "q1-exhausted-q2": {
    id: "q1-exhausted-q2",
    question: "今夜、誰と食べる？",
    subtitle: "一緒にいる人を想像して",
    kibunExpression: "excited",
    kibunSpeech: "おつかれさま！えらい！",
    options: [
      { id: "solo", label: "ひとりで静かに", emoji: "🧘", next: "q2-exhausted-solo-q3" },
      { id: "partner", label: "パートナーと", emoji: "💑", next: "q2-exhausted-partner-q3" },
      { id: "friends", label: "友達・仲間と", emoji: "👯", next: "q2-exhausted-friends-q3" },
      { id: "family", label: "家族と", emoji: "👨‍👩‍👧", next: "q2-exhausted-family-q3" },
    ],
  },

  // --- Q1:テンション高い → Q2 ---
  "q1-hyper-q2": {
    id: "q1-hyper-q2",
    question: "今夜、誰と食べる？",
    subtitle: "このテンション、誰と共有する？",
    kibunExpression: "excited",
    kibunSpeech: "いい日だったんだね！",
    options: [
      { id: "solo", label: "ひとりで自分にご褒美", emoji: "🏆", next: "q2-hyper-solo-q3" },
      { id: "partner", label: "パートナーと特別な夜に", emoji: "💑", next: "q2-hyper-partner-q3" },
      { id: "friends", label: "友達とワイワイ！", emoji: "🎉", next: "q2-hyper-friends-q3" },
      { id: "family", label: "家族で楽しく", emoji: "👨‍👩‍👧", next: "q2-hyper-family-q3" },
    ],
  },

  // --- Q1:いつも通り → Q2 ---
  "q1-normal-q2": {
    id: "q1-normal-q2",
    question: "今夜、誰と食べる？",
    subtitle: "今日の相手は？",
    kibunExpression: "excited",
    kibunSpeech: "なるほどなるほど〜",
    options: [
      { id: "solo", label: "ひとりでサクッと", emoji: "🙋", next: "q2-normal-solo-q3" },
      { id: "partner", label: "パートナーと", emoji: "💑", next: "q2-normal-partner-q3" },
      { id: "friends", label: "友達と", emoji: "👫", next: "q2-normal-friends-q3" },
      { id: "family", label: "家族と", emoji: "👨‍👩‍👧", next: "q2-normal-family-q3" },
    ],
  },

  // --- Q1:ストレス → Q2 ---
  "q1-stressed-q2": {
    id: "q1-stressed-q2",
    question: "今夜、誰と食べる？",
    subtitle: "そのモヤモヤ、どうする？",
    kibunExpression: "excited",
    kibunSpeech: "大丈夫、美味しいもの食べよ！",
    options: [
      { id: "solo", label: "ひとりで発散！", emoji: "💥", next: "q2-stressed-solo-q3" },
      { id: "partner", label: "パートナーに愚痴りたい", emoji: "💑", next: "q2-stressed-partner-q3" },
      { id: "friends", label: "友達とガヤガヤ忘れたい", emoji: "🍻", next: "q2-stressed-friends-q3" },
      { id: "family", label: "家族の安心感がほしい", emoji: "🏠", next: "q2-stressed-family-q3" },
    ],
  },

  // ============================
  // Q3: 今の気持ちに近いのは？
  // ============================

  // --- ヘトヘト × ひとり → Q3 ---
  "q2-exhausted-solo-q3": {
    id: "q2-exhausted-solo-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "心の声を聞いてみて",
    kibunExpression: "confident",
    kibunSpeech: "見えてきた…！",
    options: [
      { id: "warm", label: "あったかいもので癒されたい", emoji: "🫖", next: "q3-warm-solo-q4" },
      { id: "reward", label: "自分にご褒美あげたい", emoji: "🎁", next: "q3-reward-solo-q4" },
      { id: "simple", label: "何も考えずにさっと食べたい", emoji: "💤", next: "q3-simple-solo-q4" },
    ],
  },

  // --- ヘトヘト × パートナー → Q3 ---
  "q2-exhausted-partner-q3": {
    id: "q2-exhausted-partner-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "ふたりの夜をイメージして",
    kibunExpression: "confident",
    kibunSpeech: "ふたりの時間かぁ…",
    options: [
      {
        id: "cozy", label: "ほっこり落ち着きたい", emoji: "🕯️",
        next: { type: "endpoint", genreIds: ["washoku"], resultLabel: "和食", resultDescription: "繊細な味わいで心を満たす", budgetLevel: "high", q4Options: [h, f, D], siblingHint: ["天ぷら", "寿司（本格派）"] },
      },
      {
        id: "treat", label: "ちょっと特別なことしたい", emoji: "✨",
        next: { type: "endpoint", genreIds: ["italian", "french"], resultLabel: "リストランテ", resultDescription: "特別な夜をイタリアンで", budgetLevel: "high", q4Options: [h, f, D], siblingHint: ["カジュアルイタリアン", "特別なステーキディナー"] },
      },
      {
        id: "easy", label: "ラクに美味しいものがいい", emoji: "😊",
        next: { type: "endpoint", genreIds: ["teishoku", "washoku"], resultLabel: "定食", resultDescription: "バランスの良い安心の一食", budgetLevel: "low", q4Options: [k, D], siblingHint: ["うどん・そば", "カフェごはん"] },
      },
    ],
  },

  // --- ヘトヘト × 友達 → Q3 ---
  "q2-exhausted-friends-q3": {
    id: "q2-exhausted-friends-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "仲間と過ごすイメージで",
    kibunExpression: "confident",
    kibunSpeech: "友達と労い合うんだね",
    options: [
      {
        id: "drink", label: "とりあえずカンパイしたい", emoji: "🍺",
        next: { type: "endpoint", genreIds: ["izakaya"], resultLabel: "居酒屋", resultDescription: "なんでもある安心感で乾杯", budgetLevel: "medium", q4Options: [y, h, x], siblingHint: ["焼き鳥で一杯", "ダイニングバー"] },
      },
      {
        id: "meat", label: "パワーチャージしたい", emoji: "⚡",
        next: { type: "endpoint", genreIds: ["yakiniku"], resultLabel: "焼肉（カジュアル）", resultDescription: "みんなでワイワイ焼肉パーティー", budgetLevel: "medium", q4Options: [y, h, j], siblingHint: ["焼肉（プレミアム）", "居酒屋"] },
      },
      {
        id: "chill", label: "まったりダラダラしたい", emoji: "🛋️",
        next: { type: "endpoint", genreIds: ["okonomiyaki"], resultLabel: "お好み焼き", resultDescription: "鉄板の上でジュージュー", budgetLevel: "low", q4Options: [y, x], siblingHint: ["居酒屋", "焼肉（カジュアル）"] },
      },
    ],
  },

  // --- ヘトヘト × 家族 → Q3 ---
  "q2-exhausted-family-q3": {
    id: "q2-exhausted-family-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "家族の夕食をイメージして",
    kibunExpression: "confident",
    kibunSpeech: "家族であったかい夜だね",
    options: [
      {
        id: "familiar", label: "いつもの安心感がほしい", emoji: "🏠",
        next: { type: "endpoint", genreIds: ["teishoku", "washoku"], resultLabel: "定食", resultDescription: "バランスの良い安心の一食", budgetLevel: "low", q4Options: [k, D], siblingHint: ["うどん・そば", "中華料理"] },
      },
      {
        id: "fun", label: "みんなで楽しくワイワイ", emoji: "🎪",
        next: { type: "endpoint", genreIds: ["chinese"], resultLabel: "中華料理", resultDescription: "火力と技の饗宴", budgetLevel: "medium", q4Options: [y, h, j], siblingHint: ["回転寿司", "お好み焼き"] },
      },
      {
        id: "turnTable", label: "みんなが好きなものを選びたい", emoji: "🔄",
        next: { type: "endpoint", genreIds: ["sushi"], resultLabel: "回転寿司", resultDescription: "気軽に楽しむ寿司パラダイス", budgetLevel: "low", q4Options: [j, D], siblingHint: ["中華料理", "定食"] },
      },
    ],
  },

  // ============================
  // Q3 → Q4: 五感の連想（最終決定）
  // ============================

  // --- あったかい × ひとり → Q4 ---
  "q3-warm-solo-q4": {
    id: "q3-warm-solo-q4",
    question: "ピンとくるのは？",
    subtitle: "浮かんだイメージで選んでね",
    kibunExpression: "confident",
    kibunSpeech: "あと少し…見えてきたぞ",
    options: [
      {
        id: "steam", label: "もくもく立ちのぼる湯気", emoji: "♨️",
        next: { type: "endpoint", genreIds: ["ramen"], resultLabel: "こってりラーメン", resultDescription: "濃厚スープに麺が絡む至福", budgetLevel: "low", q4Options: [x, j], siblingHint: ["あっさりラーメン", "うどん・そば"] },
      },
      {
        id: "dashi", label: "じんわり染みる出汁の香り", emoji: "🍵",
        next: { type: "endpoint", genreIds: ["udon_soba"], resultLabel: "うどん・そば", resultDescription: "出汁の優しさに包まれて", budgetLevel: "low", q4Options: [k, D], siblingHint: ["あっさりラーメン", "定食"] },
      },
      {
        id: "broth", label: "透き通ったスープの澄んだ味", emoji: "🥢",
        next: { type: "endpoint", genreIds: ["ramen"], resultLabel: "あっさりラーメン", resultDescription: "透き通るスープの深い旨味", budgetLevel: "low", q4Options: [x, j], siblingHint: ["こってりラーメン", "うどん・そば"] },
      },
    ],
  },

  // --- ご褒美 × ひとり → Q4 ---
  "q3-reward-solo-q4": {
    id: "q3-reward-solo-q4",
    question: "ピンとくるのは？",
    subtitle: "自分へのご褒美をイメージして",
    kibunExpression: "confident",
    kibunSpeech: "贅沢しちゃおう！",
    options: [
      {
        id: "counter", label: "目の前で仕上がる一皿", emoji: "🍣",
        next: { type: "endpoint", genreIds: ["sushi"], resultLabel: "寿司（本格派）", resultDescription: "職人の技を目の前で堪能", budgetLevel: "high", q4Options: [h, f], siblingHint: ["天ぷら", "和食"] },
      },
      {
        id: "sizzle", label: "ジュワッと焼ける肉の音", emoji: "🥩",
        next: { type: "endpoint", genreIds: ["steak", "french"], resultLabel: "特別なステーキディナー", resultDescription: "大切な人と特別なひとときを", budgetLevel: "high", q4Options: [h, f, D], siblingHint: ["ステーキ", "焼肉（プレミアム）"] },
      },
      {
        id: "crisp", label: "サクッと揚がる衣の食感", emoji: "✨",
        next: { type: "endpoint", genreIds: ["tempura", "washoku"], resultLabel: "天ぷら", resultDescription: "揚げたてサクサクの贅沢", budgetLevel: "medium", q4Options: [h, f], siblingHint: ["寿司（本格派）", "和食"] },
      },
    ],
  },

  // --- さっと食べたい × ひとり → Q4 ---
  "q3-simple-solo-q4": {
    id: "q3-simple-solo-q4",
    question: "ピンとくるのは？",
    subtitle: "深く考えなくて大丈夫",
    kibunExpression: "confident",
    kibunSpeech: "もう少しで当てるよ…",
    options: [
      {
        id: "noodle", label: "ズズッとすすれるもの", emoji: "🌀",
        next: { type: "endpoint", genreIds: ["ramen", "udon_soba"], resultLabel: "さらっと麺", resultDescription: "あったかい一杯でほっこり", budgetLevel: "low", q4Options: [x, D], siblingHint: ["カフェごはん", "定食"] },
      },
      {
        id: "rice", label: "白ごはんをかきこみたい", emoji: "🍚",
        next: { type: "endpoint", genreIds: ["curry"], resultLabel: "カレー", resultDescription: "スパイスの魔法で元気チャージ", budgetLevel: "low", q4Options: [k, D], siblingHint: ["定食", "中華料理"] },
      },
      {
        id: "quiet", label: "静かな空間でぼんやり", emoji: "☕",
        next: { type: "endpoint", genreIds: ["cafe"], resultLabel: "カフェごはん", resultDescription: "ゆったりと美味しいひととき", budgetLevel: "low", q4Options: [k, D], siblingHint: ["ヘルシーごはん", "うどん・そば"] },
      },
    ],
  },

  // ============================
  // テンション高い系
  // ============================

  // --- ハイ × ひとり → Q3 ---
  "q2-hyper-solo-q3": {
    id: "q2-hyper-solo-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "最高の日にふさわしいのは？",
    kibunExpression: "confident",
    kibunSpeech: "テンション高い！いいね！",
    options: [
      {
        id: "luxury", label: "自分を思いっきり甘やかしたい", emoji: "👑",
        next: { type: "endpoint", genreIds: ["yakiniku"], resultLabel: "焼肉（プレミアム）", resultDescription: "上質な肉を味わう特別な夜", budgetLevel: "high", q4Options: [h, f, D], siblingHint: ["寿司（本格派）", "特別なステーキディナー"] },
      },
      {
        id: "bold", label: "ガツンと攻めたい！", emoji: "💪",
        next: { type: "endpoint", genreIds: ["ramen"], resultLabel: "つけ麺", resultDescription: "太麺を濃厚つけ汁にダイブ", budgetLevel: "low", q4Options: [x, j], siblingHint: ["こってりラーメン", "ハンバーガー"] },
      },
      {
        id: "explore", label: "いつもと違うことしたい", emoji: "🧭",
        next: { type: "endpoint", genreIds: ["korean", "yakiniku"], resultLabel: "韓国料理", resultDescription: "辛さと旨さのハーモニー", budgetLevel: "medium", q4Options: [y, x], siblingHint: ["タイ料理", "カレー"] },
      },
    ],
  },

  // --- ハイ × パートナー → Q3 ---
  "q2-hyper-partner-q3": {
    id: "q2-hyper-partner-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "特別な夜のイメージは？",
    kibunExpression: "confident",
    kibunSpeech: "大切な人との夜か…",
    options: [
      {
        id: "romantic", label: "ムードのある空間でゆったり", emoji: "🌙",
        next: { type: "endpoint", genreIds: ["italian", "french"], resultLabel: "リストランテ", resultDescription: "特別な夜をイタリアンで", budgetLevel: "high", q4Options: [h, f, D], siblingHint: ["特別なステーキディナー", "和食"] },
      },
      {
        id: "lively", label: "一緒にキャッキャ楽しみたい", emoji: "🎵",
        next: { type: "endpoint", genreIds: ["yakiniku"], resultLabel: "焼肉（カジュアル）", resultDescription: "みんなでワイワイ焼肉パーティー", budgetLevel: "medium", q4Options: [y, h, j], siblingHint: ["お好み焼き", "居酒屋"] },
      },
      {
        id: "elegant", label: "とっておきの場所に連れて行きたい", emoji: "💎",
        next: { type: "endpoint", genreIds: ["sushi"], resultLabel: "寿司（本格派）", resultDescription: "職人の技を目の前で堪能", budgetLevel: "high", q4Options: [h, f], siblingHint: ["和食", "リストランテ"] },
      },
    ],
  },

  // --- ハイ × 友達 → Q3 ---
  "q2-hyper-friends-q3": {
    id: "q2-hyper-friends-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "みんなでどう盛り上がる？",
    kibunExpression: "confident",
    kibunSpeech: "パーティーだね！",
    options: [
      { id: "cheers", label: "まずは乾杯！飲みたい！", emoji: "🍻", next: "q3-hyper-friends-cheers-q4" },
      {
        id: "feast", label: "みんなで肉を焼きまくりたい！", emoji: "🔥",
        next: { type: "endpoint", genreIds: ["yakiniku"], resultLabel: "焼肉（カジュアル）", resultDescription: "みんなでワイワイ焼肉パーティー", budgetLevel: "medium", q4Options: [y, h, j], siblingHint: ["焼肉（プレミアム）", "お好み焼き"] },
      },
      {
        id: "share", label: "いろんな料理をシェアしたい", emoji: "🍽️",
        next: { type: "endpoint", genreIds: ["chinese"], resultLabel: "中華料理", resultDescription: "火力と技の饗宴", budgetLevel: "medium", q4Options: [y, h, j], siblingHint: ["カジュアルイタリアン", "居酒屋"] },
      },
    ],
  },

  // --- ハイ × 友達 × 乾杯 → Q4 ---
  "q3-hyper-friends-cheers-q4": {
    id: "q3-hyper-friends-cheers-q4",
    question: "ピンとくるのは？",
    subtitle: "乾杯のイメージは？",
    kibunExpression: "confident",
    kibunSpeech: "あと少し…当てるよ！",
    options: [
      {
        id: "lantern", label: "赤提灯のあったかい灯り", emoji: "🏮",
        next: { type: "endpoint", genreIds: ["izakaya"], resultLabel: "居酒屋", resultDescription: "なんでもある安心感で乾杯", budgetLevel: "medium", q4Options: [y, h, x], siblingHint: ["焼き鳥で一杯", "ダイニングバー"] },
      },
      {
        id: "charcoal", label: "煙と炭火の香り", emoji: "💨",
        next: { type: "endpoint", genreIds: ["yakitori", "izakaya"], resultLabel: "焼き鳥で一杯", resultDescription: "炭火の香りをアテに至福の一杯", budgetLevel: "low", q4Options: [y, x], siblingHint: ["居酒屋", "ダイニングバー"] },
      },
      {
        id: "stylish", label: "おしゃれなカクテルグラス", emoji: "🍸",
        next: { type: "endpoint", genreIds: ["dining_bar"], resultLabel: "ダイニングバー", resultDescription: "おしゃれ空間で大人の時間", budgetLevel: "medium", q4Options: [x, f, D], siblingHint: ["居酒屋", "カジュアルイタリアン"] },
      },
    ],
  },

  // --- ハイ × 家族 → Q3 ---
  "q2-hyper-family-q3": {
    id: "q2-hyper-family-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "家族でどう楽しむ？",
    kibunExpression: "confident",
    kibunSpeech: "家族と最高の夜だ！",
    options: [
      {
        id: "interactive", label: "みんなで作る楽しさ", emoji: "🤲",
        next: { type: "endpoint", genreIds: ["okonomiyaki"], resultLabel: "お好み焼き", resultDescription: "鉄板の上でジュージュー", budgetLevel: "low", q4Options: [y, x], siblingHint: ["焼肉（カジュアル）", "回転寿司"] },
      },
      {
        id: "pick", label: "好きなものを好きなだけ", emoji: "🔄",
        next: { type: "endpoint", genreIds: ["sushi"], resultLabel: "回転寿司", resultDescription: "気軽に楽しむ寿司パラダイス", budgetLevel: "low", q4Options: [j, D], siblingHint: ["中華料理", "焼肉（カジュアル）"] },
      },
      {
        id: "big_plate", label: "大皿でドーンと豪快に", emoji: "🍖",
        next: { type: "endpoint", genreIds: ["steak", "hamburger"], resultLabel: "ステーキ", resultDescription: "ジューシーな肉をがっつりと", budgetLevel: "medium", q4Options: [k, j], siblingHint: ["中華料理", "焼肉（カジュアル）"] },
      },
    ],
  },

  // ============================
  // いつも通り系
  // ============================

  // --- ふつう × ひとり → Q3 ---
  "q2-normal-solo-q3": {
    id: "q2-normal-solo-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "今夜の自分の声を聞いて",
    kibunExpression: "confident",
    kibunSpeech: "ふむふむ…見えてきた！",
    options: [
      {
        id: "autopilot", label: "考えたくない、いつも通りでいい", emoji: "🔁",
        next: { type: "endpoint", genreIds: ["teishoku", "washoku"], resultLabel: "定食", resultDescription: "バランスの良い安心の一食", budgetLevel: "low", q4Options: [k, D], siblingHint: ["カレー", "うどん・そば"] },
      },
      { id: "curious", label: "ちょっと冒険してみようかな", emoji: "🗺️", next: "q3-normal-solo-curious-q4" },
      {
        id: "hungry", label: "なんかガッツリ食べたいかも", emoji: "🍖",
        next: { type: "endpoint", genreIds: ["hamburger"], resultLabel: "ハンバーガー", resultDescription: "豪快にかぶりつく至福", budgetLevel: "low", q4Options: [k, j], siblingHint: ["ステーキ", "こってりラーメン"] },
      },
    ],
  },

  // --- ふつう × ひとり × 冒険 → Q4 ---
  "q3-normal-solo-curious-q4": {
    id: "q3-normal-solo-curious-q4",
    question: "ピンとくるのは？",
    subtitle: "冒険のイメージは？",
    kibunExpression: "confident",
    kibunSpeech: "冒険好きだね…当てるよ！",
    options: [
      {
        id: "spice", label: "知らないスパイスの香り", emoji: "🌶️",
        next: { type: "endpoint", genreIds: ["thai_vietnam"], resultLabel: "タイ料理", resultDescription: "辛・酸・甘のハーモニー", budgetLevel: "medium", q4Options: [y, k], siblingHint: ["ベトナム料理", "カレー"] },
      },
      {
        id: "herbs", label: "さわやかなハーブの風", emoji: "🌿",
        next: { type: "endpoint", genreIds: ["thai_vietnam"], resultLabel: "ベトナム料理", resultDescription: "ヘルシーで優しいアジアの風", budgetLevel: "medium", q4Options: [k, D], siblingHint: ["タイ料理", "ヘルシーごはん"] },
      },
      {
        id: "buzz", label: "異国のにぎやかな食堂", emoji: "🌍",
        next: { type: "endpoint", genreIds: ["korean", "yakiniku"], resultLabel: "韓国料理", resultDescription: "辛さと旨さのハーモニー", budgetLevel: "medium", q4Options: [y, x], siblingHint: ["中華料理", "タイ料理"] },
      },
    ],
  },

  // --- ふつう × パートナー → Q3 ---
  "q2-normal-partner-q3": {
    id: "q2-normal-partner-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "ふたりの夜の空気は？",
    kibunExpression: "confident",
    kibunSpeech: "いい感じに見えてきた！",
    options: [
      {
        id: "casual_date", label: "カジュアルに楽しく", emoji: "😄",
        next: { type: "endpoint", genreIds: ["italian"], resultLabel: "カジュアルイタリアン", resultDescription: "気軽に楽しむイタリアの味", budgetLevel: "medium", q4Options: [k, D], siblingHint: ["リストランテ", "ダイニングバー"] },
      },
      {
        id: "quiet_night", label: "しっとり穏やかに", emoji: "🌙",
        next: { type: "endpoint", genreIds: ["washoku"], resultLabel: "和食", resultDescription: "繊細な味わいで心を満たす", budgetLevel: "high", q4Options: [h, f, D], siblingHint: ["寿司（本格派）", "天ぷら"] },
      },
      {
        id: "surprise", label: "相手をちょっと驚かせたい", emoji: "🎁",
        next: { type: "endpoint", genreIds: ["steak", "french"], resultLabel: "特別なステーキディナー", resultDescription: "大切な人と特別なひとときを", budgetLevel: "high", q4Options: [h, f, D], siblingHint: ["リストランテ", "寿司（本格派）"] },
      },
    ],
  },

  // --- ふつう × 友達 → Q3 ---
  "q2-normal-friends-q3": {
    id: "q2-normal-friends-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "友達との時間のイメージは？",
    kibunExpression: "confident",
    kibunSpeech: "友達と今夜かぁ…",
    options: [
      {
        id: "talk", label: "おしゃべりが止まらなそう", emoji: "💬",
        next: { type: "endpoint", genreIds: ["dining_bar", "italian"], resultLabel: "女子会向きのお店", resultDescription: "おしゃれで美味しい、女子会にぴったり", budgetLevel: "medium", q4Options: [y, h, D], siblingHint: ["ダイニングバー", "カジュアルイタリアン"] },
      },
      {
        id: "noisy", label: "ガヤガヤ気にせず楽しみたい", emoji: "🎤",
        next: { type: "endpoint", genreIds: ["izakaya"], resultLabel: "居酒屋", resultDescription: "なんでもある安心感で乾杯", budgetLevel: "medium", q4Options: [y, h, x], siblingHint: ["焼き鳥で一杯", "焼肉（カジュアル）"] },
      },
      {
        id: "cook_together", label: "一緒に焼いたり作ったりしたい", emoji: "🫕",
        next: { type: "endpoint", genreIds: ["okonomiyaki"], resultLabel: "お好み焼き", resultDescription: "鉄板の上でジュージュー", budgetLevel: "low", q4Options: [y, x], siblingHint: ["焼肉（カジュアル）", "居酒屋"] },
      },
    ],
  },

  // --- ふつう × 家族 → Q3 ---
  "q2-normal-family-q3": {
    id: "q2-normal-family-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "家族の夕食をイメージして",
    kibunExpression: "confident",
    kibunSpeech: "家族でごはんだね",
    options: [
      {
        id: "speed", label: "パパッと早く食べたい", emoji: "⏰",
        next: { type: "endpoint", genreIds: ["curry"], resultLabel: "カレー", resultDescription: "スパイスの魔法で元気チャージ", budgetLevel: "low", q4Options: [k, D], siblingHint: ["定食", "ハンバーガー"] },
      },
      {
        id: "kids_happy", label: "子どもが喜ぶ顔が見たい", emoji: "😆",
        next: { type: "endpoint", genreIds: ["hamburger"], resultLabel: "ハンバーガー", resultDescription: "豪快にかぶりつく至福", budgetLevel: "low", q4Options: [k, j], siblingHint: ["回転寿司", "カレー"] },
      },
      {
        id: "balanced", label: "バランスよく色々食べたい", emoji: "🍱",
        next: { type: "endpoint", genreIds: ["chinese"], resultLabel: "中華料理", resultDescription: "火力と技の饗宴", budgetLevel: "medium", q4Options: [y, h, j], siblingHint: ["回転寿司", "定食"] },
      },
    ],
  },

  // ============================
  // ストレス系
  // ============================

  // --- ストレス × ひとり → Q3 ---
  "q2-stressed-solo-q3": {
    id: "q2-stressed-solo-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "そのモヤモヤ、食で解消！",
    kibunExpression: "confident",
    kibunSpeech: "溜まってるんだね…任せて！",
    options: [
      { id: "destroy", label: "ガツンとパンチのあるもので吹き飛ばしたい", emoji: "👊", next: "q3-stressed-solo-destroy-q4" },
      {
        id: "heal", label: "やさしい味でじんわり癒されたい", emoji: "🫂",
        next: { type: "endpoint", genreIds: ["udon_soba"], resultLabel: "うどん・そば", resultDescription: "出汁の優しさに包まれて", budgetLevel: "low", q4Options: [k, D], siblingHint: ["カフェごはん", "定食"] },
      },
      {
        id: "spice", label: "刺激的な味で気分を変えたい", emoji: "🌶️",
        next: { type: "endpoint", genreIds: ["korean", "yakiniku"], resultLabel: "韓国料理", resultDescription: "辛さと旨さのハーモニー", budgetLevel: "medium", q4Options: [y, x], siblingHint: ["タイ料理", "カレー"] },
      },
    ],
  },

  // --- ストレス × ひとり × ガツン → Q4 ---
  "q3-stressed-solo-destroy-q4": {
    id: "q3-stressed-solo-destroy-q4",
    question: "ピンとくるのは？",
    subtitle: "ストレス吹き飛ばすイメージは？",
    kibunExpression: "confident",
    kibunSpeech: "あと少し…当てるぞ！",
    options: [
      {
        id: "thick_soup", label: "ドロッと濃厚なスープ", emoji: "🍜",
        next: { type: "endpoint", genreIds: ["ramen"], resultLabel: "こってりラーメン", resultDescription: "濃厚スープに麺が絡む至福", budgetLevel: "low", q4Options: [x, j], siblingHint: ["つけ麺", "あっさりラーメン"] },
      },
      {
        id: "bite", label: "がぶっとかぶりつく", emoji: "🍔",
        next: { type: "endpoint", genreIds: ["hamburger"], resultLabel: "ハンバーガー", resultDescription: "豪快にかぶりつく至福", budgetLevel: "low", q4Options: [k, j], siblingHint: ["ステーキ", "焼肉（カジュアル）"] },
      },
      {
        id: "fire", label: "目の前で炎が上がる肉", emoji: "🔥",
        next: { type: "endpoint", genreIds: ["steak", "hamburger"], resultLabel: "ステーキ", resultDescription: "ジューシーな肉をがっつりと", budgetLevel: "medium", q4Options: [k, j], siblingHint: ["焼肉（カジュアル）", "ハンバーガー"] },
      },
    ],
  },

  // --- ストレス × パートナー → Q3 ---
  "q2-stressed-partner-q3": {
    id: "q2-stressed-partner-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "パートナーとの夜のイメージ",
    kibunExpression: "confident",
    kibunSpeech: "話を聞いてくれる人がいるっていいね",
    options: [
      {
        id: "comfort", label: "安心できる味でほっとしたい", emoji: "🍵",
        next: { type: "endpoint", genreIds: ["washoku"], resultLabel: "和食", resultDescription: "繊細な味わいで心を満たす", budgetLevel: "high", q4Options: [h, f, D], siblingHint: ["定食", "うどん・そば"] },
      },
      {
        id: "cheer_up", label: "気分を上げるために美味しいもの！", emoji: "🎉",
        next: { type: "endpoint", genreIds: ["yakiniku"], resultLabel: "焼肉（カジュアル）", resultDescription: "みんなでワイワイ焼肉パーティー", budgetLevel: "medium", q4Options: [y, h, j], siblingHint: ["焼肉（プレミアム）", "ステーキ"] },
      },
      {
        id: "wine", label: "お酒飲みながらゆっくり話したい", emoji: "🍷",
        next: { type: "endpoint", genreIds: ["dining_bar"], resultLabel: "ダイニングバー", resultDescription: "おしゃれ空間で大人の時間", budgetLevel: "medium", q4Options: [x, f, D], siblingHint: ["カジュアルイタリアン", "居酒屋"] },
      },
    ],
  },

  // --- ストレス × 友達 → Q3 ---
  "q2-stressed-friends-q3": {
    id: "q2-stressed-friends-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "友達とモヤモヤ発散！",
    kibunExpression: "confident",
    kibunSpeech: "友達と発散するんだね！",
    options: [
      {
        id: "loud", label: "うるさいくらいがちょうどいい", emoji: "📢",
        next: { type: "endpoint", genreIds: ["izakaya"], resultLabel: "居酒屋", resultDescription: "なんでもある安心感で乾杯", budgetLevel: "medium", q4Options: [y, h, x], siblingHint: ["焼き鳥で一杯", "焼肉（カジュアル）"] },
      },
      {
        id: "burn", label: "肉でも焼いてストレス燃やしたい", emoji: "🥩",
        next: { type: "endpoint", genreIds: ["yakiniku"], resultLabel: "焼肉（カジュアル）", resultDescription: "みんなでワイワイ焼肉パーティー", budgetLevel: "medium", q4Options: [y, h, j], siblingHint: ["焼肉（プレミアム）", "お好み焼き"] },
      },
      {
        id: "girls_night", label: "おしゃれな場所でテンション上げたい", emoji: "💅",
        next: { type: "endpoint", genreIds: ["dining_bar", "italian"], resultLabel: "女子会向きのお店", resultDescription: "おしゃれで美味しい、女子会にぴったり", budgetLevel: "medium", q4Options: [y, h, D], siblingHint: ["ダイニングバー", "カジュアルイタリアン"] },
      },
    ],
  },

  // --- ストレス × 家族 → Q3 ---
  "q2-stressed-family-q3": {
    id: "q2-stressed-family-q3",
    question: "今の気持ちに近いのは？",
    subtitle: "家族のそばで充電しよう",
    kibunExpression: "confident",
    kibunSpeech: "家族がいれば大丈夫！",
    options: [
      {
        id: "nostalgic", label: "懐かしい味にほっとしたい", emoji: "🏡",
        next: { type: "endpoint", genreIds: ["teishoku", "washoku"], resultLabel: "定食", resultDescription: "バランスの良い安心の一食", budgetLevel: "low", q4Options: [k, D], siblingHint: ["うどん・そば", "カレー"] },
      },
      {
        id: "forget_it", label: "食べて忘れたい！パーッと！", emoji: "🎊",
        next: { type: "endpoint", genreIds: ["sushi"], resultLabel: "回転寿司", resultDescription: "気軽に楽しむ寿司パラダイス", budgetLevel: "low", q4Options: [j, D], siblingHint: ["焼肉（カジュアル）", "中華料理"] },
      },
      {
        id: "warm_belly", label: "あったかいものでお腹を満たしたい", emoji: "🫕",
        next: { type: "endpoint", genreIds: ["ramen", "udon_soba"], resultLabel: "さらっと麺", resultDescription: "あったかい一杯でほっこり", budgetLevel: "low", q4Options: [x, D], siblingHint: ["うどん・そば", "定食"] },
      },
    ],
  },
};
