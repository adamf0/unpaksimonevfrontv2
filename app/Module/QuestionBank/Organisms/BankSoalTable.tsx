"use client";

import { ActionButtons } from "../../Common/Components/Molecules/ActionButtons";
import Badge from "../../Common/Components/Atoms/Badge";
import { ActionItem } from "../../Common/Components/Attribut/ActionItem";
import BadgeIndicator from "../Atoms/BadgeIndicator";
import { isEmpty } from "../../Common/Service/utility";
import { clipCreatedBy } from "../../Common/Service/clipData";
import { DateTimeVO } from "../../Common/Domain/DateTimeVO";
import {
  DateRangeService,
  RangeStatus,
} from "../../Common/DomainService/DateRangeService";
import { ButtonVariant } from "../../Common/Attribut/ButtonVariant";
import { useQuestionBankContext } from "../Context/QuestionBankProvider";

interface Props {
  data: any[];
  loading: boolean;
}

interface BankSoalItem {
  id: number;
  judul: string;
  semester: string;
  status: string;
  tanggalmulai: DateTimeVO;
  tanggalakhir: DateTimeVO;
  createdtime: string;
  createdby: string;
  deletedtime: string;
}

export function mapBankSoal(api: any): BankSoalItem {
  const mulai = new DateTimeVO(api?.TanggalMulai ?? "");
  const akhir = new DateTimeVO(api?.TanggalAkhir ?? "");

  return {
    id: api.Id,
    judul: api.Judul,
    semester: api.Semester,
    status: api.Status || !isEmpty(api.DeletedAt ?? ""),
    tanggalmulai: mulai,
    tanggalakhir: akhir,
    createdby: clipCreatedBy(api),
    createdtime: api?.CreatedAt ?? "",
    deletedtime: api.DeletedAt ?? "",
  };
}

function getRangeVariant(status: RangeStatus): ButtonVariant {
  switch (status) {
    case "TIME_RANGE_INVALID":
    case "EXPIRED":
      return "danger";

    case "SCHEDULED":
      return "warning";

    case "ACTIVE":
      return "success";

    default:
      return "ghost";
  }
}

export function BankSoalTable({ data, loading=false }: Props) {
  const { setState } = useQuestionBankContext();

  const banks: BankSoalItem[] = data.map(mapBankSoal);

  const getActions = (bank: BankSoalItem): ActionItem[] => [
    {
      name: "edit",
      icon: "edit",
      className: "hover:text-primary",
      onClick: () => {
        console.log("edit", bank);
        setState((prev: any) => ({
          ...prev,
          selected: bank,
        }));
      },
    },
    {
      name: "delete",
      icon: "delete",
      className: "hover:text-error",
      onClick: () => {
        console.log("delete", bank);
        setState((prev: any) => ({
          ...prev,
          selected: bank,
        }));
      },
    },
  ];

  return (
    <table className="min-w-[700px] w-full text-left border-collapse">
      <thead>
        <tr className="bg-surface-container text-on-surface-variant text-[11px] uppercase tracking-[0.15em] font-bold">
          <th className="px-4 md:px-8 py-4">Judul</th>
          <th className="px-4 md:px-8 py-4">Semester</th>
          <th className="px-4 md:px-8 py-4">Status</th>
          <th className="px-4 md:px-8 py-4">Tags</th>
          <th className="px-4 md:px-8 py-4 text-right">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-surface-container-low">
        {loading ? (
          <tr className="bg-surface-container text-on-surface-variant text-[11px] uppercase tracking-[0.15em] font-bold">
            <th colSpan={5} className="px-4 md:px-8 py-4">
              Loading
            </th>
          </tr>
        ) : (
          banks.map((bank) => {
            const rangeService = new DateRangeService(
              bank.tanggalmulai,
              bank.tanggalakhir,
            );

            const rangeStatus = rangeService.getStatus(
              DateTimeVO.create(new Date()),
            );

            return (
              <tr
                key={bank.id}
                className="hover:bg-surface-container-low/40 transition-colors"
              >
                <td className="px-4 md:px-8 py-5">
                  <p className="text-sm font-bold">{bank.judul}</p>
                </td>

                <td className="px-4 md:px-8 py-5">{bank.semester}</td>

                <td className="px-4 md:px-8 py-5 text-sm text-on-surface-variant">
                  <BadgeIndicator
                    variant={getStatusVariant(getBankSoalStatus(bank))}
                  >
                    {bank.status}
                  </BadgeIndicator>
                </td>

                <td className="px-4 md:px-8 py-5 text-sm text-on-surface-variant">
                  <div className="w-full flex flex-wrap gap-2">
                    <Badge className="truncate text-[clamp(0.5rem,0.5rem+0.2vmax,0.9rem)]">
                      {bank.createdby}
                    </Badge>
                    <Badge
                      className="truncate text-[clamp(0.5rem,0.5rem+0.2vmax,0.9rem)]"
                      variant={getRangeVariant(rangeStatus)}
                    >
                      {rangeStatus}
                    </Badge>
                  </div>
                </td>

                <td className="px-4 md:px-8 py-5 text-right">
                  <ActionButtons items={getActions(bank)} />
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

export type BankSoalStatus = "draf" | "active" | "delete";

export function getBankSoalStatus(item: {
  status: string;
  deletedtime: string;
}): BankSoalStatus {
  if (item.deletedtime && item.deletedtime.trim() !== "") {
    return "delete";
  }

  if (item.status === "active") return "active";

  return "draf";
}

export function getStatusVariant(
  status: "draf" | "active" | "delete",
): "primary" | "success" | "error" | "neutral" {
  switch (status) {
    case "active":
      return "success";

    case "delete":
      return "error";

    case "draf":
      return "neutral";

    default:
      return "neutral";
  }
}
