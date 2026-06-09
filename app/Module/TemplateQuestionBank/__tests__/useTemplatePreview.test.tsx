import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { MockEventSource } from "./mocks/apiMocks";
import { TemplatePreviewProvider, useTemplatePreview } from "../Hook/useTemplatePreview";

describe("useTemplatePreview Hook", () => {
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

  it("should throw error if used outside Provider", () => {
    expect(() => {
      renderHook(() => useTemplatePreview());
    }).toThrow("useTemplatePreview must be used inside TemplatePreviewProvider");
  });

  it("should initialize default states under provider", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TemplatePreviewProvider>{children}</TemplatePreviewProvider>
    );

    const { result } = renderHook(() => useTemplatePreview(), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.previewData).toEqual([]);
  });

  it("should resolve empty when uuidBankSoal is blank", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TemplatePreviewProvider>{children}</TemplatePreviewProvider>
    );

    const { result } = renderHook(() => useTemplatePreview(), { wrapper });

    let preview;
    await act(async () => {
      preview = await result.current.loadPreview(null);
    });

    expect(preview).toEqual([]);
    expect(result.current.previewData).toEqual([]);
  });

  it("should stream questions and then stream answers in parallel", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TemplatePreviewProvider>{children}</TemplatePreviewProvider>
    );

    const { result } = renderHook(() => useTemplatePreview(), { wrapper });

    let previewPromise: any;
    act(() => {
      previewPromise = result.current.loadPreview("bank-1");
    });

    // Verify first stream initiated (questions list)
    expect(MockEventSource.instances).toHaveLength(1);
    const questionsStream = MockEventSource.instances[0];
    expect(questionsStream.url).toContain("/templatepertanyaans?mode=sse");

    // Emit questions list
    act(() => {
      questionsStream.emitStart();
      questionsStream.emitData({ UUID: "q-101", Pertanyaan: "Pertanyaan 1" });
      questionsStream.emitDone();
    });

    // Wait a tick for microtasks (so Promise.all starts the next streams)
    await act(async () => {
      await Promise.resolve();
    });

    // Verify answers stream for q-101 is created
    expect(MockEventSource.instances).toHaveLength(2);
    const answersStream = MockEventSource.instances[1];
    expect(answersStream.url).toContain("filters=uuidtemplate:eq:q-101");

    // Emit answers list
    act(() => {
      answersStream.emitStart();
      answersStream.emitData({ UUID: "ans-201", Jawaban: "Pilihan A", Score: 10 });
      answersStream.emitDone();
    });

    // Wait for the main promise to resolve
    const finalData = await act(async () => {
      return await previewPromise;
    });

    expect(finalData).toEqual([
      {
        UUID: "q-101",
        Pertanyaan: "Pertanyaan 1",
        ListJawaban: [
          { UUID: "ans-201", Jawaban: "Pilihan A", Score: 10 },
        ],
      },
    ]);

    expect(result.current.previewData).toEqual(finalData);
    expect(result.current.loading).toBe(false);
  });
});
