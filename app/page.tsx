"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GENRES } from "@/data/genres";

function Star({ className, delay }: { className?: string; delay: number }) {
  return (
    <div
      className={`absolute rounded-full bg-white animate-twinkle ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

export default function Home() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen">
      {/* ===== Hero: Night sky → warm food gradient ===== */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Stars */}
        <Star className="w-1 h-1 top-[8%] left-[15%]" delay={0} />
        <Star className="w-1.5 h-1.5 top-[12%] right-[20%]" delay={0.8} />
        <Star className="w-1 h-1 top-[18%] left-[45%]" delay={1.6} />
        <Star className="w-0.5 h-0.5 top-[6%] right-[35%]" delay={2.4} />
        <Star className="w-1 h-1 top-[22%] left-[70%]" delay={0.4} />
        <Star className="w-0.5 h-0.5 top-[15%] left-[80%]" delay={1.2} />
        <Star className="w-1.5 h-1.5 top-[10%] left-[30%]" delay={2.0} />

        {/* Crescent moon */}
        <div className="absolute top-[6%] right-[12%] w-12 h-12 md:w-16 md:h-16">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-amber-100/80" />
            <div className="absolute -top-1 -right-1 w-10 h-10 md:w-13 md:h-13 rounded-full bg-[#2D2B55]" />
          </div>
        </div>

        <div className="relative max-w-lg mx-auto text-center pt-24 pb-32 px-6">
          {/* Floating food icons in the sky */}
          <div className="flex justify-center gap-5 mb-10">
            {["🍜", "🍣", "🥩", "🍝", "🍛"].map((emoji, i) => (
              <span
                key={i}
                className="text-4xl md:text-5xl animate-float drop-shadow-lg"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i * 0.4}s`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight mb-3 drop-shadow-md">
            こんやのきぶん
          </h1>
          <p className="text-base md:text-lg text-white/70 font-medium mb-10">
            6つの質問で、今夜の外食先が決まる
          </p>

          {/* CTA */}
          <Link
            href="/quiz"
            className="group inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-[#FF6B35] font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 animate-pulse-glow"
          >
            診断スタート
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

          <p className="text-xs text-white/40 mt-4 tracking-wide">
            30秒で完了 ・ 登録不要
          </p>
        </div>
      </section>

      {/* ===== Result teaser (blurred) ===== */}
      <section className="py-14 px-6 bg-[#FFF8F0]">
        <div className="max-w-md mx-auto">
          <p className="text-center text-sm text-[#8B6F61] mb-6 font-medium">
            こんな結果が出るかも...？
          </p>

          <div className="flex gap-3 justify-center">
            {[
              { emoji: "🍜", name: "ラーメン", rotate: "-2deg" },
              { emoji: "🍝", name: "イタリアン", rotate: "1deg" },
              { emoji: "🥩", name: "焼肉", rotate: "-1deg" },
            ].map((item, i) => (
              <div
                key={i}
                className="relative w-[100px] flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/80 border border-orange-100 shadow-sm"
                style={{ transform: `rotate(${item.rotate})` }}
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="text-xs font-bold text-[#5C3D2E]">
                  {item.name}
                </span>
                {i === 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] bg-[#FF6B35] text-white px-2 py-0.5 rounded-full font-bold shadow-sm">
                    1位
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-[#8B6F61]/50 mt-4">
            あなたの気分に合ったジャンルを3つ提案します
          </p>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="py-14 px-6 bg-gradient-to-b from-[#FFF8F0] to-[#FFF0E6]">
        <div className="max-w-md mx-auto">
          <h2 className="text-center font-heading font-bold text-xl text-[#3d2e1f] mb-10">
            使い方はかんたん
          </h2>

          <div className="space-y-4">
            {[
              {
                num: "1",
                title: "6つの質問に答える",
                desc: "気分・予算・移動手段をタップで選ぶだけ",
                color: "#FF6B35",
              },
              {
                num: "2",
                title: "ぴったりのジャンルが決まる",
                desc: "あなたの回答から最適な外食ジャンルを3つ提案",
                color: "#E8A838",
              },
              {
                num: "3",
                title: "近くのお店が見つかる",
                desc: "位置情報で周辺のレストランをすぐ表示",
                color: "#C4563A",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/70 border border-orange-50 shadow-sm"
              >
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: item.color }}
                >
                  {item.num}
                </div>
                <div>
                  <h3 className="font-bold text-[#3d2e1f] text-[15px]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#8B6F61] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Genre grid ===== */}
      <section className="py-14 px-6 bg-[#FFF0E6]">
        <div className="max-w-md mx-auto">
          <h2 className="text-center font-heading font-bold text-xl text-[#3d2e1f] mb-2">
            全{GENRES.length}ジャンルから診断
          </h2>
          <p className="text-center text-xs text-[#8B6F61] mb-8">
            あなたの気分にぴったりのジャンルを見つけます
          </p>

          <div className="grid grid-cols-4 gap-2">
            {GENRES.map((genre) => (
              <div
                key={genre.id}
                className="flex flex-col items-center gap-1 py-3 px-1 rounded-xl bg-white/60 border border-orange-50 text-center hover:bg-white hover:shadow-sm transition-all"
              >
                <span className="text-2xl">{genre.emoji}</span>
                <span className="text-[10px] font-medium text-[#5C3D2E] leading-tight">
                  {genre.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Bottom CTA ===== */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#FFF0E6] to-[#FFF8F0] text-center">
        <p className="text-[#8B6F61] mb-2 text-sm">
          今夜のごはん、迷ってる？
        </p>
        <p className="text-[#3d2e1f] font-heading font-bold text-lg mb-6">
          30秒であなたにぴったりの<br />お店が見つかります
        </p>
        <Link
          href="/quiz"
          className="group inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#FF6B35] text-white font-bold text-lg hover:bg-[#E55A2B] hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
        >
          診断スタート
          <span className="inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </section>

      {/* ===== Sticky bottom CTA ===== */}
      <div className={`sticky-cta ${showSticky ? "visible" : ""}`}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#3d2e1f]">こんやのきぶん</p>
            <p className="text-[10px] text-[#8B6F61]">30秒で夜ごはんが決まる</p>
          </div>
          <Link
            href="/quiz"
            className="px-6 py-2.5 rounded-full bg-[#FF6B35] text-white text-sm font-bold hover:bg-[#E55A2B] active:scale-95 transition-all shadow-md"
          >
            診断する
          </Link>
        </div>
      </div>
    </main>
  );
}
