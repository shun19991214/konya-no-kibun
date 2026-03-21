import { NextRequest, NextResponse } from "next/server";

const HOTPEPPER_API_KEY = process.env.HOTPEPPER_API_KEY || "";
const BASE_URL = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

function getExpandedRanges(initial: number): number[] {
  const ranges = [initial];
  for (let r = initial + 1; r <= 5; r++) ranges.push(r);
  return ranges;
}

interface HotPepperShop {
  id: string;
  name: string;
  address: string;
  station_name?: string;
  budget?: { name?: string; average?: string };
  photo?: {
    pc?: { l?: string; m?: string; s?: string };
    mobile?: { l?: string; s?: string };
  };
  urls?: { pc?: string };
  open?: string;
  access?: string;
  genre?: { name?: string };
  catch?: string;
}

function normalizeShop(shop: HotPepperShop) {
  return {
    id: shop.id,
    name: shop.name,
    address: shop.address,
    stationName: shop.station_name || "",
    budget: shop.budget?.name || "",
    budgetAverage: shop.budget?.average || "",
    photo: {
      pc: {
        l: shop.photo?.pc?.l || "",
        m: shop.photo?.pc?.m || "",
        s: shop.photo?.pc?.s || "",
      },
      mobile: {
        l: shop.photo?.mobile?.l || "",
        s: shop.photo?.mobile?.s || "",
      },
    },
    url: shop.urls?.pc || "",
    open: shop.open || "",
    access: shop.access || "",
    genreName: shop.genre?.name || "",
    catchPhrase: shop.catch || "",
  };
}

export async function GET(request: NextRequest) {
  if (!HOTPEPPER_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const genre = searchParams.get("genre");
  const keyword = searchParams.get("keyword") || "";
  const initialRange = parseInt(searchParams.get("range") || "3", 10);

  // Either lat/lng or keyword is required
  if (!genre && !keyword) {
    return NextResponse.json(
      { error: "genre or keyword is required" },
      { status: 400 }
    );
  }

  const ranges = lat && lng ? getExpandedRanges(initialRange) : [5];

  for (const range of ranges) {
    const params = new URLSearchParams({
      key: HOTPEPPER_API_KEY,
      format: "json",
      count: "10",
      order: "4", // recommended
    });

    if (lat && lng) {
      params.set("lat", lat);
      params.set("lng", lng);
      params.set("range", String(range));
    }
    if (genre) params.set("genre", genre);
    if (keyword) params.set("keyword", keyword);

    try {
      const res = await fetch(`${BASE_URL}?${params.toString()}`);
      const data = await res.json();

      // ホットペッパーAPIはエラー時もHTTP 200を返すため、レスポンス内容でエラー判定
      if (data.results?.error) {
        const errorCode = data.results.error[0]?.code;
        if (errorCode === 2000) {
          return NextResponse.json(
            { error: "API認証エラー" },
            { status: 401 }
          );
        }
        continue;
      }

      const shops: HotPepperShop[] = data.results?.shop || [];

      if (shops.length >= 3 || range === ranges[ranges.length - 1]) {
        return NextResponse.json({
          restaurants: shops.map(normalizeShop),
          range,
          total: data.results?.results_available || 0,
        });
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json({ restaurants: [], range: 5, total: 0 });
}
