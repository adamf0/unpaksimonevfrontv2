'use client';

type Props = {
  children: React.ReactNode;
  className?: string;
  lineClassName?: string;
  textClassName?: string;
};

export default function Divider({
  children,
  className = '',
  lineClassName = '',
  textClassName = '',
}: Props) {
  return (
    <div className={`flex items-center gap-4 my-10 ${className}`}>
      <div className={`h-px flex-1 bg-outline-variant/30 ${lineClassName}`} />

      <span
        className={`
          text-xs font-bold text-outline uppercase tracking-[0.2em] whitespace-nowrap
          ${textClassName}
        `}
      >
        {children}
      </span>

      <div className={`h-px flex-1 bg-outline-variant/30 ${lineClassName}`} />
    </div>
  );
}