"use client";

import { useState, useCallback } from "react";

interface LocationState {
  status: "idle" | "requesting" | "granted" | "denied" | "error";
  lat?: number;
  lng?: number;
  error?: string;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({ status: "idle" });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ status: "error", error: "位置情報がサポートされていません" });
      return;
    }

    setState({ status: "requesting" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          status: "granted",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setState({
          status: err.code === 1 ? "denied" : "error",
          error:
            err.code === 1
              ? "位置情報の許可が必要です"
              : "位置情報の取得に失敗しました",
        });
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, []);

  return { ...state, requestLocation };
}
