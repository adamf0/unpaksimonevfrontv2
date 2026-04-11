"use client";

import Icon from "../../Common/Components/Atoms/Icon";

interface TabButtonProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  innerRef?: React.Ref<HTMLButtonElement>;
}

export function TabButton({
  icon,
  label,
  active,
  onClick,
  innerRef,
}: TabButtonProps) {
  return (
    <button
      ref={innerRef}
      onClick={onClick}
      className={`pb-4 flex items-center gap-2 transition-all ${
        active
          ? "text-primary font-bold"
          : "text-on-surface-variant hover:text-primary"
      }`}
    >
      <Icon name={icon} />
      {label}
    </button>
  );
}