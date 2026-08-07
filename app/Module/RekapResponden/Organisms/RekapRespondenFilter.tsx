"use client";

import { Option } from "../../Common/Components/Attribut/Option";
import { SelectField } from "../../Common/Components/Organisms/SelectField";

type Props = {
  bankSoalOptions: Option[];
  selectedBankSoal: Option | null;
  onSelectBankSoal: (opt: Option | null) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onExportExcel: () => void;
  exporting: boolean;
};

export default function RekapRespondenFilter({
  bankSoalOptions,
  selectedBankSoal,
  onSelectBankSoal,
  search,
  onSearchChange,
  onExportExcel,
  exporting,
}: Props) {
  const renderItem = (opt: Option, selected: boolean) => (
    <div className="flex items-center justify-between w-full">
      <span className="text-sm">{opt.label}</span>
      {selected && <span className="text-green-500 text-xs font-medium">✓</span>}
    </div>
  );

  return (
    <section className="bg-surface-container-lowest p-5 lg:p-6 rounded-2xl lg:rounded-3xl mb-6 shadow-[0_12px_32px_-4px_rgba(44,42,81,0.06)] border border-outline-variant/10">
      <div className="grid gap-4 md:grid-cols-12 items-end">
        {/* Bank Soal Selector */}
        <div className="md:col-span-5">
          <SelectField
            label="Bank Soal"
            placeholder="Pilih Bank Soal..."
            options={bankSoalOptions}
            value={selectedBankSoal}
            onChange={(val) => onSelectBankSoal(val)}
            mode="single"
            renderItem={renderItem}
          />
        </div>

        {/* Search Input */}
        <div className="md:col-span-4 space-y-2">
          <label className="text-sm font-medium text-on-surface">Cari Responden</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama, NIDN, NPM, unit..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-surface-container-low px-4 py-3 pl-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent transition-all"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/60 text-lg">
              search
            </span>
          </div>
        </div>

        {/* Export Excel Button (Background Job) */}
        <div className="md:col-span-3">
          <button
            disabled={!selectedBankSoal || exporting}
            onClick={onExportExcel}
            className="w-full h-[46px] rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {exporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Job...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">
                  download_for_offline
                </span>
                Export Excel (Job)
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
