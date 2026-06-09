import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { mockApiCall } from "./mocks/apiMocks";
import { useAccount } from "../Hook/useAccount";

vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: vi.fn(),
  }),
}));

describe("useAccount Hook - State & Queries", () => {
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
    const { result } = renderHook(() => useAccount());

    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.data).toEqual([]);
    expect(result.current.query.page).toBe(1);
  });

  it("should successfully query and load paginated accounts list after debounce", async () => {
    mockApiCall.get.mockResolvedValueOnce({
      data: {
        data: [{ UUID: "usr-1", Username: "user1", Name: "User One" }],
        total: 1,
      },
    });

    const { result } = renderHook(() => useAccount());

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockApiCall.get).toHaveBeenCalledWith("/accounts", expect.any(Object));
    expect(result.current.state.data).toEqual([{ UUID: "usr-1", Username: "user1", Name: "User One" }]);
    expect(result.current.state.total).toBe(1);
  });

  it("should debounce query filter changes", async () => {
    mockApiCall.get.mockResolvedValue({ data: { data: [], total: 0 } });

    const { result } = renderHook(() => useAccount());

    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    mockApiCall.get.mockClear();

    act(() => {
      result.current.setQuery((prev) => ({
        ...prev,
        username: "evaluator1",
      }));
    });

    expect(mockApiCall.get).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockApiCall.get).toHaveBeenCalledTimes(1);
    expect(mockApiCall.get.mock.calls[0][1].params.filters).toContain("evaluator1");
  });

  it("should toggle the soft delete flag correctly", () => {
    const { result } = renderHook(() => useAccount());

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
    const { result } = renderHook(() => useAccount());

    act(() => {
      result.current.setQuery((prev) => ({
        ...prev,
        username: "admin1",
        email: "admin@test.com",
      }));
    });

    expect(result.current.query.username).toBe("admin1");

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.query.username).toBe("");
    expect(result.current.query.page).toBe(1);
  });
});
