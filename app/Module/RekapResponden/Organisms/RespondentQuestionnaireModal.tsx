"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { RekapRespondenItem } from "../Attribut/RekapRespondenTypes";
import QuestionerLayout from "../../Quesioner/Template/QuestionerLayout";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type StepType = "admin" | "fakultas" | "prodi" | "unit";

interface Props {
  item: RekapRespondenItem | null;
  onClose: () => void;
}

interface Question {
  id: string;
  uuid: string;
  pertanyaan: string;
  required: boolean;
  created: StepType;
  tipe: "radio" | "multiple" | "rating" | "text";
  fullpath: string;
  pilihan: {
    label: string;
    value: string;
    nilai?: number;
    freetext?: boolean;
  }[];
}

const facultyCodeMap: Record<string, string> = {
  "01": "hukum",
  "02": "fkip",
  "03": "feb",
  "04": "isib",
  "05": "ft",
  "06": "fmipa",
  "07": "pascasarjana",
};

function getNormalizedFaculty(val?: string | null): string {
  if (!val) return "";
  const s = String(val).toLowerCase().trim();
  return facultyCodeMap[s] || s;
}

/** =========================
 * STEP CLASSIFIER
 * ========================= */
function getStepForQuestion(item: any): StepType {
  const cb = String(
    item.CreatedBy ||
      item.created_by ||
      item.CreatedByRef ||
      item.created_by_ref ||
      item.Created ||
      item.created ||
      "",
  )
    .toLowerCase()
    .trim();

  const unit = String(item.Unit || "").trim();

  if (unit !== "" || cb.includes("unit")) return "unit";
  if (cb.includes("prodi") || (item.Prodi && String(item.Prodi).trim() !== "")) return "prodi";
  if (cb.includes("fakultas") || (item.Fakultas && String(item.Fakultas).trim() !== "")) return "fakultas";
  return "admin";
}

/** =========================
 * ORGANIZATIONAL SCOPE FILTER
 * ========================= */
function shouldShowQuestionForRespondent(
  q: any,
  respondent: RekapRespondenItem,
): boolean {
  const step = getStepForQuestion(q);

  // Admin / LPPM questions apply to everyone
  if (step === "admin") return true;

  const respFak = getNormalizedFaculty(
    respondent.Fakultas || respondent.KodeFakultas,
  );

  const respProdi = String(
    respondent.Prodi || respondent.KodeProdi || "",
  )
    .toLowerCase()
    .trim();

  const respUnit = String(respondent.Unit || "")
    .toLowerCase()
    .trim();

  // FAKULTAS MATCHING
  if (step === "fakultas") {
    const qFak = getNormalizedFaculty(q.Fakultas);
    const qRef = String(
      q.CreatedByRef || q.CreatedBy || q.FullPath || q.Kategori || "",
    )
      .toLowerCase()
      .trim();

    if (qFak) {
      return respFak !== "" && (respFak.includes(qFak) || qFak.includes(respFak));
    }

    const knownFaculties = [
      "hukum",
      "isib",
      "fkip",
      "fmipa",
      "feb",
      "fe",
      "ft",
      "pascasarjana",
    ];
    for (const fac of knownFaculties) {
      if (qRef.includes(fac)) {
        return respFak !== "" && respFak.includes(fac);
      }
    }

    return true;
  }

  // PRODI MATCHING
  if (step === "prodi") {
    const qProdi = String(q.Prodi || "").toLowerCase().trim();
    const qRef = String(
      q.CreatedByRef || q.CreatedBy || q.FullPath || q.Kategori || "",
    )
      .toLowerCase()
      .trim();

    if (qProdi) {
      return respProdi !== "" && (respProdi.includes(qProdi) || qProdi.includes(respProdi));
    }

    const knownProdis = [
      "ilmu komunikasi",
      "sastra inggris",
      "hukum",
      "ilmu hukum",
      "manajemen",
      "akuntansi",
      "ilmu komputer",
      "biologi",
    ];
    for (const p of knownProdis) {
      if (qRef.includes(p)) {
        return respProdi !== "" && respProdi.includes(p);
      }
    }

    return true;
  }

  // UNIT MATCHING
  if (step === "unit") {
    const qUnit = String(q.Unit || "").toLowerCase().trim();
    if (qUnit && respUnit) {
      return respUnit.includes(qUnit) || qUnit.includes(respUnit);
    }
    return true;
  }

  return true;
}

export default function RespondentQuestionnaireModal({ item, onClose }: Props) {
  const [activeStep, setActiveStep] = useState<StepType>("admin");
  const [questionsRaw, setQuestionsRaw] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  /** =========================
   * FETCH QUESTIONS & ANSWERS
   * ========================= */
  const loadData = useCallback(async () => {
    if (!item?.UUID || !item?.UUIDBankSoal) return;

    setLoading(true);
    setErr(null);

    const token = sessionStorage.getItem("access_token") || "";

    try {
      // 1. Fetch Template Questions for Bank Soal
      const qRes = await fetch(
        `${BASE_URL}/templatepertanyaan/${item.UUIDBankSoal}/banksoal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
        },
      );

      let questionsList: any[] = [];

      if (qRes.ok && qRes.body) {
        const reader = qRes.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() || "";

          for (const chunk of chunks) {
            const line = chunk.trim();
            if (!line.startsWith("data:")) continue;
            const val = line.replace("data:", "").trim();
            if (val === "start" || val === "done") continue;

            try {
              questionsList.push(JSON.parse(val));
            } catch {}
          }
        }
      }

      // 2. Fetch Submitted Answers for this Respondent Questionnaire
      const aRes = await fetch(`${BASE_URL}/kuesioner/${item.UUID}/jawaban`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let answersList: any[] = [];
      if (aRes.ok) {
        answersList = await aRes.json();
      }

      setQuestionsRaw(questionsList);
      setUserAnswers(answersList);
    } catch (error: any) {
      console.error("loadData error:", error);
      setErr("Gagal memuat detail kuesioner responden");
    } finally {
      setLoading(false);
    }
  }, [item]);

  useEffect(() => {
    if (item) {
      setActiveStep("admin");
      loadData();
    }
  }, [item, loadData]);

  /** =========================
   * PRE-FILLED ANSWERS MAP
   * ========================= */
  const answersMap = useMemo(() => {
    const map: Record<string, { optionIds: Set<string>; freeText?: string }> = {};

    for (const a of userAnswers) {
      const qUuid = a.UuidTemplatePertanyaan || a.uuid_template_pertanyaan;
      const optUuid = a.UuidTemplateJawaban || a.uuid_template_jawaban;
      const freeText = a.FreeText || a.free_text;

      if (!qUuid) continue;

      if (!map[qUuid]) {
        map[qUuid] = { optionIds: new Set(), freeText: "" };
      }

      if (optUuid) map[qUuid].optionIds.add(optUuid);
      if (freeText) map[qUuid].freeText = freeText;
    }

    return map;
  }, [userAnswers]);

  /** =========================
   * MAP QUESTIONS FOR ACTIVE STEP (WITH MATCHING FILTER)
   * ========================= */
  const questionsForStep = useMemo(() => {
    if (!item) return [];

    return questionsRaw
      .filter(
        (q: any) =>
          getStepForQuestion(q) === activeStep &&
          shouldShowQuestionForRespondent(q, item),
      )
      .map((q: any) => ({
        id: q.UUID,
        uuid: q.UUID,
        pertanyaan: q.Pertanyaan,
        required: q.Required === 1,
        created: activeStep,
        tipe: (q.JenisPilihan || "rating") as "radio" | "multiple" | "rating" | "text",
        fullpath: q.FullPath || "Umum",
        pilihan: Array.isArray(q.ListJawaban)
          ? [...q.ListJawaban]
              .sort((a: any, b: any) => (b.Nilai || 0) - (a.Nilai || 0))
              .map((j: any) => ({
                label: j.Jawaban,
                value: j.UUID,
                nilai: j.Nilai,
                freetext: j.IsFreeText === 1,
              }))
          : [],
      }));
  }, [questionsRaw, activeStep, item]);

  /** =========================
   * GROUPED QUESTIONS BY FULLPATH
   * ========================= */
  const groupedQuestions = useMemo(() => {
    return questionsForStep.reduce((acc, q) => {
      const group = q.fullpath || "Umum";
      if (!acc[group]) acc[group] = [];
      acc[group].push(q);
      return acc;
    }, {} as Record<string, Question[]>);
  }, [questionsForStep]);

  /** =========================
   * STEP NAVIGATION
   * ========================= */
  const handleNextStep = () => {
    if (activeStep === "admin") setActiveStep("fakultas");
    else if (activeStep === "fakultas") setActiveStep("prodi");
    else if (activeStep === "prodi") setActiveStep("unit");
    else onClose();
  };

  const handlePrevStep = () => {
    if (activeStep === "unit") setActiveStep("prodi");
    else if (activeStep === "prodi") setActiveStep("fakultas");
    else if (activeStep === "fakultas") setActiveStep("admin");
  };

  const getSubmitButtonLabel = () => {
    if (activeStep === "admin") return "Lanjut ke Fakultas";
    if (activeStep === "fakultas") return "Lanjut ke Prodi";
    if (activeStep === "prodi") return "Lanjut ke Unit";
    return "Selesai Preview";
  };

  if (!item) return null;

  const respondentName =
    item.NamaMahasiswa || item.NamaDosen || item.NamaTendik || "Responden";
  const respondentId = item.NPM || item.NIDN || item.NIP || "-";

  return (
    <div className="fixed inset-0 z-[9999] bg-surface flex flex-col overflow-y-auto animate-in fade-in duration-200">
      {/* TOP BAR WITH BACK BUTTON */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/15 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-black text-on-surface">
              Preview Data Responden
            </h1>
            <p className="text-xs text-outline font-medium">
              Simulasi tampilan kuesioner yang telah terisi oleh responden
            </p>
          </div>
        </div>

        {/* RESPONDENT INFO SUMMARY PILL */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-surface-container-low border border-outline-variant/10">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            <span className="material-symbols-outlined text-base">person</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">{respondentName}</p>
            <p className="text-[10px] text-outline font-mono">
              ID: {respondentId} • {item.Fakultas || item.KodeFakultas || "-"}
            </p>
          </div>
        </div>
      </header>

      {/* FULL QUESTIONNAIRE LAYOUT */}
      <div className="flex-1 w-full flex flex-col md:flex-row">
        <QuestionerLayout activeStep={activeStep} onNextStep={handleNextStep}>
          <div className="max-w-3xl mx-auto space-y-8">
            {/* NO TABS - DIRECT CONTINUOUS STEPTER FLOW (LPPM -> FAKULTAS -> PRODI -> UNIT) */}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium text-outline">
                  Memuat pertanyaan & jawaban responden...
                </p>
              </div>
            ) : err ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center text-sm font-medium">
                {err}
              </div>
            ) : Object.keys(groupedQuestions).length === 0 ? (
              <div className="py-16 text-center text-outline text-sm bg-surface p-8 rounded-3xl border border-outline-variant/15">
                Tidak ada pertanyaan untuk tahap{" "}
                <strong className="text-on-surface uppercase">
                  {activeStep === "admin" ? "LPPM / Admin" : activeStep}
                </strong>
                {item.Fakultas && (
                  <span>
                    {" "}
                    pada fakultas <strong>{item.Fakultas}</strong>
                  </span>
                )}
                .
              </div>
            ) : (
              Object.entries(groupedQuestions)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([group, groupQuestions]) => (
                  <section key={group} className="space-y-8">
                    {/* CATEGORY / SUBPATH HEADER */}
                    <header className="mb-4">
                      <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight">
                        {group}
                      </h2>
                    </header>

                    {/* QUESTIONS CARDS */}
                    <div className="space-y-8">
                      {groupQuestions.map((q, index) => {
                        const ans = answersMap[q.uuid];
                        const selectedOpts = ans?.optionIds || new Set();

                        return (
                          <div
                            key={q.uuid}
                            className="bg-surface border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-9 h-9 rounded-xl bg-primary text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-base md:text-lg font-bold text-on-surface leading-snug">
                                  {q.pertanyaan}
                                </h3>
                                {q.required && (
                                  <p className="text-xs text-red-500 font-medium mt-1">
                                    * Pertanyaan wajib diisi
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* RATING SCALE CHOICE (5, 4, 3, 2, 1) */}
                            {q.tipe === "rating" ? (
                              <div className="flex flex-wrap items-center gap-3 pt-2">
                                {q.pilihan.map((opt) => {
                                  const isSelected = selectedOpts.has(opt.value);
                                  const displayVal = opt.nilai ?? opt.label;

                                  return (
                                    <div
                                      key={opt.value}
                                      title={opt.label}
                                      className={`flex-1 min-w-[50px] max-w-[80px] h-14 rounded-2xl flex flex-col items-center justify-center text-base font-extrabold border transition-all ${
                                        isSelected
                                          ? "bg-primary text-white border-primary shadow-md scale-105"
                                          : "bg-surface-container-low border-outline-variant/20 text-on-surface-variant opacity-60"
                                      }`}
                                    >
                                      <span>{displayVal}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : q.pilihan.length > 0 ? (
                              /* RADIO / MULTIPLE CHOICES LIST */
                              <div className="grid gap-3 pt-2">
                                {q.pilihan.map((opt) => {
                                  const isSelected = selectedOpts.has(opt.value);

                                  return (
                                    <div
                                      key={opt.value}
                                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                                        isSelected
                                          ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                                          : "bg-surface-container-low/40 border-outline-variant/20 text-on-surface-variant opacity-70"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                                            isSelected
                                              ? "border-primary bg-primary text-white"
                                              : "border-outline-variant/40"
                                          }`}
                                        >
                                          {isSelected && "✓"}
                                        </div>
                                        <span className="text-sm font-medium">
                                          {opt.label}
                                        </span>
                                      </div>

                                      {isSelected && (
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-primary text-white shrink-0">
                                          Jawaban Responden
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : null}

                            {/* FREE TEXT ANSWER */}
                            {ans?.freeText ? (
                              <div className="pt-2">
                                <p className="text-xs font-bold text-outline mb-1">
                                  Jawaban Teks / Catatan:
                                </p>
                                <div className="p-4 bg-surface-container-low rounded-2xl text-sm text-on-surface font-medium border border-outline-variant/20">
                                  {ans.freeText}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))
            )}

            {/* SUBMIT / NEXT STEP BUTTON AT BOTTOM */}
            <div className="pt-6 pb-12 flex items-center justify-between gap-4 border-t border-outline-variant/15 mt-8">
              {activeStep !== "admin" ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-4 rounded-2xl border border-outline-variant/30 text-on-surface font-bold text-base hover:bg-surface-container-low transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">
                    arrow_back
                  </span>
                  Kembali (
                  {activeStep === "unit"
                    ? "Prodi"
                    : activeStep === "prodi"
                      ? "Fakultas"
                      : "LPPM"}
                  )
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-5 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-white font-bold text-lg shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-2"
              >
                {getSubmitButtonLabel()}
                <span className="material-symbols-outlined text-xl">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </QuestionerLayout>
      </div>
    </div>
  );
}
