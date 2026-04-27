"use client";

import { SelectField } from "../../Common/Components/Organisms/SelectField";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { adaptSelectOptions } from "../Adapter/adaptSelectOptions";
import { useQuestionBankContext } from "../Context/QuestionBankProvider";
import { useMemo } from "react";

type Props = {
  value: any;
  onChange: (val: any) => void;
};

export function BankSoalFilterForm({ value, onChange }: Props) {
  const { state } = useQuestionBankContext();
  
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
      {/* ROLE */}
      <SelectField
        label="Created By"
        mode="single"
        value={selectedLevel}
        onChange={(val: any) =>
          onChange({
            ...value,
            role: val?.value ?? "",
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

      {/* SEMESTER */}
      {/* <SelectField
        label="Semester"
        mode="single"
        value={selectedSemester}
        onChange={(val: any) =>
          onChange({
            ...value,
            semester: val?.value ?? "",
            page: 1,
          })
        }
        placeholder="Select semester"
        options={[
          { label: "202501", value: "202501" },
          { label: "202502", value: "202502" },
        ]}
      /> */}
    </div>
  );
}
