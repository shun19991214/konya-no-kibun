"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { KibunKun } from "@/components/character/KibunKun";

const ROW1 = ["🍜", "🥩", "🍣", "🍕", "🍛", "🍔", "🥗", "🍤", "🏮", "🍝"];
const ROW2 = ["🍱", "🍻", "☕", "🥘", "🍸", "🍚", "🥞", "🍢", "🌮", "🧆"];

export default function Home() {
  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #1a0533 0%, #2D2B55 30%, #3d2b6b 50%, #6b3a5c 70%, #c4563a 90%, #FF6B35 100%)",
      }}
    >
      {/* Stars */}
      {[
        "top-[5%] left-[10%] w-1 h-1",
        "top-[8%] right-[15%] w-1.5 h-1.5",
        "top-[12%] left-[40%] w-1 h-1",
        "top-[3%] right-[30%] w-0.5 h-0.5",
        "top-[15%] left-[75%] w-1 h-1",
        "top-[20%] right-[60%] w-0.5 h-0.5",
        "top-[25%] left-[20%] w-1 h-1",
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-white animate-twinkle ${cls}`}
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}

      {/* Emoji marquee row 1 */}
      <div className="absolute top-[15%] left-0 w-full overflow-hidden opacity-40">
        <div className="flex gap-6 text-3xl animate-marquee-left whitespace-nowrap">
          {[...ROW1, ...ROW1].map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
      </div>

      {/* Emoji marquee row 2 */}
      <div className="absolute top-[22%] left-0 w-full overflow-hidden opacity-30">
        <div className="flex gap-6 text-3xl animate-marquee-right whitespace-nowrap">
          {[...ROW2, ...ROW2].map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
      </div>

      {/* KibunKun */}
      <div className="relative z-10">
        <KibunKun expression="normal" size={120} speech="今夜なに食べる？" animate="float" />
      </div>

      {/* App name */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-3xl md:text-4xl font-bold text-white mt-6 tracking-wide"
        style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
      >
        こんやのきぶん
      </motion.h1>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-8"
      >
        <Link
          href="/play"
          className="inline-block px-10 py-4 bg-white text-orange-500 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cta-glow"
        >
          診断スタート →
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 mt-4 text-xs text-white/50"
      >
        30秒で完了 ・ 登録不要
      </motion.p>
    </main>
  );
}
