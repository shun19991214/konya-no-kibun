import type { BudgetLevel } from "@/types";

export const BUDGET_API_MAP: Record<BudgetLevel, string | null> = {
  low: "B001,B002,B003", // 〜2000円
  medium: "B003,B004,B005,B006", // 2001〜5000円
  high: "B006,B008,B010,B012,B014", // 5001円〜
  any: null, // 指定なし
};
