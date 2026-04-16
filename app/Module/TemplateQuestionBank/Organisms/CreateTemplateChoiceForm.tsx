"use client";

import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import Icon from "../../Common/Components/Atoms/Icon";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { InputField } from "../../Common/Components/Molecules/InputField";
import Button from "../../Common/Components/Atoms/Button";
import OptionSkeleton from "../Atoms/OptionSkeleton";
import { FormValues } from "./TemplateQuestionFormWrapper";
import apiCall from "../../Common/External/APICall";
import { useTemplateQuestionContext } from "../Context/TemplateQuestionProvider";

interface Toast {
  id: number;
  message: string;
}

export default function CreateTemplateChoiceForm({
  onReset,
  isEdit,
}: {
  onReset: () => void;
  isEdit: boolean;
}) {
  const { register, formState } = useFormContext<FormValues>();
  const {stateQuestion} = useTemplateQuestionContext();

  const { watch, setValue } = useFormContext<FormValues>(); 
  const options = watch("options") || [];

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [addingCount, setAddingCount] = useState(0);

  /** =========================
   * TOAST
   * ========================= */
  const pushToast = (message: string) => {
    const id = Date.now(); // aman karena client-only (tidak SSR)
    setToasts((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  /** =========================
   * ADD OPTION (FIXED)
   * ========================= */
  const addOption = async (isFree:boolean = false) => {
    if (isFree) {
      const hasFreeText = options.some(
        (opt) => String(opt?.payload?.IsFreeText) === "1"
      );

      if (hasFreeText) {
        pushToast("Free text hanya boleh 1");
        return;
      }
    }
    if(stateQuestion?.selected?.tipe=="rating" && !isFree){
      pushToast("rating tidak boleh di tambah");
      return;
    }

    setAddingCount((prev) => prev + 1);

    try {
      const templateUUID = stateQuestion?.selected?.uuid;

      if (!templateUUID) {
        pushToast("Template pertanyaan belum dipilih");
        return;
      }

      const formData = new FormData();
      formData.append("template_pertanyaan", templateUUID);
      formData.append("jawaban", isFree? "lainnya":"masukkan jawabannya");
      // formData.append("nilai", "0");
      formData.append("isFreeText", isFree? "1":"0");

      const res = await apiCall.post("/templatejawaban", formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });

      const newUUID = res.data?.uuid;

      // 🔥 inject ke form state
      const newOptions = [
        ...options,
        {
          uuid: newUUID,
          label: isFree? "lainnya":"masukkan jawabannya",
          payload: {
            UUID: newUUID,
            Jawaban: isFree? "lainnya":"masukkan jawabannya",
            Nilai: 0,
            IsFreeText: isFree? "1":"0",
          },
        },
      ];

      setValue("options", newOptions, { shouldDirty: true });
    } catch (err: any) {
      pushToast(err?.response?.data?.message || "Gagal tambah opsi");
    } finally {
      setAddingCount((prev) => prev - 1);
    }
  };

  /** =========================
   * REMOVE OPTION
   * ========================= */
  const removeOption = async (index: number) => {
    const item = options[index];

    if (options.length <= 1) {
      pushToast("Minimal satu opsi harus tersedia");
      return;
    }

    try {
      console.log(item);
      if (item?.value) {
        await apiCall.delete(`/templatejawaban/${item.value}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        });
      }

      const newOptions = options.filter((_, i) => i !== index);

      setValue("options", newOptions, { shouldDirty: true });
    } catch (err: any) {
      pushToast(err?.response?.data?.message || "Gagal hapus opsi");
    }
  };

  return (
    <div className="border-t border-indigo-50 pt-8 relative">
      {/* TOAST */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-slide-in"
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h4 className="text-sm font-bold text-indigo-900">
          Konfigurasi Opsi Jawaban
        </h4>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={()=>addOption()}
            className="flex items-center gap-2 text-primary text-sm font-bold hover:text-primary/50"
          >
            <Icon name="add_circle" />
            Opsi
          </Button>

          <Button
            type="button"
            onClick={()=>addOption(true)}
            className="flex items-center gap-2 text-primary text-sm font-bold hover:text-primary/50"
          >
            <Icon name="add_circle" />
            Free Text
          </Button>
        </div>
      </div>

      {/* LIST OPTIONS */}
      <div className="space-y-3 overflow-x-auto">
        {options.map((field, index) => (
          <div key={index} className="flex gap-4 items-center">
            <span className="text-xs font-bold text-slate-400 w-6">
              {index + 1}.
            </span>

            <InputField
              id={`option-${index}`} // ✅ FIX: gunakan index (stabil)
              placeholder="Isi opsi..."
              inputClassName={`p-3 ${field?.payload?.IsFreeText as boolean? "!bg-gree-500":""}`}
              wrapperClassName="flex-1"
              disabled={field?.payload?.IsFreeText as boolean || stateQuestion?.selected?.tipe=="rating"}
              register={register(
                `options.${index}.label` as const,
                // {required: "Opsi tidak boleh kosong",}
              )}
            />

            <AnimatedButton
              type="button"
              icon="delete"
              onClick={() => removeOption(index)}
              className="text-error"
            />
          </div>
        ))}

        {/* SKELETON */}
        {Array.from({ length: addingCount }).map((_, i) => (
          <OptionSkeleton key={`skeleton-${i}`} />
        ))}
      </div>

      {/* SUBMIT BUTTON */}
      <div className="mt-8 flex gap-2 justify-end">
        <AnimatedButton
          type="submit"
          disabled={formState.isSubmitting}
          className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-[1.02]"
        >
          {formState.isSubmitting
            ? "Menyimpan..."
            : isEdit
              ? "Update Pertanyaan"
              : "Simpan Pertanyaan"}
        </AnimatedButton>

        <AnimatedButton
          type="button"
          onClick={onReset}
          disabled={formState.isSubmitting}
          className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-[1.02]"
        >
          {formState.isSubmitting ? "Menyimpan..." : "Pertanyaan Baru"}
        </AnimatedButton>
      </div>
    </div>
  );
}
