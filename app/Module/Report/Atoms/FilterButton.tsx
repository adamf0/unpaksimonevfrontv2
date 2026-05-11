"use client";

import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

export default function FilterButton({
  query,
  openFilter,
  disabled = false,
}: any) {
  const count = (query?.kode_fakultas ? 1 : 0) + (query?.kode_prodi ? 1 : 0);

  return (
    <button
      onClick={openFilter}
      disabled={disabled}
      className={cn(
        `
        relative z-50
        w-14 h-14
        rounded-full
        shadow-xl
        flex items-center justify-center
        aspect-square
        hover:scale-105 active:scale-95 transition
      `,
        disabled
          ? "bg-gray-400 cursor-not-allowed opacity-60"
          : "bg-primary text-white hover:scale-105 active:scale-95",
      )}
    >
      <Filter size={20} />

      <span
        className="
          absolute -top-1 -right-1
          min-w-5 h-5 px-1
          rounded-full bg-red-500
          text-white text-xs
          flex items-center justify-center
          leading-none
        "
      >
        {count}
      </span>
    </button>
  );
}
