"use client";

import { useEffect, useRef } from "react";
import getTokenExpiry from "../Service/tokenExpiry";

export function useTokenWatcher() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshing = useRef(false);
  const hasSwapped = useRef(false); // 🔥 penting

  useEffect(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      const accessToken = sessionStorage.getItem("access_token");
      const exp = sessionStorage.getItem("access_token_exp");
      const refreshToken = sessionStorage.getItem("refresh_token");

      if (!exp || !accessToken) return;

      const now = Date.now();
      const expiry = Number(exp);

      // 🔥 reset flag kalau token baru (expiry berubah)
      if (now < expiry - 30000) {
        hasSwapped.current = false;
      }

      // 🔥 hanya 1x masuk sini
      if (now >= expiry - 30000 && !hasSwapped.current) {
        if (isRefreshing.current) return;

        isRefreshing.current = true;
        hasSwapped.current = true;

        try {
          console.log("🔄 SWAP TOKEN MODE");

          if (refreshToken) {
            console.log("✅ SUCCESS TOKEN MODE");
            sessionStorage.setItem("access_token", refreshToken);
            document.cookie = `access_token=${refreshToken}; path=/`;

            sessionStorage.removeItem("refresh_token");

            const newExp = getTokenExpiry(refreshToken);

            if (newExp) {
              sessionStorage.setItem("access_token_exp", newExp.toString());
            } else {
              throw new Error("Invalid token");
            }
          }
        } catch (err) {
          console.error("❌ SWAP FAILED", err);
          sessionStorage.clear();
          window.location.href = "/action/logout?r=E00";
        } finally {
          isRefreshing.current = false;
        }
      }

      // 🔥 expired tanpa refresh → logout
      if (now >= expiry && !refreshToken) {
        console.warn("⛔ TOKEN EXPIRED & NO REFRESH");
        sessionStorage.clear();
        window.location.href = "/action/logout?r=E00";
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
}