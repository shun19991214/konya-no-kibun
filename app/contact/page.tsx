import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "お問い合わせ | こんやのきぶん",
  description: "「こんやのきぶん」へのお問い合わせはこちらから。",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F0] py-12 px-6">
      <article className="max-w-2xl mx-auto">
        <h1
          className="text-2xl font-bold text-[#5C3D2E] mb-8"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
        >
          お問い合わせ
        </h1>

        <div className="prose prose-sm text-[#5C3D2E]/80 space-y-6">
          <p>
            「こんやのきぶん」に関するお問い合わせ、ご意見、不具合報告は、以下の方法でお寄せください。
          </p>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">
              GitHub Issues
            </h2>
            <p>
              不具合の報告や機能リクエストは、GitHubのIssueページからお願いします。
            </p>
            <a
              href="https://github.com/shun19991214/konya-no-kibun/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[#5C3D2E] text-white rounded-xl font-medium hover:bg-[#4a3124] transition-colors"
            >
              GitHub Issues を開く →
            </a>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">
              SNS
            </h2>
            <p>
              ご感想やシェアは、ハッシュタグ{" "}
              <strong className="text-orange-500">#こんやのきぶん</strong>{" "}
              をつけてX（旧Twitter）に投稿してください。開発者がチェックしています。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">
              ご注意
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>個人運営のため、返信にお時間をいただく場合があります。</li>
              <li>
                レストランの営業情報に関するお問い合わせは、各店舗に直接ご連絡ください（当サイトはホットペッパーグルメのデータを表示しています）。
              </li>
            </ul>
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
