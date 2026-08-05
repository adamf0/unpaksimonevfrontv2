import {
  ReportSummaryOverview,
  ReportDistribusiFakultas,
  ReportTopQuestion,
  ReportKategoriSummary,
  ReportYear,
  ReportSummaryData,
} from "../Attribut/ReportSummaryTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function postForm<T>(endpoint: string, judul: string): Promise<T | null> {
  try {
    const formData = new FormData();
    if (judul) {
      formData.append("judul", judul);
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

export async function fetchReportSummaryOverview(judul: string): Promise<ReportSummaryOverview | null> {
  return postForm<ReportSummaryOverview>("/kuesioners/report_summary_overview", judul);
}

export async function fetchReportDistribusiFakultas(judul: string): Promise<ReportDistribusiFakultas[] | null> {
  return postForm<ReportDistribusiFakultas[]>("/kuesioners/report_distribusi_fakultas", judul);
}

export async function fetchReportTopQuestions(judul: string): Promise<ReportTopQuestion[] | null> {
  return postForm<ReportTopQuestion[]>("/kuesioners/report_top_questions", judul);
}

export async function fetchReportKategoriSummary(judul: string): Promise<ReportKategoriSummary[] | null> {
  return postForm<ReportKategoriSummary[]>("/kuesioners/report_kategori_summary", judul);
}

export async function fetchReportYear(): Promise<ReportYear[] | null> {
  return postForm<ReportYear[]>("/kuesioners/report_year", "");
}

export async function fetchAllReportSummaries(judul: string): Promise<ReportSummaryData | null> {
  const [overview, meFakultas, topQuestions, katSummary, reportYear] = await Promise.all([
    fetchReportSummaryOverview(judul),
    fetchReportDistribusiFakultas(judul),
    fetchReportTopQuestions(judul),
    fetchReportKategoriSummary(judul),
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

export async function fetchReportSummary(judul: string): Promise<ReportSummaryData | null> {
  return fetchAllReportSummaries(judul);
}
