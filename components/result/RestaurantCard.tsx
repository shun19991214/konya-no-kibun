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
      className="block rounded-2xl overflow-hidden warm-card group"
    >
      {photoUrl && (
        <div className="relative aspect-[16/9] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-1 right-1 text-[9px] text-white/70 bg-black/40 px-1.5 py-0.5 rounded">
            画像提供：ホットペッパー グルメ
          </span>
        </div>
      )}

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-bold text-accent text-base leading-tight">
            {restaurant.name}
          </h3>
          <ExternalLink
            size={16}
            className="flex-shrink-0 text-accent-light/40 group-hover:text-primary transition-colors mt-0.5"
          />
        </div>

        {restaurant.catchPhrase && (
          <p className="text-xs text-accent-light/70 line-clamp-2">
            {restaurant.catchPhrase}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-accent-light/60">
          {restaurant.budget && (
            <span className="inline-flex items-center gap-1 bg-primary/5 text-primary px-2 py-0.5 rounded-full font-medium">
              {restaurant.budget}
            </span>
          )}
          {restaurant.genreName && (
            <span className="inline-flex items-center gap-1 bg-card px-2 py-0.5 rounded-full">
              {restaurant.genreName}
            </span>
          )}
        </div>

        <div className="space-y-1 text-xs text-accent-light/50">
          {restaurant.access && (
            <p className="flex items-center gap-1">
              <MapPin size={12} />
              {restaurant.access}
            </p>
          )}
          {restaurant.open && (
            <p className="flex items-start gap-1">
              <Clock size={12} className="mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{restaurant.open}</span>
            </p>
          )}
        </div>
      </div>
    </motion.a>
  );
}
