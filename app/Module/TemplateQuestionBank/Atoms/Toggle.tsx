"use client";

import { useState } from "react";

type Props = {
  value?: boolean;
  onChange?: (v: boolean) => void;
};

export function Toggle({ value = false, onChange }: Props) {
  const [active, setActive] = useState(value);

  const handleToggle = () => {
    const newVal = !active;
    setActive(newVal);
    onChange?.(newVal);
  };

  return (
    <div
      onClick={handleToggle}
      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${
        active ? "bg-primary" : "bg-slate-300"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
          active ? "translate-x-4" : ""
        }`}
      />
    </div>
  );
}