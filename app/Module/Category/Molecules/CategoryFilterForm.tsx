"use client";

import { useMemo } from "react";
import { useCategoryContext } from "../Context/CategoryProvider";
import { SelectField } from "../../Common/Components/Organisms/SelectField";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { adaptSelectOptions } from "../Adapter/adaptSelectOptions";

type Props = {
  value: any;
  onChange: (val: any) => void;
};

export function CategoryFilterForm({ value, onChange }: Props) {
  const { state } = useCategoryContext();

  /** =========================
   * SELECTED VALUE FROM QUERY
   * ========================= */
  const selectedRole = value.role
    ? {
        label: value.role.charAt(0).toUpperCase() + value.role.slice(1),
        value: value.role,
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

  const isAdmin = value.role === "admin";

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
      {/* ROLE */}
      <SelectField
        label="Created By"
        mode="single"
        value={selectedRole}
        onChange={(val: any) =>
          onChange({
            ...value,
            role: val?.value ?? "",
            kode_fakultas: "",
            nama_fakultas: "",
            kode_prodi: "",
            nama_prodi: "",
            page: 1,
          })
        }
        placeholder="Select role"
        options={[
          { label: "Admin", value: "admin" },
          { label: "Fakultas", value: "fakultas" },
          { label: "Prodi", value: "prodi" },
        ]}
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

      {/* KATEGORI */}
      <InputField
        id="kategori"
        label="Kategori"
        placeholder="Search kategori..."
        value={value.kategori ?? ""}
        onChange={(e: any) =>
          onChange({
            ...value,
            kategori: e.target.value,
            page: 1,
          })
        }
      />

      {/* SUB KATEGORI */}
      <InputField
        id="full_text"
        label="Sub Kategori"
        placeholder="Search sub kategori..."
        value={value.full_text ?? ""}
        onChange={(e: any) =>
          onChange({
            ...value,
            full_text: e.target.value,
            page: 1,
          })
        }
      />
    </div>
  );
}