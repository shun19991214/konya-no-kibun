import { GENRES } from "@/data/genres";
import { BUDGET_API_MAP } from "@/data/budget";
import type { BudgetLevel, Q4Chip } from "@/types";

export type SearchParams = {
  genre: string;
  keyword?: string;
  budget?: string;
  lat: number;
  lng: number;
  range: number;
  [key: string]: string | number | undefined;
};

export function buildSearchParams(
  genreId: string,
  budgetLevel: BudgetLevel,
  location: { lat: number; lng: number },
  range: number,
  activeChips: Q4Chip[]
): SearchParams {
  const genre = GENRES.find((g) => g.id === genreId);
  if (!genre) throw new Error(`Genre not found: ${genreId}`);

  const params: SearchParams = {
    genre: genre.hotpepperCode,
    lat: location.lat,
    lng: location.lng,
    range,
  };

  if (genre.keyword) {
    params.keyword = genre.keyword;
  }

  const budgetParam = BUDGET_API_MAP[budgetLevel];
  if (budgetParam) {
    params.budget = budgetParam;
  }

  for (const chip of activeChips) {
    params[chip.apiParam] = chip.apiValue;
  }

  return params;
}
