"use client";

export function AccountFilterForm() {
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
        <label className="text-sm font-semibold">Name</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded-lg border"
          placeholder="Search name..."
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Department</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded-lg border"
          placeholder="Search department..."
        />
      </div>
    </>
  );
}