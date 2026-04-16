export interface TemplateItem {
  id: number;
  uuid: string;
  judul: string;
  kategori?: Kategori|null;
  tipe: string;
  bobot: number;
  require: number;
  status: string;
  createdtime?: string;
  created?: string; //admin, fakultas, prodi
  createdBy?: string;
  deletedtime?: string;
}

export interface Kategori {
  uuid: string;
  kategori: string;
}