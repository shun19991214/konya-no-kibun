"use client";

import { motion } from "framer-motion";
import type { Genre } from "@/types";

interface GenreCardProps {
  genre: Genre;
  rank: 1 | 2 | 3;
  onSelect: (genre: Genre) => void;
  isSelected: boolean;
}

const rankColors = {
  1: { bg: "linear-gradient(135deg, #FF6B35 0%, #E8A838 100%)", text: "#fff" },
  2: { bg: "linear-gradient(135deg, #C4563A 0%, #E8A838 100%)", text: "#fff" },
  3: { bg: "linear-gradient(135deg, #8B6F61 0%, #C4563A 100%)", text: "#fff" },
};

export function GenreCard({ genre, rank, onSelect, isSelected }: GenreCardProps) {
  const isMain = rank === 1;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (rank - 1) * 0.15, duration: 0.5 }}
      onClick={() => onSelect(genre)}
      className={`
        w-full text-left rounded-2xl transition-all duration-300 relative overflow-hidden
        ${
          isMain
            ? "p-6 bg-white border-2 shadow-lg"
            : "p-4 bg-white/70 border shadow-sm"
        }
        ${
          isSelected
            ? "border-[#FF6B35] shadow-lg shadow-[#FF6B35]/10"
            : "border-[#5C3D2E]/8 hover:border-[#FF6B35]/30 hover:shadow-md"
        }
      `}
    >
      {/* Rank badge */}
      <div
        className="absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl"
        style={{ background: rankColors[rank].bg, color: rankColors[rank].text }}
      >
        {rank}位
      </div>

      {isMain && (
        <span className="inline-block text-[10px] font-bold text-[#FF6B35] bg-[#FF6B35]/10 px-2.5 py-1 rounded-full mb-3 tracking-wide">
          あなたにぴったり
        </span>
      )}
      <div className="flex items-center gap-4">
        <span className={`${isMain ? "text-5xl" : "text-3xl"}`}>
          {genre.emoji}
        </span>
        <div>
          <h3
            className={`font-heading font-bold text-[#3d2e1f] ${
              isMain ? "text-2xl" : "text-lg"
            }`}
          >
            {genre.name}
          </h3>
          <p className="text-sm text-[#8B6F61] mt-0.5">
            {genre.description}
          </p>
          {!isMain && !isSelected && (
            <p className="text-[10px] text-[#FF6B35]/60 mt-1">
              タップでお店を切り替え →
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
}
