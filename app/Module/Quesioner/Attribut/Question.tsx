import { Option } from "./Option";

export type Question = {
  id: string;
  uuid: string
  pertanyaan: string;
  required: boolean;
  created: "admin" | "fakultas" | "prodi";
  createdBy: string;
  tipe: "radio" | "multiple" | "rating";
  pilihan: Option[];
  fullpath: string,
};