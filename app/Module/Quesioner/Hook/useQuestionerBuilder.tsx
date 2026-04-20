"use client";

import { useEffect, useMemo, useState } from "react";
import { Question } from "../Attribut/Question";
import { AnswerState } from "../Attribut/AnswerState";
import { Option } from "../Attribut/Option";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { useToast } from "../../Common/Context/ToastContext";
import apiCall from "../../Common/External/APICall";

type LoadingState = "kuesioner" | "pertanyaan" | null;

type BankSoalState = {
  dataQuestion: Question[];
  dataAnsware: AnswerState;
  data: any;

  loading: LoadingState;

  userFakultas?: string | null;
  userProdi?: string | null;
};

export function useQuestionerBuilder() {
  // const { pushToast } = useToast();

  const [state, setState] = useState<BankSoalState>({
    dataQuestion: [],
    dataAnsware: {},
    data: null,

    loading: null,

    // userFakultas: "hukum",
    // userProdi: "hukum (s1)",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [status, setStatus] = useState("initial");

  const [stepIndex, setStepIndex] = useState({
    total: 0,
    current: 0,
  });

  const [initialized, setInitialized] = useState(false);

  const STEPS: Array<"admin" | "fakultas" | "prodi"> = [
    "admin",
    "fakultas",
    "prodi",
  ];

  const { dataQuestion, dataAnsware, data, loading, userFakultas, userProdi } =
    state;

  /* =====================================================
     LOAD SINGLE QUESTION
  ===================================================== */
  async function loadQuestion(
    uuidTemplatePertanyaan: string,
  ): Promise<Question | null> {
    try {
      const res = await apiCall.get(
        `templatepertanyaan/${uuidTemplatePertanyaan}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        },
      );

      const item = res.data?.data ?? res.data;

      if (!item) return null;

      const pilihan: Option[] = Array.isArray(item.ListJawaban)
        ? item.ListJawaban.sort((a: any, b: any) => a.Nilai - b.Nilai).map(
            (j: any) => ({
              label: j.Jawaban,
              value: String(j.UUID),
              freetext: j.IsFreeText === 1,
            }),
          )
        : [];

      return {
        id: String(item.ID),
        uuid: String(item.UUID),
        pertanyaan: item.Pertanyaan,
        required: item.Required === 1,

        created: item.Prodi ? "prodi" : item.Fakultas ? "fakultas" : "admin",

        createdBy: item.Prodi || item.Fakultas || "admin",

        tipe: item.JenisPilihan,
        pilihan,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /* =====================================================
     LOAD MAIN DATA
  ===================================================== */
  async function loadData(uuidKuesioner: string) {
    try {
      setState((p) => ({
        ...p,
        loading: "kuesioner",
        dataQuestion: [],
        dataAnsware: {},
      }));

      const res = await apiCall.get(`kuesioners/active/${uuidKuesioner}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });

      const kuesioner = res.data?.data ?? res.data;

      setState((p) => ({
        ...p,
        data: kuesioner,
      }));

      const targets: string[] = Array.isArray(kuesioner?.TargetPertanyaan)
        ? kuesioner.TargetPertanyaan
        : [];

      if (!targets.length) {
        setState((p) => ({
          ...p,
          loading: null,
        }));
        return;
      }

      setState((p) => ({
        ...p,
        loading: "pertanyaan",
      }));

      const rows = await Promise.all(
        targets.map((uuid: string) => loadQuestion(uuid)),
      );

      const questions = rows.filter(Boolean) as Question[];

      setState((p) => ({
        ...p,
        dataQuestion: questions,
        loading: null,
      }));
    } catch (error: any) {
      setState((p) => ({
        ...p,
        loading: null,
      }));

      if (!error.response) {
        throw new Error("Server error");
        // pushToast("Server error");
      } else {
        const { status, data } = error.response;

        const cf = handleCloudflareError(status);

        if (cf) {
          throw new Error(cf);
          // pushToast(cf);
        } else {
          throw new Error(data?.message || "Error");
          // pushToast(data?.message || "Error");
        }
      }
    }
  }

  /* =====================================================
     HELPERS
  ===================================================== */
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

  /* =====================================================
     AVAILABLE STEP
  ===================================================== */
  const availableSteps = useMemo(() => {
    return STEPS.filter((step) => {
      if (step === "admin") {
        return dataQuestion.some((q) => q.created === "admin");
      }

      if (step === "fakultas") {
        return dataQuestion.some(
          (q) => q.created === "fakultas" && q.createdBy === userFakultas,
        );
      }

      if (step === "prodi") {
        return dataQuestion.some(
          (q) => q.created === "prodi" && q.createdBy === userProdi,
        );
      }

      return false;
    });
  }, [dataQuestion, userFakultas, userProdi]);

  const activeStep =
    availableSteps.length > 0
      ? availableSteps[Math.min(stepIndex.current, availableSteps.length - 1)]
      : null;

  /* =====================================================
     FILTER DATA
  ===================================================== */
  const filteredData = useMemo(() => {
    if (!activeStep) return [];

    return dataQuestion.filter((q) => {
      if (q.created !== activeStep) return false;

      if (q.created === "admin") return true;
      if (q.created === "fakultas") return q.createdBy === userFakultas;
      if (q.created === "prodi") return q.createdBy === userProdi;

      return false;
    });
  }, [activeStep, dataQuestion, userFakultas, userProdi]);

  /* =====================================================
     VALIDATION
  ===================================================== */
  const validateStep = (stepQuestions: Question[]) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const q of stepQuestions) {
      const ans = dataAnsware[q.id];

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
        newErrors[q.id] = "Harap isi keterangan pilihan Other";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  /* =====================================================
     AUTO STEP FLOW
  ===================================================== */
  useEffect(() => {
    if (loading || initialized || !availableSteps.length) return;

    let nextIndex = 0;

    while (nextIndex < availableSteps.length) {
      const step = availableSteps[nextIndex];

      const stepQuestions = dataQuestion.filter((q) => q.created === step);

      const required = stepQuestions.filter((q) => q.required);

      const allDone = required.every((q) => {
        const ans = dataAnsware[q.id];

        if (!ans) return false;

        if (q.tipe === "rating") return typeof ans.value === "number";

        if (Array.isArray(ans.value)) return ans.value.length > 0;

        return !!ans.value;
      });

      const freetextValid = required.every((q) =>
        isFreetextValid(q, dataAnsware[q.id]),
      );

      if (required.length > 0 && allDone && freetextValid) {
        nextIndex++;
      } else {
        break;
      }
    }

    setStepIndex((p) => ({
      ...p,
      current: Math.min(nextIndex, availableSteps.length - 1),
      total: availableSteps.length,
    }));

    setInitialized(true);
  }, [loading, initialized, availableSteps, dataQuestion, dataAnsware]);

  /* =====================================================
     CHANGE ANSWER
  ===================================================== */
  const handleChange = (
    qid: string,
    option: Option,
    type: "radio" | "checkbox",
  ) => {
    setState((prev) => {
      const current = prev.dataAnsware[qid]?.value;

      if (type === "radio") {
        return {
          ...prev,
          dataAnsware: {
            ...prev.dataAnsware,
            [qid]: {
              value: option,
            },
          },
        };
      }

      const arr = Array.isArray(current) ? [...current] : [];

      const exists = arr.some((v) => isOption(v) && v.value === option.value);

      return {
        ...prev,
        dataAnsware: {
          ...prev.dataAnsware,
          [qid]: {
            value: exists
              ? arr.filter((v) => isOption(v) && v.value !== option.value)
              : [...arr, option],
          },
        },
      };
    });

    setErrors((p) => {
      const copy = { ...p };
      delete copy[qid];
      return copy;
    });
  };

  /* =====================================================
     CHANGE EXTRA
  ===================================================== */
  const handleExtraChange = (qid: string, optVal: string, val: string) => {
    setState((prev) => ({
      ...prev,
      dataAnsware: {
        ...prev.dataAnsware,
        [qid]: {
          ...prev.dataAnsware[qid],
          extra: {
            ...prev.dataAnsware[qid]?.extra,
            [optVal]: val,
          },
        },
      },
    }));

    setErrors((p) => {
      const copy = { ...p };
      delete copy[qid];
      return copy;
    });
  };

  /* =====================================================
     CHECK SELECTED
  ===================================================== */
  const isSelected = (
    qid: string,
    option: Option,
    type: "radio" | "checkbox",
  ) => {
    const val = dataAnsware[qid]?.value;

    if (type === "checkbox") {
      return (
        Array.isArray(val) &&
        val.some((v) => isOption(v) && v.value === option.value)
      );
    }

    return isOption(val) && val.value === option.value;
  };

  /* =====================================================
     SUBMIT
  ===================================================== */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const step = availableSteps[stepIndex.current];
    if (!step) return;

    const stepQuestions = filteredData;

    const hasBroken = stepQuestions.some(
      (q) => q.pilihan.filter((p) => p.freetext).length > 1,
    );

    if (hasBroken) {
      setToast("Tidak dapat kirim karena ada pertanyaan tidak valid");
      return;
    }

    const isValid = validateStep(stepQuestions);

    if (!isValid) {
      setToast("Harap lengkapi semua pertanyaan");
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

  /* =====================================================
     RETURN
  ===================================================== */
  return {
    state,
    data,

    errors,
    toast,
    status,

    stepIndex,
    activeStep,
    filteredData,
    availableSteps,

    setState,
    setErrors,
    setToast,
    setStatus,
    setStepIndex,

    loadData,

    validateStep,
    handleChange,
    handleExtraChange,
    isSelected,

    handleSubmit,
  };
}
