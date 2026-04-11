"use client";

import { useEffect, useState } from "react";
import { SelectField } from "../../Common/Components/Organisms/SelectField";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { Toggle } from "../Atoms/Toggle";
import { Option } from "../../Common/Components/Attribut/Option";

const bankOptions: Option[] = [
  { label: "Evaluasi Dosen", value: "dosen" },
  { label: "Kepuasan Mahasiswa", value: "mahasiswa" },
];

const kategoriOptions: Option[] = [
  { label: "Pedagogik", value: "pedagogik" },
  { label: "Profesional", value: "profesional" },
];

const tipeOptions: Option[] = [
  { label: "Radio Button", value: "radio" },
  { label: "Multiple Choice", value: "multiple" },
  { label: "Rating Scale", value: "rating" },
];


export function CreateTemplateForm() {
  const [bank, setBank] = useState<Option | null>(null);
  const [kategori, setKategori] = useState<Option | null>(null);
  const [tipe, setTipe] = useState<Option | null>(null);
  const [bobot, setBobot] = useState("1");
  const [wajib, setWajib] = useState(true);
  const [pertanyaan, setPertanyaan] = useState("");

  useEffect(()=>{
    console.log(bank)
  },[bank]);

  return (
    <form className="space-y-6">
      {/* BANK & KATEGORI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6">
         <SelectField
          label="Bank Soal"
          placeholder="Pilih Bank Soal"
          options={bankOptions}
          value={bank}
          onChange={(value) => {
            console.log(value)
            setBank(value)
          }}
          mode="single"
          renderItem={(opt, selected) => (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm">{opt.label}</span>
              {selected && (
                <span className="text-green-500 text-xs font-medium">
                  ✓
                </span>
              )}
            </div>
          )}
        />

        <SelectField
          label="Kategori"
          placeholder="Pilih Kategori"
          options={kategoriOptions}
          value={kategori}
          onChange={setKategori}
          mode="single"
          renderItem={(opt, selected) => (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm">{opt.label}</span>
              {selected && (
                <span className="text-green-500 text-xs font-medium">
                  ✓
                </span>
              )}
            </div>
          )}
        />
      </div>

      {/* PERTANYAAN */}
      <div className="space-y-2 mb-6">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Pertanyaan
        </label>

        <textarea
          value={pertanyaan}
          onChange={(e) => setPertanyaan(e.target.value)}
          className="w-full bg-surface-container-low border-none rounded-lg p-4 text-sm min-h-[100px] focus:ring-2 focus:ring-primary/20"
          placeholder="Masukkan teks pertanyaan kuesioner..."
        />
      </div>

      {/* TIPE / BOBOT / WAJIB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
       <SelectField
          label="Tipe Pilihan"
          placeholder="Pilih tipe"
          options={tipeOptions}
          value={tipe}
          onChange={setTipe}
          mode="single"
          renderItem={(opt, selected) => (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm">{opt.label}</span>
              {selected && (
                <span className="text-green-500 text-xs font-medium">
                  ✓
                </span>
              )}
            </div>
          )}
        />

        <InputField
          id="bobot"
          label="Bobot"
          type="number"
          inputClassName="p-3"
          register={{
            value: bobot,
            onChange: (e: any) => setBobot(e.target.value),
          } as any}
        />

        {/* TOGGLE */}
        <div className="flex items-end justify-between p-3 bg-surface-container-low rounded-lg">
          <span className="text-sm font-medium">Wajib Diisi</span>
          <Toggle value={wajib} onChange={setWajib} />
        </div>
      </div>
    </form>
  );
}