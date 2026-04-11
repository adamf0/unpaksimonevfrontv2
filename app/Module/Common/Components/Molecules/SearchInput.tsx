"use client";

import Icon from "../Atoms/Icon";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
}: SearchInputProps) {
  return (
    <div
      className={`flex items-center bg-surface-container-low px-4 py-2 rounded-lg gap-3 w-full sm:w-auto border border-transparent focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all ${className}`}
    >
      <Icon name="search" className="text-outline !text-lg" />

      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        type="text"
        className="bg-transparent border-none outline-none focus:ring-0 text-sm w-full sm:w-48 placeholder:text-outline/60"
      />
    </div>
  );
}