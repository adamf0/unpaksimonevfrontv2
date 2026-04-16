import clsx from "clsx";
import { ButtonVariant } from "../../Attribut/ButtonVariant";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  ghost: "bg-transparent text-gray-500",
};

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export default function Button({
  children,
  variant = "primary",
  className = "text-[10px]",
  ...props
}: ButtonProps) {
  return (
    <span
      {...props}
      className={clsx(
        `px-3 py-1 font-black uppercase rounded-full tracking-wider`,
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
