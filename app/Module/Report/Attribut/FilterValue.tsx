import { Option } from "../../Quesioner/Attribut/Option";

export type FilterValue = {
  bankSoal: Option[];
  fakultas: Option | null;
  prodi: Option | null;
  semester: Option | null;
};