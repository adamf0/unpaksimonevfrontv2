"use client";

import { useState, useMemo, useEffect } from "react";
import { Question } from "../Attribut/Question";
import { AnswerState } from "../Attribut/AnswerState";
import { Option } from "../Attribut/Option";

export function useQuestionerBuilder() {
  const [data, setData] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [status, setStatus] = useState("initial");

  const [stepIndex, setStepIndex] = useState({
    total: 0,
    current: 0,
  });

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const STEPS: Array<"admin" | "fakultas" | "prodi"> = [
    "admin",
    "fakultas",
    "prodi",
  ];

  const userFakultas = "hukum";
  const userProdi = "hukum (s1)";

  /* ================= AVAILABLE STEP ================= */
  const availableSteps = useMemo(() => {
    return STEPS.filter((step) => {
      if (step === "admin") {
        return data.some((q) => q.created === "admin");
      }
      if (step === "fakultas") {
        return data.some(
          (q) => q.created === "fakultas" && q.createdBy === userFakultas,
        );
      }
      if (step === "prodi") {
        return data.some(
          (q) => q.created === "prodi" && q.createdBy === userProdi,
        );
      }
      return false;
    });
  }, [data]);

  const activeStep =
    availableSteps.length > 0
      ? availableSteps[Math.min(stepIndex.current, availableSteps.length - 1)]
      : null;

  //[pr] menampilakn info kuesioner aktif & pengecekan tanggal aktif dari list
  /* ================= LOAD DATA ================= */
  async function loadQuestion(): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "111",
            pertanyaan: "01. How satisfied are you?",
            tipe: "radio",
            required: true,
            created: "admin",
            createdBy: "admin",
            pilihan: [
              { label: "Extremely Satisfied", value: "extreme" },
              { label: "Neutral", value: "neutral" },
              { label: "Other", value: "lainnya", freetext: true },
            ],
          },
          {
            id: "222",
            pertanyaan: "03. How satisfied are you?",
            tipe: "radio",
            required: false,
            created: "admin",
            createdBy: "admin",
            pilihan: [
              { label: "Extremely Satisfied", value: "extreme" },
              { label: "Neutral", value: "neutral" },
              { label: "Other", value: "lainnya", freetext: true },
            ],
          },
          {
            id: "333",
            pertanyaan: "03. What technologies improve learning?",
            tipe: "rating",
            required: true,
            created: "fakultas",
            createdBy: "hukum",
            pilihan: [],
          },
          {
            id: "444",
            pertanyaan: "04. What technologies improve learning?",
            tipe: "rating",
            required: false,
            created: "fakultas",
            createdBy: "hukum",
            pilihan: [],
          },
          {
            id: "555",
            pertanyaan: "05. Select multiple satisfaction factors",
            tipe: "checkbox",
            required: false,
            created: "prodi",
            createdBy: "hukum (s1)",
            pilihan: [
              { label: "Extremely Satisfied", value: "extreme" },
              { label: "Neutral", value: "neutral" },
              { label: "Other", value: "lainnya", freetext: true },
              { label: "Other2", value: "lainnya2", freetext: true },
            ],
          },
        ]);
      }, 1000);
    });
  }

  async function loadAnsware(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          "111": {
            value: { label: "Extremely Satisfied", value: "extreme" },
            extra: {},
          },
          "222": {
            value: null,
            extra: {},
          },
          "333": { value: 4 },
          "444": { value: 4 },
          "555": {
            value: [
              { label: "Extremely Satisfied", value: "extreme" },
              { label: "Other", value: "lainnya", freetext: true },
            ],
            extra: {
              lainnya: "Some custom answer",
            },
          },
        });
      }, 1000);
    });
  }

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [q, a] = await Promise.all([loadQuestion(), loadAnsware()]);
      setData(q);
      setAnswers(a);
      setLoading(false);
    };
    fetch();
  }, []);

  /* ================= HELPERS ================= */
  const isOption = (v: any): v is Option =>
    v && typeof v === "object" && "value" in v;

  const isFreetextValid = (q: Question, ans: any) => {
    if (!ans?.value) return true;

    const values = Array.isArray(ans.value) ? ans.value : [ans.value];

    return values.every((v: any) => {
      const opt = q.pilihan.find((p) => p.value === v.value);
      if (!opt?.freetext) return true;

      const extraVal = ans.extra?.[v.value];
      return typeof extraVal === "string" && extraVal.trim().length > 0;
    });
  };

  /* ================= VALIDATION ================= */
  const validateStep = (stepQuestions: Question[]) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const q of stepQuestions) {
      const ans = answers[q.id];

      const empty =
        !ans ||
        (Array.isArray(ans.value) && ans.value.length === 0) ||
        (!Array.isArray(ans.value) && !ans.value);

      if (q.required && empty) {
        newErrors[q.id] = "Pertanyaan ini wajib diisi";
        isValid = false;
        continue;
      }

      if (!isFreetextValid(q, ans)) {
        newErrors[q.id] = "Harap isi keterangan pada pilihan 'Other'";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    if (!activeStep) return [];

    return data.filter((q) => {
      if (q.created !== activeStep) return false;

      if (q.created === "admin") return true;
      if (q.created === "fakultas") return q.createdBy === userFakultas;
      if (q.created === "prodi") return q.createdBy === userProdi;

      return false;
    });
  }, [data, activeStep]);

  /* ================= FLOW ================= */
  useEffect(() => {
    if (loading || initialized || !availableSteps.length) return;

    let nextIndex = 0;

    while (nextIndex < availableSteps.length) {
      const step = availableSteps[nextIndex];

      const stepQuestions = data.filter((q) => {
        if (q.created !== step) return false;

        if (q.created === "admin") return true;
        if (q.created === "fakultas") return q.createdBy === userFakultas;
        if (q.created === "prodi") return q.createdBy === userProdi;

        return false;
      });

      const required = stepQuestions.filter((q) => q.required);

      const allDone = required.every((q) => {
        const ans = answers[q.id];
        if (!ans) return false;

        if (q.tipe === "rating") return typeof ans.value === "number";
        if (Array.isArray(ans.value)) return ans.value.length > 0;

        return !!ans.value;
      });

      const freetextValid = required.every((q) =>
        isFreetextValid(q, answers[q.id]),
      );

      if (required.length > 0 && allDone && freetextValid) {
        nextIndex++;
      } else {
        break;
      }
    }

    setStepIndex((prev) => ({
      ...prev,
      current: Math.min(nextIndex, availableSteps.length - 1),
    }));

    setInitialized(true);
  }, [loading, availableSteps, data, answers]);

  /* ================= SUBMIT ================= */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const step = availableSteps[stepIndex.current];
    if (!step) return;

    const stepQuestions = data.filter((q) => {
      if (q.created !== step) return false;

      if (q.created === "admin") return true;
      if (q.created === "fakultas") return q.createdBy === userFakultas;
      if (q.created === "prodi") return q.createdBy === userProdi;

      return false;
    });

    // ❗ BROKEN CHECK
    const hasBroken = stepQuestions.some(
      (q) => q.pilihan.filter((p) => p.freetext).length > 1,
    );

    if (hasBroken) {
      setToast("tidak dapat kirim karena ada pertanyaan tidak valid");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const isValid = validateStep(stepQuestions);

    if (!isValid) {
      setToast("Harap lengkapi semua pertanyaan");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const isLastStep = stepIndex.current >= availableSteps.length - 1;

    if (!isLastStep) {
      setStepIndex((prev) => ({
        ...prev,
        current: prev.current + 1,
      }));
      return;
    }

    setStatus("done");
  };

  /* ================= ACTIONS ================= */
  const handleChange = (
    qid: string,
    option: Option,
    type: "radio" | "checkbox",
  ) => {
    setAnswers((prev) => {
      const current = prev[qid]?.value;

      if (type === "radio") {
        return { ...prev, [qid]: { value: option } };
      }

      const arr = Array.isArray(current) ? [...current] : [];

      const exists = arr.some((v) => isOption(v) && v.value === option.value);

      return {
        ...prev,
        [qid]: {
          value: exists
            ? arr.filter((v) => isOption(v) && v.value !== option.value)
            : [...arr, option],
        },
      };
    });

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[qid];
      return copy;
    });
  };

  const handleExtraChange = (qid: string, optVal: string, val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: {
        ...prev[qid],
        extra: {
          ...prev[qid]?.extra,
          [optVal]: val,
        },
      },
    }));

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[qid];
      return copy;
    });
  };

  const isSelected = (
    qid: string,
    option: Option,
    type: "radio" | "checkbox",
  ) => {
    const val = answers[qid]?.value;

    if (type === "checkbox") {
      return (
        Array.isArray(val) &&
        val.some((v) => isOption(v) && v.value === option.value)
      );
    }

    return isOption(val) && val.value === option.value;
  };

  return {
    // ================= STATE =================
    data,
    answers,
    errors,
    toast,
    status,
    setStatus,

    stepIndex,
    setStepIndex,

    loading,
    initialized,

    activeStep,
    filteredData,
    availableSteps,

    // ================= ACTIONS =================
    handleSubmit,
    handleChange,
    handleExtraChange,

    // ================= HELPERS =================
    isSelected,
    isOption,
    isFreetextValid,
    validateStep,

    // ================= INTERNAL CONTROL (optional tapi berguna) =================
    setAnswers,
    setErrors,
    setToast,
    setData,
  };
}
