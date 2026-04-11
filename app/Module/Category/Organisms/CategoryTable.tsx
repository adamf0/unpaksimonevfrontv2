"use client";

import { ActionButtons } from "../../Common/Components/Molecules/ActionButtons";
import Badge from "../../Common/Components/Atoms/Badge";
import { ActionItem } from "../../Common/Components/Attribut/ActionItem";

interface CategoryItem {
  id: number;
  kategori: string;
  parent: CategoryItem | null;
}

export function CategoryTable() {
  const categorys: CategoryItem[] = [
    {
      id: 1,
      kategori: "asa",
      parent: null,
    },
    {
      id: 2,
      kategori: "budi",
      parent: {
        id: 1,
        kategori: "asa",
        parent: null,
      },
    },
  ];

  const getActions = (category: CategoryItem): ActionItem[] => [
    {
      name: "edit",
      icon: "edit",
      className: "hover:text-primary",
      onClick: () => console.log("edit", category),
    },
    {
      name: "delete",
      icon: "delete",
      className: "hover:text-error",
      onClick: () => console.log("delete", category),
    },
  ];

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
        {categorys.map((category) => (
          <tr
            key={category.id}
            className="hover:bg-surface-container-low/40 transition-colors"
          >
            <td className="px-4 md:px-8 py-5">
              <p className="text-sm font-bold">{category.kategori}</p>
            </td>

            <td className="px-4 md:px-8 py-5">
              <Badge className={category?.parent?.kategori? "bg-red-800/10 text-red-800 text-[10px]":"bg-primary/10 text-primary text-[10px]"}>{category?.parent?.kategori ?? "ROOT"}</Badge>
            </td>

            <td className="px-4 md:px-8 py-5 text-right">
              <ActionButtons items={getActions(category)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
