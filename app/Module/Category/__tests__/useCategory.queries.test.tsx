import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { mockApiCall } from "./mocks/apiMocks";
import { useCategory } from "../Hook/useCategory";

vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: vi.fn(),
  }),
}));

describe("useCategory Hook - State & Queries", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    sessionStorage.clear();
    sessionStorage.setItem("access_token", "fake-token");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useCategory());

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.data).toEqual([]);
    expect(result.current.query.page).toBe(1);
    expect(result.current.view).toBe("table");
  });

  it("should successfully query and load paginated categories list after debounce", async () => {
    mockApiCall.get.mockResolvedValueOnce({
      data: {
        data: [{ UUID: "cat-1", NamaKategori: "Evaluasi Kurikulum" }],
        total: 1,
      },
    });

    const { result } = renderHook(() => useCategory());

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockApiCall.get).toHaveBeenCalledWith("/kategoris", expect.any(Object));
    expect(result.current.state.data).toEqual([{ UUID: "cat-1", NamaKategori: "Evaluasi Kurikulum" }]);
    expect(result.current.state.total).toBe(1);
  });

  it("should debounce query filter changes", async () => {
    mockApiCall.get.mockResolvedValue({ data: { data: [], total: 0 } });

    const { result } = renderHook(() => useCategory());

    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    mockApiCall.get.mockClear();

    act(() => {
      result.current.setQuery((prev) => ({
        ...prev,
        search: "Akreditasi",
      }));
    });

    expect(mockApiCall.get).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockApiCall.get).toHaveBeenCalledTimes(1);
    expect(mockApiCall.get.mock.calls[0][1].params.search).toBe("Akreditasi");
  });

  it("should toggle the soft delete flag correctly", () => {
    const { result } = renderHook(() => useCategory());

    expect(result.current.state.flag).toBe(null);

    act(() => {
      result.current.toggleFlag();
    });
    expect(result.current.state.flag).toBe("deleted");

    act(() => {
      result.current.toggleFlag();
    });
    expect(result.current.state.flag).toBe("");
  });

  it("should reset query filters to defaults", () => {
    const { result } = renderHook(() => useCategory());

    act(() => {
      result.current.setQuery((prev) => ({
        ...prev,
        search: "Kategori Baru",
        role: "admin" as any,
      }));
    });

    expect(result.current.query.search).toBe("Kategori Baru");

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.query.search).toBe("");
    expect(result.current.query.page).toBe(1);
  });
});
