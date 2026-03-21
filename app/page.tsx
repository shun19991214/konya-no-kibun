import Link from "next/link";
import { GENRES } from "@/data/genres";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-12 px-6">
        {/* Decorative blobs */}
        <div className="absolute top-10 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />

        <div className="relative max-w-lg mx-auto text-center">
          <div className="flex justify-center gap-2 mb-6">
            {["🍜", "🍣", "🥩", "🍝", "🍛"].map((emoji, i) => (
              <span
                key={i}
                className="text-3xl animate-float"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-heading font-bold text-accent leading-tight mb-2">
            <span className="gradient-text">こんやのきぶん</span>
          </h1>
          <p className="text-lg text-accent-light/50 font-medium mb-6">
            気分で決まる夜ごはん
          </p>

          <p className="text-accent-light/70 text-base md:text-lg leading-relaxed mb-8">
            夜ごはんが決まらないあなたへ。
            <br />
            6つの質問に答えるだけで、
            <br className="md:hidden" />
            今の気分にぴったりの
            <br className="md:hidden" />
            外食先を提案します。
          </p>

          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all animate-pulse-glow shadow-lg"
          >
            診断スタート
            <span className="text-xl">→</span>
          </Link>

          <p className="text-xs text-accent-light/40 mt-4">
            約30秒で完了 / 登録不要
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-6">
        <div className="max-w-lg mx-auto">
          <h2 className="text-center font-heading font-bold text-xl text-accent mb-8">
            使い方はかんたん
          </h2>

          <div className="space-y-6">
            {[
              {
                step: "1",
                emoji: "💬",
                title: "6つの質問に答える",
                desc: "気分、予算、移動手段などをタップで選ぶだけ",
              },
              {
                step: "2",
                emoji: "🎯",
                title: "ぴったりのジャンルが分かる",
                desc: "あなたの回答から最適な外食ジャンルを3つ提案",
              },
              {
                step: "3",
                emoji: "📍",
                title: "近くのお店が見つかる",
                desc: "位置情報から周辺のおすすめレストランを表示",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-4 p-4 rounded-2xl warm-card"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">{item.emoji}</span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-accent text-base">
                    {item.title}
                  </h3>
                  <p className="text-sm text-accent-light/60 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Genre preview */}
      <section className="py-12 px-6 bg-card/50">
        <div className="max-w-lg mx-auto">
          <h2 className="text-center font-heading font-bold text-xl text-accent mb-6">
            全{GENRES.length}ジャンルから診断
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {GENRES.map((genre) => (
              <span
                key={genre.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background text-sm text-accent-light/70 border border-primary/8"
              >
                <span>{genre.emoji}</span>
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <p className="text-accent-light/60 mb-4">
          さっそく診断してみよう
        </p>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all shadow-lg"
        >
          診断スタート →
        </Link>
      </section>
    </main>
  );
}
