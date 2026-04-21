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
import { useToast } from "../../Common/Context/ToastContext";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { BankSoalItem } from "../Attribut/BankSoalItem";

interface Props {
  data: any[];
  loading: boolean;
  openDelete: (item: BankSoalItem) => void;
  openForceDelete: (item: BankSoalItem) => void;
}

export function mapBankSoal(api: any): BankSoalItem {
  const mulai = new DateTimeVO(api?.TanggalMulai ?? "");
  const akhir = new DateTimeVO(api?.TanggalAkhir ?? "");

  return {
    id: api.Id,
    uuid: api.UUID,
    judul: api.Judul,
    semester: api.Semester,
    status: api.Status || !isEmpty(api.DeletedAt ?? ""),
    tanggalmulai: mulai,
    tanggalakhir: akhir,
    konten: api?.Content,
    deskripsi: api?.Deskripsi,
    createdby: clipCreatedBy(api),
    createdbyref: api?.CreatedByRef ?? "",
    createdtime: api?.CreatedAt ?? "",
    deletedtime: api.DeletedAt ?? "",
    listextend: api.ListExt ?? [],
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

export function BankSoalTable({
  data,
  loading = false,
  openDelete,
  openForceDelete,
}: Props) {
  const { setState, actionBankSoal, loadData, setOpenTime } =
    useQuestionBankContext();
  const { pushToast } = useToast();
  const banks: BankSoalItem[] = data.map(mapBankSoal);

  async function handleBankSoalAction(
    selected: BankSoalItem,
    mode: "draf" | "active" | "restore",
    successMessage: string,
  ) {
    try {
      await actionBankSoal(selected.uuid, undefined, mode);
      pushToast(successMessage);
      await loadData();
    } catch (error: any) {
      if (!error?.response) {
        pushToast("Server error");
        return;
      }

      const { status, data } = error.response;

      const cf = handleCloudflareError(status);
      if (cf) {
        pushToast(cf);
        return;
      }

      pushToast(data?.message || "Error");
    }
  }

  const getActions = (bank: BankSoalItem): ActionItem[] => {
    const actions: ActionItem[] = [
      {
        name: "time",
        icon: "calendar_clock",
        className: "hover:text-primary",
        onClick: () => {
          setState((prev: any) => ({
            ...prev,
            selected: bank,
          }));
          setOpenTime(true);
        },
      },
      {
        name: "edit",
        icon: "edit",
        className: "hover:text-primary",
        onClick: () =>
          setState((prev: any) => ({
            ...prev,
            selected: bank,
          })),
      },
      {
        name: "delete",
        icon: "delete",
        className: "hover:text-error",
        onClick: () => openDelete(bank),
      },
    ];
    const deleted = !isEmpty(bank.deletedtime);

    if (deleted) {
      return [
        {
          name: "restore",
          icon: "restore",
          className: "hover:text-primary",
          onClick: async () =>
            await handleBankSoalAction(bank, "restore", "Berhasil restore"),
        },
        {
          name: "force delete",
          icon: "delete_forever",
          className: "hover:text-error",
          onClick: () => openForceDelete(bank),
        },
      ];
    }

    if (getBankSoalStatus(bank) === "draf") {
      actions.push({
        name: "active",
        icon: "check",
        className: "!text-green-500 hover:text-success",
        onClick: async () =>
          await handleBankSoalAction(bank, "active", "Berhasil active"),
      });
    }

    if (getBankSoalStatus(bank) === "active") {
      actions.push({
        name: "draf",
        icon: "draft",
        className: "hover:text-primary",
        onClick: async () =>
          await handleBankSoalAction(bank, "draf", "Berhasil pindah draf"),
      });
    }

    return actions;
  };

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
                key={bank.uuid}
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
