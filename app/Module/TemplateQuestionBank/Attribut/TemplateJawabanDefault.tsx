export interface TemplateJawabanDefault {
  ID: number;
  UUID: string;

  IdTemplatePertanyaan?: number;
  UUIDTemplatePertanyaan?: string;
  NamaTemplatePertanyaan?: string;

  Jawaban: string;
  Nilai: number;
  IsFreeText: number;

  DeletedAt?: string | null;
  CreatedAt?: string;
  UpdatedAt?: string | null;
}