import { Option } from "../../Common/Components/Attribut/Option";

export type RespondentRole = "mahasiswa" | "dosen" | "tendik";

export interface SandboxPersona {
  role: RespondentRole;
  nama: string;
  identitas: string; // NPM / NIDN / NIP
  kodeFakultas: string;
  namaFakultas: string;
  kodeProdi: string;
  namaProdi: string;
  unit: string;
}

export interface SimulationAnswers {
  [qUuid: string]: {
    qTitle: string;
    qStep: "admin" | "fakultas" | "prodi" | "unit";
    selectedOptUuid?: string;
    selectedOptText?: string;
    score?: number;
    freeText?: string;
  };
}

export const FAKULTAS_OPTIONS: Option[] = [
  { value: "01", label: "01 - FAKULTAS HUKUM" },
  { value: "02", label: "02 - FKIP" },
  { value: "03", label: "03 - FEB" },
  { value: "04", label: "04 - ISIB" },
  { value: "05", label: "05 - FAKULTAS TEKNIK" },
  { value: "06", label: "06 - FMIPA" },
  { value: "07", label: "07 - PASCASARJANA" },
];

export const PRODI_OPTIONS: Record<string, Option[]> = {
  "01": [
    { value: "0101", label: "0101 - Ilmu Hukum (S1)" },
    { value: "0102", label: "0102 - Magister Ilmu Hukum (S2)" },
  ],
  "02": [
    { value: "0201", label: "0201 - Pendidikan Bahasa Indonesia (S1)" },
    { value: "0202", label: "0202 - Pendidikan Bahasa Inggris (S1)" },
    { value: "0203", label: "0203 - Pendidikan Biologi (S1)" },
  ],
  "03": [
    { value: "0301", label: "0301 - Manajemen (S1)" },
    { value: "0302", label: "0302 - Akuntansi (S1)" },
  ],
  "04": [
    { value: "0401", label: "0401 - Ilmu Komunikasi (S1)" },
    { value: "0402", label: "0402 - Sastra Inggris (S1)" },
  ],
  "05": [
    { value: "0501", label: "0501 - Teknik Sipil (S1)" },
    { value: "0502", label: "0502 - Teknik Geodesi (S1)" },
  ],
  "06": [
    { value: "0601", label: "0601 - Ilmu Komputer (S1)" },
    { value: "0602", label: "0602 - Biologi (S1)" },
    { value: "0603", label: "0603 - Farmasi (S1)" },
  ],
  "07": [
    { value: "0701", label: "0701 - Magister Manajemen (S2)" },
  ],
};

export const UNIT_OPTIONS: Option[] = [
  { value: "LPPM", label: "LPPM" },
  { value: "PERPUSTAKAAN", label: "Perpustakaan Universitas" },
  { value: "KEUANGAN", label: "Biro Keuangan" },
  { value: "ICT", label: "UPT ICT / Komputer" },
  { value: "LABORATORIUM", label: "Laboratorium Terpadu" },
];
