import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | こんやのきぶん",
  description: "「こんやのきぶん」のプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F0] py-12 px-6">
      <article className="max-w-2xl mx-auto">
        <h1
          className="text-2xl font-bold text-[#5C3D2E] mb-8"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
        >
          プライバシーポリシー
        </h1>

        <div className="prose prose-sm text-[#5C3D2E]/80 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">1. 運営者情報</h2>
            <p>
              本サイト「こんやのきぶん」（以下「当サイト」）は、個人が運営する夜ごはん提案Webアプリケーションです。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">2. 個人情報の取り扱い</h2>
            <p>
              当サイトでは、ユーザー登録やログインの機能はなく、氏名・メールアドレス等の個人情報を収集することはありません。
            </p>
            <p>
              位置情報については、ユーザーの明示的な許可を得た場合にのみ、周辺のレストランを検索する目的で一時的に使用します。位置情報はサーバーに保存されず、ブラウザセッション内でのみ利用されます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">3. Cookie（クッキー）の使用</h2>
            <p>
              当サイトでは、以下の目的でCookieおよびローカルストレージを使用しています。
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>診断履歴の保存（ローカルストレージ）：過去の診断結果を記録し、毎回異なる結果を提供するために使用します。</li>
              <li>広告配信：第三者配信事業者（Google AdSense）がCookieを使用して、ユーザーの過去のアクセス情報に基づいた広告を配信する場合があります。</li>
              <li>アクセス解析：サイトの利用状況を把握するためにCookieを使用する場合があります。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">4. 広告について</h2>
            <p>
              当サイトでは、第三者配信の広告サービス（Google AdSense）を利用しています。
            </p>
            <p>
              Google などの第三者配信事業者が Cookie を使用して、ユーザーが当サイトや他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信することがあります。
            </p>
            <p>
              ユーザーは、
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 underline"
              >
                Google 広告設定
              </a>
              でパーソナライズ広告を無効にできます。また、
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 underline"
              >
                www.aboutads.info
              </a>
              にアクセスすれば、パーソナライズ広告に使われる第三者配信事業者の Cookie を無効にできます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">5. 外部サービスの利用</h2>
            <p>当サイトでは以下の外部サービスを利用しています。</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>ホットペッパーグルメ Webサービス</strong>：周辺のレストラン情報を検索・表示するために利用しています。店舗情報の著作権は株式会社リクルートに帰属します。
              </li>
              <li>
                <strong>Google Maps</strong>：店舗への経路案内のために利用しています。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">6. 免責事項</h2>
            <p>
              当サイトで提供するレストラン情報は、ホットペッパーグルメのデータに基づいています。情報の正確性・最新性について保証するものではありません。実際の営業時間・メニュー・価格等は、各店舗に直接ご確認ください。
            </p>
            <p>
              当サイトの利用により生じたいかなる損害についても、運営者は一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#5C3D2E] mt-6 mb-2">7. プライバシーポリシーの変更</h2>
            <p>
              本ポリシーの内容は、法令の変更やサービスの変更に伴い、予告なく変更することがあります。変更後のプライバシーポリシーは、当ページに掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <p className="text-xs text-[#8B6F61]/60 mt-8">
            制定日：2026年3月22日
          </p>
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
