type CreatedByProps = {
  item?: {
    fakultas?: string|null;
    prodi?: string|null;
    created?: string;
    createdBy?: string;
  };
};

export function CreatedByLabel({ item }: CreatedByProps) {
  if (!item) return null;

  const role = (item.created || "").toLowerCase();
  const createdBy = (item.createdBy || "").trim();

  let label = "(LPM)";

  if (role === "prodi") {
    label = createdBy ? `(Prodi: ${createdBy})` : "(Prodi: -)";
  } else if (role === "fakultas") {
    label = createdBy ? `(Fakultas: ${createdBy})` : "(Fakultas: -)";
  } else if (role === "admin") {
    label = createdBy ? createdBy : "(LPM)";
  } else {
    if (item.prodi && item.prodi.trim() !== "") {
      label = `(Prodi: ${item.prodi})`;
    } else if (item.fakultas && item.fakultas.trim() !== "") {
      label = `(Fakultas: ${item.fakultas})`;
    } else {
      label = createdBy!="local" ? createdBy : "(LPM)";
    }
  }

  return <span className="text-xs text-on-secondary-container">{label}</span>;
}