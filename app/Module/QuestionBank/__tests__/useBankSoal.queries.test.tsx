import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { mockApiCall } from "./mocks/apiMocks";
import { useBankSoal } from "../Hook/useBankSoal";

vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: vi.fn(),
  }),
}));

describe("useBankSoal Hook - State & Queries", () => {
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
    const { result } = renderHook(() => useBankSoal());

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.data).toEqual([]);
    expect(result.current.query.page).toBe(1);
    expect(result.current.query.limit).toBe(10);
  });

  it("should successfully query and load paginated bank soal list after debounce", async () => {
    mockApiCall.get.mockResolvedValueOnce({
      data: {
        data: [{ uuid: "bs-1", judul: "Ujian Dasar" }],
        total: 1,
      },
    });

    const { result } = renderHook(() => useBankSoal());

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockApiCall.get).toHaveBeenCalledWith("/banksoals", expect.any(Object));
    expect(result.current.state.data).toEqual([{ uuid: "bs-1", judul: "Ujian Dasar" }]);
    expect(result.current.state.total).toBe(1);
  });

  it("should debounce filter changes", async () => {
    mockApiCall.get.mockResolvedValue({ data: { data: [], total: 0 } });

    const { result } = renderHook(() => useBankSoal());

    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    mockApiCall.get.mockClear();

    act(() => {
      result.current.setQuery((prev) => ({
        ...prev,
        search: "Pemrograman",
        page: 2,
      }));
    });

    expect(mockApiCall.get).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockApiCall.get).toHaveBeenCalledTimes(1);
    expect(mockApiCall.get.mock.calls[0][1].params.search).toBe("Pemrograman");
    expect(mockApiCall.get.mock.calls[0][1].params.page).toBe(2);
  });

  it("should toggle the soft delete flag correctly", () => {
    const { result } = renderHook(() => useBankSoal());

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

  it("should reset query filters to default options", () => {
    const { result } = renderHook(() => useBankSoal());

    act(() => {
      result.current.setQuery((prev) => ({
        ...prev,
        search: "Uji Coba",
        role: "admin",
      }));
    });

    expect(result.current.query.search).toBe("Uji Coba");

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.query.search).toBe("");
    expect(result.current.query.role).toBe("");
    expect(result.current.query.page).toBe(1);
  });
});
