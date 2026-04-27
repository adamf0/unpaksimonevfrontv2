export type KuesionerResult = {
  ID: number;
  UUIDTemplatePertanyaan?: string;
  
  UUID: string;
  NIDN: string;
  NamaDosen: string;
  NIP: string;
  NamaTendik: string;
  NPM: string;
  NamaMahasiswa: string;

  KodeFakultas: string;
  Fakultas: string;
  KodeProdi: string;
  Prodi: string;
  Unit: string;

  Judul: string;
  Semester: number;
  Pertanyaan: string;
  Jawaban: string;
  FreeText: string;
  JenisPilihan: string;
  Kategori: string;
  FullPath: string;
};
