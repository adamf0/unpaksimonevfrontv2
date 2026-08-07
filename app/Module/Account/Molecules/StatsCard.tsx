"use client";

import Card from "../../Common/Components/Atoms/Card";
import { useAccountContext } from "../Context/AccountProvider";

interface StatsCardProps {
  total?: number;
  loading?: boolean;
}

export function StatsCard({ total: propTotal, loading: propLoading }: StatsCardProps = {}) {
  const accountContext = useAccountContext();
  const total = propTotal ?? accountContext?.state?.total ?? 0;
  const loading = propLoading ?? accountContext?.state?.loading ?? false;

  return (
    <Card className="bg-gradient-to-br from-primary to-[#2c2a51] rounded-xl p-8 text-on-primary indigo-shadow relative overflow-hidden group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      <div className="relative z-10">
        <p className="text-primary-container font-bold text-xs uppercase tracking-widest mb-4">
          Live Statistics
        </p>
        <h4 className="text-5xl font-black mb-4">
          {loading ? (
            <span className="inline-block animate-pulse opacity-70">...</span>
          ) : (
            total
          )}
        </h4>
        <p className="text-lg font-medium leading-tight opacity-90">
          Total Access: {total} administrative users across all departments.
        </p>
      </div>
    </Card>
  );
}
