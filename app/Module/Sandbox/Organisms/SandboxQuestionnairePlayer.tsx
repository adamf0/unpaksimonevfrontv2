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
    <div className="space-y-6">
      {/* SANDBOX BANNER WITH LIVE DATE SHIFT CONTROL */}
      <div className="bg-amber-500/10 border-2 border-amber-500/30 p-5 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-xl">science</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white">
                  SANDBOX MODE (1:1 QUESTIONNAIRE PLAYER)
                </span>
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Simulasi Instrumen Kuesioner
                </h3>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                Target: <strong>{persona.nama}</strong> ({persona.role.toUpperCase()} • ID: {persona.identitas}) | {persona.namaFakultas} - {persona.namaProdi}
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-xs font-bold text-on-surface border border-outline-variant/10 shadow-sm transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-sm align-middle mr-1">
              tune
            </span>
            Ubah Konfigurasi Target
          </button>
        </div>

        {/* CONTROLS UNTUK PERGESERAN TANGGAL SIMULASI */}
        <div className="pt-3 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-amber-600">
              edit_calendar
            </span>
            <span className="text-xs font-extrabold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
              Simulasi Tanggal Hari Ini:
            </span>
            <input
              type="date"
              value={simulationDateStr}
              onChange={(e) => onSimulationDateChange(e.target.value)}
              className="bg-surface-container-lowest px-3 py-1.5 rounded-xl text-xs font-bold text-on-surface border border-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>
        </div>
      </div>

      {/* IF ALL STEPS OUT OF RANGE: DISPLAY NOT FOUND */}
      {isAllOutOfRange ? (
        <div className="bg-surface p-8 rounded-3xl border border-outline-variant/10 shadow-lg space-y-6 text-center">
          <NotFound />
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
            Form Kuesioner Tidak Tersedia pada Tanggal Simulasi ({simulationDateStr}). Seluruh jadwal kelompok pertanyaan LPPM / Fakultas / Prodi berada di luar rentang tanggal aktif.
          </div>
        </div>
      ) : (
        /* 1:1 QUESTIONER LAYOUT & QUESTION FORM */
        <div className="rounded-3xl overflow-hidden border border-outline-variant/10 shadow-lg bg-surface">
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

            {/* STEP NAVIGATION ACTIONS (NEXT BECOMES SELESAI WHEN NO MORE STEPS WITH QUESTIONS EXIST) */}
            <div className="mt-10 pt-6 border-t border-outline-variant/10 flex items-center justify-between gap-4">
              <button
                disabled={currentStepIndex <= 0}
                onClick={onPrevStep}
                className="px-6 py-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Langkah Sebelumnya
              </button>

              {!isLastStep ? (
                <button
                  onClick={onNextStep}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-primary/20"
                >
                  Langkah Selanjutnya
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              ) : (
                <button
                  onClick={onSimulateSubmit}
                  className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
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
