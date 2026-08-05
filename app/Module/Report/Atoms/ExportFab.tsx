"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "../../Common/Components/Atoms/Icon";
import { cn } from "@/lib/utils";

export default function ExportFab({
  filteredDetail,
  groupedByFullPath,
  summaryData,
  exportRekapKuesioner,
  exportDetailKuesioner,
  disabled = false,
}: any) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* =========================================================
   * AUTO CLOSE IF DISABLED
   * ========================================================= */
  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  /* =========================================================
   * CLICK OUTSIDE (ROBUST VERSION)
   * ========================================================= */
  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (disabled) return;

      const path = e.composedPath?.() || [];

      if (containerRef.current && !path.includes(containerRef.current)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside, true);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside, true);
    };
  }, [disabled]);

  return (
    <div
      ref={containerRef}
      className={cn(
        `flex flex-col items-end gap-3 z-50`,
        disabled ? "opacity-50 pointer-events-none" : "",
      )}
    >
      {/* =========================
          ACTION BUTTONS (BLOCKED WHEN DISABLED)
      ========================= */}
      {!disabled && open && (
        <div className="flex flex-col gap-2 items-end text-sm">
          <button
            onClick={() => {
              exportRekapKuesioner({ rows: filteredDetail, summary: summaryData });
              setOpen(false);
            }}
            className="fab-action bg-emerald-600"
          >
            Export Rekap <small>(xlsx)</small>
          </button>

          <button
            onClick={() => {
              exportDetailKuesioner({ grouped: groupedByFullPath });
              setOpen(false);
            }}
            className="fab-action bg-indigo-600"
          >
            Export Detail <small>(xlsx)</small>
          </button>
        </div>
      )}

      {/* =========================
          MAIN FAB
      ========================= */}
      <button
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen(!open);
        }}
        className={cn(`
          ripple-btn
          w-14 h-14
          rounded-full
          bg-primary
          shadow-xl
          flex items-center justify-center
          text-2xl
          hover:scale-105
          active:scale-95
          transition-transform
          disabled:bg-gray-400
          disabled:cursor-not-allowed
        `, disabled? "text-black":"text-white")}
      >
        <span className="icon-wrap">
          <Icon name="print" />
        </span>
      </button>
    </div>
  );
}
