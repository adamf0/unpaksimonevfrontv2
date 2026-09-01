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
  setState: vi.fn((cb) => {
    if (typeof cb === "function") {
      cb({ selected: null, action: null });
    }
  }),
  loadData: vi.fn(),
};

vi.mock("../Context/QuestionBankProvider", () => ({
  useQuestionBankContext: () => mockContextValue,
}));

const mockPushToast = vi.fn();
vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: mockPushToast,
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

vi.mock("../../Common/Components/Organisms/SelectField", () => ({
  SelectField: ({ label, value, onChange, options, error }: any) => (
    <div>
      <label>{label}</label>
      <select
        data-testid="select-peruntukan"
        value={typeof value === "object" ? value?.value || "" : value || ""}
        onChange={(e) => {
          const opt = options?.find((o: any) => o.value === e.target.value);
          onChange(opt?.value ?? e.target.value);
        }}
      >
        <option value="">Pilih Peruntukan</option>
        {options?.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
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
    const peruntukanSelect = screen.getByTestId("select-peruntukan");

    await user.type(titleInput, "Ujian Pemrograman Web");
    await user.type(semesterInput, "202601");
    await user.selectOptions(peruntukanSelect, "mahasiswa");

    const submitButton = screen.getByRole("button", { name: /Register New/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockContextValue.actionBankSoal).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          judul: "Ujian Pemrograman Web",
          semester: "202601",
          peruntukan: "mahasiswa",
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
    expect(await screen.findByText("Peruntukan wajib dipilih")).toBeInTheDocument();
  });

  it("should handle cancel button click", async () => {
    const user = userEvent.setup();
    render(<CreateBankSoalForm />);
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    await user.click(cancelButton);
    expect(mockContextValue.setState).toHaveBeenCalled();
  });

  it("should populate fields in edit mode and submit update", async () => {
    const user = userEvent.setup();
    mockContextValue.state.selected = {
      uuid: "uuid-123",
      judul: "Judul Edit",
      semester: "202602",
      peruntukan: "dosen",
      konten: "Konten Edit",
      deskripsi: "Deskripsi Edit",
    };
    mockContextValue.state.action = "edit";
    mockContextValue.actionBankSoal.mockResolvedValueOnce("uuid-123");

    render(<CreateBankSoalForm />);

    const submitButton = screen.getByRole("button", { name: /Update Question Bank/i });
    expect(submitButton).toBeInTheDocument();

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockContextValue.actionBankSoal).toHaveBeenCalledWith(
        "uuid-123",
        expect.objectContaining({
          judul: "Judul Edit",
          semester: "202602",
          peruntukan: "dosen",
          konten: "Konten Edit",
          deskripsi: "Deskripsi Edit",
        }),
        "update"
      );
      expect(mockPushToast).toHaveBeenCalledWith("Berhasil simpan");
    });
  });

  it("should not populate fields in edit mode if action is time", () => {
    mockContextValue.state.selected = {
      uuid: "uuid-123",
      judul: "Judul Time",
      semester: "202602",
      peruntukan: "dosen",
      konten: "Konten Time",
      deskripsi: "Deskripsi Time",
    };
    mockContextValue.state.action = "time";

    render(<CreateBankSoalForm />);

    const titleInput = screen.getByTestId("input-judul");
    expect(titleInput).toHaveValue("");
  });

  it("should handle partial/missing edit fields and fallback to empty string", () => {
    mockContextValue.state.selected = {
      uuid: "uuid-123",
      judul: undefined,
      semester: undefined,
      peruntukan: undefined,
      konten: undefined,
      deskripsi: undefined,
    };
    mockContextValue.state.action = "edit";

    render(<CreateBankSoalForm />);

    const titleInput = screen.getByTestId("input-judul");
    expect(titleInput).toHaveValue("");
  });

  it("should handle submission errors (validation, cloudflare, server, generic)", async () => {
    const user = userEvent.setup();
    mockContextValue.state.selected = null;
    mockContextValue.state.action = null;

    // Case 1: Network error (no response)
    mockContextValue.actionBankSoal.mockRejectedValueOnce(new Error("Network Error"));
    render(<CreateBankSoalForm />);
    
    // Fill required fields
    const titleInput = screen.getByTestId("input-judul");
    const semesterInput = screen.getByTestId("input-semester");
    const peruntukanSelect = screen.getByTestId("select-peruntukan");
    await user.type(titleInput, "Ujian Pemrograman Web");
    await user.type(semesterInput, "202601");
    await user.selectOptions(peruntukanSelect, "mahasiswa");
    
    const submitButton = screen.getByRole("button", { name: /Register New/i });
    await user.click(submitButton);
    await waitFor(() => {
      expect(mockPushToast).toHaveBeenCalledWith("Server error");
    });

    // Case 2: Validation errors from server (ending with .Validation)
    mockContextValue.actionBankSoal.mockRejectedValueOnce({
      response: {
        status: 422,
        data: {
          code: "Soal.Validation",
          message: {
            judul: "Judul tidak valid",
            nonAllowedField: "Should be ignored",
          },
        },
      },
    });
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Judul tidak valid")).toBeInTheDocument();
    });

    // Case 3: Cloudflare error (status 524)
    mockContextValue.actionBankSoal.mockRejectedValueOnce({
      response: {
        status: 524,
      },
    });
    await user.click(submitButton);
    await waitFor(() => {
      expect(mockPushToast).toHaveBeenCalledWith("Timeout Occurred (524). Server terlalu lama merespon.");
    });

    // Case 4: Generic error response without message
    mockContextValue.actionBankSoal.mockRejectedValueOnce({
      response: {
        status: 500,
        data: {},
      },
    });
    await user.click(submitButton);
    await waitFor(() => {
      expect(mockPushToast).toHaveBeenCalledWith("Error");
    });

    // Case 5: Generic error response with message
    mockContextValue.actionBankSoal.mockRejectedValueOnce({
      response: {
        status: 500,
        data: { message: "Internal Error Message" },
      },
    });
    await user.click(submitButton);
    await waitFor(() => {
      expect(mockPushToast).toHaveBeenCalledWith("Internal Error Message");
    });
  });
});
