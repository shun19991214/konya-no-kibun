"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import type { Restaurant } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index: number;
}

export function RestaurantCard({ restaurant, index }: RestaurantCardProps) {
  const photoUrl =
    restaurant.photo.pc.m ||
    restaurant.photo.pc.l ||
    restaurant.photo.mobile.l ||
    "";

  return (
    <motion.a
      href={restaurant.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="block rounded-2xl overflow-hidden bg-white border border-[#5C3D2E]/5 shadow-sm hover:shadow-md hover:border-[#FF6B35]/20 transition-all group"
    >
      {photoUrl && (
        <div className="relative aspect-video overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute bottom-1 right-1 text-[8px] text-white/60 bg-black/30 px-1.5 py-0.5 rounded">
            画像提供：ホットペッパー グルメ
          </span>
        </div>
      )}

      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[#3d2e1f] text-[15px] leading-snug">
            {restaurant.name}
          </h3>
          <ExternalLink
            size={14}
            className="flex-shrink-0 text-[#8B6F61]/30 group-hover:text-[#FF6B35] transition-colors mt-0.5"
          />
        </div>

        {restaurant.catchPhrase && (
          <p className="text-xs text-[#8B6F61] line-clamp-2 leading-relaxed">
            {restaurant.catchPhrase}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {restaurant.budget && (
            <span className="text-[11px] font-bold text-[#FF6B35] bg-[#FF6B35]/8 px-2 py-0.5 rounded-md">
              {restaurant.budget}
            </span>
          )}
          {restaurant.genreName && (
            <span className="text-[11px] text-[#8B6F61] bg-[#5C3D2E]/5 px-2 py-0.5 rounded-md">
              {restaurant.genreName}
            </span>
          )}
        </div>

        <div className="space-y-1 text-[11px] text-[#8B6F61]/70">
          {restaurant.access && (
            <p className="flex items-center gap-1.5">
              <MapPin size={11} className="flex-shrink-0" />
              <span className="line-clamp-1">{restaurant.access}</span>
            </p>
          )}
          {restaurant.open && (
            <p className="flex items-start gap-1.5">
              <Clock size={11} className="flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{restaurant.open}</span>
            </p>
          )}
        </div>
      </div>
    </motion.a>
  );
}
