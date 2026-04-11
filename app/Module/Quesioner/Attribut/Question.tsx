import { Option } from "./Option";

export type Question = {
  id: string;
  pertanyaan: string;
  required: boolean;
  created: "admin" | "fakultas" | "prodi";
  createdBy: string;
  tipe: "radio" | "checkbox" | "rating";
  pilihan: Option[];
};