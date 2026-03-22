import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getTopThree } from "@/data/scoring";
import { GENRE_MAP } from "@/data/genres";
import type { AxisScores } from "@/types";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const scores: AxisScores = {
    heavyLight: Number(searchParams.get("hl")) || 0,
    wafuYofu: Number(searchParams.get("wy")) || 0,
    casualFormal: Number(searchParams.get("cf")) || 0,
    adventurous: Number(searchParams.get("ad")) || 0,
  };

  const topGenreIds = getTopThree(scores);
  const topGenres = topGenreIds.map((id) => GENRE_MAP[id]).filter(Boolean);
  const main = topGenres[0];

  if (!main) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#2D2B55",
            color: "white",
            fontSize: 48,
            fontFamily: "sans-serif",
          }}
        >
          こんやのきぶん
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, #2D2B55 0%, #3d2b6b 30%, #6b3a5c 60%, #c4563a 85%, #FF6B35 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Label */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.5)",
            marginBottom: 24,
          }}
        >
          今夜の気分は...
        </div>

        {/* Emoji */}
        <div style={{ fontSize: 120, marginBottom: 16 }}>{main.emoji}</div>

        {/* Genre name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "white",
            marginBottom: 12,
            textShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {main.name}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 40,
          }}
        >
          {main.description}
        </div>

        {/* Sub genres */}
        <div style={{ display: "flex", gap: 24 }}>
          {topGenres.slice(1).map((g, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 16,
                padding: "8px 20px",
                fontSize: 22,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <span>{g.emoji}</span>
              <span>{g.name}</span>
            </div>
          ))}
        </div>

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            fontSize: 20,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          こんやのきぶん — 気分で決まる夜ごはん
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
