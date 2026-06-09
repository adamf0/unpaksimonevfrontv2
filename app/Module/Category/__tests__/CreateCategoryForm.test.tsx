import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CreateCategoryForm } from "../Organisms/CreateCategoryForm";

const mockContextValue = {
  state: {
    source: [{ UUID: "cat-parent-1", FullTexts: "Parent Category" }],
    selected: null as any,
  },
  actionCategory: vi.fn(),
  setState: vi.fn(),
  loadData: vi.fn(),
};

vi.mock("../Context/CategoryProvider", () => ({
  useCategoryContext: () => mockContextValue,
}));

vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: vi.fn(),
  }),
}));

vi.mock("../../Common/Components/Molecules/InputField", () => ({
  InputField: ({ id, label, value, onChange, register, error }: any) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} data-testid={`input-${id}`} value={value} onChange={onChange} {...register} />
      {error && <span>{error}</span>}
    </div>
  ),
}));

vi.mock("../../Common/Components/Organisms/SelectField", () => ({
  SelectField: ({ label, value, onChange, options, placeholder }: any) => (
    <div data-testid={`select-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <label>{label}</label>
      <select
        data-testid={`select-el-${label.toLowerCase().replace(/\s+/g, "-")}`}
        value={value?.value ?? ""}
        onChange={(e) => {
          const selected = options.find((opt: any) => opt.value === e.target.value);
          onChange(selected || null);
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock("../../Common/Components/Molecules/AnimatedButton", () => ({
  default: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

describe("CreateCategoryForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockContextValue.state.selected = null;
  });

  it("should validate and submit category successfully", async () => {
    const user = userEvent.setup();
    mockContextValue.actionCategory.mockResolvedValueOnce("new-uuid");

    render(<CreateCategoryForm />);

    const nameInput = screen.getByTestId("input-kategori");
    await user.type(nameInput, "Kategori Akademik");

    const submitBtn = screen.getByRole("button", { name: /Register New Category/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockContextValue.actionCategory).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          kategori: "Kategori Akademik",
        }),
        "create"
      );
    });
  });

  it("should display required error warning", async () => {
    render(<CreateCategoryForm />);

    const submitBtn = screen.getByRole("button", { name: /Register New/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Kategori wajib diisi")).toBeInTheDocument();
  });
});
