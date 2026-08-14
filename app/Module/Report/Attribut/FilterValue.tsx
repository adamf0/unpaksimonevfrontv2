import { Option } from "../../Quesioner/Attribut/Option";

export type FilterValue = {
  bankSoal: Option | Option[] | null;
  fakultas: Option | null;
  prodi: Option | null;
  semester: Option | null;
  kode_fakultas?: string | null;
  kode_prodi?: string | null;
  unit?: string | null;
  unitObj?: Option | null;
};