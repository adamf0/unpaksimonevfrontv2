"use client";

import { StepType } from "../Hook/useSandbox";
import { SandboxPersona } from "../Attribut/SandboxTypes";
import QuestionerLayout from "../../Quesioner/Template/QuestionerLayout";
import QuestionForm from "../../Quesioner/Organisms/QuestionForm";
import NotFound from "../../Quesioner/Organisms/NotFound";
import { Question } from "../../Quesioner/Attribut/Question";
import { AnswerState } from "../../Quesioner/Attribut/AnswerState";
import { Option } from "../../Quesioner/Attribut/Option";

interface Props {
  persona: SandboxPersona;
  bankSoalTitle: string;
  activeStep: StepType;
  availableSteps: StepType[];
  currentStepIndex: number;
  isLastStep: boolean;

  simulationDateStr: string;
  onSimulationDateChange: (dateStr: string) => void;

  onNextStep: () => void;
  onPrevStep: () => void;

  questions: Question[];
  answers: AnswerState;
  errors: Record<string, string>;

  isSelected: (qid: string, option: Option, type: "radio" | "multiple") => boolean;
  handleChange: (qid: string, option: Option, type: "radio" | "multiple") => void;
  handleExtraChange: (qid: string, optVal: string, val: string) => void;
  isBrokenQuestion: (q: Question) => boolean;
  setAnswers: React.Dispatch<React.SetStateAction<AnswerState>>;

  onSimulateSubmit: () => void;
  onReset: () => void;
}

export default function SandboxQuestionnairePlayer({
  persona,
  bankSoalTitle,
  activeStep,
  availableSteps,
  currentStepIndex,
  isLastStep,
  simulationDateStr,
  onSimulationDateChange,
  onNextStep,
  onPrevStep,
  questions,
  answers,
  errors,
  isSelected,
  handleChange,
  handleExtraChange,
  isBrokenQuestion,
  setAnswers,
  onSimulateSubmit,
  onReset,
}: Props) {
  const isAllOutOfRange = availableSteps.length === 0;

  const shiftDateByDays = (days: number) => {
    const curr = new Date(simulationDateStr || new Date());
    curr.setDate(curr.getDate() + days);
    onSimulationDateChange(curr.toISOString().split("T")[0]);
  };

  const resetToToday = () => {
    onSimulationDateChange(new Date().toISOString().split("T")[0]);
  };

  return (
    <div className="space-y-[clamp(1rem,2.5vw,1.5rem)]">
      {/* SANDBOX BANNER WITH LIVE DATE SHIFT CONTROL */}
      <div className="bg-amber-500/10 border-2 border-amber-500/30 p-[clamp(0.875rem,2.5vw,1.25rem)] rounded-[clamp(1rem,2.5vw,1.5rem)] space-y-[clamp(0.75rem,2vw,1rem)] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[clamp(0.75rem,2vw,1rem)] min-w-0">
          <div className="flex flex-col min-[360px]:flex-row items-start min-[360px]:items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] min-w-0">
            <div className="w-[clamp(2.25rem,5vw,2.5rem)] h-[clamp(2.25rem,5vw,2.5rem)] rounded-xl bg-amber-500 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[clamp(1.125rem,2.5vw,1.25rem)]">science</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2 py-0.5 rounded-full text-[clamp(0.5rem,0.8vw,0.625rem)] font-black uppercase bg-amber-500 text-white shrink-0">
                  SANDBOX MODE
                </span>
                <h3 className="text-[clamp(0.75rem,1.4vw,0.875rem)] font-bold text-amber-900 dark:text-amber-200">
                  Simulasi Instrumen Kuesioner
                </h3>
              </div>
              <p className="text-[clamp(0.65rem,1.3vw,0.75rem)] text-amber-800 dark:text-amber-300 mt-1 break-words leading-relaxed">
                Target: <strong>{persona.nama}</strong> ({persona.role.toUpperCase()} • ID: {persona.identitas}) | {persona.namaFakultas} - {persona.namaProdi}
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-[clamp(0.7rem,1.4vw,0.75rem)] font-bold text-on-surface border border-outline-variant/10 shadow-sm transition-all shrink-0 flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm shrink-0">
              tune
            </span>
            <span>Ubah Konfigurasi Target</span>
          </button>
        </div>

        {/* CONTROLS UNTUK PERGESERAN TANGGAL SIMULASI */}
        <div className="pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3 min-w-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0 w-full sm:w-auto">
            <span className="material-symbols-outlined text-base text-amber-600 shrink-0">
              edit_calendar
            </span>
            <span className="text-[clamp(0.65rem,1.3vw,0.75rem)] font-extrabold text-amber-900 dark:text-amber-200 uppercase tracking-wider shrink-0">
              Simulasi Tanggal Hari Ini:
            </span>
            <input
              type="date"
              value={simulationDateStr}
              onChange={(e) => onSimulationDateChange(e.target.value)}
              className="w-full sm:w-auto min-w-[130px] max-w-full bg-surface-container-lowest px-3 py-1.5 rounded-xl text-[clamp(0.7rem,1.3vw,0.8rem)] font-bold text-on-surface border border-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>
        </div>
      </div>

      {/* IF ALL STEPS OUT OF RANGE: DISPLAY NOT FOUND */}
      {isAllOutOfRange ? (
        <div className="bg-surface p-[clamp(1.25rem,4vw,2rem)] rounded-[clamp(1rem,2.5vw,1.5rem)] border border-outline-variant/10 shadow-lg space-y-6 text-center">
          <NotFound />
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-[clamp(0.7rem,1.4vw,0.75rem)] font-semibold">
            Form Kuesioner Tidak Tersedia pada Tanggal Simulasi ({simulationDateStr}). Seluruh jadwal kelompok pertanyaan LPPM / Fakultas / Prodi berada di luar rentang tanggal aktif.
          </div>
        </div>
      ) : (
        /* 1:1 QUESTIONER LAYOUT & QUESTION FORM */
        <div className="rounded-[clamp(1rem,2.5vw,1.5rem)] overflow-hidden border border-outline-variant/10 shadow-lg bg-surface">
          <QuestionerLayout
            activeStep={activeStep}
            onNextStep={onNextStep}
          >
            <QuestionForm
              filteredData={questions}
              answers={answers}
              errors={errors}
              toast={null}
              loading={false}
              isBrokenQuestion={isBrokenQuestion}
              isSelected={isSelected}
              handleChange={handleChange}
              handleExtraChange={handleExtraChange}
              setAnswers={setAnswers}
              handleSubmit={(e) => {
                e.preventDefault();
                onNextStep();
              }}
            />

            {/* STEP NAVIGATION ACTIONS */}
            <div className="mt-10 pt-6 border-t border-outline-variant/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <button
                disabled={currentStepIndex <= 0}
                onClick={onPrevStep}
                className="px-6 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-[clamp(0.7rem,1.4vw,0.75rem)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Langkah Sebelumnya
              </button>

              {!isLastStep ? (
                <button
                  onClick={onNextStep}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-[clamp(0.7rem,1.4vw,0.75rem)] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/20"
                >
                  Langkah Selanjutnya
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              ) : (
                <button
                  onClick={onSimulateSubmit}
                  className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-[clamp(0.7rem,1.4vw,0.75rem)] uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  Selesai (Simulasikan Submit)
                </button>
              )}
            </div>
          </QuestionerLayout>
        </div>
      )}
    </div>
  );
}
