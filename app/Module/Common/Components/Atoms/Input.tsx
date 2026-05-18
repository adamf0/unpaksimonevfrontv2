"use client";

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  register?: UseFormRegisterReturn;
};

export default function Input({
  register,
  onChange,
  onBlur,
  ...props
}: InputProps) {
  return (
    <input
      {...props}
      {...register}
      onChange={(e) => {
        // onChange dari InputField
        onChange?.(e);

        // onChange dari react-hook-form register
        register?.onChange?.(e);
      }}
      onBlur={(e) => {
        // onBlur dari InputField
        onBlur?.(e);

        // onBlur dari react-hook-form register
        register?.onBlur?.(e);
      }}
    />
  );
}