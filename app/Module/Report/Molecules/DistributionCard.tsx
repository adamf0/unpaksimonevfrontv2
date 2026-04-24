"use client";

import { useMemo, useState } from "react";
import ProgramCard from "../Atoms/ProgramCard";
import { FacultyItem } from "../Attribut/FacultyItem";

type Props = {
  data: FacultyItem;
  grandTotal?: number;
  defaultOpen?: boolean;
};

export default function DistributionCard({
  data,
  grandTotal = 0,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  // total dalam 1 fakultas
  const totalRespondent = useMemo(() => {
    return data.data.reduce((s, i) => s + i.total, 0);
  }, [data]);

  // persen terhadap semua fakultas
  const percentOfAll = useMemo(() => {
    if (!grandTotal) return 0;
    return Math.round((totalRespondent / grandTotal) * 100);
  }, [grandTotal, totalRespondent]);

  // breakdown program studi
  const items = useMemo(() => {
    if (!totalRespondent) return [];

    return data.data.map((item) => ({
      ...item,
      percent: Math.round((item.total / totalRespondent) * 100),
    }));
  }, [data, totalRespondent]);

  return (
    <div className="bg-surface-container-low rounded-3xl overflow-hidden transition-all">
      {/* HEADER */}
      <div
        onClick={() => setOpen(!open)}
        className="p-6 flex items-center justify-between cursor-pointer border border-transparent hover:border-indigo-100 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              open
                ? "bg-indigo-100 text-indigo-600"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            <span className="material-symbols-outlined">
              account_balance
            </span>
          </div>

          <div>
            <h4 className="font-bold text-on-surface">
              {data.title}
            </h4>

            <p className="text-sm text-slate-500">
              {data.data.length} Program Studi •{" "}
              {totalRespondent.toLocaleString()} Responden

              <span className="ml-2 text-xs bg-white text-indigo-600 px-2 py-1 rounded-full">
                {percentOfAll}%
              </span>
            </p>
          </div>
        </div>

        <span
          className={`material-symbols-outlined transition-transform duration-300 ${
            open
              ? "text-indigo-400 rotate-180"
              : "text-slate-400"
          }`}
        >
          keyboard_arrow_down
        </span>
      </div>

      {/* CONTENT */}
      {open && (
        <div className="px-6 pb-6 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
          {items.map((item) => (
            <ProgramCard
              key={item.title}
              title={item.title}
              total={String(item.total)}
              percent={`${item.percent}%`}
            />
          ))}
        </div>
      )}
    </div>
  );
}