"use client";

import Link from "next/link";
import { KibunKun } from "@/components/character/KibunKun";

// 控えめな絵文字（きぶんくんを邪魔しない）
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
      {/* Stars */}
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

      {/* Emoji marquee — very subtle, behind kibunkun */}
      <div className="absolute top-[6%] left-0 w-full overflow-hidden opacity-15">
        <div className="flex gap-6 text-xl animate-marquee-left whitespace-nowrap">
          {[...ROW1, ...ROW1].map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
      </div>
      <div className="absolute top-[10%] left-0 w-full overflow-hidden opacity-10">
        <div className="flex gap-6 text-xl animate-marquee-right whitespace-nowrap">
          {[...ROW2, ...ROW2].map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
      </div>

      {/* KibunKun — large, with glow to stand out from background */}
      <div className="relative z-10">
        <KibunKun
          expression="normal"
          size={150}
          speech="今夜なに食べる？"
          animate="float"
          glow
        />
      </div>

      {/* App name */}
      <h1
        className="relative z-10 text-3xl md:text-4xl font-bold text-white mt-2 tracking-wide"
        style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
      >
        こんやのきぶん
      </h1>

      <p className="relative z-10 text-sm text-white/50 mt-1">
        気分で決まる夜ごはん
      </p>

      {/* CTA */}
      <div className="relative z-10 mt-5">
        <Link
          href="/play"
          className="inline-block px-10 py-4 bg-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{
            color: "#C4563A",
            boxShadow: "0 0 30px rgba(249, 115, 22, 0.4)",
            animation: "cta-pulse-glow 2s ease-in-out infinite",
          }}
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
