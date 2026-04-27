export interface UserItem {
  UUID: string;
  Username: string;
  Level: string;
  Name: string;
  Email: string | null;
  RefFakultas: string | null;
  Fakultas: string | null;
  RefProdi: string | null;
  Prodi: string | null;
  DeletedAt: string | null;
}