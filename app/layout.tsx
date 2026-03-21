import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  title: "こんやのきぶん | 気分で決まる夜ごはん",
  description:
    "夜ごはんが決まらないあなたへ。6つの質問に答えるだけで、今の気分にぴったりの外食ジャンルと近くのお店を提案します。",
  metadataBase: new URL("https://konya-no-kibun.vercel.app"),
  openGraph: {
    title: "こんやのきぶん | 気分で決まる夜ごはん",
    description:
      "6つの質問に答えるだけで、今夜にぴったりの外食先が見つかる！",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "こんやのきぶん | 気分で決まる夜ごはん",
    description:
      "6つの質問に答えるだけで、今夜にぴったりの外食先が見つかる！",
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
        <div className="flex-1">{children}</div>
        <footer className="py-6 text-center text-sm text-[#8B6F61]/40 bg-[#FFF8F0]">
          <p>&copy; 2026 こんやのきぶん</p>
        </footer>
      </body>
    </html>
  );
}
