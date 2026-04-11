"use client";

export function CategoryFilterForm() {
  return (
    <>
      <div>
        <label className="text-sm font-semibold">Created By</label>
        <select className="w-full mt-1 p-2 rounded-lg border">
          <option>All</option>
          <option>Admin</option>
          <option>Operator</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold">Kategori</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded-lg border"
          placeholder="Search kategori / sub kategori..."
        />
      </div>
    </>
  );
}