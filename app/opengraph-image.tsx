import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "こんやのきぶん | 気分で決まる夜ごはん";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(180deg, #2D2B55 0%, #6b3a5c 50%, #FF6B35 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16, display: "flex", gap: 16 }}>
          <span>🍜</span><span>🍣</span><span>🥩</span><span>🍝</span><span>🍛</span>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "white",
            marginBottom: 8,
            textShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          こんやのきぶん
        </div>
        <div style={{ fontSize: 32, color: "rgba(255,255,255,0.7)" }}>
          5つの質問で、今夜の外食先が決まる
        </div>
      </div>
    ),
    { ...size }
  );
}
