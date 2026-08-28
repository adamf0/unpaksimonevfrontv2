"use client";

import { useMemo, useState } from "react";

import QuestionerLayout from "../../Quesioner/Template/QuestionerLayout";
import RatingScale from "../../Quesioner/Molecules/RatingScale";

import { Question } from "../../Quesioner/Attribut/Question";
import { AnswerState } from "../../Quesioner/Attribut/AnswerState";
import { Option } from "../../Quesioner/Attribut/Option";
import { useTemplatePreview } from "../Hook/useTemplatePreview";
import { TemplatePertanyaanWithAnswareDefault } from "../Attribut/TemplatePertanyaanWithAnswareDefault";

/* =========================================================
   MAPPER
========================================================= */

function getStepForQuestion(item: any): "admin" | "fakultas" | "prodi" {
  const cb = String(item.CreatedBy || item.created_by || "").toLowerCase().trim();
  const cbRef = String(item.CreatedByRef || item.created_by_ref || "").toLowerCase().trim();
  const fak = String(item.Fakultas || item.fakultas || "").trim();
  const prodi = String(item.Prodi || item.prodi || "").trim();

  if (prodi !== "" || cb.includes("prodi")) return "prodi";
  if (fak !== "" || cb.includes("fakultas")) return "fakultas";

  return "admin";
}

function mapQuestions(
  RAW_DATA: TemplatePertanyaanWithAnswareDefault[],
  step: "admin" | "fakultas" | "prodi",
): Question[] {
  return RAW_DATA.filter(
    (item: any) =>
      (item.Status === "active" || !item.Status) &&
      getStepForQuestion(item) === step,
  ).map((item: any) => ({
    id: item.UUID,
    uuid: item.UUID,

    pertanyaan: item.Pertanyaan,

    required: item.Required === 1,

    created: step,

    createdBy: "preview",

    tipe: item.JenisPilihan as "radio" | "multiple" | "rating",

    fullpath: item.FullPath,

    pilihan: [...item.ListJawaban]
      .sort((a: any, b: any) => b.Nilai - a.Nilai)
      .map((j: any) => ({
        label: j.Jawaban,
        value: j.UUID,
        freetext: j.IsFreeText === 1,
      })),
  }));
}
/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TemplateQuestionPreview() {
  // ========================================================
  // STEP
  // ========================================================

  const [activeStep, setActiveStep] = useState<"admin" | "fakultas" | "prodi">(
    "admin",
  );
  const { previewData } = useTemplatePreview();

  // ========================================================
  // QUESTIONS
  // ========================================================

  const questions = useMemo(
    () => mapQuestions(previewData, activeStep),
    [previewData, activeStep],
  );

  // ========================================================
  // ANSWERS
  // ========================================================

  const [answers, setAnswers] = useState<AnswerState>({});

  function handleRadio(qid: string, option: Option) {
    setAnswers((prev) => ({
      ...prev,
      [qid]: {
        value: option,
      },
    }));
  }

  function handleMultiple(qid: string, option: Option) {
    setAnswers((prev) => {
      const current = prev[qid]?.value;

      const arr: Option[] = Array.isArray(current) ? (current as Option[]) : [];

      const exists = arr.some((x) => x.value === option.value);

      return {
        ...prev,
        [qid]: {
          value: exists
            ? arr.filter((x) => x.value !== option.value)
            : [...arr, option],
        },
      };
    });
  }

  function isOption(val: unknown): val is Option {
    return typeof val === "object" && val !== null && "value" in val;
  }

  function isSelected(
    qid: string,
    option: Option,
    type: "radio" | "multiple" | "rating",
  ) {
    const current = answers[qid]?.value;

    if (type === "multiple") {
      return (
        Array.isArray(current) &&
        current.some((x) => isOption(x) && x.value === option.value)
      );
    }

    return (
      !Array.isArray(current) &&
      isOption(current) &&
      current.value === option.value
    );
  }

  // ========================================================
  // GROUPING
  // ========================================================

  const groupedData: Record<string, Question[]> = questions.reduce(
    (acc, item) => {
      const key = item.fullpath;

      if (!acc[key]) acc[key] = [];

      acc[key].push(item);

      return acc;
    },
    {} as Record<string, Question[]>,
  );

  // ========================================================
  // SUBMIT STEP
  // ========================================================
  function hasQuestions(step: "admin" | "fakultas" | "prodi") {
    return previewData.some((item: any) => getStepForQuestion(item) === step);
  }

  function handleNextStep() {
    const steps: ("admin" | "fakultas" | "prodi")[] = [
      "admin",
      "fakultas",
      "prodi",
    ];

    const currentIndex = steps.indexOf(activeStep);

    for (let i = currentIndex + 1; i < steps.length; i++) {
      const nextStep = steps[i];

      if (hasQuestions(nextStep)) {
        setActiveStep(nextStep);
        return;
      }
    }

    alert("Preview selesai");
  }

  const hasAdminQuestions = useMemo(() => {
    return hasQuestions("admin");
  }, [previewData]);

  const hasFakultasQuestions = useMemo(() => {
    return hasQuestions("fakultas");
  }, [previewData]);

  const hasProdiQuestions = useMemo(() => {
    return hasQuestions("prodi");
  }, [previewData]);

  function getSubmitLabel() {
    if (activeStep === "admin") {
      if (hasFakultasQuestions) return "Lanjut ke Fakultas";
      if (hasProdiQuestions) return "Lanjut ke Prodi";
      return "Selesai Preview";
    }

    if (activeStep === "fakultas") {
      if (hasProdiQuestions) return "Lanjut ke Prodi";
      return "Selesai Preview";
    }

    return "Selesai Preview";
  }

  return (
    <QuestionerLayout activeStep={activeStep} onNextStep={handleNextStep}>
      <form
        className=""
        onSubmit={(e) => {
          e.preventDefault();
          handleNextStep();
        }}
      >
        {Object.entries(groupedData)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([group, groupQuestions]) => (
            <section key={group} className="space-y-10">
              {/* GROUP HEADER */}
              <header className="mb-4">
                <h2 className="text-[clamp(1.25rem,3.5vw,2rem)] font-headline font-extrabold text-on-surface tracking-tight break-words">
                  {group}
                </h2>
              </header>

              {/* QUESTIONS */}
              <div className="space-y-8">
                {groupQuestions.map((q, index) => (
                  <div
                    key={q.uuid}
                    className="
                      bg-surface
                      border border-outline-variant/20
                      rounded-3xl
                      p-[clamp(1rem,3vw,2rem)]
                      shadow-sm
                      transition-all
                    "
                  >
                    {/* QUESTION HEADER */}
                    <div className="mb-8">
                      <div className="flex items-start gap-4">
                        <div
                          className="
                            min-w-9
                            w-9
                            h-9
                            rounded-2xl
                            bg-primary
                            text-white
                            flex
                            items-center
                            justify-center
                            font-bold
                            shadow-lg
                            shrink-0
                          "
                        >
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3
                            className="
                              text-[clamp(0.875rem,2vw,1.125rem)]
                              font-bold
                              text-on-surface
                              leading-snug
                              break-words
                            "
                          >
                            {q.pertanyaan}
                          </h3>

                          {q.required && (
                            <p className="text-sm text-error mt-2 font-medium">
                              * Pertanyaan wajib diisi
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RATING */}
                    {q.tipe === "rating" && (
                      <RatingScale
                        options={q.pilihan}
                        value={
                          q.pilihan.find((opt) => isSelected(q.uuid, opt, "rating"))?.value
                        }
                        onChange={(_, opt) => {
                          if (opt) handleRadio(q.uuid, opt as Option);
                        }}
                      />
                    )}

                    {/* RADIO */}
                    {q.tipe === "radio" && (
                      <div className="space-y-4">
                        {q.pilihan.map((opt) => {
                          const active = isSelected(q.uuid, opt, "radio");

                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleRadio(q.uuid, opt)}
                              className={`
                                w-full
                                text-left
                                rounded-2xl
                                border
                                px-5
                                py-4
                                transition-all
                                duration-200
                                ${
                                  active
                                    ? `
                                      border-primary
                                      bg-primary/10
                                      shadow-md
                                    `
                                    : `
                                      border-outline-variant/30
                                      hover:border-primary/40
                                      hover:bg-surface-container-low
                                    `
                                }
                              `}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`
                                    w-5
                                    h-5
                                    rounded-full
                                    border-2
                                    flex
                                    items-center
                                    justify-center
                                    transition-all
                                    ${
                                      active
                                        ? "border-primary"
                                        : "border-outline"
                                    }
                                  `}
                                >
                                  {active && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                  )}
                                </div>

                                <span className="font-semibold text-on-surface">
                                  {opt.label}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* MULTIPLE */}
                    {q.tipe === "multiple" && (
                      <div className="space-y-4">
                        {q.pilihan.map((opt) => {
                          const active = isSelected(q.uuid, opt, "multiple");

                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleMultiple(q.uuid, opt)}
                              className={`
                                w-full
                                text-left
                                rounded-2xl
                                border
                                px-5
                                py-4
                                transition-all
                                duration-200
                                ${
                                  active
                                    ? `
                                      border-primary
                                      bg-primary/10
                                      shadow-md
                                    `
                                    : `
                                      border-outline-variant/30
                                      hover:border-primary/40
                                      hover:bg-surface-container-low
                                    `
                                }
                              `}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`
                                    w-5
                                    h-5
                                    rounded-md
                                    border-2
                                    flex
                                    items-center
                                    justify-center
                                    transition-all
                                    ${
                                      active
                                        ? `
                                          border-primary
                                          bg-primary
                                        `
                                        : "border-outline"
                                    }
                                  `}
                                >
                                  {active && (
                                    <div className="w-2 h-2 bg-white rounded-sm" />
                                  )}
                                </div>

                                <span className="font-semibold text-on-surface">
                                  {opt.label}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

        {/* SUBMIT */}
        <div className="pt-6">
          <button
            type="submit"
            className="
              w-full
              py-[clamp(0.75rem,1.5vw,1rem)]
              px-[clamp(1rem,2vw,1.5rem)]
              rounded-2xl
              bg-gradient-to-r
              from-primary
              to-primary-container
              text-on-primary
              font-bold
              text-[clamp(0.85rem,1.8vw,1rem)]
              shadow-2xl
              hover:scale-[1.01]
              active:scale-[0.99]
              transition-all
            "
          >
            {getSubmitLabel()}
          </button>
        </div>
      </form>
    </QuestionerLayout>
  );
}
