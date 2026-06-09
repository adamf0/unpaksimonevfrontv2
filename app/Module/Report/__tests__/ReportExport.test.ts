import { mockWorkbook, mockWorksheet } from "./mocks/apiMocks"; // MUST BE FIRST!
import { describe, it, expect, vi, beforeEach } from "vitest";
import { exportRekapKuesioner, exportDetailKuesioner } from "../Service/ReportExport";

describe("ReportExport Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("exportRekapKuesioner", () => {
    it("should build sheet rows and deduplicate user entries", async () => {
      const rows = [
        {
          NIDN: "nid-1",
          NamaDosen: "Dosen 1",
          Fakultas: "MIPA",
          Prodi: "Matematika",
          Judul: "Kuesioner Dosen",
          Semester: "20261",
        },
        // Duplicate entry: same identity and same questionnaire/semester
        {
          NIDN: "nid-1",
          NamaDosen: "Dosen 1",
          Fakultas: "MIPA",
          Prodi: "Matematika",
          Judul: "Kuesioner Dosen",
          Semester: "20261",
        },
        // Unique entry: different semester
        {
          NIDN: "nid-1",
          NamaDosen: "Dosen 1",
          Fakultas: "MIPA",
          Prodi: "Matematika",
          Judul: "Kuesioner Dosen",
          Semester: "20262",
        },
      ];

      await exportRekapKuesioner({ rows });

      expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith("Rekap");
      expect(mockWorksheet.addRow).toHaveBeenCalledTimes(2);
      expect(mockWorksheet.addRow.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          NIDN: "nid-1",
          Nama: "Dosen 1",
          Kuesioner: "Kuesioner Dosen (20261)",
        })
      );
    });
  });

  describe("exportDetailKuesioner", () => {
    it("should create detail spreadsheet and merge matching category/question blocks", async () => {
      const grouped = [
        {
          fullPath: "Sarana Kampus",
          pertanyaan: [
            {
              title: "Apakah kelas bersih?",
              jenispilihan: "radio",
              jawaban: [
                { label: "Sangat Bersih", total: 10 },
                { label: "Cukup Bersih", total: 5 },
              ],
            },
          ],
        },
      ];

      await exportDetailKuesioner({ grouped });

      expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith("Detail");
      expect(mockWorksheet.addRow).toHaveBeenCalledTimes(3);

      expect(mockWorksheet.mergeCells).toHaveBeenCalledWith("B2:B3");
      expect(mockWorksheet.mergeCells).toHaveBeenCalledWith("E2:E3");
      expect(mockWorksheet.mergeCells).toHaveBeenCalledWith("A2:A3");
    });
  });
});
