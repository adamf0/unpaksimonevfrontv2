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
  Line,
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
  const keys = useMemo(() => {
    if (!data.length) return [];
    return Object.keys(data[0]).filter((k) => k !== "year");
  }, [data]);

  // ✅ langsung init dari memo (tanpa flicker)
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

  // 🎨 AUTO COLOR (NO LIMIT KEY)
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
  ];

  const colors = useMemo(() => {
    const map: Record<string, string> = {};
    keys.forEach((k, i) => {
      map[k] = palette[i % palette.length];
    });
    return map;
  }, [keys]);

  const processedData = useMemo(() => {
    return data.map((d) => {
      const total = keys.reduce((sum, k) => sum + Number(d[k] || 0), 0);
      return { ...d, total };
    });
  }, [data, keys]);

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
      <h3 className="font-extrabold text-2xl mb-6">4 Year Chart</h3>

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
        <div className="flex gap-4 text-xs font-bold mb-4 flex-wrap">
          {keys.map((key) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className="flex items-center gap-2"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: visible[key] ? colors[key] : "#d1d5db",
                }}
              />
              {key}
            </button>
          ))}
        </div>
      )}

      {/* CHART */}
      {!loading && !err && data.length > 0 && (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis dataKey="year" />
              <YAxis domain={keys.includes("mahasiswa") ? [0, "auto"] : [0, 5]} />
              <Tooltip />

              {/* TOTAL BAR (SOFT) ONLY FOR RESPONDENT COUNTS */}
              {keys.includes("mahasiswa") && (
                <Bar dataKey="total" fill="#c7d2fe" radius={[6, 6, 0, 0]} />
              )}

              {/* BARS */}
              {keys.map(
                (key) =>
                  visible[key] && (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={colors[key]}
                      radius={[4, 4, 0, 0]}
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
