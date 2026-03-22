import type { Q4Chip } from "@/types";

export const Q4_CHIPS: Record<string, Q4Chip> = {
  private_room: {
    id: "private_room",
    label: "個室あり",
    apiParam: "private_room",
    apiValue: "1",
  },
  late_night: {
    id: "late_night",
    label: "23時以降OK",
    apiParam: "midnight",
    apiValue: "1",
  },
  all_you_can_drink: {
    id: "all_you_can_drink",
    label: "飲み放題",
    apiParam: "free_drink",
    apiValue: "1",
  },
  lunch: {
    id: "lunch",
    label: "ランチあり",
    apiParam: "lunch",
    apiValue: "1",
  },
  card_ok: {
    id: "card_ok",
    label: "カード可",
    apiParam: "card",
    apiValue: "1",
  },
  non_smoking: {
    id: "non_smoking",
    label: "禁煙席あり",
    apiParam: "non_smoking",
    apiValue: "1",
  },
  parking: {
    id: "parking",
    label: "駐車場あり",
    apiParam: "parking",
    apiValue: "1",
  },
} as const;
