import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { MockEventSource } from "./mocks/apiMocks";
import { useAccount } from "../Hook/useAccount";

const pushToastMock = vi.fn();
vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: pushToastMock,
  }),
}));

describe("useAccount Hook - SSE Streams", () => {
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

  it("should initialize EventSource streams on mount", () => {
    const { result } = renderHook(() => useAccount());

    expect(MockEventSource.instances).toHaveLength(2);
    expect(MockEventSource.instances[0].url).toContain("/fakultass?mode=sse");
    expect(MockEventSource.instances[1].url).toContain("/prodis?mode=sse");
    expect(result.current.state.loadingFakultas).toBe(true);
    expect(result.current.state.loadingProdi).toBe(true);
  });

  it("should load sourceFakultas progressively via SSE events", () => {
    const { result } = renderHook(() => useAccount());
    const fakultasStream = MockEventSource.instances[0];

    act(() => {
      fakultasStream.emitStart();
    });
    expect(result.current.state.sourceFakultas).toEqual([]);

    act(() => {
      fakultasStream.emitData({ KodeFakultas: "FT", NamaFakultas: "Fakultas Teknik" });
    });
    expect(result.current.state.sourceFakultas).toEqual([
      { KodeFakultas: "FT", NamaFakultas: "Fakultas Teknik" },
    ]);

    act(() => {
      fakultasStream.emitDone();
    });
    expect(result.current.state.loadingFakultas).toBe(false);
  });

  it("should toast error and stop loading on SSE failure", () => {
    const { result } = renderHook(() => useAccount());
    const fakultasStream = MockEventSource.instances[0];

    act(() => {
      fakultasStream.emitError();
    });

    expect(result.current.state.loadingFakultas).toBe(false);
    expect(pushToastMock).toHaveBeenCalledWith("SSE connection error");
  });
});
