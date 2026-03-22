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

// コンテキストペナルティ/ボーナス
// 正の値=ペナルティ（距離を遠ざける）、負の値=ボーナス（距離を近づける）
interface ContextAdjustment {
  genreId: GenreId;
  delta: number;
}

function getContextAdjustments(answers: Record<number, string>): ContextAdjustment[] {
  const adjustments: ContextAdjustment[] = [];
  const q1 = answers[1]; // 誰と
  const q2 = answers[2]; // 気分
  const q3 = answers[3]; // 体の感覚
  const q4 = answers[4]; // お酒
  const q5 = answers[5]; // お店に求めるもの

  // === Q4: お酒 ===
  if (q4 === "4b") {
    // 飲まない → 居酒屋系に強いペナルティ
    adjustments.push({ genreId: "izakaya", delta: 6.0 });
    adjustments.push({ genreId: "yakitori", delta: 3.0 });
  }
  if (q4 === "4a") {
    // 飲みたい → 居酒屋・焼き鳥にボーナス
    adjustments.push({ genreId: "izakaya", delta: -1.5 });
    adjustments.push({ genreId: "yakitori", delta: -1.5 });
  }

  // === Q1: 誰と ===
  if (q1 === "1d") {
    // 家族と → 居酒屋ペナルティ
    adjustments.push({ genreId: "izakaya", delta: 3.0 });
  }
  if (q1 === "1a") {
    // ひとり → フレンチ・焼肉にペナルティ（ハードル高い）
    adjustments.push({ genreId: "yakiniku", delta: 1.5 });
    adjustments.push({ genreId: "french", delta: 2.5 });
  }
  if (q1 === "1b") {
    // 恋人と → ラーメン・定食にペナルティ、イタリアン・フレンチにボーナス
    adjustments.push({ genreId: "ramen", delta: 1.5 });
    adjustments.push({ genreId: "teishoku", delta: 2.0 });
    adjustments.push({ genreId: "italian", delta: -1.5 });
    adjustments.push({ genreId: "french", delta: -2.0 });
  }

  // === Q5: お店に求めるもの（予算感の代替）===
  if (q5 === "5a") {
    // リーズナブルにサクッと → 高級系にペナルティ
    adjustments.push({ genreId: "french", delta: 4.0 });
    adjustments.push({ genreId: "sushi", delta: 2.0 });
    adjustments.push({ genreId: "steak", delta: 2.0 });
    // カジュアル系にボーナス
    adjustments.push({ genreId: "ramen", delta: -1.5 });
    adjustments.push({ genreId: "curry", delta: -1.0 });
    adjustments.push({ genreId: "teishoku", delta: -1.5 });
  }
  if (q5 === "5c") {
    // ちょっと奮発 → カジュアル系にペナルティ
    adjustments.push({ genreId: "ramen", delta: 1.5 });
    adjustments.push({ genreId: "teishoku", delta: 2.0 });
    adjustments.push({ genreId: "hamburger", delta: 1.5 });
    // 高級系にボーナス
    adjustments.push({ genreId: "french", delta: -2.0 });
    adjustments.push({ genreId: "sushi", delta: -1.5 });
    adjustments.push({ genreId: "steak", delta: -1.0 });
  }
  if (q5 === "5d") {
    // とにかく満腹 → 軽い系にペナルティ
    adjustments.push({ genreId: "french", delta: 2.0 });
    adjustments.push({ genreId: "italian", delta: 1.0 });
  }

  // === Q3: 体の感覚 ===
  if (q3 === "3b") {
    // 軽め → ヘビー系にペナルティ
    adjustments.push({ genreId: "yakiniku", delta: 2.0 });
    adjustments.push({ genreId: "steak", delta: 2.0 });
  }
  if (q3 === "3c") {
    // 辛いもの → スパイシー系にボーナス
    adjustments.push({ genreId: "curry", delta: -2.0 });
    adjustments.push({ genreId: "korean", delta: -2.0 });
    adjustments.push({ genreId: "thai-vietnamese", delta: -2.0 });
  }
  if (q3 === "3d") {
    // 温かいもの → 麺類・和食にボーナス
    adjustments.push({ genreId: "ramen", delta: -1.5 });
    adjustments.push({ genreId: "udon-soba", delta: -2.0 });
    adjustments.push({ genreId: "washoku", delta: -1.0 });
  }

  // === 組み合わせペナルティ ===
  // 恋人+特別な時間+奮発 → フレンチ・イタリアンに強いボーナス
  if (q1 === "1b" && q2 === "2c" && q5 === "5c") {
    adjustments.push({ genreId: "french", delta: -3.0 });
    adjustments.push({ genreId: "italian", delta: -2.0 });
  }
  // ひとり+パワーチャージ+リーズナブル → ラーメン・カレーに強いボーナス
  if (q1 === "1a" && q2 === "2a" && q5 === "5a") {
    adjustments.push({ genreId: "ramen", delta: -3.0 });
    adjustments.push({ genreId: "curry", delta: -2.0 });
  }
  // 友達+いつもと違う+辛いもの → エスニック系に強いボーナス
  if (q1 === "1c" && q2 === "2d" && q3 === "3c") {
    adjustments.push({ genreId: "thai-vietnamese", delta: -3.0 });
    adjustments.push({ genreId: "korean", delta: -2.0 });
  }
  // パワーチャージ+がっつり → 焼肉・ステーキ・中華にボーナス
  if (q2 === "2a" && q3 === "3a") {
    adjustments.push({ genreId: "yakiniku", delta: -2.5 });
    adjustments.push({ genreId: "steak", delta: -2.0 });
    adjustments.push({ genreId: "chinese", delta: -1.5 });
    adjustments.push({ genreId: "ramen", delta: -1.0 });
  }
  // パワーチャージ+がっつり+飲みたい → 居酒屋より焼肉を優先
  if (q2 === "2a" && q3 === "3a" && q4 === "4a") {
    adjustments.push({ genreId: "yakiniku", delta: -2.0 });
  }

  return adjustments;
}

// 履歴ペナルティ（日数減衰 + ランク段階）
interface HistoryEntry {
  topGenres: GenreId[];
  timestamp: number;
}

function getHistoryPenalties(recentGenres: HistoryEntry[]): Map<GenreId, number> {
  const penalties = new Map<GenreId, number>();
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  for (const entry of recentGenres) {
    const daysAgo = (now - entry.timestamp) / DAY;
    if (daysAgo > 7) continue;

    // 日数減衰: 1日前=1.0倍, 7日前=0.14倍
    const decay = Math.max(0, 1 - daysAgo / 7);

    entry.topGenres.forEach((genreId, rank) => {
      // ランク段階: 1位=3.0, 2位=2.0, 3位=1.0
      const basePenalty = [3.0, 2.0, 1.0][rank] || 1.0;
      const penalty = basePenalty * decay;

      const current = penalties.get(genreId) || 0;
      penalties.set(genreId, current + penalty);
    });
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
  recentHistory: HistoryEntry[]
): GenreId[] {
  const contextAdjustments = getContextAdjustments(answers);
  const historyPenalties = getHistoryPenalties(recentHistory);

  const sorted = GENRES.map((g) => {
    let dist = distance(scores, g.ideal, g.weight);

    // コンテキストペナルティ/ボーナス
    for (const adj of contextAdjustments) {
      if (adj.genreId === g.id) {
        dist += adj.delta;
      }
    }

    // 履歴ペナルティ（減衰済み）
    const histPenalty = historyPenalties.get(g.id) || 0;
    dist += histPenalty;

    return { id: g.id, dist };
  }).sort((a, b) => a.dist - b.dist);

  return sorted.slice(0, 3).map((s) => s.id);
}

// 後方互換
export function getTopThreeWithHistory(
  scores: AxisScores,
  recentGenres: GenreId[]
): GenreId[] {
  // 古い形式のデータを新しい形式に変換
  const history: HistoryEntry[] = recentGenres.length > 0
    ? [{ topGenres: recentGenres, timestamp: Date.now() }]
    : [];
  return getTopThreeWithContext(scores, {}, history);
}
