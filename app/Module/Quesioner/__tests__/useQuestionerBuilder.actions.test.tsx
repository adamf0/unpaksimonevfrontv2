import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { mockApiCall } from "./mocks/apiMocks";
import { useQuestionerBuilder } from "../Hook/useQuestionerBuilder";

describe("useQuestionerBuilder Hook - Actions & Submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    sessionStorage.setItem("access_token", "fake-token");
  });

  it("should fetch active questionnaire details on loadData call", async () => {
    mockApiCall.get.mockResolvedValue({ data: { UUIDKuesioner: "kues-1", TargetPertanyaan: [] } });

    const { result } = renderHook(() => useQuestionerBuilder());

    await act(async () => {
      await result.current.loadData("kues-1");
    });

    expect(mockApiCall.get).toHaveBeenCalledWith("kuesioners/active/kues-1", expect.any(Object));
  });

  it("should block submit if required questions are empty", async () => {
    const { result } = renderHook(() => useQuestionerBuilder());

    // Setup state with active dates and valid user info to enable availableSteps resolution
    act(() => {
      result.current.setState((prev) => ({
        ...prev,
        data: {
          UUIDKuesioner: "kues-1",
          TanggalMulai: "2026-01-01 00:00:00",
          TanggalAkhir: "2026-12-31 23:59:59",
        },
        userInfo: { RefFakultas: "FT", RefProdi: "TI", Level: "admin" } as any,
        dataQuestion: [
          {
            id: "q-1",
            uuid: "q-1",
            pertanyaan: "Mandatory?",
            fullpath: "General",
            required: true,
            created: "admin",
            createdBy: "admin",
            pilihan: [],
            tipe: "radio",
          },
        ],
      }));
      result.current.setStepIndex({ total: 1, current: 0 });
    });

    const mockEvent = { preventDefault: vi.fn() };
    
    await act(async () => {
      await result.current.handleSubmit(mockEvent as any);
    });

    expect(result.current.toast).toBe("Harap lengkapi semua pertanyaan");
    expect(mockApiCall.post).not.toHaveBeenCalled();
  });
});
