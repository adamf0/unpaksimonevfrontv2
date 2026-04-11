import Icon from "../Atoms/Icon";

type Props = {
  name: string;
  variant?: "error" | "warning" | "info";
};

export default function ModalIcon({ name, variant = "info" }: Props) {
  const variantMap = {
    error: "bg-error-container/20 text-error",
    warning: "bg-amber-100 text-amber-600",
    info: "bg-primary-container/20 text-primary",
  };

  return (
    <div
      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${variantMap[variant]}`}
    >
      <Icon name={name} className="text-3xl" />
    </div>
  );
}