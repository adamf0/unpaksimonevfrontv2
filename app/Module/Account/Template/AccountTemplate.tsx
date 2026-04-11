"use client";

import { useState } from "react";
import Icon from "../../Common/Components/Atoms/Icon";
import { FilterButton } from "../../Common/Components/Molecules/FilterButton";
import { SearchInput } from "../../Common/Components/Molecules/SearchInput";
import { SecurityCard } from "../Molecules/SecurityCard";
import { StatsCard } from "../Molecules/StatsCard";
import { AccountTable } from "../Organisms/AccountTable";
import { CreateUserForm } from "../Organisms/CreateUserForm";
import { FilterSidebar } from "../../Common/Components/Template/FilterSidebar";
import { AccountFilterForm } from "../Molecules/AccountFilterForm";
import Modal from "../../Common/Components/Organisms/Modal";
import { UserItem } from "../Attribut/UserItem";
import { Pagination } from "../../Common/Components/Molecules/Pagination";

type ModalType = "delete" | "edit" | "info" | null;

export default function AccountTemplate() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(1);

  const [modal, setModal] = useState<{
    type: ModalType;
    data: UserItem | null;
  }>({
    type: "info",
    data: null,
  });

  return (
    <>
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
          <AccountTable
            onDeleteClick={(user) => {
              setModal({
                type: "delete",
                data: user,
              });
            }}
            onEditClick={(user) => {
              setModal({
                type: null,
                data: user,
              });
            }}
          />
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
        <AccountFilterForm />
      </FilterSidebar>

      <Modal
        open={modal.type === "delete"}
        onClose={() => setModal({ type: null, data: null })}
        icon="delete_forever"
        title="Delete Question?"
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
            <button className="px-8 py-3 font-label font-bold bg-error text-white rounded-xl shadow-lg shadow-error/20 active:scale-95 transition-transform">
              Delete
            </button>
          </>
        }
      />

      <Modal
        open={modal.type === "edit"}
        onClose={() => setModal({ type: null, data: null })}
        icon="warning"
        title="Unsaved Changes"
        description="Unsaved changes detected. Do you want to save your progress before leaving this questionnaire builder?"
        variant="warning"
        footer={
          <>
            <button
              className="px-6 py-3 font-label font-bold text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors"
              onClick={() => setModal({ type: null, data: null })}
            >
              Discard
            </button>

            <button
              className="px-8 py-3 font-label font-bold bg-[#f59e0b] text-white rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
              onClick={() => setModal({ type: null, data: null })}
            >
              Save Changes
            </button>
          </>
        }
      />

      <Modal
        open={modal.type === "info"}
        onClose={() => setModal({ type: null, data: null })}
        icon="info"
        title="Scheduled Maintenance"
        description="The questionnaire system will be undergoing maintenance on Saturday at 10 PM. You will not be able to create new surveys during this window."
        variant="info"
        footer={
          <button
            className="w-full py-4 font-label font-bold bg-gradient-to-br from-primary to-primary-container text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            onClick={() => setModal({ type: null, data: null })}
          >
            Got it, thanks!
          </button>
        }
      />
    </>
  );
}
