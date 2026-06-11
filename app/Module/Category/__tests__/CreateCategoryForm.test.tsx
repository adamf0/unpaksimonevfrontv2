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
  setState: vi.fn((cb) => {
    if (typeof cb === "function") {
      cb({ selected: null });
    }
  }),
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
  SelectField: ({ label, value, onChange, options, placeholder, renderItem }: any) => (
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
            {renderItem ? renderItem(opt, value?.value === opt.value) : opt.label}
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

  it("should populate fields in edit mode and submit successfully", async () => {
    mockContextValue.state.selected = {
      uuid: "cat-edit-1",
      namaKategori: "Evaluasi Tenaga Kependidikan",
      uuidSubKategori: "cat-parent-1",
    };
    mockContextValue.actionCategory.mockResolvedValueOnce("cat-edit-1");

    render(<CreateCategoryForm />);

    expect(screen.getByDisplayValue("Evaluasi Tenaga Kependidikan")).toBeInTheDocument();
    expect(screen.getByTestId("select-el-sub-kategori")).toHaveValue("cat-parent-1");

    const submitBtn = screen.getByRole("button", { name: /Update Category/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockContextValue.actionCategory).toHaveBeenCalledWith(
        "cat-edit-1",
        expect.objectContaining({
          kategori: "Evaluasi Tenaga Kependidikan",
        }),
        "update"
      );
      expect(mockContextValue.setState).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
  });

  it("should populate subKategori as null in edit mode when parent category is not found", () => {
    mockContextValue.state.selected = {
      uuid: "cat-edit-2",
      namaKategori: "Evaluasi Dosen",
      uuidSubKategori: "non-existent-parent",
    };
    render(<CreateCategoryForm />);
    expect(screen.getByDisplayValue("Evaluasi Dosen")).toBeInTheDocument();
    expect(screen.getByTestId("select-el-sub-kategori")).toHaveValue("");
  });

  it("should reset form fields and clear selected when Cancel is clicked", () => {
    mockContextValue.state.selected = {
      uuid: "cat-edit-1",
      namaKategori: "Evaluasi Tenaga Kependidikan",
      uuidSubKategori: "cat-parent-1",
    };

    render(<CreateCategoryForm />);

    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(mockContextValue.setState).toHaveBeenCalled();
  });

  it("should handle error submits (Validation, Cloudflare, Network, etc.)", async () => {
    const user = userEvent.setup();

    const { rerender } = render(<CreateCategoryForm />);
    const nameInput = screen.getByTestId("input-kategori");
    const submitBtn = screen.getByRole("button", { name: /Register/i });

    // Case 1: Validation error from server
    mockContextValue.actionCategory.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          code: "Category.Validation",
          message: { kategori: "Nama kategori sudah terpakai", invalidField: "error" },
        },
      },
    });

    await user.type(nameInput, "Kategori Baru");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Nama kategori sudah terpakai")).toBeInTheDocument();
    });

    // Case 2: Cloudflare error
    mockContextValue.actionCategory.mockRejectedValueOnce({
      response: { status: 520, data: {} },
    });
    fireEvent.click(submitBtn);

    // Case 3: Generic response error without message
    mockContextValue.actionCategory.mockRejectedValueOnce({
      response: { status: 500, data: {} },
    });
    fireEvent.click(submitBtn);

    // Case 4: Network error (no response)
    mockContextValue.actionCategory.mockRejectedValueOnce(new Error("Network Error"));
    fireEvent.click(submitBtn);
  });
});
