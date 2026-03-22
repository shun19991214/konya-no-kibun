"use client";

import Link from "next/link";
import { KibunKun } from "@/components/character/KibunKun";

// 絵文字を減らしてFCP改善
const ROW1 = ["🍜", "🥩", "🍣", "🍛", "🍔", "🏮"];
const ROW2 = ["🍱", "🍻", "🥘", "🍚", "🍢", "☕"];

export default function Home() {
  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{
        background: "linear-gradient(180deg, #1a0533 0%, #2D2B55 30%, #3d2b6b 50%, #6b3a5c 70%, #c4563a 90%, #FF6B35 100%)",
      }}
    >
      {/* Stars (reduced to 4) */}
      {[
        "top-[5%] left-[10%] w-1 h-1",
        "top-[8%] right-[15%] w-1.5 h-1.5",
        "top-[3%] right-[30%] w-0.5 h-0.5",
        "top-[15%] left-[75%] w-1 h-1",
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-white animate-twinkle ${cls}`}
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}

      {/* Emoji marquee — compact: smaller text, closer to top */}
      <div className="absolute top-[8%] left-0 w-full overflow-hidden opacity-30">
        <div className="flex gap-5 text-2xl animate-marquee-left whitespace-nowrap">
          {[...ROW1, ...ROW1].map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
      </div>
      <div className="absolute top-[13%] left-0 w-full overflow-hidden opacity-20">
        <div className="flex gap-5 text-2xl animate-marquee-right whitespace-nowrap">
          {[...ROW2, ...ROW2].map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
      </div>

      {/* KibunKun — smaller on mobile */}
      <div className="relative z-10">
        <KibunKun expression="normal" size={100} speech="今夜なに食べる？" animate="float" />
      </div>

      {/* App name — reduced margin */}
      <h1
        className="relative z-10 text-3xl md:text-4xl font-bold text-white mt-3 tracking-wide"
        style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
      >
        こんやのきぶん
      </h1>

      <p className="relative z-10 text-sm text-white/50 mt-1">
        気分で決まる夜ごはん
      </p>

      {/* CTA — reduced top margin for mobile first view */}
      <div className="relative z-10 mt-6">
        <Link
          href="/play"
          className="inline-block px-10 py-4 bg-white text-orange-500 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 animate-pulse-glow"
          style={{ boxShadow: "0 0 30px rgba(249, 115, 22, 0.4)" }}
        >
          診断スタート →
        </Link>
      </div>

      <p className="relative z-10 mt-3 text-xs text-white/40">
        30秒で完了 ・ 登録不要
      </p>
    </main>
  );
}
