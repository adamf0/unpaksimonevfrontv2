import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { mockApiCall } from "./mocks/apiMocks";
import { useQuestionerBuilder } from "../Hook/useQuestionerBuilder";

describe("useQuestionerBuilder Hook - State & Selection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default states", () => {
    const { result } = renderHook(() => useQuestionerBuilder());

    expect(result.current.state.loading).toBe(null);
    expect(result.current.state.dataQuestion).toEqual([]);
    expect(result.current.status).toBe("initial");
  });

  it("should update options selections via handleChange", () => {
    const { result } = renderHook(() => useQuestionerBuilder());

    // Setup mock question
    const sampleOption = { label: "Pilihan A", value: "opt-a", freetext: false };

    act(() => {
      result.current.handleChange("q-1", sampleOption, "radio");
    });

    expect(result.current.isSelected("q-1", sampleOption, "radio")).toBe(true);
  });

  it("should append comments via handleExtraChange", () => {
    const { result } = renderHook(() => useQuestionerBuilder());

    act(() => {
      result.current.handleExtraChange("q-1", "opt-a", "Keterangan detail");
    });

    expect(result.current.state.dataAnsware["q-1"]?.extra?.["opt-a"]).toBe("Keterangan detail");
  });
});
