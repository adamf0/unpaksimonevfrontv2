"use client";

import { UseFormRegisterReturn } from "react-hook-form";
import Input from "../Atoms/Input";
import Label from "../Atoms/Label";

interface InputFieldProps {
  label?: string;
  id?: string;
  placeholder?: string;
  type?: string;
  error?: string;

  disabled?: boolean;
  wrapperClassName?: string; // 🔥 untuk div luar
  inputClassName?: string;   // 🔥 untuk input

  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register?: UseFormRegisterReturn;
}

export const InputField = ({
  label,
  id,
  placeholder,
  type = "text",
  error,
  disabled,
  wrapperClassName = "",
  inputClassName = "",
  value,
  onChange,
  register,
}: InputFieldProps) => (
  <div className={`space-y-2 ${wrapperClassName}`}>
    {label && <Label >{label}</Label>}

    <Input
      placeholder={placeholder}
      type={type}
      name={id}
      value={value}
      register={register}
      onChange={onChange}
      className={`
        w-full bg-surface-container-low border-none rounded-lg p-3 text-sm 
        focus:ring-2 focus:ring-primary/20 transition-all
        ${inputClassName}
      `}
      disabled={disabled}
    />

    {error && (
      <p className="text-xs text-red-500 font-medium">{error}</p>
    )}
  </div>
);