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
        <span className="text-xs text-[#8B6F61] font-bold tracking-wide">
          Q{current + 1}
          <span className="text-[#8B6F61]/40 font-normal"> / {total}</span>
        </span>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i < current
                  ? "w-3 bg-[#FF6B35]"
                  : i === current
                    ? "w-5 bg-[#FF6B35]"
                    : "w-1.5 bg-[#5C3D2E]/10"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="h-1 bg-[#5C3D2E]/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, #FF6B35 0%, #E8A838 ${Math.min(progress + 30, 100)}%, #C4563A 100%)`,
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
