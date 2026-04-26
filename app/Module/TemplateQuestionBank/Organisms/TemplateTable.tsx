"use client";

import { ActionButtons } from "../../Common/Components/Molecules/ActionButtons";
import { ActionItem } from "../../Common/Components/Attribut/ActionItem";
import { TemplateItem } from "../Attribut/TemplateItem";
import { StatusState } from "../Molecules/StatusState";
import { CreatedByLabel } from "../Atoms/CreatedByLabel";
import { useTemplateQuestionContext } from "../Context/TemplateQuestionProvider";
import { isEmpty } from "../../Common/Service/utility";
import { DeletedTime } from "../Molecules/DeletedTime";

interface Props {
  data: any[];
  loading: boolean;
  openDelete: (item: TemplateItem) => void;
  openForceDelete: (item: TemplateItem) => void;
}

export function TemplateTable({
  data,
  loading = false,
  openDelete,
  openForceDelete,
}: Props) {
  const { setQuestionState, actionQuestion, loadData } =
    useTemplateQuestionContext();

  const datas: TemplateItem[] = (data || []).map((item: any) => {
    return {
      id: item.ID,
      uuid: item.UUID,
      judul: item.Pertanyaan,
      kategori: isEmpty(item.UuidKategori)
        ? null
        : {
            uuid: item.UuidKategori,
            kategori: item.Kategori,
          },
      tipe: item.JenisPilihan,
      bobot: item.Bobot,
      require: item.Required,
      status:
        item.Status == "delete" || !isEmpty(item?.DeletedAt)
          ? "deleted"
          : item.Status,
      createdBy: item?.CreatedBy ?? "(LPM)",
      deletedtime: item?.DeletedAt,
    };
  });

  const getActions = (
    item: TemplateItem,
    setQuestionState: any,
    handleAction?: any,
    openDelete?: any,
    openForceDelete?: any,
  ): ActionItem[] => {
    const deleted = !isEmpty(item.deletedtime);

    // 🔥 PRIORITY 1: deleted state (override semua)
    if (deleted) {
      return [
        {
          name: "restore",
          icon: "restore",
          className: "hover:text-primary",
          onClick: async () => {
            await handleAction(item?.uuid, item, "restore");
            await loadData();
          },
        },
        {
          name: "force_delete",
          icon: "delete_forever",
          className: "hover:text-error",
          onClick: () => openForceDelete?.(item),
        },
      ];
    }

    // 🔥 BASE ACTIONS (SELALU ADA, TIDAK DUPLIKAT)
    const actions: ActionItem[] = [
      {
        name: "edit",
        icon: "edit",
        className: "hover:text-primary",
        onClick: () =>
          setQuestionState((prev: any) => ({
            ...prev,
            selected: item,
          })),
      },
      {
        name: "delete",
        icon: "delete",
        className: "hover:text-error",
        onClick: () => openDelete?.(item),
      },
    ];

    // 🔥 DYNAMIC ACTION BERDASARKAN STATUS
    if (item.status === "draf") {
      actions.push({
        name: "active",
        icon: "check",
        className: "!text-green-600 hover:text-success",
        onClick: async () => {
          await handleAction(item?.uuid, item, "active");
          await loadData();
        },
      });
    }

    if (item.status === "active") {
      actions.push({
        name: "draf",
        icon: "draft",
        className: "hover:text-primary",
        onClick: async () => {
          await handleAction(item?.uuid, item, "draf");
          await loadData();
        },
      });
    }

    return actions;
  };

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-indigo-50/50">
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Pertanyaan
          </th>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tipe Pilihan
          </th>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
            Status
          </th>
          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-indigo-50">
        {loading ? (
          <tr className="bg-surface-container text-on-surface-variant text-[11px] uppercase tracking-[0.15em] font-bold">
            <th colSpan={5} className="px-4 md:px-8 py-4">
              Loading
            </th>
          </tr>
        ) : (
          datas.map((item) => {
            return (
              <tr
                key={item.uuid}
                className="hover:bg-indigo-50/20 transition-colors"
              >
                {/* Nama + subtitle */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-indigo-900">
                      {item.judul}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-slate-500">
                        {item.kategori?.kategori}
                      </span>
                      <CreatedByLabel item={item} />
                    </div>
                  </div>
                </td>

                {/* Kategori */}
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{item.tipe}</span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    {item.require && (
                      <span className="px-3 py-1 text-[10px] font-extrabold rounded-full tracking-tight uppercase bg-green-100 text-green-700">
                        Wajib Isi
                      </span>
                    )}

                    <StatusState item={item} />

                    <DeletedTime item={item} />

                    <span className="px-3 py-1 text-[10px] font-extrabold rounded-full tracking-tight uppercase bg-gray-100 text-green-700">
                      <span className="text-black">Bobot: </span>+{item.bobot}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <ActionButtons
                      items={getActions(
                        item,
                        setQuestionState,
                        actionQuestion,
                        openDelete,
                        openForceDelete,
                      )}
                    />
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
