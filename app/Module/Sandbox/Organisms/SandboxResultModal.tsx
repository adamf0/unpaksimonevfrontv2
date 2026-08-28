"use client";

import { SandboxPersona } from "../Attribut/SandboxTypes";
import { AnswerState } from "../../Quesioner/Attribut/AnswerState";

interface Props {
  persona: SandboxPersona;
  bankSoalTitle: string;
  answers: AnswerState;
  onClose: () => void;
  onRestart: () => void;
}

export default function SandboxResultModal({
  persona,
  bankSoalTitle,
  answers,
  onClose,
  onRestart,
}: Props) {
  const answeredEntries = Object.entries(answers);
  const totalQuestions = answeredEntries.length;

  return (
    <div className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm flex items-center justify-center p-[clamp(0.75rem,2.5vw,1.5rem)] animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-[clamp(1rem,2.5vw,1.5rem)] max-w-2xl w-full p-[clamp(1rem,3vw,2rem)] space-y-[clamp(1rem,2vw,1.5rem)] shadow-2xl border border-outline-variant/20 max-h-[90vh] overflow-y-auto">
        {/* MODAL HEADER */}
        <div className="text-center space-y-2 pb-[clamp(0.75rem,2vw,1rem)] border-b border-outline-variant/10">
          <div className="w-[clamp(3rem,8vw,4rem)] h-[clamp(3rem,8vw,4rem)] rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <span className="material-symbols-outlined text-[clamp(1.5rem,4vw,2rem)] font-black">
              task_alt
            </span>
          </div>
          <h3 className="text-[clamp(1.125rem,2.5vw,1.25rem)] font-black text-on-surface">
            Simulasi Pengisian Berhasil!
          </h3>
          <p className="text-[clamp(0.7rem,1.4vw,0.75rem)] text-outline font-medium">
            Hasil uji coba simulasi kuesioner <strong>{bankSoalTitle}</strong>
          </p>
          <span className="inline-block px-3 py-1 rounded-full text-[clamp(0.55rem,0.9vw,0.625rem)] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300">
            Sandbox Mode: Tidak Disimpan ke Database (1:1 Quesioner Player)
          </span>
        </div>

        {/* SUMMARY METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(0.5rem,1.5vw,1rem)]">
          <div className="bg-surface-container-low p-[clamp(0.75rem,2vw,1rem)] rounded-2xl border border-outline-variant/10 text-center space-y-1">
            <p className="text-[clamp(0.6rem,1vw,0.625rem)] font-bold uppercase text-outline">Target Persona</p>
            <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-black text-on-surface truncate">{persona.nama}</p>
            <p className="text-[clamp(0.6rem,1vw,0.625rem)] font-mono text-outline">{persona.identitas} ({persona.role.toUpperCase()})</p>
          </div>

          <div className="bg-surface-container-low p-[clamp(0.75rem,2vw,1rem)] rounded-2xl border border-outline-variant/10 text-center space-y-1">
            <p className="text-[clamp(0.6rem,1vw,0.625rem)] font-bold uppercase text-outline">Total Soal Dijawab</p>
            <p className="text-[clamp(1.125rem,3vw,1.25rem)] font-black text-primary">{totalQuestions} Soal</p>
          </div>
        </div>

        {/* DETAILS LIST */}
        <div className="space-y-3">
          <h4 className="text-[clamp(0.65rem,1vw,0.75rem)] font-black uppercase text-outline tracking-wider">
            Rincian Jawaban Simulasi:
          </h4>

          {answeredEntries.length === 0 ? (
            <p className="text-[clamp(0.7rem,1.4vw,0.75rem)] text-outline italic text-center py-4">
              Belum ada pertanyaan yang dijawab selama simulasi.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {answeredEntries.map(([qUuid, ans], idx) => {
                let valStr = "";
                if (typeof ans.value === "object" && ans.value !== null) {
                  if (Array.isArray(ans.value)) {
                    valStr = ans.value.map((v: any) => v.label).join(", ");
                  } else {
                    valStr = (ans.value as any).label || "";
                  }
                } else if (ans.value) {
                  valStr = String(ans.value);
                }

                return (
                  <div
                    key={qUuid || idx}
                    className="bg-surface-container-low p-[clamp(0.625rem,1.5vw,0.875rem)] rounded-xl border border-outline-variant/10 space-y-1 text-[clamp(0.7rem,1.4vw,0.75rem)]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-mono text-[clamp(0.6rem,1vw,0.625rem)] text-outline truncate">Q-ID: {qUuid}</span>
                      <span className="font-bold text-on-surface">Jawaban: {valStr || "-"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL ACTIONS */}
        <div className="pt-4 border-t border-outline-variant/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            onClick={onRestart}
            className="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-[clamp(0.7rem,1.4vw,0.75rem)] transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            Ulangi Simulasi
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-[clamp(0.7rem,1.4vw,0.75rem)] hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            Tutup Lembar Simulasi
          </button>
        </div>
      </div>
    </div>
  );
}
