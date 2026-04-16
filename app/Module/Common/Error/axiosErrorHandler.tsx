export function handleCloudflareError(status: number): string | null {
  if (![520, 521, 522, 523, 524, 525, 526].includes(status)) {
    return null;
  }

  switch (status) {
    case 520:
      return "Unknown Error (520). Server tidak merespon dengan benar.";
    case 521:
      return "Web Server Down (521). Server backend tidak aktif.";
    case 522:
      return "Connection Timed Out (522). Koneksi ke server terlalu lama.";
    case 523:
      return "Origin Unreachable (523). Server tidak dapat dijangkau.";
    case 524:
      return "Timeout Occurred (524). Server terlalu lama merespon.";
    case 525:
      return "SSL Handshake Failed (525). Masalah SSL antara Cloudflare dan server.";
    case 526:
      return "Invalid SSL Certificate (526). Sertifikat SSL tidak valid.";
    default:
      return "Server sedang bermasalah. Coba lagi nanti.";
  }
}

export function isHtmlResponse(data: any): boolean {
  return typeof data === "string";
}

export function isHtmlResponseByHeader(headers: any): boolean {
  return headers?.["content-type"]?.includes("text/html");
}