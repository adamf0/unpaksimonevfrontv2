type CreatedByProps = {
  item?: {
    fakultas?: string | null;
    prodi?: string | null;
    created?: string;
    createdBy?: string;
  };
};

export function CreatedByLabel({ item }: CreatedByProps) {
  if (!item) return null;
  console.log(item);

  // const role = (item.created || "").toLowerCase();
  const createdBy = (item.createdBy || "").trim();

  let label = "(LPM)";

  if (item.prodi && item.prodi.trim() !== "") {
    label = `(Prodi: ${item.prodi})`;
  } else if (item.fakultas && item.fakultas.trim() !== "") {
    label = `(Fakultas: ${item.fakultas})`;
  } else if (createdBy=="local"){
    label = "(LPM)";
  } else {
    label = createdBy ? createdBy : "(?)";
  }

  return <span className="text-xs text-on-secondary-container">{label}</span>;
}
