"use client";

import QuestionCard from "../Atoms/QuestionCard";
import { QuestionItem } from "../Attribut/QuestionItem";

type Props = {
  data?: QuestionItem[];
  err?: string | null;
  onReload?: () => void;
  loading: boolean;
};

export default function TopQuestionsSection({
  data = [],
  err = null,
  onReload,
  loading = false,
}: Props) {
  if (err && !loading)
    return (
      <section className="lg:col-span-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-extrabold text-2xl">
            Top 10 High-Engagement Questions
          </h3>
        </div>

        <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 flex items-center justify-between">
          <span>{err}</span>

          <button
            onClick={onReload}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg"
          >
            Reload
          </button>
        </div>
      </section>
    );

  if (!loading && data.length === 0) {
    return (
      <section className="lg:col-span-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline font-extrabold text-2xl">
            Top 10 High-Engagement Questions
          </h3>
        </div>

        {!err && (
          <div className="bg-surface-container-low rounded-3xl p-10 text-center border border-dashed border-outline-variant/30">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">
              inbox
            </span>

            <h4 className="text-lg font-bold text-slate-700">Tidak ada data</h4>

            <p className="text-sm text-slate-500 mt-1">
              Belum tersedia pertanyaan dengan engagement tertinggi.
            </p>
          </div>
        )}
      </section>
    );
  }

  const sorted = [...data].sort((a, b) => b.score - a.score).slice(0, 10);

  const rankingColor = [
    { color: "text-red-600" },
    { color: "text-orange-500" },
    { color: "text-yellow-500" },
    { color: "text-lime-500" },
    { color: "text-green-600" },
    { color: "text-emerald-600" },
    { color: "text-cyan-600" },
    { color: "text-sky-600" },
    { color: "text-blue-600" },
    { color: "text-indigo-600" },
  ];

  return (
    <section className="lg:col-span-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline font-extrabold text-2xl">
          Top 10 High-Engagement Questions
        </h3>
      </div>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        {loading ? (
          <div className="flex-grow flex items-center justify-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          sorted.map((item, index) => {
            const meta = rankingColor[index] || { color: "text-slate-600" };

            return (
              <QuestionCard
                key={index}
                rank={String(index + 1).padStart(2, "0")}
                title={item.title}
                category={item.category}
                score={String(item.score)}
                labelColor={meta.color}
              />
            );
          })
        )}
      </div>
    </section>
  );
}
