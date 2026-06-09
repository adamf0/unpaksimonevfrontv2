process.env.NEXT_PUBLIC_DEMO = "0";

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

import { mockFetchStreamResponse, MockEventSource } from "./mocks/apiMocks";
import { useKuesionerReport } from "../Hook/useKuesionerReport";

vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: vi.fn(),
  }),
}));

describe("useKuesionerReport Hook - State & Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MockEventSource.clear();
    sessionStorage.clear();
    sessionStorage.setItem("access_token", "fake-token");
    // Mock global fetch using mockImplementation to generate fresh streams per call
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve(mockFetchStreamResponse(["data: start\n\ndata: done\n\n"]));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with default states", async () => {
    const { result } = renderHook(() => useKuesionerReport());

    expect(result.current.loading).toBe(true);
    expect(result.current.open).toBe(false);
    expect(result.current.query).toEqual({
      kode_fakultas: null,
      nama_fakultas: null,
      kode_prodi: null,
      nama_prodi: null,
      bankSoal: [],
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should toggle open and close filter sidebar", async () => {
    const { result } = renderHook(() => useKuesionerReport());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.openFilter();
    });
    expect(result.current.open).toBe(true);

    act(() => {
      result.current.closeFilter();
    });
    expect(result.current.open).toBe(false);
  });

  it("should update and reset filter queries", async () => {
    const { result } = renderHook(() => useKuesionerReport());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setQuery({
        kode_fakultas: "fak-1",
        nama_fakultas: "Teknik",
        kode_prodi: "prod-1",
        nama_prodi: "Informatika",
        bankSoal: [{ value: "bank-x", label: "Bank X" }],
      });
    });

    expect(result.current.query.nama_fakultas).toBe("Teknik");

    await waitFor(() => {
      expect(result.current.loadingTemplate).toBe(false);
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.query).toEqual({
      kode_fakultas: null,
      nama_fakultas: null,
      kode_prodi: null,
      nama_prodi: null,
      bankSoal: [],
    });
  });
});
