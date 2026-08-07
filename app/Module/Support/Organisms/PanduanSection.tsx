"use client";

import toast from "react-hot-toast";
import { GUIDE_BOOKS } from "../Attribut/SupportData";

export default function PanduanSection() {
  const handleDownloadGuide = (title: string) => {
    toast.success(`Mengunduh ${title}...`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {GUIDE_BOOKS.map((guide) => (
          <div
            key={guide.id}
            className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-[0_12px_32px_-4px_rgba(44,42,81,0.04)] flex flex-col justify-between space-y-6 hover:border-primary/30 transition-all group"
          >
            <div className="space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">
                    menu_book
                  </span>
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-surface-container-high text-outline">
                  {guide.version}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base font-black text-on-surface tracking-tight group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-xs text-outline mt-2 leading-relaxed">
                  {guide.description}
                </p>
              </div>

              {/* Outline Chapters */}
              <div className="space-y-2 pt-2 border-t border-outline-variant/10">
                <p className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
                  Daftar Isi Utama:
                </p>
                <ul className="space-y-1.5">
                  {guide.chapters.map((ch, idx) => (
                    <li key={idx} className="text-xs text-on-surface-variant flex items-start gap-2">
                      <span className="text-primary font-bold text-[10px]">
                        {idx + 1}.
                      </span>
                      <span>{ch}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-outline-variant/10">
              <button
                onClick={() => handleDownloadGuide(guide.title)}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-all"
              >
                <span className="material-symbols-outlined text-base">
                  download
                </span>
                Unduh Buku Panduan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
