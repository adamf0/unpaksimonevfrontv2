import { describe, it, expect } from "vitest";
import { adaptSelectOptions } from "../Adapter/adaptSelectOptions";

describe("adaptSelectOptions utility", () => {
  interface TestItem {
    id: number;
    name: string;
    description?: string;
  }

  // ========================================================
  // POSITIVE TEST CASES
  // ========================================================
  it("should successfully adapt a list of items to SelectOption structure", () => {
    const rawData: TestItem[] = [
      { id: 101, name: "Fakultas Teknik" },
      { id: 102, name: "Fakultas MIPA" },
    ];

    const result = adaptSelectOptions(rawData, {
      valueKey: "id",
      labelKey: "name",
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      value: "101",
      label: "Fakultas Teknik",
      payload: rawData[0],
    });
    expect(result[1]).toEqual({
      value: "102",
      label: "Fakultas MIPA",
      payload: rawData[1],
    });
  });

  // ========================================================
  // NEGATIVE & EMPTY TEST CASES
  // ========================================================
  it("should return an empty array when given an empty list", () => {
    const result = adaptSelectOptions([], {
      valueKey: "id",
      labelKey: "name",
    });
    expect(result).toEqual([]);
  });

  it("should skip items with null, undefined, or empty string values", () => {
    const rawData = [
      { id: 1, name: "Prodi A" },
      { id: null as any, name: "Prodi B" }, // null id
      { id: undefined as any, name: "Prodi C" }, // undefined id
      { id: "", name: "Prodi D" }, // empty string id
    ];

    const result = adaptSelectOptions(rawData, {
      valueKey: "id",
      labelKey: "name",
    });

    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("1");
    expect(result[0].label).toBe("Prodi A");
  });

  // ========================================================
  // EDGE TEST CASES
  // ========================================================
  it("should deduplicate options using the first occurrence of duplicate valueKey", () => {
    const rawData = [
      { id: 1, name: "Fakultas Pertama" },
      { id: 1, name: "Fakultas Kedua (Duplicate ID)" }, // duplicate valueKey
      { id: 2, name: "Fakultas Ketiga" },
    ];

    const result = adaptSelectOptions(rawData, {
      valueKey: "id",
      labelKey: "name",
    });

    expect(result).toHaveLength(2);
    expect(result[0].value).toBe("1");
    expect(result[0].label).toBe("Fakultas Pertama"); // Keeps first occurrence
    expect(result[1].value).toBe("2");
    expect(result[1].label).toBe("Fakultas Ketiga");
  });
});
