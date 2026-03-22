"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useQuizState } from "@/hooks/useQuizState";
import { KibunKun } from "@/components/character/KibunKun";
import { GENRE_MAP } from "@/data/genres";
import { QUESTION_TREE } from "@/data/questionTree";
import { resolveRandomGenre } from "@/lib/randomGenre";
import type { EndpointNode, OptionNode, Restaurant, Q4Chip } from "@/types";

// ツリー全走査で resultLabel から EndpointNode を逆引き
function findEndpointByLabel(label: string): EndpointNode | null {
  for (const node of Object.values(QUESTION_TREE)) {
    for (const option of node.options) {
      if (typeof option.next !== "string" && option.next.resultLabel === label) {
        return option.next;
      }
    }
  }
  return null;
}

// ===== Phase types =====
type Phase = "quiz" | "analyzing" | "reveal" | "detail";

// ===== Question themes =====
const QUESTION_THEMES: Record<string, { gradient: string; accent: string }> = {
  q1: { gradient: "from-orange-50 to-amber-50", accent: "#F97316" },
  "q1-meat-q2": { gradient: "from-red-50 to-orange-50", accent: "#EF4444" },
  "q2-meat-yakiniku-q3": { gradient: "from-red-50 to-orange-50", accent: "#EF4444" },
  "q2-meat-steak-q3": { gradient: "from-red-50 to-orange-50", accent: "#EF4444" },
  "q1-japanese-q2": { gradient: "from-emerald-50 to-teal-50", accent: "#10B981" },
  "q2-japanese-sushi-q3": { gradient: "from-emerald-50 to-teal-50", accent: "#10B981" },
  "q1-noodle-q2": { gradient: "from-yellow-50 to-amber-50", accent: "#F59E0B" },
  "q2-noodle-ramen-q3": { gradient: "from-yellow-50 to-amber-50", accent: "#F59E0B" },
  "q1-world-q2": { gradient: "from-blue-50 to-indigo-50", accent: "#6366F1" },
  "q2-world-italian-q3": { gradient: "from-blue-50 to-indigo-50", accent: "#6366F1" },
  "q2-world-asian-q3": { gradient: "from-blue-50 to-indigo-50", accent: "#6366F1" },
  "q1-drink-q2": { gradient: "from-amber-50 to-yellow-50", accent: "#D97706" },
  "q1-light-q2": { gradient: "from-green-50 to-emerald-50", accent: "#22C55E" },
  "q1-omakase-q2": { gradient: "from-purple-50 to-pink-50", accent: "#A855F7" },
};

function getTheme(nodeId: string) {
  return QUESTION_THEMES[nodeId] || QUESTION_THEMES.q1;
}

export default function PlayPage() {
  const { state, currentNode, advance, goBack, reset, canGoBack, questionDepth } = useQuizState();
  const [phase, setPhase] = useState<Phase>("quiz");
  const [resolvedEndpoint, setResolvedEndpoint] = useState<EndpointNode | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeChips, setActiveChips] = useState<Q4Chip[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRange, setSearchRange] = useState(3);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // Handle endpoint reached — only trigger once when endpoint first appears
  useEffect(() => {
    if (!state.endpoint) return;

    let endpoint = state.endpoint;

    // Handle random genres
    if (endpoint.genreIds.includes("__random__")) {
      const randomIds = resolveRandomGenre(endpoint.resultLabel);
      endpoint = { ...endpoint, genreIds: randomIds };
    }

    setResolvedEndpoint(endpoint);
    setPhase("analyzing");

    // Analyzing(2.5s) → Reveal(3.5s) → Detail
    const t1 = setTimeout(() => setPhase("reveal"), 2500);
    const t2 = setTimeout(() => setPhase("detail"), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.endpoint]);

  // detailフェーズに入ったら自動で位置情報を取得してお店検索
  useEffect(() => {
    if (phase !== "detail" || !resolvedEndpoint || userLocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        searchRestaurants(latitude, longitude, searchRange);
      },
      () => {
        // 拒否された場合は何もしない（手動検索UIが表示される）
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleAnswer = useCallback((option: OptionNode) => {
    setDirection("forward");
    advance(option);
  }, [advance]);

  const handleBack = useCallback(() => {
    setDirection("back");
    goBack();
  }, [goBack]);

  const handleReset = useCallback(() => {
    reset();
    setPhase("quiz");
    setResolvedEndpoint(null);
    setRestaurants([]);
    setActiveChips([]);
    setUserLocation(null);
  }, [reset]);

  const searchRestaurants = useCallback(async (lat: number, lng: number, range: number) => {
    if (!resolvedEndpoint) return;
    setUserLocation({ lat, lng });
    setSearchRange(range);
    setIsSearching(true);

    const genreId = resolvedEndpoint.genreIds[0];
    const genre = GENRE_MAP[genreId];
    if (!genre) { setIsSearching(false); return; }

    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      range: String(range),
      count: "5",
    });
    if (genre.keyword) params.set("keyword", genre.keyword);
    else params.set("genre", genre.hotpepperCode);

    for (const chip of activeChips) {
      params.set(chip.apiParam, chip.apiValue);
    }

    try {
      const res = await fetch(`/api/restaurants?${params.toString()}`);
      const data = await res.json();
      setRestaurants(data.restaurants || []);
    } catch {
      setRestaurants([]);
    } finally {
      setIsSearching(false);
    }
  }, [resolvedEndpoint, activeChips]);

  const toggleChip = useCallback((chip: Q4Chip) => {
    setActiveChips(prev =>
      prev.find(c => c.id === chip.id)
        ? prev.filter(c => c.id !== chip.id)
        : [...prev, chip]
    );
  }, []);

  // ===== QUIZ PHASE =====
  if (phase === "quiz" && currentNode) {
    const theme = getTheme(state.currentNodeId);
    const prevLabel = canGoBack
      ? state.answerLabels[state.pathStack[state.pathStack.length - 2]]
      : null;

    return (
      <main className={`min-h-screen bg-gradient-to-b ${theme.gradient} flex flex-col`}>
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4">
          <button
            onClick={handleBack}
            disabled={!canGoBack}
            className={`flex items-center gap-1 p-2 rounded-xl transition-all ${
              canGoBack
                ? "text-gray-700 hover:bg-white/60 active:scale-95"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={20} />
            {prevLabel && (
              <span className="text-xs text-gray-500">
                {prevLabel.emoji} {prevLabel.label}
              </span>
            )}
          </button>
          <Link href="/" className="font-bold text-gray-800 text-sm">
            こんやのきぶん
          </Link>
          <div className="w-10" />
        </header>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 py-2">
          {Array.from({ length: Math.max(3, questionDepth + 1) }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i < questionDepth
                  ? "w-6 bg-current opacity-80"
                  : i === questionDepth
                    ? "w-8 bg-current"
                    : "w-2 bg-gray-300/50"
              }`}
              style={{ color: theme.accent }}
            />
          ))}
        </div>

        {/* Quiz content */}
        <div className="flex-1 flex flex-col items-center px-6 pt-4 pb-16">
          {/* KibunKun */}
          <motion.div
            key={`kibun-${state.currentNodeId}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <KibunKun
              expression={currentNode.kibunExpression}
              size={80}
              speech={currentNode.kibunSpeech}
              animate="bounce"
            />
          </motion.div>

          {/* Question */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={state.currentNodeId}
              custom={direction}
              initial={{ x: direction === "forward" ? 200 : -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
              exit={{ x: direction === "forward" ? -200 : 200, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
              className="w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
                {currentNode.question}
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                {currentNode.subtitle}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {currentNode.options.map((option, i) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                    onClick={() => handleAnswer(option)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl text-left shadow-sm hover:shadow-md hover:bg-white transition-all"
                  >
                    <span className="text-3xl flex-shrink-0">{option.emoji}</span>
                    <span className="text-base font-medium text-gray-800">{option.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    );
  }

  // ===== ANALYZING PHASE =====
  if (phase === "analyzing") {
    const labels = Object.values(state.answerLabels);
    return (
      <main className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(180deg, #2D2B55 0%, #3d2b6b 40%, #6b3a5c 70%, #c4563a 100%)" }}
      >
        <KibunKun expression="thinking" size={100} speech="解析中..." animate="analyzing" />
        <div className="mt-8 space-y-2">
          {labels.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.4 }}
              className="text-white/70 text-sm flex items-center gap-2"
            >
              <span>{l.emoji}</span>
              <span>{l.label}</span>
              <span className="text-green-400">✓</span>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.0 }}
          className="mt-6 text-white text-xl font-bold"
        >
          わかりました！
        </motion.p>
      </main>
    );
  }

  // ===== REVEAL PHASE =====
  if (phase === "reveal" && resolvedEndpoint) {
    const firstGenre = GENRE_MAP[resolvedEndpoint.genreIds[0]];
    return (
      <main className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(180deg, #2D2B55 0%, #3d2b6b 40%, #6b3a5c 70%, #c4563a 100%)" }}
      >
        <KibunKun expression="tada" size={120} speech="今夜はこれでしょ！" animate="celebrate" />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-7xl mt-4"
        >
          {firstGenre?.icon || "🍽️"}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-white mt-4 text-center"
        >
          {resolvedEndpoint.resultLabel}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/60 mt-2 text-center"
        >
          {resolvedEndpoint.resultDescription}
        </motion.p>
      </main>
    );
  }

  // ===== DETAIL PHASE =====
  if (phase === "detail" && resolvedEndpoint) {
    const firstGenre = GENRE_MAP[resolvedEndpoint.genreIds[0]];

    return (
      <main className="min-h-screen pb-20">
        {/* Hero */}
        <section
          className="relative pt-12 pb-16 text-center"
          style={{ background: "linear-gradient(180deg, #2D2B55 0%, #3d2b6b 30%, #6b3a5c 60%, #c4563a 85%, #FFF8F0 100%)" }}
        >
          <KibunKun expression="tada" size={80} />
          <div className="text-5xl mt-2">{firstGenre?.icon || "🍽️"}</div>
          <h1 className="text-2xl font-bold text-white mt-2">{resolvedEndpoint.resultLabel}</h1>
          <p className="text-white/60 text-sm mt-1">{resolvedEndpoint.resultDescription}</p>
        </section>

        <section className="max-w-md mx-auto px-6 -mt-6 relative z-10">
          {/* Q4 Chips */}
          {resolvedEndpoint.q4Options.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-2 font-medium">こだわり条件</p>
              <div className="flex flex-wrap gap-2">
                {resolvedEndpoint.q4Options.map((chip) => {
                  const isActive = activeChips.some((c) => c.id === chip.id);
                  return (
                    <button
                      key={chip.id}
                      onClick={() => {
                        toggleChip(chip);
                        if (userLocation) {
                          setTimeout(() => searchRestaurants(userLocation.lat, userLocation.lng, searchRange), 100);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isActive
                          ? "bg-orange-500 text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Location search */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-3 font-medium">近くのお店を探す</p>
            <div className="flex gap-2 mb-3">
              {[
                { label: "🚶 徒歩", range: 2 },
                { label: "🚲 自転車", range: 3 },
                { label: "🚃 電車", range: 4 },
                { label: "🚗 車", range: 5 },
              ].map((t) => (
                <button
                  key={t.range}
                  onClick={() => setSearchRange(t.range)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                    searchRange === t.range
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  (pos) => searchRestaurants(pos.coords.latitude, pos.coords.longitude, searchRange),
                  () => alert("位置情報の許可が必要です")
                );
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              📍 現在地からお店を探す
            </button>
          </div>

          {/* Restaurant list */}
          {isSearching && (
            <div className="text-center py-8">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="text-3xl inline-block">🍽️</motion.div>
              <p className="text-gray-500 text-sm mt-2">お店を探しています...</p>
            </div>
          )}

          {!isSearching && restaurants.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-medium">{restaurants.length}件見つかりました</p>
              {restaurants.map((r, i) => (
                <motion.a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  {r.photo.pc.m && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.photo.pc.m} alt={r.name} className="w-full h-36 object-cover" />
                  )}
                  <div className="p-3">
                    <h3 className="font-bold text-gray-800 text-sm">{r.name}</h3>
                    {r.catchPhrase && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{r.catchPhrase}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      {r.budget && <span>💰 {r.budget}</span>}
                      {r.access && <span className="line-clamp-1">📍 {r.access}</span>}
                    </div>
                  </div>
                </motion.a>
              ))}

              {/* Hot Pepper credit */}
              <div className="flex flex-col items-center gap-2 pt-4">
                <a href="http://webservice.recruit.co.jp/" target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="http://webservice.recruit.co.jp/banner/hotpepper-m.gif" alt="ホットペッパーグルメ" width={88} height={35} />
                </a>
                <p className="text-[10px] text-gray-400">
                  Powered by <a href="http://webservice.recruit.co.jp/" target="_blank" rel="noopener noreferrer" className="underline">ホットペッパーグルメ Webサービス</a>
                </p>
              </div>
            </div>
          )}

          {!isSearching && userLocation && restaurants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">😢</p>
              <p className="text-gray-500 text-sm">周辺にお店が見つかりませんでした</p>
              <p className="text-gray-400 text-xs mt-1">検索範囲を広げてみてください</p>
            </div>
          )}

          {/* Siblings */}
          {resolvedEndpoint.siblingHint && resolvedEndpoint.siblingHint.length > 0 && (
            <div className="mt-8">
              <p className="text-xs text-gray-500 mb-2 font-medium">こっちもいいかも</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {resolvedEndpoint.siblingHint.map((hint) => (
                  <button
                    key={hint}
                    onClick={() => {
                      const ep = findEndpointByLabel(hint);
                      if (ep) {
                        let resolved = ep;
                        if (resolved.genreIds.includes("__random__")) {
                          const randomIds = resolveRandomGenre(resolved.resultLabel);
                          resolved = { ...resolved, genreIds: randomIds };
                        }
                        setResolvedEndpoint(resolved);
                        setRestaurants([]);
                        setActiveChips([]);
                        setUserLocation(null);
                        // re-search if location was already granted
                      }
                    }}
                    className="flex-shrink-0 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm text-gray-700 shadow-sm hover:border-orange-300 hover:shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 mb-3 font-medium">結果をシェア</p>
            <div className="flex gap-3 justify-center">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`今夜の気分は「${resolvedEndpoint.resultLabel}」でした！\n${resolvedEndpoint.resultDescription}\n\n#こんやのきぶん #きぶんで夜ごはん`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all"
              >
                X
              </a>
              <a
                href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#06C755] text-white text-sm font-medium hover:bg-[#05b34d] transition-all"
              >
                LINE
              </a>
            </div>
          </div>

          {/* Retry */}
          <div className="mt-10 text-center">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:shadow-md transition-all"
            >
              🔄 もう一度診断する
            </button>
          </div>
        </section>
      </main>
    );
  }

  // Fallback loading
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
      <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }} className="text-5xl">
        🍽️
      </motion.div>
    </main>
  );
}
