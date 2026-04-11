"use client";

import { useState } from "react";
import Icon from "../../Common/Components/Atoms/Icon";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { InputField } from "../../Common/Components/Molecules/InputField";
import Button from "../../Common/Components/Atoms/Button";
import OptionSkeleton from "../Atoms/OptionSkeleton";

/* =========================
   TYPES
   ========================= */
interface ChoiceOption {
  id: number;
  label: string;
}

interface Toast {
  id: number;
  message: string;
}

/* =========================
   COMPONENT
   ========================= */
export default function CreateTemplateChoiceForm() {
  const [options, setOptions] = useState<ChoiceOption[]>([
    { id: 1, label: "Sangat Memuaskan" },
    { id: 2, label: "Memuaskan" },
    { id: 3, label: "Kurang Memuaskan" },
  ]);

  /* =========================
     STATE
     ========================= */
  const [loadingRowIds, setLoadingRowIds] = useState<number[]>([]);
  const [errorRowIds, setErrorRowIds] = useState<number[]>([]);
  const [addingCount, setAddingCount] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* =========================
     TOAST HANDLER
     ========================= */
  const pushToast = (message: string) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  /* =========================
     HANDLERS
     ========================= */

  // ADD (simulate API + error)
  const addOption = () => {
    setAddingCount((prev) => prev + 1);

    setTimeout(() => {
      const isError = true;

      if (isError) {
        setAddingCount((prev) => prev - 1);
        pushToast("Gagal menambahkan opsi. Coba lagi.");
        return;
      }

      setOptions((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          label: "",
        },
      ]);

      setAddingCount((prev) => prev - 1);
    }, 800);
  };

  // DELETE (simulate API + error)
  const removeOption = (id: number) => {
    setLoadingRowIds((prev) => [...prev, id]);

    setTimeout(() => {
      const isError = true

      if (isError) {
        setLoadingRowIds((prev) => prev.filter((x) => x !== id));
        setErrorRowIds((prev) => [...prev, id]);
        return;
      }

      setOptions((prev) => prev.filter((opt) => opt.id !== id));
      setLoadingRowIds((prev) => prev.filter((x) => x !== id));
    }, 800);
  };

  // UPDATE INPUT
  const updateOption = (id: number, value: string) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, label: value } : opt
      )
    );
  };

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="border-t border-indigo-50 pt-8 relative">
      {/* ================= TOAST ================= */}
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
      <div className="flex flex-col justify-between sm:flex-row gap-2 sm:gap-4 items-start sm:items-center mb-6">
        <h4 className="text-sm font-bold text-indigo-900">
          Konfigurasi Opsi Jawaban
        </h4>

        <div className="flex items-center gap-2">
          <Button
            onClick={addOption}
            className="flex items-center gap-2 text-primary text-sm font-bold hover:text-primary/50"
          >
            <Icon name="add_circle" />
            Opsi
          </Button>

          <Button className="flex items-center gap-2 text-primary text-sm font-bold hover:text-primary/50">
            <Icon name="add_circle" />
            Free Text
          </Button>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-3 overflow-x-auto">
        {/* HINT */}
        <div className="text-xs text-slate-400 flex items-center gap-1 px-1">
          <Icon name="swipe" className="text-sm" />
          Geser ke samping untuk melihat
        </div>

        {/* OPTIONS */}
        {options.map((opt, index) => {
          if (loadingRowIds.includes(opt.id)) {
            return <OptionSkeleton key={opt.id} />;
          }

          return (
            <div key={opt.id} className="space-y-1">
              <div className="flex gap-4 items-center">
                <span className="text-xs font-bold text-slate-400 w-6">
                  {index + 1}.
                </span>

                <InputField
                  id={`option-${opt.id}`}
                  placeholder="Isi opsi..."
                  inputClassName="p-3"
                  wrapperClassName="flex-1"
                  register={
                    {
                      value: opt.label,
                      onChange: (e: any) =>
                        updateOption(opt.id, e.target.value),
                    } as any
                  }
                />

                <AnimatedButton
                  icon="delete"
                  onClick={() => removeOption(opt.id)}
                  className="text-error"
                />
              </div>

              {/* ERROR MESSAGE */}
              {errorRowIds.includes(opt.id) && (
                <p className="text-xs text-red-500 pl-10">
                  Gagal menghapus opsi. Silakan coba lagi.
                </p>
              )}
            </div>
          );
        })}

        {/* ADD SKELETON */}
        {Array.from({ length: addingCount }).map((_, i) => (
          <OptionSkeleton key={`add-${i}`} />
        ))}
      </div>

      {/* SUBMIT */}
      <div className="mt-8 flex justify-end">
        <AnimatedButton className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-[1.02]">
          Simpan Pertanyaan
        </AnimatedButton>
      </div>
    </div>
  );
}