"use client";

import { Option } from "../../Common/Components/Attribut/Option";
import { SelectField } from "../../Common/Components/Organisms/SelectField";
import {
  SandboxPersona,
  RespondentRole,
  FAKULTAS_OPTIONS,
  PRODI_OPTIONS,
  UNIT_OPTIONS,
} from "../Attribut/SandboxTypes";

interface Props {
  bankSoalOptions: Option[];
  selectedBankSoal: Option | null;
  onSelectBankSoal: (opt: Option | null) => void;

  selectedBankSoalDetail?: any;
  simulationDateStr: string;
  onSimulationDateChange: (dateStr: string) => void;

  userLevel?: string;
  isFacultyLocked?: boolean;
  isProdiLocked?: boolean;

  persona: SandboxPersona;
  onPersonaChange: (updated: SandboxPersona) => void;

  onStartSimulation: () => void;
  loading: boolean;
}

export default function SandboxConfigurator({
  bankSoalOptions,
  selectedBankSoal,
  onSelectBankSoal,
  selectedBankSoalDetail,
  simulationDateStr,
  onSimulationDateChange,
  userLevel = "admin",
  isFacultyLocked = false,
  isProdiLocked = false,
  persona,
  onPersonaChange,
  onStartSimulation,
  loading,
}: Props) {
  const handleRoleChange = (role: RespondentRole) => {
    if (role === "mahasiswa") {
      onPersonaChange({
        ...persona,
        role: "mahasiswa",
        nama: "Ahmad Simulasi",
        identitas: "010123001",
      });
    } else if (role === "dosen") {
      onPersonaChange({
        ...persona,
        role: "dosen",
        nama: "Dr. Simulasi Dosen, M.Si",
        identitas: "0412345601",
      });
    } else {
      onPersonaChange({
        ...persona,
        role: "tendik",
        nama: "Simulasi Staf Tendik",
        identitas: "198501012010121001",
      });
    }
  };

  const handleFakultasChange = (opt: Option | null) => {
    if (!opt || isFacultyLocked) return;
    const kodeFak = opt.value;
    const namaFak = opt.label;
    const availableProdis = PRODI_OPTIONS[kodeFak] || [];
    const firstProdi = availableProdis[0];

    onPersonaChange({
      ...persona,
      kodeFakultas: kodeFak,
      namaFakultas: namaFak,
      kodeProdi: firstProdi ? firstProdi.value : "",
      namaProdi: firstProdi ? firstProdi.label : "",
    });
  };

  const handleProdiChange = (opt: Option | null) => {
    if (!opt || isProdiLocked) return;
    onPersonaChange({
      ...persona,
      kodeProdi: opt.value,
      namaProdi: opt.label,
    });
  };

  const currentFakOption =
    FAKULTAS_OPTIONS.find((f) => f.value === persona.kodeFakultas) || null;

  const currentProdiList = PRODI_OPTIONS[persona.kodeFakultas] || [];
  const currentProdiOption =
    currentProdiList.find((p) => p.value === persona.kodeProdi) || null;

  const currentUnitOption =
    UNIT_OPTIONS.find((u) => u.value === persona.unit) || null;

  return (
    <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl border border-outline-variant/10 shadow-[0_12px_32px_-4px_rgba(44,42,81,0.04)] space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-2xl">science</span>
        </div>
        <div>
          <h2 className="text-lg font-black text-on-surface tracking-tight">
            Konfigurasi Simulasi Sandbox
          </h2>
          <p className="text-xs text-outline font-medium">
            Tentukan target responden, Bank Soal, dan tanggal simulasi aktif. Hasil simulasi ini <strong>tidak akan disimpan ke database</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* BANK SOAL SELECTOR */}
        <div className="md:col-span-8">
          <SelectField
            label="Bank Soal Target Simulasi"
            placeholder="Pilih Bank Soal..."
            options={bankSoalOptions}
            value={selectedBankSoal}
            onChange={onSelectBankSoal}
            mode="single"
          />
        </div>

        {/* TANGGAL SIMULASI (HARI INI) */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="text-xs text-on-surface flex items-center gap-1">
            {/* <span className="material-symbols-outlined text-sm text-amber-600">calendar_today</span> */}
            Tanggal Simulasi Pengisian
          </label>
          <input
            type="date"
            value={simulationDateStr}
            onChange={(e) => onSimulationDateChange(e.target.value)}
            className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-amber-500/40 border border-amber-500/20"
          />
          {/* <p className="text-[10px] text-outline italic">
            Default: Tanggal hari ini ({new Date().toISOString().split("T")[0]})
          </p> */}
        </div>

        {/* ROLE SELECTION */}
        <div className="md:col-span-12 space-y-2">
          <label className="text-xs font-bold text-on-surface">Target Peranan Responden</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "mahasiswa", label: "Mahasiswa", icon: "school" },
              { id: "dosen", label: "Dosen", icon: "badge" },
              { id: "tendik", label: "Tendik", icon: "work" },
            ].map((r) => {
              const active = persona.role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleChange(r.id as RespondentRole)}
                  className={`p-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                    active
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                      : "bg-surface-container-low text-outline hover:text-on-surface border-transparent"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {r.icon}
                  </span>
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* PERSONA IDENTITAS */}
        <div className="md:col-span-6 space-y-1.5">
          <label className="text-xs font-bold text-on-surface">Nama Responden Target</label>
          <input
            type="text"
            value={persona.nama}
            onChange={(e) => onPersonaChange({ ...persona, nama: e.target.value })}
            className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent"
          />
        </div>

        <div className="md:col-span-6 space-y-1.5">
          <label className="text-xs font-bold text-on-surface">
            {persona.role === "mahasiswa" ? "NPM" : persona.role === "dosen" ? "NIDN" : "NIP"}
          </label>
          <input
            type="text"
            value={persona.identitas}
            onChange={(e) => onPersonaChange({ ...persona, identitas: e.target.value })}
            className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-sm font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 border border-transparent"
          />
        </div>

        {/* FAKULTAS & PRODI SELECTORS */}
        {persona.role !== "tendik" ? (
          <>
            <div className="md:col-span-6">
              {isFacultyLocked ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface">Fakultas Target</label>
                  <div className="w-full bg-surface-container-high/60 px-4 py-3 rounded-xl text-sm font-bold text-on-surface/80 border border-outline-variant/20 cursor-not-allowed flex items-center justify-between">
                    <span>{currentFakOption?.label || persona.namaFakultas || "Fakultas"}</span>
                    <span className="material-symbols-outlined text-base text-outline">lock</span>
                  </div>
                </div>
              ) : (
                <SelectField
                  label="Fakultas Target"
                  placeholder="Pilih Fakultas..."
                  options={FAKULTAS_OPTIONS}
                  value={currentFakOption}
                  onChange={handleFakultasChange}
                  mode="single"
                />
              )}
            </div>

            <div className="md:col-span-6">
              {isProdiLocked ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface">Program Studi Target</label>
                  <div className="w-full bg-surface-container-high/60 px-4 py-3 rounded-xl text-sm font-bold text-on-surface/80 border border-outline-variant/20 cursor-not-allowed flex items-center justify-between">
                    <span>{currentProdiOption?.label || persona.namaProdi || "Program Studi"}</span>
                    <span className="material-symbols-outlined text-base text-outline">lock</span>
                  </div>
                </div>
              ) : (
                <SelectField
                  label="Program Studi Target"
                  placeholder="Pilih Prodi..."
                  options={currentProdiList}
                  value={currentProdiOption}
                  onChange={handleProdiChange}
                  mode="single"
                />
              )}
            </div>
          </>
        ) : (
          <div className="md:col-span-12">
            <SelectField
              label="Unit Kerjasama / Kerja"
              placeholder="Pilih Unit..."
              options={UNIT_OPTIONS}
              value={currentUnitOption}
              onChange={(opt) =>
                opt && onPersonaChange({ ...persona, unit: opt.value })
              }
              mode="single"
            />
          </div>
        )}
      </div>

      {/* ACTION BUTTON */}
      <div className="pt-4 border-t border-outline-variant/10 text-right">
        <button
          disabled={!selectedBankSoal || loading}
          onClick={onStartSimulation}
          className="px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all ml-auto"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Menyiapkan Lembar Simulasi...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">play_arrow</span>
              Mulai Simulasi Kuesioner (Sandbox Mode)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
