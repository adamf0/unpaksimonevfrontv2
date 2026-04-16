"use client";

import { useEffect, useState } from "react";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { useForm, Controller } from "react-hook-form";
import { adaptSelectOptions } from "../../Common/Adapter/adaptSelectOptions";
import { SelectField } from "../../Common/Components/Organisms/SelectField";
import { useCategoryContext } from "../Context/CategoryProvider";

type FormValues = {
  kategori: string;
  subKategori: any;
};

export function CreateCategoryForm() {
  const { state } = useCategoryContext();

  const {
    control,
    register,
    handleSubmit,
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

    console.log(selectedOption)

    if (selectedOption) {
      setValue("subKategori", selectedOption);
    } else {
      // fallback kalau option belum ready
      setValue("subKategori", {
        value: state.selected.uuidSubKategori,
        label: state.selected.subKategori,
      });
    }
  }, [state.selected, options, setValue]);

  const onSubmit = (data: FormValues) => {
    console.log("FORM:", data);
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
