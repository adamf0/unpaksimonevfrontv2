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