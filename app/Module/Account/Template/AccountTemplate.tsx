"use client";

import { Suspense, useState } from "react";
import Icon from "../../Common/Components/Atoms/Icon";
import { FilterButton } from "../../Common/Components/Molecules/FilterButton";
import { SearchInput } from "../../Common/Components/Molecules/SearchInput";
import { FilterSidebar } from "../../Common/Components/Template/FilterSidebar";
import Modal from "../../Common/Components/Organisms/Modal";
import { Pagination } from "../../Common/Components/Molecules/Pagination";
import { UserItem } from "../Attribut/UserItem";
import { useAccountContext } from "../Context/AccountProvider";
import { HistoryButton } from "../../Common/Components/Molecules/HistoryButton";
import dynamic from "next/dynamic";

const StatsCard = dynamic(
  () => import("../Molecules/StatsCard").then((mod) => mod.StatsCard),
  {
    ssr: false,
    loading: () => (
      <div className="bg-surface-container-lowest rounded-xl bg-gradient-to-br from-primary to-[#2c2a51] rounded-xl p-8 text-on-primary indigo-shadow relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="relative z-10">Loading Stats...</div>
      </div>
    ),
  },
);

const SecurityCard = dynamic(
  () => import("../Molecules/SecurityCard").then((mod) => mod.SecurityCard),
  {
    ssr: false,
    loading: () => (
      <div className="bg-surface-container-lowest rounded-xl p-6 indigo-shadow space-y-4">
        Loading Security...
      </div>
    ),
  },
);

const AccountTable = dynamic(
  () => import("../Organisms/AccountTable").then((mod) => mod.AccountTable),
  {
    ssr: false,
    loading: () => <div className="p-6">Loading Table...</div>,
  },
);

const CreateUserForm = dynamic(
  () => import("../Organisms/CreateUserForm").then((mod) => mod.CreateUserForm),
  {
    ssr: false,
    loading: () => <div>Loading Form...</div>,
  },
);

const AccountFilterForm = dynamic(
  () =>
    import("../Molecules/AccountFilterForm").then(
      (mod) => mod.AccountFilterForm,
    ),
  {
    ssr: false,
    loading: () => <div>Loading Filter...</div>,
  },
);

type ModalType = "delete" | "edit" | "force_delete" | "info" | null;

export default function AccountTemplate() {
  const {
    state,
    query,
    setQuery,
    current,
    setCurrent,
    open,
    openFilter,
    closeFilter,
    resetFilters,
    loadData,
    actionAccount,
    filterCount,
    toggleFlag,
  } = useAccountContext();

  const [modal, setModal] = useState<{
    type: ModalType;
    data: UserItem | null;
  }>({
    type: null,
    data: null,
  });

  async function handleDelete() {
    if (!modal.data?.UUID) return;

    try {
      await actionAccount(modal.data.UUID, undefined, "delete");
      setModal({ type: null, data: null });
      await loadData();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleForceDelete() {
    if (!modal.data?.UUID) return;

    try {
      await actionAccount(modal.data.UUID, undefined, "force_delete");
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
          Account Management
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

            <h3 className="text-xl font-bold font-headline">Create New User</h3>
          </div>

          <CreateUserForm />
        </div>

        <div className="md:col-span-4 space-y-6">
          <StatsCard />
          <SecurityCard />
        </div>
      </section>

      {/* TABLE */}
      <section className="bg-surface-container-lowest rounded-xl indigo-shadow overflow-hidden">
        <div className="p-4 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-xl font-bold font-headline">
              Registry Overview
            </h3>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
              <SearchInput
                placeholder="Global search..."
                value={query.search}
                onChange={(val) =>
                  setQuery((prev: any) => ({
                    ...prev,
                    search: val,
                    page: 1,
                  }))
                }
              />

              <FilterButton count={filterCount(query)} onClick={openFilter} />

              <HistoryButton
                onClick={() => {
                  console.log("ganti flag");
                  toggleFlag();
                }}
              />
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <AccountTable
            data={state.data}
            loading={state.loading}
            openDelete={(user) =>
              setModal({
                type: "delete",
                data: user,
              })
            }
            openForceDelete={(user) =>
              setModal({
                type: "force_delete",
                data: user,
              })
            }
          />
        </div>

        <div className="p-4 md:p-8 bg-surface-container-low/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-surface-container">
          <Pagination
            currentPage={current}
            totalPages={
              state.total <= 0 ? 1 : Math.ceil(state.total / query.limit)
            }
            totalItems={state.total}
            showing={query.limit}
            onChange={(page) => {
              setCurrent(page);

              setQuery((prev: any) => ({
                ...prev,
                page,
              }));
            }}
          />
        </div>
      </section>

      {/* FILTER */}
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
              onClick={resetFilters} //gagal reset accountfiltersform
              className="w-full py-2 rounded-lg border border-red-300 text-red-600 font-bold hover:bg-red-50 transition"
            >
              Reset Filter
            </button>
          </div>
        }
      >
        <AccountFilterForm value={query} onChange={setQuery} />
      </FilterSidebar>

      {/* DELETE */}
      <Modal
        open={modal.type === "delete"}
        onClose={() => setModal({ type: null, data: null })}
        icon="delete_forever"
        title="Delete Account?"
        description="This action can be restored later."
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
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        }
      />

      {/* FORCE DELETE */}
      <Modal
        open={modal.type === "force_delete"}
        onClose={() => setModal({ type: null, data: null })}
        icon="delete_forever"
        title="Permanent Delete Account?"
        description="This action cannot be undone."
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
              onClick={handleForceDelete}
            >
              Delete Permanently
            </button>
          </>
        }
      />

      {/* EDIT */}
      <Modal
        open={modal.type === "edit"}
        onClose={() => setModal({ type: null, data: null })}
        icon="edit"
        title="Edit Account"
        description={`Selected user: ${modal.data?.Name ?? "-"}`}
        variant="info"
        footer={
          <button
            className="w-full py-4 font-label font-bold bg-primary text-white rounded-xl"
            onClick={() => setModal({ type: null, data: null })}
          >
            Close
          </button>
        }
      />
    </Suspense>
  );
}
