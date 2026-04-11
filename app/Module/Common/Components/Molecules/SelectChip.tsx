"use client";

import Label from "../Atoms/Label";

export function SelectChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
      <Label>{label}</Label>

      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 FIX utama di sini
            onRemove(e);
          }}
          className="ml-1 hover:text-red-500"
        >
          ×
        </button>
      )}
    </div>
  );
}