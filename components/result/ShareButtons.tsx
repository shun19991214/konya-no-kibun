"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import type { Genre } from "@/types";

interface ShareButtonsProps {
  genre: Genre;
}

export function ShareButtons({ genre }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `今夜の気分は「${genre.name}${genre.emoji}」でした！\n\nあなたも診断してみて！\n#こんやのきぶん #きぶんで夜ごはん`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "こんやのきぶん",
          text: shareText,
          url,
        });
        return;
      } catch {
        // fallthrough to clipboard
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Xでシェア
      </a>

      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#06C755] text-white text-sm font-medium hover:bg-[#05b34d] transition-colors"
      >
        LINE
      </a>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card text-accent text-sm font-medium hover:bg-primary/10 transition-colors"
      >
        {copied ? <Check size={16} /> : <Share2 size={16} />}
        {copied ? "コピーしました" : "リンクをコピー"}
      </button>
    </div>
  );
}
