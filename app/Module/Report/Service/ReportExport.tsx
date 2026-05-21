"use client";

import ExcelJS from "exceljs";

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

    return {
      width: Math.min(max + 5, 60),
    };
  });
}

/* =========================================================
 * DOWNLOAD HELPER
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
 * EXPORT REKAP
 * ========================================================= */
export async function exportRekapKuesioner({
  rows,
}: {
  rows: any[];
}) {
  const seen = new Set<string>();

  const uniqueRows = rows.filter((item) => {
    const identity =
      item.NIDN?.trim() ||
      item.NIP?.trim() ||
      item.NPM?.trim();

    const key = `${identity}_${item.Judul} (${item.Semester})`;

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
    Kuesioner: `${item.Judul} (${item.Semester})`,
  }));

  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet("Rekap");

  if (mapped.length > 0) {
    worksheet.columns = Object.keys(mapped[0]).map(
      (key, index) => ({
        header: key,
        key,
        width: autoWidth(mapped)[index]?.width || 20,
      }),
    );

    mapped.forEach((row) => {
      worksheet.addRow(row);
    });
  }

  /* =========================
   * HEADER STYLE
   * ========================= */
  worksheet.getRow(1).font = {
    bold: true,
  };

  await downloadWorkbook(
    workbook,
    `rekap_kuesioner_${Date.now()}.xlsx`,
  );
}

/* =========================================================
 * EXPORT DETAIL
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

  let fpStart = 2;
  let qStart = 2;

  let currentFP = "";
  let currentQ = "";

  let grandTotal = 0;

  /* =========================================================
   * STATE CACHE
   * ========================================================= */
  let fp: string;
  let qTitle: string;
  let subtotal: number;
  let jawaban: any[];

  /* =========================================================
   * BUILD ROWS
   * ========================================================= */
  for (let i = 0; i < grouped.length; i++) {
    const group = grouped[i];

    fp = group.fullPath;

    const pertanyaanList = group.pertanyaan;

    for (let p = 0; p < pertanyaanList.length; p++) {
      const pItem = pertanyaanList[p];

      qTitle = pItem.title;
      jawaban = pItem.jawaban;

      subtotal = 0;

      for (let j = 0; j < jawaban.length; j++) {
        subtotal += Number(jawaban[j].total) || 0;
      }

      grandTotal += subtotal;

      for (let j = 0; j < jawaban.length; j++) {
        const ans = jawaban[j];

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
   * COLUMNS
   * ========================================================= */
  worksheet.columns = [
    {
      header: "FullPath",
      key: "FullPath",
      width: autoWidth(rows)[0]?.width || 30,
    },
    {
      header: "Pertanyaan",
      key: "Pertanyaan",
      width: autoWidth(rows)[1]?.width || 30,
    },
    {
      header: "Jawaban",
      key: "Jawaban",
      width: autoWidth(rows)[2]?.width || 20,
    },
    {
      header: "Total",
      key: "Total",
      width: autoWidth(rows)[3]?.width || 15,
    },
    {
      header: "Subtotal",
      key: "Subtotal",
      width: autoWidth(rows)[4]?.width || 15,
    },
  ];

  /* =========================================================
   * INSERT ROWS
   * ========================================================= */
  rows.forEach((row) => {
    worksheet.addRow(row);
  });

  /* =========================================================
   * HEADER STYLE
   * ========================================================= */
  worksheet.getRow(1).font = {
    bold: true,
  };

  /* =========================================================
   * MERGE LOGIC
   * ========================================================= */
  rowIndex = 2;

  for (let i = 0; i < grouped.length; i++) {
    const group = grouped[i];

    fp = group.fullPath;

    const pertanyaanList = group.pertanyaan;

    const fpMergeStart = rowIndex;

    for (let p = 0; p < pertanyaanList.length; p++) {
      const pItem = pertanyaanList[p];

      qTitle = pItem.title;
      jawaban = pItem.jawaban;

      const qMergeStart = rowIndex;

      rowIndex += jawaban.length;

      const qMergeEnd = rowIndex - 1;

      if (qMergeEnd > qMergeStart) {
        worksheet.mergeCells(
          `B${qMergeStart}:B${qMergeEnd}`,
        );

        worksheet.mergeCells(
          `E${qMergeStart}:E${qMergeEnd}`,
        );
      }
    }

    const fpMergeEnd = rowIndex - 1;

    if (fpMergeEnd > fpMergeStart) {
      worksheet.mergeCells(
        `A${fpMergeStart}:A${fpMergeEnd}`,
      );
    }
  }

  /* =========================================================
   * ALIGNMENT
   * ========================================================= */
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  await downloadWorkbook(
    workbook,
    `detail_kuesioner_${Date.now()}.xlsx`,
  );
}