'use client';

import Chekbox from "../../Common/Components/Atoms/Chekbox";
import Label from "../../Common/Components/Atoms/Label";

type Props = {
  id: string;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function RememberMe({
  id,
  label,
  ...props
}: Props) {
  return (
    <div className="flex items-center gap-3 ml-1">
      <Chekbox
        id={id}
        {...props}
        className={`
          w-5 h-5 rounded border-outline-variant 
          text-primary focus:ring-primary/20 
          transition-all cursor-pointer
          ${props.className || ''}
        `}
      />

      <Label
        htmlFor={id}
        className="text-sm font-semibold text-on-surface-variant cursor-pointer select-none"
      >
        {label}
      </Label>
    </div>
  );
}