"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import type { Genre } from "@/types";

interface ResultImageCardProps {
  topGenres: Genre[];
  personalizedReason?: string;
}

export function ResultImageCard({ topGenres, personalizedReason }: ResultImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      link.download = `konya-no-kibun-${topGenres[0]?.id || "result"}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // fallback: do nothing
    } finally {
      setDownloading(false);
    }
  }

  const main = topGenres[0];
  if (!main) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Exportable card */}
      <div
        ref={cardRef}
        style={{
          width: 320,
          padding: 0,
          borderRadius: 24,
          overflow: "hidden",
          background: "linear-gradient(180deg, #2D2B55 0%, #6b3a5c 50%, #FF6B35 100%)",
          fontFamily: '"Noto Sans JP", "Hiragino Sans", sans-serif',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            padding: "20px 24px 0",
            textAlign: "center",
            color: "rgba(255,255,255,0.5)",
            fontSize: 12,
          }}
        >
          今夜の気分は...
        </div>

        {/* Main content */}
        <div style={{ padding: "16px 24px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>{main.emoji}</div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "white",
              marginBottom: 6,
            }}
          >
            {main.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.6)",
              marginBottom: 16,
            }}
          >
            {personalizedReason || main.description}
          </div>

          {/* Sub genres */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {topGenres.slice(1).map((g, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  padding: "4px 12px",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                <span>{g.emoji}</span>
                <span>{g.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Branding */}
        <div
          style={{
            padding: "8px 24px 16px",
            textAlign: "center",
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          こんやのきぶん — 気分で決まる夜ごはん
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#5C3D2E]/10 text-[#3d2e1f] text-sm font-medium hover:bg-[#FFF0E6] hover:scale-105 active:scale-95 transition-all shadow-sm disabled:opacity-50"
      >
        <Download size={14} />
        {downloading ? "保存中..." : "結果を画像で保存"}
      </button>
    </div>
  );
}
