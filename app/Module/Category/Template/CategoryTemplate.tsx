"use client";

import { useState } from "react";
import Icon from "../../Common/Components/Atoms/Icon";
import { FilterButton } from "../../Common/Components/Molecules/FilterButton";
import { SearchInput } from "../../Common/Components/Molecules/SearchInput";
import { CreateCategoryForm } from "../Organisms/CreateCategoryForm";
import { FilterSidebar } from "../../Common/Components/Template/FilterSidebar";
import { CategoryTable } from "../Organisms/CategoryTable";
import { CategoryFilterForm } from "../Molecules/CategoryFilterForm";
import { CategoryCard } from "../Molecules/CategoryCard";
import { SubCategoryCard } from "../Molecules/SubCategoryCard";
import { Tabs } from "../Molecules/Tabs";
import { TreeView } from "../Molecules/TreeView";
import { TabValue } from "../Attribut/TabValue";
import { Pagination } from "../../Common/Components/Molecules/Pagination";

interface Props {
  onOpenFilter: () => void;
}

export default function CategoryTemplate() {
  const [view, setView] = useState<TabValue>("tree");
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HEADER SECTION */}
      <section className="max-w-6xl">
        <h2 className="text-[clamp(1.75rem,3vw,3rem)] font-extrabold font-headline tracking-tighter text-on-surface mb-3 md:mb-4 leading-tight">
          Kategori Management
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
            <h3 className="text-xl font-bold font-headline">
              Create New Kategori
            </h3>
          </div>

          <CreateCategoryForm />
        </div>

        <div className="md:col-span-4 space-y-6">
          <CategoryCard />

          <SubCategoryCard />
        </div>
      </section>

      <div className="space-y-6">
        <Tabs value={view} onChange={setView} />

        {view === "tree" ? (
          <KategoriTreeSection />
        ) : (
          <KategoriTableSection onOpenFilter={() => setOpen(true)} />
        )}
      </div>

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
        <CategoryFilterForm />
      </FilterSidebar>
    </>
  );
}

export function KategoriTreeSection() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-6 lg:p-8 group/tree-item">
      <TreeView
        data={[
          {
            id: "1",
            name: "Academic Affairs",
            type: "folder",
            children: [
              {
                id: "2",
                name: "Curriculum Development",
                type: "file",
              },
            ],
          },
          {
            id: "3",
            name: "Student Life",
            type: "folder",
          },
        ]}
      />
      <div className="mt-12 pt-8 border-t border-surface-container flex justify-between items-center">
        <p className="text-sm text-on-surface-variant italic flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">info</span>
          Drag and drop to reorder the hierarchy. Changes must be saved to
          apply.
        </p>
        <button className="bg-gradient-to-r from-primary to-primary-dim text-on-primary font-headline font-extrabold px-10 py-4 rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3">
          Update Changes
        </button>
      </div>
    </div>
  );
}

export function KategoriTableSection({ onOpenFilter }: Props) {
  const [current, setCurrent] = useState(1);
  
  return (
    <section className="bg-surface-container-lowest rounded-xl indigo-shadow overflow-hidden">
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-xl font-bold font-headline">Kategori Overview</h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
            <SearchInput
              placeholder="Global search..."
              onChange={(val) => console.log(val)}
            />

            <FilterButton count={2} onClick={onOpenFilter} />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <CategoryTable />
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
  );
}
