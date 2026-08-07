"use client";

import { useState } from "react";
import QnASection from "../Organisms/QnASection";
import PanduanSection from "../Organisms/PanduanSection";
import TutorialSection from "../Organisms/TutorialSection";

type TabType = "qna" | "panduan" | "tutorial";

export default function SupportTemplate() {
  const [activeTab, setActiveTab] = useState<TabType>("qna");

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-indigo-900 via-primary to-blue-800 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <span className="material-symbols-outlined text-[240px]">help_center</span>
        </div>

        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/20">
            Pusat Bantuan Simonev
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight pt-1">
            Ada yang Bisa Kami Bantu?
          </h1>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
            Temukan jawaban QnA, unduh buku panduan resmi, atau pelajari tutorial langkah demi langkah pengoperasian Simonev Unpak.
          </p>
        </div>
      </div>

      {/* TAB NAVIGATION BUTTONS */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab("qna")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === "qna"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-outline hover:text-on-surface hover:bg-surface-container-low"
          }`}
        >
          <span className="material-symbols-outlined text-base">quiz</span>
          Tanya Jawab (QnA)
        </button>

        <button
          onClick={() => setActiveTab("panduan")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === "panduan"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-outline hover:text-on-surface hover:bg-surface-container-low"
          }`}
        >
          <span className="material-symbols-outlined text-base">menu_book</span>
          Buku Panduan
        </button>

        <button
          onClick={() => setActiveTab("tutorial")}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === "tutorial"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-outline hover:text-on-surface hover:bg-surface-container-low"
          }`}
        >
          <span className="material-symbols-outlined text-base">play_circle</span>
          Tutorial Cara Pakai
        </button>
      </div>

      {/* ACTIVE TAB CONTENT */}
      {activeTab === "qna" && <QnASection />}
      {activeTab === "panduan" && <PanduanSection />}
      {activeTab === "tutorial" && <TutorialSection />}
    </div>
  );
}
