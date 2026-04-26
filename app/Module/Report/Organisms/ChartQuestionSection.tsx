"use client";

import { useMemo } from "react";
import { isEmpty } from "../../Common/Service/utility";
import PieChartCard from "../Molecules/PieChart";
import RatingChartCard from "../Molecules/RatingChart";

type Props = {
  full_path: string;
  data: any[];
};

export default function ChartQuestionSection({
  full_path,
  data,
}: Props) {
  console.log(data)
  // =========================
  // FILTER DATA
  // =========================
  const filtered = useMemo(() => {
    return data.filter(
      (d) => (d.FullPath || "").trim() === full_path.trim(),
    );
  }, [data, full_path]);

  const totalResponden = filtered.length;

  // =========================
  // CHECK RATING
  // =========================
  const isRating = useMemo(() => {
    return filtered.some(
      (item) =>
        String(item.JenisPilihan || "")
          .toLowerCase()
          .trim() === "rating",
    );
  }, [filtered]);

  // =========================
  // PIE DATA
  // =========================
  const { mainData, otherData } = useMemo(() => {
    const mainMap: Record<string, number> = {};
    const otherMap: Record<string, number> = {};

    for (const item of filtered) {
      const jenis = String(item.JenisPilihan || "")
        .toLowerCase()
        .trim();

      if (jenis === "rating") continue;

      const jawaban = String(item.Jawaban || "").trim();
      const freetext = String(item.FreeText || "").trim();

      if (isEmpty(freetext)) {
        if (!isEmpty(jawaban)) {
          mainMap[jawaban] = (mainMap[jawaban] || 0) + 1;
        }
      } else {
        otherMap[freetext] = (otherMap[freetext] || 0) + 1;
      }
    }

    return {
      mainData: Object.entries(mainMap).map(([label, value]) => ({
        label,
        value,
      })),
      otherData: Object.entries(otherMap).map(([label, value]) => ({
        label,
        value,
      })),
    };
  }, [filtered]);

  // =========================
  // RATING DISTRIBUTION
  // =========================
  const ratingData = useMemo(() => {
    const ratingMap: Record<number, number> = {};

    for (const item of filtered) {
      const jenis = String(item.JenisPilihan || "")
        .toLowerCase()
        .trim();

      if (jenis !== "rating") continue;

      const val = Number(item.Jawaban);

      if (!isNaN(val) && val >= 1 && val <= 5) {
        ratingMap[val] = (ratingMap[val] || 0) + 1;
      }
    }

    return [1, 2, 3, 4, 5].map((num) => ({
      label: String(num),
      value: ratingMap[num] || 0,
    }));
  }, [filtered]);

  // =========================
  // AVG TOTAL
  // =========================
  const avgRating = useMemo(() => {
    let total = 0;
    let count = 0;

    for (const item of filtered) {
      const jenis = String(item.JenisPilihan || "")
        .toLowerCase()
        .trim();

      if (jenis !== "rating") continue;

      const val = Number(item.Jawaban);

      if (!isNaN(val) && val >= 1 && val <= 5) {
        total += val;
        count++;
      }
    }

    return count ? Number((total / count).toFixed(2)) : 0;
  }, [filtered]);

  const percent = (avgRating / 5) * 100;

  // =========================
  // EMPTY
  // =========================
  if (totalResponden === 0) {
    return (
      <section className="py-6">
        <h3 className="text-2xl font-bold text-indigo-900">
          {full_path}
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          Tidak ada respon untuk kategori ini
        </p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      {/* TITLE */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-indigo-900">
          {full_path}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Total responden:{" "}
          <span className="font-semibold">
            {totalResponden}
          </span>
        </p>
      </div>

      {/* CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* NON RATING */}
        {!isRating && (
          <PieChartCard
            title="Distribusi Jawaban"
            mainData={mainData}
            otherData={otherData}
          />
        )}

        {/* RATING */}
        {isRating && (
          <>
            <RatingChartCard
              title="Distribusi Rating"
              data={ratingData}
            />

            {/* DETAIL */}
            <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm p-6">
              <h4 className="font-bold text-lg mb-5">
                Ringkasan Rating
              </h4>

              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((num) => {
                  const item =
                    ratingData.find(
                      (x) => Number(x.label) === num,
                    ) || {
                      label: String(num),
                      value: 0,
                    };

                  const pct = totalResponden
                    ? (item.value / totalResponden) * 100
                    : 0;

                  return (
                    <div key={num}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Rating {num}</span>

                        <span className="font-semibold">
                          {item.value} respon ({pct.toFixed(1)}%)
                        </span>
                      </div>

                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AVG */}
              <div className="mt-6 pt-5 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span>Rata-rata Total</span>

                  <span className="font-bold text-green-700">
                    {avgRating} / 5
                  </span>
                </div>

                <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                    }}
                  />
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  Persentase Kepuasan:{" "}
                  <span className="font-semibold text-green-700">
                    {percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}