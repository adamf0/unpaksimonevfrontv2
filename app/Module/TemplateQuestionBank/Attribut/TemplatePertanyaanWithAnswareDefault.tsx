import { TemplateJawabanDefault } from "./TemplateJawabanDefault";

export interface TemplatePertanyaanWithAnswareDefault {
  ID: number;
  UUID: string;

  Pertanyaan: string;
  JenisPilihan: string;
  Bobot: number;

  UUIDBankSoal?: string;
  NamaBankSoal?: string;

  Kategori?: string;
  FullPath?: string;

  Required: number;
  Status: string;

  ListJawaban: TemplateJawabanDefault[];
}