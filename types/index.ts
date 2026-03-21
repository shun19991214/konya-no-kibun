// === スコアリング軸 ===
export interface AxisScores {
  heavyLight: number; // heavy(-) <-> light(+)
  wafuYofu: number; // wafu(-) <-> youfu/ethnic(+)
  casualFormal: number; // casual(-) <-> formal(+)
  adventurous: number; // safe(-) <-> adventurous(+)
}

// === クイズ ===
export interface Choice {
  id: string;
  text: string;
  emoji: string;
  scores: AxisScores;
}

// 移動手段の選択肢（スコアリングではなくrange決定用）
export interface TransportChoice {
  id: string;
  text: string;
  emoji: string;
  range: number; // ホットペッパーAPI range (1-5)
}

export interface Question {
  id: number;
  text: string;
  subtext?: string;
  type: "score" | "transport"; // scoreはスコアリング用、transportは検索範囲用
  choices: Choice[] | TransportChoice[];
}

// === ジャンル ===
export type GenreId =
  | "washoku"
  | "sushi"
  | "ramen"
  | "udon-soba"
  | "chinese"
  | "italian"
  | "french"
  | "yakiniku"
  | "yakitori"
  | "izakaya"
  | "curry"
  | "thai-vietnamese"
  | "korean"
  | "hamburger"
  | "steak"
  | "teishoku";

export interface Genre {
  id: GenreId;
  name: string;
  emoji: string;
  description: string;
  hotpepperCode: string;
  keyword?: string; // 補助キーワード
  ideal: AxisScores;
  weight: AxisScores;
}

// === レストラン（ホットペッパーAPIレスポンス） ===
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  stationName: string;
  lat: number;
  lng: number;
  budget: string;
  budgetAverage: string;
  photo: {
    pc: { l: string; m: string; s: string };
    mobile: { l: string; s: string };
  };
  url: string;
  open: string;
  access: string;
  genreName: string;
  catchPhrase: string;
}

// === クイズ結果 ===
export interface QuizResult {
  scores: AxisScores;
  topGenres: GenreId[];
  range: number;
  timestamp: number;
}
