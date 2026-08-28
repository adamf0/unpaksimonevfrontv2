export function clipCreatedBy(data: any): string {
  if (!data) return "Admin LPM";

  const isNumeric = (str?: string) => str && /^\d+$/.test(String(str).trim());
  const fakName = isNumeric(data.NamaFakultas) ? "" : (data.NamaFakultas || "");
  const prodiName = isNumeric(data.NamaProdi) ? "" : (data.NamaProdi || "");

  if (data.Role === "prodi") {
    return `Fakultas ${fakName} | Prodi ${prodiName}`;
  } else if (data.Role === "fakultas") {
    return `Fakultas ${fakName}${prodiName ? ` | Prodi ${prodiName}` : ""}`;
  }

  return "Admin LPM";
}
