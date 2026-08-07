"use client";

import { useState } from "react";
import { useRekapResponden } from "../Hook/useRekapResponden";
import { RekapRespondenItem } from "../Attribut/RekapRespondenTypes";
import RekapRespondenFilter from "../Organisms/RekapRespondenFilter";
import RekapRespondenTable from "../Organisms/RekapRespondenTable";
import RespondentQuestionnaireModal from "../Organisms/RespondentQuestionnaireModal";

import {
  ExportJobState,
  runExportRekapExcelJob,
} from "../Service/ExportRekapRespondenJob";
import ExportBackgroundJobWidget from "../Organisms/ExportBackgroundJobWidget";

export default function RekapRespondenTemplate() {
  const [selectedRespondent, setSelectedRespondent] = useState<RekapRespondenItem | null>(null);
  const [exportJob, setExportJob] = useState<ExportJobState | null>(null);

  const {
    bankSoalOptions,
    selectedBankSoal,
    setSelectedBankSoal,
    respondents,
    loadingData,
    page,
    setPage,
    limit,
    total,
    search,
    setSearch,
  } = useRekapResponden();

  const handleExportExcel = () => {
    if (!selectedBankSoal) return;

    runExportRekapExcelJob({
      bankSoal: selectedBankSoal,
      onProgress: (state) => setExportJob(state),
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto relative">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
            Rekap Responden
          </h1>
          <p className="text-sm text-outline font-medium mt-1">
            Daftar responden yang telah mengisi kuesioner berdasarkan Bank Soal
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <RekapRespondenFilter
        bankSoalOptions={bankSoalOptions}
        selectedBankSoal={selectedBankSoal}
        onSelectBankSoal={setSelectedBankSoal}
        search={search}
        onSearchChange={setSearch}
        onExportExcel={handleExportExcel}
        exporting={exportJob?.status === "running"}
      />

      {/* Table Section */}
      <RekapRespondenTable
        selectedBankSoal={selectedBankSoal}
        respondents={respondents}
        loading={loadingData}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onView={(item) => setSelectedRespondent(item)}
      />

      {/* Respondent Questionnaire Modal */}
      {selectedRespondent && (
        <RespondentQuestionnaireModal
          item={selectedRespondent}
          onClose={() => setSelectedRespondent(null)}
        />
      )}

      {/* Background Job Toast / Widget */}
      <ExportBackgroundJobWidget
        job={exportJob}
        onDismiss={() => setExportJob(null)}
      />
    </div>
  );
}
