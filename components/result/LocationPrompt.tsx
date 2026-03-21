"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import type { Genre } from "@/types";

interface LocationPromptProps {
  onLocationGranted: (lat: number, lng: number) => void;
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

  useEffect(() => {
    if (status === "granted" && lat && lng) {
      onLocationGranted(lat, lng);
    }
    if (status === "denied") {
      setShowManual(true);
    }
  }, [status, lat, lng, onLocationGranted]);

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
      className="space-y-4"
    >
      <div className="text-center mb-4">
        <h2 className="font-heading font-bold text-lg text-accent">
          {selectedGenre
            ? `近くの${selectedGenre.name}を探す`
            : "近くのお店を探す"}
        </h2>
        <p className="text-sm text-accent-light/60 mt-1">
          位置情報を使って周辺のお店を検索します
        </p>
      </div>

      {!showManual ? (
        <div className="space-y-3">
          <button
            onClick={requestLocation}
            disabled={status === "requesting"}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-primary text-white font-bold text-base hover:bg-primary-dark transition-colors animate-pulse-glow disabled:opacity-50"
          >
            <MapPin size={20} />
            {status === "requesting"
              ? "位置情報を取得中..."
              : "現在地からお店を探す"}
          </button>

          <button
            onClick={() => setShowManual(true)}
            className="w-full text-center text-sm text-accent-light/60 hover:text-primary transition-colors py-2"
          >
            駅名・エリア名で探す
          </button>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-light/40"
            />
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="例: 渋谷、東京駅、新宿三丁目"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card border border-primary/10 text-accent placeholder:text-accent-light/40 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            このエリアで探す
          </button>
          {status !== "denied" && (
            <button
              type="button"
              onClick={() => setShowManual(false)}
              className="w-full text-center text-sm text-accent-light/60 hover:text-primary transition-colors py-2"
            >
              現在地で探す
            </button>
          )}
        </form>
      )}
    </motion.div>
  );
}
