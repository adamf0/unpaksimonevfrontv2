import {
  ReportSummaryOverview,
  ReportDistribusiFakultas,
  ReportTopQuestion,
  ReportKategoriSummary,
  ReportYear,
  ReportSummaryData,
} from "../Attribut/ReportSummaryTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function getBaseSurveyTitle(rawJudul: string): string {
  let str = (rawJudul || "").trim();
  if (!str) return "";
  const semMatch = str.match(/\s*\(\d{4,6}\)$/);
  if (semMatch) {
    str = str.substring(0, semMatch.index).trim();
  }
  str = str.replace(/\s*-\s*Semester\s+(Ganjil|Genap)/i, "").trim();
  return str;
}

async function postForm<T>(
  endpoint: string,
  judul: string,
  kodeFakultas?: string | null,
  kodeProdi?: string | null,
  unit?: string | null
): Promise<T | null> {
  try {
    const formData = new FormData();
    if (judul) {
      formData.append("judul", judul);
    }
    formData.append("kode_fakultas", kodeFakultas || "");
    formData.append("kode_prodi", kodeProdi || "");
    formData.append("unit", unit || "");

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token") || ""}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data as T;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return null;
  }
}

export async function fetchReportSummaryOverview(
  judul: string,
  kodeFakultas?: string | null,
  kodeProdi?: string | null,
  unit?: string | null
): Promise<ReportSummaryOverview | null> {
  return postForm<ReportSummaryOverview>("/kuesioners/report_summary_overview", judul, kodeFakultas, kodeProdi, unit);
}

export async function fetchReportDistribusiFakultas(
  judul: string,
  kodeFakultas?: string | null,
  kodeProdi?: string | null,
  unit?: string | null
): Promise<ReportDistribusiFakultas[] | null> {
  return postForm<ReportDistribusiFakultas[]>("/kuesioners/report_distribusi_fakultas", judul, kodeFakultas, kodeProdi, unit);
}

export async function fetchReportTopQuestions(
  judul: string,
  kodeFakultas?: string | null,
  kodeProdi?: string | null,
  unit?: string | null
): Promise<ReportTopQuestion[] | null> {
  return postForm<ReportTopQuestion[]>("/kuesioners/report_top_questions", judul, kodeFakultas, kodeProdi, unit);
}

export async function fetchReportKategoriSummary(
  judul: string,
  kodeFakultas?: string | null,
  kodeProdi?: string | null,
  unit?: string | null
): Promise<ReportKategoriSummary[] | null> {
  return postForm<ReportKategoriSummary[]>("/kuesioners/report_kategori_summary", judul, kodeFakultas, kodeProdi, unit);
}

export async function fetchReportYear(): Promise<ReportYear[] | null> {
  return postForm<ReportYear[]>("/kuesioners/report_year", "");
}

export async function fetchAllReportSummaries(
  judul: string,
  kodeFakultas?: string | null,
  kodeProdi?: string | null,
  unit?: string | null
): Promise<ReportSummaryData | null> {
  const baseTitle = getBaseSurveyTitle(judul);

  const [overview, meFakultas, topQuestions, katSummary, reportYear] = await Promise.all([
    fetchReportSummaryOverview(judul, kodeFakultas, kodeProdi, unit),
    fetchReportDistribusiFakultas(judul, kodeFakultas, kodeProdi, unit),
    fetchReportTopQuestions(judul, kodeFakultas, kodeProdi, unit),
    fetchReportKategoriSummary(baseTitle, kodeFakultas, kodeProdi, unit),
    fetchReportYear(),
  ]);

  return {
    overview: overview || {
      id: 0,
      judul,
      semester: "",
      total_responden: 0,
      total_jawaban: 0,
      rata_rata_rating: 0,
    },
    distribusi_fakultas: meFakultas || [],
    top_questions: topQuestions || [],
    kategori_summary: katSummary || [],
    report_year: reportYear || [],
  };
}

export async function fetchReportUnits(): Promise<string[] | null> {
  try {
    const res = await fetch(`${BASE_URL}/units`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token") || ""}`,
      },
    });
    if (!res || !res.ok || typeof res.json !== "function") return null;
    const result = await res.json();
    return (result.data || result) as string[];
  } catch {
    return null;
  }
}
