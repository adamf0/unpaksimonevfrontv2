"use client";

import { useForm, Controller } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { SelectField } from "../../Common/Components/Organisms/SelectField";
import { Option } from "../../Common/Components/Attribut/Option";
import { useAccountContext } from "../Context/AccountProvider";
import { useToast } from "../../Common/Context/ToastContext";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";
import { adaptSelectOptions } from "../Adapter/adaptSelectOptions";
import apiCall from "../../Common/External/APICall";

type FormValues = {
  selectedLdap: Option | null;
  username: string;
  name: string;
  email: string;
  password?: string;
  level: Option | null;
  fakultas: Option | null;
  prodi: Option | null;
};

export function CreateUserForm() {
  const { state, actionAccount, setState, loadData } = useAccountContext();
  const { pushToast } = useToast();

  const [ldapOptions, setLdapOptions] = useState<Option[]>([]);
  const [loadingLdap, setLoadingLdap] = useState(false);

  const allowedFields = [
    "username",
    "name",
    "email",
    "password",
    "level",
    "fakultas",
    "prodi",
  ];

  const defaultFormValues: FormValues = {
    selectedLdap: null,
    username: "",
    name: "",
    email: "",
    password: "",
    level: null,
    fakultas: null,
    prodi: null,
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    resetField,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  const mapGroupToLabel = (groupName: string): string => {
    if (!groupName) return "";
    const trimmed = groupName.trim().toLowerCase();
    switch (trimmed) {
      case "adm_simonev_prodi":
        return "prodi";
      case "adm_simonev_fakultas":
        return "fakultas";
      case "adm_simonev":
        return "admin";
      case "adm_pusat":
        return "super admin";
      default:
        return groupName;
    }
  };

  // Load LDAP Accounts for Selection
  useEffect(() => {
    let isMounted = true;
    setLoadingLdap(true);

    apiCall
      .get("/accounts/ldap", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        if (!isMounted) return;
        const list = res.data?.data || [];
        const opts: Option[] = list.map((item: any) => {
          // const idLabel = item.employee_id || item.username;
          const mappedGroup = mapGroupToLabel(item.matched_group);
          const groupInfo = mappedGroup ? ` (${mappedGroup})` : "";
          return {
            label: `${item.name || item.username} ${groupInfo}`,
            value: item.username || item.employee_id,
            raw: item,
          };
        });
        setLdapOptions(opts);
      })
      .catch((err) => {
        console.warn("Failed to load LDAP accounts", err);
      })
      .finally(() => {
        if (isMounted) setLoadingLdap(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
    const kodeFakultas = selectedFakultas?.value;

    if (!kodeFakultas) {
      if (isAdmin) {
        return adaptSelectOptions(raw, {
          valueKey: "KodeProdi",
          labelKey: "NamaProdi",
        });
      }
      return [];
    }

    const filtered = raw.filter(
      (item: any) =>
        String(item.KodeFakultas).trim() === String(kodeFakultas).trim()
    );

    return adaptSelectOptions(filtered, {
      valueKey: "KodeProdi",
      labelKey: "NamaProdi",
    });
  }, [state.sourceProdi, selectedFakultas, isAdmin]);

  // Handle Edit Mode Populate
  useEffect(() => {
    if (!state.selected) return;

    const currentEmpId =
      state.selected.EmployeeID ??
      state.selected.employee_id ??
      state.selected.Username ??
      "";
    const currentUsername = state.selected.Username ?? "";

    // Cari opsi LDAP yang cocok berdasarkan employee_id terlebih dahulu
    const matchedLdapOpt = ldapOptions.find((o) => {
      const raw = (o as any).raw || {};
      return (
        (currentEmpId && (raw.employee_id === currentEmpId || o.value === currentEmpId)) ||
        (currentUsername && (raw.username === currentUsername || o.value === currentUsername))
      );
    });

    const initialLdapOpt =
      matchedLdapOpt ||
      (currentEmpId
        ? {
            label: state.selected.Name
              ? `${state.selected.Name} (${currentEmpId})`
              : currentEmpId,
            value: currentEmpId,
          }
        : null);

    reset({
      selectedLdap: initialLdapOpt,
      username: currentUsername,
      name: state.selected.Name ?? "",
      email: state.selected.Email ?? "",
      password: "",

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
            label: state.selected.Fakultas ?? state.selected.RefFakultas,
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
  }, [state.selected, ldapOptions, reset]);

  const handleLdapSelect = (opt: Option | null) => {
    setValue("selectedLdap", opt);
    if (opt) {
      const raw = (opt as any).raw || {};
      const uname = raw.username || raw.employee_id || opt.value;
      const fullname = raw.name || opt.label.split(" (")[0] || uname;
      const mail = raw.email || "";

      setValue("username", uname);
      setValue("name", fullname);
      setValue("email", mail);

      if (raw.matched_group) {
        const mappedGroup = mapGroupToLabel(raw.matched_group);
        if (mappedGroup === "prodi") {
          setValue("level", { label: "Prodi", value: "prodi" });
        } else if (mappedGroup === "fakultas") {
          setValue("level", { label: "Fakultas", value: "fakultas" });
        } else if (mappedGroup === "admin" || mappedGroup === "super admin") {
          setValue("level", { label: "Admin", value: "admin" });
        }
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    const finalUsername = data.username || data.selectedLdap?.value || "";
    const rawLdap = (data.selectedLdap as any)?.raw || {};
    const finalEmpId =
      rawLdap.employee_id || data.selectedLdap?.value || rawLdap.username || "";
    const finalName = data.name || data.selectedLdap?.label || finalUsername;

    const payload: any = {
      username: finalUsername,
      employee_id: finalEmpId,
      name: finalName,
      fullname: finalName,
      password: data.password || "",
      email: data.email,
      level: data.level,
      fakultas: data.fakultas,
      prodi: data.prodi,
    };

    try {
      await actionAccount(
        state?.selected?.UUID,
        payload,
        state?.selected ? "update" : "create"
      );
      pushToast("Berhasil menyimpan pemetaan akun SSO");

      reset(defaultFormValues);

      if (state?.selected) {
        setState((prev: any) => ({
          ...prev,
          selected: null,
        }));
      }
    } catch (error: any) {
      if (!error.response) return pushToast("Server error");

      const { status, data: errData } = error.response;

      if (errData?.code?.endsWith(".Validation")) {
        const messages = errData.message;

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

      pushToast(errData?.message || "Error");
    }

    await loadData();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-lowest p-6"
    >
      {/* 1. Akun SSO LDAP Selector (Opsional) */}
      <Controller
        control={control}
        name="selectedLdap"
        render={({ field }) => (
          <div className="col-span-1 md:col-span-2">
            <SelectField
              label="Akun SSO LDAP"
              mode="single"
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                handleLdapSelect(val as Option | null);
              }}
              placeholder={loadingLdap ? "Loading LDAP accounts..." : "Cari/Pilih Akun SSO LDAP (Opsional)..."}
              options={ldapOptions}
            />
          </div>
        )}
      />

      {/* 2. Username */}
      <InputField
        id="username"
        label="Username"
        placeholder="Enter username (auto-filled from LDAP)"
        register={register("username", {
          required: "Username wajib diisi",
        })}
        error={errors.username?.message}
      />

      {/* 3. Full Name */}
      <InputField
        id="name"
        label="Full Name"
        placeholder="Nama lengkap dari LDAP"
        register={register("name", {
          required: "Nama wajib diisi",
        })}
        error={errors.name?.message}
      />

      {/* 4. Email Address */}
      <InputField
        id="email"
        label="Email Address"
        type="email"
        placeholder="Email dari LDAP"
        register={register("email", {
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Format email tidak valid",
          },
        })}
        error={errors.email?.message}
      />

      {/* 5. Password */}
      <InputField
        id="password"
        label="Password"
        type="password"
        placeholder="Masukkan password (opsional untuk SSO)"
        register={register("password")}
        error={errors.password?.message}
      />

      {/* 5. Level Akses Simonev */}
      <Controller
        control={control}
        name="level"
        rules={{ required: "Level wajib dipilih" }}
        render={({ field }) => (
          <div>
            <SelectField
              label="Level Akses Simonev"
              mode="single"
              value={field.value}
              onChange={field.onChange}
              placeholder="Pilih Level (Admin / Fakultas / Prodi)"
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

      {/* 6. Fakultas (Skop Akses) */}
      <Controller
        control={control}
        name="fakultas"
        rules={{
          validate: (val) => {
            if ((isFakultas || isProdi) && !val) return "Fakultas wajib dipilih";
            return true;
          },
        }}
        render={({ field }) => (
          <div>
            <SelectField
              label="Fakultas (Skop Akses)"
              mode="single"
              value={field.value}
              onChange={field.onChange}
              placeholder="Pilih Fakultas"
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

      {/* 7. Program Studi (Skop Akses) */}
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
              label="Program Studi (Skop Akses)"
              mode="single"
              value={field.value}
              onChange={field.onChange}
              placeholder="Pilih Prodi"
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
          {state.selected ? "Update Account" : "Map SSO Account"}
        </AnimatedButton>
      </div>
    </form>
  );
}
