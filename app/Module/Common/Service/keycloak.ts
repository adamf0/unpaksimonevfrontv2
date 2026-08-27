import Keycloak from "keycloak-js";

export const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "https://gerbang.unpak.ac.id",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "gateway",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "unpak_link_gate",
};

let keycloakInstance: Keycloak | null = null;

export const getKeycloak = (): Keycloak | null => {
  if (typeof window !== "undefined") {
    if (!keycloakInstance) {
      keycloakInstance = new Keycloak(keycloakConfig);
    }
    return keycloakInstance;
  }
  return null;
};

export const startSSOLogin = async (redirectUri?: string): Promise<void> => {
  const keycloak = getKeycloak();
  if (!keycloak) return;

  const targetRedirectUri =
    redirectUri || `${window.location.origin}/callback_sso`;

  try {
    if (keycloak.didInitialize) {
      await keycloak.login({ redirectUri: targetRedirectUri });
    } else {
      await keycloak.init({
        onLoad: "login-required",
        redirectUri: targetRedirectUri,
        checkLoginIframe: false,
        pkceMethod: "S256",
      });
    }
  } catch (err) {
    console.error("Keycloak login error, falling back to direct auth redirect:", err);
    const fallbackUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/auth?client_id=${encodeURIComponent(
      keycloakConfig.clientId
    )}&redirect_uri=${encodeURIComponent(targetRedirectUri)}&response_type=code&scope=openid`;
    window.location.href = fallbackUrl;
  }
};

export default getKeycloak;
