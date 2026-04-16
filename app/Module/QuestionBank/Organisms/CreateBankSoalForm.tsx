"use client";

import { useForm } from "react-hook-form";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { TextareaField } from "../../Common/Components/Molecules/TextareaField";
import { useEffect } from "react";
import { useQuestionBankContext } from "../Context/QuestionBankProvider";

type FormValues = {
  judul: string;
  semester: any;
  konten?: string;
  deskripsi?: string;
};

export function CreateBankSoalForm() {
  const { state } = useQuestionBankContext();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      judul: "",
      semester: "",
      konten: "",
      deskripsi: "",
    },
  });

  useEffect(() => {
    if (!state.selected) return;

    reset({
      judul: state.selected.judul ?? "",
      semester: state.selected.semester ?? "",
      konten: state.selected.konten ?? "",
      deskripsi: state.selected.deskripsi ?? "",
    });
  }, [state.selected, reset]);

  const onSubmit = (data: FormValues) => {
    console.log("FORM:", data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Judul */}
        <div className="col-span-2 md:col-span-1">
          <InputField
            id="judul"
            label="Judul"
            placeholder="Contoh: Evaluasi Kinerja Dosen"
            register={register("judul", {
              required: "Judul wajib diisi",
            })}
            error={errors.judul?.message}
          />
        </div>

        {/* Semester */}

        <div className="col-span-2 md:col-span-1">
          <InputField
            id="semester"
            label="Semester"
            placeholder="Contoh: 202601"
            register={register("semester", {
              required: "Semester wajib diisi",
            })}
            error={errors.judul?.message}
          />
        </div>

        {/* Konten */}
        <div className="col-span-2">
          <TextareaField
            id="konten"
            label="Konten Utama"
            placeholder="Tuliskan pertanyaan inti di sini..."
            rows={4}
            register={register("konten", {})}
          />
        </div>

        {/* Deskripsi */}
        <div className="col-span-2">
          <TextareaField
            id="deskripsi"
            label="Deskripsi Tambahan"
            placeholder="Informasi pendukung atau instruksi pengerjaan..."
            rows={3}
            register={register("deskripsi", {})}
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
