import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import getKeycloak from "../Module/Common/Service/keycloak";
import getTokenExpiry from "../Module/Common/Service/tokenExpiry";

export default function CallbackSSOPage() {
  const navigate = useNavigate();
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const keycloak = getKeycloak();
    if (!keycloak) {
      navigate("/login?r=E0", { replace: true });
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

          navigate("/dashboard", { replace: true });
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

          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login?r=F0", { replace: true });
        }
      })
      .catch((err) => {
        console.error("SSO Callback Error:", err);
        navigate("/login?r=E0", { replace: true });
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface font-body text-on-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-lg font-medium">Processing SSO Login...</p>
      </div>
    </div>
  );
}
