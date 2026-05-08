"use client";

import { Controller, useForm } from "react-hook-form";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { TextareaField } from "../../Common/Components/Molecules/TextareaField";
import { useEffect } from "react";
import { useQuestionBankContext } from "../Context/QuestionBankProvider";
import { useToast } from "../../Common/Context/ToastContext";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { FormValues } from "../Attribut/FormValues";
import { CKEditorField } from "../../Common/Components/Molecules/CKEditorField";
import { isEmpty } from "../../Common/Service/utility";

export function CreateBankSoalForm() {
  const { state, actionBankSoal, setState, loadData } = useQuestionBankContext();
  const { pushToast } = useToast();

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
    console.log(state)
    if (!state.selected) return;
    if (state.action=="time") return;

    reset({
      judul: state.selected.judul ?? "",
      semester: state.selected.semester ?? "",
      konten: state.selected.konten ?? "",
      deskripsi: state.selected.deskripsi ?? "",
    });
  }, [state.selected, reset]);

  const onSubmit = async (data: FormValues) => {
    console.log("FORM:", data);

    try {
      const uuid = await actionBankSoal(
        state?.selected?.uuid,
        data,
        state?.selected ? "update" : "create",
      );
      pushToast("Berhasil simpan");

      reset({
        judul: "",
        semester: "",
        konten: "",
        deskripsi: "",
      });

      // hapus selected mode edit -> kembali create
      if (state?.selected) {
        setState((prev: any) => ({
          ...prev,
          selected: null,
        }));
      }
    } catch (error: any) {
      if (!error.response) return pushToast("Server error");

      const { status, data } = error.response;

      const cf = handleCloudflareError(status);
      if (cf) return pushToast(cf);

      pushToast(data?.message || "Error");
    }

    await loadData();
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

        {/* Konten [pr] ckeditor*/}
        <div className="col-span-2">
          <Controller
            name="konten"
            control={control}
            render={({ field, fieldState }) => (
              <CKEditorField
                id="konten"
                label="Konten Utama"
                placeholder="Tuliskan pertanyaan inti di sini..."
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* Deskripsi */}
        <div className="col-span-2">
          <Controller
            name="deskripsi"
            control={control}
            render={({ field, fieldState }) => (
              <CKEditorField
                id="deskripsi"
                label="Deskripsi Tambahan"
                placeholder="Informasi pendukung atau instruksi pengerjaan..."
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
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
