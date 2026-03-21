"use client";

import { motion } from "framer-motion";
import type { Genre } from "@/types";

interface GenreCardProps {
  genre: Genre;
  rank: 1 | 2 | 3;
  onSelect: (genre: Genre) => void;
  isSelected: boolean;
}

export function GenreCard({ genre, rank, onSelect, isSelected }: GenreCardProps) {
  const isMain = rank === 1;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (rank - 1) * 0.15, duration: 0.5 }}
      onClick={() => onSelect(genre)}
      className={`
        w-full text-left rounded-2xl transition-all duration-300
        ${
          isMain
            ? "p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30"
            : "p-4 warm-card"
        }
        ${isSelected ? "ring-2 ring-primary shadow-lg" : ""}
      `}
    >
      {isMain && (
        <span className="inline-block text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full mb-3">
          イチオシ！
        </span>
      )}
      <div className="flex items-center gap-3">
        <span className={isMain ? "text-5xl" : "text-3xl"}>{genre.emoji}</span>
        <div>
          <h3
            className={`font-heading font-bold text-accent ${
              isMain ? "text-2xl" : "text-lg"
            }`}
          >
            {genre.name}
          </h3>
          <p className="text-sm text-accent-light/70 mt-0.5">
            {genre.description}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
