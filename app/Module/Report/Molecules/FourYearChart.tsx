"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartItem } from "../Attribut/ChartItem";

type Props = {
  data: ChartItem[];
  err?: string | null;
  onReload?: () => void;
  loading: boolean;
};

export default function FourYearChart({
  data,
  err = null,
  onReload,
  loading = false,
}: Props) {
  const [mode, setMode] = useState<"flat" | "normalize">("flat");

  const keys = useMemo(() => {
    if (!data.length) return [];
    return Object.keys(data[0]).filter((k) => k !== "year");
  }, [data]);

  const initialVisible = useMemo(() => {
    const obj: Record<string, boolean> = {};
    keys.forEach((k) => (obj[k] = true));
    return obj;
  }, [keys]);

  const [visible, setVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setVisible(initialVisible);
  }, [initialVisible]);

  const toggle = (key: string) => {
    setVisible((prev) => ({
      ...prev,
      [key]: !(prev?.[key] ?? true),
    }));
  };

  const palette = [
    "#6366f1",
    "#0ea5e9",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#84cc16",
    "#f97316",
    "#3b82f6",
    "#ec4899",
    "#a855f7",
  ];

  const colors = useMemo(() => {
    const map: Record<string, string> = {};
    keys.forEach((k, i) => {
      map[k] = palette[i % palette.length];
    });
    return map;
  }, [keys]);

  // Mode transformation: Flat vs Normalize
  const processedData = useMemo(() => {
    if (!data.length) return [];

    if (mode === "flat") {
      return data.map((d) => {
        const yearStr = String(d.year || "");
        let label = yearStr;
        if (yearStr.length === 6) {
          const y = yearStr.substring(0, 4);
          const s = yearStr.substring(4);
          label = s === "01" ? `${y} Ganjil` : s === "02" ? `${y} Genap` : `${y} (${s})`;
        }
        return {
          ...d,
          displayYear: label,
        };
      });
    }

    // Normalize per 1 year (Average semester scores for each year)
    const yearMap: Record<string, Record<string, { sum: number; count: number }>> = {};

    data.forEach((d) => {
      const yearStr = String(d.year || "");
      const yearKey = yearStr.length >= 4 ? yearStr.substring(0, 4) : yearStr || "Unknown";
      if (!yearMap[yearKey]) yearMap[yearKey] = {};

      keys.forEach((k) => {
        const val = Number(d[k]);
        if (!isNaN(val) && val > 0) {
          if (!yearMap[yearKey][k]) {
            yearMap[yearKey][k] = { sum: 0, count: 0 };
          }
          yearMap[yearKey][k].sum += val;
          yearMap[yearKey][k].count += 1;
        }
      });
    });

    return Object.entries(yearMap)
      .sort(([yA], [yB]) => yA.localeCompare(yB))
      .map(([year, catMap]) => {
        const obj: Record<string, any> = { year, displayYear: `Tahun ${year}` };
        keys.forEach((k) => {
          if (catMap[k] && catMap[k].count > 0) {
            obj[k] = Number((catMap[k].sum / catMap[k].count).toFixed(2));
          } else {
            obj[k] = 0;
          }
        });
        return obj;
      });
  }, [data, mode, keys]);

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="font-extrabold text-2xl text-indigo-900">4 Year Chart</h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === "flat"
              ? "Menampilkan tren skor rata-rata kategori per semester (Flat)"
              : "Menampilkan akumulasi rata-rata skor kategori per tahun (Normalize)"}
          </p>
        </div>

        {/* TABS: FLAT & NORMALIZE */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setMode("flat")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === "flat"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Flat
          </button>
          <button
            onClick={() => setMode("normalize")}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === "normalize"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Normalize
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {!loading && err && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 flex items-center justify-between">
          <span>{err}</span>
          <button
            onClick={onReload}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg"
          >
            Reload
          </button>
        </div>
      )}

      {!loading && !err && !data.length && (
        <div className="flex flex-col items-center justify-center min-h-[240px] text-center p-6 bg-surface-container-low/40 rounded-2xl border border-dashed border-outline-variant/60">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="font-bold text-on-surface text-base mb-1">
            4 Year Chart Belum Tersedia
          </p>
          <p className="text-sm text-outline max-w-md">
            Silakan pilih Bank Soal dan klik <strong>Terapkan Filter</strong> terlebih dahulu untuk menampilkan data grafik 4 tahun.
          </p>
        </div>
      )}

      {/* LEGEND */}
      {!loading && !err && data.length > 0 && (
        <div className="flex gap-4 text-xs font-bold mb-6 flex-wrap bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                visible[key]
                  ? "bg-white border-slate-200 shadow-2xs text-slate-800"
                  : "bg-slate-100 border-transparent text-slate-400 line-through"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{
                  backgroundColor: visible[key] ? colors[key] : "#d1d5db",
                }}
              />
              <span className="truncate max-w-[280px]">{key}</span>
            </button>
          ))}
        </div>
      )}

      {/* CHART */}
      {!loading && !err && data.length > 0 && (
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis dataKey="displayYear" tick={{ fontSize: 13, fontWeight: 600 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              />

              {/* BARS FOR EACH CATEGORY */}
              {keys.map(
                (key) =>
                  visible[key] && (
                    <Bar
                      key={key}
                      dataKey={key}
                      name={key}
                      fill={colors[key]}
                      radius={[6, 6, 0, 0]}
                    />
                  ),
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
