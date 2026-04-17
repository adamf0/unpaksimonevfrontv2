"use client";

import { useEffect, useState } from "react";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { useForm, Controller } from "react-hook-form";
import { adaptSelectOptions } from "../../Common/Adapter/adaptSelectOptions";
import { SelectField } from "../../Common/Components/Organisms/SelectField";
import { useCategoryContext } from "../Context/CategoryProvider";
import { FormValues } from "../Attribut/FormValues";
import { useToast } from "../../Common/Context/ToastContext";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";

export function CreateCategoryForm() {
  const { state, actionCategory, loadData, setState } = useCategoryContext();
  const { pushToast } = useToast();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      kategori: "",
      subKategori: null,
    },
  });

  const options = adaptSelectOptions(state.source, {
    valueKey: "UUID",
    labelKey: "FullTexts",
  });

  useEffect(() => {
    if (!state.selected) return;

    // 🔥 set input text
    setValue("kategori", state.selected.namaKategori);

    // 🔥 map ke option
    const selectedOption = options.find(
      (opt) => opt.value === state.selected.uuidSubKategori,
    );

    console.log(selectedOption);

    if (selectedOption) {
      setValue("subKategori", selectedOption);
    } else {
      // fallback kalau option belum ready
      setValue("subKategori", null);
    }
  }, [state.selected, options, setValue]);

  const onSubmit = async (data: FormValues) => {
    console.log("FORM:", data);

    try {
      const uuid = await actionCategory(
        state?.selected?.uuid,
        data,
        state?.selected ? "update" : "create",
      );
      pushToast("Berhasil simpan");

      reset({
        kategori: "",
        subKategori: null,
      });

      // keluar dari mode edit
      setState((prev: any) => ({
        ...prev,
        selected: null,
      }));
    } catch (error: any) {
      console.error(error);
      if (!error.response) return pushToast("Server error");

      const { status, data } = error.response;

      const cf = handleCloudflareError(status);
      if (cf) return pushToast(cf);

      pushToast(data?.message || "Error");
    }

    await loadData();
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField
        id="kategori"
        label="Kategori"
        placeholder="Enter kategori"
        register={register("kategori", {
          required: "Kategori wajib diisi",
        })}
        error={errors.kategori?.message}
      />
      <Controller
        control={control}
        name="subKategori"
        render={({ field }) => (
          <SelectField
            label="Sub Kategori"
            placeholder="Pilih Sub Kategori"
            options={options}
            value={field.value}
            onChange={field.onChange}
            mode="single"
            renderItem={(opt, selected) => (
              <div className="flex items-center justify-between w-full">
                {" "}
                <span className="text-sm">{opt.label}</span>{" "}
                {selected && (
                  <span className="text-green-500 text-xs font-medium">
                    {" "}
                    ✓{" "}
                  </span>
                )}{" "}
              </div>
            )}
          />
        )}
      />

      <div className="col-span-1 md:col-span-2 pt-4">
        <AnimatedButton
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform indigo-shadow"
          icon=""
        >
          Register New Category
        </AnimatedButton>
      </div>
    </form>
  );
}
