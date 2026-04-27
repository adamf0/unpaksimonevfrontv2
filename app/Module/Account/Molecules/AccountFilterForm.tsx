"use client";

import { useMemo } from "react";
import { useAccountContext } from "../Context/AccountProvider";
import { adaptSelectOptions } from "../Adapter/adaptSelectOptions";
import { SelectField } from "../../Common/Components/Organisms/SelectField";
import { InputField } from "../../Common/Components/Molecules/InputField";

type Props = {
  value: any;
  onChange: (val: any) => void;
};

export function AccountFilterForm({ value, onChange }: Props) {
  const { state } = useAccountContext();

  /** =========================
   * SELECTED VALUE FROM QUERY
   * ========================= */
  const selectedLevel = value.level
    ? {
        label:
          value.level.charAt(0).toUpperCase() + value.level.slice(1),
        value: value.level,
      }
    : null;

  const selectedFakultas = value.nama_fakultas
    ? {
        label: value.nama_fakultas,
        value: value.kode_fakultas ?? value.nama_fakultas,
      }
    : null;

  const selectedProdi = value.nama_prodi
    ? {
        label: value.nama_prodi,
        value: value.kode_prodi ?? value.nama_prodi,
      }
    : null;

  const isAdmin = value.level === "admin";

  /** =========================
   * OPTIONS
   * ========================= */
  const fakultasOptions = useMemo(() => {
    return adaptSelectOptions(state.sourceFakultas ?? [], {
      valueKey: "KodeFakultas",
      labelKey: "NamaFakultas",
    });
  }, [state.sourceFakultas]);

  const prodiOptions = useMemo(() => {
    const raw = state.sourceProdi ?? [];
    const kodeFak = value.kode_fakultas;

    if (!kodeFak) {
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
        String(item.KodeFakultas).trim() === String(kodeFak).trim()
    );

    return adaptSelectOptions(filtered, {
      valueKey: "KodeProdi",
      labelKey: "NamaProdi",
    });
  }, [state.sourceProdi, value.kode_fakultas, isAdmin]);

  return (
    <div className="space-y-4">
      {/* LEVEL */}
      <SelectField
        label="Level"
        mode="single"
        value={selectedLevel}
        onChange={(val: any) =>
          onChange({
            ...value,
            level: val?.value ?? "",
            kode_fakultas: "",
            nama_fakultas: "",
            kode_prodi: "",
            nama_prodi: "",
            page: 1,
          })
        }
        placeholder="Select level"
        options={[
          { label: "Admin", value: "admin" },
          { label: "Fakultas", value: "fakultas" },
          { label: "Prodi", value: "prodi" },
        ]}
      />

      {/* NAME */}
      <InputField
        id="name"
        label="Name"
        placeholder="Search name..."
        value={value.name ?? ""}
        onChange={(e: any) =>
          onChange({
            ...value,
            name: e.target.value,
            page: 1,
          })
        }
      />

      {/* EMAIL */}
      <InputField
        id="email"
        label="Email"
        placeholder="Search email..."
        value={value.email ?? ""}
        onChange={(e: any) =>
          onChange({
            ...value,
            email: e.target.value,
            page: 1,
          })
        }
      />

      {/* FAKULTAS */}
      <SelectField
        label="Fakultas"
        mode="single"
        value={selectedFakultas}
        onChange={(val: any) =>
          onChange({
            ...value,
            kode_fakultas: val?.value ?? "",
            nama_fakultas: val?.label ?? "",
            kode_prodi: "",
            nama_prodi: "",
            page: 1,
          })
        }
        placeholder="Select fakultas"
        options={fakultasOptions}
      />

      {/* PRODI */}
      <SelectField
        label="Prodi"
        mode="single"
        value={selectedProdi}
        onChange={(val: any) =>
          onChange({
            ...value,
            kode_prodi: val?.value ?? "",
            nama_prodi: val?.label ?? "",
            page: 1,
          })
        }
        placeholder="Select prodi"
        options={prodiOptions}
      />
    </div>
  );
}