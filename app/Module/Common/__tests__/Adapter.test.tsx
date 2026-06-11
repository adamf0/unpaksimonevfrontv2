import "./mocks/apiMocks";
import { describe, it, expect, vi } from "vitest";
import { adaptSelectOptions } from "../Adapter/adaptSelectOptions";
import { adaptSelectOptionsMerge } from "../Adapter/adaptSelectOptionsMerge";
import { ActionTableAdapter } from "../Adapter/ActionTableAdapter";
import { ActionItem } from "../../Common/Components/Attribut/ActionItem";

describe("adaptSelectOptions adapter", () => {
  it("should adapt array of objects using config keys", () => {
    const rawData = [
      { uuid: "opt-1", name: "Pilihan Satu" },
      { uuid: "opt-2", name: "Pilihan Dua" },
    ];

    const result = adaptSelectOptions(rawData, {
      valueKey: "uuid",
      labelKey: "name",
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      value: "opt-1",
      label: "Pilihan Satu",
      payload: rawData[0],
    });
    expect(result[1]).toEqual({
      value: "opt-2",
      label: "Pilihan Dua",
      payload: rawData[1],
    });
  });

  it("should filter out duplicate values", () => {
    const rawData = [
      { uuid: "opt-1", name: "Pilihan Satu" },
      { uuid: "opt-1", name: "Pilihan Satu Duplikat" },
    ];

    const result = adaptSelectOptions(rawData, {
      valueKey: "uuid",
      labelKey: "name",
    });

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("Pilihan Satu");
  });

  it("should skip item if valueKey resolves to empty string", () => {
    const rawData = [
      { uuid: "", name: "Pilihan Kosong" },
      { uuid: "opt-3", name: "Pilihan Tiga" },
    ];

    const result = adaptSelectOptions(rawData, {
      valueKey: "uuid",
      labelKey: "name",
    });

    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("opt-3");
  });

  it("should handle nullish coalescing default fallback values", () => {
    const rawData = [
      { uuid: "opt-1", name: null },
      { uuid: "opt-2", name: undefined },
    ];
    const result = adaptSelectOptions(rawData as any, {
      valueKey: "uuid",
      labelKey: "name",
    });
    expect(result[0].label).toBe("");
    expect(result[1].label).toBe("");
  });
});

describe("adaptSelectOptionsMerge adapter", () => {
  it("should join multiple label keys with spaces by default", () => {
    const rawData = [
      { id: "usr-1", first: "John", last: "Doe" },
    ];

    const result = adaptSelectOptionsMerge(rawData, {
      valueKey: "id",
      labelKeys: ["first", "last"],
    });

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("John Doe");
  });

  it("should replace template keys sequentially", () => {
    const rawData = [
      { id: "usr-1", first: "John", last: "Doe" },
    ];

    const result = adaptSelectOptionsMerge(rawData, {
      valueKey: "id",
      labelKeys: ["first", "last"],
      template: "%s - %s",
    });

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe("John - Doe");
  });

  it("should skip items with empty valueKey", () => {
    const rawData = [
      { id: "", first: "John", last: "Doe" },
    ];

    const result = adaptSelectOptionsMerge(rawData, {
      valueKey: "id",
      labelKeys: ["first", "last"],
    });

    expect(result).toHaveLength(0);
  });

  it("should handle nullish coalescing defaults and overflow placeholders", () => {
    const rawData = [
      { id: "usr-1", first: null, last: undefined },
    ];

    const resultNullish = adaptSelectOptionsMerge(rawData as any, {
      valueKey: "id",
      labelKeys: ["first", "last"],
    });
    expect(resultNullish[0].label).toBe(" ");

    const resultOverflow = adaptSelectOptionsMerge(rawData as any, {
      valueKey: "id",
      labelKeys: ["first"],
      template: "%s - %s - %s",
    });
    expect(resultOverflow[0].label).toBe(" -  - ");
  });
});

describe("ActionTableAdapter Class", () => {
  it("should adapt items to ActionItems based on status map", () => {
    const mockItem: any = {
      id: "1",
      name: "Template Test",
      status: "draft",
    };

    const editAction = vi.fn().mockImplementation((item) => ({
      id: "edit",
      label: `Edit ${item.name}`,
    }));

    const deleteAction = vi.fn().mockImplementation((item) => ({
      id: "delete",
      label: `Delete ${item.name}`,
    }));

    const config = {
      baseActions: {
        edit: editAction,
        delete: deleteAction,
      },
      actionMap: {
        draft: ["edit", "delete"],
        published: ["edit"],
      },
    };

    const adapter = new ActionTableAdapter(mockItem, config as any);
    const result = adapter.toActionItems();

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("edit");
    expect(result[0].label).toBe("Edit Template Test");
    expect(result[1].id).toBe("delete");

    expect(editAction).toHaveBeenCalledWith(mockItem);
    expect(deleteAction).toHaveBeenCalledWith(mockItem);
  });

  it("should return empty list if status is not mapped in config", () => {
    const mockItem: any = {
      id: "1",
      status: "archived",
    };

    const config = {
      baseActions: {},
      actionMap: {
        draft: ["edit"],
      },
    };

    const adapter = new ActionTableAdapter(mockItem, config as any);
    const result = adapter.toActionItems();

    expect(result).toEqual([]);
  });
});
