import { Option } from "./Option";

export type Question = {
  id?: string|null;
  uuid: string
  pertanyaan: string;
  required: boolean;
  created?: "admin" | "fakultas" | "prodi" | null;
  createdBy?: string | null;
  tipe: "radio" | "multiple" | "rating";
  pilihan: Option[];
  fullpath: string,
};