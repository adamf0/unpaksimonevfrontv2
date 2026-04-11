"use client";

import { useState } from "react";
import Checkbox from "../../Common/Components/Atoms/Chekbox";
import Label from "../../Common/Components/Atoms/Label";

type Props = {
  id: string;
  label: string;
  type?: "radio" | "checkbox";

  withInput?: boolean;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (val: string) => void;

  checked?: boolean;
  name?: string;
  value?: string;

  onChange?: (value: string, checked: boolean) => void;

  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

export default function SelectableOption({
  id,
  label,
  type = "radio",
  withInput = false,
  inputPlaceholder = "Lainnya...",
  inputValue,
  onInputChange,
  checked = false,
  className = "",
  name,
  value = "",
  onChange,
  ...props
}: Props) {
  const [internalInput, setInternalInput] = useState("");

  const valueInput = inputValue ?? internalInput;

  const handleInputChange = (val: string) => {
    onInputChange?.(val);
    if (!onInputChange) setInternalInput(val);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(value, e.target.checked);
  };

  return (
    <div
      className={`space-y-2 p-4 md:p-5 rounded-xl cursor-pointer transition-all
      ${
        checked
          ? "ring-2 ring-primary bg-primary/5"
          : "bg-surface-container-lowest ring-1 ring-outline-variant/10 hover:ring-primary/40"
      }`}
    >
      <Label
        htmlFor={id}
        className="flex items-start sm:items-center gap-3 md:gap-4"
      >
        <Checkbox
          id={id}
          type={type}
          name={name}
          value={value}
          checked={checked}
          onChange={handleSelect}
          className={`
            mt-1 sm:mt-0 w-5 h-5 shrink-0
            text-primary focus:ring-primary/20
            transition-all cursor-pointer
            ${type === "checkbox" ? "rounded-md" : "rounded-full"}
            ${className}
          `}
          {...props}
        />

        <span className="text-sm md:text-base font-medium">
          {label}
        </span>
      </Label>

      {/* FREE TEXT */}
      {withInput && checked && (
        <textarea
          name={`${id}-extra`}
          value={valueInput}
          placeholder={inputPlaceholder}
          onChange={(e) => handleInputChange(e.target.value)}
          className="bg-white w-full px-3 py-2 text-sm border border-outline-variant/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      )}
    </div>
  );
}