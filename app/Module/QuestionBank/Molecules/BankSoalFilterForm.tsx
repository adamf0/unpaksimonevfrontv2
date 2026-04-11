"use client";

export function BankSoalFilterForm() {
  return (
    <>
      <div>
        <label className="text-sm font-semibold">Role</label>
        <select className="w-full mt-1 p-2 rounded-lg border">
          <option>All</option>
          <option>Admin</option>
          <option>Operator</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold">Created By</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded-lg border"
          placeholder="Search name creator like admin / fakultas hukum / prodi hukum..."
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Judul</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded-lg border"
          placeholder="Search judul..."
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Semester</label>
        <select className="w-full mt-1 p-2 rounded-lg border">
          <option>All</option>
          <option>1</option>
          <option>2</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold">Kategori</label>
        <select className="w-full mt-1 p-2 rounded-lg border">
          <option>All</option>
          <option>A</option>
          <option>B</option>
        </select>
      </div>
    </>
  );
}