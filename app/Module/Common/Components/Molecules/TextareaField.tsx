"use client";

import Label from "../Atoms/Label";

interface TextareaFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  rows?: number;
}

export function TextareaField({
  label,
  id,
  placeholder,
  rows = 3,
}: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-bold text-on-surface-variant ml-1" htmlFor={id}>
        {label}
      </Label>

      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-5 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface resize-none"
      />
    </div>
  );
}