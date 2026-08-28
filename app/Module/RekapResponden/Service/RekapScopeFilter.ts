import { RekapRespondenItem } from "../Attribut/RekapRespondenTypes";

export function getNormalizedFaculty(
  val?: string | null,
  fakultasList: any[] = [],
): string {
  if (!val) return "";
  const s = String(val).toLowerCase().trim();

  for (const f of fakultasList) {
    const code = String(
      f.KodeFakultas || f.kode_fakultas || f.Kode || f.ID || "",
    )
      .toLowerCase()
      .trim();
    const name = String(f.NamaFakultas || f.nama_fakultas || f.Nama || "")
      .toLowerCase()
      .trim();

    if (
      s === code ||
      s === name ||
      (name && name.includes(s)) ||
      (name && s.includes(name))
    ) {
      return name || code;
    }
  }

  return s;
}

/** =========================
 * RESPONDENT ORGANIZATIONAL SCOPE FILTER
 * Filters respondents according to the logged-in user's role:
 * - Admin: sees all respondents across all faculties/prodis
 * - Fakultas (e.g. Hukum / 01): sees ONLY respondents belonging to Hukum
 * - Prodi (e.g. Ilmu Hukum / 0101): sees ONLY respondents belonging to Ilmu Hukum
 * ========================= */
export function isRespondentInUserScope(
  respondent: RekapRespondenItem,
  userProfile: any,
  fakultasList: any[] = [],
): boolean {
  if (!userProfile) return true;

  const level = String(userProfile.Level || "admin").toLowerCase().trim();

  // Admin level sees all respondents
  const isAdmin =
    level === "admin" ||
    level === "superadmin" ||
    level === "adm_pusat" ||
    level === "adm_simonev" ||
    level === "putik" ||
    level === "rektorat";

  if (isAdmin) return true;

  // Extract all codes & names for user (support comma-separated multiple codes)
  const extractTokens = (strVal?: string | null) => {
    if (!strVal) return [];
    return String(strVal)
      .split(",")
      .map((s) => s.toLowerCase().trim())
      .filter(Boolean);
  };

  const userFakTokens = [
    ...extractTokens(userProfile.RefFakultas),
    ...extractTokens(userProfile.Fakultas),
  ];

  const respFakTokens = [
    ...extractTokens(respondent.KodeFakultas),
    ...extractTokens(respondent.Fakultas),
  ];

  const userProdiTokens = [
    ...extractTokens(userProfile.RefProdi),
    ...extractTokens(userProfile.Prodi),
  ];

  const respProdiTokens = [
    ...extractTokens(respondent.KodeProdi),
    ...extractTokens(respondent.Prodi),
  ];

  const matchesAny = (userTokens: string[], respTokens: string[]) => {
    if (userTokens.length === 0 || respTokens.length === 0) return true;
    for (const u of userTokens) {
      for (const r of respTokens) {
        if (u === r || u.includes(r) || r.includes(u)) {
          return true;
        }
      }
    }
    return false;
  };

  const isFakLevel = level === "fakultas" || level === "adm_simonev_fakultas";
  if (isFakLevel) {
    return matchesAny(userFakTokens, respFakTokens);
  }

  const isProdiLevel = level === "prodi" || level === "adm_simonev_prodi";
  if (isProdiLevel) {
    const fakOk = matchesAny(userFakTokens, respFakTokens);
    const prodiOk = matchesAny(userProdiTokens, respProdiTokens);
    return fakOk && prodiOk;
  }

  return true;
}
