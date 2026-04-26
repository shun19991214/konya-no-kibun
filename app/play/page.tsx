import type { Metadata } from "next";
import PlayClient from "./PlayClient";

type Props = {
  searchParams: { result?: string; desc?: string; icon?: string };
};

const STATIC_OG = "/opengraph-image";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const result = searchParams.result?.trim();
  if (!result) return {};

  const desc = searchParams.desc?.trim() ?? "";
  const icon = searchParams.icon?.trim() ?? "";
  const params = new URLSearchParams({ result });
  if (desc) params.set("desc", desc);
  if (icon) params.set("icon", icon);
  const ogUrl = `/api/og?${params.toString()}`;

  const title = `今夜の気分は「${result}」`;
  const description = desc || "あなたも診断してみて！";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

// Fallback metadata for the bare /play URL is provided by app/play/layout.tsx,
// which already sets a default title, description, and the static OG image at
// app/opengraph-image.tsx. We only override when a result is shared.
void STATIC_OG;

export default function Page() {
  return <PlayClient />;
}
