import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { mockApiCall } from "./mocks/apiMocks";
import { useBankSoal } from "../Hook/useBankSoal";
import { handleCloudflareError } from "../../Common/Error/axiosErrorHandler";

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

describe("useBankSoal Hook - Actions & Errors", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    sessionStorage.clear();
    sessionStorage.setItem("access_token", "fake-token");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should trigger copy action and return new uuid", async () => {
    const { result } = renderHook(() => useBankSoal());
    mockApiCall.post.mockResolvedValueOnce({ data: { uuid: "bs-copy" } });

    const newUuid = await result.current.actionBankSoal("bs-1", undefined, "copy");

    expect(mockApiCall.post).toHaveBeenCalledWith("/banksoal/bs-1/copy");
    expect(newUuid).toBe("bs-copy");
  });

  it("should trigger create action with peruntukan in formData", async () => {
    const { result } = renderHook(() => useBankSoal());
    mockApiCall.post.mockResolvedValueOnce({ data: { uuid: "bs-created" } });

    const newUuid = await result.current.actionBankSoal(
      undefined,
      {
        judul: "Soal UTS",
        semester: "202401",
        peruntukan: "dosen",
        konten: "Konten",
        deskripsi: "Deskripsi",
      },
      "create",
    );

    expect(mockApiCall.post).toHaveBeenCalledWith("/banksoal", expect.any(FormData));
    const formDataSent = mockApiCall.post.mock.calls[0][1] as FormData;
    expect(formDataSent.get("peruntukan")).toBe("dosen");
    expect(newUuid).toBe("bs-created");
  });

  it("should trigger delete action", async () => {
    const { result } = renderHook(() => useBankSoal());
    mockApiCall.delete.mockResolvedValueOnce({ data: { uuid: "bs-deleted" } });

    await result.current.actionBankSoal("bs-1", undefined, "delete");

    expect(mockApiCall.delete).toHaveBeenCalledWith("/banksoal/bs-1");
  });

  it("should throw error if instruction mode is empty", async () => {
    const { result } = renderHook(() => useBankSoal());

    await expect(
      result.current.actionBankSoal("bs-1", undefined, "")
    ).rejects.toThrow("instruksi ditolak");
  });

  it("should show Toast for network error on loadData", async () => {
    mockApiCall.get.mockRejectedValueOnce(new Error("Network error"));

    renderHook(() => useBankSoal());

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(pushToastMock).toHaveBeenCalledWith("Server error");
  });

  it("should handle Cloudflare block codes", async () => {
    mockApiCall.get.mockRejectedValueOnce({
      response: { status: 403, data: { message: "Block" } },
    });

    renderHook(() => useBankSoal());

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(handleCloudflareError).toHaveBeenCalledWith(403);
    expect(pushToastMock).toHaveBeenCalledWith("Cloudflare Forbidden");
  });
});
