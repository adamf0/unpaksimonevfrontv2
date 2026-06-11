import { describe, it, expect } from "vitest";
import { adaptSelectOptions } from "../Adapter/adaptSelectOptions";

describe("Account adaptSelectOptions", () => {
  it("should adapt raw array into SelectOptions", () => {
    const rawData = [
      { id: "10", name: "Account Admin" },
      { id: "20", name: "Account User" },
    ];
    const result = adaptSelectOptions(rawData, {
      valueKey: "id",
      labelKey: "name",
    });
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe("10");
    expect(result[0].label).toBe("Account Admin");
  });

  it("should skip empty value keys and handle nullish defaults", () => {
    const rawData = [
      { id: "", name: "Account Blank" },
      { id: "30", name: null },
      { id: "40", name: undefined },
    ];
    const result = adaptSelectOptions(rawData as any, {
      valueKey: "id",
      labelKey: "name",
    });
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe("30");
    expect(result[0].label).toBe("");
    expect(result[1].value).toBe("40");
    expect(result[1].label).toBe("");
  });
});
