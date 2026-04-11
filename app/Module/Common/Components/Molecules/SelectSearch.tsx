"use client";

export function SelectSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="p-2 border-b">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
        className="w-full p-2 text-sm bg-white rounded-md outline-none"
      />
    </div>
  );
}