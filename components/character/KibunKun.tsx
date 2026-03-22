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
};

const IMAGE_MAP: Record<KibunExpression, string> = {
  normal: "/character/kibun-normal.webp",
  thinking: "/character/kibun-thinking.webp",
  excited: "/character/kibun-excited.webp",
  confident: "/character/kibun-confident.webp",
  tada: "/character/kibun-tada.webp",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BODY_ANIMATIONS: Record<AnimationType, { animate: any; transition: any }> = {
  float: {
    animate: { y: [0, -8, 0] },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
  bounce: {
    animate: { y: [0, -20, 0], scale: [1, 1.1, 1] },
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
  growConfident: {
    animate: { scale: [1, 1.3, 1.2] },
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
  celebrate: {
    animate: { scale: [1, 1.4, 1.1, 1.2], rotate: [0, -10, 10, 0] },
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
  analyzing: {
    animate: { x: [-3, 3, -3] },
    transition: {
      duration: 0.2,
      repeat: Infinity,
      ease: "linear" as const,
    },
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
  size = 80,
  speech,
  className,
  animate = "none",
}: Props) {
  const bodyAnim = BODY_ANIMATIONS[animate];

  return (
    <div
      className={`relative inline-flex flex-col items-center ${className ?? ""}`}
    >
      {/* 吹き出し */}
      <AnimatePresence mode="wait">
        {speech && (
          <motion.div
            key={speech}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="mb-2 px-4 py-2 bg-white rounded-2xl shadow-md text-sm font-medium text-gray-800 max-w-50 text-center relative"
          >
            {speech}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* キャラクター本体 */}
      <motion.div animate={bodyAnim.animate} transition={bodyAnim.transition}>
        <AnimatePresence mode="wait">
          <motion.div
            key={expression}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
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
