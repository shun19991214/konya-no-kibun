import type { Metadata } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/common/MotionProvider";

export const metadata: Metadata = {
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  other: {
    "theme-color": "#2D2B55",
  },
  title: {
    default: "こんやのきぶん | 気分で決まる夜ごはん",
    template: "%s | こんやのきぶん",
  },
  description:
    "夜ごはんが決まらないあなたへ。気分に合わせた質問に答えるだけで、今夜ぴったりの外食ジャンルと近くのお店を提案します。",
  metadataBase: new URL("https://konya-no-kibun.vercel.app"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "夜ごはん",
    "外食",
    "レストラン",
    "診断",
    "今夜なに食べる",
    "ごはん決め",
    "グルメ",
    "こんやのきぶん",
  ],
  openGraph: {
    title: "こんやのきぶん | 気分で決まる夜ごはん",
    description:
      "気分に答えるだけで、今夜にぴったりの外食先が見つかる！",
    type: "website",
    locale: "ja_JP",
    siteName: "こんやのきぶん",
  },
  twitter: {
    card: "summary_large_image",
    title: "こんやのきぶん | 気分で決まる夜ごはん",
    description:
      "気分に答えるだけで、今夜にぴったりの外食先が見つかる！",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7124944646519570"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800&family=Zen+Maru+Gothic:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "こんやのきぶん",
              alternateName: "Konya no Kibun",
              description:
                "気分に合わせた質問に答えるだけで、今夜ぴったりの外食ジャンルと近くのお店を提案するWebアプリ",
              url: "https://konya-no-kibun.vercel.app",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "JPY",
              },
              inLanguage: "ja",
            }),
          }}
        />
        <MotionProvider>
          <div className="flex-1">{children}</div>
        </MotionProvider>
        <footer className="py-8 text-center text-sm text-[#8B6F61]/60 bg-[#FFF8F0]">
          <nav className="flex flex-wrap justify-center gap-4 mb-3">
            <a href="/about" className="hover:text-[#FF6B35] transition-colors">このサイトについて</a>
            <a href="/privacy" className="hover:text-[#FF6B35] transition-colors">プライバシーポリシー</a>
            <a href="/contact" className="hover:text-[#FF6B35] transition-colors">お問い合わせ</a>
          </nav>
          <p className="text-[#8B6F61]/40">&copy; 2026 こんやのきぶん</p>
        </footer>
      </body>
    </html>
  );
}
