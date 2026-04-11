type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger" | "ghost" | "warning";
};

export default function ModalButton({
  children,
  variant = "ghost",
  className = "",
  ...props
}: Props) {
  const styles = {
    ghost:
      "text-on-surface-variant hover:bg-surface-container-high",
    danger: "bg-error text-white shadow-error/20",
    warning: "bg-[#f59e0b] text-white shadow-amber-500/20",
    primary:
      "bg-primary text-white shadow-primary/20",
  };

  return (
    <button
      {...props}
      className={`
        px-6 py-3 font-bold rounded-xl transition-colors active:scale-95
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}