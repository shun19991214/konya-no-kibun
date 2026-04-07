import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "このサイトについて | こんやのきぶん",
  description:
    "「こんやのきぶん」は、気分に合わせた質問に答えるだけで今夜ぴったりの外食先を提案するWebアプリです。",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F0] py-12 px-6">
      <article className="max-w-2xl mx-auto">
        <h1
          className="text-2xl font-bold text-[#5C3D2E] mb-8"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
        >
          このサイトについて
        </h1>

        <div className="prose prose-sm text-[#5C3D2E]/80 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">
              「こんやのきぶん」とは？
            </h2>
            <p>
              「今夜なに食べよう？」——毎日やってくるこの悩みに、新しい解決方法を提案するWebアプリです。
            </p>
            <p>
              食べたいものを直接聞くのではなく、「今日どんな一日だった？」「誰と食べる？」「今の気持ちに近いのは？」といった
              <strong>気分に寄り添った質問</strong>を通して、あなたにぴったりの夜ごはんのジャンルを導き出します。
            </p>
            <p>
              案内役は、食べることが大好きすぎて人の食べたいものまで当てられるようになった猫「きぶんくん」。
              あなたの気分を読み取って、ズバリ今夜の夜ごはんを言い当てます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">使い方</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>診断スタート</strong>
                ：トップページの「診断スタート」ボタンを押します。
              </li>
              <li>
                <strong>質問に答える</strong>
                ：きぶんくんが出す3〜4つの質問に、直感でタップして答えます。所要時間は約30秒です。
              </li>
              <li>
                <strong>結果を見る</strong>
                ：あなたの気分にぴったりのジャンルをきぶんくんが言い当てます。
              </li>
              <li>
                <strong>お店を探す</strong>
                ：位置情報を使って、近くのおすすめのお店を表示します。個室・飲み放題などの条件で絞り込むこともできます。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">特徴</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>登録不要・完全無料</strong>
                ：アカウント登録なしで、すぐに使えます。
              </li>
              <li>
                <strong>20以上のジャンル</strong>
                ：和食、焼肉、ラーメン、イタリアン、韓国料理、カフェなど幅広いジャンルに対応。
              </li>
              <li>
                <strong>実際のお店を提案</strong>
                ：ホットペッパーグルメのデータを使って、近くの実在するお店を表示します。
              </li>
              <li>
                <strong>こだわり条件</strong>
                ：個室あり、飲み放題、禁煙席、駐車場ありなどで絞り込めます。
              </li>
              <li>
                <strong>何度でも楽しめる</strong>
                ：気分は毎日変わるもの。同じ質問でも、その日の気持ち次第で違う結果が出ます。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">きぶんくんについて</h2>
            <p>
              きぶんくんは、食べることが大好きすぎて人の食べたいものまで当てられるようになった猫です。
              シェフ帽をかぶり、金色の星型フォークを持っています。
              ちょっと得意げで自信家ですが、憎めない性格。
              あなたの回答に合わせて表情が変わり、最後に「今夜はこれでしょ！」とドヤ顔で結果を発表するのが最大の見せ場です。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">技術情報</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>フレームワーク：Next.js (React)</li>
              <li>レストラン情報：ホットペッパーグルメ Webサービス</li>
              <li>ホスティング：Vercel</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">運営者</h2>
            <p>個人開発プロジェクトとして運営しています。</p>
            <p>
              お問い合わせは
              <Link href="/contact" className="text-orange-500 underline">
                こちら
              </Link>
              からお願いします。
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-orange-500 text-sm font-medium hover:underline">
            ← トップに戻る
          </Link>
        </div>
      </article>
    </main>
  );
}
