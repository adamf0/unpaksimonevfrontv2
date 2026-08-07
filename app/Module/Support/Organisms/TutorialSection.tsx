"use client";

import { useState } from "react";
import { TUTORIAL_DATA, TutorialItem } from "../Attribut/SupportData";

export default function TutorialSection() {
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialItem | null>(null);

  return (
    <div className="space-y-6">
      {/* GRID TUTORIAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TUTORIAL_DATA.map((tut) => (
          <div
            key={tut.id}
            className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-[0_12px_32px_-4px_rgba(44,42,81,0.04)] overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all group"
          >
            {/* HERO THUMBNAIL CARD */}
            <div className={`p-6 bg-gradient-to-br ${tut.thumbnailGradient} text-white space-y-3 relative`}>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {tut.category}
                </span>
                <span className="text-[11px] font-bold text-white/80 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {tut.duration}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">
                  {tut.icon}
                </span>
              </div>
              <h3 className="text-base font-black tracking-tight leading-snug pt-1">
                {tut.title}
              </h3>
            </div>

            {/* CONTENT SUMMARY */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-outline leading-relaxed">
                {tut.summary}
              </p>

              <button
                onClick={() => setSelectedTutorial(tut)}
                className="w-full py-3 rounded-xl bg-surface-container-high hover:bg-primary hover:text-white font-bold text-xs flex items-center justify-center gap-2 text-on-surface transition-all group-hover:bg-primary group-hover:text-white"
              >
                <span className="material-symbols-outlined text-base">
                  play_circle
                </span>
                Lihat Tutorial Langkah demi Langkah
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL TUTORIAL VIEWER */}
      {selectedTutorial && (
        <div className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full p-6 lg:p-8 space-y-6 shadow-2xl border border-outline-variant/20 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">
                    {selectedTutorial.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-on-surface">
                    {selectedTutorial.title}
                  </h3>
                  <p className="text-xs text-outline font-medium">
                    Kategori: {selectedTutorial.category} • Estimasi: {selectedTutorial.duration}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTutorial(null)}
                className="p-2 rounded-xl hover:bg-surface-container-low text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase text-outline tracking-wider">
                Alur Langkah Kerja:
              </h4>

              <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant/20">
                {selectedTutorial.steps.map((st) => (
                  <div key={st.stepNumber} className="relative flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white font-black text-sm flex items-center justify-center shrink-0 z-10 shadow-md shadow-primary/20">
                      {st.stepNumber}
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-2xl flex-1 border border-outline-variant/10 space-y-1">
                      <h5 className="text-sm font-bold text-on-surface">
                        {st.title}
                      </h5>
                      <p className="text-xs text-outline leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-4 border-t border-outline-variant/10 text-right">
              <button
                onClick={() => setSelectedTutorial(null)}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
