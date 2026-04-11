import ModalIcon from "../Atoms/ModalIcon";

type Props = {
  icon: string;
  title: string;
  description: string;
  variant?: "error" | "warning" | "info";
};

export default function ModalHeader({
  icon,
  title,
  description,
  variant = "info",
}: Props) {
  return (
    <div className="p-8">
      <ModalIcon name={icon} variant={variant} />

      <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
        {title}
      </h3>

      <p className="text-on-surface-variant leading-relaxed">
        {description}
      </p>
    </div>
  );
}