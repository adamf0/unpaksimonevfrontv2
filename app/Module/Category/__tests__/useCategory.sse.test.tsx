import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { MockEventSource } from "./mocks/apiMocks";
import { useCategory } from "../Hook/useCategory";

const pushToastMock = vi.fn();
vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: pushToastMock,
  }),
}));

describe("useCategory Hook - SSE Streams", () => {
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
    const { result } = renderHook(() => useCategory());

    // Three streams: Fakultas, Prodi, Kategori Source
    expect(MockEventSource.instances).toHaveLength(3);
    expect(MockEventSource.instances[0].url).toContain("/fakultass?mode=sse");
    expect(MockEventSource.instances[1].url).toContain("/prodis?mode=sse");
    expect(MockEventSource.instances[2].url).toContain("/kategoris?mode=sse");
    
    expect(result.current.state.loadingFakultas).toBe(true);
    expect(result.current.state.loadingSource).toBe(true);
  });

  it("should load source categories progressively via SSE events", () => {
    const { result } = renderHook(() => useCategory());
    const categorySourceStream = MockEventSource.instances[2];

    act(() => {
      categorySourceStream.emitStart();
    });
    expect(result.current.state.source).toEqual([]);

    act(() => {
      categorySourceStream.emitData({ ID: 1, NamaKategori: "Evaluasi" });
    });
    expect(result.current.state.source).toEqual([
      { ID: 1, NamaKategori: "Evaluasi" },
    ]);

    act(() => {
      categorySourceStream.emitDone();
    });
    expect(result.current.state.loadingSource).toBe(false);
  });

  it("should toast error and stop loading on SSE failure", () => {
    const { result } = renderHook(() => useCategory());
    const categorySourceStream = MockEventSource.instances[2];

    act(() => {
      categorySourceStream.emitError();
    });

    expect(result.current.state.loadingSource).toBe(false);
    expect(pushToastMock).toHaveBeenCalledWith("SSE connection error");
  });
});
