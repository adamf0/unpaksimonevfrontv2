"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import getKeycloak from "../Module/Common/Service/keycloak";
import getTokenExpiry from "../Module/Common/Service/tokenExpiry";

export default function CallbackSSOPage() {
  const router = useRouter();
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const keycloak = getKeycloak();
    if (!keycloak) {
      router.replace("/login?r=E0");
      return;
    }

    keycloak
      .init({
        onLoad: "check-sso",
        checkLoginIframe: false,
        pkceMethod: "S256",
      })
      .then((authenticated) => {
        if (authenticated && keycloak.token) {
          sessionStorage.setItem("access_token", keycloak.token);
          document.cookie = `access_token=${keycloak.token}; path=/`;

          const exp = getTokenExpiry(keycloak.token);
          if (exp) {
            sessionStorage.setItem("access_token_exp", exp.toString());
          }

          if (keycloak.refreshToken) {
            sessionStorage.setItem("refresh_token", keycloak.refreshToken);
          }
          if (keycloak.idToken) {
            sessionStorage.setItem("id_token", keycloak.idToken);
          }

          router.replace("/dashboard");
        } else if (keycloak.token) {
          sessionStorage.setItem("access_token", keycloak.token);
          document.cookie = `access_token=${keycloak.token}; path=/`;

          const exp = getTokenExpiry(keycloak.token);
          if (exp) {
            sessionStorage.setItem("access_token_exp", exp.toString());
          }

          if (keycloak.refreshToken) {
            sessionStorage.setItem("refresh_token", keycloak.refreshToken);
          }
          if (keycloak.idToken) {
            sessionStorage.setItem("id_token", keycloak.idToken);
          }

          router.replace("/dashboard");
        } else {
          router.replace("/login?r=F0");
        }
      })
      .catch((err) => {
        console.error("SSO Callback Error:", err);
        router.replace("/login?r=E0");
      });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface font-body text-on-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-lg font-medium">Processing SSO Login...</p>
      </div>
    </div>
  );
}
