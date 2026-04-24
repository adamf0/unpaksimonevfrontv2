"use client";

import { useMemo } from "react";
import {
  PieChart as PC,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FacultyItem } from "../Attribut/FacultyItem";
import { colors } from "../../Common/Service/utility";

type Props = {
  title?: string;
  subtitle?: string;
  data?: FacultyItem[];
  loading?: boolean;
};

export default function DistributionChart({
  title = "Distribusi",
  subtitle = "Berdasarkan total responden",
  data = [],
  loading = false,
}: Props) {
  const { chartData, total, hasData } = useMemo(() => {
    const aggregated = data.map((f) => {
      const totalPerFaculty = f.data.reduce(
        (sum, p) => sum + (p.total ?? 0),
        0,
      );

      return {
        label: f.title,
        value: totalPerFaculty,
      };
    });

    const sorted = aggregated
      .filter((x) => x.value > 0)
      .sort((a, b) => b.value - a.value);

    const total = sorted.reduce((s, i) => s + i.value, 0);

    return {
      chartData: sorted,
      total,
      hasData: total > 0,
    };
  }, [data]);

  return (
    <div
      className="
      bg-surface-container-lowest 
      p-6 sm:p-8 
      rounded-2xl sm:rounded-[2rem]
      flex flex-col h-full relative overflow-hidden
    "
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

      {/* HEADER */}
      <h4 className="font-bold text-lg mb-2 relative z-10">{title}</h4>

      <p className="text-sm text-on-surface/60 mb-6 relative z-10">
        {subtitle} • Total: <span className="font-semibold">{total}</span>
      </p>

      {/* LOADING */}
      {loading && (
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {/* EMPTY */}
      {!loading && !hasData && (
        <div className="flex-grow flex items-center justify-center min-h-[300px] text-slate-400 text-sm text-center">
          Data tidak tersedia
        </div>
      )}

      {/* CHART */}
      {!loading && hasData && (
        <div className="flex-grow min-h-[420px] sm:min-h-[480px]">
          <ResponsiveContainer width="100%" height="100%">
            <PC>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="45%"
                outerRadius="75%" // 🔥 lebih besar & responsif
                innerRadius="45%"
                paddingAngle={3}
                label={({ percent }) =>
                  percent && percent > 0.05
                    ? `${(percent * 100).toFixed(0)}%`
                    : ""
                }
                labelLine={false}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>

              <Tooltip />

              {/* legend jangan ganggu chart */}
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  fontSize: 13,
                  marginTop: 12,
                }}
              />
            </PC>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
