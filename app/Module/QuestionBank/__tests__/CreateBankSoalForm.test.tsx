import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CreateBankSoalForm } from "../Organisms/CreateBankSoalForm";

const mockContextValue = {
  state: {
    selected: null as any,
    action: null as any,
  },
  actionBankSoal: vi.fn(),
  setState: vi.fn(),
  loadData: vi.fn(),
};

vi.mock("../Context/QuestionBankProvider", () => ({
  useQuestionBankContext: () => mockContextValue,
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

vi.mock("../../Common/Components/Molecules/CKEditorField", () => ({
  CKEditorField: ({ id, label, value, onChange, error }: any) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} data-testid={`ckeditor-${id}`} value={value} onChange={(e) => onChange(e.target.value)} />
      {error && <span>{error}</span>}
    </div>
  ),
}));

vi.mock("../../Common/Components/Molecules/AnimatedButton", () => ({
  default: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

describe("CreateBankSoalForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockContextValue.state.selected = null;
  });

  it("should validate and submit successfully when fields are filled", async () => {
    const user = userEvent.setup();
    mockContextValue.actionBankSoal.mockResolvedValueOnce("new-id");

    render(<CreateBankSoalForm />);

    const titleInput = screen.getByTestId("input-judul");
    const semesterInput = screen.getByTestId("input-semester");

    await user.type(titleInput, "Ujian Pemrograman Web");
    await user.type(semesterInput, "202601");

    const submitButton = screen.getByRole("button", { name: /Register New/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockContextValue.actionBankSoal).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          judul: "Ujian Pemrograman Web",
          semester: "202601",
        }),
        "create"
      );
    });
  });

  it("should show validation error if required fields are missing", async () => {
    render(<CreateBankSoalForm />);

    const submitButton = screen.getByRole("button", { name: /Register New/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText("Judul wajib diisi")).toBeInTheDocument();
    expect(await screen.findByText("Semester wajib diisi")).toBeInTheDocument();
  });
});
