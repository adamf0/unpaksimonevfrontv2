"use client";

import { Filter } from "lucide-react";

export default function FilterButton({ query, openFilter }: any) {
  const count = (query?.kode_fakultas ? 1 : 0) + (query?.kode_prodi ? 1 : 0);

  return (
    <button
      onClick={openFilter}
      className="
        fixed bottom-5 right-5 sm:bottom-6 sm:right-6
        z-50
        w-14 h-14
        rounded-full
        bg-primary text-white
        shadow-xl
        flex items-center justify-center
        aspect-square
        hover:scale-105 active:scale-95 transition
      "
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
