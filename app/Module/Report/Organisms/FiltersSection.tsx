"use client";

import { useState } from "react";
import { Option } from "../../Quesioner/Attribut/Option";
import { SelectField } from "../../Common/Components/Organisms/SelectField";
import { FilterValue } from "../Attribut/FilterValue";

type Props = {
  bankSoalOptions: Option[];
  fakultasOptions: Option[];
  prodiOptions: Option[];
  semesterOptions: Option[];

  onApply: (filter: FilterValue) => void;
};

export default function FilterSection({
  bankSoalOptions,
  fakultasOptions,
  prodiOptions,
  semesterOptions,
  onApply,
}: Props) {
  const [filter, setFilter] = useState<FilterValue>({
    bankSoal: null,
    fakultas: null,
    prodi: null,
    semester: null,
  });

  const renderItem = (opt: Option, selected: boolean) => (
    <div className="flex items-center justify-between w-full">
      <span className="text-sm">{opt.label}</span>

      {selected && (
        <span className="text-green-500 text-xs font-medium">✓</span>
      )}
    </div>
  );

  const handleApply = () => {
    onApply({
      ...filter,
    });
  };

  return (
    <section className="bg-surface-container-lowest p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-3xl mb-8 lg:mb-10 shadow-[0_12px_32px_-4px_rgba(44,42,81,0.06)] border border-outline-variant/10">
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        <SelectField
          label="Bank Soal"
          placeholder="Pilih Bank Soal"
          options={bankSoalOptions}
          value={filter.bankSoal}
          onChange={(val) =>
            setFilter((prev) => ({
              ...prev,
              bankSoal: val,
            }))
          }
          mode="single"
          renderItem={renderItem}
        />

        {/* <SelectField
          label="Fakultas"
          placeholder="Pilih Fakultas"
          options={fakultasOptions}
          value={filter.fakultas}
          onChange={(val) =>
            setFilter((prev) => ({
              ...prev,
              fakultas: val,
            }))
          }
          mode="single"
          renderItem={renderItem}
        />

        <SelectField
          label="Unit / Prodi"
          placeholder="Pilih Prodi"
          options={prodiOptions}
          value={filter.prodi}
          onChange={(val) =>
            setFilter((prev) => ({
              ...prev,
              prodi: val,
            }))
          }
          mode="single"
          renderItem={renderItem}
        /> */}

        <SelectField
          label="Semester"
          placeholder="Pilih Semester"
          options={semesterOptions}
          value={filter.semester}
          onChange={(val) =>
            setFilter((prev) => ({
              ...prev,
              semester: val,
            }))
          }
          mode="single"
          renderItem={renderItem}
        />

        <div className="flex items-end sm:col-span-2 xl:col-span-1">
          <button
            onClick={handleApply}
            className="w-full h-[50px] bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.99] transition-transform"
          >
            <span
              className="material-symbols-outlined text-sm"
              data-icon="filter_list"
            >
              filter_list
            </span>
            Terapkan Filter
          </button>
        </div>
      </div>
    </section>
  );
}
