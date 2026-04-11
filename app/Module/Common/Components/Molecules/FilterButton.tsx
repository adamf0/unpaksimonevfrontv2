"use client";

import Icon from "../Atoms/Icon";

interface FilterButtonProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function FilterButton({
  count = 0,
  onClick,
  className = "",
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold hover:bg-secondary-container/80 transition-colors w-full sm:w-auto ${className}`}
    >
      <Icon name="tune" className="!text-lg" />
      <span>Advanced Filters</span>

      {count > 0 && (
        <span className="ml-1 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 leading-none flex items-center">
          {count}
        </span>
      )}
    </button>
  );
}