import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const result = searchParams.get("result")?.slice(0, 40) || "診断結果";
  const desc = searchParams.get("desc")?.slice(0, 80) || "";
  const icon = searchParams.get("icon")?.slice(0, 8) || "🍽️";

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
            "linear-gradient(180deg, #2D2B55 0%, #3d2b6b 35%, #6b3a5c 65%, #c4563a 90%, #f5a623 100%)",
          fontFamily: "sans-serif",
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "rgba(255,255,255,0.75)", marginBottom: 12 }}>
          今夜の気分は…
        </div>
        <div style={{ display: "flex", fontSize: 140, lineHeight: 1, marginBottom: 16 }}>{icon}</div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 900,
            color: "white",
            marginBottom: 16,
            textShadow: "0 4px 16px rgba(0,0,0,0.4)",
            lineHeight: 1.1,
          }}
        >
          {`「${result}」`}
        </div>
        {desc && (
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "rgba(255,255,255,0.85)",
              marginBottom: 40,
              lineHeight: 1.4,
              maxWidth: 900,
            }}
          >
            {desc}
          </div>
        )}
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.55)",
            marginTop: 24,
            display: "flex",
            gap: 8,
          }}
        >
          <span>こんやのきぶん</span>
          <span>—</span>
          <span>気分で決まる夜ごはん</span>
        </div>
      </div>
    ),
    { ...SIZE }
  );
}
