"use client";

import { ActionButtons } from "../../Common/Components/Molecules/ActionButtons";
import { ActionItem } from "../../Common/Components/Attribut/ActionItem";
import { TemplateItem } from "../Attribut/TemplateItem";
import { StatusState } from "../Molecules/StatusState";
import { CreatedByLabel } from "../Atoms/CreatedByLabel";
import { ActionTableAdapter } from "../../Common/Adapter/ActionTableAdapter";

export function TemplateTable() {
  const datas: TemplateItem[] = [
    {
      id: 1,
      judul: "Evaluasi Dosen Ganjil 2023",
      kategori: "Akademik",
      tipe: "checkbox",
      bobot: 2,
      require: 1,
      status: "draf",
      createdtime: "2026-01-01 00:00:00",
      created: "admin",
      createdBy: "adam",
      deletedtime: "",
    },
    {
      id: 2,
      judul: "Evaluasi Dosen Ganjil 2023",
      kategori: "Akademik",
      tipe: "rating5",
      bobot: 2,
      require: 1,
      status: "active",
      createdtime: "2026-01-01 00:00:00",
      created: "fakultas",
      createdBy: "hukum",
      deletedtime: "",
    },
    {
      id: 3,
      judul: "Evaluasi Dosen Ganjil 2023",
      kategori: "Akademik",
      tipe: "radio",
      bobot: 2,
      require: 1,
      status: "deleted",
      createdtime: "2026-01-01 00:00:00",
      created: "prodi",
      createdBy: "hukum (s1)",
      deletedtime: "2026-01-01 00:00:00",
    },
  ];

  const templateActionConfig: {
    baseActions: Record<any, (item: TemplateItem) => ActionItem>;
    actionMap: Record<string, any[]>;
  } = {
    baseActions: {
      view: (item) => ({
        name: "view",
        icon: "visibility",
        className: "hover:text-primary",
        onClick: () => console.log("view", item),
      }),
      draf: (item) => ({
        name: "draf",
        icon: "drafts",
        className: "hover:text-primary",
        onClick: () => console.log("draf", item),
      }),
      active: (item) => ({
        name: "active",
        icon: "check",
        className: "!text-green-700 hover:text-primary",
        onClick: () => console.log("active", item),
      }),
      recovery: (item) => ({
        name: "recovery",
        icon: "settings_backup_restore",
        className: "!text-blue-700 hover:text-primary",
        onClick: () => console.log("recovery", item),
      }),
      edit: (item) => ({
        name: "edit",
        icon: "edit",
        className: "hover:text-primary",
        onClick: () => console.log("edit", item),
      }),
      delete: (item) => ({
        name: "delete",
        icon: "delete",
        className: "hover:text-error",
        onClick: () => console.log("delete", item),
      }),
    },

    actionMap: {
      draf: ["edit", "delete", "active"],
      deleted: ["edit", "delete", "recovery"],
      active: ["edit", "delete", "draf"],
    },
  };

  const getActions = (item: TemplateItem) => {
    return new ActionTableAdapter(item, templateActionConfig).toActionItems();
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
        {datas.map((item) => {
          return (
            <tr
              key={item.id}
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
                      {item.kategori}
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

                  <span className="px-3 py-1 text-[10px] font-extrabold rounded-full tracking-tight uppercase bg-gray-100 text-green-700">
                    <span className="text-black">Bobot: </span>+{item.bobot}
                  </span>
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                  <ActionButtons items={getActions(item)} />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
