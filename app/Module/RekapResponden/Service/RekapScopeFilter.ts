import { RekapRespondenItem } from "../Attribut/RekapRespondenTypes";

const facultyCodeMap: Record<string, string> = {
  "01": "hukum",
  "02": "fkip",
  "03": "feb",
  "04": "isib",
  "05": "ft",
  "06": "fmipa",
  "07": "pascasarjana",
};

export function getNormalizedFaculty(val?: string | null): string {
  if (!val) return "";
  const s = String(val).toLowerCase().trim();
  return facultyCodeMap[s] || s;
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
): boolean {
  if (!userProfile) return true;

  const level = String(userProfile.Level || "admin").toLowerCase().trim();

  // Admin sees all respondents
  if (level === "admin") return true;

  const userFak = getNormalizedFaculty(
    userProfile.RefFakultas || userProfile.Fakultas,
  );

  const respFak = getNormalizedFaculty(
    respondent.Fakultas || respondent.KodeFakultas,
  );

  const userProdi = String(
    userProfile.RefProdi || userProfile.Prodi || "",
  )
    .toLowerCase()
    .trim();

  const respProdi = String(
    respondent.Prodi || respondent.KodeProdi || "",
  )
    .toLowerCase()
    .trim();

  // FAKULTAS ROLE: Only respondents matching logged-in user's faculty
  if (level === "fakultas") {
    if (!userFak) return true;
    return respFak !== "" && (respFak.includes(userFak) || userFak.includes(respFak));
  }

  // PRODI ROLE: Only respondents matching logged-in user's prodi (and faculty)
  if (level === "prodi") {
    let fakMatch = true;
    if (userFak) {
      fakMatch = respFak !== "" && (respFak.includes(userFak) || userFak.includes(respFak));
    }

    let prodiMatch = true;
    if (userProdi) {
      prodiMatch =
        respProdi !== "" &&
        (respProdi.includes(userProdi) || userProdi.includes(respProdi));
    }

    return fakMatch && prodiMatch;
  }

  return true;
}
