import {
  ReportSummaryOverview,
  ReportDistribusiFakultas,
  ReportTopQuestion,
  ReportKategoriSummary,
  ReportYear,
  ReportSummaryData,
} from "../Attribut/ReportSummaryTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function postForm<T>(endpoint: string, judul: string, kodeFakultas?: string | null, kodeProdi?: string | null): Promise<T | null> {
  try {
    const formData = new FormData();
    if (judul) {
      formData.append("judul", judul);
    }
    if (kodeFakultas) {
      formData.append("kode_fakultas", kodeFakultas);
    }
    if (kodeProdi) {
      formData.append("kode_prodi", kodeProdi);
    }

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

export async function fetchReportSummaryOverview(judul: string, kodeFakultas?: string | null, kodeProdi?: string | null): Promise<ReportSummaryOverview | null> {
  return postForm<ReportSummaryOverview>("/kuesioners/report_summary_overview", judul, kodeFakultas, kodeProdi);
}

export async function fetchReportDistribusiFakultas(judul: string, kodeFakultas?: string | null, kodeProdi?: string | null): Promise<ReportDistribusiFakultas[] | null> {
  return postForm<ReportDistribusiFakultas[]>("/kuesioners/report_distribusi_fakultas", judul, kodeFakultas, kodeProdi);
}

export async function fetchReportTopQuestions(judul: string, kodeFakultas?: string | null, kodeProdi?: string | null): Promise<ReportTopQuestion[] | null> {
  return postForm<ReportTopQuestion[]>("/kuesioners/report_top_questions", judul, kodeFakultas, kodeProdi);
}

export async function fetchReportKategoriSummary(judul: string, kodeFakultas?: string | null, kodeProdi?: string | null): Promise<ReportKategoriSummary[] | null> {
  return postForm<ReportKategoriSummary[]>("/kuesioners/report_kategori_summary", judul, kodeFakultas, kodeProdi);
}

export async function fetchReportYear(): Promise<ReportYear[] | null> {
  return postForm<ReportYear[]>("/kuesioners/report_year", "");
}

export async function fetchAllReportSummaries(judul: string, kodeFakultas?: string | null, kodeProdi?: string | null): Promise<ReportSummaryData | null> {
  const [overview, meFakultas, topQuestions, katSummary, reportYear] = await Promise.all([
    fetchReportSummaryOverview(judul, kodeFakultas, kodeProdi),
    fetchReportDistribusiFakultas(judul, kodeFakultas, kodeProdi),
    fetchReportTopQuestions(judul, kodeFakultas, kodeProdi),
    fetchReportKategoriSummary(judul, kodeFakultas, kodeProdi),
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

export async function fetchReportSummary(judul: string, kodeFakultas?: string | null, kodeProdi?: string | null): Promise<ReportSummaryData | null> {
  return fetchAllReportSummaries(judul, kodeFakultas, kodeProdi);
}
