export interface PersonalAccountInfo {
  ID?: string;
  UUID?: string;
  Username?: string;
  Name?: string;
  Email?: string;
  Level?: string;
  RefFakultas?: string;
  Fakultas?: string;
  RefProdi?: string;
  Prodi?: string;
  Unit?: string;
  Resource?: string;
  CodeCtx?: string;
}

export interface UpdateProfileFormData {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}
