import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { MockEventSource } from "./mocks/apiMocks";
import { useTemplate } from "../Hook/useTemplate";

const pushToastMock = vi.fn();
vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: pushToastMock,
  }),
}));

describe("useTemplate Hook - SSE Streams", () => {
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

  it("should initialize 4 EventSource streams on mount", () => {
    renderHook(() => useTemplate());

    expect(MockEventSource.instances).toHaveLength(4);
    expect(MockEventSource.instances[0].url).toContain("/kategoris?mode=sse");
    expect(MockEventSource.instances[1].url).toContain("/banksoals?mode=sse");
    expect(MockEventSource.instances[2].url).toContain("/fakultass?mode=sse");
    expect(MockEventSource.instances[3].url).toContain("/prodis?mode=sse");
  });

  it("should load categories list only upon done event", () => {
    const { result } = renderHook(() => useTemplate());
    const stream = MockEventSource.instances[0];

    act(() => {
      stream.emitStart();
    });
    expect(result.current.questionState.dataKategori).toEqual([]);

    act(() => {
      stream.emitData({ UUID: "kat-1", NamaKategori: "Evaluasi Kurikulum" });
    });
    // Kategori is only committed to state on "done"
    expect(result.current.questionState.dataKategori).toEqual([]);

    act(() => {
      stream.emitDone();
    });
    expect(result.current.questionState.dataKategori).toEqual([
      { UUID: "kat-1", NamaKategori: "Evaluasi Kurikulum" },
    ]);
  });

  it("should load bank soal list only upon done event", () => {
    const { result } = renderHook(() => useTemplate());
    const stream = MockEventSource.instances[1];

    act(() => {
      stream.emitStart();
    });
    expect(result.current.questionState.dataBank).toEqual([]);

    act(() => {
      stream.emitData({ UUID: "bank-1", NamaBank: "Bank Pertanyaan A" });
    });
    // Bank Soal is only committed to state on "done"
    expect(result.current.questionState.dataBank).toEqual([]);

    act(() => {
      stream.emitDone();
    });
    expect(result.current.questionState.dataBank).toEqual([
      { UUID: "bank-1", NamaBank: "Bank Pertanyaan A" },
    ]);
  });

  it("should load fakultas list progressively via SSE events", () => {
    const { result } = renderHook(() => useTemplate());
    const stream = MockEventSource.instances[2];

    expect(result.current.questionState.loadingFakultas).toBe(true);

    act(() => {
      stream.emitStart();
    });
    expect(result.current.questionState.sourceFakultas).toEqual([]);

    act(() => {
      stream.emitData({ UUID: "fak-1", NamaFakultas: "Fakultas Teknik" });
    });
    expect(result.current.questionState.sourceFakultas).toEqual([
      { UUID: "fak-1", NamaFakultas: "Fakultas Teknik" },
    ]);

    act(() => {
      stream.emitDone();
    });
    expect(result.current.questionState.loadingFakultas).toBe(false);
    expect(result.current.questionState.sourceFakultas).toEqual([
      { UUID: "fak-1", NamaFakultas: "Fakultas Teknik" },
    ]);
  });

  it("should toast error and stop loading on fakultas SSE connection failure", () => {
    const { result } = renderHook(() => useTemplate());
    const stream = MockEventSource.instances[2];

    act(() => {
      stream.emitError();
    });

    expect(result.current.questionState.loadingFakultas).toBe(false);
    expect(pushToastMock).toHaveBeenCalledWith("SSE connection error");
  });
});
