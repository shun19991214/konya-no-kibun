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
  const [topGenres, setTopGenres] = useState<Genre[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRestaurants, setShowRestaurants] = useState(false);
  const [ready, setReady] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const scores: AxisScores = {
    heavyLight: Number(searchParams.get("hl")) || 0,
    wafuYofu: Number(searchParams.get("wy")) || 0,
    casualFormal: Number(searchParams.get("cf")) || 0,
    adventurous: Number(searchParams.get("ad")) || 0,
  };
  const range = Number(searchParams.get("range")) || 3;

  // Compute results client-side only to avoid hydration mismatch
  useEffect(() => {
    let recentGenres: GenreId[] = [];
    try {
      const history = JSON.parse(
        localStorage.getItem("yorugohan_history") || "[]"
      );
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      recentGenres = history
        .filter((h: { timestamp: number }) => h.timestamp > oneWeekAgo)
        .flatMap((h: { topGenres: GenreId[] }) => h.topGenres);
    } catch {
      // ignore
    }

    const topGenreIds = getTopThreeWithHistory(scores, recentGenres);
    const genres = topGenreIds.map((id) => GENRE_MAP[id]).filter(Boolean);
    setTopGenres(genres);
    if (genres.length > 0) {
      setSelectedGenre(genres[0]);
      saveHistory(topGenreIds);
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchRestaurants = useCallback(
    async (lat: number, lng: number) => {
      if (!selectedGenre) return;
      setUserLocation({ lat, lng });
      setIsLoading(true);
      setError(null);
      setShowRestaurants(true);
      try {
        const params = new URLSearchParams({
          lat: String(lat),
          lng: String(lng),
          range: String(range),
        });
        // keyword があるジャンルは keyword のみ、ないジャンルは genre コードで検索
        if (selectedGenre.keyword) {
          params.set("keyword", selectedGenre.keyword);
        } else {
          params.set("genre", selectedGenre.hotpepperCode);
        }
        const res = await fetch(`/api/restaurants?${params.toString()}`);
        if (!res.ok) throw new Error("お店の検索に失敗しました");
        const data = await res.json();
        setRestaurants(data.restaurants || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "お店の検索に失敗しました");
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
          range: "5",
        });
        const res = await fetch(`/api/restaurants?${params.toString()}`);
        if (!res.ok) throw new Error("お店の検索に失敗しました");
        const data = await res.json();
        setRestaurants(data.restaurants || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "お店の検索に失敗しました");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedGenre]
  );

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
          className="text-5xl"
        >
          🍽️
        </motion.div>
      </div>
    );
  }

  if (topGenres.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-center">
          <p className="text-[#8B6F61] mb-4">結果が見つかりませんでした</p>
          <Link
            href="/quiz"
            className="text-[#FF6B35] font-medium hover:underline"
          >
            もう一度診断する
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      {/* ===== Hero result section with night gradient ===== */}
      <section
        className="relative overflow-hidden pt-14 pb-20"
        style={{
          background:
            "linear-gradient(180deg, #2D2B55 0%, #3d2b6b 25%, #6b3a5c 50%, #c4563a 75%, #FFF8F0 100%)",
        }}
      >
        {/* Stars */}
        {[
          "top-[5%] left-[10%] w-1 h-1",
          "top-[8%] right-[15%] w-1.5 h-1.5",
          "top-[12%] left-[40%] w-1 h-1",
          "top-[3%] right-[30%] w-0.5 h-0.5",
          "top-[15%] left-[75%] w-1 h-1",
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white animate-twinkle ${cls}`}
            style={{ animationDelay: `${i * 0.6}s` }}
          />
        ))}

        <div className="relative max-w-md mx-auto text-center px-6">
          <motion.p
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-white/50 mb-4 tracking-wide"
          >
            あなたの今夜の気分は...
          </motion.p>

          <motion.div
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="text-7xl mb-4"
          >
            {topGenres[0].emoji}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="font-heading font-bold text-white mb-2 drop-shadow-md whitespace-nowrap"
            style={{ fontSize: "clamp(1.75rem, 8vw, 3rem)" }}
          >
            {topGenres[0].name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-white/60 text-sm"
          >
            {topGenres[0].description}
          </motion.p>
        </div>
      </section>

      {/* ===== Genre ranking cards ===== */}
      <section className="max-w-md mx-auto px-6 -mt-8 relative z-10">
        <div className="space-y-3 mb-8">
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
        <div className="mb-10">
          <ShareButtons genre={topGenres[0]} />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-[#5C3D2E]/8" />
          <span className="text-xs text-[#8B6F61]/50 font-medium">
            お店を探す
          </span>
          <div className="flex-1 h-px bg-[#5C3D2E]/8" />
        </div>

        {/* Location & Restaurant Search */}
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
            userLocation={userLocation}
            onResearch={() => {
              setShowRestaurants(false);
              setRestaurants([]);
            }}
          />
        )}

        {/* Retry */}
        <div className="text-center mt-12">
          <Link
            href="/quiz"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#5C3D2E]/10 text-[#3d2e1f] text-sm font-medium hover:border-[#FF6B35]/30 hover:shadow-md transition-all"
          >
            <RotateCcw size={14} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
            もう一度診断する
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
            className="text-5xl"
          >
            🍽️
          </motion.div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
