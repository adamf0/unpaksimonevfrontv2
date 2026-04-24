import { clsx } from "clsx";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

export const isEmpty = (value: string | any[] | number | null | undefined) => {
  if (value === null || value === undefined) return true;

  if (value === "00000000-0000-0000-0000-000000000000") {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (typeof value === "number") {
    return value <= 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
};

export const toNumber = (val: any): number => {
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
};

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export const colors = Array.from({ length: 100 }, (_, i) => {
  const hue = (i * 137.508) % 360; // golden angle → distribusi warna lebih natural
  return `hsl(${hue}, 70%, 55%)`;
});