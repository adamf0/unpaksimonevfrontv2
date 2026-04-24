"use client";

import DistributionCard from "../Molecules/DistributionCard";
import DistributionChart from "../Molecules/DistributionChart";
import { FacultyItem } from "../Attribut/FacultyItem";

type Props = {
  data: FacultyItem[];
  err?: string | null;
  onReload?: () => void;
  loading: boolean;
};

export default function DistributionSection({
  data,
  err = null,
  onReload,
  loading = false,
}: Props) {
  const grandTotal = data.reduce(
    (sum, f) => sum + f.data.reduce((s, p) => s + p.total, 0),
    0,
  );

  const isEmpty = data.length == 0;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-indigo-900">
          Data Distribution
        </h3>
      </div>

      {err && (
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

      {!err && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* LEFT: CARD */}
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            {isEmpty ? (
              <div className="h-full bg-surface-container-lowest p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] flex items-center justify-center relative overflow-hidden">
                <div className="text-slate-400 text-sm text-center">
                  Tidak ada data yang tersedia
                </div>
              </div>
            ) : loading ? (
              <div className="flex-grow flex items-center justify-center min-h-[300px]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              data.map((item, index) => (
                <DistributionCard
                  key={index}
                  data={item}
                  grandTotal={grandTotal}
                />
              ))
            )}
          </div>

          {/* RIGHT: CHART */}
          <DistributionChart
            title="Distribusi Fakultas"
            subtitle="Akumulasi total responden"
            data={data}
            loading={loading}
          />
        </div>
      )}
    </section>
  );
}
