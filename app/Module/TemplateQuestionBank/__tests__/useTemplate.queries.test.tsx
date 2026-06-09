import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { mockApiCall } from "./mocks/apiMocks";
import { useTemplate } from "../Hook/useTemplate";

const pushToastMock = vi.fn();
vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: pushToastMock,
  }),
}));

describe("useTemplate Hook - State & Queries", () => {
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
    const { result } = renderHook(() => useTemplate());

    expect(result.current.questionState.loading).toBe(false);
    expect(result.current.questionState.data).toEqual([]);
    expect(result.current.questionQuery.page).toBe(1);
    expect(result.current.questionQuery.banksoal).toBeNull();
  });

  it("should not trigger loadData if banksoal is not selected", async () => {
    const { result } = renderHook(() => useTemplate());

    await act(async () => {
      await result.current.loadData();
    });

    expect(mockApiCall.get).not.toHaveBeenCalled();
  });

  it("should successfully query and load templates list if banksoal is set", async () => {
    mockApiCall.get.mockResolvedValue({
      data: {
        data: [{ UUID: "temp-1", Pertanyaan: "Apakah ini template?" }],
        total: 1,
      },
    });

    const { result } = renderHook(() => useTemplate());

    act(() => {
      result.current.setQuestionQuery((prev) => ({
        ...prev,
        banksoal: { value: "bank-1", label: "Bank Soal 1" },
      }));
    });

    // Advance timer for the debounce trigger
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockApiCall.get).toHaveBeenCalledWith("/templatepertanyaans", expect.any(Object));
    expect(result.current.questionState.data).toEqual([{ UUID: "temp-1", Pertanyaan: "Apakah ini template?" }]);
    expect(result.current.questionState.total).toBe(1);
  });

  it("should debounce filter changes", async () => {
    mockApiCall.get.mockResolvedValue({ data: { data: [], total: 0 } });

    const { result } = renderHook(() => useTemplate());

    // Set banksoal first
    act(() => {
      result.current.setQuestionQuery((prev) => ({
        ...prev,
        banksoal: { value: "bank-1" },
      }));
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    mockApiCall.get.mockClear();

    // Trigger search filter change
    act(() => {
      result.current.setQuestionQuery((prev) => ({
        ...prev,
        search: "Pertanyaan Baru",
      }));
    });

    expect(mockApiCall.get).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockApiCall.get).toHaveBeenCalledTimes(1);
    expect(mockApiCall.get.mock.calls[0][1].params.search).toBe("Pertanyaan Baru");
  });

  it("should toggle the soft delete flag correctly", () => {
    const { result } = renderHook(() => useTemplate());

    expect(result.current.questionState.flag).toBeNull();

    act(() => {
      result.current.toggleFlag();
    });
    expect(result.current.questionState.flag).toBe("deleted");

    act(() => {
      result.current.toggleFlag();
    });
    expect(result.current.questionState.flag).toBe("");
  });

  it("should reset query filters to defaults", async () => {
    mockApiCall.get.mockResolvedValue({ data: { data: [], total: 0 } });

    const { result } = renderHook(() => useTemplate());

    await act(async () => {
      result.current.setQuestionQuery((prev) => ({
        ...prev,
        search: "Cari data",
        banksoal: { value: "bank-1" },
        role: "admin",
      }));
      await Promise.resolve();
    });

    expect(result.current.questionQuery.search).toBe("Cari data");

    await act(async () => {
      result.current.resetFiltersQuestion();
      await Promise.resolve();
    });

    expect(result.current.questionQuery.search).toBe("");
    expect(result.current.questionQuery.banksoal).toBeNull();
    expect(result.current.questionQuery.page).toBe(1);
  });
});
