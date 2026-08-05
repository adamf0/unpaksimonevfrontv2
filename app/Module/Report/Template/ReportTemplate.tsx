"use client";

import DistributionSection from "../Organisms/DistributionSection";
import TopQuestionsSection from "../Organisms/TopQuestionsSection";
import ChartQuestionSection from "../Organisms/ChartQuestionSection";
import FilterSection from "../Organisms/FiltersSection";
import FourYearChart from "../Molecules/FourYearChart";
import { useEffect, useRef, useState } from "react";
import { useKuesionerReportContext } from "../Context/KuesionerReportContext";
import { FilterSidebar } from "../../Common/Components/Template/FilterSidebar";
import { ReportFilterForm } from "../Molecules/ReportFilterForm";
import FilterButton from "../Atoms/FilterButton";
import {
  exportDetailKuesioner,
  exportRekapKuesioner,
} from "../Service/ReportExport";
import ExportFab from "../Atoms/ExportFab";
import { adaptSelectOptionsMerge } from "../../Common/Adapter/adaptSelectOptionsMerge";
import { Payload } from "../Attribut/Payload";
import { useToast } from "../../Common/Context/ToastContext";

export default function ReportTemplate() {
  const {
    loadData,
    loadDataDetail,
    loadSummary,

    summaryData,
    loadingSummary,

    loadingDetail,
    loading,

    errdata,
    errdataDetail,

    dataBankSoal,

    topQuestions,
    yearlyStats,
    facultyStats,
    groupedByFullPath,

    open,
    query,
    setQuery,
    openFilter,
    closeFilter,
    resetFilters,
    resetDataDetail,

    filteredDetail,
  } = useKuesionerReportContext();
  const { pushToast } = useToast();

  const prevFilterRef = useRef<any>(null);
  const [bankOptions, setBankOptions] = useState<any[]>([]);
  // const [semesterOptions, setSemesterOptions] = useState<any[]>([]);

  // =========================
  // OPTIONS
  // =========================
  useEffect(() => {
    if (!dataBankSoal?.length) return;

    // setSemesterOptions(
    //   adaptSelectOptions(
    //     dataBankSoal.map((b: any) => ({
    //       value: b.Semester,
    //       label: b.Semester,
    //     })),
    //     { valueKey: "value", labelKey: "label" },
    //   ),
    // );

    setBankOptions(
      adaptSelectOptionsMerge(dataBankSoal, {
        valueKey: "UUID",
        labelKeys: ["Judul", "Semester"],
        template: "%s (%s)",
      }),
    );
  }, [dataBankSoal]);

  // =========================
  // RELOAD HANDLER DETAIL SAFE
  // =========================
  const handleReloadDetail = () => {
    const payload = prevFilterRef.current;

    if (!payload?.length) return;

    loadDataDetail(payload);
  };

  function hasDifferentJudul(bankSoal: any[]): boolean {
    const uniqueJudul = new Set(
      bankSoal.map((item: any) => {
        const judul = item.payload?.Judul?.trim() || "";
        const semester = item.payload?.Semester ?? "";

        return judul
          .replace(`(${semester})`, "")
          .replace(" - Semester Ganjil", "")
          .replace(" - Semester Genap", "")
          .trim();
      }),
    );

    return uniqueJudul.size > 1;
  }

  console.log("◉ groupedByFullPath", query);

  return (
    <>
      <FourYearChart
        data={yearlyStats}
        err={errdata}
        onReload={loadData}
        loading={loading}
      />

      <FilterSection
        bankSoalOptions={bankOptions}
        fakultasOptions={[]}
        prodiOptions={[]}
        semesterOptions={[]}
        onApply={async (val) => {
          if (hasDifferentJudul(val.bankSoal)) {
            pushToast("bank soal tidak boleh beda sumber");
            resetDataDetail();
            setQuery((prev: any) => ({
              ...prev,
              bankSoal: [],
            }));
            return;
          }

          if (!val?.bankSoal?.length) return;
          
          setQuery((prev: any) => ({
            ...prev,
            bankSoal: val.bankSoal,
          }));
          resetDataDetail();

          const selectedJudul = val.bankSoal[0]?.label || "";
          if (selectedJudul) {
            await loadSummary(selectedJudul, val.kode_fakultas, val.kode_prodi);
          }

          const payloads: Payload[] = val.bankSoal.map((item: any) => ({
            judul: item.label,
            semester: val?.semester?.label ?? "",
            is4year: "0",
          }));

          prevFilterRef.current = payloads;
        }}
      />

      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        <ExportFab
          disabled={!query.bankSoal?.length}
          filteredDetail={filteredDetail}
          groupedByFullPath={groupedByFullPath}
          summaryData={summaryData}
          exportRekapKuesioner={exportRekapKuesioner}
          exportDetailKuesioner={exportDetailKuesioner}
        />
        <FilterButton
          query={query}
          openFilter={openFilter}
          disabled={!query.bankSoal?.length}
        />
      </div>

      <FilterSidebar
        open={open}
        onClose={closeFilter}
        footer={
          <div className="flex flex-col gap-2">
            <button
              className="w-full bg-primary text-white py-2 rounded-lg font-bold"
              onClick={() => {
                closeFilter();
                if (query.bankSoal?.length) {
                  const selectedJudul = query.bankSoal[0].label;
                  loadSummary(selectedJudul, query.kode_fakultas, query.kode_prodi);
                }
              }}
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={() => {
                resetFilters();
                closeFilter();
                if (query.bankSoal?.length) {
                  const selectedJudul = query.bankSoal[0].label;
                  loadSummary(selectedJudul, null, null);
                }
              }}
              className="w-full py-2 rounded-lg border border-red-300 text-red-600 font-bold hover:bg-red-50 transition"
            >
              Reset Filter
            </button>
          </div>
        }
      >
        <ReportFilterForm value={query} onChange={setQuery} />
      </FilterSidebar>

      <TopQuestionsSection
        data={topQuestions}
        err={errdataDetail}
        onReload={handleReloadDetail}
        loading={loadingSummary || loadingDetail}
      />

      <hr className="my-6 border-slate-400" />

      <DistributionSection
        data={facultyStats}
        err={errdataDetail}
        onReload={handleReloadDetail}
        loading={loadingSummary || loadingDetail}
      />

      {/* =========================
          DATA DETAIL SECTION
      ========================= */}
      {!errdataDetail && (
        <>
          <hr className="my-6 border-slate-400" />

          {(groupedByFullPath ?? []).map((group) => (
            <ChartQuestionSection
              key={group.fullPath}
              full_path={group.fullPath}
              data={group.pertanyaan}
            />
          ))}
        </>
      )}
    </>
  );
}
