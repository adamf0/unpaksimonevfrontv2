export function clipCreatedBy(data: any): string {
  if (data.Role === "prodi") {
    return `Fakultas ${data.NamaFakultas} | Prodi ${data.NamaProdi}`; //[pr] kurang jenjang pada nam prodi
  } else if (data.Role === "fakultas") {
    return `Fakultas ${data.NamaFakultas} | Prodi ${data.NamaProdi}`;
  }

  return "Admin LPM";
}
