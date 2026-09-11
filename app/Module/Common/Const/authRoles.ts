import { getRolesFromToken } from "../Service/tokenExpiry";

export const ADMIN_GROUP_ALIASES = [
  "adm_simonev",
  "adm_pusat",
];

export const FAKULTAS_GROUP_ALIASES = [
  "adm_simonev_fakultas",
];

export const PRODI_GROUP_ALIASES = [
  "adm_simonev_prodi",
];

export const DEFAULT_ALLOWED_LEVELS = [
  "admin",
  "fakultas",
  "prodi",
  // "Tendik",
  // "Dosen",
];

export function resolveDisplayRole(
  rawLevel: string | null | undefined,
  token?: string | null
): string {
  const level = (rawLevel || "").trim();
  const normAllowed = DEFAULT_ALLOWED_LEVELS.map((l) => l.toLowerCase());

  if (level && normAllowed.includes(level.toLowerCase())) {
    if (level.toLowerCase() === "tendik") return "Tendik";
    if (level.toLowerCase() === "dosen") return "Dosen";
    return level.toLowerCase();
  }

  const activeToken =
    token !== undefined
      ? token
      : typeof window !== "undefined"
      ? sessionStorage.getItem("access_token") || localStorage.getItem("access_token")
      : null;

  const tokenRoles = getRolesFromToken(activeToken);

  if (tokenRoles.length > 0) {
    if (tokenRoles.some((r) => ADMIN_GROUP_ALIASES.includes(r))) {
      return "admin";
    }
    if (tokenRoles.some((r) => FAKULTAS_GROUP_ALIASES.includes(r))) {
      return "fakultas";
    }
    if (tokenRoles.some((r) => PRODI_GROUP_ALIASES.includes(r))) {
      return "prodi";
    }
    if (tokenRoles.some((r) => r.toLowerCase() === "tendik")) {
      return "Tendik";
    }
    if (tokenRoles.some((r) => r.toLowerCase() === "dosen")) {
      return "Dosen";
    }
  }

  if (level.toLowerCase() === "tendik") return "Tendik";
  if (level.toLowerCase() === "dosen") return "Dosen";
  return level || "-";
}
