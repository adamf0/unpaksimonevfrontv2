export function clipCreatedBy(data: any): string {
  if (data.Role === "prodi") {
    return `Fakultas ${data.NamaFakultas} | Prodi ${data.NamaProdi}`;
  } else if (data.Role === "fakultas") {
    return `Fakultas ${data.NamaFakultas}`;
  }

  return "Admin LPM";
}
