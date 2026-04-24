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

      {/* LEGEND */}
      {!loading && !err && (
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
      {!loading && !err && (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />

              {/* TOTAL BAR (SOFT) */}
              <Bar dataKey="total" fill="#c7d2fe" radius={[6, 6, 0, 0]} />

              {/* LINES */}
              {keys.map(
                (key) =>
                  visible[key] && (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={colors[key]}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
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
