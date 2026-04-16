"use client";

import { Controller, useFormContext } from "react-hook-form";
import { SelectField } from "../../Common/Components/Organisms/SelectField";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { Toggle } from "../Atoms/Toggle";
import { Option } from "../../Common/Components/Attribut/Option";
import { useTemplateQuestionContext } from "../Context/TemplateQuestionProvider";
import { adaptSelectOptions } from "../../Common/Adapter/adaptSelectOptions";

const tipeOptions: Option[] = [
  { label: "Radio Button", value: "radio" },
  { label: "Multiple Choice", value: "multiple" },
  { label: "Rating Scale", value: "rating" },
];

export function CreateTemplateForm() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const { questionState, setQuestionQuery } = useTemplateQuestionContext();

  /** =========================
   * OPTIONS
   * ========================= */
  const bankOptions = adaptSelectOptions(questionState.dataBank, {
    valueKey: "UUID",
    labelKey: "Judul",
  });

  const kategoriOptions = adaptSelectOptions(questionState.dataKategori, {
    valueKey: "UUID",
    labelKey: "NamaKategori",
  });

  return (
    <div className="space-y-6">
      {/* BANK & KATEGORI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <Controller
          name="banksoal"
          control={control}
          rules={{ required: "Bank soal wajib dipilih" }}
          render={({ field }) => (
            <>
              <SelectField
                label="Bank Soal"
                placeholder="Pilih Bank Soal"
                options={bankOptions}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  setQuestionQuery((prev: any) => ({
                    ...prev,
                    banksoal: val ?? null,
                  }));
                }}
                mode="single"
                error={errors?.banksoal?.message}
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
            </>
          )}
        />

        <Controller
          name="kategori"
          control={control}
          rules={{ required: "Kategori wajib dipilih" }}
          render={({ field }) => (
            <>
              <SelectField
                label="Kategori"
                placeholder="Pilih Kategori"
                options={kategoriOptions}
                value={field.value}
                onChange={field.onChange}
                mode="single"
                error={errors?.kategori?.message}
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
            </>
          )}
        />
      </div>

      {/* PERTANYAAN */}
      <div className="space-y-2 mb-6">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Pertanyaan
        </label>

        <textarea
          {...register("pertanyaan", {
            required: "Pertanyaan wajib diisi",
          })}
          className="w-full bg-surface-container-low border-none rounded-lg p-4 text-sm min-h-[100px] focus:ring-2 focus:ring-primary/20"
          placeholder="Masukkan teks pertanyaan kuesioner..."
        />
        {errors.pertanyaan && (
          <p className="text-red-500 text-xs">
            {errors.pertanyaan.message as string}
          </p>
        )}
      </div>

      {/* TIPE / BOBOT / WAJIB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <Controller
          name="tipepilihan"
          control={control}
          rules={{ required: "Tipe pilihan wajib dipilih" }}
          render={({ field }) => (
            <>
              <SelectField
                label="Tipe Pilihan"
                placeholder="Pilih tipe"
                options={tipeOptions}
                value={field.value}
                onChange={field.onChange}
                mode="single"
                error={errors?.tipepilihan?.message}
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
            </>
          )}
        />

        <InputField
          id="bobot"
          label="Bobot"
          type="number"
          inputClassName="p-3"
          register={register("bobot", {
            required: "Bobot wajib diisi",
            valueAsNumber: true,
            min: {
              value: 1,
              message: "Bobot minimal 1",
            },
          })}
          error={errors.bobot?.message as string}
        />

        {/* TOGGLE */}
        <Controller
          name="wajibisi"
          control={control}
          render={({ field }) => (
            <div className="flex items-end justify-between p-3 bg-surface-container-low rounded-lg">
              <span className="text-sm font-medium">Wajib Diisi</span>
              <Toggle value={field.value} onChange={field.onChange} />
            </div>
          )}
        />
      </div>
    </div>
  );
}
