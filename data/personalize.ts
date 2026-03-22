import type { GenreId } from "@/types";

interface AnswerLabels {
  who: string;
  mood: string;
  priority: string;
}

const WHO_LABELS: Record<string, string> = {
  "1a": "ひとり",
  "1b": "恋人と",
  "1c": "友達と",
  "1d": "家族と",
};

const MOOD_LABELS: Record<string, string> = {
  "2a": "がっつり",
  "2b": "さっぱり",
  "2c": "おしゃれ",
  "2d": "冒険",
};

const PRIORITY_LABELS: Record<string, string> = {
  "6a": "コスパ重視",
  "6b": "雰囲気重視",
  "6c": "ボリューム重視",
  "6d": "味の本格さ重視",
};

function getLabels(answers: Record<number, string>): AnswerLabels {
  return {
    who: WHO_LABELS[answers[1]] || "",
    mood: MOOD_LABELS[answers[2]] || "",
    priority: PRIORITY_LABELS[answers[6]] || "",
  };
}

const GENRE_REASONS: Record<GenreId, (labels: AnswerLabels) => string> = {
  washoku: (l) => `${l.mood}気分の${l.who || "あなた"}に、ほっとする和の味わいがぴったり`,
  sushi: (l) => `${l.who || "今夜"}の${l.priority || "特別な時間"}に、新鮮なネタで贅沢を`,
  ramen: (l) => `${l.mood}気分には一杯入魂のラーメンが最適解`,
  "udon-soba": (l) => `${l.mood}気分のあなたに、出汁の優しさが染みる一杯`,
  chinese: (l) => `${l.who || "今夜"}の${l.mood}気分に、中華のボリュームがちょうどいい`,
  italian: (l) => `${l.who || ""}で${l.priority || "おしゃれな夜"}を過ごすなら、イタリアンで決まり`,
  french: (l) => `${l.who || "特別な夜"}に、${l.priority || "雰囲気重視"}のフレンチで贅沢を`,
  yakiniku: (l) => `${l.mood}気分の${l.who || "あなた"}に、肉のパワーでテンションUP`,
  yakitori: (l) => `${l.mood}気分の${l.who || "今夜"}に、炭火の香ばしさがたまらない`,
  izakaya: (l) => `${l.who || "みんな"}で楽しむなら、なんでも揃う居酒屋が安心`,
  curry: (l) => `${l.mood}気分にスパイスの刺激で元気になれる一皿`,
  "thai-vietnamese": (l) => `${l.mood}な気分にぴったり、異国の味で冒険の夜を`,
  korean: (l) => `${l.mood}気分の${l.who || "あなた"}に、ピリ辛でパワーチャージ`,
  hamburger: (l) => `${l.mood}気分を${l.priority || "カジュアルに"}満たすならバーガーで`,
  steak: (l) => `${l.mood}気分の${l.who || "あなた"}に、肉の旨味を存分に`,
  teishoku: (l) => `${l.priority || "バランスよく"}食べたい${l.who || "あなた"}に、定食の安心感`,
};

export function getPersonalizedReason(
  genreId: GenreId,
  answers: Record<number, string>
): string {
  const labels = getLabels(answers);
  const fn = GENRE_REASONS[genreId];
  if (!fn) return "";
  return fn(labels);
}
