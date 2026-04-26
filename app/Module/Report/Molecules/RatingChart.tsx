"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import ChartCard from "./ChartCard";

type Props = {
  title: string;
  data: {
    label: string;
    value: number;
  }[];
  loading?: boolean;
};

export default function RatingChart({
  title,
  data = [],
  loading = false,
}: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = data.map((item) => ({
    rating: item.label,
    total: item.value,
    percent: total > 0 ? (item.value / total) * 100 : 0,
  }));

  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#16a34a",
  ];

  const empty = total === 0;

  return (
    <ChartCard
      title={title}
      subtitle={
        <>
          Total Responden:{" "}
          <span className="font-semibold">{total}</span>
        </>
      }
      loading={loading}
      empty={empty}
      minHeight="320px"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 36,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <XAxis dataKey="rating" />
          <YAxis hide />

          <Tooltip
            formatter={(value: any, _name: any, props: any) => [
              `${value} responden`,
              `Rating ${props?.payload?.rating}`,
            ]}
          />

          <Bar
            dataKey="total"
            radius={[12, 12, 0, 0]}
            isAnimationActive={false}
          >
            {chartData.map((_, i) => (
              <Cell
                key={i}
                fill={colors[i % colors.length]}
              />
            ))}

            <LabelList
              position="top"
              content={(props: any) => {
                const {
                  x = 0,
                  y = 0,
                  width = 0,
                  value = 0,
                } = props;

                if (value <= 0) return null;

                // cari data berdasarkan posisi bar
                const row = chartData.find(
                  (_, i) =>
                    Math.abs(
                      x -
                        (i *
                          ((560 - 20) / chartData.length) +
                          20)
                    ) < 60
                );

                const percent = row?.percent ?? 0;

                return (
                  <text
                    x={x + width / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill="#111827"
                  >
                    {value} ({percent.toFixed(1)}%)
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}