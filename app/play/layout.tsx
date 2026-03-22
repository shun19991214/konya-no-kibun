import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "診断スタート",
  description:
    "4つの質問に答えるだけで、今夜の気分にぴったりの外食ジャンルを診断。近くのお店もすぐ見つかる！",
  alternates: {
    canonical: "/play",
  },
  openGraph: {
    title: "こんやのきぶん — 診断スタート",
    description:
      "4つの質問で今夜の気分をズバリ言い当てる！近くのお店もすぐ見つかる。",
  },
};

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
