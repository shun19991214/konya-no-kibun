"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useQuizState } from "@/hooks/useQuizState";
import { KibunKun } from "@/components/character/KibunKun";
import { GENRE_MAP } from "@/data/genres";
import { QUESTION_TREE } from "@/data/questionTree";
import { resolveRandomGenre } from "@/lib/randomGenre";
import { Q4_CHIPS } from "@/data/q4chips";
import type { EndpointNode, OptionNode, Restaurant, Q4Chip } from "@/types";

// ===== Phase types =====
type Phase = "quiz" | "analyzing" | "reveal" | "detail";

// ===== Question themes (mood-specific background colors) =====
const QUESTION_THEMES: Record<string, { gradient: string; accent: string }> = {
  // Q1: 共通（夕暮れオレンジ）
  q1: { gradient: "from-orange-50 to-amber-50", accent: "#F97316" },
  // Q2: 一日の気分ごとに色を変える
  "q1-exhausted-q2": { gradient: "from-blue-50 to-indigo-50", accent: "#6366F1" },
  "q1-hyper-q2": { gradient: "from-red-50 to-orange-50", accent: "#EF4444" },
  "q1-normal-q2": { gradient: "from-emerald-50 to-teal-50", accent: "#10B981" },
  "q1-stressed-q2": { gradient: "from-purple-50 to-pink-50", accent: "#A855F7" },
  // Q3: Q2の色を引き継ぎ
  "q2-exhausted-solo-q3": { gradient: "from-blue-50 to-indigo-50", accent: "#6366F1" },
  "q2-exhausted-partner-q3": { gradient: "from-blue-50 to-indigo-50", accent: "#6366F1" },
  "q2-exhausted-friends-q3": { gradient: "from-blue-50 to-indigo-50", accent: "#6366F1" },
  "q2-exhausted-family-q3": { gradient: "from-blue-50 to-indigo-50", accent: "#6366F1" },
  "q2-hyper-solo-q3": { gradient: "from-red-50 to-orange-50", accent: "#EF4444" },
  "q2-hyper-partner-q3": { gradient: "from-red-50 to-orange-50", accent: "#EF4444" },
  "q2-hyper-friends-q3": { gradient: "from-red-50 to-orange-50", accent: "#EF4444" },
  "q2-hyper-family-q3": { gradient: "from-red-50 to-orange-50", accent: "#EF4444" },
  "q2-normal-solo-q3": { gradient: "from-emerald-50 to-teal-50", accent: "#10B981" },
  "q2-normal-partner-q3": { gradient: "from-emerald-50 to-teal-50", accent: "#10B981" },
  "q2-normal-friends-q3": { gradient: "from-emerald-50 to-teal-50", accent: "#10B981" },
  "q2-normal-family-q3": { gradient: "from-emerald-50 to-teal-50", accent: "#10B981" },
  "q2-stressed-solo-q3": { gradient: "from-purple-50 to-pink-50", accent: "#A855F7" },
  "q2-stressed-partner-q3": { gradient: "from-purple-50 to-pink-50", accent: "#A855F7" },
  "q2-stressed-friends-q3": { gradient: "from-purple-50 to-pink-50", accent: "#A855F7" },
  "q2-stressed-family-q3": { gradient: "from-purple-50 to-pink-50", accent: "#A855F7" },
  // Q4: 五感の連想（ゴールドに統一＝「もうすぐ当てるよ」感）
  "q3-warm-solo-q4": { gradient: "from-yellow-50 to-amber-50", accent: "#F59E0B" },
  "q3-reward-solo-q4": { gradient: "from-yellow-50 to-amber-50", accent: "#F59E0B" },
  "q3-simple-solo-q4": { gradient: "from-yellow-50 to-amber-50", accent: "#F59E0B" },
  "q3-hyper-friends-cheers-q4": { gradient: "from-yellow-50 to-amber-50", accent: "#F59E0B" },
  "q3-normal-solo-curious-q4": { gradient: "from-yellow-50 to-amber-50", accent: "#F59E0B" },
  "q3-stressed-solo-destroy-q4": { gradient: "from-yellow-50 to-amber-50", accent: "#F59E0B" },
};

function getTheme(nodeId: string) {
  return QUESTION_THEMES[nodeId] || QUESTION_THEMES.q1;
}

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

export default function PlayPage() {
  const { state, currentNode, advance, goBack, reset, canGoBack, questionDepth } = useQuizState();
  const [phase, setPhase] = useState<Phase>("quiz");
  const [resolvedEndpoint, setResolvedEndpoint] = useState<EndpointNode | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeChips, setActiveChips] = useState<Q4Chip[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRange, setSearchRange] = useState(3);
  const [transportMode, setTransportMode] = useState<"walk" | "bicycle" | "train" | "car">("walk");
  const [stationQuery, setStationQuery] = useState("");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  // Skip the chip-driven re-search on initial mount; only re-search when chips actually toggle.
  const skipChipSearchRef = useRef(true);

  // Handle endpoint reached
  useEffect(() => {
    if (!state.endpoint) return;

    let endpoint = state.endpoint;
    if (endpoint.genreIds.includes("__random__")) {
      const randomIds = resolveRandomGenre(endpoint.resultLabel);
      endpoint = { ...endpoint, genreIds: randomIds };
    }

    setResolvedEndpoint(endpoint);
    setPhase("analyzing");

    const t1 = setTimeout(() => setPhase("reveal"), 2500);
    const t2 = setTimeout(() => setPhase("detail"), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.endpoint]);

  // Auto-geolocation on detail phase (not for train mode)
  useEffect(() => {
    if (phase !== "detail" || !resolvedEndpoint || userLocation || transportMode === "train") return;
    navigator.geolocation.getCurrentPosition(
      (pos) => searchRestaurants(pos.coords.latitude, pos.coords.longitude, searchRange),
      () => { /* denied — manual UI shown */ }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleAnswer = useCallback((option: OptionNode) => {
    setSelectedOptionId(option.id);
    // Short delay for selection feedback, then advance
    setTimeout(() => {
      setDirection("forward");
      advance(option);
      setSelectedOptionId(null);
    }, 200);
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
    skipChipSearchRef.current = true;
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

  // Re-search when chips change (avoids stale-closure bug from inline setTimeout)
  useEffect(() => {
    if (skipChipSearchRef.current) {
      skipChipSearchRef.current = false;
      return;
    }
    if (userLocation && resolvedEndpoint) {
      searchRestaurants(userLocation.lat, userLocation.lng, searchRange);
    }
    // intentionally only watch activeChips; other deps would over-trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChips]);

  // 駅名・エリア名でキーワード検索
  const searchByStation = useCallback(async (query: string) => {
    if (!resolvedEndpoint || !query.trim()) return;
    setIsSearching(true);
    setUserLocation(null);

    const genreId = resolvedEndpoint.genreIds[0];
    const genre = GENRE_MAP[genreId];
    if (!genre) { setIsSearching(false); return; }

    const params = new URLSearchParams({
      keyword: `${query} ${genre.keyword || genre.label}`,
      range: "5",
      count: "5",
    });

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

  // 交通手段を選択した時の処理
  const selectTransport = useCallback((mode: "walk" | "bicycle" | "train" | "car") => {
    setTransportMode(mode);
    setRestaurants([]);
    setUserLocation(null);

    // 車 → 駐車場ありを自動ON
    if (mode === "car") {
      setActiveChips(prev => {
        if (prev.find(c => c.id === "parking")) return prev;
        return [...prev, Q4_CHIPS.parking];
      });
      setSearchRange(5);
    } else {
      // 車以外 → 駐車場チップを自動OFF
      setActiveChips(prev => prev.filter(c => c.id !== "parking"));
      setSearchRange(mode === "walk" ? 2 : mode === "bicycle" ? 3 : 5);
    }
  }, []);

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
      <main className={`min-h-screen bg-gradient-to-b ${theme.gradient} flex flex-col transition-colors duration-500`}>
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4">
          <button
            onClick={handleBack}
            disabled={!canGoBack}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
              canGoBack
                ? "text-gray-700 hover:bg-white/60 active:scale-95"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={18} />
            {canGoBack && (
              <span className="text-xs font-medium text-gray-500">戻る</span>
            )}
          </button>
          <Link href="/" className="font-bold text-gray-800 text-sm">
            こんやのきぶん
          </Link>
          <div className="w-10" />
        </header>

        {/* Progress dots — fixed 4 steps, unified orange color */}
        <div className="flex justify-center gap-1.5 py-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i < questionDepth
                  ? "w-6 bg-orange-400 opacity-80"
                  : i === questionDepth
                    ? "w-8 bg-orange-500"
                    : "w-2 bg-gray-300/40"
              }`}
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
              size={140}
              speech={currentNode.kibunSpeech}
              animate="bounce"
            />
          </motion.div>

          {/* Question */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={state.currentNodeId}
              custom={direction}
              initial={{ x: direction === "forward" ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }}
              exit={{ x: direction === "forward" ? -100 : 100, opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }}
              className="w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
                {currentNode.question}
              </h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                {currentNode.subtitle}
              </p>

              {/* Options with selection animation */}
              <div className="space-y-3">
                {currentNode.options.map((option, i) => {
                  const isSelected = selectedOptionId === option.id;
                  const isOther = selectedOptionId !== null && selectedOptionId !== option.id;

                  return (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{
                        opacity: isOther ? 0.3 : 1,
                        y: 0,
                        scale: isSelected ? 1.03 : isOther ? 0.97 : 1,
                      }}
                      transition={{ delay: selectedOptionId ? 0 : i * 0.03, duration: 0.15 }}
                      onClick={() => !selectedOptionId && handleAnswer(option)}
                      whileHover={!selectedOptionId ? { scale: 1.02 } : undefined}
                      whileTap={!selectedOptionId ? { scale: 0.97 } : undefined}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 ${
                        isSelected
                          ? "bg-white border-2 shadow-lg"
                          : "bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md hover:bg-white"
                      } ${isOther ? "cursor-not-allowed" : ""}`}
                      style={isSelected ? { borderColor: theme.accent } : undefined}
                    >
                      <motion.span
                        className="text-3xl shrink-0"
                        animate={isSelected ? { scale: [1, 1.4, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {option.emoji}
                      </motion.span>
                      <span className="text-base font-medium text-gray-800">{option.label}</span>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto text-lg"
                          style={{ color: theme.accent }}
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
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
        <KibunKun expression="thinking" size={150} speech="あなたの気分を解析中..." animate="analyzing" glow />
        <div className="mt-8 space-y-3">
          {labels.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.5 }}
              className="text-white/80 text-base flex items-center gap-3"
            >
              <span className="text-xl">{l.emoji}</span>
              <span>{l.label}</span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.5 + 0.3 }}
                className="text-green-400"
              >
                ✓
              </motion.span>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.0, type: "spring", stiffness: 200 }}
          className="mt-8"
        >
          <KibunKun expression="confident" size={130} speech="わかりました！" animate="growConfident" glow />
        </motion.div>
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
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <KibunKun expression="tada" size={170} speech="今夜はこれでしょ！" animate="celebrate" glow />
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 10 }}
          className="text-8xl mt-6"
        >
          {firstGenre?.icon || "🍽️"}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-4xl font-bold text-white mt-6 text-center drop-shadow-lg"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
        >
          {resolvedEndpoint.resultLabel}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-white/70 text-lg mt-3 text-center"
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
        {/* Hero with KibunKun speech */}
        <section
          className="relative pt-8 pb-20 text-center"
          style={{ background: "linear-gradient(180deg, #2D2B55 0%, #3d2b6b 30%, #6b3a5c 60%, #c4563a 85%, #FFF8F0 100%)" }}
        >
          <KibunKun expression="tada" size={130} speech="今夜はこれでしょ！" glow />
          <div className="text-6xl mt-3">{firstGenre?.icon || "🍽️"}</div>
          <h1
            className="text-3xl font-bold text-white mt-3 drop-shadow-md"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
          >
            {resolvedEndpoint.resultLabel}
          </h1>
          <p className="text-white/60 text-sm mt-2">{resolvedEndpoint.resultDescription}</p>
        </section>

        <section className="max-w-md mx-auto px-6 -mt-8 relative z-10">
          {/* Retry — near the top */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleReset}
              className="text-xs text-orange-500 font-medium hover:underline"
            >
              🔄 もう一度診断する
            </button>
          </div>

          {/* Q4 Chips */}
          {resolvedEndpoint.q4Options.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-2 font-medium">条件で絞り込む</p>
              <div className="flex flex-wrap gap-2">
                {resolvedEndpoint.q4Options.map((chip) => {
                  const isActive = activeChips.some((c) => c.id === chip.id);
                  return (
                    <button
                      key={chip.id}
                      onClick={() => toggleChip(chip)}
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

          {/* Transport mode + Location search */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-3 font-medium">どうやって行く？</p>
            <div className="flex gap-2 mb-4">
              {([
                { id: "walk" as const, label: "🚶 徒歩", sub: "近場で" },
                { id: "bicycle" as const, label: "🚲 自転車", sub: "ちょい遠でも" },
                { id: "train" as const, label: "🚃 電車", sub: "駅で探す" },
                { id: "car" as const, label: "🚗 車", sub: "駐車場あり" },
              ]).map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTransport(t.id)}
                  className={`flex-1 py-2.5 rounded-xl text-center transition-all ${
                    transportMode === t.id
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
                  }`}
                >
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className={`text-[10px] mt-0.5 ${transportMode === t.id ? "text-white/70" : "text-gray-400"}`}>{t.sub}</div>
                </button>
              ))}
            </div>

            {/* 電車モード: 駅名入力 */}
            {transportMode === "train" ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={stationQuery}
                    onChange={(e) => setStationQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchByStation(stationQuery)}
                    placeholder="駅名・エリア名を入力"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                  />
                  <button
                    onClick={() => searchByStation(stationQuery)}
                    disabled={!stationQuery.trim()}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-40"
                  >
                    検索
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center">例: 渋谷、新宿三丁目、池袋東口</p>
              </div>
            ) : (
              /* 徒歩/自転車/車モード: 現在地検索 */
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
            )}
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
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  {r.photo.pc.m && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.photo.pc.m} alt={r.name} loading="lazy" className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800">{r.name}</h3>
                    {r.catchPhrase && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.catchPhrase}</p>}
                    <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-500">
                      {r.budget && <span>💰 {r.budget}</span>}
                      {r.access && <span className="line-clamp-1">📍 {r.access}</span>}
                    </div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      ホットペッパーで見る →
                    </a>
                  </div>
                </motion.div>
              ))}

              {/* Hot Pepper credit */}
              <div className="flex flex-col items-center gap-2 pt-4">
                <a href="https://webservice.recruit.co.jp/" target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://webservice.recruit.co.jp/banner/hotpepper-m.gif" alt="ホットペッパーグルメ" width={88} height={35} />
                </a>
                <p className="text-[10px] text-gray-400">
                  Powered by <a href="https://webservice.recruit.co.jp/" target="_blank" rel="noopener noreferrer" className="underline">ホットペッパーグルメ Webサービス</a>
                </p>
              </div>
            </div>
          )}

          {!isSearching && userLocation && restaurants.length === 0 && (
            <div className="text-center py-8">
              <KibunKun expression="thinking" size={100} speech="うーん、近くにないかも…" />
              <p className="text-gray-400 text-xs mt-4">検索範囲を広げてみてください</p>
            </div>
          )}

          {/* Siblings — bottom position */}
          {resolvedEndpoint.siblingHint && resolvedEndpoint.siblingHint.length > 0 && (
            <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <KibunKun expression="excited" size={56} />
                <p className="text-sm font-medium text-gray-700">こっちもどうかな？</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {resolvedEndpoint.siblingHint.map((hint) => {
                  const ep = findEndpointByLabel(hint);
                  const genre = ep ? GENRE_MAP[ep.genreIds[0]] : null;
                  return (
                    <button
                      key={hint}
                      onClick={() => {
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
                        }
                      }}
                      className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-orange-200 text-sm text-gray-700 shadow-sm hover:border-orange-400 hover:shadow-md transition-all active:scale-95"
                    >
                      {genre && <span className="text-lg">{genre.icon}</span>}
                      <span className="font-medium">{hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 mb-3 font-medium">結果をシェア</p>
            <div className="flex gap-3 justify-center">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`きぶんくんに当てられた！\n今夜の気分は「${resolvedEndpoint.resultLabel}」🎯\n${resolvedEndpoint.resultDescription}\n\n#こんやのきぶん #きぶんで夜ごはん`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
              </a>
              <a
                href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#06C755] text-white text-sm font-medium hover:bg-[#05b34d] transition-all hover:scale-105 active:scale-95"
              >
                LINE
              </a>
            </div>
          </div>

          {/* Retry */}
          <div className="mt-10 text-center">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:shadow-md transition-all active:scale-95"
            >
              🔄 もう一度診断する
            </button>
          </div>
        </section>
      </main>
    );
  }

  // ===== Fallback: transitioning to analyzing =====
  return (
    <main className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(180deg, #2D2B55 0%, #3d2b6b 40%, #6b3a5c 70%, #c4563a 100%)" }}
    >
      <KibunKun expression="thinking" size={100} animate="analyzing" />
    </main>
  );
}
