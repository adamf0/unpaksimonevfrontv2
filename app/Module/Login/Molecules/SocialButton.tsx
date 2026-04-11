'use client';

import Icon from "../../Common/Components/Atoms/Icon";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon?: string;
  customIcon?: React.ReactNode; // 🔥 untuk SVG seperti Google
};

export default function SocialButton({
  label,
  icon,
  customIcon,
  className = '',
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`
        flex items-center justify-center gap-3
        group
        transition-all duration-300
        active:scale-[0.98]
        ${className}
      `}
    >
      {/* ICON */}
      {customIcon ? (
        customIcon
      ) : (
        icon && <Icon name={icon} className="!text-xl" />
      )}

      {/* LABEL */}
      <span className="text-sm font-bold text-on-surface">
        {label}
      </span>
    </button>
  );
}