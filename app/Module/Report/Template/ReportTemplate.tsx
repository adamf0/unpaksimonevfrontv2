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
          const bankSoalArr = Array.isArray(val.bankSoal)
            ? val.bankSoal
            : val.bankSoal
              ? [val.bankSoal]
              : [];

          if (hasDifferentJudul(bankSoalArr)) {
            pushToast("bank soal tidak boleh beda sumber");
            resetDataDetail();
            setQuery((prev: any) => ({
              ...prev,
              bankSoal: [],
            }));
            return;
          }

          if (!bankSoalArr.length) return;

          setQuery((prev: any) => ({
            ...prev,
            bankSoal: bankSoalArr,
          }));
          resetDataDetail();

          const selectedJudul = bankSoalArr[0]?.label || "";
          if (selectedJudul) {
            await loadSummary(
              selectedJudul,
              val.kode_fakultas || (val.fakultas ? String(val.fakultas.value) : null),
              val.kode_prodi || (val.prodi ? String(val.prodi.value) : null),
              val.unit || (val.unitObj ? String(val.unitObj.value) : null),
            );
          }

          const payloads: Payload[] = bankSoalArr.map((item: any) => ({
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
              onClick={async () => {
                closeFilter();
                if (query.bankSoal?.length) {
                  const selectedJudul = query.bankSoal[0].label;
                  await loadSummary(
                    selectedJudul,
                    query.kode_fakultas,
                    query.kode_prodi,
                    (query as any).unit || null,
                  );
                  handleReloadDetail();
                }
              }}
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={async () => {
                resetFilters();
                closeFilter();
                if (query.bankSoal?.length) {
                  const selectedJudul = query.bankSoal[0].label;
                  await loadSummary(selectedJudul, null, null, null);
                  handleReloadDetail();
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

          {(groupedByFullPath ?? []).map((group, idx) => (
            <ChartQuestionSection
              key={`${group.fullPath}-${idx}`}
              full_path={group.fullPath}
              data={group.pertanyaan}
            />
          ))}
        </>
      )}
    </>
  );
}
