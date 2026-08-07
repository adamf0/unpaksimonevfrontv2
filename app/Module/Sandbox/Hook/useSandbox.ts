"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Option as SelectOption } from "../../Common/Components/Attribut/Option";
import { adaptSelectOptionsMerge } from "../../Common/Adapter/adaptSelectOptionsMerge";
import { Question } from "../../Quesioner/Attribut/Question";
import { Option } from "../../Quesioner/Attribut/Option";
import { AnswerState } from "../../Quesioner/Attribut/AnswerState";
import {
  SandboxPersona,
  FAKULTAS_OPTIONS,
  PRODI_OPTIONS,
} from "../Attribut/SandboxTypes";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type StepType = "admin" | "fakultas" | "prodi" | "unit";

function getNormalizedFaculty(
  val?: string | null,
  fakultasList: any[] = [],
): string {
  if (!val) return "";
  const s = String(val).toLowerCase().trim();

  for (const f of fakultasList) {
    const code = String(
      f.KodeFakultas || f.kode_fakultas || f.Kode || f.ID || "",
    )
      .toLowerCase()
      .trim();
    const name = String(f.NamaFakultas || f.nama_fakultas || f.Nama || "")
      .toLowerCase()
      .trim();

    if (
      s === code ||
      s === name ||
      (name && name.includes(s)) ||
      (name && s.includes(name))
    ) {
      return name || code;
    }
  }

  return s;
}

export function getStepForQuestion(item: any): StepType {
  const raw = item._raw || item;

  const created = String(raw.created || raw.Created || "")
    .toLowerCase()
    .trim();
  if (
    created === "admin" ||
    created === "fakultas" ||
    created === "prodi" ||
    created === "unit"
  ) {
    return created as StepType;
  }

  const prodi = String(raw.Prodi || raw.prodi || "").trim();
  const fak = String(raw.Fakultas || raw.fakultas || "").trim();
  const unit = String(raw.Unit || raw.unit || "").trim();
  const cb = String(
    raw.CreatedBy ||
      raw.created_by ||
      raw.CreatedByRef ||
      raw.created_by_ref ||
      "",
  )
    .toLowerCase()
    .trim();

  if (unit !== "" || cb.includes("unit")) return "unit";
  if (prodi !== "" || cb.includes("prodi")) return "prodi";
  if (fak !== "" || cb.includes("fakultas")) return "fakultas";
  return "admin";
}

export function getQuestionsForStep(
  questions: Question[],
  targetStep: StepType,
  persona: SandboxPersona,
  fakultasList: any[] = [],
): Question[] {
  const pFak = getNormalizedFaculty(
    persona.kodeFakultas || persona.namaFakultas,
    fakultasList,
  );
  const pProdi = String(persona.kodeProdi || persona.namaProdi || "")
    .toLowerCase()
    .trim();
  const pUnit = String(persona.unit || "").toLowerCase().trim();

  return questions.filter((q: any) => {
    const raw = q._raw || q;
    const step = getStepForQuestion(raw);
    if (step !== targetStep) return false;

    if (step === "admin") return true;

    if (step === "fakultas") {
      const qFak = getNormalizedFaculty(raw.Fakultas || raw.CreatedBy, fakultasList);
      if (qFak && pFak) {
        return pFak.includes(qFak) || qFak.includes(pFak);
      }
      return true;
    }

    if (step === "prodi") {
      const qProdi = String(raw.Prodi || "").toLowerCase().trim();
      if (qProdi && pProdi) {
        return pProdi.includes(qProdi) || qProdi.includes(pProdi);
      }
      return true;
    }

    if (step === "unit") {
      const qUnit = String(raw.Unit || "").toLowerCase().trim();
      if (qUnit && pUnit) {
        return pUnit.includes(qUnit) || qUnit.includes(pUnit);
      }
      return true;
    }

    return true;
  });
}

/** =========================================================
 * DATE ACTIVE WINDOW CHECK (bank_soalv2 & bank_soal_extendv2)
 * ========================================================= */
export function isStepActiveOnDate(
  step: StepType,
  bankSoalDetail: any,
  checkDate: Date,
): boolean {
  if (!bankSoalDetail) return false;

  const checkMs = new Date(
    checkDate.getFullYear(),
    checkDate.getMonth(),
    checkDate.getDate(),
  ).getTime();

  let startStr: string | null = null;
  let endStr: string | null = null;

  if (step === "admin") {
    startStr = bankSoalDetail.TanggalMulai || bankSoalDetail.tanggal_mulai || null;
    endStr = bankSoalDetail.TanggalAkhir || bankSoalDetail.tanggal_akhir || null;
  } else if (
    Array.isArray(bankSoalDetail.ListExt) &&
    bankSoalDetail.ListExt.length > 0
  ) {
    const ext = bankSoalDetail.ListExt.find((e: any) => {
      const role = String(e.Role || e.CreatedBy || e.createdBy || "").toLowerCase();
      if (step === "fakultas") return role.includes("fakultas");
      if (step === "prodi") return role.includes("prodi");
      if (step === "unit") return role.includes("unit");
      return false;
    });

    if (ext) {
      startStr = ext.TanggalMulai || ext.tanggal_mulai || null;
      endStr = ext.TanggalAkhir || ext.tanggal_akhir || null;
    } else {
      startStr = bankSoalDetail.TanggalMulai || bankSoalDetail.tanggal_mulai || null;
      endStr = bankSoalDetail.TanggalAkhir || bankSoalDetail.tanggal_akhir || null;
    }
  } else {
    startStr = bankSoalDetail.TanggalMulai || bankSoalDetail.tanggal_mulai || null;
    endStr = bankSoalDetail.TanggalAkhir || bankSoalDetail.tanggal_akhir || null;
  }

  if (!startStr || !endStr) return false;

  const sDate = new Date(startStr);
  const startMs = new Date(
    sDate.getFullYear(),
    sDate.getMonth(),
    sDate.getDate(),
  ).getTime();
  if (checkMs < startMs) return false;

  const eDate = new Date(endStr);
  const endMs = new Date(
    eDate.getFullYear(),
    eDate.getMonth(),
    eDate.getDate(),
    23,
    59,
    59,
  ).getTime();
  if (checkMs > endMs) return false;

  return true;
}

export function resolveUserFacultyCode(profile?: any): string {
  if (!profile) return "01";
  const ref = String(profile.RefFakultas || profile.KodeFakultas || "").trim();
  if (ref && FAKULTAS_OPTIONS.some((f) => f.value === ref)) return ref;

  const name = String(profile.Fakultas || profile.NamaFakultas || "").toLowerCase();
  if (name.includes("hukum")) return "01";
  if (name.includes("keguruan") || name.includes("fkip")) return "02";
  if (name.includes("ekonomi") || name.includes("feb")) return "03";
  if (name.includes("sosial") || name.includes("isib")) return "04";
  if (name.includes("teknik") || name.includes("ft")) return "05";
  if (name.includes("mipa") || name.includes("fmipa")) return "06";
  if (name.includes("pasca")) return "07";

  return "01";
}

export function resolveUserProdiCode(profile?: any, fakCode: string = "01"): string {
  if (!profile) return PRODI_OPTIONS[fakCode]?.[0]?.value || "";
  const ref = String(profile.RefProdi || profile.KodeProdi || "").trim();
  const available = PRODI_OPTIONS[fakCode] || [];
  if (ref && available.some((p) => p.value === ref)) return ref;

  const name = String(profile.Prodi || profile.NamaProdi || "").toLowerCase();
  const match = available.find((p) => p.label.toLowerCase().includes(name) || name.includes(p.label.toLowerCase()));
  if (match) return match.value;

  return available[0]?.value || "";
}

export function useSandbox() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [fakultasList, setFakultasList] = useState<any[]>([]);
  const [bankSoalOptions, setBankSoalOptions] = useState<SelectOption[]>([]);
  const [rawBankSoals, setRawBankSoals] = useState<any[]>([]);
  const [selectedBankSoal, setSelectedBankSoal] = useState<SelectOption | null>(null);
  const [loadingBankSoal, setLoadingBankSoal] = useState(false);

  // Simulation Date (Default: Today YYYY-MM-DD)
  const [simulationDateStr, setSimulationDateStr] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const simulationDate = useMemo(() => {
    return new Date(simulationDateStr || new Date());
  }, [simulationDateStr]);

  // Persona State
  const [persona, setPersona] = useState<SandboxPersona>({
    role: "mahasiswa",
    nama: "Ahmad Simulasi",
    identitas: "010123001",
    kodeFakultas: "01",
    namaFakultas: "FAKULTAS HUKUM",
    kodeProdi: "0101",
    namaProdi: "Ilmu Hukum (S1)",
    unit: "LPPM",
  });

  // Active Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [activeStep, setActiveStep] = useState<StepType>("admin");

  // Answers State (1:1 with Quesioner Module)
  const [answers, setAnswers] = useState<AnswerState>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Result Modal State
  const [showResultModal, setShowResultModal] = useState(false);

  const esRef = useRef<EventSource | null>(null);

  /** =========================
   * FETCH USER PROFILE & FAKULTAS LIST
   * ========================= */
  useEffect(() => {
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token") ||
      "";
    if (!token) return;

    Promise.all([
      fetch(`${BASE_URL}/whoami`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : null)),
      fetch(`${BASE_URL}/fakultass?mode=all`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([whoData, fakData]) => {
        if (fakData) {
          setFakultasList(fakData.data?.data || fakData.data || fakData || []);
        }

        if (whoData) {
          setUserProfile(whoData);
          const level = String(whoData.Level || "admin").toLowerCase().trim();

          if (level === "fakultas" || level === "prodi") {
            const fakCode = resolveUserFacultyCode(whoData);
            const fakOpt = FAKULTAS_OPTIONS.find((f) => f.value === fakCode);
            const prodiCode = resolveUserProdiCode(whoData, fakCode);
            const prodiList = PRODI_OPTIONS[fakCode] || [];
            const prodiOpt = prodiList.find((p) => p.value === prodiCode) || prodiList[0];

            setPersona((prev) => ({
              ...prev,
              kodeFakultas: fakCode,
              namaFakultas: fakOpt ? fakOpt.label : prev.namaFakultas,
              kodeProdi: level === "prodi" ? prodiCode : prev.kodeProdi || (prodiOpt ? prodiOpt.value : ""),
              namaProdi: level === "prodi" ? (prodiOpt ? prodiOpt.label : prev.namaProdi) : prev.namaProdi || (prodiOpt ? prodiOpt.label : ""),
            }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const userLevel = String(userProfile?.Level || "admin").toLowerCase().trim();
  const isFacultyLocked = userLevel === "fakultas" || userLevel === "prodi";
  const isProdiLocked = userLevel === "prodi";

  // Selected Bank Soal Full Detail (including TanggalMulai, TanggalAkhir, ListExt)
  const selectedBankSoalDetail = useMemo(() => {
    if (!selectedBankSoal?.value) return null;
    return rawBankSoals.find(
      (b) => String(b.UUID || b.id) === String(selectedBankSoal.value),
    ) || null;
  }, [rawBankSoals, selectedBankSoal]);

  /** =========================
   * DYNAMIC AVAILABLE STEPS FOR TARGET PERSONA & DATE ACTIVE WINDOWS
   * Filtered by matching questions AND active date range (bank_soalv2 & bank_soal_extendv2)
   * ========================= */
  const availableSteps = useMemo(() => {
    const allSteps: StepType[] = ["admin", "fakultas", "prodi", "unit"];
    return allSteps.filter((s) => {
      const hasQuestions =
        getQuestionsForStep(questions, s, persona, fakultasList).length > 0;
      if (!hasQuestions) return false;

      const activeOnDate = isStepActiveOnDate(
        s,
        selectedBankSoalDetail,
        simulationDate,
      );
      return activeOnDate;
    });
  }, [questions, persona, selectedBankSoalDetail, simulationDate, fakultasList]);

  const currentStepIndex = availableSteps.indexOf(activeStep);
  const isLastStep =
    availableSteps.length === 0 ||
    currentStepIndex < 0 ||
    currentStepIndex === availableSteps.length - 1;

  /** =========================
   * LOAD BANK SOAL OPTIONS & METADATA
   * ========================= */
  const loadBankSoalOptions = useCallback(() => {
    if (esRef.current) return;
    setLoadingBankSoal(true);

    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token") ||
      "";
    const es = new EventSource(`${BASE_URL}/banksoals?mode=sse&ctxtoken=${token}`);
    esRef.current = es;

    let temp: any[] = [];

    es.onmessage = (event) => {
      const val = event.data;

      if (val === "start") {
        temp = [];
        return;
      }

      if (val === "done") {
        setRawBankSoals(temp);
        const opts = adaptSelectOptionsMerge(temp, {
          valueKey: "UUID",
          labelKeys: ["Judul"],
        });
        setBankSoalOptions(opts);
        if (opts.length > 0 && !selectedBankSoal) {
          setSelectedBankSoal(opts[0]);
        }
        setLoadingBankSoal(false);
        es.close();
        esRef.current = null;
        return;
      }

      try {
        temp.push(JSON.parse(val));
      } catch {}
    };

    es.onerror = () => {
      setLoadingBankSoal(false);
      es.close();
      esRef.current = null;
    };
  }, [selectedBankSoal]);

  useEffect(() => {
    loadBankSoalOptions();
    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, [loadBankSoalOptions]);

  /** =========================
   * START SIMULATION (MAP TO 1:1 QUESTIONER MODULE TYPES)
   * ========================= */
  const startSimulation = async () => {
    if (!selectedBankSoal?.value) return;

    setLoadingQuestions(true);
    setIsSimulating(true);
    setAnswers({});
    setErrors({});

    try {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token") ||
        "";
      const res = await fetch(
        `${BASE_URL}/templatepertanyaan/${selectedBankSoal.value}/banksoal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
        },
      );

      let rawFetched: any[] = [];
      if (res.ok && res.body) {
        const reader = res.body.getReader();
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
              rawFetched.push(JSON.parse(val));
            } catch {}
          }
        }
      }

      // Map raw backend questions to 1:1 Question type
      const mappedQuestions: Question[] = rawFetched.map((q: any) => {
        const choices: Option[] = Array.isArray(q.ListJawaban)
          ? q.ListJawaban.map((j: any) => ({
              label: j.Jawaban || String(j.Nilai ?? ""),
              value: j.UUID || String(j.ID),
              freetext: false,
            }))
          : [];

        const defaultRatingChoices: Option[] = [
          { label: "1", value: "1", freetext: false },
          { label: "2", value: "2", freetext: false },
          { label: "3", value: "3", freetext: false },
          { label: "4", value: "4", freetext: false },
          { label: "5", value: "5", freetext: false },
        ];

        const tipeStr = String(q.JenisPilihan || "rating").toLowerCase();
        const tipe = tipeStr.includes("radio")
          ? "radio"
          : tipeStr.includes("multi") || tipeStr.includes("check")
            ? "multiple"
            : "rating";

        return {
          id: String(q.ID),
          uuid: q.UUID || String(q.ID),
          pertanyaan: q.Pertanyaan || "",
          required: Boolean(q.Required),
          created: getStepForQuestion(q),
          createdBy: q.CreatedBy || q.createdBy,
          tipe,
          pilihan:
            choices.length > 0
              ? choices
              : tipe === "rating"
                ? defaultRatingChoices
                : [],
          fullpath: q.FullPath || q.Kategori || "Pertanyaan Evaluasi",
          _raw: q,
        } as any;
      });

      setQuestions(mappedQuestions);

      // Dynamically set activeStep to first step that has questions AND is active on simulationDate
      const allSteps: StepType[] = ["admin", "fakultas", "prodi", "unit"];
      const bDetail =
        rawBankSoals.find(
          (b) => String(b.UUID || b.id) === String(selectedBankSoal.value),
        ) || null;

      const firstValidStep =
        allSteps.find((s) => {
          const hasQ =
            getQuestionsForStep(mappedQuestions, s, persona, fakultasList).length > 0;
          const activeDate = isStepActiveOnDate(s, bDetail, simulationDate);
          return hasQ && activeDate;
        }) || "admin";

      setActiveStep(firstValidStep);
    } catch (err) {
      console.error("startSimulation fetch error:", err);
      setQuestions([]);
      setActiveStep("admin");
    } finally {
      setLoadingQuestions(false);
    }
  };

  /** =========================
   * STEP TRANSITIONS
   * ========================= */
  const handleNextStep = () => {
    if (isLastStep) {
      setShowResultModal(true);
    } else {
      setActiveStep(availableSteps[currentStepIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setActiveStep(availableSteps[currentStepIndex - 1]);
    }
  };

  /** =========================
   * 1:1 FORM SELECTION HANDLERS
   * ========================= */
  const isSelected = (
    qid: string,
    option: Option,
    type: "radio" | "multiple",
  ) => {
    const current = answers[qid]?.value;
    if (!current) return false;

    if (type === "radio") {
      return (current as Option).value === option.value;
    }

    if (type === "multiple" && Array.isArray(current)) {
      return (current as Option[]).some((item) => item.value === option.value);
    }

    return false;
  };

  const handleChange = (
    qid: string,
    option: Option,
    type: "radio" | "multiple",
  ) => {
    setAnswers((prev) => {
      const current = prev[qid]?.value;

      if (type === "radio") {
        return { ...prev, [qid]: { ...prev[qid], value: option } };
      }

      if (type === "multiple") {
        const arr = Array.isArray(current) ? (current as Option[]) : [];
        const exists = arr.some((item) => item.value === option.value);
        const nextArr = exists
          ? arr.filter((item) => item.value !== option.value)
          : [...arr, option];

        return { ...prev, [qid]: { ...prev[qid], value: nextArr } };
      }

      return prev;
    });
  };

  const handleExtraChange = (qid: string, optVal: string, val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: {
        ...prev[qid],
        extra: {
          ...(prev[qid]?.extra || {}),
          [optVal]: val,
        },
      },
    }));
  };

  const isBrokenQuestion = (q: Question) => false;

  const handleSimulateSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleNextStep();
  };

  return {
    userProfile,
    userLevel,
    isFacultyLocked,
    isProdiLocked,

    bankSoalOptions,
    selectedBankSoal,
    setSelectedBankSoal,
    selectedBankSoalDetail,
    loadingBankSoal,

    simulationDateStr,
    setSimulationDateStr,
    simulationDate,

    persona,
    setPersona,

    isSimulating,
    setIsSimulating,
    questions,
    loadingQuestions,

    activeStep,
    setActiveStep,
    availableSteps,
    currentStepIndex,
    isLastStep,
    stepQuestions: getQuestionsForStep(questions, activeStep, persona, fakultasList),

    answers,
    setAnswers,
    errors,

    isSelected,
    handleChange,
    handleExtraChange,
    isBrokenQuestion,

    showResultModal,
    setShowResultModal,

    startSimulation,
    handleNextStep,
    handlePrevStep,
    handleSimulateSubmit,
  };
}
