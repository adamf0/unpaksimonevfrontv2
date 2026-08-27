import AdminPanelTemplate from "./AdminPanelTemplate";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AccountInfo } from "../../Attribut/AccountInfo";

function decodeJWTServer(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = payload.length % 4;
    if (pad) payload += "=".repeat(4 - pad);
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function resolveLevelFromGroupsAndRoles(jwt: any): string | null {
  if (!jwt) return null;

  const groups: string[] = Array.isArray(jwt.group)
    ? jwt.group
    : Array.isArray(jwt.groups)
    ? jwt.groups
    : [];

  const roles: string[] = Array.isArray(jwt.realm_access?.roles)
    ? jwt.realm_access.roles
    : [];

  const allItems = [...groups, ...roles].map((item) =>
    String(item).trim().toLowerCase()
  );

  const has = (...keys: string[]) =>
    keys.some((k) => allItems.includes(k.toLowerCase()));

  // 👑 Priority 1: Admin / Pusat Level
  if (
    has(
      "adm_simonev",
      "admin",
      "superadmin",
      "adm_pusat",
      "putik",
    )
  ) {
    return "admin";
  }

  // 🏛️ Priority 2: Fakultas Level
  if (has("adm_simonev_fakultas", "fakultas", "adm_fakultas")) {
    return "fakultas";
  }

  // 🎓 Priority 3: Prodi Level
  if (has("adm_simonev_prodi", "prodi", "adm_prodi")) {
    return "prodi";
  }

  // 👥 Priority 4: General Roles
  // if (has("tendik")) return "tendik";
  // if (has("dosen")) return "dosen";
  // if (has("mahasiswa")) return "mahasiswa";

  return null;
}

function createUserFromJWT(jwt: any): AccountInfo | null {
  if (!jwt || !jwt.exp || jwt.exp * 1000 <= Date.now()) return null;

  const level = resolveLevelFromGroupsAndRoles(jwt) || "user";

  return {
    ID: jwt.sub || "",
    UUID: jwt.sub || "",
    Username: jwt.preferred_username || jwt.name || "",
    Level: level,
    Name: jwt.name || jwt.preferred_username || "SSO User",
    Email: jwt.email || null,
    RefFakultas: null,
    Fakultas: null,
    RefProdi: null,
    Prodi: null,
    Unit: null,
    Resource: "sso",
    CodeCtx: null,
  };
}

export default async function AdminPanelTemplateServer({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NEXT_EXPORT === "true") {
    const dummyUser = { Name: "Static User", Level: "admin" } as any;
    return (
      <AdminPanelTemplate userProfile={dummyUser}>
        {children}
      </AdminPanelTemplate>
    );
  }

  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;

  // ❌ tidak ada token
  if (!token) {
    redirect("/action/logout?r=Ex");
  }

  const jwt = decodeJWTServer(token);
  const ssoLevel = resolveLevelFromGroupsAndRoles(jwt);

  let user: AccountInfo | null = null;
  let fetchError: "E1" | "E0" | null = null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/whoami`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      fetchError = "E1";
    } else {
      user = await res.json();
    }
  } catch (err) {
    console.error("whoami error:", err);
    fetchError = "E0";
  }

  // Jika whoami gagal, coba fallback ke decode JWT
  if (!user) {
    const ssoUser = createUserFromJWT(jwt);
    if (ssoUser) {
      user = ssoUser;
    } else {
      redirect(`/action/logout?r=${fetchError || "E0"}`);
    }
  } else if (ssoLevel && ["admin", "fakultas", "prodi"].includes(ssoLevel)) {
    // 🔥 UTAMAKAN HIRARKI GRUP SSO (adm_pusat, adm_simonev, superadmin, adm_simonev_fakultas, adm_simonev_prodi)
    user.Level = ssoLevel;
  }

  // ✅ VALIDASI ROLE TERIZINKAN (Hanya Admin, Fakultas, dan Prodi yang diizinkan masuk ke Admin Panel)
  const allowedRoles = [
    "admin",
    "fakultas",
    "prodi",
    "putik",
    "adm_simonev",
    "adm_pusat",
  ];

  const userLevel = (user?.Level || "").toLowerCase();
  const isAllowed = allowedRoles.some((role) => userLevel.includes(role));

  if (!isAllowed) {
    redirect("/action/logout?r=F0");
  }

  return (
    <AdminPanelTemplate userProfile={user}>
      {children}
    </AdminPanelTemplate>
  );
}