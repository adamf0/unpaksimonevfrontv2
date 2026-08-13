"use client";

import ExcelJS from "exceljs";

/* =========================================================
 * AUTO WIDTH HELPER
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

    return {
      width: Math.min(Math.max(max + 6, 12), 65),
    };
  });
}

/* =========================================================
 * DOWNLOAD WORKBOOK HELPER
 * ========================================================= */
async function downloadWorkbook(
  workbook: ExcelJS.Workbook,
  filename: string,
) {
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
}

/* =========================================================
 * EXPORT REKAP KUESIONER (XLSX)
 * ========================================================= */
export async function exportRekapKuesioner({
  rows,
  summary,
}: {
  rows: any[];
  summary?: any;
}) {
  const seen = new Set<string>();

  const uniqueRows = (rows || []).filter((item, index) => {
    const identity =
      item.UUID ||
      item.ID ||
      item.NIDN?.trim() ||
      item.NIP?.trim() ||
      item.NPM?.trim() ||
      item.NamaDosen?.trim() ||
      item.NamaTendik?.trim() ||
      item.NamaMahasiswa?.trim() ||
      item.Nama?.trim();

    const key = identity
      ? `${identity}_${item.Judul || ""}_${item.Semester || ""}`
      : `row_${index}`;

    if (seen.has(key)) return false;
    seen.add(key);

    return true;
  });

  let mapped: any[] = [];

  if (uniqueRows.length > 0) {
    mapped = uniqueRows.map((item, i) => {
      const nama =
        item.NamaDosen ??
        item.NamaTendik ??
        item.NamaMahasiswa ??
        item.Nama ??
        "";

      const role =
        item.NIDN || item.NamaDosen
          ? "Dosen"
          : item.NIP || item.NamaTendik
          ? "Tendik"
          : item.NPM || item.NamaMahasiswa
          ? "Mahasiswa"
          : "Umum";

      return {
        No: i + 1,
        NIDN: item.NIDN ?? "",
        NIP: item.NIP ?? "",
        NPM: item.NPM ?? "",
        Nama: nama,
        Role: role,
        Fakultas: item.Fakultas ?? "",
        "Prodi / Unit": item.Prodi || item.Unit || "",
        Kuesioner: item.Judul ? `${item.Judul} (${item.Semester})` : "",
      };
    });
  } else if (summary?.distribusi_fakultas?.length) {
    // Export summary distribution per prodi with correct prodi percentage of faculty
    let counter = 1;
    summary.distribusi_fakultas.forEach((f: any) => {
      let prodiArr: any[] = [];
      try {
        if (typeof f.prodi_distribution === "string") {
          prodiArr = JSON.parse(f.prodi_distribution);
        } else if (Array.isArray(f.prodi_distribution)) {
          prodiArr = f.prodi_distribution;
        }
      } catch {}

      if (!prodiArr.length) {
        prodiArr = [{ title: f.unit || f.nama_fakultas || "Umum", total: f.total_responden }];
      }

      const facTotal = Number(f.total_responden) || 0;

      prodiArr.forEach((p: any) => {
        const pTotal = Number(p.total) || 0;
        const pPct =
          facTotal > 0
            ? Math.round((pTotal / facTotal) * 100)
            : Number(f.persentase) || 0;

        mapped.push({
          No: counter++,
          Fakultas: f.nama_fakultas || f.unit || "Umum",
          "Prodi / Unit": (!p.title || p.title === "Umum") && f.unit ? f.unit : p.title,
          "Total Responden": pTotal,
          "Persentase (%)": `${pPct}%`,
        });
      });
    });
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Rekap");

  if (mapped.length > 0) {
    worksheet.columns = Object.keys(mapped[0]).map((key, index) => ({
      header: key,
      key,
      width: autoWidth(mapped)[index]?.width || 20,
    }));

    mapped.forEach((row) => {
      worksheet.addRow(row);
    });
  } else {
    worksheet.columns = [
      { header: "No", key: "No", width: 10 },
      { header: "Keterangan", key: "Keterangan", width: 40 },
    ];
    worksheet.addRow({ No: 1, Keterangan: "Tidak ada data rekap kuesioner" });
  }

  /* =========================
   * HEADER & CELL STYLING
   * ========================= */
  const headerRow = worksheet.getRow(1);
  headerRow.height = 26;
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E293B" },
  };

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFCBD5E1" } },
        left: { style: "thin", color: { argb: "FFCBD5E1" } },
        bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
        right: { style: "thin", color: { argb: "FFCBD5E1" } },
      };

      if (rowNumber > 1) {
        const isCenterCol = [1, 2, 3, 4, 6].includes(colNumber);
        cell.alignment = {
          vertical: "middle",
          horizontal: isCenterCol ? "center" : "left",
          wrapText: true,
        };
      } else {
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
      }
    });
  });

  await downloadWorkbook(
    workbook,
    `rekap_kuesioner_${Date.now()}.xlsx`,
  );
}

/* =========================================================
 * EXPORT DETAIL KUESIONER (XLSX)
 * ========================================================= */
export async function exportDetailKuesioner({
  grouped,
}: {
  grouped: any[];
}) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Detail");

  const rows: any[] = [];

  let rowIndex = 2;
  let grandTotal = 0;

  let fp: string;
  let qTitle: string;
  let subtotal: number;
  let jawaban: any[];

  /* =========================================================
   * BUILD ROWS
   * ========================================================= */
  for (let i = 0; i < (grouped || []).length; i++) {
    const group = grouped[i];
    fp = group.fullPath;
    const pertanyaanList = group.pertanyaan || [];

    for (let p = 0; p < pertanyaanList.length; p++) {
      const pItem = pertanyaanList[p];
      qTitle = pItem.title;
      jawaban = pItem.jawaban || [];

      subtotal = 0;
      for (let j = 0; j < jawaban.length; j++) {
        subtotal += Number(jawaban[j].total) || 0;
      }

      grandTotal += subtotal;

      for (let j = 0; j < jawaban.length; j++) {
        const ans = jawaban[j];

        let labelDisplay = ans.label;
        if (ans.label === "1") labelDisplay = "1 (Sangat Tidak Baik / Setuju)";
        else if (ans.label === "2") labelDisplay = "2 (Tidak Baik / Setuju)";
        else if (ans.label === "3") labelDisplay = "3 (Cukup / Netral)";
        else if (ans.label === "4") labelDisplay = "4 (Baik / Setuju)";
        else if (ans.label === "5") labelDisplay = "5 (Sangat Baik / Setuju)";

        rows.push({
          FullPath: fp,
          Pertanyaan: qTitle,
          Jawaban: labelDisplay,
          Total: Number(ans.total) || 0,
          Subtotal: subtotal,
        });

        rowIndex++;
      }
    }
  }

  /* =========================================================
   * GRAND TOTAL ROW
   * ========================================================= */
  rows.push({
    FullPath: "",
    Pertanyaan: "",
    Jawaban: "TOTAL",
    Total: "",
    Subtotal: grandTotal,
  });

  /* =========================================================
   * COLUMNS DEFINITION
   * ========================================================= */
  worksheet.columns = [
    {
      header: "FullPath",
      key: "FullPath",
      width: Math.max(autoWidth(rows)[0]?.width || 30, 30),
    },
    {
      header: "Pertanyaan",
      key: "Pertanyaan",
      width: Math.max(autoWidth(rows)[1]?.width || 45, 45),
    },
    {
      header: "Jawaban",
      key: "Jawaban",
      width: Math.max(autoWidth(rows)[2]?.width || 25, 25),
    },
    {
      header: "Total",
      key: "Total",
      width: 15,
    },
    {
      header: "Subtotal",
      key: "Subtotal",
      width: 18,
    },
  ];

  /* =========================================================
   * INSERT ROWS
   * ========================================================= */
  rows.forEach((row) => {
    worksheet.addRow(row);
  });

  /* =========================================================
   * HEADER & CELL STYLING
   * ========================================================= */
  const headerRow = worksheet.getRow(1);
  headerRow.height = 26;
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E293B" },
  };

  /* =========================================================
   * MERGE CELLS LOGIC
   * ========================================================= */
  rowIndex = 2;

  for (let i = 0; i < (grouped || []).length; i++) {
    const group = grouped[i];
    const pertanyaanList = group.pertanyaan || [];
    const fpMergeStart = rowIndex;

    for (let p = 0; p < pertanyaanList.length; p++) {
      const pItem = pertanyaanList[p];
      jawaban = pItem.jawaban || [];
      const qMergeStart = rowIndex;

      rowIndex += jawaban.length;
      const qMergeEnd = rowIndex - 1;

      if (qMergeEnd > qMergeStart) {
        worksheet.mergeCells(`B${qMergeStart}:B${qMergeEnd}`);
        worksheet.mergeCells(`E${qMergeStart}:E${qMergeEnd}`);
      }
    }

    const fpMergeEnd = rowIndex - 1;

    if (fpMergeEnd > fpMergeStart) {
      worksheet.mergeCells(`A${fpMergeStart}:A${fpMergeEnd}`);
    }
  }

  /* =========================================================
   * BORDERS & ALIGNMENT FOR ALL CELLS
   * ========================================================= */
  worksheet.eachRow((row, rowNum) => {
    const isTotalRow = rowNum === rows.length + 1;

    row.eachCell((cell, colNum) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFCBD5E1" } },
        left: { style: "thin", color: { argb: "FFCBD5E1" } },
        bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
        right: { style: "thin", color: { argb: "FFCBD5E1" } },
      };

      if (rowNum === 1) {
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
      } else if (isTotalRow) {
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF1F5F9" },
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: colNum === 5 || colNum === 3 ? "center" : "left",
        };
      } else {
        const isLeftCol = colNum === 1 || colNum === 2; // FullPath, Pertanyaan
        cell.alignment = {
          vertical: "middle",
          horizontal: isLeftCol ? "left" : "center",
          wrapText: true,
        };
      }
    });
  });

  await downloadWorkbook(
    workbook,
    `detail_kuesioner_${Date.now()}.xlsx`,
  );
}