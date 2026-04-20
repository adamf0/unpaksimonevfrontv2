type CreatedByProps = {
  item?: {
    created?: string;
    createdBy?: string;
  };
};

const CREATED_MAP: Record<string, (name?: string) => string> = {
  admin: (name) => name || "(LPM)",
  fakultas: (name) => `(Fakultas: ${name || "-"})`,
  prodi: (name) => `(Prodi: ${name || "-"})`,
};

export function CreatedByLabel({ item }: CreatedByProps) {
  if (!item) return null;

  const formatter = CREATED_MAP[item.created || ""];

  const label = formatter
    ? formatter(item.createdBy)
    : item.createdBy || "(LPM)";

  return <span className="text-xs text-on-secondary-container">{label}</span>;
}