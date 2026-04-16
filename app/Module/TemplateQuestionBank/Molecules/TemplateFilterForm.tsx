"use client";

type Props = {
  value: any;
  onChange: (val: any) => void;
};

export function TemplateFilterForm({ value, onChange }: Props) {
  return (
    <>
      <div>
        <label className="text-sm font-semibold">Created By</label>
        <select
          className="w-full mt-1 p-2 rounded-lg border"
          value={value.role || ""}
          onChange={(e) => onChange({ ...value, role: e.target.value })}
        >
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="fakultas">Fakultas</option>
          <option value="prodi">Prodi</option>
        </select>
      </div>

      {/* CREATOR (fakultas/prodi name search) */}
      <div>
        <label className="text-sm font-semibold">Fakultas</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded-lg border"
          value={value.nama_fakultas || ""}
          onChange={(e) =>
            onChange({ ...value, nama_fakultas: e.target.value })
          }
          placeholder="Hukum..."
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Prodi</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded-lg border"
          value={value.nama_prodi || ""}
          onChange={(e) => onChange({ ...value, nama_prodi: e.target.value })}
          placeholder="Hukum (S1)..."
        />
      </div>

      {/* JUDUL */}
      <div>
        <label className="text-sm font-semibold">Judul</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded-lg border"
          value={value.judul || ""}
          onChange={(e) => onChange({ ...value, judul: e.target.value })}
          placeholder="Search judul..."
        />
      </div>
    </>
  );
}
