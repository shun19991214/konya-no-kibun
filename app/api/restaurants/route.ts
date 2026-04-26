import { NextRequest, NextResponse } from "next/server";

const HOTPEPPER_API_KEY = process.env.HOTPEPPER_API_KEY || "";
const BASE_URL = "https://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
const HOTPEPPER_TIMEOUT_MS = 5000;

// v2対応: 予算コード、Q4チップフラグ（private_room, free_drink等）をサポート
// 5段階フォールバック: keyword→条件→エリア→ジャンルの段階的緩和

const FLAG_PARAMS = [
  "private_room",
  "free_drink",
  "free_food",
  "midnight",
  "lunch",
  "card",
  "non_smoking",
  "parking",
  "child",
] as const;

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
  lat?: number;
  lng?: number;
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
    lat: shop.lat || 0,
    lng: shop.lng || 0,
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

async function searchHotpepper(
  baseParams: URLSearchParams
): Promise<{ shops: HotPepperShop[]; total: number } | null> {
  try {
    const res = await fetch(`${BASE_URL}?${baseParams.toString()}`, {
      signal: AbortSignal.timeout(HOTPEPPER_TIMEOUT_MS),
    });
    const data = await res.json();

    if (data.results?.error) {
      const errorCode = data.results.error[0]?.code;
      if (errorCode === 2000) throw new Error("API認証エラー");
      return null;
    }

    return {
      shops: data.results?.shop || [],
      total: data.results?.results_available || 0,
    };
  } catch (e) {
    if (e instanceof Error && e.message === "API認証エラー") throw e;
    return null;
  }
}

export async function GET(request: NextRequest) {
  if (!HOTPEPPER_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = request.nextUrl;
  const latRaw = searchParams.get("lat");
  const lngRaw = searchParams.get("lng");
  const genre = searchParams.get("genre");
  const keyword = searchParams.get("keyword") || "";
  const budget = searchParams.get("budget") || "";
  const rangeRaw = searchParams.get("range");
  const count = searchParams.get("count") || "5";

  if (!genre && !keyword) {
    return NextResponse.json(
      { error: "genre or keyword is required" },
      { status: 400 }
    );
  }

  // lat/lng must be provided together, and both must be finite numbers in valid ranges
  let lat: string | null = null;
  let lng: string | null = null;
  if (latRaw !== null || lngRaw !== null) {
    if (latRaw === null || lngRaw === null) {
      return NextResponse.json(
        { error: "lat and lng must be provided together" },
        { status: 400 }
      );
    }
    const latNum = parseFloat(latRaw);
    const lngNum = parseFloat(lngRaw);
    if (
      !Number.isFinite(latNum) ||
      !Number.isFinite(lngNum) ||
      latNum < -90 ||
      latNum > 90 ||
      lngNum < -180 ||
      lngNum > 180
    ) {
      return NextResponse.json(
        { error: "invalid lat/lng" },
        { status: 400 }
      );
    }
    lat = String(latNum);
    lng = String(lngNum);
  }

  // range: optional, integer 1-5, default 3
  let initialRange = 3;
  if (rangeRaw !== null) {
    const r = parseInt(rangeRaw, 10);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      return NextResponse.json(
        { error: "invalid range (must be integer 1-5)" },
        { status: 400 }
      );
    }
    initialRange = r;
  }

  // フラグパラメータを収集
  const activeFlags: Record<string, string> = {};
  for (const flag of FLAG_PARAMS) {
    const val = searchParams.get(flag);
    if (val === "1") activeFlags[flag] = "1";
  }

  const ranges = lat && lng ? getExpandedRanges(initialRange) : [5];

  // === 5段階フォールバック ===
  for (const range of ranges) {
    // Step 1: 全条件で検索
    const params = new URLSearchParams({
      key: HOTPEPPER_API_KEY,
      format: "json",
      count,
      order: "4",
    });

    if (lat && lng) {
      params.set("lat", lat);
      params.set("lng", lng);
      params.set("range", String(range));
    }
    if (keyword) params.set("keyword", keyword);
    else if (genre) params.set("genre", genre);
    if (budget) params.set("budget", budget);

    for (const [k, v] of Object.entries(activeFlags)) {
      params.set(k, v);
    }

    try {
      const result = await searchHotpepper(params);
      if (result && result.shops.length >= 3) {
        return NextResponse.json({
          restaurants: result.shops.map(normalizeShop),
          range,
          total: result.total,
        });
      }

      // Step 2: keyword を除去して再検索
      if (keyword && genre) {
        const params2 = new URLSearchParams(params);
        params2.delete("keyword");
        params2.set("genre", genre);
        const result2 = await searchHotpepper(params2);
        if (result2 && result2.shops.length >= 3) {
          return NextResponse.json({
            restaurants: result2.shops.map(normalizeShop),
            range,
            total: result2.total,
            relaxed: "keyword",
          });
        }
      }

      // Step 3: Q4フラグを除去して再検索
      if (Object.keys(activeFlags).length > 0) {
        const params3 = new URLSearchParams(params);
        for (const flag of FLAG_PARAMS) params3.delete(flag);
        const result3 = await searchHotpepper(params3);
        if (result3 && result3.shops.length >= 3) {
          return NextResponse.json({
            restaurants: result3.shops.map(normalizeShop),
            range,
            total: result3.total,
            relaxed: "flags",
          });
        }
      }

      // 最大range到達時は結果が少なくても返す
      if (range === ranges[ranges.length - 1]) {
        const finalResult = result || { shops: [], total: 0 };
        return NextResponse.json({
          restaurants: finalResult.shops.map(normalizeShop),
          range,
          total: finalResult.total,
        });
      }
    } catch (e) {
      if (e instanceof Error && e.message === "API認証エラー") {
        return NextResponse.json({ error: "API認証エラー" }, { status: 401 });
      }
      continue;
    }
  }

  return NextResponse.json({ restaurants: [], range: 5, total: 0 });
}
