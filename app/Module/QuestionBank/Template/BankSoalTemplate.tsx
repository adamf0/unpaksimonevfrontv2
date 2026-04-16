"use client";

import { Suspense } from "react";
import Icon from "../../Common/Components/Atoms/Icon";
import { FilterButton } from "../../Common/Components/Molecules/FilterButton";
import { SearchInput } from "../../Common/Components/Molecules/SearchInput";
import { Pagination } from "../../Common/Components/Molecules/Pagination";
import { useBankSoal } from "../Hook/useBankSoal";
import dynamic from "next/dynamic";
import { useQuestionBankContext } from "../Context/QuestionBankProvider";
import { HistoryButton } from "../../Common/Components/Molecules/HistoryButton";

const CreateBankSoalForm = dynamic(
  () =>
    import("../Organisms/CreateBankSoalForm").then(
      (mod) => mod.CreateBankSoalForm,
    ),
  { ssr: false, loading: () => <div>Loading Form...</div>, },
);

const QuickInfoCard = dynamic(
  () => import("../Molecules/QuickInfoCard").then((mod) => mod.QuickInfoCard),
  { ssr: false, loading: () => <div className="bg-surface-container-lowest rounded-xl p-6 indigo-shadow space-y-4 relative overflow-hidden group">Loading Quick Info Card...</div>, },
);

const GuideCard = dynamic(
  () => import("../Molecules/GuideCard").then((m) => m.GuideCard),
  { ssr: false, loading: () => <div className="bg-surface-container-lowest rounded-xl bg-gradient-to-br from-primary to-[#2c2a51] rounded-xl p-8 text-on-primary indigo-shadow relative overflow-hidden group">Loading Guide Card...</div>, },
);

const BankSoalTable = dynamic(
  () => import("../Organisms/BankSoalTable").then((m) => m.BankSoalTable),
  {
    ssr: false,
    loading: () => <div className="p-4">Loading Table...</div>,
  },
);

const FilterSidebar = dynamic(
  () =>
    import("../../Common/Components/Template/FilterSidebar").then(
      (m) => m.FilterSidebar,
    ),
  { ssr: false, loading: () => <div>Loading Filter...</div>, },
);

const BankSoalFilterForm = dynamic(
  () =>
    import("../Molecules/BankSoalFilterForm").then((m) => m.BankSoalFilterForm),
  { ssr: false, loading: () => <div>Loading Filter Form...</div>, },
);

export default function BankSoalTemplate() {
  const { state, query, setQuery, open, setOpen, resetFilters, filterCount } =
     useQuestionBankContext();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-primary" />
        </div>
      }
    >
      {/* HEADER */}
      <section className="max-w-6xl">
        <h2 className="text-[clamp(1.75rem,3vw,3rem)] font-extrabold font-headline tracking-tighter text-on-surface mb-3 md:mb-4 leading-tight">
          Question Bank Management
        </h2>

        <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
          Configure and oversee campus administrative access. Maintain the
          integrity of faculty and program-level permissions.
        </p>
      </section>

      {/* CREATE SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 indigo-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Icon name="person_add" />
            </div>
            <h3 className="text-xl font-bold font-headline">
              Create New Question Bank
            </h3>
          </div>

          <CreateBankSoalForm />
        </div>

        <div className="md:col-span-4 space-y-6">
          <QuickInfoCard />
          <GuideCard />
        </div>
      </section>

      {/* TABLE SECTION */}
      <section className="bg-surface-container-lowest rounded-xl indigo-shadow overflow-hidden">
        <div className="p-4 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-xl font-bold font-headline">
              Registry Overview
            </h3>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
              <SearchInput
                placeholder="Global search..."
                onChange={(val) =>
                  setQuery((prev: any) => ({
                    ...prev,
                    search: val,
                    page: 1,
                  }))
                }
              />

              <FilterButton
                count={filterCount(query)}
                onClick={() => setOpen(true)}
              />

              <HistoryButton/>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <BankSoalTable data={state.data} loading={state.loading} />
        </div>

        <div className="p-4 md:p-8 bg-surface-container-low/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-surface-container">
          <Pagination
            currentPage={query.page}
            totalPages={
              state.total < 0 ? 1 : Math.ceil(state.total / query.limit)
            }
            totalItems={state.total}
            showing={query.limit}
            onChange={(page) => setQuery((prev: any) => ({ ...prev, page }))}
          />
        </div>
      </section>

      {/* FILTER SIDEBAR */}
      <FilterSidebar
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex flex-col gap-2">
            <button
              className="w-full bg-primary text-white py-2 rounded-lg font-bold"
              onClick={() => setOpen(false)}
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
        <BankSoalFilterForm value={query} onChange={setQuery} />
      </FilterSidebar>
    </Suspense>
  );
}
