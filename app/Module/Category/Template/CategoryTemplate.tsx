"use client";

import Icon from "../../Common/Components/Atoms/Icon";
import { Tabs } from "../Molecules/Tabs";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { useCategoryContext } from "../Context/CategoryProvider";
import Modal from "../../Common/Components/Organisms/Modal";

const KategoriTreeSection = dynamic(
  () =>
    import("../Molecules/KategoriTreeSection").then(
      (mod) => mod.KategoriTreeSection,
    ),
  { ssr: false, loading: () => <div>Loading Tree...</div> },
);

const KategoriTableSection = dynamic(
  () =>
    import("../Molecules/KategoriTableSection").then(
      (mod) => mod.KategoriTableSection,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="bg-surface-container-lowest rounded-xl indigo-shadow overflow-hidden p-6">
        Loading Table...
      </div>
    ),
  },
);

const CategoryCard = dynamic(
  () => import("../Molecules/CategoryCard").then((mod) => mod.CategoryCard),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10">
        Loading Info...
      </div>
    ),
  },
);

const SubCategoryCard = dynamic(
  () =>
    import("../Molecules/SubCategoryCard").then((mod) => mod.SubCategoryCard),
  {
    ssr: false,
    loading: () => (
      <div className="bg-surface-container-lowest rounded-xl p-6 indigo-shadow space-y-4">
        Loading Info...
      </div>
    ),
  },
);

const CreateCategoryForm = dynamic(
  () =>
    import("../Organisms/CreateCategoryForm").then(
      (mod) => mod.CreateCategoryForm,
    ),
  { ssr: false, loading: () => <div>Loading Form...</div> },
);

const FilterSidebar = dynamic(
  () =>
    import("../../Common/Components/Template/FilterSidebar").then(
      (m) => m.FilterSidebar,
    ),
  { ssr: false, loading: () => <div>Loading Filter...</div> },
);

const CategoryFilterForm = dynamic(
  () =>
    import("../Molecules/CategoryFilterForm").then((m) => m.CategoryFilterForm),
  { ssr: false, loading: () => <div>Loading Filter Form...</div> },
);

export default function CategoryTemplate() {
  const {
    view,
    setView,
    open,
    openFilter,
    closeFilter,
    query,
    setQuery,
    resetFilters,
    loadData,
    actionCategory,
  } = useCategoryContext();

  const [modal, setModal] = useState<any>({
    type: null,
    data: null,
  });

  async function onDelete() {
    try {
      await actionCategory(modal.data?.uuid, undefined, "delete");
      setModal({ type: null, data: null });
      await loadData();
    } catch (error) {
      console.error(error);
    }
  }

  async function onForceDelete() {
    try {
      await actionCategory(modal.data?.uuid, undefined, "force_delete");
      setModal({ type: null, data: null });
      await loadData();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-primary" />
        </div>
      }
    >
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
          <KategoriTableSection
            onOpenFilter={openFilter}
            openDelete={(item: any) =>
              setModal({
                type: "delete",
                data: item,
              })
            }
            openForceDelete={(item: any) =>
              setModal({
                type: "force_delete",
                data: item,
              })
            }
          />
        )}
      </div>

      <Modal
        open={modal.type === "delete" || modal.type === "force_delete"}
        onClose={() => setModal({ type: null, data: null })}
        icon="delete_forever"
        title="Delete Category?"
        description={
          modal.type === "force_delete"
            ? "This action cannot be recovery."
            : "This action can be recovery"
        }
        variant="error"
        footer={
          <>
            <button
              className="px-6 py-3 font-label font-bold text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors"
              onClick={() => setModal({ type: null, data: null })}
            >
              Cancel
            </button>
            <button
              className="px-8 py-3 font-label font-bold bg-error text-white rounded-xl shadow-lg shadow-error/20 active:scale-95 transition-transform"
              onClick={modal.type === "force_delete" ? onForceDelete : onDelete}
            >
              Delete
            </button>
          </>
        }
      />

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
        <CategoryFilterForm value={query} onChange={setQuery} />
      </FilterSidebar>
    </Suspense>
  );
}
