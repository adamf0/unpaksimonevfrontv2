"use client";

import { useMemo } from "react";
import { SelectField } from "../../Common/Components/Organisms/SelectField";
import { useKuesionerReportContext } from "../Context/KuesionerReportContext";
import { adaptSelectOptions } from "../../Account/Adapter/adaptSelectOptions";

type Props = {
  value: any;
  onChange: (val: any) => void;
};

export function ReportFilterForm({ value, onChange }: Props) {
  const { dataFakultas, dataProdi } = useKuesionerReportContext();

  /** =========================
   * SELECTED VALUE FROM QUERY
   * ========================= */
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
    return adaptSelectOptions(dataFakultas ?? [], {
      valueKey: "KodeFakultas",
      labelKey: "NamaFakultas",
    });
  }, [dataFakultas]);

  const prodiOptions = useMemo(() => {
    const raw = dataProdi ?? [];
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
  }, [dataProdi, value.kode_fakultas, isAdmin]);

  return (
    <div className="space-y-4">
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
          })
        }
        placeholder="Select prodi"
        options={prodiOptions}
      />
    </div>
  );
}