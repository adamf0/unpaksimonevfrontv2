"use client";

import { useEffect, useRef } from "react";
import getTokenExpiry from "../Service/tokenExpiry";

export function useTokenWatcher() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshing = useRef(false);
  const hasSwapped = useRef(false);

  useEffect(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      let accessToken = sessionStorage.getItem("access_token");
      let exp = sessionStorage.getItem("access_token_exp");
      let refreshToken = sessionStorage.getItem("refresh_token");

      const getCookie = (name: string): string | null => {
        if (typeof document === "undefined") return null;
        const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
        return match && match[1] && match[1].trim() !== "" ? decodeURIComponent(match[1].trim()) : null;
      };

      const cookieAccess = getCookie("access_token");
      const cookieRefresh = getCookie("refresh_token");
      const cookieExp = getCookie("access_token_exp");

      // Sinkronisasi dari Cookie jika sessionStorage kosong
      if (!accessToken) {
        if (cookieAccess) {
          accessToken = cookieAccess;
          sessionStorage.setItem("access_token", cookieAccess);
          const newExp = cookieExp || getTokenExpiry(cookieAccess)?.toString();
          if (newExp) {
            exp = newExp;
            sessionStorage.setItem("access_token_exp", newExp);
          }
        } else if (cookieRefresh) {
          accessToken = cookieRefresh;
          sessionStorage.setItem("access_token", cookieRefresh);
          document.cookie = `access_token=${cookieRefresh}; path=/`;
        }
      }

      if (!refreshToken && cookieRefresh) {
        refreshToken = cookieRefresh;
        sessionStorage.setItem("refresh_token", cookieRefresh);
      }

      // 🛑 Guard: Jika access_token maupun refresh_token tidak ada di sessionStorage & cookie
      const hasAnyToken = Boolean(accessToken || cookieAccess || cookieRefresh);
      if (!hasAnyToken) {
        console.warn("⛔ ACCESS TOKEN & REFRESH TOKEN MISSING -> REDIRECT TO LOGOUT");
        sessionStorage.clear();
        if (typeof document !== "undefined") {
          document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "access_token_exp=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        window.location.href = "/action/logout?r=Ex";
        return;
      }

      if (!exp || !accessToken) return;

      const now = Date.now();
      const expiry = Number(exp);

      if (now < expiry - 30000) {
        hasSwapped.current = false;
      }

      if (now >= expiry - 30000 && !hasSwapped.current) {
        if (isRefreshing.current) return;

        isRefreshing.current = true;
        hasSwapped.current = true;

        try {
          console.log("🔄 SWAP TOKEN MODE");

          if (refreshToken) {
            console.log("✅ SUCCESS TOKEN MODE");
            sessionStorage.setItem("access_token", refreshToken);

            sessionStorage.removeItem("refresh_token");
            document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

            const newExp = getTokenExpiry(refreshToken);

            if (newExp) {
              sessionStorage.setItem("access_token_exp", newExp.toString());
              document.cookie = `access_token_exp=${newExp}; path=/`;
            } else {
              throw new Error("Invalid token");
            }

            document.cookie = `access_token=${refreshToken}; path=/`;
          }
        } catch (err) {
          console.error("❌ SWAP FAILED", err);
          sessionStorage.clear();
          window.location.href = "/action/logout?r=E00";
        } finally {
          isRefreshing.current = false;
        }
      }

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