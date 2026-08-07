'use client';

import React, { useState, useRef, useEffect } from "react";
import Button from "../Atoms/Button";
import Icon from "../Atoms/Icon";
import { ActionItem } from "../Attribut/ActionItem";

interface ActionButtonsProps {
  items?: ActionItem[];
}

const ACTION_DEFAULTS: Record<string, { label: string; tooltip: string }> = {
  edit: { label: "Edit Data", tooltip: "Edit data ini" },
  delete: { label: "Hapus", tooltip: "Hapus ke tempat sampah" },
  copy: { label: "Salin Data", tooltip: "Duplikat data ini" },
  restore: { label: "Pulihkan", tooltip: "Pulihkan data dari tempat sampah" },
  "force delete": { label: "Hapus Permanen", tooltip: "Hapus data secara permanen" },
  force_delete: { label: "Hapus Permanen", tooltip: "Hapus data secara permanen" },
  time: { label: "Atur Waktu", tooltip: "Atur jadwal dan durasi akses" },
  active: { label: "Aktifkan", tooltip: "Ubah status menjadi Aktif" },
  draf: { label: "Set Draft", tooltip: "Ubah status menjadi Draft" },
};

function getActionMeta(action: ActionItem) {
  const normalizedKey = action.name.toLowerCase().trim();
  const fallback = ACTION_DEFAULTS[normalizedKey] || {
    label: action.name ? action.name.charAt(0).toUpperCase() + action.name.slice(1) : "",
    tooltip: action.name || "Action",
  };
  return {
    label: action.label || fallback.label,
    tooltip: action.tooltip || fallback.tooltip,
  };
}

export function ActionButtons({ items = [] }: ActionButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!items || items.length === 0) return null;

  return (
    <div ref={containerRef} className="inline-flex items-center justify-end text-right">
      {/* Desktop Mode (md: flex row of icon buttons with hover tooltips) */}
      <div className="hidden md:inline-flex items-center justify-end gap-1">
        {items.map((action, index) => {
          const meta = getActionMeta(action);
          const displayText = meta.label || meta.tooltip;

          return (
            <div
              key={`desktop-${action.name}-${index}`}
              className="relative group inline-flex items-center justify-center"
            >
              <Button
                type="button"
                onClick={action.onClick}
                title={displayText}
                aria-label={displayText}
                className={`p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all duration-150 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  action.className ?? ""
                }`}
              >
                <Icon name={action.icon} className="!text-lg" />
              </Button>

              {/* Floating Tooltip Pill */}
              <div className="absolute bottom-full mb-1.5 hidden group-hover:flex group-focus-within:flex flex-col items-center pointer-events-none z-30 transition-all duration-150 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0">
                <span className="bg-slate-900/90 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-md whitespace-nowrap backdrop-blur-sm">
                  {displayText}
                </span>
                <span className="w-1.5 h-1.5 bg-slate-900/90 rotate-45 -mt-0.5"></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Mode (< md: Action Menu Dropdown Button with Full Labels) */}
      <div className="md:hidden relative inline-block text-left">
        <Button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label="Menu Aksi"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-outline/20 bg-surface-container-low text-on-surface text-xs font-semibold hover:bg-surface-container-high active:scale-95 transition-all shadow-sm"
        >
          <Icon name="more_vert" className="!text-base" />
          <span>Aksi</span>
        </Button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-48 sm:w-56 bg-surface-container-highest/95 backdrop-blur-md rounded-xl shadow-xl border border-outline/20 p-1.5 z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-150">
            {items.map((action, index) => {
              const meta = getActionMeta(action);

              return (
                <button
                  key={`mobile-${action.name}-${index}`}
                  type="button"
                  aria-label={meta.label}
                  onClick={() => {
                    setIsOpen(false);
                    action.onClick();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium rounded-lg transition-colors text-left focus:outline-none focus:bg-surface-container-high hover:bg-surface-container-high active:bg-surface-container-high ${
                    action.className ?? "text-on-surface"
                  }`}
                >
                  <Icon name={action.icon} className="!text-base flex-shrink-0" />
                  <span className="flex-1 truncate">{meta.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
