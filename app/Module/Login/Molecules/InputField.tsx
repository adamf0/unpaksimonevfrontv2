"use client";

import { useState } from "react";
import Icon from "../../Common/Components/Atoms/Icon";

type InputFieldProps = {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
  icon?: string;
  labelAction?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputField({
  id,
  name,
  type = "text",
  label,
  placeholder,
  icon,
  labelAction,
  value,
  onChange,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-bold text-on-surface-variant ml-1"
        >
          {label}
        </label>

        {labelAction}
      </div>

      {/* Input wrapper */}
      <div className="relative group">
        {/* Icon */}
        {icon && (
          <Icon name={icon} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors"/>
        )}

        {/* Input */}
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full py-4 bg-surface-container-low border-2 border-transparent rounded-2xl text-on-surface focus:ring-0 focus:border-primary/50 transition-all placeholder:text-outline/40 font-medium ${
            icon ? "pl-12" : "pl-4"
          } pr-12`}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
          >
            <Icon name={showPassword ? "visibility_off" : "visibility"} className="!text-2xl"/>
          </button>
        )}
      </div>
    </div>
  );
}