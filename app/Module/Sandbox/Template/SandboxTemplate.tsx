"use client";

import { useSandbox } from "../Hook/useSandbox";
import SandboxConfigurator from "../Organisms/SandboxConfigurator";
import SandboxQuestionnairePlayer from "../Organisms/SandboxQuestionnairePlayer";
import SandboxResultModal from "../Organisms/SandboxResultModal";

export default function SandboxTemplate() {
  const {
    userLevel,
    isFacultyLocked,
    isProdiLocked,

    bankSoalOptions,
    selectedBankSoal,
    setSelectedBankSoal,
    selectedBankSoalDetail,

    simulationDateStr,
    setSimulationDateStr,

    persona,
    setPersona,

    isSimulating,
    setIsSimulating,

    loadingQuestions,

    activeStep,
    setActiveStep,
    availableSteps,
    currentStepIndex,
    isLastStep,
    stepQuestions,

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
  } = useSandbox();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* PAGE TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
              Sandbox Simulasi Kuesioner
            </h1>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white shadow-sm">
              DRY RUN MODE
            </span>
          </div>
          <p className="text-sm text-outline font-medium mt-1">
            Lakukan simulasi pengisian instrumen kuesioner terhadap mahasiswa, dosen, atau tendik tanpa menyimpan ke database
          </p>
        </div>
      </div>

      {/* CONFIGURATOR OR PLAYER */}
      {!isSimulating ? (
        <SandboxConfigurator
          bankSoalOptions={bankSoalOptions}
          selectedBankSoal={selectedBankSoal}
          onSelectBankSoal={setSelectedBankSoal}
          selectedBankSoalDetail={selectedBankSoalDetail}
          simulationDateStr={simulationDateStr}
          onSimulationDateChange={setSimulationDateStr}
          userLevel={userLevel}
          isFacultyLocked={isFacultyLocked}
          isProdiLocked={isProdiLocked}
          persona={persona}
          onPersonaChange={setPersona}
          onStartSimulation={startSimulation}
          loading={loadingQuestions}
        />
      ) : (
        <SandboxQuestionnairePlayer
          persona={persona}
          bankSoalTitle={selectedBankSoal?.label || "Kuesioner"}
          activeStep={activeStep}
          availableSteps={availableSteps}
          currentStepIndex={currentStepIndex}
          isLastStep={isLastStep}
          simulationDateStr={simulationDateStr}
          onSimulationDateChange={setSimulationDateStr}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          questions={stepQuestions}
          answers={answers}
          errors={errors}
          isSelected={isSelected}
          handleChange={handleChange}
          handleExtraChange={handleExtraChange}
          isBrokenQuestion={isBrokenQuestion}
          setAnswers={setAnswers}
          onSimulateSubmit={handleSimulateSubmit}
          onReset={() => setIsSimulating(false)}
        />
      )}

      {/* RESULT MODAL */}
      {showResultModal && (
        <SandboxResultModal
          persona={persona}
          bankSoalTitle={selectedBankSoal?.label || "Kuesioner"}
          answers={answers}
          onClose={() => {
            setShowResultModal(false);
            setIsSimulating(false);
          }}
          onRestart={() => {
            setShowResultModal(false);
            startSimulation();
          }}
        />
      )}
    </div>
  );
}
