"use client";

import { ActionButtons } from "../../Common/Components/Molecules/ActionButtons";
import Badge from "../../Common/Components/Atoms/Badge";
import { ActionItem } from "../../Common/Components/Attribut/ActionItem";
import { isEmpty } from "../../Common/Service/utility";
import { useCategoryContext } from "../Context/CategoryProvider";
import { useToast } from "../../Common/Context/ToastContext";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";

interface Props {
  data: any[];
  loading?: boolean;
  openDelete: (item: any) => void;
  openForceDelete: (item: any) => void;
}

/* =========================
   DOMAIN MODEL
========================= */
interface CategoryItem {
  id: number;
  uuid: string;
  namaKategori: string;
  uuidSubKategori: string;
  subKategori: string;
  fullTexts: string;
  createdBy: string;
  createdByRef: string;
  deletedAt: string | null;

  role: string;
  kodeFakultas: string;
  namaFakultas: string;
  kodeProdi: string;
  namaProdi: string;

  isDeleted: boolean;
}

/* =========================
   MAPPER (API → DOMAIN)
========================= */
export function mapCategory(api: any): CategoryItem {
  return {
    id: api.ID,
    uuid: api.UUID,
    namaKategori: api.NamaKategori,
    uuidSubKategori: api.UuidSubKategori,
    subKategori: api.NamaSubKategori,
    fullTexts: api.FullTexts,
    createdBy: api.CreatedBy,
    createdByRef: api.CreatedByRef,
    deletedAt: api.DeletedAt,

    role: api.Role,
    kodeFakultas: api.KodeFakultas,
    namaFakultas: api.NamaFakultas,
    kodeProdi: api.KodeProdi,
    namaProdi: api.NamaProdi,

    isDeleted: !isEmpty(api.DeletedAt ?? ""),
  };
}

/* =========================
   TABLE COMPONENT
========================= */
export function CategoryTable({
  data,
  loading = false,
  openDelete,
  openForceDelete,
}: Props) {
  const { setState, actionCategory, loadData } = useCategoryContext();
  const { pushToast } = useToast();
  const categories: CategoryItem[] = data.map(mapCategory);

  async function handleCategoryAction(
    selected: CategoryItem,
    mode: "draf" | "active" | "restore",
    successMessage: string,
  ) {
    try {
      await actionCategory(selected.uuid, undefined, mode);
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

  const getActions = (category: CategoryItem): ActionItem[] => {
    const actions: ActionItem[] = [
      {
        name: "edit",
        icon: "edit",
        className: "hover:text-primary",
        onClick: () =>
          setState((prev: any) => ({
            ...prev,
            selected: category,
          })),
      },
      {
        name: "delete",
        icon: "delete",
        className: "hover:text-error",
        onClick: () => openDelete(category),
      },
    ];
    const deleted = !isEmpty(category.deletedAt);

    if (deleted) {
      return [
        {
          name: "restore",
          icon: "restore",
          className: "hover:text-primary",
          onClick: async () =>
            await handleCategoryAction(category, "restore", "Berhasil restore"),
        },
        {
          name: "force delete",
          icon: "delete_forever",
          className: "hover:text-error",
          onClick: () => openForceDelete(category),
        },
      ];
    }

    return actions;
  };

  return (
    <table className="min-w-[700px] w-full text-left border-collapse">
      <thead>
        <tr className="bg-surface-container text-on-surface-variant text-[11px] uppercase tracking-[0.15em] font-bold">
          <th className="px-4 md:px-8 py-4">Kategori</th>
          <th className="px-4 md:px-8 py-4">Parent</th>
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
          categories.map((category) => {
            return (
              <tr
                key={category.id}
                className="hover:bg-surface-container-low/40 transition-colors"
              >
                <td className="px-4 md:px-8 py-5">
                  <p className="text-sm font-bold">{category.namaKategori}</p>
                  {!isEmpty(category.uuidSubKategori) ? (
                    <small>{category.fullTexts}</small>
                  ) : (
                    <></>
                  )}
                </td>

                <td className="px-4 md:px-8 py-5">
                  <Badge
                    className={
                      !isEmpty(category?.uuidSubKategori)
                        ? "bg-red-800/10 text-red-800 text-[10px]"
                        : "bg-primary/10 text-primary text-[10px]"
                    }
                  >
                    {isEmpty(category?.uuidSubKategori)
                      ? "ROOT"
                      : category.subKategori}
                  </Badge>
                </td>

                <td className="px-4 md:px-8 py-5 text-right">
                  <ActionButtons items={getActions(category)} />
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
