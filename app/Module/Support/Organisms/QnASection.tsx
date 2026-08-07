"use client";

import { useState } from "react";
import { FAQ_DATA, FAQItem } from "../Attribut/SupportData";

export default function QnASection() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("semua");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  const categories = [
    { id: "semua", label: "Semua Pertanyaan" },
    { id: "umum", label: "Umum" },
    { id: "kuesioner", label: "Bank Soal & Kuesioner" },
    { id: "rekap", label: "Rekap & Export" },
    { id: "akses", label: "Hak Akses & Akun" },
  ];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchCat =
      selectedCategory === "semua" || item.category === selectedCategory;
    const matchSearch =
      search.trim() === "" ||
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* SEARCH BAR & CATEGORY BADGES */}
      <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-[0_12px_32px_-4px_rgba(44,42,81,0.04)] space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari pertanyaan seputar Simonev..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low px-4 py-3.5 pl-12 rounded-2xl text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent transition-all"
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">
            search
          </span>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-surface-container-low text-outline hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACCORDION FAQ LIST */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 rounded-3xl border border-outline-variant/10 text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-outline/40">
              quiz
            </span>
            <h4 className="text-base font-bold text-on-surface">
              Tidak Ada Pertanyaan Ditemukan
            </h4>
            <p className="text-xs text-outline">
              Coba kata kunci pencarian lain atau pilih kategori pertanyaan di atas.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-surface-container-low/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0">
                      Q
                    </span>
                    <h3 className="text-sm font-bold text-on-surface">
                      {faq.question}
                    </h3>
                  </div>
                  <span
                    className={`material-symbols-outlined text-outline transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-primary" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 text-xs leading-relaxed text-on-surface-variant border-t border-outline-variant/10 bg-surface-container-lowest animate-in fade-in duration-200 space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-xl bg-green-50 text-green-700 flex items-center justify-center font-black text-xs shrink-0">
                        A
                      </span>
                      <div className="pt-1 text-sm leading-relaxed text-on-surface font-normal">
                        {faq.answer}
                      </div>
                    </div>

                    {/* Step-by-Step Visual Illustrations */}
                    {faq.steps && faq.steps.length > 0 && (
                      <div className="ml-11 pt-2 border-t border-outline-variant/10 space-y-3">
                        <p className="text-[11px] font-black uppercase text-outline tracking-wider flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-primary">
                            format_list_numbered
                          </span>
                          Panduan Langkah demi Langkah:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {faq.steps.map((st) => (
                            <div
                              key={st.stepNumber}
                              className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/10 flex items-start gap-3"
                            >
                              <span className="w-6 h-6 rounded-full bg-primary text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                                {st.stepNumber}
                              </span>
                              <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-on-surface">
                                  {st.title}
                                </h4>
                                <p className="text-[11px] text-outline leading-snug">
                                  {st.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
