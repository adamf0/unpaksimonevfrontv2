export interface RekapRespondenItem {
  UUID?: string;
  NIDN?: string | null;
  NamaDosen?: string | null;
  NIP?: string | null;
  NamaTendik?: string | null;
  NPM?: string | null;
  NamaMahasiswa?: string | null;
  KodeFakultas?: string | null;
  Fakultas?: string | null;
  KodeProdi?: string | null;
  Prodi?: string | null;
  Unit?: string | null;
  UUIDBankSoal?: string;
  Judul?: string;
  Semester?: string | null;
  Tanggal?: string;
  CreatedAt?: string;
}

export interface PagedRekapResponden {
  data: RekapRespondenItem[];
  total: number;
  page: number;
  limit: number;
}
