"use client";

import * as XLSX from "xlsx";

/* =========================================================
 * AUTO WIDTH
 * ========================================================= */
function autoWidth(data: any[]) {
  if (!data?.length) return [];

  const keys = Object.keys(data[0] || {});

  return keys.map((key) => {
    let max = key.length;

    for (let i = 0; i < data.length; i++) {
      const len = String(data[i]?.[key] ?? "").length;
      if (len > max) max = len;
    }

    return { wch: Math.min(max + 5, 60) };
  });
}

/* =========================================================
 * EXPORT REKAP
 * ========================================================= */
export function exportRekapKuesioner({ rows }: { rows: any[] }) {
  const seen = new Set<string>();

  const uniqueRows = rows.filter((item) => {
    const key = item.NIDN?.trim() || item.NIP?.trim() || item.NPM?.trim();
    if (!key || seen.has(key)) return false;

    seen.add(key);
    return true;
  });

  const mapped = uniqueRows.map((item, i) => ({
    No: i + 1,
    NIDN: item.NIDN ?? "",
    NIP: item.NIP ?? "",
    NPM: item.NPM ?? "",
    Nama:
      item.NamaDosen ??
      item.NamaTendik ??
      item.NamaMahasiswa ??
      item.Nama ??
      "",
    Fakultas: item.Fakultas ?? "",
    Prodi: item.Prodi ?? "",
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(mapped);

  ws["!cols"] = autoWidth(mapped);

  XLSX.utils.book_append_sheet(wb, ws, "Rekap");
  XLSX.writeFile(wb, `rekap_kuesioner_${Date.now()}.xlsx`);
}

/* =========================================================
 * EXPORT DETAIL (REFACTORED + SCALABLE)
 * ========================================================= */
export function exportDetailKuesioner({ grouped }: { grouped: any[] }) {
  const wb = XLSX.utils.book_new();

  const rows: any[] = [];
  const merges: any[] = [];

  let rowIndex = 1;

  let fpStart = 1;
  let qStart = 1;

  let currentFP = "";
  let currentQ = "";

  let grandTotal = 0;

  /* =========================================================
   * STATE CACHE (LOCAL REF FOR SPEED)
   * ========================================================= */
  let fp: string;
  let qTitle: string;
  let subtotal: number;
  let jawaban: any[];

  /* =========================================================
   * PHASE 1 + 2 COMBINED (OPTIMIZED LOOP)
   * ========================================================= */
  for (let i = 0; i < grouped.length; i++) {
    const group = grouped[i];
    fp = group.fullPath;

    const pertanyaanList = group.pertanyaan;

    for (let p = 0; p < pertanyaanList.length; p++) {
      const pItem = pertanyaanList[p];
      qTitle = pItem.title;
      jawaban = pItem.jawaban;

      // compute subtotal ONCE
      subtotal = 0;
      for (let j = 0; j < jawaban.length; j++) {
        subtotal += Number(jawaban[j].total) || 0;
      }

      grandTotal += subtotal;

      for (let j = 0; j < jawaban.length; j++) {
        const ans = jawaban[j];

        /* =========================
         * FULLPATH MERGE
         * ========================= */
        if (fp !== currentFP) {
          if (currentFP && rowIndex - 1 > fpStart) {
            merges.push({
              s: { r: fpStart, c: 0 },
              e: { r: rowIndex - 1, c: 0 },
            });
          }

          currentFP = fp;
          fpStart = rowIndex;
        }

        /* =========================
         * PERTANYAAN + SUBTOTAL MERGE
         * ========================= */
        if (qTitle !== currentQ || fp !== currentFP) {
          if (currentQ && rowIndex - 1 > qStart) {
            merges.push({
              s: { r: qStart, c: 1 },
              e: { r: rowIndex - 1, c: 1 },
            });

            merges.push({
              s: { r: qStart, c: 4 },
              e: { r: rowIndex - 1, c: 4 },
            });
          }

          currentQ = qTitle;
          qStart = rowIndex;
        }

        /* =========================
         * ROW PUSH (LIGHT OBJECT)
         * ========================= */
        rows.push({
          FullPath: fp,
          Pertanyaan: qTitle,
          Jawaban: ans.label,
          Total: ans.total,
          Subtotal: subtotal,
        });

        rowIndex++;
      }
    }
  }

  /* =========================================================
   * FINAL MERGE FLUSH
   * ========================================================= */
  if (rowIndex - 1 > fpStart) {
    merges.push({
      s: { r: fpStart, c: 0 },
      e: { r: rowIndex - 1, c: 0 },
    });
  }

  if (rowIndex - 1 > qStart) {
    merges.push({
      s: { r: qStart, c: 1 },
      e: { r: rowIndex - 1, c: 1 },
    });

    merges.push({
      s: { r: qStart, c: 4 },
      e: { r: rowIndex - 1, c: 4 },
    });
  }

  /* =========================================================
   * GRAND TOTAL
   * ========================================================= */
  rows.push({
    FullPath: "",
    Pertanyaan: "",
    Jawaban: "TOTAL",
    Total: "",
    Subtotal: grandTotal,
  });

  /* =========================================================
   * WRITE SHEET
   * ========================================================= */
  const ws = XLSX.utils.json_to_sheet(rows);

  ws["!cols"] = autoWidth(rows);
  ws["!merges"] = merges;

  XLSX.utils.book_append_sheet(wb, ws, "Detail");

  XLSX.writeFile(wb, `detail_kuesioner_${Date.now()}.xlsx`);
}