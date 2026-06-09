import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { mockApiCall, MockEventSource } from "./mocks/apiMocks";
import { useCategory } from "../Hook/useCategory";

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

describe("useCategory Hook - Actions & REST", () => {
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

  it("should trigger copy action and fetch loadDataSource again", async () => {
    const { result } = renderHook(() => useCategory());
    mockApiCall.post.mockResolvedValueOnce({ data: { uuid: "cat-copy" } });

    let newUuid;
    await act(async () => {
      newUuid = await result.current.actionCategory("cat-1", undefined, "copy");
    });

    expect(mockApiCall.post).toHaveBeenCalledWith("/kategori/cat-1/copy");
    expect(newUuid).toBe("cat-copy");
  });

  it("should trigger delete action", async () => {
    const { result } = renderHook(() => useCategory());
    mockApiCall.delete.mockResolvedValueOnce({ data: { uuid: "cat-deleted" } });

    await act(async () => {
      await result.current.actionCategory("cat-1", undefined, "delete");
    });

    expect(mockApiCall.delete).toHaveBeenCalledWith("/kategori/cat-1");
  });

  it("should trigger updateTree flat payload reordering", async () => {
    const { result } = renderHook(() => useCategory());
    mockApiCall.put.mockResolvedValueOnce({ data: "success" });

    await act(async () => {
      await result.current.updateTree([]);
    });

    expect(mockApiCall.put).toHaveBeenCalledWith("/kategori", expect.any(FormData));
  });

  it("should throw error if instruction mode is blank", async () => {
    const { result } = renderHook(() => useCategory());

    await expect(
      result.current.actionCategory("cat-1", undefined, "")
    ).rejects.toThrow("instruksi ditolak");
  });
});
