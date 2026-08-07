"use client";

import ExcelJS from "exceljs";
import { Option } from "../../Common/Components/Attribut/Option";
import { isRespondentInUserScope } from "./RekapScopeFilter";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type JobStatus = "idle" | "running" | "completed" | "error";

export interface ExportJobState {
  id: string;
  status: JobStatus;
  progress: number;
  message: string;
  error?: string;
  filename?: string;
}

function getNormalizedFaculty(
  val?: string | null,
  fakultasList: any[] = [],
): string {
  if (!val) return "";
  const s = String(val).toLowerCase().trim();

  for (const f of fakultasList) {
    const code = String(
      f.KodeFakultas || f.kode_fakultas || f.Kode || f.ID || "",
    )
      .toLowerCase()
      .trim();
    const name = String(f.NamaFakultas || f.nama_fakultas || f.Nama || "")
      .toLowerCase()
      .trim();

    if (
      s === code ||
      s === name ||
      (name && name.includes(s)) ||
      (name && s.includes(name))
    ) {
      return name || code;
    }
  }

  return s;
}

function getStepForQuestion(q: any): "admin" | "fakultas" | "prodi" | "unit" {
  const cb = String(
    q.CreatedBy ||
      q.created_by ||
      q.CreatedByRef ||
      q.created_by_ref ||
      q.Created ||
      q.created ||
      "",
  )
    .toLowerCase()
    .trim();

  const unit = String(q.Unit || "").trim();

  if (unit !== "" || cb.includes("unit")) return "unit";
  if (cb.includes("prodi") || (q.Prodi && String(q.Prodi).trim() !== "")) return "prodi";
  if (cb.includes("fakultas") || (q.Fakultas && String(q.Fakultas).trim() !== "")) return "fakultas";
  return "admin";
}

/** =========================
 * ROLE-BASED QUESTION SCOPE FILTER
 * createdbyref x users.level
 * ========================= */
function filterQuestionsByUserScope(questions: any[], user: any): any[] {
  const userLevel = String(user?.Level || "admin").toLowerCase().trim();
  const userFak = getNormalizedFaculty(user?.RefFakultas || user?.Fakultas);
  const userProdi = String(user?.RefProdi || user?.Prodi || "")
    .toLowerCase()
    .trim();

  return questions.filter((q) => {
    const qStep = getStepForQuestion(q);
    const qFak = getNormalizedFaculty(q.Fakultas);
    const qProdi = String(q.Prodi || "").toLowerCase().trim();
    const qRef = String(
      q.CreatedByRef || q.CreatedBy || q.FullPath || q.Kategori || "",
    )
      .toLowerCase()
      .trim();

    // 1. ADMIN: Only export questions created by admin/LPPM
    if (userLevel === "admin") {
      return qStep === "admin";
    }

    // 2. FAKULTAS: Export admin questions + questions of logged-in faculty
    if (userLevel === "fakultas") {
      if (qStep === "admin") return true;
      if (qStep === "fakultas") {
        if (qFak) {
          return userFak !== "" && (userFak.includes(qFak) || qFak.includes(userFak));
        }
        for (const fac of ["hukum", "isib", "fkip", "fmipa", "feb", "fe", "ft"]) {
          if (qRef.includes(fac)) {
            return userFak !== "" && userFak.includes(fac);
          }
        }
        return true;
      }
      return false;
    }

    // 3. PRODI: Export admin + logged-in faculty + logged-in prodi questions
    if (userLevel === "prodi") {
      if (qStep === "admin") return true;

      if (qStep === "fakultas") {
        if (qFak) {
          return userFak !== "" && (userFak.includes(qFak) || qFak.includes(userFak));
        }
        for (const fac of ["hukum", "isib", "fkip", "fmipa", "feb", "fe", "ft"]) {
          if (qRef.includes(fac)) {
            return userFak !== "" && userFak.includes(fac);
          }
        }
        return true;
      }

      if (qStep === "prodi") {
        if (qProdi) {
          return userProdi !== "" && (userProdi.includes(qProdi) || qProdi.includes(userProdi));
        }
        return true;
      }

      return false;
    }

    return true;
  });
}

/** =========================
 * BACKGROUND EXPORT EXCEL RUNNER
 * ========================= */
export async function runExportRekapExcelJob({
  bankSoal,
  onProgress,
}: {
  bankSoal: Option;
  onProgress: (state: ExportJobState) => void;
}) {
  const jobId = `JOB_${Date.now()}`;

  const update = (progress: number, message: string) => {
    onProgress({
      id: jobId,
      status: "running",
      progress,
      message,
    });
  };

  try {
    update(5, "Mengambil profil pengguna (whoami)...");
    const token = sessionStorage.getItem("access_token") || "";

    // 1. Fetch Logged-in User Profile (whoami) and Dynamic Fakultas List
    const [whoRes, fRes] = await Promise.all([
      fetch(`${BASE_URL}/whoami`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${BASE_URL}/fakultass?mode=all`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    const userProfile = whoRes.ok ? await whoRes.json() : { Level: "admin" };
    const fData = fRes.ok ? await fRes.json() : [];
    const fakultasList = fData.data?.data || fData.data || fData || [];

    update(20, "Memuat daftar pertanyaan template kuesioner...");

    // 2. Fetch Template Questions for Bank Soal
    const qRes = await fetch(
      `${BASE_URL}/templatepertanyaan/${bankSoal.value}/banksoal`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
      },
    );

    let allQuestions: any[] = [];
    if (qRes.ok && qRes.body) {
      const reader = qRes.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() || "";

        for (const chunk of chunks) {
          const line = chunk.trim();
          if (!line.startsWith("data:")) continue;
          const val = line.replace("data:", "").trim();
          if (val === "start" || val === "done") continue;

          try {
            allQuestions.push(JSON.parse(val));
          } catch {}
        }
      }
    }

    update(35, "Menerapkan filter scope hak akses (createdbyref x users.level)...");
    const filteredQuestions = filterQuestionsByUserScope(allQuestions, userProfile);

    update(50, "Memuat daftar responden...");

    // 3. Fetch All Respondents
    const filterStr = `uuid_bank_soal:eq:${bankSoal.value}`;
    const rRes = await fetch(
      `${BASE_URL}/kuesioners?mode=all&filters=${encodeURIComponent(filterStr)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    let rawRespondents: any[] = [];
    if (rRes.ok) {
      const json = await rRes.json();
      rawRespondents = Array.isArray(json)
        ? json
        : json.data || json.Data || [];
    }

    // Filter respondents matching logged-in user's role & faculty/prodi scope
    const respondents = rawRespondents.filter((item) =>
      isRespondentInUserScope(item, userProfile),
    );

    update(65, "Memuat detail jawaban responden...");

    // 4. Fetch Answers for All Respondents in Parallel Batches
    const answersMap: Record<string, Record<string, string>> = {};

    const batchSize = 10;
    for (let i = 0; i < respondents.length; i += batchSize) {
      const batch = respondents.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (resp) => {
          if (!resp.UUID) return;
          try {
            const aRes = await fetch(`${BASE_URL}/kuesioner/${resp.UUID}/jawaban`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (aRes.ok) {
              const aList = await aRes.json();
              const rAnswers: Record<string, string> = {};

              for (const a of aList) {
                const qUuid = a.UuidTemplatePertanyaan || a.uuid_template_pertanyaan;
                const optUuid = a.UuidTemplateJawaban || a.uuid_template_jawaban;
                const freeText = a.FreeText || a.free_text;

                if (!qUuid) continue;

                // Match with options in question
                const q = filteredQuestions.find((item) => item.UUID === qUuid);
                let valStr = "";

                if (q && Array.isArray(q.ListJawaban)) {
                  const matchedOpt = q.ListJawaban.find((j: any) => j.UUID === optUuid);
                  if (matchedOpt) {
                    valStr = matchedOpt.Jawaban || String(matchedOpt.Nilai ?? "");
                  }
                }

                if (!valStr && freeText) valStr = freeText;
                if (!valStr && optUuid) valStr = optUuid;

                if (valStr) {
                  rAnswers[qUuid] = rAnswers[qUuid]
                    ? `${rAnswers[qUuid]}, ${valStr}`
                    : valStr;
                }
              }

              answersMap[resp.UUID] = rAnswers;
            }
          } catch (e) {
            console.error("fetch answers batch error:", e);
          }
        }),
      );

      const prog = Math.min(65 + Math.round(((i + batchSize) / respondents.length) * 25), 90);
      update(prog, `Memproses data jawaban (${Math.min(i + batchSize, respondents.length)} / ${respondents.length})...`);
    }

    update(92, "Menyusun workbook Excel...");

    // 5. Generate Excel Workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Rekap Responden");

    // Title Row
    sheet.mergeCells("A1", `I1`);
    const titleCell = sheet.getCell("A1");
    titleCell.value = `REKAP RESPONDEN KUESIONER - UNPAK SIMONEV`;
    titleCell.font = { bold: true, size: 14, color: { argb: "1E1B4B" } };
    titleCell.alignment = { vertical: "middle" };

    // Subtitle Row
    sheet.mergeCells("A2", `I2`);
    const subCell = sheet.getCell("A2");
    subCell.value = `Bank Soal: ${bankSoal.label} | Scope Access: ${userProfile.Level?.toUpperCase() || "ADMIN"} | Tanggal Export: ${new Date().toLocaleString("id-ID")}`;
    subCell.font = { italic: true, size: 10, color: { argb: "64748B" } };

    sheet.addRow([]); // Blank line

    // Header Columns Definition
    const staticHeaders = [
      "No",
      "Nama Responden",
      "Identitas (NPM/NIDN/NIP)",
      "Peranan",
      "Fakultas",
      "Prodi",
      "Unit",
      "Tanggal",
      "Waktu Pengisian",
    ];

    const qHeaders = filteredQuestions.map(
      (q, idx) => `P${idx + 1}: ${q.Pertanyaan || q.UUID}`,
    );

    const headerRow = sheet.addRow([...staticHeaders, ...qHeaders]);
    headerRow.height = 28;

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "3B82F6" },
      };
      cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    });

    // Data Rows
    respondents.forEach((resp, rIdx) => {
      const nama =
        resp.NamaMahasiswa || resp.NamaDosen || resp.NamaTendik || "-";
      const idStr = resp.NPM || resp.NIDN || resp.NIP || "-";
      const role = resp.NPM
        ? "Mahasiswa"
        : resp.NIDN
          ? "Dosen"
          : resp.NIP
            ? "Tendik"
            : "Responden";

      const rAnswers = answersMap[resp.UUID] || {};
      const qValues = filteredQuestions.map((q) => rAnswers[q.UUID] || "-");

      const rowValues = [
        rIdx + 1,
        nama,
        idStr,
        role,
        resp.Fakultas || resp.KodeFakultas || "-",
        resp.Prodi || resp.KodeProdi || "-",
        resp.Unit || "-",
        resp.Tanggal ? new Date(resp.Tanggal).toLocaleDateString("id-ID") : "-",
        resp.CreatedAt
          ? new Date(resp.CreatedAt).toLocaleString("id-ID")
          : "-",
        ...qValues,
      ];

      const row = sheet.addRow(rowValues);
      row.height = 22;
      row.eachCell((cell) => {
        cell.alignment = { vertical: "middle" };
      });
    });

    // Auto Column Widths
    sheet.columns.forEach((col, idx) => {
      if (idx < staticHeaders.length) {
        col.width = idx === 1 ? 25 : idx === 2 ? 18 : 14;
      } else {
        col.width = 35;
      }
    });

    update(98, "Mengunduh file Excel...");

    // Write Buffer & Save File
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const safeTitle = bankSoal.label.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `Rekap_Responden_${safeTitle}_${Date.now()}.xlsx`;

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    onProgress({
      id: jobId,
      status: "completed",
      progress: 100,
      message: "Export Excel berhasil diunduh!",
      filename,
    });
  } catch (err: any) {
    console.error("Export Excel job error:", err);
    onProgress({
      id: jobId,
      status: "error",
      progress: 0,
      message: "Gagal menjalankan job Export Excel",
      error: err.message || String(err),
    });
  }
}
