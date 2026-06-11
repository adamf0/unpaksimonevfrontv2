import { describe, it, expect } from "vitest";
import { adaptSelectOptions } from "../Adapter/adaptSelectOptions";

describe("Category adaptSelectOptions", () => {
  it("should adapt raw array into SelectOptions", () => {
    const rawData = [
      { id: "1", name: "Category A" },
      { id: "2", name: "Category B" },
    ];
    const result = adaptSelectOptions(rawData, {
      valueKey: "id",
      labelKey: "name",
    });
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe("1");
    expect(result[0].label).toBe("Category A");
  });

  it("should skip empty value keys and handle nullish defaults", () => {
    const rawData = [
      { id: "", name: "Category Blank" },
      { id: "3", name: null },
      { id: "4", name: undefined },
    ];
    const result = adaptSelectOptions(rawData as any, {
      valueKey: "id",
      labelKey: "name",
    });
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe("3");
    expect(result[0].label).toBe("");
    expect(result[1].value).toBe("4");
    expect(result[1].label).toBe("");
  });
});
