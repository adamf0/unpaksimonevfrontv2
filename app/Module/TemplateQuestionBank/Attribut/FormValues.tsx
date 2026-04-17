import { ChoiceOption } from "./ChoiceOption";

export type FormValues = {
  banksoal: { label: string; value: string } | null;
  kategori: { label: string; value: string } | null;
  tipepilihan: { label: string; value: string } | null;
  bobot: number;
  wajibisi: boolean;
  pertanyaan: string;
  options: ChoiceOption[];
};