import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { mockApiCall } from "./mocks/apiMocks";
import { useTemplateAnswer } from "../Hook/useTemplateAnswer";

const pushToastMock = vi.fn();
vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: pushToastMock,
  }),
}));

const mockQuestionState = {
  selected: null as any,
};

vi.mock("../Context/TemplateQuestionProvider", () => ({
  useTemplateQuestionContext: () => ({
    questionState: mockQuestionState,
  }),
}));

describe("useTemplateAnswer Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockQuestionState.selected = null;
    sessionStorage.clear();
    sessionStorage.setItem("access_token", "fake-token");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useTemplateAnswer());

    expect(result.current.answerState.loading).toBe(false);
    expect(result.current.answerState.data).toEqual([]);
    expect(result.current.answerQuery.uuidtemplate).toBe("");
  });

  it("should update answerQuery when questionState.selected changes", () => {
    mockQuestionState.selected = { uuid: "temp-selected-123" };

    const { result } = renderHook(() => useTemplateAnswer());

    expect(result.current.answerQuery.uuidtemplate).toBe("temp-selected-123");
    expect(result.current.answerQuery.page).toBe(1);
  });

  it("should successfully fetch answers and handle loading states", async () => {
    mockQuestionState.selected = { uuid: "temp-selected-123" };
    mockApiCall.get.mockResolvedValueOnce({
      data: [
        { UUID: "ans-1", Jawaban: "Sangat Setuju", Score: 5 },
        { UUID: "ans-2", Jawaban: "Setuju", Score: 4 },
      ],
    });

    const { result } = renderHook(() => useTemplateAnswer());

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(mockApiCall.get).toHaveBeenCalledWith("/templatejawabans", expect.any(Object));
    expect(result.current.answerState.data).toEqual([
      { UUID: "ans-1", Jawaban: "Sangat Setuju", Score: 5 },
      { UUID: "ans-2", Jawaban: "Setuju", Score: 4 },
    ]);
    expect(result.current.answerState.total).toBe(2);
  });

  it("should push toast error on failure to fetch answers", async () => {
    mockQuestionState.selected = { uuid: "temp-selected-123" };
    mockApiCall.get.mockRejectedValueOnce({
      response: { data: { message: "Failed loading answers" } },
    });

    const { result } = renderHook(() => useTemplateAnswer());

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(pushToastMock).toHaveBeenCalledWith("Failed loading answers");
    expect(result.current.answerState.loading).toBe(false);
  });
});
