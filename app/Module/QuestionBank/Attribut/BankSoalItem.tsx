import { DateTimeVO } from "../../Common/Domain/DateTimeVO";
import { BankSoalItemExt } from "./BankSoalItemExt";

export interface BankSoalItem {
  id: number;
  uuid: string;
  judul: string;
  semester: string;
  status: string;
  konten?: string;
  deskripsi?: string;
  tanggalmulai: DateTimeVO;
  tanggalakhir: DateTimeVO;
  createdtime: string;
  createdby: string;
  createdbyref: string;
  deletedtime: string;
  listextend: BankSoalItemExt[];
}
