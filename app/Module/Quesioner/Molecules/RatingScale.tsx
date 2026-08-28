"use client";

import { useState } from "react";

export type RatingOption = {
  label: string;
  value: string;
  nilai?: number;
};

type Props = {
  minLabel?: string;
  maxLabel?: string;
  max?: number;
  value?: number | string;
  options?: RatingOption[];
  onChange?: (val: number, option?: RatingOption) => void;
  disabled?: boolean;
  readOnly?: boolean;
};

export default function RatingScale({
  minLabel = "Sangat Buruk",
  maxLabel = "Sangat Baik",
  max = 5,
  value,
  options,
  onChange,
  disabled = false,
  readOnly = false,
}: Props) {
  const [internalValue, setInternalValue] = useState<number | string | null>(
    value ?? null
  );

  const selected = value !== undefined ? value : internalValue;
  const effectiveMax = options && options.length > 0 ? options.length : max;

  const handleClick = (index: number, opt?: RatingOption) => {
    if (disabled || readOnly) return;
    const val = opt?.nilai ?? index + 1;
    if (onChange) {
      if (opt !== undefined) onChange(val, opt);
      else onChange(val);
    } else {
      setInternalValue(opt?.value ?? val);
    }
  };

  const isOptionActive = (index: number, opt?: RatingOption) => {
    if (selected === null || selected === undefined) return false;
    const val = index + 1;
    if (opt) {
      return (
        String(selected) === String(opt.value) ||
        String(selected) === String(opt.label) ||
        (opt.nilai !== undefined && Number(selected) === opt.nilai)
      );
    }
    return Number(selected) === val;
  };

  return (
    <div
      className="
        grid 
        gap-2 md:gap-4 
        px-1 md:px-2
        grid-cols-1
        min-[360px]:grid-cols-[auto_1fr_auto]
        items-center
      "
    >
      {/* TOP / LEFT LABEL */}
      <span className="text-[10px] md:text-xs font-bold text-error uppercase text-center min-[360px]:text-left">
        {minLabel}
      </span>

      {/* SCALE */}
      <div
        className="grid justify-items-center gap-2"
        style={{
          gridTemplateColumns: `repeat(${effectiveMax}, minmax(0, 1fr))`,
        }}
      >
        {options && options.length > 0
          ? options.map((opt, i) => {
              const active = isOptionActive(i, opt);
              const displayVal = opt.nilai ?? opt.label ?? i + 1;

              return (
                <button
                  key={opt.value || i}
                  type="button"
                  title={opt.label}
                  disabled={disabled}
                  onClick={() => handleClick(i, opt)}
                  className={`
                    aspect-square w-full max-w-[48px]
                    rounded-full border-2 
                    font-bold grid place-items-center
                    text-sm md:text-base transition-all
                    ${
                      active
                        ? "border-primary bg-primary text-white shadow-md scale-105"
                        : "border-outline-variant/20 bg-surface-container-low text-on-surface-variant hover:border-primary hover:text-primary"
                    }
                    ${disabled || readOnly ? "cursor-default" : "cursor-pointer"}
                  `}
                >
                  {displayVal}
                </button>
              );
            })
          : Array.from({ length: effectiveMax }, (_, i) => {
              const val = i + 1;
              const active = isOptionActive(i);

              return (
                <button
                  key={val}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleClick(i)}
                  className={`
                    aspect-square w-full max-w-[48px]
                    rounded-full border-2 
                    font-bold grid place-items-center
                    text-sm md:text-base transition-all
                    ${
                      active
                        ? "border-primary bg-primary text-white shadow-md scale-105"
                        : "border-outline-variant/20 bg-surface-container-low text-on-surface-variant hover:border-primary hover:text-primary"
                    }
                    ${disabled || readOnly ? "cursor-default" : "cursor-pointer"}
                  `}
                >
                  {val}
                </button>
              );
            })}
      </div>

      {/* BOTTOM / RIGHT LABEL */}
      <span className="text-[10px] md:text-xs font-bold text-primary uppercase text-center min-[360px]:text-right">
        {maxLabel}
      </span>
    </div>
  );
}