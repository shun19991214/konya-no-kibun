"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import type { AxisScores, Genre, GenreId, Restaurant } from "@/types";
import { getTopThreeWithHistory } from "@/data/scoring";
import { GENRE_MAP } from "@/data/genres";
import { GenreCard } from "@/components/result/GenreCard";
import { ShareButtons } from "@/components/result/ShareButtons";
import { LocationPrompt } from "@/components/result/LocationPrompt";
import { RestaurantList } from "@/components/result/RestaurantList";

function saveHistory(topGenres: GenreId[]) {
  try {
    const history = JSON.parse(
      localStorage.getItem("yorugohan_history") || "[]"
    );
    history.unshift({ topGenres, timestamp: Date.now() });
    // keep last 20 entries
    localStorage.setItem(
      "yorugohan_history",
      JSON.stringify(history.slice(0, 20))
    );
  } catch {
    // ignore
  }
}

function ResultContent() {
  const searchParams = useSearchParams();
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRestaurants, setShowRestaurants] = useState(false);

  const scores: AxisScores = {
    heavyLight: Number(searchParams.get("hl")) || 0,
    wafuYofu: Number(searchParams.get("wy")) || 0,
    casualFormal: Number(searchParams.get("cf")) || 0,
    adventurous: Number(searchParams.get("ad")) || 0,
  };
  const range = Number(searchParams.get("range")) || 3;

  // Get recent history for penalty
  let recentGenres: GenreId[] = [];
  try {
    if (typeof window !== "undefined") {
      const history = JSON.parse(
        localStorage.getItem("yorugohan_history") || "[]"
      );
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      recentGenres = history
        .filter((h: { timestamp: number }) => h.timestamp > oneWeekAgo)
        .flatMap((h: { topGenres: GenreId[] }) => h.topGenres);
    }
  } catch {
    // ignore
  }

  const topGenreIds = getTopThreeWithHistory(scores, recentGenres);
  const topGenres = topGenreIds.map((id) => GENRE_MAP[id]).filter(Boolean);

  useEffect(() => {
    if (topGenreIds.length > 0) {
      saveHistory(topGenreIds);
    }
    if (!selectedGenre && topGenres.length > 0) {
      setSelectedGenre(topGenres[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchRestaurants = useCallback(
    async (lat: number, lng: number) => {
      if (!selectedGenre) return;

      setIsLoading(true);
      setError(null);
      setShowRestaurants(true);

      try {
        const params = new URLSearchParams({
          lat: String(lat),
          lng: String(lng),
          genre: selectedGenre.hotpepperCode,
          range: String(range),
        });
        if (selectedGenre.keyword) {
          params.set("keyword", selectedGenre.keyword);
        }

        const res = await fetch(`/api/restaurants?${params.toString()}`);
        if (!res.ok) throw new Error("お店の検索に失敗しました");

        const data = await res.json();
        setRestaurants(data.restaurants || []);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "お店の検索に失敗しました"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [selectedGenre, range]
  );

  const searchByKeyword = useCallback(
    async (keyword: string) => {
      if (!selectedGenre) return;

      setIsLoading(true);
      setError(null);
      setShowRestaurants(true);

      try {
        const params = new URLSearchParams({
          keyword: `${keyword} ${selectedGenre.keyword || selectedGenre.name}`,
          genre: selectedGenre.hotpepperCode,
          range: "5",
        });

        const res = await fetch(`/api/restaurants?${params.toString()}`);
        if (!res.ok) throw new Error("お店の検索に失敗しました");

        const data = await res.json();
        setRestaurants(data.restaurants || []);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "お店の検索に失敗しました"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [selectedGenre]
  );

  if (topGenres.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-accent-light mb-4">結果が見つかりませんでした</p>
          <Link
            href="/quiz"
            className="text-primary font-medium hover:underline"
          >
            もう一度診断する
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="text-center pt-10 pb-6 px-6">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-accent-light/60 mb-2"
        >
          あなたの今夜の気分は...
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-heading font-bold text-accent"
        >
          <span className="text-5xl mr-2">{topGenres[0].emoji}</span>
          <span className="gradient-text">{topGenres[0].name}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-accent-light/70 mt-2"
        >
          {topGenres[0].description}
        </motion.p>
      </div>

      {/* Genre Cards */}
      <div className="max-w-lg mx-auto px-6 space-y-3 mb-8">
        {topGenres.map((genre, i) => (
          <GenreCard
            key={genre.id}
            genre={genre}
            rank={(i + 1) as 1 | 2 | 3}
            onSelect={(g) => {
              setSelectedGenre(g);
              setShowRestaurants(false);
              setRestaurants([]);
            }}
            isSelected={selectedGenre?.id === genre.id}
          />
        ))}
      </div>

      {/* Share */}
      <div className="max-w-lg mx-auto px-6 mb-10">
        <ShareButtons genre={topGenres[0]} />
      </div>

      {/* Location & Restaurant Search */}
      <div className="max-w-lg mx-auto px-6">
        {!showRestaurants ? (
          <LocationPrompt
            onLocationGranted={searchRestaurants}
            onManualSearch={searchByKeyword}
            selectedGenre={selectedGenre}
          />
        ) : (
          <RestaurantList
            restaurants={restaurants}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>

      {/* Retry */}
      <div className="text-center mt-10">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
        >
          <RotateCcw size={16} />
          もう一度診断する
        </Link>
      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-4xl animate-float">🍽️</div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
