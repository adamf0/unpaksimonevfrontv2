"use client";

import { useEffect, useMemo, useState } from "react";
import { Question } from "../Attribut/Question";
import { AnswerState } from "../Attribut/AnswerState";
import { Option } from "../Attribut/Option";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import apiCall from "../../Common/External/APICall";
import { AccountInfo } from "../../Common/Attribut/AccountInfo";

type LoadingState = "kuesioner" | "pertanyaan" | "form" | null;

type BankSoalState = {
  dataQuestion: Question[];
  dataAnsware: AnswerState;
  userInfo: AccountInfo | null;
  data: any;
  fakultasList: any[];

  loading: LoadingState;
  error?: string | null;

  userFakultas?: string | null;
  userProdi?: string | null;
};

export function isFakultasCodeOrNameMatch(
  itemFakCode?: string | null,
  itemFakName?: string | null,
  userFakCode?: string | null,
  userFakName?: string | null,
  fakultasList: any[] = [],
): boolean {
  const c1 = String(itemFakCode || "").trim();
  const c2 = String(userFakCode || "").trim();
  if (c1 && c2 && c1 === c2) return true;

  const n1 = String(itemFakName || "").toLowerCase().trim();
  const n2 = String(userFakName || "").toLowerCase().trim();
  if (n1 && n2 && (n1.includes(n2) || n2.includes(n1))) return true;

  const dynamicMap: Record<string, string> = {};
  for (const f of fakultasList) {
    const code = String(f.KodeFakultas || f.kode_fakultas || f.Kode || f.ID || "").trim();
    const name = String(f.NamaFakultas || f.nama_fakultas || f.Nama || "").toLowerCase().trim();
    if (code && name) {
      dynamicMap[code] = name;
    }
  }

  const nameFromC1 = dynamicMap[c1] || n1;
  const nameFromC2 = dynamicMap[c2] || n2;

  if (nameFromC1 && nameFromC2 && (nameFromC1.includes(nameFromC2) || nameFromC2.includes(nameFromC1))) {
    return true;
  }

  return false;
}

export function isProdiCodeOrNameMatch(
  itemProdiCode?: string | null,
  itemProdiName?: string | null,
  userProdiCode?: string | null,
  userProdiName?: string | null,
): boolean {
  const c1 = String(itemProdiCode || "").trim();
  const c2 = String(userProdiCode || "").trim();
  if (c1 && c2 && c1 === c2) return true;

  const n1 = String(itemProdiName || "").toLowerCase().trim();
  const n2 = String(userProdiName || "").toLowerCase().trim();
  if (n1 && n2 && (n1.includes(n2) || n2.includes(n1))) return true;

  return false;
}

export function useQuestionerBuilder() {
  const [state, setState] = useState<BankSoalState>({
    dataQuestion: [],
    dataAnsware: {},
    userInfo: null,
    data: null,
    fakultasList: [],

    loading: null,
    error: null,

    userFakultas: null,
    userProdi: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [status, setStatus] = useState("initial");

  const [stepIndex, setStepIndex] = useState({
    total: 0,
    current: 0,
  });

  const [initialized, setInitialized] = useState(false);

  type AvailableRole = "admin" | "fakultas" | "prodi";

  const { dataQuestion, dataAnsware, data, loading, userFakultas, userProdi } =
    state;

  function isDateActive(start?: string | null, end?: string | null) {
    if (!start || !end) {
      return false;
    }

    const now = new Date();
    const sDate = new Date(start);
    const eDate = new Date(end);

    sDate.setHours(0, 0, 0, 0);
    eDate.setHours(23, 59, 59, 999);

    return now >= sDate && now <= eDate;
  }

  function getAvailableRoleByTime(
    kuesioner: any,
    userInfo: AccountInfo | null,
    fakultasList: any[] = [],
  ): AvailableRole[] {
    const result: AvailableRole[] = [];

    // ---------- ADMIN / FAKULTAS / PRODI (MAIN SCHEDULE) ----------
    if (isDateActive(kuesioner.TanggalMulai, kuesioner.TanggalAkhir)) {
      result.push("admin", "fakultas", "prodi");
    }

    // ---------- EXTENSION ----------
    for (const item of kuesioner.ListExt || []) {
      const fakMatch = isFakultasCodeOrNameMatch(
        item.KodeFakultas,
        item.NamaFakultas,
        userInfo?.RefFakultas,
        userInfo?.Fakultas,
        fakultasList,
      );

      if (
        (item.Role === "fakultas" || String(item.Role || "").toLowerCase().includes("fakultas")) &&
        fakMatch &&
        isDateActive(item.TanggalMulai, item.TanggalAkhir)
      ) {
        result.push("fakultas");
      }

      const prodiMatch = isProdiCodeOrNameMatch(
        item.KodeProdi,
        item.NamaProdi,
        userInfo?.RefProdi,
        userInfo?.Prodi,
      );

      if (
        (item.Role === "prodi" || String(item.Role || "").toLowerCase().includes("prodi")) &&
        prodiMatch &&
        isDateActive(item.TanggalMulai, item.TanggalAkhir)
      ) {
        result.push("prodi");
      }
    }

    return [...new Set(result)];
  }

  function getAvailableRoleByQuestion(
    dataQuestion: Question[],
    userFakultas?: string | null,
    userProdi?: string | null,
    userInfo?: AccountInfo | null,
    fakultasList: any[] = [],
  ): AvailableRole[] {
    const STEPS: AvailableRole[] = ["admin", "fakultas", "prodi"];

    return STEPS.filter((step) => {
      // ---------- ADMIN ----------
      if (step === "admin") {
        return dataQuestion.some((q) => q.created === "admin");
      }

      // ---------- FAKULTAS ----------
      if (step === "fakultas") {
        return dataQuestion.some(
          (q) =>
            q.created === "fakultas" &&
            isFakultasCodeOrNameMatch(
              q.createdBy,
              (q as any)._raw?.Fakultas || (q as any)._raw?.CreatedByRef,
              userInfo?.RefFakultas,
              userInfo?.Fakultas || userFakultas,
              fakultasList,
            ),
        );
      }

      // ---------- PRODI ----------
      if (step === "prodi") {
        return dataQuestion.some(
          (q) =>
            q.created === "prodi" &&
            isProdiCodeOrNameMatch(
              q.createdBy,
              (q as any)._raw?.Prodi,
              userInfo?.RefProdi,
              userInfo?.Prodi || userProdi,
            ),
        );
      }

      return false;
    });
  }

  function getAvailableQuestioner(
    kuesioner: any,
    userInfo: AccountInfo | null,
    dataQuestion: Question[],
    userFakultas?: string | null,
    userProdi?: string | null,
    fakultasList: any[] = [],
  ): AvailableRole[] {
    const availableByTime = getAvailableRoleByTime(kuesioner, userInfo, fakultasList);

    const availableByQuestion = getAvailableRoleByQuestion(
      dataQuestion,
      userFakultas,
      userProdi,
      userInfo,
      fakultasList,
    );

    return availableByTime.filter((role) => availableByQuestion.includes(role));
  }

  /* =====================================================
     LOAD SINGLE QUESTION
  ===================================================== */
  async function loadQuestion(
    uuidTemplatePertanyaan: string,
  ): Promise<Question | null> {
    try {
      const res = await apiCall.get(
        `templatepertanyaan/${uuidTemplatePertanyaan}/template`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || sessionStorage.getItem("access_token")}`,
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

      const cb = String(item.CreatedBy || item.CreatedByRef || "").toLowerCase();
      const created = item.Prodi ? "prodi" : item.Fakultas || cb.includes("fakultas") ? "fakultas" : "admin";
      const createdBy = item.Prodi || item.Fakultas || item.CreatedByRef || "admin";

      return {
        id: String(item.ID),
        uuid: String(item.UUID),
        pertanyaan: item.Pertanyaan,
        required: item.Required === 1,
        created,
        createdBy,
        tipe: item.JenisPilihan,
        fullpath: item?.FullPath ?? "General",
        pilihan,
        _raw: item,
      } as any;
    } catch (error) {
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

      const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

      const [res, resJawaban, resUser, resFakultas] = await Promise.allSettled([
        apiCall.get(`kuesioners/active/${uuidKuesioner}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        apiCall.get(`kuesioner/${uuidKuesioner}/jawaban`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        apiCall.get(`whoami`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        apiCall.get(`fakultass?mode=all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const kuesioner = res.status === "fulfilled" ? (res.value.data?.data ?? res.value.data) : null;
      const jawaban = resJawaban.status === "fulfilled" ? (resJawaban.value.data?.data ?? resJawaban.value.data) : [];
      const userInfo: AccountInfo | null = resUser.status === "fulfilled" ? resUser.value.data : null;
      const fakultasList: any[] = resFakultas.status === "fulfilled" ? (resFakultas.value.data?.data ?? resFakultas.value.data ?? []) : [];

      setState((p) => ({
        ...p,
        data: kuesioner,
        userInfo: userInfo,
        fakultasList: fakultasList,
        userFakultas: userInfo?.Fakultas || userInfo?.RefFakultas || null,
        userProdi: userInfo?.Prodi || userInfo?.RefProdi || null,
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
      const mappedAnswers: AnswerState = {};

      for (const q of questions) {
        const rowsByQuestion = jawaban.filter(
          (x: any) => x.UuidTemplatePertanyaan === q.uuid,
        );

        if (!rowsByQuestion.length) continue;

        const selectedOptions: Option[] = [];
        const extra: Record<string, string> = {};

        for (const row of rowsByQuestion) {
          if (row.UuidTemplateJawaban) {
            const found = q.pilihan.find(
              (p) => p.value === row.UuidTemplateJawaban,
            );

            if (found) {
              selectedOptions.push(found);

              if (row.FreeText) {
                extra[found.value] = row.FreeText;
              }
            }
          }
        }

        if (q.tipe === "rating") {
          mappedAnswers[q.uuid] = {
            value: selectedOptions[0] ?? null,
            extra,
          };
        } else if (q.tipe === "radio") {
          mappedAnswers[q.uuid] = {
            value: selectedOptions[0] ?? null,
            extra,
          };
        } else {
          mappedAnswers[q.uuid] = {
            value: selectedOptions,
            extra,
          };
        }
      }

      setState((p) => ({
        ...p,
        dataQuestion: questions,
        dataAnsware: mappedAnswers,
        loading: null,
        error: null,
      }));
    } catch (error: any) {
      setState((p) => ({
        ...p,
        loading: null,
        error: error,
      }));

      if (!error.response) {
        setState((p) => ({
          ...p,
          error: "Server error",
        }));
      } else {
        const { status, data } = error.response;
        const cf = handleCloudflareError(status);

        if (cf) {
          setState((p) => ({
            ...p,
            error: cf,
          }));
        } else {
          setState((p) => ({
            ...p,
            error: data?.message || "Error",
          }));
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
    if (!state.data || !state.userInfo) {
      return [];
    }

    return getAvailableQuestioner(
      state.data,
      state.userInfo,
      dataQuestion,
      userFakultas,
      userProdi,
      state.fakultasList,
    );
  }, [state.data, state.userInfo, dataQuestion, userFakultas, userProdi, state.fakultasList]);

  const activeStep =
    availableSteps.length > 0
      ? availableSteps[Math.min(stepIndex.current, availableSteps.length - 1)]
      : null;

  /* =====================================================
     FILTER DATA
  ===================================================== */
  const filteredData = useMemo(() => {
    if (!activeStep) return [];

    return dataQuestion.filter((q: Question) => {
      if (q.created !== activeStep) return false;

      if (q.created === "admin") return true;
      if (q.created === "fakultas") {
        return isFakultasCodeOrNameMatch(
          q.createdBy,
          (q as any)._raw?.Fakultas || (q as any)._raw?.CreatedByRef,
          state.userInfo?.RefFakultas,
          state.userInfo?.Fakultas || userFakultas,
          state.fakultasList,
        );
      }
      if (q.created === "prodi") {
        return isProdiCodeOrNameMatch(
          q.createdBy,
          (q as any)._raw?.Prodi,
          state.userInfo?.RefProdi,
          state.userInfo?.Prodi || userProdi,
        );
      }

      return false;
    });
  }, [activeStep, dataQuestion, userFakultas, userProdi, state.userInfo, state.fakultasList]);

  /* =====================================================
     VALIDATION
  ===================================================== */
  const validateStep = (stepQuestions: Question[]) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const q of stepQuestions) {
      const ans = dataAnsware[q.uuid];

      const empty =
        !ans ||
        (Array.isArray(ans.value) && ans.value.length === 0) ||
        (!Array.isArray(ans.value) && !ans.value);

      if (q.required && empty) {
        newErrors[q.uuid] = "Pertanyaan ini wajib diisi";
        isValid = false;
        continue;
      }

      if (!isFreetextValid(q, ans)) {
        newErrors[q.uuid] = "Harap isi keterangan pilihan Other";
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
        const ans = dataAnsware[q.id!];
        if (!ans) return false;
        if (q.tipe === "rating") return typeof ans.value === "number";
        if (Array.isArray(ans.value)) return ans.value.length > 0;
        return !!ans.value;
      });

      const freetextValid = required.every((q) =>
        isFreetextValid(q, dataAnsware[q.id!]),
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
    type: "radio" | "multiple",
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
    type: "radio" | "multiple",
  ) => {
    const val = dataAnsware[qid]?.value;

    if (type === "multiple") {
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
  const handleSubmit = async (e: React.FormEvent) => {
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

    const payload = Object.entries(dataAnsware)
      .map(([uuidPertanyaan, item]) => {
        const values = Array.isArray(item.value)
          ? item.value
          : item.value !== null
            ? [item.value]
            : [];

        const jawaban = values
          .filter(
            (opt): opt is Option =>
              typeof opt === "object" && opt !== null && "value" in opt,
          )
          .map((opt) => ({
            uuid: opt.value,
            freetext: item.extra?.[opt.value] ?? "",
          }));

        return {
          pertanyaan: uuidPertanyaan,
          jawaban,
        };
      })
      .filter((row) => row.jawaban.length > 0);

    try {
      setState((p) => ({
        ...p,
        loading: "form",
      }));

      await new Promise((resolve) => setTimeout(resolve, 1500));

      await Promise.allSettled(
        payload.map((row) => {
          const formData = new FormData();

          formData.append("pertanyaan", row.pertanyaan);
          formData.append("jawaban", JSON.stringify(row.jawaban));

          return apiCall.post(
            `/kuesioner/${state?.data?.UUIDKuesioner}/jawaban`,
            formData,
          );
        }),
      );
      setState((p) => ({
        ...p,
        loading: null,
      }));

      const isLastStep = stepIndex.current >= availableSteps.length - 1;

      if (!isLastStep) {
        setStepIndex((prev) => ({
          ...prev,
          current: prev.current + 1,
        }));
        return;
      }

      setStatus("done");
    } catch (error: any) {
      if (!error.response) return setToast("Server error");

      const { status, data } = error.response;

      const cf = handleCloudflareError(status);
      if (cf) return setToast(cf);

      setToast(data?.message || "Error");
    }
  };

  const isLastStep = availableSteps.length === 0 || stepIndex.current >= availableSteps.length - 1;
  const hasNextStep = availableSteps.length > 0 && stepIndex.current < availableSteps.length - 1;

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
    isLastStep,
    hasNextStep,

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
    dataQuestion,
  };
}
