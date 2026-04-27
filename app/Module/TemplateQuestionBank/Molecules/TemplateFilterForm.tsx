"use client";

import { useMemo } from "react";
import { SelectField } from "../../Common/Components/Organisms/SelectField";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { adaptSelectOptions } from "../Adapter/adaptSelectOptions";
import { useTemplateQuestionContext } from "../Context/TemplateQuestionProvider";

type Props = {
  value: any;
  onChange: (val: any) => void;
};

export function TemplateFilterForm({ value, onChange }: Props) {
  const { questionState } = useTemplateQuestionContext();

  /** =========================
   * SELECTED VALUE
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
    return adaptSelectOptions(questionState.sourceFakultas ?? [], {
      valueKey: "KodeFakultas",
      labelKey: "NamaFakultas",
    });
  }, [questionState.sourceFakultas]);

  const prodiOptions = useMemo(() => {
    const raw = questionState.sourceProdi ?? [];
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
  }, [questionState.sourceProdi, value.kode_fakultas, isAdmin]);

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

      {/* JUDUL */}
      <InputField
        id="judul"
        label="Judul"
        placeholder="Search judul..."
        value={value.judul ?? ""}
        onChange={(e: any) =>
          onChange({
            ...value,
            judul: e.target.value,
            page: 1,
          })
        }
      />
    </div>
  );
}