type Props = {
  children: React.ReactNode;
  align?: "right" | "center" | "between";
};

export default function ModalFooter({
  children,
  align = "right",
}: Props) {
  const alignMap = {
    right: "justify-end",
    center: "justify-center",
    between: "justify-between",
  };

  return (
    <div
      className={`
        px-8 py-6 bg-surface-container-low flex items-center gap-4
        ${alignMap[align]}
      `}
    >
      {children}
    </div>
  );
}