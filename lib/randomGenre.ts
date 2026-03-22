import { GENRES } from "@/data/genres";

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// genreIds に "__random__" が含まれる場合の選出ロジック
export function resolveRandomGenre(endpointLabel: string): string[] {
  switch (endpointLabel) {
    case "おまかせ（コスパ）":
      return pickRandom(
        GENRES.filter((g) => g.flags.solo_friendly),
        3
      ).map((g) => g.id);

    case "おまかせ（映え）":
      return pickRandom(
        GENRES.filter((g) => g.flags.girls_ok),
        3
      ).map((g) => g.id);

    case "おまかせ（完全ランダム）":
      return pickRandom(GENRES, 1).map((g) => g.id);

    default:
      return pickRandom(GENRES, 3).map((g) => g.id);
  }
}
