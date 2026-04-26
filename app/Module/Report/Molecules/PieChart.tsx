"use client";

import { useMemo, useState } from "react";
import {
  PieChart as PC,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Item = {
  label: string;
  value: number;
};

type Props = {
  title?: string;
  subtitle?: string;
  mainData?: Item[];
  otherData?: Item[];
  loading?: boolean;
};

export default function PieChart({
  title = "",
  subtitle = "",
  mainData = [],
  otherData = [],
  loading = false,
}: Props) {
  const [showOther, setShowOther] = useState(false);

  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#06b6d4",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#14b8a6",
    "#84cc16",
  ];

  const {
    chartData,
    total,
    hasData,
    otherTotal,
    cleanOther,
  } = useMemo(() => {
    const cleanMain = (mainData ?? []).filter(
      (x) => x.value > 0
    );

    const cleanOther = (otherData ?? []).filter(
      (x) => x.value > 0
    );

    const otherTotal = cleanOther.reduce(
      (sum, item) => sum + item.value,
      0
    );

    const finalData =
      otherTotal > 0
        ? [
            ...cleanMain,
            {
              label: "Lainnya",
              value: otherTotal,
            },
          ]
        : cleanMain;

    const total = finalData.reduce(
      (sum, item) => sum + item.value,
      0
    );

    return {
      chartData: finalData,
      total,
      otherTotal,
      cleanOther,
      hasData: total > 0,
    };
  }, [mainData, otherData]);

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_12px_32px_-4px_rgba(44,42,81,0.06)] flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

      <h4 className="font-bold text-on-surface text-lg mb-2 leading-tight pr-8 relative z-10">
        {title}
      </h4>

      <p className="text-sm text-on-surface/60 mb-6 relative z-10">
        {subtitle} • Total:{" "}
        <span className="font-semibold">
          {total}
        </span>
      </p>

      {loading && (
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {!loading && !hasData && (
        <div className="flex-grow flex items-center justify-center text-sm text-on-surface/60">
          Data tidak tersedia
        </div>
      )}

      {!loading && hasData && (
        <>
          <div className="flex-grow min-h-[380px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PC>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="44%"
                  outerRadius={110}
                  innerRadius={58}
                  paddingAngle={3}
                  label={({ percent }) =>
                    percent &&
                    percent > 0.05
                      ? `${(
                          percent * 100
                        ).toFixed(0)}%`
                      : ""
                  }
                  labelLine={false}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        colors[
                          index %
                            colors.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value: any) => [
                    `${Number(value ?? 0)}`,
                    "Jumlah",
                  ]}
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: 16,
                    fontSize: 13,
                    maxHeight: 90,
                    overflowY: "auto",
                  }}
                />
              </PC>
            </ResponsiveContainer>
          </div>

          {otherTotal > 0 && (
            <div className="mt-4 border-t border-outline/10 pt-4">
              <button
                onClick={() =>
                  setShowOther(!showOther)
                }
                className="text-sm font-semibold text-primary hover:opacity-80 transition"
              >
                {showOther
                  ? "Sembunyikan detail lainnya"
                  : `Lihat ${cleanOther.length} jawaban lainnya`}
              </button>

              {showOther && (
                <div className="mt-4 space-y-3 max-h-[260px] overflow-y-auto pr-2">
                  {cleanOther
                    .sort(
                      (a, b) =>
                        b.value - a.value
                    )
                    .map(
                      (
                        item,
                        index
                      ) => {
                        // FIX:
                        // gunakan otherTotal, bukan total chart
                        const percent =
                          otherTotal > 0
                            ? (item.value /
                                otherTotal) *
                              100
                            : 0;

                        return (
                          <div
                            key={index}
                            className="space-y-1"
                          >
                            <div className="flex justify-between text-sm gap-3">
                              <span className="truncate text-on-surface/80">
                                {
                                  item.label
                                }
                              </span>

                              <span className="font-medium whitespace-nowrap">
                                {
                                  item.value
                                }{" "}
                                (
                                {percent.toFixed(
                                  1
                                )}
                                %)
                              </span>
                            </div>

                            <div className="w-full h-2 rounded-full bg-primary/10 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container"
                                style={{
                                  width: `${percent}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}