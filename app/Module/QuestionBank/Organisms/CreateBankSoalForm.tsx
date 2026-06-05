"use client";

import { Controller, useForm } from "react-hook-form";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { useEffect } from "react";
import { useQuestionBankContext } from "../Context/QuestionBankProvider";
import { useToast } from "../../Common/Context/ToastContext";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { FormValues } from "../Attribut/FormValues";
import { CKEditorField } from "../../Common/Components/Molecules/CKEditorField";

export function CreateBankSoalForm() {
  const { state, actionBankSoal, setState, loadData } =
    useQuestionBankContext();
  const { pushToast } = useToast();

  const allowedFields = ["judul", "semester", "konten", "deskripsi"];

  const defaultFormValues: FormValues = {
    judul: "",
    semester: "",
    konten: "",
    deskripsi: "",
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    console.log(state);
    if (!state.selected) return;
    if (state.action == "time") return;

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

      reset(defaultFormValues);

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

      if (data?.code?.endsWith(".Validation")) {
        const messages = data.message;

        Object.keys(messages).forEach((field) => {
          if (!allowedFields.includes(field)) return;

          setError(field as keyof FormValues, {
            type: "server",
            message: messages[field],
          });
        });

        return;
      }

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
            error={errors.semester?.message}
          />
        </div>

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
      <div className="col-span-1 md:col-span-2 pt-4 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => {
            reset(defaultFormValues);
            setState((prev: any) => ({
              ...prev,
              selected: null,
            }));
          }}
          className="w-full sm:w-auto px-6 py-4 rounded-xl border border-outline bg-surface text-on-surface font-bold hover:bg-surface-container transition-colors"
        >
          Cancel
        </button>

        <AnimatedButton
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform"
          icon=""
        >
          {state.selected
            ? "Update Question Bank"
            : "Register New Question Bank"}
        </AnimatedButton>
      </div>
    </form>
  );
}
