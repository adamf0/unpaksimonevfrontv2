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
    <div className="fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full p-6 lg:p-8 space-y-6 shadow-2xl border border-outline-variant/20 max-h-[90vh] overflow-y-auto">
        {/* MODAL HEADER */}
        <div className="text-center space-y-2 pb-4 border-b border-outline-variant/10">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <span className="material-symbols-outlined text-3xl font-black">
              task_alt
            </span>
          </div>
          <h3 className="text-xl font-black text-on-surface">
            Simulasi Pengisian Berhasil!
          </h3>
          <p className="text-xs text-outline font-medium">
            Hasil uji coba simulasi kuesioner <strong>{bankSoalTitle}</strong>
          </p>
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300">
            Sandbox Mode: Tidak Disimpan ke Database (1:1 Quesioner Player)
          </span>
        </div>

        {/* SUMMARY METRICS */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 text-center space-y-1">
            <p className="text-[10px] font-bold uppercase text-outline">Target Persona</p>
            <p className="text-xs font-black text-on-surface truncate">{persona.nama}</p>
            <p className="text-[10px] font-mono text-outline">{persona.identitas} ({persona.role.toUpperCase()})</p>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 text-center space-y-1">
            <p className="text-[10px] font-bold uppercase text-outline">Total Soal Dijawab</p>
            <p className="text-xl font-black text-primary">{totalQuestions} Soal</p>
          </div>
        </div>

        {/* DETAILS LIST */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase text-outline tracking-wider">
            Rincian Jawaban Simulasi:
          </h4>

          {answeredEntries.length === 0 ? (
            <p className="text-xs text-outline italic text-center py-4">
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
                    className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/10 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-outline">Q-ID: {qUuid}</span>
                      <span className="font-bold text-on-surface">Jawaban: {valStr || "-"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL ACTIONS */}
        <div className="pt-4 border-t border-outline-variant/10 flex items-center justify-between gap-3">
          <button
            onClick={onRestart}
            className="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            Ulangi Simulasi
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            Tutup Lembar Simulasi
          </button>
        </div>
      </div>
    </div>
  );
}
