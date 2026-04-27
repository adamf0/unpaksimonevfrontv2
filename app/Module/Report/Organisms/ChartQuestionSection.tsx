"use client";

import { useMemo } from "react";
import PieChartCard from "../Molecules/PieChart";
import RatingChartCard from "../Molecules/RatingChart";

type JawabanItem = {
  label: string;
  total: number;
  data?: any[];
};

type PertanyaanItem = {
  title: string;
  jenispilihan: string;
  jawaban: JawabanItem[];
};

type Props = {
  full_path: string;
  data: PertanyaanItem[];
};

export default function ChartQuestionSection({
  full_path,
  data,
}: Props) {
  const questions = useMemo(() => data ?? [], [data]);

  const normalize = (s: string) =>
    (s || "-").trim().toLowerCase();

  const totalResponden = useMemo(() => {
    return questions.reduce((acc, item) => {
      return (
        acc +
        (item.jawaban?.reduce((a, j) => a + (j.total || 0), 0) || 0)
      );
    }, 0);
  }, [questions]);

  const ratingQuestions = useMemo(
    () => questions.filter((q) => q.jenispilihan === "rating"),
    [questions]
  );

  const nonRatingQuestions = useMemo(
    () => questions.filter((q) => q.jenispilihan !== "rating"),
    [questions]
  );

  const isRating = ratingQuestions.length > 0;

  // =========================
  // PIE DATA (1 LOOP OPTIMIZED)
  // =========================
  const { mainData, otherData } = useMemo(() => {
    const mainMap: Record<string, number> = {};
    const otherMap: Record<string, number> = {};

    const flat = nonRatingQuestions.flatMap((q) =>
      (q.jawaban || []).map((j) => ({
        label: j.label,
        total: j.total,
        data: j.data || [],
      }))
    );

    for (const item of flat) {
      const key = normalize(item.label);

      if (key === "lainnya") {
        const texts = item.data.map((d: any) =>
          normalize(d.FreeText)
        );

        texts.forEach((text) => {
          otherMap[text] =
            (otherMap[text] || 0) + 1;
        });
      } else {
        mainMap[key] =
          (mainMap[key] || 0) + item.total;
      }
    }

    return {
      mainData: Object.entries(mainMap).map(
        ([label, value]) => ({
          label,
          value,
        })
      ),

      otherData: Object.entries(otherMap).map(
        ([label, value]) => ({
          label,
          value,
        })
      ),
    };
  }, [nonRatingQuestions]);

  // =========================
  // AVG GLOBAL (UNCHANGED)
  // =========================
  const avgRating = useMemo(() => {
    let total = 0;
    let count = 0;

    for (const q of ratingQuestions) {
      for (const j of q.jawaban || []) {
        const val = Number(j.label);
        if (!isNaN(val)) {
          total += val * j.total;
          count += j.total;
        }
      }
    }

    return count ? Number((total / count).toFixed(2)) : 0;
  }, [ratingQuestions]);

  const percent = (avgRating / 5) * 100;

  if (!questions.length) {
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
      {/* HEADER */}
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
        {isRating &&
          ratingQuestions.map((q, idx) => {
            const ratingData = [1, 2, 3, 4, 5].map((n) => {
              const found = q.jawaban?.find(
                (j) => Number(j.label) === n
              );

              return {
                label: String(n),
                value: found?.total || 0,
              };
            });

            return (
              <RatingChartCard
                key={idx}
                title={`Distribusi Rating - ${q.title}`}
                data={ratingData}
              />
            );
          })}

        {/* RINGKASAN */}
        {isRating && (
          <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm p-6">
            <h4 className="font-bold text-lg mb-5">
              Ringkasan Rating
            </h4>

            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((num) => {
                const item = ratingQuestions
                  .flatMap((q) => q.jawaban)
                  .filter((j) => j.label === String(num))
                  .reduce((acc, curr) => acc + curr.total, 0);

                const pct = totalResponden
                  ? (item / totalResponden) * 100
                  : 0;

                return (
                  <div key={num}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Rating {num}</span>
                      <span className="font-semibold">
                        {item} respon ({pct.toFixed(1)}%)
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-5 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span>Rata-rata Total</span>
                <span className="font-bold text-green-700">
                  {avgRating} / 5
                </span>
              </div>

              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}