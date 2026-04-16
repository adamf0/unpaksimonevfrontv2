export interface AccountInfo {
  ID: string;
  UUID: string | null;
  Username: string;
  Level: "admin" | "fakultas" | "prodi" | string;
  Name: string;
  Email: string | null;
  RefFakultas: string | null;
  Fakultas: string | null;
  RefProdi: string | null;
  Prodi: string | null;
  Unit: string | null;
  Resource: string | null;
  CodeCtx: string | null;
}