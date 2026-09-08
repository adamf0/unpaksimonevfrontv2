export default function getTokenExpiry(token: string): number | null {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    let payload = parts[1];

    // 🔥 base64url → base64
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");

    // 🔥 padding fix
    const pad = payload.length % 4;
    if (pad) {
      payload += "=".repeat(4 - pad);
    }

    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);

    if (!parsed.exp) return null;

    return parsed.exp * 1000;
  } catch (err) {
    console.error("JWT decode error:", err);
    return null;
  }
}

export function getRolesFromToken(token: string | null): string[] {
  if (!token) return [];
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return [];

    let payload = parts[1];
    payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = payload.length % 4;
    if (pad) {
      payload += "=".repeat(4 - pad);
    }

    const decoded = atob(payload);
    const parsed = JSON.parse(decoded);

    const roles: string[] = [];

    if (parsed.level) roles.push(String(parsed.level).toLowerCase());
    if (parsed.role) roles.push(String(parsed.role).toLowerCase());

    if (Array.isArray(parsed.group)) {
      parsed.group.forEach((g: any) => roles.push(String(g).toLowerCase()));
    }
    if (Array.isArray(parsed.groups)) {
      parsed.groups.forEach((g: any) => roles.push(String(g).toLowerCase()));
    }
    if (Array.isArray(parsed.realm_access?.roles)) {
      parsed.realm_access.roles.forEach((r: any) => roles.push(String(r).toLowerCase()));
    }

    return roles;
  } catch (err) {
    return [];
  }
}