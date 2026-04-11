type CreatedByProps = {
  item?: {
    created?: string;
    createdBy?: string;
  };
};

const CREATED_MAP: Record<string, (name?: string) => string> = {
  admin: (name) => name || "-",
  fakultas: (name) => `Fakultas: ${name || "-"}`,
  prodi: (name) => `Prodi: ${name || "-"}`,
};

export function CreatedByLabel({ item }: CreatedByProps) {
  if (!item) return null;

  const formatter = CREATED_MAP[item.created || ""];

  const label = formatter
    ? formatter(item.createdBy)
    : item.createdBy || "-";

  return <span className="text-xs text-slate-500">{label}</span>;
}