"use client";

import Complete from "../Organisms/Complete";
import NotFound from "../Organisms/NotFound";
import Problem from "../Organisms/Problem";
import QuestionerLayout from "./QuestionerLayout";
import QuestionForm from "../Organisms/QuestionForm";
import InitialSection from "../Organisms/InitialSection";
import { useQuestionerBuilder } from "../Hook/useQuestionerBuilder";

export default function QuesionerBuilderTemplate() {
  const {
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
  } = useQuestionerBuilder();

  return (
    <>
      {loading ? (
        <div className="w-full flex items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : status === "initial" ? (
        <InitialSection
          summary={{ admin: 2, fakultas: 2, prodi: 1 }}
          info={{
            title: "Evaluasi Akademik & Fasilitas",
            year: "2026",
            semester: "Genap",
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
            answers={answers}
            errors={errors}
            toast={toast}
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
          {status === "problem" && <Problem />}
        </div>
      )}
    </>
  );
}
