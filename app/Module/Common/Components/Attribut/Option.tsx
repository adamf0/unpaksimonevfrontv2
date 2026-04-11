import React from "react";

export type SelectMode = "single" | "multiple";

export interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
  group?: string;
  payload?: any;
}

type BaseProps<T> = {
  label?: string;
  id?: string;
  options: T[];
  placeholder?: string;
  renderItem?: (opt: T, selected: boolean) => React.ReactNode;
};

export type SelectFieldProps<T> =
  | (BaseProps<T> & {
      mode: "multiple";
      value: T[];
      onChange: (val: T[]) => void;
    })
  | (BaseProps<T> & {
      mode: "single";
      value: T | null;
      onChange: (val: T | null) => void;
    });