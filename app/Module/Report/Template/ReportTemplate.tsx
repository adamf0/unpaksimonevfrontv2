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
import { Filter } from "lucide-react";

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
  } = useKuesionerReportContext();

  const prevFilterRef = useRef<any>(null);
  const [bankOptions, setBankOptions] = useState<any[]>([]);
  const [semesterOptions, setSemesterOptions] = useState<any[]>([]);

  // =========================
  // OPTIONS
  // =========================
  useEffect(() => {
    if (!dataBankSoal?.length) return;

    setSemesterOptions(
      adaptSelectOptions(
        dataBankSoal.map((b: any) => ({
          value: b.Semester,
          label: b.Semester,
        })),
        { valueKey: "value", labelKey: "label" },
      ),
    );

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

  console.log("groupedByFullPath", groupedByFullPath);

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
        semesterOptions={semesterOptions}
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

      <button
        onClick={openFilter}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition relative"
      >
        <Filter size={20} />

        {(() => {
          const count = (query?.fakultas ? 1 : 0) + (query?.prodi ? 1 : 0);

          if (!count) return null;

          return (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {count}
            </span>
          );
        })()}
      </button>

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
