"use client";

import Complete from "../Organisms/Complete";
import NotFound from "../Organisms/NotFound";
import Problem from "../Organisms/Problem";
import QuestionerLayout from "./QuestionerLayout";
import QuestionForm from "../Organisms/QuestionForm";
import InitialSection from "../Organisms/InitialSection";
import { useQuestionerBuilder } from "../Hook/useQuestionerBuilder";
import { useEffect, useState } from "react";

type Props = {
  uuid: string;
};

export default function QuesionerBuilderTemplate({ uuid }: Props) {
  const {
    // ================= STATE =================
    state,
    setState,
    // data,
    // answers,
    errors,
    toast,
    status,
    setStatus,

    // stepIndex,
    // setStepIndex,

    // loading,
    // initialized,

    activeStep,
    filteredData,
    // availableSteps,

    // ================= ACTIONS =================
    handleSubmit,
    handleChange,
    handleExtraChange,

    // ================= HELPERS =================
    isSelected,
    // isOption,
    // isFreetextValid,
    // validateStep,

    // ================= INTERNAL CONTROL (optional tapi berguna) =================
    // setAnswers,
    // setErrors,
    // setToast,
    // setData,
    loadData,
  } = useQuestionerBuilder();

  const { loading, dataAnsware } = state;

  const [errorContext, _] = useState<{
    type: "auth" | "server" | "unknown";
    message?: string;
  } | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      setStatus("problem");
      return;
    }

    if (uuid) {
      loadData(uuid);
    }
  }, [uuid]);

  const setAnswers = (cb: any) => {
    setState((prev) => ({
      ...prev,
      dataAnsware: typeof cb === "function" ? cb(prev.dataAnsware) : cb,
    }));
  };

  return (
    <>
      {loading && ["kuesioner", "pertanyaan"].includes(loading) ? (
        <div className="w-full flex flex-col gap-4 items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />

          <p className="text-sm text-gray-500">
            {loading === "kuesioner" && "Memuat kuesioner..."}
            {loading === "pertanyaan" && "Memuat pertanyaan..."}
          </p>
        </div>
      ) : status === "initial" ? (
        <InitialSection
          summary={{
            admin: filteredData.filter((x) => x.created === "admin").length,
            fakultas: filteredData.filter((x) => x.created === "fakultas")
              .length,
            prodi: filteredData.filter((x) => x.created === "prodi").length,
          }}
          info={{
            title: state.data?.Judul || "-",
            year: state.data?.Semester || "-",
            semester: state.data?.Semester || "-",
          }}
          identity={{
            audiens: "adam furoqon - 065117251",
            fakultas: "Hukum",
            prodi: "Hukum (S1)",
          }}
          onStart={() => setStatus("process")}
        />
      ) : status === "process" ? (
        <QuestionerLayout activeStep={activeStep} onNextStep={() => {}}>
          <QuestionForm
            filteredData={filteredData}
            answers={dataAnsware}
            errors={errors}
            toast={toast}
            loading={loading=="form"} //ini tidak bekerja
            isBrokenQuestion={(q) =>
              q.pilihan.filter((p) => p.freetext).length > 1
            }
            isSelected={isSelected}
            handleChange={handleChange}
            handleExtraChange={handleExtraChange}
            setAnswers={setAnswers}
            handleSubmit={handleSubmit}
          />
        </QuestionerLayout>
      ) : (
        <div className="pt-32 pb-20 px-8 max-w-6xl mx-auto flex flex-col gap-32">
          {status === "done" && <Complete />}
          {status === "not_found" && <NotFound />}
          {status === "problem" && (
            <Problem
              title={
                errorContext?.type === "auth"
                  ? "Authentication Required"
                  : "Something Went South."
              }
              message={
                errorContext?.message ||
                "A technical glitch occurred while processing your request."
              }
              code={
                errorContext?.type === "auth"
                  ? `AUTH-401-${uuid}`
                  : "CQ-ERROR-992-PX"
              }
              sessionActive={errorContext?.type !== "auth"}
            />
          )}
        </div>
      )}
    </>
  );
}
