"use client";

type Props = {
  value: any;
  onChange: (val: any) => void;
};

export function AccountFilterForm({ value, onChange }: Props) {
  return (
    <>
      {/* LEVEL */}
      <div>
        <label className="text-sm font-semibold">Level</label>
        <select
          className="w-full mt-1 p-2 rounded-lg border"
          value={value.level || ""}
          onChange={(e) =>
            onChange({
              ...value,
              level: e.target.value,
            })
          }
        >
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="fakultas">Fakultas</option>
          <option value="prodi">Prodi</option>
        </select>
      </div>

      {/* NAME */}
      <div>
        <label className="text-sm font-semibold">Name</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded-lg border"
          placeholder="Search name..."
          value={value.name || ""}
          onChange={(e) =>
            onChange({
              ...value,
              name: e.target.value,
            })
          }
        />
      </div>

      {/* EMAIL */}
      <div>
        <label className="text-sm font-semibold">Email</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded-lg border"
          placeholder="Search email..."
          value={value.email || ""}
          onChange={(e) =>
            onChange({
              ...value,
              email: e.target.value,
            })
          }
        />
      </div>

      {/* FAKULTAS */}
      <div>
        <label className="text-sm font-semibold">Fakultas</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded-lg border"
          placeholder="Search fakultas..."
          value={value.nama_fakultas || ""}
          onChange={(e) =>
            onChange({
              ...value,
              nama_fakultas: e.target.value,
            })
          }
        />
      </div>

      {/* PRODI */}
      <div>
        <label className="text-sm font-semibold">Prodi</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded-lg border"
          placeholder="Search prodi..."
          value={value.nama_prodi || ""}
          onChange={(e) =>
            onChange({
              ...value,
              nama_prodi: e.target.value,
            })
          }
        />
      </div>
    </>
  );
}