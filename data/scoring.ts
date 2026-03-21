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

export function getTopThree(scores: AxisScores): GenreId[] {
  const sorted = GENRES.map((g) => ({
    id: g.id,
    dist: distance(scores, g.ideal, g.weight),
  })).sort((a, b) => a.dist - b.dist);

  return sorted.slice(0, 3).map((s) => s.id);
}

export function getTopThreeWithHistory(
  scores: AxisScores,
  recentGenres: GenreId[]
): GenreId[] {
  const PENALTY = 3.0;
  const sorted = GENRES.map((g) => {
    let dist = distance(scores, g.ideal, g.weight);
    if (recentGenres.includes(g.id)) {
      dist += PENALTY;
    }
    return { id: g.id, dist };
  }).sort((a, b) => a.dist - b.dist);

  return sorted.slice(0, 3).map((s) => s.id);
}
