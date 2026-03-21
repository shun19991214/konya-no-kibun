"use client";

import { motion } from "framer-motion";
import type { Restaurant } from "@/types";
import { RestaurantCard } from "./RestaurantCard";

interface RestaurantListProps {
  restaurants: Restaurant[];
  isLoading: boolean;
  error?: string | null;
}

export function RestaurantList({
  restaurants,
  isLoading,
  error,
}: RestaurantListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block text-4xl"
        >
          🍽️
        </motion.div>
        <p className="text-accent-light/60 mt-3 text-sm">
          お店を探しています...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">😢</div>
        <p className="text-accent-light/60 text-sm">
          周辺にお店が見つかりませんでした
        </p>
        <p className="text-accent-light/40 text-xs mt-1">
          検索範囲を広げるか、別のエリアで試してみてください
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg text-accent">
          近くのお店
        </h2>
        <span className="text-xs text-accent-light/50">
          {restaurants.length}件
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {restaurants.map((restaurant, i) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            index={i}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-2 pt-6">
        <a
          href="http://webservice.recruit.co.jp/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="http://webservice.recruit.co.jp/banner/hotpepper-m.gif"
            alt="ホットペッパーグルメ Webサービス"
            width={88}
            height={35}
          />
        </a>
        <p className="text-center text-[10px] text-accent-light/40">
          Powered by{" "}
          <a
            href="http://webservice.recruit.co.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-accent-light/60"
          >
            ホットペッパーグルメ Webサービス
          </a>
        </p>
      </div>
    </div>
  );
}
