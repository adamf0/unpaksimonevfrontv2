"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: ReactNode;

  loading?: boolean;
  empty?: boolean;

  minHeight?: string;

  children?: ReactNode;

  emptyTitle?: string;
  emptyDescription?: string;
};

export default function ChartCard({
  title,
  subtitle,

  loading = false,
  empty = false,

  minHeight = "320px",

  children,

  emptyTitle = "Data kosong",
  emptyDescription = "Belum ada data untuk ditampilkan.",
}: Props) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_12px_32px_-4px_rgba(44,42,81,0.06)] flex flex-col h-full relative overflow-hidden">
      {/* bubble */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

      {/* title */}
      <h4 className="font-bold text-on-surface text-lg mb-2 leading-tight pr-8 relative z-10">
        {title}
      </h4>

      {/* subtitle */}
      {subtitle && (
        <div className="text-sm text-on-surface/60 mb-6 relative z-10">
          {subtitle}
        </div>
      )}

      {/* content */}
      <div
        className="flex-grow relative z-10"
        style={{ minHeight }}
      >
        {/* loading */}
        {loading && (
          <div className="h-full flex flex-col items-center justify-center gap-4 animate-pulse">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />

            <p className="text-sm text-on-surface/70">
              Memuat data grafik...
            </p>
          </div>
        )}

        {/* empty */}
        {!loading && empty && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <svg
              width="90"
              height="90"
              viewBox="0 0 24 24"
              fill="none"
              className="mb-4 text-on-surface/30"
            >
              <path
                d="M4 19H20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7 16V12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 16V8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M17 16V14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M5 5L19 19"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            <p className="font-semibold text-on-surface mb-1">
              {emptyTitle}
            </p>

            <p className="text-sm text-on-surface/60">
              {emptyDescription}
            </p>
          </div>
        )}

        {/* filled */}
        {!loading && !empty && (
          <div className="h-full">{children}</div>
        )}
      </div>
    </div>
  );
}