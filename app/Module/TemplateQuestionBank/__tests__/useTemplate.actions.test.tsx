import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { mockApiCall, MockEventSource } from "./mocks/apiMocks";
import { useTemplate } from "../Hook/useTemplate";

const pushToastMock = vi.fn();
vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: pushToastMock,
  }),
}));

describe("useTemplate Hook - Actions & REST", () => {
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

  it("should trigger copy action and return new uuid", async () => {
    const { result } = renderHook(() => useTemplate());
    mockApiCall.post.mockResolvedValueOnce({ data: { uuid: "copy-uuid" } });

    let resUuid;
    await act(async () => {
      resUuid = await result.current.actionQuestion("uuid-1", undefined, "copy");
    });

    expect(mockApiCall.post).toHaveBeenCalledWith("/templatepertanyaan/uuid-1/copy");
    expect(resUuid).toBe("copy-uuid");
  });

  it("should trigger delete action", async () => {
    const { result } = renderHook(() => useTemplate());
    mockApiCall.delete.mockResolvedValueOnce({ data: { uuid: "del-uuid" } });

    let resUuid;
    await act(async () => {
      resUuid = await result.current.actionQuestion("uuid-1", undefined, "delete");
    });

    expect(mockApiCall.delete).toHaveBeenCalledWith("/templatepertanyaan/uuid-1");
    expect(resUuid).toBe("del-uuid");
  });

  it("should trigger force delete action", async () => {
    const { result } = renderHook(() => useTemplate());
    mockApiCall.delete.mockResolvedValueOnce({ data: { uuid: "force-uuid" } });

    let resUuid;
    await act(async () => {
      resUuid = await result.current.actionQuestion("uuid-1", undefined, "force_delete");
    });

    expect(mockApiCall.delete).toHaveBeenCalledWith("/templatepertanyaan/uuid-1/force");
    expect(resUuid).toBe("force-uuid");
  });

  it("should trigger restore action", async () => {
    const { result } = renderHook(() => useTemplate());
    mockApiCall.put.mockResolvedValueOnce({ data: { uuid: "restore-uuid" } });

    let resUuid;
    await act(async () => {
      resUuid = await result.current.actionQuestion("uuid-1", undefined, "restore");
    });

    expect(mockApiCall.put).toHaveBeenCalledWith("/templatepertanyaan/uuid-1/restore");
    expect(resUuid).toBe("restore-uuid");
  });

  it("should trigger status update to draft", async () => {
    const { result } = renderHook(() => useTemplate());
    mockApiCall.put.mockResolvedValueOnce({ data: { uuid: "draf-uuid" } });

    let resUuid;
    await act(async () => {
      resUuid = await result.current.actionQuestion("uuid-1", undefined, "draf");
    });

    expect(mockApiCall.put).toHaveBeenCalledWith(
      "/templatepertanyaan/uuid-1/status",
      expect.any(FormData)
    );
    expect(resUuid).toBe("draf-uuid");
  });

  it("should trigger status update to active", async () => {
    const { result } = renderHook(() => useTemplate());
    mockApiCall.put.mockResolvedValueOnce({ data: { uuid: "active-uuid" } });

    let resUuid;
    await act(async () => {
      resUuid = await result.current.actionQuestion("uuid-1", undefined, "active");
    });

    expect(mockApiCall.put).toHaveBeenCalledWith(
      "/templatepertanyaan/uuid-1/status",
      expect.any(FormData)
    );
    expect(resUuid).toBe("active-uuid");
  });

  it("should trigger create action when uuid is empty", async () => {
    const { result } = renderHook(() => useTemplate());
    mockApiCall.post.mockResolvedValueOnce({ data: { uuid: "new-uuid" } });

    const formValues = {
      banksoal: { value: "bank-1" },
      kategori: { value: "kat-1" },
      tipepilihan: { value: "pilihan_ganda" },
      bobot: 5,
      wajibisi: true,
      pertanyaan: "Apakah ini pertanyaan?",
    };

    let resUuid;
    await act(async () => {
      resUuid = await result.current.actionQuestion(undefined, formValues as any, "create");
    });

    expect(mockApiCall.post).toHaveBeenCalledWith("/templatepertanyaan", expect.any(FormData));
    expect(resUuid).toBe("new-uuid");
  });

  it("should trigger update action when uuid is provided", async () => {
    const { result } = renderHook(() => useTemplate());
    mockApiCall.put.mockResolvedValueOnce({ data: { uuid: "updated-uuid" } });

    const formValues = {
      banksoal: { value: "bank-1" },
      kategori: { value: "kat-1" },
      tipepilihan: { value: "pilihan_ganda" },
      bobot: 5,
      wajibisi: true,
      pertanyaan: "Apakah ini pertanyaan?",
    };

    let resUuid;
    await act(async () => {
      resUuid = await result.current.actionQuestion("uuid-1", formValues as any, "edit");
    });

    expect(mockApiCall.put).toHaveBeenCalledWith("/templatepertanyaan/uuid-1", expect.any(FormData));
    expect(resUuid).toBe("updated-uuid");
  });

  it("should throw error if instruction mode is blank", async () => {
    const { result } = renderHook(() => useTemplate());

    await expect(
      result.current.actionQuestion("uuid-1", undefined, "")
    ).rejects.toThrow("instruksi ditolak");
  });

  it("should load single template question and parse details correctly", async () => {
    const { result } = renderHook(() => useTemplate());
    mockApiCall.get.mockResolvedValueOnce({
      data: {
        ID: 10,
        UUID: "uuid-single",
        Pertanyaan: "Bagaimana tanggapan anda?",
        UuidKategori: "kat-abc",
        Kategori: "Kurikulum",
        JenisPilihan: "radio",
        Bobot: 3,
        Required: 1,
        Status: "active",
        CreatedBy: "Admin",
        DeletedAt: null,
      },
    });

    let details;
    await act(async () => {
      details = await result.current.loadSinglePertanyaan("uuid-single");
    });

    expect(mockApiCall.get).toHaveBeenCalledWith("/templatepertanyaan/uuid-single");
    expect(details).toEqual({
      id: 10,
      uuid: "uuid-single",
      judul: "Bagaimana tanggapan anda?",
      kategori: {
        uuid: "kat-abc",
        kategori: "Kurikulum",
      },
      tipe: "radio",
      bobot: 3,
      require: 1,
      status: "active",
      createdBy: "Admin",
      deletedtime: null,
    });
  });
});
