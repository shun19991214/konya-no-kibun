import type { AxisScores, GenreId } from "@/types";
import { GENRES } from "./genres";

function distance(a: AxisScores, b: AxisScores, w: AxisScores): number {
  return Math.sqrt(
    w.heavyLight * Math.pow(a.heavyLight - b.heavyLight, 2) +
      w.wafuYofu * Math.pow(a.wafuYofu - b.wafuYofu, 2) +
      w.casualFormal * Math.pow(a.casualFormal - b.casualFormal, 2) +
      w.adventurous * Math.pow(a.adventurous - b.adventurous, 2)
  );
}

// 回答の組み合わせによるコンテキストペナルティ
// 不自然な結果（飲まないのに居酒屋、家族なのに居酒屋等）を抑制
interface ContextPenalty {
  genreId: GenreId;
  penalty: number;
}

function getContextPenalties(answers: Record<number, string>): ContextPenalty[] {
  const penalties: ContextPenalty[] = [];

  const q1 = answers[1]; // 誰と
  const q4 = answers[4]; // お酒

  // 「飲まない」→ 居酒屋・焼き鳥にペナルティ
  if (q4 === "4b") {
    penalties.push({ genreId: "izakaya", penalty: 5.0 });
    penalties.push({ genreId: "yakitori", penalty: 2.0 });
  }

  // 「家族と」→ 居酒屋にペナルティ
  if (q1 === "1d") {
    penalties.push({ genreId: "izakaya", penalty: 3.0 });
  }

  // 「ひとり」→ 焼肉にやや減点（一人焼肉は少数派）
  if (q1 === "1a") {
    penalties.push({ genreId: "yakiniku", penalty: 1.5 });
  }

  return penalties;
}

export function getTopThree(scores: AxisScores): GenreId[] {
  const sorted = GENRES.map((g) => ({
    id: g.id,
    dist: distance(scores, g.ideal, g.weight),
  })).sort((a, b) => a.dist - b.dist);

  return sorted.slice(0, 3).map((s) => s.id);
}

export function getTopThreeWithContext(
  scores: AxisScores,
  answers: Record<number, string>,
  recentGenres: GenreId[]
): GenreId[] {
  const HISTORY_PENALTY = 3.0;
  const contextPenalties = getContextPenalties(answers);

  const sorted = GENRES.map((g) => {
    let dist = distance(scores, g.ideal, g.weight);

    // 履歴ペナルティ
    if (recentGenres.includes(g.id)) {
      dist += HISTORY_PENALTY;
    }

    // コンテキストペナルティ
    for (const cp of contextPenalties) {
      if (cp.genreId === g.id) {
        dist += cp.penalty;
      }
    }

    return { id: g.id, dist };
  }).sort((a, b) => a.dist - b.dist);

  return sorted.slice(0, 3).map((s) => s.id);
}

// 後方互換のため残す
export function getTopThreeWithHistory(
  scores: AxisScores,
  recentGenres: GenreId[]
): GenreId[] {
  return getTopThreeWithContext(scores, {}, recentGenres);
}
