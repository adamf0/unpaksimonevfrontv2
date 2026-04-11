// organisms/SelectFieldLite.tsx
"use client";

import { Option } from "../Attribut/Option";

export function SelectFieldLite({
  label,
  options,
  value,
  onChange,
  placeholder,
}: any) {
  return (
    <div className="space-y-2">
      <label>{label}</label>

      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full p-3 rounded-lg bg-surface-container-low"
      >
        <option value="">{placeholder}</option>

        {options.map((o: Option) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}