"use client";

import { useState } from "react";

type Props = {
  minLabel?: string;
  maxLabel?: string;
  max?: number;
  value?: number;
  onChange?: (val: number) => void;
};

export default function RatingScale({
  minLabel = "Sangat Buruk",
  maxLabel = "Sanget Baik",
  max = 5,
  value,
  onChange,
}: Props) {
  const [internalValue, setInternalValue] = useState<number | null>(value ?? null);

  const selected = value !== undefined ? value : internalValue;

  const handleClick = (val: number) => {
    if (onChange) onChange(val);
    else setInternalValue(val);
  };

  return (
    <div
      className="
        grid 
        gap-2 md:gap-4 
        px-1 md:px-2
        
        /* <360px → vertical */
        grid-cols-1
        
        /* ≥360px → horizontal */
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
        className="
          grid justify-items-center
        "
        style={{
          gridTemplateColumns: `repeat(${max}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: max }, (_, i) => {
          const val = i + 1;
          const isActive = selected === val;

          return (
            <button
              key={val}
              type="button"
              onClick={() => handleClick(val)}
              className={`
                aspect-square w-full max-w-[48px]
                rounded-full border-2 
                font-bold grid place-items-center
                text-sm md:text-base transition-all
                ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-outline-variant/20 hover:border-primary hover:text-primary"
                }
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