"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Navigation } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import type { Genre } from "@/types";

const TRANSPORT_OPTIONS = [
  { id: "walk", label: "徒歩", emoji: "🚶", range: 2 },
  { id: "bike", label: "自転車", emoji: "🚲", range: 3 },
  { id: "train", label: "電車", emoji: "🚃", range: 4 },
  { id: "car", label: "車", emoji: "🚗", range: 5 },
];

interface LocationPromptProps {
  onLocationGranted: (lat: number, lng: number, range: number) => void;
  onManualSearch: (keyword: string) => void;
  selectedGenre: Genre | null;
}

export function LocationPrompt({
  onLocationGranted,
  onManualSearch,
  selectedGenre,
}: LocationPromptProps) {
  const { status, lat, lng, requestLocation } = useLocation();
  const [manualInput, setManualInput] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [selectedRange, setSelectedRange] = useState(3);

  useEffect(() => {
    if (status === "granted" && lat && lng) {
      onLocationGranted(lat, lng, selectedRange);
    }
    if (status === "denied") {
      setShowManual(true);
    }
  }, [status, lat, lng, onLocationGranted, selectedRange]);

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualInput.trim()) {
      onManualSearch(manualInput.trim());
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-[#5C3D2E]/5"
    >
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FF6B35]/10 mb-3">
          <MapPin size={24} className="text-[#FF6B35]" />
        </div>
        <h2 className="font-heading font-bold text-lg text-[#3d2e1f]">
          {selectedGenre
            ? `近くの${selectedGenre.name}を探す`
            : "近くのお店を探す"}
        </h2>
      </div>

      {/* Transport selector */}
      <div className="mb-4">
        <p className="text-xs text-[#8B6F61] mb-2 text-center">
          今日のフットワークは？
        </p>
        <div className="grid grid-cols-4 gap-2">
          {TRANSPORT_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedRange(t.range)}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedRange === t.range
                  ? "bg-[#FF6B35]/10 border-2 border-[#FF6B35]/30 text-[#FF6B35]"
                  : "bg-[#FFF8F0] border border-[#5C3D2E]/5 text-[#8B6F61] hover:bg-[#FFF0E6]"
              }`}
            >
              <span className="text-lg">{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {!showManual ? (
        <div className="space-y-3">
          <button
            onClick={requestLocation}
            disabled={status === "requesting"}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#FF6B35] text-white font-bold text-base hover:bg-[#E55A2B] active:scale-[0.98] transition-all shadow-md disabled:opacity-50"
          >
            <Navigation size={18} />
            {status === "requesting" ? "取得中..." : "現在地からお店を探す"}
          </button>

          <button
            onClick={() => setShowManual(true)}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[#8B6F61] hover:text-[#FF6B35] transition-colors"
          >
            <Search size={14} />
            駅名・エリア名で探す
          </button>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6F61]/40"
            />
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="例: 渋谷、東京駅、新宿三丁目"
              className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[#FFF8F0] border border-[#5C3D2E]/8 text-[#3d2e1f] placeholder:text-[#8B6F61]/40 focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="w-full py-3.5 px-6 rounded-xl bg-[#FF6B35] text-white font-bold hover:bg-[#E55A2B] active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            このエリアで探す
          </button>
          {status !== "denied" && (
            <button
              type="button"
              onClick={() => setShowManual(false)}
              className="w-full text-center text-sm text-[#8B6F61] hover:text-[#FF6B35] transition-colors py-2"
            >
              現在地で探す
            </button>
          )}
        </form>
      )}
    </motion.div>
  );
}
