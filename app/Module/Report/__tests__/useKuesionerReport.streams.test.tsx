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

describe("useKuesionerReport Hook - Stream Fetching", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MockEventSource.clear();
    sessionStorage.clear();
    sessionStorage.setItem("access_token", "fake-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should progressively parse chunks and set main data upon done chunk", async () => {
    const streamChunks = [
      "data: start\n\n",
      'data: {"ID": 1, "Semester": "202610", "NPM": "npm-1"}\n\n',
      'data: {"ID": 2, "Semester": "202610", "NIDN": "nidn-1"}\n\n',
      "data: done\n\n",
    ];

    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/kuesioners/report_year")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] }),
        });
      }
      return Promise.resolve(mockFetchStreamResponse(streamChunks));
    });

    const { result } = renderHook(() => useKuesionerReport());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/kuesioners/report_year"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer fake-token",
        }),
      })
    );

    let detailPromise;
    act(() => {
      detailPromise = result.current.loadDataDetail([{ judul: "Kues-1", is4year: "1" }]);
    });

    await act(async () => {
      await detailPromise;
    });

    expect(result.current.dataDetail).toEqual([
      { ID: 1, Semester: "202610", NPM: "npm-1" },
      { ID: 2, Semester: "202610", NIDN: "nidn-1" },
    ]);
  });

  it("should load detail data concurrently and merge results", async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes("/kuesioners/report")) {
        const chunks = [
          "data: start\n\n",
          'data: {"ID": 101, "Pertanyaan": "Soal A", "Jawaban": "5"}\n\n',
          "data: done\n\n",
        ];
        return Promise.resolve(mockFetchStreamResponse(chunks));
      }
      return Promise.resolve(mockFetchStreamResponse(["data: start\n\ndata: done\n\n"]));
    });

    const { result } = renderHook(() => useKuesionerReport());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let detailPromise;
    act(() => {
      detailPromise = result.current.loadDataDetail([
        { judul: "Kues-1", semester: "20261", is4year: "1" },
        { judul: "Kues-2", semester: "20261", is4year: "1" },
      ]);
    });

    await act(async () => {
      await detailPromise;
    });

    await waitFor(() => {
      expect(result.current.loadingDetail).toBe(false);
    });

    expect(result.current.dataDetail).toHaveLength(2);
    expect(result.current.dataDetail[0].ID).toBe(101);
  });
});
