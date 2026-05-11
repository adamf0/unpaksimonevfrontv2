"use client";

import DistributionSection from "../Organisms/DistributionSection";
import TopQuestionsSection from "../Organisms/TopQuestionsSection";
import ChartQuestionSection from "../Organisms/ChartQuestionSection";
import FilterSection from "../Organisms/FiltersSection";
import FourYearChart from "../Molecules/FourYearChart";
import { useEffect, useRef, useState } from "react";
import { adaptSelectOptions } from "../../Common/Adapter/adaptSelectOptions";
import { useKuesionerReportContext } from "../Context/KuesionerReportContext";
import { FilterSidebar } from "../../Common/Components/Template/FilterSidebar";
import { ReportFilterForm } from "../Molecules/ReportFilterForm";
import FilterButton from "../Atoms/FilterButton";
import {
  exportDetailKuesioner,
  exportRekapKuesioner,
} from "../Service/ReportExport";
import ExportFab from "../Atoms/ExportFab";

export default function ReportTemplate() {
  const {
    loadData,
    loadDataDetail,

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

    filteredDetail,
  } = useKuesionerReportContext();

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
      adaptSelectOptions(dataBankSoal, {
        valueKey: "UUID",
        labelKey: "Judul",
      }),
    );
  }, [dataBankSoal]);

  // =========================
  // RELOAD HANDLER DETAIL SAFE
  // =========================
  const handleReloadDetail = () => {
    const payload = prevFilterRef.current;

    if (!payload) return;

    loadDataDetail(payload);
  };

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
        onApply={(val) => {
          if (!val?.bankSoal?.label) return;

          setQuery((prev: any) => ({
            ...prev,
            bankSoal: val?.bankSoal,
          }));

          const payload = {
            judul: val.bankSoal.label,
            semester: val?.semester?.label ?? "",
            is4year: "0",
          };

          prevFilterRef.current = payload;

          loadDataDetail(payload);
        }}
      />

      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
        <ExportFab
          disabled={!query.bankSoal}
          filteredDetail={filteredDetail}
          groupedByFullPath={groupedByFullPath}
          exportRekapKuesioner={exportRekapKuesioner}
          exportDetailKuesioner={exportDetailKuesioner}
        />
        <FilterButton query={query} openFilter={openFilter} disabled={!query.bankSoal}/>
      </div>

      <FilterSidebar
        open={open}
        onClose={closeFilter}
        footer={
          <div className="flex flex-col gap-2">
            <button
              className="w-full bg-primary text-white py-2 rounded-lg font-bold"
              onClick={closeFilter}
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={resetFilters}
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
        loading={loadingDetail}
      />

      <hr className="my-6 border-slate-400" />

      <DistributionSection
        data={facultyStats}
        err={errdataDetail}
        onReload={handleReloadDetail}
        loading={loadingDetail}
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
