"use client";

interface BadgeIndicatorProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "error" | "neutral";
  className?: string;
}

const variantStyles = {
  primary: {
    text: "text-primary",
    dot: "bg-primary",
  },
  success: {
    text: "text-green-600",
    dot: "bg-green-600",
  },
  warning: {
    text: "text-yellow-600",
    dot: "bg-yellow-600",
  },
  error: {
    text: "text-error",
    dot: "bg-error",
  },
  neutral: {
    text: "text-on-surface-variant",
    dot: "bg-outline",
  },
};

export default function BadgeIndicator({
  children,
  variant = "primary",
  className = "",
  ...props
}: BadgeIndicatorProps) {
  const styles = variantStyles[variant];

  return (
    <span
      {...props}
      className={`flex items-center gap-1.5 font-bold ${styles.text} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
      {children}
    </span>
  );
}