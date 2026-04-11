export interface TemplateItem {
  id: number;
  judul: string;
  kategori?: string;
  tipe: string;
  bobot: number;
  require: number;
  status: string;
  createdtime?: string;
  created?: string; //admin, fakultas, prodi
  createdBy?: string;
  deletedtime?: string;
}