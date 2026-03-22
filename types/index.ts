// ===== v2: 分岐ツリー型アーキテクチャ =====

// ジャンル分類カテゴリ
export type CategoryType =
  | "japanese"
  | "meat"
  | "world"
  | "noodle"
  | "izakaya_bar"
  | "light"
  | "fancy";

// ジャンルマスタ
export type Genre = {
  id: string;
  label: string;
  hotpepperCode: string;
  keyword?: string;
  icon: string;
  description: string;
  category: CategoryType;
  flags: {
    drink_main: boolean;
    late_night: boolean;
    girls_ok: boolean;
    solo_friendly: boolean;
    date_ok: boolean;
    family_ok: boolean;
  };
};

// 予算レベル
export type BudgetLevel = "low" | "medium" | "high" | "any";

// Q4 こだわりチップ
export type Q4Chip = {
  id: string;
  label: string;
  apiParam: string;
  apiValue: string;
};

// きぶんくんの表情
export type KibunExpression =
  | "normal"
  | "thinking"
  | "excited"
  | "confident"
  | "tada";

// 質問ツリーのノード
export type QuestionNode = {
  id: string;
  question: string;
  subtitle: string;
  kibunExpression: KibunExpression;
  kibunSpeech: string;
  options: OptionNode[];
};

// 選択肢
export type OptionNode = {
  id: string;
  label: string;
  emoji: string;
  next: string | EndpointNode;
};

// エンドポイント（結果）
export type EndpointNode = {
  type: "endpoint";
  genreIds: string[];
  resultLabel: string;
  resultDescription: string;
  budgetLevel: BudgetLevel;
  rangeOverride?: number;
  q4Options: Q4Chip[];
  siblingHint?: string[];
};

// レストラン（ホットペッパーAPIレスポンス）
export type Restaurant = {
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
};
