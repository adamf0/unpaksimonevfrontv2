export interface ReportSummaryOverview {
  id: number;
  judul: string;
  semester: string;
  total_responden: number;
  total_jawaban: number;
  rata_rata_rating: number;
  created_at?: string;
  updated_at?: string;
}

export interface ReportDistribusiFakultas {
  id: number;
  judul: string;
  semester: string;
  kode_fakultas: string;
  nama_fakultas: string;
  total_responden: number;
  persentase: number;
  prodi_distribution?: string | Array<{ title: string; total: number }>;
  created_at?: string;
  updated_at?: string;
}

export interface ReportTopQuestion {
  id: number;
  judul: string;
  semester: string;
  peringkat: number;
  pertanyaan: string;
  nama_kategori: string;
  rata_rata_skor: number;
  created_at?: string;
  updated_at?: string;
}

export interface ReportKategoriSummary {
  id: number;
  judul: string;
  semester: string;
  nama_kategori: string;
  full_text: string;
  total_pertanyaan: number;
  total_responden: number;
  rata_rata_skor: number;
  chart_distribution: string | Record<string, number>;
  questions_json?: string | Array<{
    title: string;
    jenispilihan: string;
    chart_distribution: Record<string, number>;
  }>;
  created_at?: string;
  updated_at?: string;
}

export interface ReportYear {
  id: number;
  tahun: string;
  total_kuesioner: number;
  total_mahasiswa: number;
  total_dosen: number;
  total_tendik: number;
  created_at?: string;
  updated_at?: string;
}

export interface ReportSummaryData {
  overview: ReportSummaryOverview;
  distribusi_fakultas: ReportDistribusiFakultas[];
  top_questions: ReportTopQuestion[];
  kategori_summary: ReportKategoriSummary[];
  report_year?: ReportYear[];
}
