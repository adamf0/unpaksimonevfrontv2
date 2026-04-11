"use client";

import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { TextareaField } from "../../Common/Components/Molecules/TextareaField";
import { SelectFieldLite } from "../../Common/Components/Organisms/SelectFieldLite";

export function CreateBankSoalForm() {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Judul */}
        <div className="col-span-2 md:col-span-1">
          <InputField
            id="judul"
            label="Judul Pertanyaan"
            placeholder="Contoh: Evaluasi Kinerja Dosen"
          />
        </div>

        {/* Semester */}
        <SelectFieldLite
          id="semester"
          label="Semester"
          placeholder="select semester"
          options={[
            { label: "Semester Ganjil 2023/2024", value: "ganjil" },
            { label: "Semester Genap 2023/2024", value: "genap" },
            { label: "Semester Pendek 2024", value: "pendek" },
          ]}
        />

        {/* Kategori */}
        <div className="col-span-2">
          <SelectFieldLite
            id="kategori"
            label="Kategori"
            placeholder="select kategori"
            options={[
              { label: "Fasilitas Kampus", value: "fasilitas" },
              { label: "Metode Pembelajaran", value: "metode" },
              { label: "Pelayanan Akademik", value: "akademik" },
              { label: "Penelitian & Pengabdian", value: "penelitian" },
            ]}
          />
        </div>

        {/* Konten */}
        <div className="col-span-2">
          <TextareaField
            id="konten"
            label="Konten Utama"
            placeholder="Tuliskan pertanyaan inti di sini..."
            rows={4}
          />
        </div>

        {/* Deskripsi */}
        <div className="col-span-2">
          <TextareaField
            id="deskripsi"
            label="Deskripsi Tambahan"
            placeholder="Informasi pendukung atau instruksi pengerjaan..."
            rows={3}
          />
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-end pt-4">
        <AnimatedButton
          type="submit"
          className="bg-primary hover:bg-primary-dim text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95"
          icon="save"
        >
          Simpan Pertanyaan
        </AnimatedButton>
      </div>
    </form>
  );
}