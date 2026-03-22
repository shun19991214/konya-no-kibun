import type { QuestionNode } from "@/types";
import { Q4_CHIPS } from "./q4chips";

const C = Q4_CHIPS;

export const QUESTION_TREE: Record<string, QuestionNode> = {
  // ==================== Q1 ====================
  q1: {
    id: "q1",
    question: "今夜はどんな気分？",
    subtitle: "直感で選んでね",
    kibunExpression: "thinking",
    kibunSpeech: "うーん、今夜は何が食べたい？",
    options: [
      { id: "meat", label: "ガッツリお肉！", emoji: "🥩", next: "q1-meat-q2" },
      { id: "japanese", label: "和食で落ち着きたい", emoji: "🍱", next: "q1-japanese-q2" },
      { id: "noodle", label: "麺をすすりたい", emoji: "🍜", next: "q1-noodle-q2" },
      { id: "world", label: "海外気分を味わいたい", emoji: "🌍", next: "q1-world-q2" },
      { id: "drink", label: "とりあえず飲みたい", emoji: "🍻", next: "q1-drink-q2" },
      { id: "light", label: "軽めでいい", emoji: "🥗", next: "q1-light-q2" },
      { id: "omakase", label: "おまかせで！", emoji: "🎲", next: "q1-omakase-q2" },
    ],
  },

  // ==================== Q2: 肉ルート ====================
  "q1-meat-q2": {
    id: "q1-meat-q2",
    question: "どんなお肉の気分？",
    subtitle: "肉汁が溢れるのを想像して",
    kibunExpression: "excited",
    kibunSpeech: "お肉！いいね〜！",
    options: [
      { id: "yakiniku", label: "自分で焼きたい！焼肉", emoji: "🔥", next: "q2-meat-yakiniku-q3" },
      { id: "steak", label: "ドーンとステーキ・ハンバーグ", emoji: "🥩", next: "q2-meat-steak-q3" },
      {
        id: "yakitori", label: "串で一杯、焼き鳥", emoji: "🍢",
        next: {
          type: "endpoint",
          genreIds: ["yakitori", "izakaya"],
          resultLabel: "焼き鳥",
          resultDescription: "炭火の香りと一杯の幸せ",
          budgetLevel: "low",
          q4Options: [C.all_you_can_drink, C.late_night, C.private_room],
          siblingHint: ["焼肉（カジュアル）", "ステーキ", "ハンバーガー"],
        },
      },
      {
        id: "hamburger", label: "かぶりつくハンバーガー", emoji: "🍔",
        next: {
          type: "endpoint",
          genreIds: ["hamburger"],
          resultLabel: "ハンバーガー",
          resultDescription: "豪快にかぶりつく至福",
          budgetLevel: "low",
          q4Options: [C.lunch, C.parking],
          siblingHint: ["焼き鳥", "ステーキ", "焼肉（カジュアル）"],
        },
      },
    ],
  },

  // Q3: 焼肉 → 予算
  "q2-meat-yakiniku-q3": {
    id: "q2-meat-yakiniku-q3",
    question: "焼肉の予算感は？",
    subtitle: "お財布と相談",
    kibunExpression: "confident",
    kibunSpeech: "あと少し…見えてきたぞ",
    options: [
      {
        id: "casual", label: "食べ放題でワイワイ", emoji: "🎉",
        next: {
          type: "endpoint",
          genreIds: ["yakiniku"],
          resultLabel: "焼肉（カジュアル）",
          resultDescription: "みんなでワイワイ焼肉パーティー",
          budgetLevel: "medium",
          q4Options: [C.all_you_can_drink, C.private_room, C.parking],
          siblingHint: ["焼肉（プレミアム）"],
        },
      },
      {
        id: "premium", label: "ちょっといい焼肉", emoji: "✨",
        next: {
          type: "endpoint",
          genreIds: ["yakiniku"],
          resultLabel: "焼肉（プレミアム）",
          resultDescription: "上質な肉を味わう特別な夜",
          budgetLevel: "high",
          q4Options: [C.private_room, C.card_ok, C.non_smoking],
          siblingHint: ["焼肉（カジュアル）"],
        },
      },
    ],
  },

  // Q3: ステーキ → 雰囲気
  "q2-meat-steak-q3": {
    id: "q2-meat-steak-q3",
    question: "どんな雰囲気で食べたい？",
    subtitle: "お肉の楽しみ方いろいろ",
    kibunExpression: "confident",
    kibunSpeech: "なるほどなるほど…",
    options: [
      {
        id: "casual", label: "カジュアルにがっつり", emoji: "💪",
        next: {
          type: "endpoint",
          genreIds: ["steak", "hamburger"],
          resultLabel: "ステーキ",
          resultDescription: "ジューシーな肉をがっつりと",
          budgetLevel: "medium",
          q4Options: [C.lunch, C.parking],
          siblingHint: ["特別なステーキディナー"],
        },
      },
      {
        id: "fancy", label: "記念日・デートで特別に", emoji: "🥂",
        next: {
          type: "endpoint",
          genreIds: ["steak", "french"],
          resultLabel: "特別なステーキディナー",
          resultDescription: "大切な人と特別なひとときを",
          budgetLevel: "high",
          q4Options: [C.private_room, C.card_ok, C.non_smoking],
          siblingHint: ["ステーキ"],
        },
      },
    ],
  },

  // ==================== Q2: 和食ルート ====================
  "q1-japanese-q2": {
    id: "q1-japanese-q2",
    question: "和食、何が食べたい？",
    subtitle: "日本の味を楽しもう",
    kibunExpression: "excited",
    kibunSpeech: "和食かぁ、いいねぇ",
    options: [
      { id: "sushi", label: "お寿司が食べたい", emoji: "🍣", next: "q2-japanese-sushi-q3" },
      {
        id: "tempura", label: "サクッと天ぷら", emoji: "🍤",
        next: {
          type: "endpoint",
          genreIds: ["tempura", "washoku"],
          resultLabel: "天ぷら",
          resultDescription: "揚げたてサクサクの贅沢",
          budgetLevel: "medium",
          q4Options: [C.private_room, C.card_ok],
          siblingHint: ["寿司（本格派）", "定食", "和食"],
        },
      },
      {
        id: "teishoku", label: "定食でほっこり", emoji: "🍚",
        next: {
          type: "endpoint",
          genreIds: ["teishoku", "washoku"],
          resultLabel: "定食",
          resultDescription: "バランスの良い安心の一食",
          budgetLevel: "low",
          q4Options: [C.lunch, C.non_smoking],
          siblingHint: ["天ぷら", "うどん・そば"],
        },
      },
      {
        id: "washoku", label: "しっぽり和の空間で", emoji: "🏯",
        next: {
          type: "endpoint",
          genreIds: ["washoku"],
          resultLabel: "和食",
          resultDescription: "繊細な味わいで心を満たす",
          budgetLevel: "high",
          q4Options: [C.private_room, C.card_ok, C.non_smoking],
          siblingHint: ["寿司（本格派）", "天ぷら"],
        },
      },
    ],
  },

  // Q3: 寿司 → 予算
  "q2-japanese-sushi-q3": {
    id: "q2-japanese-sushi-q3",
    question: "どんなお寿司の気分？",
    subtitle: "ネタの新鮮さを想像して",
    kibunExpression: "confident",
    kibunSpeech: "お寿司…見えてきた！",
    options: [
      {
        id: "conveyor", label: "回転寿司でワイワイ", emoji: "🔄",
        next: {
          type: "endpoint",
          genreIds: ["sushi"],
          resultLabel: "回転寿司",
          resultDescription: "気軽に楽しむ寿司パラダイス",
          budgetLevel: "low",
          q4Options: [C.parking, C.non_smoking],
          siblingHint: ["寿司（本格派）"],
        },
      },
      {
        id: "counter", label: "カウンターで握りたて", emoji: "🍣",
        next: {
          type: "endpoint",
          genreIds: ["sushi"],
          resultLabel: "寿司（本格派）",
          resultDescription: "職人の技を目の前で堪能",
          budgetLevel: "high",
          q4Options: [C.private_room, C.card_ok],
          siblingHint: ["回転寿司"],
        },
      },
    ],
  },

  // ==================== Q2: 麺ルート ====================
  "q1-noodle-q2": {
    id: "q1-noodle-q2",
    question: "どんな麺の気分？",
    subtitle: "ズズッとすすろう",
    kibunExpression: "excited",
    kibunSpeech: "麺！最高じゃん！",
    options: [
      { id: "ramen", label: "ラーメン！", emoji: "🍜", next: "q2-noodle-ramen-q3" },
      {
        id: "udon_soba", label: "うどん・そば", emoji: "🥢",
        next: {
          type: "endpoint",
          genreIds: ["udon_soba"],
          resultLabel: "うどん・そば",
          resultDescription: "出汁の優しさに包まれて",
          budgetLevel: "low",
          q4Options: [C.lunch, C.non_smoking],
          siblingHint: ["こってりラーメン", "パスタ"],
        },
      },
      {
        id: "pasta", label: "パスタ・イタリアン", emoji: "🍝",
        next: {
          type: "endpoint",
          genreIds: ["italian"],
          resultLabel: "パスタ",
          resultDescription: "アルデンテの幸福",
          budgetLevel: "medium",
          q4Options: [C.lunch, C.non_smoking, C.card_ok],
          siblingHint: ["うどん・そば", "こってりラーメン"],
        },
      },
      {
        id: "okonomiyaki", label: "お好み焼き・もんじゃ", emoji: "🥞",
        next: {
          type: "endpoint",
          genreIds: ["okonomiyaki"],
          resultLabel: "お好み焼き",
          resultDescription: "鉄板の上でジュージュー",
          budgetLevel: "low",
          q4Options: [C.all_you_can_drink, C.late_night],
          siblingHint: ["ラーメン", "うどん・そば"],
        },
      },
    ],
  },

  // Q3: ラーメン → こだわり
  "q2-noodle-ramen-q3": {
    id: "q2-noodle-ramen-q3",
    question: "ラーメンのこだわりは？",
    subtitle: "一杯入魂",
    kibunExpression: "confident",
    kibunSpeech: "ラーメンにはこだわりがあるよね",
    options: [
      {
        id: "rich", label: "こってり濃厚", emoji: "🔥",
        next: {
          type: "endpoint",
          genreIds: ["ramen"],
          resultLabel: "こってりラーメン",
          resultDescription: "濃厚スープに麺が絡む至福",
          budgetLevel: "low",
          q4Options: [C.late_night, C.parking],
          siblingHint: ["あっさりラーメン", "つけ麺"],
        },
      },
      {
        id: "light", label: "あっさりさっぱり", emoji: "🌿",
        next: {
          type: "endpoint",
          genreIds: ["ramen"],
          resultLabel: "あっさりラーメン",
          resultDescription: "透き通るスープの深い旨味",
          budgetLevel: "low",
          q4Options: [C.late_night, C.parking],
          siblingHint: ["こってりラーメン", "つけ麺"],
        },
      },
      {
        id: "tsukemen", label: "つけ麺でがっつり", emoji: "🍜",
        next: {
          type: "endpoint",
          genreIds: ["ramen"],
          resultLabel: "つけ麺",
          resultDescription: "太麺を濃厚つけ汁にダイブ",
          budgetLevel: "low",
          q4Options: [C.late_night, C.parking],
          siblingHint: ["こってりラーメン", "あっさりラーメン"],
        },
      },
    ],
  },

  // ==================== Q2: 海外ルート ====================
  "q1-world-q2": {
    id: "q1-world-q2",
    question: "どこの国の気分？",
    subtitle: "世界の味を旅しよう",
    kibunExpression: "excited",
    kibunSpeech: "世界旅行気分だね！",
    options: [
      { id: "italian", label: "イタリアン", emoji: "🇮🇹", next: "q2-world-italian-q3" },
      {
        id: "chinese", label: "中華", emoji: "🇨🇳",
        next: {
          type: "endpoint",
          genreIds: ["chinese"],
          resultLabel: "中華料理",
          resultDescription: "火力と技の饗宴",
          budgetLevel: "medium",
          q4Options: [C.all_you_can_drink, C.private_room, C.parking],
          siblingHint: ["韓国料理", "カレー"],
        },
      },
      {
        id: "korean", label: "韓国料理", emoji: "🇰🇷",
        next: {
          type: "endpoint",
          genreIds: ["korean", "yakiniku"],
          resultLabel: "韓国料理",
          resultDescription: "辛さと旨さのハーモニー",
          budgetLevel: "medium",
          q4Options: [C.all_you_can_drink, C.late_night],
          siblingHint: ["中華料理", "タイ料理"],
        },
      },
      { id: "asian", label: "タイ・ベトナム・アジアン", emoji: "🌴", next: "q2-world-asian-q3" },
      {
        id: "curry", label: "カレー", emoji: "🍛",
        next: {
          type: "endpoint",
          genreIds: ["curry"],
          resultLabel: "カレー",
          resultDescription: "スパイスの魔法で元気チャージ",
          budgetLevel: "low",
          q4Options: [C.lunch, C.non_smoking],
          siblingHint: ["タイ料理", "中華料理"],
        },
      },
    ],
  },

  // Q3: イタリアン → 雰囲気
  "q2-world-italian-q3": {
    id: "q2-world-italian-q3",
    question: "どんな雰囲気で？",
    subtitle: "ボーノ！",
    kibunExpression: "confident",
    kibunSpeech: "イタリアン…もう少しで当てるよ",
    options: [
      {
        id: "casual", label: "カジュアルにピザ・パスタ", emoji: "🍕",
        next: {
          type: "endpoint",
          genreIds: ["italian"],
          resultLabel: "カジュアルイタリアン",
          resultDescription: "気軽に楽しむイタリアの味",
          budgetLevel: "medium",
          q4Options: [C.lunch, C.non_smoking],
          siblingHint: ["リストランテ"],
        },
      },
      {
        id: "fancy", label: "おしゃれなリストランテ", emoji: "🥂",
        next: {
          type: "endpoint",
          genreIds: ["italian", "french"],
          resultLabel: "リストランテ",
          resultDescription: "特別な夜をイタリアンで",
          budgetLevel: "high",
          q4Options: [C.private_room, C.card_ok, C.non_smoking],
          siblingHint: ["カジュアルイタリアン"],
        },
      },
    ],
  },

  // Q3: アジアン → 具体
  "q2-world-asian-q3": {
    id: "q2-world-asian-q3",
    question: "アジアンの中でもどれ？",
    subtitle: "エスニック探検隊",
    kibunExpression: "confident",
    kibunSpeech: "エスニック…いいセンスしてる！",
    options: [
      {
        id: "thai", label: "タイ料理（トムヤム・ガパオ）", emoji: "🥘",
        next: {
          type: "endpoint",
          genreIds: ["thai_vietnam"],
          resultLabel: "タイ料理",
          resultDescription: "辛・酸・甘のハーモニー",
          budgetLevel: "medium",
          q4Options: [C.all_you_can_drink, C.lunch],
          siblingHint: ["ベトナム料理"],
        },
      },
      {
        id: "vietnam", label: "ベトナム料理（フォー・生春巻き）", emoji: "🥗",
        next: {
          type: "endpoint",
          genreIds: ["thai_vietnam"],
          resultLabel: "ベトナム料理",
          resultDescription: "ヘルシーで優しいアジアの風",
          budgetLevel: "medium",
          q4Options: [C.lunch, C.non_smoking],
          siblingHint: ["タイ料理"],
        },
      },
    ],
  },

  // ==================== Q2: 飲みルート ====================
  "q1-drink-q2": {
    id: "q1-drink-q2",
    question: "どんな飲み方の気分？",
    subtitle: "かんぱーい！",
    kibunExpression: "excited",
    kibunSpeech: "飲みたい気分なんだね！",
    options: [
      {
        id: "izakaya", label: "居酒屋でワイワイ", emoji: "🏮",
        next: {
          type: "endpoint",
          genreIds: ["izakaya"],
          resultLabel: "居酒屋",
          resultDescription: "なんでもある安心感で乾杯",
          budgetLevel: "medium",
          q4Options: [C.all_you_can_drink, C.private_room, C.late_night],
          siblingHint: ["ダイニングバー", "焼き鳥で一杯"],
        },
      },
      {
        id: "dining_bar", label: "おしゃれにダイニングバー", emoji: "🍸",
        next: {
          type: "endpoint",
          genreIds: ["dining_bar"],
          resultLabel: "ダイニングバー",
          resultDescription: "おしゃれ空間で大人の時間",
          budgetLevel: "medium",
          q4Options: [C.late_night, C.card_ok, C.non_smoking],
          siblingHint: ["居酒屋", "女子会向きのお店"],
        },
      },
      {
        id: "yakitori_drink", label: "焼き鳥で一杯", emoji: "🍢",
        next: {
          type: "endpoint",
          genreIds: ["yakitori", "izakaya"],
          resultLabel: "焼き鳥で一杯",
          resultDescription: "炭火の香りをアテに至福の一杯",
          budgetLevel: "low",
          q4Options: [C.all_you_can_drink, C.late_night],
          siblingHint: ["居酒屋", "ダイニングバー"],
        },
      },
      {
        id: "girls", label: "女子会・おしゃれに飲みたい", emoji: "👩‍👩‍👧",
        next: {
          type: "endpoint",
          genreIds: ["dining_bar", "italian"],
          resultLabel: "女子会向きのお店",
          resultDescription: "おしゃれで美味しい、女子会にぴったり",
          budgetLevel: "medium",
          q4Options: [C.all_you_can_drink, C.private_room, C.non_smoking],
          siblingHint: ["ダイニングバー", "カジュアルイタリアン"],
        },
      },
    ],
  },

  // ==================== Q2: 軽めルート ====================
  "q1-light-q2": {
    id: "q1-light-q2",
    question: "軽めの中でも？",
    subtitle: "さくっと決めよう",
    kibunExpression: "excited",
    kibunSpeech: "軽めね、了解！",
    options: [
      {
        id: "cafe", label: "カフェごはん", emoji: "☕",
        next: {
          type: "endpoint",
          genreIds: ["cafe"],
          resultLabel: "カフェごはん",
          resultDescription: "ゆったりと美味しいひととき",
          budgetLevel: "low",
          q4Options: [C.lunch, C.non_smoking],
          siblingHint: ["ヘルシーごはん", "さらっと麺"],
        },
      },
      {
        id: "healthy", label: "ヘルシーに（サラダ・エスニック）", emoji: "🥗",
        next: {
          type: "endpoint",
          genreIds: ["thai_vietnam", "cafe"],
          resultLabel: "ヘルシーごはん",
          resultDescription: "体に優しいヘルシーメニュー",
          budgetLevel: "medium",
          q4Options: [C.lunch, C.non_smoking],
          siblingHint: ["カフェごはん", "ベトナム料理"],
        },
      },
      {
        id: "noodle", label: "あったかい麺でさらっと", emoji: "🍜",
        next: {
          type: "endpoint",
          genreIds: ["ramen", "udon_soba"],
          resultLabel: "さらっと麺",
          resultDescription: "あったかい一杯でほっこり",
          budgetLevel: "low",
          q4Options: [C.late_night, C.non_smoking],
          siblingHint: ["カフェごはん", "うどん・そば"],
        },
      },
    ],
  },

  // ==================== Q2: おまかせルート ====================
  "q1-omakase-q2": {
    id: "q1-omakase-q2",
    question: "ヒントだけちょうだい",
    subtitle: "きぶんくんにおまかせ！",
    kibunExpression: "confident",
    kibunSpeech: "まかせて！当ててみせるよ",
    options: [
      {
        id: "cospa", label: "コスパ重視", emoji: "💰",
        next: {
          type: "endpoint",
          genreIds: ["__random__"],
          resultLabel: "おまかせ（コスパ）",
          resultDescription: "お財布に優しい今夜のおすすめ",
          budgetLevel: "low",
          q4Options: [C.lunch, C.non_smoking],
        },
      },
      {
        id: "sns", label: "SNS映え重視", emoji: "📸",
        next: {
          type: "endpoint",
          genreIds: ["__random__"],
          resultLabel: "おまかせ（映え）",
          resultDescription: "思わず写真を撮りたくなるお店",
          budgetLevel: "medium",
          q4Options: [C.non_smoking, C.card_ok],
        },
      },
      {
        id: "random", label: "完全ランダム", emoji: "🎰",
        next: {
          type: "endpoint",
          genreIds: ["__random__"],
          resultLabel: "おまかせ（完全ランダム）",
          resultDescription: "運命に身を任せて",
          budgetLevel: "any",
          q4Options: [],
        },
      },
    ],
  },
};
