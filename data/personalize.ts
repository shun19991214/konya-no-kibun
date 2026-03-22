import type { GenreId } from "@/types";

interface AnswerLabels {
  who: string;
  mood: string;
  body: string;
  vibe: string;
}

const WHO_LABELS: Record<string, string> = {
  "1a": "ひとり",
  "1b": "恋人と",
  "1c": "友達と",
  "1d": "家族と",
};

const MOOD_LABELS: Record<string, string> = {
  "2a": "パワーチャージ",
  "2b": "癒し",
  "2c": "特別な時間",
  "2d": "冒険",
};

const BODY_LABELS: Record<string, string> = {
  "3a": "がっつり",
  "3b": "軽め",
  "3c": "刺激系",
  "3d": "あったか",
};

const VIBE_LABELS: Record<string, string> = {
  "5a": "サクッと",
  "5b": "バランス",
  "5c": "奮発",
  "5d": "満腹",
};

function getLabels(answers: Record<number, string>): AnswerLabels {
  return {
    who: WHO_LABELS[answers[1]] || "",
    mood: MOOD_LABELS[answers[2]] || "",
    body: BODY_LABELS[answers[3]] || "",
    vibe: VIBE_LABELS[answers[5]] || "",
  };
}

const GENRE_REASONS: Record<GenreId, (l: AnswerLabels) => string> = {
  washoku: (l) => `${l.mood || "癒し"}モードの${l.who || "あなた"}に、和の味わいで心もお腹も満たされて`,
  sushi: (l) => `${l.who || "今夜"}の${l.mood || "特別な時間"}にふさわしい、旬のネタで贅沢を`,
  ramen: (l) => `${l.body || "がっつり"}な体に、一杯入魂のラーメンが染みる`,
  "udon-soba": (l) => `${l.body || "あったか"}な気分に、出汁の優しさがぴったり`,
  chinese: (l) => `${l.body || "がっつり"}食べたい${l.who || "あなた"}に、中華のボリュームが◎`,
  italian: (l) => `${l.mood || "特別な時間"}を${l.who || "一緒に"}楽しむなら、イタリアンで決まり`,
  french: (l) => `${l.who || "大切な人"}との${l.mood || "特別な時間"}に、フレンチで贅沢を`,
  yakiniku: (l) => `${l.body || "がっつり"}な体が求める、肉のパワーでテンションUP`,
  yakitori: (l) => `${l.who || "今夜"}の${l.mood || "リラックス"}に、炭火の香ばしさがたまらない`,
  izakaya: (l) => `${l.who || "みんな"}で楽しむなら、なんでも揃う居酒屋が安心`,
  curry: (l) => `${l.body || "刺激系"}な気分に、スパイスの力で元気になれる`,
  "thai-vietnamese": (l) => `${l.mood || "冒険"}したい${l.who || "あなた"}に、異国の味で新しい夜を`,
  korean: (l) => `${l.body || "刺激系"}な体にぴったり、ピリ辛でパワーチャージ`,
  hamburger: (l) => `${l.vibe || "サクッと"}${l.body || "がっつり"}食べたいなら、バーガーに決まり`,
  steak: (l) => `${l.body || "がっつり"}な体が求める、肉の旨味を存分に堪能`,
  teishoku: (l) => `${l.vibe || "バランス"}よく食べたい${l.who || "あなた"}に、定食の安心感`,
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
