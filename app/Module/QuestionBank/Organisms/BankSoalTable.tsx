"use client";

import { ActionButtons } from "../../Common/Components/Molecules/ActionButtons";
import Badge from "../../Common/Components/Atoms/Badge";
import { ActionItem } from "../../Common/Components/Attribut/ActionItem";
import BadgeIndicator from "../Atoms/BadgeIndicator";

interface BankSoalItem {
  id: number;
  judul: string;
  semester: string;
  kategori: string;
  status: string;
  created: string;
  createdtime: string;  
  createdby: string;
  deletedtime: string;
}

export function BankSoalTable() {
  const banks: BankSoalItem[] = [
    {
      id: 1,
      judul: "Kualitas Fasilitas Laboratorium",
      semester: "Ganjil 2026",
      kategori: "Fasilitas",
      status: "draf",
      created: "admin",
      createdtime: "2026-01-01 00:00:00",
      createdby: "Admin",
      deletedtime: "",
    },
    {
      id: 2,
      judul: "Kualitas Fasilitas Laboratorium",
      semester: "Ganjil 2026",
      kategori: "Fasilitas",
      status: "active",
      created: "fakultas",
      createdtime: "2026-01-01 00:00:00",
      createdby: "Hukum",
      deletedtime: "",
    },
    {
      id: 3,
      judul: "Kualitas Fasilitas Laboratorium",
      semester: "Ganjil 2026",
      kategori: "Fasilitas",
      status: "delete",
      created: "admin",
      createdtime: "2026-01-01 00:00:00",
      createdby: "Admin",
      deletedtime: "2026-01-01 00:00:00",
    },
  ];

  const getActions = (user: BankSoalItem): ActionItem[] => [
    {
      name: "edit",
      icon: "edit",
      className: "hover:text-primary",
      onClick: () => console.log("edit", user),
    },
    {
      name: "delete",
      icon: "delete",
      className: "hover:text-error",
      onClick: () => console.log("delete", user),
    },
  ];

  return (
    <table className="min-w-[700px] w-full text-left border-collapse">
      <thead>
        <tr className="bg-surface-container text-on-surface-variant text-[11px] uppercase tracking-[0.15em] font-bold">
          <th className="px-4 md:px-8 py-4">Judul</th>
          <th className="px-4 md:px-8 py-4">Semester</th>
          <th className="px-4 md:px-8 py-4">Kategori</th>
          <th className="px-4 md:px-8 py-4">Status</th>
          <th className="px-4 md:px-8 py-4 text-right">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-surface-container-low">
        {banks.map((bank) => (
          <tr
            key={bank.id}
            className="hover:bg-surface-container-low/40 transition-colors"
          >
            <td className="px-4 md:px-8 py-5">
              <p className="text-sm font-bold">{bank.judul}</p>
            </td>

            <td className="px-4 md:px-8 py-5">{bank.semester}</td>

            <td className="px-4 md:px-8 py-5 text-sm text-on-surface-variant">
              <Badge>{bank.kategori}</Badge>
            </td>

            <td className="px-4 md:px-8 py-5 text-sm text-on-surface-variant">
              <BadgeIndicator variant={getStatusVariant(getBankSoalStatus(bank))}>{bank.status}</BadgeIndicator>
            </td>

            <td className="px-4 md:px-8 py-5 text-right">
              <ActionButtons items={getActions(bank)} />
            </td>
          </tr>
        ))}
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
  status: "draf" | "active" | "delete"
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