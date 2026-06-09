import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { mockApiCall, MockEventSource } from "./mocks/apiMocks";
import { useAccount } from "../Hook/useAccount";

const pushToastMock = vi.fn();
vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: pushToastMock,
  }),
}));

vi.mock("../../Common/Error/axiosErrorHandler", () => ({
  handleCloudflareError: vi.fn((status: number) => {
    if (status === 403) return "Cloudflare Forbidden";
    return null;
  }),
}));

describe("useAccount Hook - Actions & REST", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    MockEventSource.clear();
    sessionStorage.clear();
    sessionStorage.setItem("access_token", "fake-token");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should trigger delete action", async () => {
    const { result } = renderHook(() => useAccount());
    mockApiCall.delete.mockResolvedValueOnce({ data: { uuid: "usr-deleted" } });

    await act(async () => {
      await result.current.actionAccount("usr-1", undefined, "delete");
    });

    expect(mockApiCall.delete).toHaveBeenCalledWith("/account/usr-1");
  });

  it("should trigger restore action", async () => {
    const { result } = renderHook(() => useAccount());
    mockApiCall.put.mockResolvedValueOnce({ data: { uuid: "usr-restored" } });

    await act(async () => {
      await result.current.actionAccount("usr-1", undefined, "restore");
    });

    expect(mockApiCall.put).toHaveBeenCalledWith("/account/usr-1/restore");
  });

  it("should throw error if instruction mode is blank", async () => {
    const { result } = renderHook(() => useAccount());

    await expect(
      result.current.actionAccount("usr-1", undefined, "")
    ).rejects.toThrow("instruksi ditolak");
  });
});
