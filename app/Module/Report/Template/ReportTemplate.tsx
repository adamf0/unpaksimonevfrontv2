"use client";

import DistributionSection from "../Organisms/DistributionSection";
import TopQuestionsSection from "../Organisms/TopQuestionsSection";
import ChartQuestionSection from "../Organisms/ChartQuestionSection";
import FilterSection from "../Organisms/FiltersSection";
import FourYearChart from "../Molecules/FourYearChart";
import { useEffect, useRef, useState } from "react";
import { useKuesionerReport } from "../Hook/useReport";
import { adaptSelectOptions } from "../../Common/Adapter/adaptSelectOptions";

export default function ReportTemplate() {
  const {
    loadData,
    loadDataDetail,

    loadingDetail,
    loading,

    errdata,
    errdataDetail,

    dataBankSoal,
    loadBankSoal,

    topQuestions,
    yearlyStats,
    facultyStats,
    groupedByFullPath,
  } = useKuesionerReport();

  const [filter, setFilter] = useState<any>(null);
  const prevFilterRef = useRef<any>(null);

  const [bankOptions, setBankOptions] = useState<any[]>([]);
  const [semesterOptions, setSemesterOptions] = useState<any[]>([]);

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    loadData();
    loadBankSoal();
  }, []);

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

  return (
    <>
      <FourYearChart data={yearlyStats} err={errdata} onReload={loadData} loading={loading} />

      <FilterSection
        bankSoalOptions={bankOptions}
        fakultasOptions={[]}
        prodiOptions={[]}
        semesterOptions={semesterOptions}
        onApply={(val) => {
          setFilter(val);

          if (!val?.bankSoal?.label) return;

          const payload = {
            judul: val.bankSoal.label,
            semester: val?.semester?.label ?? "",
            is4year: "0",
          };

          prevFilterRef.current = payload;

          loadDataDetail(payload);
        }}
      />

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
              data={group.data}
            />
          ))}
        </>
      )}
    </>
  );
}
