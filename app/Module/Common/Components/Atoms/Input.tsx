'use client';

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  register?: UseFormRegisterReturn;
};

export default function Input({
  register,
  ...props
}: InputProps) {
  return <input {...register} {...props} />;
}