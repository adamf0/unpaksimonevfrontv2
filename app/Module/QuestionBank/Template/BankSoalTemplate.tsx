"use client";

import { useState } from "react";
import Icon from "../../Common/Components/Atoms/Icon";
import { FilterButton } from "../../Common/Components/Molecules/FilterButton";
import { SearchInput } from "../../Common/Components/Molecules/SearchInput";
import { CreateBankSoalForm } from "../Organisms/CreateBankSoalForm";
import { QuickInfoCard } from "../Molecules/QuickInfoCard";
import { GuideCard } from "../Molecules/GuideCard";
import { BankSoalTable } from "../Organisms/BankSoalTable";
import { Pagination } from "../../Common/Components/Molecules/Pagination";
import { FilterSidebar } from "../../Common/Components/Template/FilterSidebar";
import { BankSoalFilterForm } from "../Molecules/BankSoalFilterForm";

export default function BankSoalTemplate() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(1);

  return (
    <>
      {/* HEADER SECTION */}
      <section className="max-w-6xl">
        <h2 className="text-[clamp(1.75rem,3vw,3rem)] font-extrabold font-headline tracking-tighter text-on-surface mb-3 md:mb-4 leading-tight">
          Question Bank Management
        </h2>

        <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
          Configure and oversee campus administrative access. Maintain the
          integrity of faculty and program-level permissions.
        </p>
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 indigo-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Icon name="person_add" />
            </div>
            <h3 className="text-xl font-bold font-headline">Create New Qustionn Bank</h3>
          </div>

          <CreateBankSoalForm />
        </div>

        <div className="md:col-span-4 space-y-6">
          <QuickInfoCard />

          <GuideCard />
        </div>
      </section>

      <section className="bg-surface-container-lowest rounded-xl indigo-shadow overflow-hidden">
        <div className="p-4 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-xl font-bold font-headline">
              Registry Overview
            </h3>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
              <SearchInput
                placeholder="Global search..."
                onChange={(val) => console.log(val)}
              />

              <FilterButton count={2} onClick={() => setOpen(true)} />
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <BankSoalTable />
        </div>

        <div className="p-4 md:p-8 bg-surface-container-low/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-surface-container">
          <Pagination
            currentPage={current}
            totalPages={13}
            totalItems={124}
            showing={2}
            onChange={(page) => setCurrent(page)}
          />
        </div>
      </section>

      <FilterSidebar
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <button
            className="w-full bg-primary text-white py-2 rounded-lg font-bold"
            onClick={() => console.log("filter")}
          >
            Apply Filters
          </button>
        }
      >
        <BankSoalFilterForm />
      </FilterSidebar>
    </>
  );
}
