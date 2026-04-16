"use client";

import clsx from "clsx";
import Icon from "../Atoms/Icon";

interface HistoryButtonProps {
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function HistoryButton({
  count = 0,
  onClick,
  active = false,
  className = "",
}: HistoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `flex items-center justify-center border border-white sm:justify-start gap-2 px-4 py-2  text-on-secondary-container rounded-lg text-sm font-bold hover:border-[var(--color-on-secondary-container)] transition-colors w-full sm:w-auto`,
        className,
        active ? "!border-[var(--color-on-secondary-container)]" : "",
      )}
    >
      <Icon name="eye_tracking" className="!text-lg" />
      <span>Show Deleted</span>

      {count > 0 && (
        <span className="ml-1 bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5 leading-none flex items-center">
          {count}
        </span>
      )}
    </button>
  );
}
