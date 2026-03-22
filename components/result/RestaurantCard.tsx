"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, ExternalLink, Navigation } from "lucide-react";
import type { Restaurant } from "@/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index: number;
  userLocation?: { lat: number; lng: number } | null;
}

function calcDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

export function RestaurantCard({ restaurant, index, userLocation }: RestaurantCardProps) {
  const photoUrl =
    restaurant.photo.pc.m ||
    restaurant.photo.pc.l ||
    restaurant.photo.mobile.l ||
    "";

  const distance =
    userLocation && restaurant.lat && restaurant.lng
      ? calcDistance(
          userLocation.lat,
          userLocation.lng,
          restaurant.lat,
          restaurant.lng
        )
      : null;

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
          {distance !== null && (
            <span className="absolute top-2 left-2 flex items-center gap-1 text-[11px] font-bold text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
              <Navigation size={10} />
              {formatDistance(distance)}
            </span>
          )}
        </div>
      )}

      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[#3d2e1f] text-[15px] leading-snug">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {distance !== null && !photoUrl && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#FF6B35]">
                <Navigation size={9} />
                {formatDistance(distance)}
              </span>
            )}
            <ExternalLink
              size={14}
              className="text-[#8B6F61]/30 group-hover:text-[#FF6B35] transition-colors mt-0.5"
            />
          </div>
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

        {/* Google Maps link */}
        {restaurant.lat && restaurant.lng && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 py-2 mt-1 rounded-lg bg-[#FFF8F0] text-[11px] font-medium text-[#3d2e1f] hover:bg-[#FF6B35]/10 transition-colors"
          >
            <MapPin size={12} className="text-[#FF6B35]" />
            Google マップで経路を見る
          </a>
        )}
      </div>
    </motion.a>
  );
}
