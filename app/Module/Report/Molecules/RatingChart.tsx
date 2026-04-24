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
  const total = data.reduce((a, b) => a + b.value, 0);

  const chartData = data.map((item) => ({
    rating: item.label,
    total: item.value,
    percent:
      total > 0 ? ((item.value / total) * 100).toFixed(1) : "0",
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
            top: 24,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <XAxis dataKey="rating" />
          <YAxis hide />

          <Tooltip
            formatter={(value: any, _n: any, props: any) => [
              `${value} responden`,
              `Rating ${props?.payload?.rating}`,
            ]}
          />

          <Bar dataKey="total" radius={[12, 12, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}

            <LabelList
              position="top"
              content={(props: any) => {
                const { x, y, width, value, index } = props;
                const row = chartData[index];

                return (
                  <text
                    x={x + width / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {value} ({row?.percent}%)
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