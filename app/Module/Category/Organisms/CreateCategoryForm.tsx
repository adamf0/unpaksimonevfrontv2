"use client";

import { useEffect } from "react";
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

  const allowedFields = ["kategori"];

  const defaultFormValues: FormValues = {
    kategori: "",
    subKategori: null,
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    setError,
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
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

    // console.log(selectedOption);

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

      reset(defaultFormValues);

      // keluar dari mode edit
      setState((prev: any) => ({
        ...prev,
        selected: null,
      }));
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
          {state.selected ? "Update Category" : "Register New Category"}
        </AnimatedButton>
      </div>
    </form>
  );
}
