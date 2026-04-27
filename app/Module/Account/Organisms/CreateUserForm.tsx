"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo } from "react";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { SelectField } from "../../Common/Components/Organisms/SelectField";
import { Option } from "../../Common/Components/Attribut/Option";
import { useAccountContext } from "../Context/AccountProvider";
import { useToast } from "../../Common/Context/ToastContext";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { adaptSelectOptions } from "../Adapter/adaptSelectOptions";

type FormValues = {
  name: string;
  username: string;
  password: string;
  fullname: string;
  email: string;
  level: Option | null;
  fakultas: Option | null;
  prodi: Option | null;
};

export function CreateUserForm() {
  const { state, actionAccount, setState, loadData } = useAccountContext();
  const { pushToast } = useToast();
  const allowedFields = [
    "name",
    "username",
    "password",
    "fullname",
    "email",
    "level",
    "fakultas",
    "prodi",
  ];

  const {
    register,
    control,
    handleSubmit,
    watch,
    resetField,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      username: "",
      password: "",
      fullname: "",
      email: "",
      level: null,
      fakultas: null,
      prodi: null,
    },
  });

  const selectedLevel = watch("level");
  const selectedFakultas = watch("fakultas");

  const isAdmin = selectedLevel?.value === "admin";
  const isFakultas = selectedLevel?.value === "fakultas";
  const isProdi = selectedLevel?.value === "prodi";

  useEffect(() => {
    if (isAdmin) {
      resetField("fakultas");
      resetField("prodi");
    }

    if (isFakultas) {
      resetField("prodi");
    }
  }, [selectedLevel, isAdmin, isFakultas, resetField]);

  const fakultasOptions = useMemo(() => {
    return adaptSelectOptions(state.sourceFakultas ?? [], {
      valueKey: "KodeFakultas",
      labelKey: "NamaFakultas",
    });
  }, [state.sourceFakultas]);

  const prodiOptions = useMemo(() => {
    const raw = state.sourceProdi ?? [];

    // ambil kode fakultas terpilih
    const kodeFakultas = selectedFakultas?.value;

    // kalau belum pilih fakultas:
    // - admin tampilkan semua
    // - fakultas/prodi kosongkan dulu
    if (!kodeFakultas) {
      if (isAdmin) {
        return adaptSelectOptions(raw, {
          valueKey: "KodeProdi",
          labelKey: "NamaProdi",
        });
      }

      return [];
    }

    // filter sesuai fakultas terpilih
    const filtered = raw.filter(
      (item: any) =>
        String(item.KodeFakultas).trim() === String(kodeFakultas).trim(),
    );

    return adaptSelectOptions(filtered, {
      valueKey: "KodeProdi",
      labelKey: "NamaProdi",
    });
  }, [state.sourceProdi, selectedFakultas, isAdmin]);

  useEffect(() => {
    if (!state.selected) return;

    reset({
      name: state.selected.Name ?? "",
      username: state.selected.Username ?? "",
      password: "",
      fullname: state.selected.Name ?? "",
      email: state.selected.Email ?? "",

      level: state.selected.Level
        ? {
            label:
              state.selected.Level.charAt(0).toUpperCase() +
              state.selected.Level.slice(1),
            value: state.selected.Level,
          }
        : null,

      fakultas: state.selected.RefFakultas
        ? {
            label: state.selected.Fakultas ?? "",
            value: state.selected.RefFakultas,
          }
        : null,

      prodi: state.selected.RefProdi
        ? {
            label: state.selected.Prodi ?? state.selected.RefProdi,
            value: state.selected.RefProdi,
          }
        : null,
    });
  }, [state.selected, reset]);

  const onSubmit = async (data: FormValues) => {
    console.log("FORM DATA:", data);

    try {
      const uuid = await actionAccount(
        state?.selected?.UUID,
        data,
        state?.selected ? "update" : "create",
      );
      pushToast("Berhasil simpan");

      reset({
        name: "",
        username: "",
        password: "",
        fullname: "",
        email: "",
        level: null,
        fakultas: null,
        prodi: null,
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
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Name */}
      <InputField
        id="name"
        label="name"
        placeholder="Enter name"
        register={register("name", {
          required: "Name wajib diisi",
        })}
        error={errors.username?.message}
      />

      {/* Username */}
      <InputField
        id="username"
        label="Username"
        placeholder="Enter username"
        register={register("username", {
          required: "Username wajib diisi",
        })}
        error={errors.username?.message}
      />

      {/* Password */}
      <InputField
        id="password"
        label="Password"
        type="password"
        register={register(
          "password",
          !state.selected
            ? {
                required: "Password wajib diisi",
              }
            : {},
        )}
        error={errors.password?.message}
      />

      {/* Full Name */}
      <InputField
        id="fullname"
        label="Full Name"
        placeholder="e.g. Kevin"
        register={register("fullname", {
          required: "Nama wajib diisi",
        })}
        error={errors.fullname?.message}
      />

      {/* Email */}
      <InputField
        id="email"
        label="Email Address"
        type="email"
        register={register("email", {
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Format email tidak valid",
          },
        })}
        error={errors.email?.message}
      />

      {/* Level */}
      <Controller
        control={control}
        name="level"
        rules={{ required: "Level wajib dipilih" }}
        render={({ field }) => (
          <div>
            <SelectField
              label="Level"
              mode="single"
              value={field.value}
              onChange={field.onChange}
              placeholder="Select level"
              options={[
                { label: "Admin", value: "admin" },
                { label: "Fakultas", value: "fakultas" },
                { label: "Prodi", value: "prodi" },
              ]}
            />

            {errors.level && (
              <small className="-mt-4 text-error text-xs">
                {errors.level.message}
              </small>
            )}
          </div>
        )}
      />

      {/* Fakultas */}
      <Controller
        control={control}
        name="fakultas"
        rules={{
          validate: (val) => {
            if (!isAdmin && !val) return "Fakultas wajib dipilih";
            return true;
          },
        }}
        render={({ field }) => (
          <div>
            <SelectField
              label="Fakultas"
              mode="single"
              value={field.value}
              onChange={field.onChange}
              placeholder="Select fakultas"
              options={fakultasOptions}
            />

            {errors.fakultas && (
              <small className="-mt-4 text-error text-xs">
                {errors.fakultas.message}
              </small>
            )}
          </div>
        )}
      />

      {/* Prodi */}
      <Controller
        control={control}
        name="prodi"
        rules={{
          validate: (val) => {
            if (isProdi && !val) return "Prodi wajib dipilih";
            return true;
          },
        }}
        render={({ field }) => (
          <div>
            <SelectField
              label="Prodi"
              mode="single"
              value={field.value}
              onChange={field.onChange}
              placeholder="Select prodi"
              options={prodiOptions}
            />

            {errors.prodi && (
              <small className="-mt-4 text-error text-xs">
                {errors.prodi.message}
              </small>
            )}
          </div>
        )}
      />

      {/* Submit */}
      <div className="col-span-1 md:col-span-2 pt-4">
        <AnimatedButton
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform"
          icon=""
        >
          Register New Account
        </AnimatedButton>
      </div>
    </form>
  );
}
