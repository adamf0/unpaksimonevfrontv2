process.env.NEXT_PUBLIC_DEMO = "0";

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { mockFetchStreamResponse, MockEventSource } from "./mocks/apiMocks";
import { useKuesionerReport } from "../Hook/useKuesionerReport";

const pushToastMock = vi.fn();
vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: pushToastMock,
  }),
}));

describe("useKuesionerReport Hook - Actions & Selectors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MockEventSource.clear();
    sessionStorage.clear();
    sessionStorage.setItem("access_token", "fake-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should handle loadDataFakultas and loadDataProdi SSE events", async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve(mockFetchStreamResponse(["data: start\n\ndata: done\n\n"]));
    });

    const { result } = renderHook(() => useKuesionerReport());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(MockEventSource.instances).toHaveLength(2);
    const fakultasStream = MockEventSource.instances[0];
    const prodiStream = MockEventSource.instances[1];

    expect(fakultasStream.url).toContain("/fakultass?mode=sse");
    expect(prodiStream.url).toContain("/prodis?mode=sse");
  });

  it("should stream and parse banksoal sse successfully", async () => {
    const banksoalChunks = [
      "data: start\n\n",
      'data: {"UUID": "bank-a", "Judul": "Kuesioner Dosen"}\n\n',
      "data: done\n\n",
    ];

    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/banksoals")) {
        return Promise.resolve(mockFetchStreamResponse(banksoalChunks));
      }
      return Promise.resolve(mockFetchStreamResponse(["data: start\n\ndata: done\n\n"]));
    });

    const { result } = renderHook(() => useKuesionerReport());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let bankPromise;
    act(() => {
      bankPromise = result.current.loadBankSoal();
    });

    await act(async () => {
      await bankPromise;
    });

    await waitFor(() => {
      expect(result.current.dataBankSoal).toEqual([
        { UUID: "bank-a", Judul: "Kuesioner Dosen" },
      ]);
    });
  });

  it("should calculate yearly stats with distinct NIDN, NPM, NIP user counts", async () => {
    const streamChunks = [
      "data: start\n\n",
      // Year 2026: NPM 1, NIDN A
      'data: {"ID": 1, "Semester": "202610", "NPM": "1"}\n\n',
      'data: {"ID": 2, "Semester": "202610", "NIDN": "A"}\n\n',
      // Year 2026 duplicate NPM: should be unique count of 1
      'data: {"ID": 3, "Semester": "202610", "NPM": "1"}\n\n',
      // Year 2025: NIP X
      'data: {"ID": 4, "Semester": "202520", "NIP": "X"}\n\n',
      "data: done\n\n",
    ];

    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/kuesioners/report_year")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              data: [
                { tahun: "2026", total_mahasiswa: 1, total_dosen: 1, total_tendik: 0 },
                { tahun: "2025", total_mahasiswa: 0, total_dosen: 0, total_tendik: 1 },
              ],
            }),
        });
      }
      if (url.includes("/kuesioners/report")) {
        return Promise.resolve(mockFetchStreamResponse(streamChunks));
      }
      return Promise.resolve(mockFetchStreamResponse(["data: start\n\ndata: done\n\n"]));
    });

    const { result } = renderHook(() => useKuesionerReport());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.yearlyStats).toEqual(
      expect.arrayContaining([
        { year: "2026", mahasiswa: 1, dosen: 1, tendik: 0 },
        { year: "2025", mahasiswa: 0, dosen: 0, tendik: 1 },
      ])
    );
  });

  it("should calculate top questions averages", async () => {
    const detailChunks = [
      "data: start\n\n",
      'data: {"Pertanyaan": "Soal 1", "FullPath": "Kategori A", "Jawaban": "5", "KodeFakultas": "fak-1"}\n\n',
      'data: {"Pertanyaan": "Soal 1", "FullPath": "Kategori A", "Jawaban": "3", "KodeFakultas": "fak-1"}\n\n',
      "data: done\n\n",
    ];

    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/kuesioners/report")) {
        return Promise.resolve(mockFetchStreamResponse(detailChunks));
      }
      return Promise.resolve(mockFetchStreamResponse(["data: start\n\ndata: done\n\n"]));
    });

    const { result } = renderHook(() => useKuesionerReport());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let detailPromise;
    act(() => {
      detailPromise = result.current.loadDataDetail([{ judul: "Kues-1", is4year: "1" }]);
    });

    await act(async () => {
      await detailPromise;
    });

    await waitFor(() => {
      expect(result.current.loadingDetail).toBe(false);
    });

    expect(result.current.topQuestions).toEqual([
      { title: "Soal 1", category: "Kategori A", score: 8 },
    ]);
  });
});
