"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  progress: number;
}

export function ProgressBar({ current, total, progress }: ProgressBarProps) {
  return (
    <div className="w-full max-w-lg mx-auto px-6 py-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-accent-light/60 font-medium">
          Q{current + 1} / {total}
        </span>
        <span className="text-xs text-accent-light/60 font-medium">
          {progress}%
        </span>
      </div>
      <div className="h-2 bg-card rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
