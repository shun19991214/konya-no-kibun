"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import type { KibunExpression } from "@/types";

type AnimationType =
  | "float"
  | "bounce"
  | "growConfident"
  | "celebrate"
  | "analyzing"
  | "shrink"
  | "none";

type Props = {
  expression?: KibunExpression;
  size?: number;
  speech?: string;
  className?: string;
  animate?: AnimationType;
  glow?: boolean; // 背景から浮かび上がらせるグロー
};

const IMAGE_MAP: Record<KibunExpression, string> = {
  normal: "/character/kibun-normal.svg",
  thinking: "/character/kibun-thinking.webp",
  excited: "/character/kibun-excited.webp",
  confident: "/character/kibun-confident.webp",
  tada: "/character/kibun-tada.webp",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BODY_ANIMATIONS: Record<AnimationType, { animate: any; transition: any }> = {
  float: {
    animate: { y: [0, -10, 0] },
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
  },
  bounce: {
    animate: { y: [0, -15, 0], scale: [1, 1.08, 1] },
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  growConfident: {
    animate: { scale: [1, 1.2, 1.15] },
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
  celebrate: {
    animate: { scale: [1, 1.3, 1.1, 1.15], rotate: [0, -8, 8, 0] },
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
  analyzing: {
    animate: { x: [-4, 4, -4] },
    transition: { duration: 0.2, repeat: Infinity, ease: "linear" as const },
  },
  shrink: {
    animate: { scale: [1, 0.85] },
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  none: {
    animate: {},
    transition: {},
  },
};

export function KibunKun({
  expression = "normal",
  size = 120,
  speech,
  className,
  animate = "none",
  glow = false,
}: Props) {
  const bodyAnim = BODY_ANIMATIONS[animate];

  return (
    <div className={`relative inline-flex flex-col items-center ${className ?? ""}`}>
      {/* 吹き出し — きぶんくんの世界観に合わせた暖色デザイン */}
      <AnimatePresence mode="wait">
        {speech && (
          <motion.div
            key={speech}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
            className="mb-3 px-5 py-2.5 rounded-2xl shadow-lg text-center relative max-w-56"
            style={{
              background: "linear-gradient(135deg, #FFF9F0 0%, #FFF0E0 100%)",
              border: "2px solid #F5C54240",
              fontFamily: "'Zen Maru Gothic', sans-serif",
            }}
          >
            <span className="text-sm font-bold text-gray-700">{speech}</span>
            {/* 吹き出しの尻尾 — 大きめで丸みのある形 */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 rounded-sm"
              style={{
                background: "linear-gradient(135deg, #FFF0E0 0%, #FFF0E0 100%)",
                borderRight: "2px solid #F5C54240",
                borderBottom: "2px solid #F5C54240",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* キャラクター本体 */}
      <motion.div
        animate={bodyAnim.animate}
        transition={bodyAnim.transition}
        className="relative"
      >
        {/* グロー（背景から浮かび上がらせる光彩） */}
        {glow && (
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(245,197,66,0.3) 50%, transparent 70%)",
              transform: "scale(1.3)",
            }}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={expression}
            initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 200, damping: 15 }}
            className="relative"
          >
            <Image
              src={IMAGE_MAP[expression]}
              alt={`きぶんくん - ${expression}`}
              width={size}
              height={size}
              priority
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
