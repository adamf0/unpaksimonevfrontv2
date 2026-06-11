import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

// Import mock resources
import { mockApiCall } from "./mocks/apiMocks";

// Import components under test
import { TemplateTable } from "../Organisms/TemplateTable";
import { CreateTemplateForm } from "../Organisms/CreateTemplateForm";
import CreateTemplateChoiceForm from "../Organisms/CreateTemplateChoiceForm";
import TemplateQuestionFormWrapper from "../Organisms/TemplateQuestionFormWrapper";
import TemplateQuestionPreview from "../Organisms/TemplateQuestionPreview";

// Mocks
const pushToastMock = vi.fn();
const setQuestionStateMock = vi.fn((cb) => {
  if (typeof cb === "function") {
    cb({ selected: null });
  }
});
const setQuestionQueryMock = vi.fn((cb) => {
  if (typeof cb === "function") {
    cb({ banksoal: null });
  }
});
const loadDataMock = vi.fn();
const actionQuestionMock = vi.fn();
const loadSinglePertanyaanMock = vi.fn();

const mockQuestionState = {
  dataBank: [{ UUID: "bank-1", Judul: "Evaluasi Dosen", Semester: "Ganjil" }],
  dataKategori: [{ UUID: "kat-1", NamaKategori: "Pedagogik" }],
  selected: null as any,
};

const mockQuestionQuery = {
  banksoal: null as any,
};

const mockAnswerState = {
  data: [] as any[],
  loading: false,
};
const setAnswerStateMock = vi.fn((cb) => {
  if (typeof cb === "function") {
    cb({ data: [] });
  }
});

const mockPreviewData = [] as any[];
const loadPreviewMock = vi.fn();

vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: pushToastMock,
  }),
}));

vi.mock("../Context/TemplateQuestionProvider", () => ({
  useTemplateQuestionContext: () => ({
    questionState: mockQuestionState,
    questionQuery: mockQuestionQuery,
    setQuestionState: setQuestionStateMock,
    setQuestionQuery: setQuestionQueryMock,
    loadData: loadDataMock,
    actionQuestion: actionQuestionMock,
    loadSinglePertanyaan: loadSinglePertanyaanMock,
  }),
}));

vi.mock("../Context/TemplateAnswareProvider", () => ({
  useTemplateAnswerContext: () => ({
    answerState: mockAnswerState,
    setAnswerState: setAnswerStateMock,
  }),
}));

vi.mock("../Hook/useTemplatePreview", () => ({
  useTemplatePreview: () => ({
    previewData: mockPreviewData,
    loadPreview: loadPreviewMock,
  }),
}));

vi.mock("../../Common/Components/Template/AdminPanelTemplate", () => ({
  useAdminPanel: () => ({
    userProfile: { Level: "admin" },
  }),
}));

vi.mock("../../Quesioner/Template/QuestionerLayout", () => ({
  default: ({ children }: any) => <div data-testid="questioner-layout">{children}</div>,
}));

vi.mock("../../Common/Components/Molecules/ActionButtons", () => ({
  ActionButtons: ({ items }: { items: any[] }) => (
    <div data-testid="action-buttons">
      {items.map((item) => (
        <button key={item.name} onClick={item.onClick} data-testid={`action-${item.name}`}>
          {item.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../../Common/Components/Atoms/Icon", () => ({
  default: ({ name }: { name: string }) => <span data-testid="icon">{name}</span>,
}));

vi.mock("../../Common/Components/Atoms/Button", () => ({
  default: ({ children, onClick, type, disabled }: any) => (
    <button type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock("../../Common/Components/Molecules/AnimatedButton", () => ({
  default: ({ children, onClick, type, disabled, icon }: any) => (
    <button type={type} onClick={onClick} disabled={disabled} data-testid={icon ? `btn-icon-${icon}` : undefined}>
      {children}
      {icon}
    </button>
  ),
}));

vi.mock("../../Common/Components/Organisms/SelectField", () => ({
  SelectField: ({ label, value, onChange, options, error }: any) => (
    <div data-testid={`select-${(label || "").toLowerCase().replace(/\s+/g, "-")}`}>
      <span>{label}</span>
      <select
        data-testid={`select-el-${(label || "").toLowerCase().replace(/\s+/g, "-")}`}
        value={value?.value ?? ""}
        onChange={(e) => {
          const opt = options.find((o: any) => o.value === e.target.value);
          onChange(opt);
        }}
      >
        <option value="">Select...</option>
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span data-testid="error-message">{error}</span>}
    </div>
  ),
}));

vi.mock("../../Common/Components/Molecules/InputField", () => ({
  InputField: ({ label, register, error, placeholder, id }: any) => (
    <div data-testid={`input-${(label || id || "field").toLowerCase().replace(/\s+/g, "-")}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} placeholder={placeholder} {...register} />
      {error && <span data-testid="error-message">{error}</span>}
    </div>
  ),
}));

describe("TemplateQuestionBank - Organisms Test Suite", () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    mockQuestionState.selected = null;
    mockAnswerState.data = [];
    mockQuestionQuery.banksoal = null;
  });

  describe("TemplateTable", () => {
    const tableData = [
      {
        ID: 1,
        UUID: "uuid-temp-1",
        Pertanyaan: "Apakah kurikulum relevan?",
        UuidKategori: "kat-1",
        Kategori: "Kurikulum",
        JenisPilihan: "radio",
        Bobot: 3,
        Required: 1,
        Status: "active",
        CreatedBy: "admin",
        DeletedAt: null,
      },
    ];

    it("should render table headers and rows correctly", () => {
      render(
        <TemplateTable
          data={tableData}
          loading={false}
          openDelete={vi.fn()}
          openForceDelete={vi.fn()}
          onCopy={vi.fn()}
        />
      );

      expect(screen.getByText("Apakah kurikulum relevan?")).toBeDefined();
      expect(screen.getByText("Kurikulum")).toBeDefined();
      expect(screen.getByText("radio")).toBeDefined();
      // "Bobot: +3" contains a subelement text-black with "Bobot:", check by regex or label check
      expect(screen.getByText("Bobot:")).toBeDefined();
      expect(screen.getByText(/\+3/)).toBeDefined();
    });

    it("should trigger copy callback", () => {
      const onCopyMock = vi.fn();
      render(
        <TemplateTable
          data={tableData}
          loading={false}
          openDelete={vi.fn()}
          openForceDelete={vi.fn()}
          onCopy={onCopyMock}
        />
      );

      const copyBtn = screen.getByTestId("action-copy");
      fireEvent.click(copyBtn);
      expect(onCopyMock).toHaveBeenCalled();
    });
  });

  describe("CreateTemplateForm Integration & Validation", () => {
    const FormWrapper = ({ children }: { children: React.ReactNode }) => {
      const methods = useForm({
        defaultValues: {
          banksoal: null,
          kategori: null,
          pertanyaan: "",
          tipepilihan: null,
          bobot: 1,
          wajibisi: true,
        },
      });
      return <FormProvider {...methods}>{children}</FormProvider>;
    };

    it("should render form fields with options mapped", () => {
      render(
        <FormWrapper>
          <CreateTemplateForm />
        </FormWrapper>
      );

      expect(screen.getByTestId("select-bank-soal")).toBeDefined();
      expect(screen.getByTestId("select-kategori")).toBeDefined();
      expect(screen.getByPlaceholderText(/Masukkan teks pertanyaan/i)).toBeDefined();
      expect(screen.getByTestId("select-tipe-pilihan")).toBeDefined();
      expect(screen.getByTestId("input-bobot")).toBeDefined();
    });
  });

  describe("CreateTemplateChoiceForm Dynamic Options", () => {
    const FormWrapper = ({ children, defaultValues }: any) => {
      const methods = useForm({
        defaultValues: defaultValues || {
          options: [],
        },
      });
      return <FormProvider {...methods}>{children}</FormProvider>;
    };

    it("should handle options being undefined", () => {
      render(
        <FormWrapper defaultValues={{ options: undefined }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
    });

    it("should render options list and trigger add actions", async () => {
      mockQuestionState.selected = { uuid: "q-101", tipe: "radio" };
      mockApiCall.post.mockResolvedValueOnce({ data: { uuid: "ans-new" } });

      render(
        <FormWrapper defaultValues={{ options: [{ value: "ans-1", label: "Opsi A", payload: {} }] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );

      expect(screen.getByDisplayValue("Opsi A")).toBeDefined();

      const addBtn = screen.getByRole("button", { name: /Opsi/ });
      await act(async () => {
        fireEvent.click(addBtn);
      });

      expect(mockApiCall.post).toHaveBeenCalledWith("/templatejawaban", expect.any(FormData), expect.any(Object));
    });

    it("should prevent adding more than 1 free text option", async () => {
      mockQuestionState.selected = { uuid: "q-101", tipe: "radio" };
      render(
        <FormWrapper defaultValues={{ options: [{ value: "ans-free", label: "Free Text", payload: { IsFreeText: "1" } }] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
      const freeTextBtn = screen.getByRole("button", { name: /Free Text/i });
      await act(async () => {
        fireEvent.click(freeTextBtn);
      });
      expect(screen.getByText("Free text hanya boleh 1")).toBeInTheDocument();
    });

    it("should successfully add a free text option when none exists", async () => {
      mockQuestionState.selected = { uuid: "q-101", tipe: "radio" };
      mockApiCall.post.mockResolvedValueOnce({ data: { uuid: "ans-free-new" } });

      render(
        <FormWrapper defaultValues={{ options: [] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
      const freeTextBtn = screen.getByRole("button", { name: /Free Text/i });
      await act(async () => {
        fireEvent.click(freeTextBtn);
      });

      expect(mockApiCall.post).toHaveBeenCalledWith(
        "/templatejawaban",
        expect.any(FormData),
        expect.any(Object)
      );
    });

    it("should handle add option when response data is empty", async () => {
      mockQuestionState.selected = { uuid: "q-101", tipe: "radio" };
      mockApiCall.post.mockResolvedValueOnce({ data: null });

      render(
        <FormWrapper defaultValues={{ options: [] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
      const addOpsiBtn = screen.getByRole("button", { name: /Opsi/i });
      await act(async () => {
        fireEvent.click(addOpsiBtn);
      });
      // Will not crash and proceeds
    });

    it("should handle option removal when item value is missing", async () => {
      render(
        <FormWrapper defaultValues={{ options: [{ value: "", label: "Opsi A", payload: {} }, { value: "ans-2", label: "Opsi B", payload: {} }] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
      const deleteBtns = screen.getAllByRole("button", { name: /delete/i });
      await act(async () => {
        fireEvent.click(deleteBtns[0]);
      });
      expect(mockApiCall.delete).not.toHaveBeenCalled();
    });

    it("should handle option input change when field value is missing", async () => {
      vi.useFakeTimers();
      mockApiCall.put.mockResolvedValueOnce({});

      render(
        <FormWrapper defaultValues={{ options: [{ value: undefined, label: "Opsi A", payload: { UUIDTemplatePertanyaan: "q-101" } }] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );

      const input = screen.getByPlaceholderText("Isi opsi...");
      fireEvent.change(input, { target: { value: "Opsi A Baru" } });

      await act(async () => {
        vi.advanceTimersByTime(800);
      });

      expect(mockApiCall.put).toHaveBeenCalledWith("/templatejawaban/-", expect.any(FormData), expect.any(Object));
      vi.useRealTimers();
    });

    it("should handle option input change when payload is missing", async () => {
      vi.useFakeTimers();
      mockApiCall.put.mockResolvedValueOnce({});

      render(
        <FormWrapper defaultValues={{ options: [{ value: "ans-1", label: "Opsi A", payload: undefined }] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );

      const input = screen.getByPlaceholderText("Isi opsi...");
      fireEvent.change(input, { target: { value: "Opsi A Baru" } });

      await act(async () => {
        vi.advanceTimersByTime(800);
      });

      expect(mockApiCall.put).toHaveBeenCalledWith("/templatejawaban/ans-1", expect.any(FormData), expect.any(Object));
      vi.useRealTimers();
    });

    it("should enforce limits on adding options for rating types", async () => {
      // 1. rating tipe & normal opsi add
      mockQuestionState.selected = { uuid: "q-101", tipe: "rating" };
      render(
        <FormWrapper defaultValues={{ options: [{ value: "ans-1", label: "Opsi A", payload: {} }] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
      const addOpsiBtn = screen.getByRole("button", { name: /Opsi/i });
      await act(async () => {
        fireEvent.click(addOpsiBtn);
      });
      expect(screen.getByText("rating tidak boleh di tambah")).toBeInTheDocument();

      // 2. rating tipe & free text add
      const freeTextBtn = screen.getByRole("button", { name: /Free Text/i });
      await act(async () => {
        fireEvent.click(freeTextBtn);
      });
      expect(screen.getByText("free text tidak boleh tambah di rating")).toBeInTheDocument();
    });

    it("should show warning if no template question is selected when adding options", async () => {
      mockQuestionState.selected = null;
      render(
        <FormWrapper defaultValues={{ options: [] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
      const addOpsiBtn = screen.getByRole("button", { name: /Opsi/i });
      await act(async () => {
        fireEvent.click(addOpsiBtn);
      });
      expect(screen.getByText("Template pertanyaan belum dipilih")).toBeInTheDocument();
    });

    it("should handle error when API call for adding option fails", async () => {
      mockQuestionState.selected = { uuid: "q-101", tipe: "radio" };
      mockApiCall.post.mockRejectedValueOnce({
        response: { data: { message: "Gagal tambah opsi API" } },
      });

      render(
        <FormWrapper defaultValues={{ options: [] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
      const addOpsiBtn = screen.getByRole("button", { name: /Opsi/i });
      await act(async () => {
        fireEvent.click(addOpsiBtn);
      });
      expect(await screen.findByText("Gagal tambah opsi API")).toBeInTheDocument();
    });

    it("should enforce minimal option constraint when removing", async () => {
      render(
        <FormWrapper defaultValues={{ options: [{ value: "ans-1", label: "Opsi A", payload: {} }] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
      const deleteBtn = screen.getByRole("button", { name: /delete/i });
      await act(async () => {
        fireEvent.click(deleteBtn);
      });
      expect(screen.getByText("Minimal satu opsi harus tersedia")).toBeInTheDocument();
    });

    it("should handle option removal success", async () => {
      mockApiCall.delete.mockResolvedValueOnce({});
      render(
        <FormWrapper defaultValues={{ options: [{ value: "ans-1", label: "Opsi A", payload: {} }, { value: "ans-2", label: "Opsi B", payload: {} }] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
      const deleteBtns = screen.getAllByRole("button", { name: /delete/i });
      await act(async () => {
        fireEvent.click(deleteBtns[0]);
      });
      expect(mockApiCall.delete).toHaveBeenCalledWith("/templatejawaban/ans-1", expect.any(Object));
    });

    it("should handle option removal API error", async () => {
      mockApiCall.delete.mockRejectedValueOnce({
        response: { data: { message: "Gagal hapus opsi API" } },
      });
      render(
        <FormWrapper defaultValues={{ options: [{ value: "ans-1", label: "Opsi A", payload: {} }, { value: "ans-2", label: "Opsi B", payload: {} }] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
      const deleteBtns = screen.getAllByRole("button", { name: /delete/i });
      await act(async () => {
        fireEvent.click(deleteBtns[0]);
      });
      expect(await screen.findByText("Gagal hapus opsi API")).toBeInTheDocument();
    });

    it("should trigger debounced updateOption on input change and handle update errors", async () => {
      vi.useFakeTimers();
      mockApiCall.put.mockResolvedValueOnce({});

      render(
        <FormWrapper defaultValues={{ options: [{ value: "ans-1", label: "Opsi A", payload: { UUIDTemplatePertanyaan: "q-101" } }] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );

      const input = screen.getByPlaceholderText("Isi opsi...");
      fireEvent.change(input, { target: { value: "Opsi A Baru" } });

      // Check it didn't call API immediately
      expect(mockApiCall.put).not.toHaveBeenCalled();

      // Fast forward time
      await act(async () => {
        vi.advanceTimersByTime(800);
      });

      expect(mockApiCall.put).toHaveBeenCalledWith("/templatejawaban/ans-1", expect.any(FormData), expect.any(Object));

      // Mock update error
      mockApiCall.put.mockRejectedValueOnce({
        response: { data: { message: "Gagal update opsi API" } },
      });
      fireEvent.change(input, { target: { value: "Opsi A Gagal" } });
      await act(async () => {
        vi.advanceTimersByTime(800);
      });
      expect(screen.getByText("Gagal update opsi API")).toBeInTheDocument();

      vi.useRealTimers();
    });

    it("should remove toast after 3 seconds", async () => {
      vi.useFakeTimers();
      mockQuestionState.selected = null;
      render(
        <FormWrapper defaultValues={{ options: [] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
      const addOpsiBtn = screen.getByRole("button", { name: /Opsi/i });
      await act(async () => {
        fireEvent.click(addOpsiBtn);
      });
      expect(screen.getByText("Template pertanyaan belum dipilih")).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.queryByText("Template pertanyaan belum dipilih")).toBeNull();
      vi.useRealTimers();
    });

    it("should handle updateOption fallback toast message when response/message is missing", async () => {
      vi.useFakeTimers();
      mockApiCall.put.mockRejectedValueOnce(new Error("Network Error"));

      render(
        <FormWrapper defaultValues={{ options: [{ value: "ans-1", label: "Opsi A", payload: { UUIDTemplatePertanyaan: "q-101" } }] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );

      const input = screen.getByPlaceholderText("Isi opsi...");
      fireEvent.change(input, { target: { value: "Opsi A Fallback" } });

      await act(async () => {
        vi.advanceTimersByTime(800);
      });

      expect(screen.getByText("Gagal update opsi")).toBeInTheDocument();
      vi.useRealTimers();
    });

    it("should handle addOption and removeOption fallback toast messages when response/message is missing", async () => {
      mockQuestionState.selected = { uuid: "q-101", tipe: "radio" };
      mockApiCall.post.mockRejectedValueOnce(new Error("Network Error"));

      const { unmount } = render(
        <FormWrapper defaultValues={{ options: [] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );

      const addOpsiBtn = screen.getByRole("button", { name: /Opsi/i });
      await act(async () => {
        fireEvent.click(addOpsiBtn);
      });

      expect(await screen.findByText("Gagal tambah opsi")).toBeInTheDocument();
      unmount();

      mockApiCall.delete.mockRejectedValueOnce(new Error("Network Error"));
      render(
        <FormWrapper defaultValues={{ options: [{ value: "ans-1", label: "Opsi A", payload: {} }, { value: "ans-2", label: "Opsi B", payload: {} }] }}>
          <CreateTemplateChoiceForm onReset={vi.fn()} isEdit={false} />
        </FormWrapper>
      );
      const deleteBtns = screen.getAllByRole("button", { name: /delete/i });
      await act(async () => {
        fireEvent.click(deleteBtns[0]);
      });
      expect(await screen.findByText("Gagal hapus opsi")).toBeInTheDocument();
    });
  });

  describe("TemplateQuestionFormWrapper Integration", () => {
    it("should handle full form submissions successfully", async () => {
      actionQuestionMock.mockResolvedValueOnce("uuid-success");
      loadSinglePertanyaanMock.mockResolvedValueOnce({ uuid: "uuid-success", judul: "Pertanyaan Baru" });

      render(<TemplateQuestionFormWrapper />);

      const form = screen.getByPlaceholderText(/Masukkan teks pertanyaan/i).closest("form");
      expect(form).toBeDefined();

      // Set input values
      const textarea = screen.getByPlaceholderText(/Masukkan teks pertanyaan/i);
      fireEvent.change(textarea, { target: { value: "Pertanyaan baru kuesioner?" } });

      const bankSelect = screen.getByTestId("select-el-bank-soal");
      fireEvent.change(bankSelect, { target: { value: "bank-1" } });

      const katSelect = screen.getByTestId("select-el-kategori");
      fireEvent.change(katSelect, { target: { value: "kat-1" } });

      const tipeSelect = screen.getByTestId("select-el-tipe-pilihan");
      fireEvent.change(tipeSelect, { target: { value: "radio" } });

      // Submit form
      const submitBtn = screen.getByRole("button", { name: /Simpan Pertanyaan/ });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      await waitFor(() => {
        expect(actionQuestionMock).toHaveBeenCalled();
        expect(pushToastMock).toHaveBeenCalledWith("Berhasil");
      });
    });

    it("should populate fields when questionState.selected changes", () => {
      mockQuestionState.selected = {
        uuid: "q-edit-1",
        kategori: { uuid: "kat-1", kategori: "Kategori Edit" },
        tipe: "radio",
        bobot: 5,
        require: true,
        judul: "Judul Pertanyaan Terpilih",
      };
      mockQuestionQuery.banksoal = { value: "bank-1", label: "Bank 1" };

      render(<TemplateQuestionFormWrapper />);
      expect(screen.getByDisplayValue("Judul Pertanyaan Terpilih")).toBeInTheDocument();
    });

    it("should inject answers from answerState.data", () => {
      mockAnswerState.data = [{ UUID: "ans-1", Jawaban: "Opsi Terinjeksi", IsFreeText: 0 }];

      render(<TemplateQuestionFormWrapper />);
      expect(screen.getByDisplayValue("Opsi Terinjeksi")).toBeInTheDocument();
    });

    it("should generate rating options (1-5) on submit for rating questions (new and edit modes)", async () => {
      // 1. Create Mode
      actionQuestionMock.mockResolvedValueOnce("uuid-rating-new");
      mockApiCall.post.mockResolvedValue({});

      const { unmount } = render(<TemplateQuestionFormWrapper />);

      const textarea = screen.getByPlaceholderText(/Masukkan teks pertanyaan/i);
      fireEvent.change(textarea, { target: { value: "Rating Pertanyaan?" } });

      const bankSelect = screen.getByTestId("select-el-bank-soal");
      fireEvent.change(bankSelect, { target: { value: "bank-1" } });

      const katSelect = screen.getByTestId("select-el-kategori");
      fireEvent.change(katSelect, { target: { value: "kat-1" } });

      const tipeSelect = screen.getByTestId("select-el-tipe-pilihan");
      fireEvent.change(tipeSelect, { target: { value: "rating" } });

      const submitBtn = screen.getByRole("button", { name: /Simpan Pertanyaan/ });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      await waitFor(() => {
        expect(mockApiCall.post).toHaveBeenCalledTimes(5);
        expect(setAnswerStateMock).toHaveBeenCalled();
      });

      unmount();

      // 2. Edit Mode - Duplicate values
      mockQuestionQuery.banksoal = { value: "bank-1", label: "Bank 1" };
      mockQuestionState.selected = {
        uuid: "q-rating-edit",
        tipe: "rating",
        judul: "Rating Pertanyaan?",
        kategori: { uuid: "kat-1", kategori: "Pedagogik" },
        bobot: 1,
        require: true,
      };
      mockAnswerState.data = [
        { UUID: "ans-r1", Nilai: 3, Jawaban: "3", IsFreeText: 0 },
        { UUID: "ans-r2", Nilai: 3, Jawaban: "3 duplikat", IsFreeText: 0 },
      ];

      render(<TemplateQuestionFormWrapper />);

      const submitBtnEdit = screen.getByRole("button", { name: /Update Pertanyaan/ });
      await act(async () => {
        fireEvent.click(submitBtnEdit);
      });

      expect(pushToastMock).toHaveBeenCalledWith(
        expect.stringContaining("Nilai rating duplikat: 3. Mohon perbaiki dulu.")
      );

      // Reset selected and data
      mockQuestionState.selected = null;
      mockAnswerState.data = [];
    });

    it("should fill missing rating values in edit mode on submit", async () => {
      mockQuestionQuery.banksoal = { value: "bank-1", label: "Bank 1" };
      mockQuestionState.selected = {
        uuid: "q-rating-edit",
        tipe: "rating",
        judul: "Rating Pertanyaan?",
        kategori: { uuid: "kat-1", kategori: "Pedagogik" },
        bobot: 1,
        require: true,
      };
      // only 1, 3, 5 are present. 2 and 4 are missing.
      mockAnswerState.data = [
        { UUID: "ans-r1", Nilai: 1, Jawaban: "1", IsFreeText: 0 },
        { UUID: "ans-r3", Nilai: 3, Jawaban: "3", IsFreeText: 0 },
        { UUID: "ans-r5", Nilai: 5, Jawaban: "5", IsFreeText: 0 },
      ];
      actionQuestionMock.mockResolvedValueOnce("q-rating-edit");
      mockApiCall.post.mockResolvedValue({});

      render(<TemplateQuestionFormWrapper />);

      const submitBtn = screen.getByRole("button", { name: /Update Pertanyaan/ });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      await waitFor(() => {
        // Should call POST twice (for value 2 and 4)
        expect(mockApiCall.post).toHaveBeenCalledTimes(2);
      });

      // Clear for next tests
      mockQuestionState.selected = null;
      mockAnswerState.data = [];
    });

    it("should handle submission error paths", async () => {
      actionQuestionMock.mockRejectedValueOnce(new Error("Network Error"));

      render(<TemplateQuestionFormWrapper />);

      // Fill form values to pass validation
      const textarea = screen.getByPlaceholderText(/Masukkan teks pertanyaan/i);
      fireEvent.change(textarea, { target: { value: "Pertanyaan baru kuesioner?" } });

      const bankSelect = screen.getByTestId("select-el-bank-soal");
      fireEvent.change(bankSelect, { target: { value: "bank-1" } });

      const katSelect = screen.getByTestId("select-el-kategori");
      fireEvent.change(katSelect, { target: { value: "kat-1" } });

      const tipeSelect = screen.getByTestId("select-el-tipe-pilihan");
      fireEvent.change(tipeSelect, { target: { value: "radio" } });

      const submitBtn = screen.getByRole("button", { name: /Simpan Pertanyaan/ });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      await waitFor(() => {
        expect(pushToastMock).toHaveBeenCalledWith("Server error");
      });

      // Cloudflare error 524
      actionQuestionMock.mockRejectedValueOnce({ response: { status: 524 } });
      await act(async () => {
        fireEvent.click(submitBtn);
      });
      await waitFor(() => {
        expect(pushToastMock).toHaveBeenCalledWith("Timeout Occurred (524). Server terlalu lama merespon.");
      });

      // Standard error response
      actionQuestionMock.mockRejectedValueOnce({ response: { status: 500, data: { message: "Gagal API" } } });
      await act(async () => {
        fireEvent.click(submitBtn);
      });
      await waitFor(() => {
        expect(pushToastMock).toHaveBeenCalledWith("Gagal API");
      });

      // Standard error response with missing message
      actionQuestionMock.mockRejectedValueOnce({ response: { status: 500, data: {} } });
      await act(async () => {
        fireEvent.click(submitBtn);
      });
      await waitFor(() => {
        expect(pushToastMock).toHaveBeenCalledWith("Error");
      });
    });

    it("should trigger onReset callback to clear state", async () => {
      render(<TemplateQuestionFormWrapper />);
      const newQuestionBtn = screen.getByRole("button", { name: /Pertanyaan Baru/i });
      fireEvent.click(newQuestionBtn);

      expect(setQuestionStateMock).toHaveBeenCalled();
      expect(setQuestionQueryMock).toHaveBeenCalled();
    });
  });

  describe("TemplateQuestionPreview Rendering", () => {
    it("should group and render preview list from streamed questions", () => {
      mockPreviewData.length = 0;
      mockPreviewData.push(
        {
          UUID: "q-1",
          Pertanyaan: "Apakah sarana memadai?",
          Required: 1,
          JenisPilihan: "radio",
          FullPath: "Fasilitas Kampus",
          CreatedBy: "admin",
          ListJawaban: [
            { UUID: "ans-1", Jawaban: "Sangat Memadai", Nilai: 5, IsFreeText: 0 },
            { UUID: "ans-2", Jawaban: "Cukup Memadai", Nilai: 3, IsFreeText: 0 },
          ],
        },
        {
          UUID: "q-1-null-created",
          Pertanyaan: "Null CreatedBy?",
          Required: 1,
          JenisPilihan: "radio",
          FullPath: "Fasilitas Kampus",
          CreatedBy: null,
          ListJawaban: [
            { UUID: "ans-3", Jawaban: "Ya", Nilai: 1, IsFreeText: 0 },
          ],
        },
        {
          UUID: "q-1-admin-lpm",
          Pertanyaan: "Admin LPM CreatedBy?",
          Required: 1,
          JenisPilihan: "radio",
          FullPath: "Fasilitas Kampus",
          CreatedBy: "admin lpm",
          ListJawaban: [
            { UUID: "ans-4", Jawaban: "Ya", Nilai: 1, IsFreeText: 0 },
          ],
        }
      );

      render(<TemplateQuestionPreview />);

      expect(screen.getByTestId("questioner-layout")).toBeDefined();
      expect(screen.getByText("Fasilitas Kampus")).toBeDefined();
      expect(screen.getByText("Apakah sarana memadai?")).toBeDefined();
      expect(screen.getByText("Null CreatedBy?")).toBeDefined();
      expect(screen.getByText("Admin LPM CreatedBy?")).toBeDefined();
      expect(screen.getByText("Sangat Memadai")).toBeDefined();
      expect(screen.getByText("Cukup Memadai")).toBeDefined();
    });

    it("should skip step traversal when a step lacks questions", async () => {
      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

      mockPreviewData.length = 0;
      mockPreviewData.push(
        {
          UUID: "q-admin",
          Pertanyaan: "Pertanyaan Admin?",
          Required: 1,
          JenisPilihan: "radio",
          FullPath: "Path Admin",
          CreatedBy: "admin",
          ListJawaban: [{ UUID: "ans-a1", Jawaban: "Ya", Nilai: 1, IsFreeText: 0 }],
        },
        {
          UUID: "q-prodi",
          Pertanyaan: "Pertanyaan Prodi?",
          Required: 0,
          JenisPilihan: "radio",
          FullPath: "Path Prodi",
          CreatedBy: "prodi",
          ListJawaban: [{ UUID: "ans-p1", Jawaban: "Ya", Nilai: 1, IsFreeText: 0 }],
        }
      );

      render(<TemplateQuestionPreview />);

      expect(screen.getByText("Pertanyaan Admin?")).toBeInTheDocument();
      expect(screen.queryByText("Pertanyaan Prodi?")).toBeNull();

      const submitBtn = screen.getByRole("button", { name: /Lanjut ke Prodi/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText("Pertanyaan Prodi?")).toBeInTheDocument();
      expect(screen.queryByText("Pertanyaan Admin?")).toBeNull();

      alertSpy.mockRestore();
    });

    it("should handle step traversal through admin, fakultas, prodi and complete preview", async () => {
      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

      mockPreviewData.length = 0;
      mockPreviewData.push(
        {
          UUID: "q-admin",
          Pertanyaan: "Pertanyaan Admin?",
          Required: 1,
          JenisPilihan: "radio",
          FullPath: "Path Admin",
          CreatedBy: "admin",
          ListJawaban: [{ UUID: "ans-a1", Jawaban: "Ya", Nilai: 1, IsFreeText: 0 }],
        },
        {
          UUID: "q-admin-2",
          Pertanyaan: "Pertanyaan Admin 2?",
          Required: 0,
          JenisPilihan: "radio",
          FullPath: "A Path Admin", // Lexicographically smaller to cover sort branch
          CreatedBy: "admin",
          ListJawaban: [{ UUID: "ans-a2", Jawaban: "Ya", Nilai: 1, IsFreeText: 0 }],
        },
        {
          UUID: "q-fakultas",
          Pertanyaan: "Pertanyaan Fakultas?",
          Required: 0,
          JenisPilihan: "radio",
          FullPath: "Path Fakultas",
          CreatedBy: "fakultas",
          ListJawaban: [{ UUID: "ans-f1", Jawaban: "Ya", Nilai: 1, IsFreeText: 0 }],
        },
        {
          UUID: "q-prodi",
          Pertanyaan: "Pertanyaan Prodi?",
          Required: 0,
          JenisPilihan: "radio",
          FullPath: "Path Prodi",
          CreatedBy: "prodi",
          ListJawaban: [{ UUID: "ans-p1", Jawaban: "Ya", Nilai: 1, IsFreeText: 0 }],
        }
      );

      render(<TemplateQuestionPreview />);

      // Initially admin step questions
      expect(screen.getByText("Pertanyaan Admin?")).toBeInTheDocument();
      expect(screen.queryByText("Pertanyaan Fakultas?")).toBeNull();

      // Submit to go to Fakultas step
      const submitBtn = screen.getByRole("button", { name: /Lanjut ke Fakultas/i });
      fireEvent.click(submitBtn);

      // Now on fakultas step
      expect(screen.getByText("Pertanyaan Fakultas?")).toBeInTheDocument();
      expect(screen.queryByText("Pertanyaan Admin?")).toBeNull();

      // Submit to go to Prodi step
      fireEvent.click(submitBtn);

      // Now on prodi step
      expect(screen.getByText("Pertanyaan Prodi?")).toBeInTheDocument();

      // Submit to finish preview
      fireEvent.click(submitBtn);
      expect(alertSpy).toHaveBeenCalledWith("Preview selesai");

      alertSpy.mockRestore();
    });

    it("should handle answers selection for radio, multiple, and rating options", () => {
      mockPreviewData.length = 0;
      mockPreviewData.push(
        {
          UUID: "q-rating",
          Pertanyaan: "Pertanyaan Rating?",
          Required: 0,
          JenisPilihan: "rating",
          FullPath: "Path",
          CreatedBy: "admin",
          ListJawaban: [
            { UUID: "ans-r1", Jawaban: "1", Nilai: 1, IsFreeText: 0 },
            { UUID: "ans-r2", Jawaban: "2", Nilai: 2, IsFreeText: 0 },
          ],
        },
        {
          UUID: "q-multiple",
          Pertanyaan: "Pertanyaan Multiple?",
          Required: 0,
          JenisPilihan: "multiple",
          FullPath: "Path",
          CreatedBy: "admin",
          ListJawaban: [
            { UUID: "ans-m1", Jawaban: "Pilihan 1", Nilai: 1, IsFreeText: 0 },
            { UUID: "ans-m2", Jawaban: "Pilihan 2", Nilai: 2, IsFreeText: 0 },
          ],
        },
        {
          UUID: "q-radio",
          Pertanyaan: "Pertanyaan Radio?",
          Required: 0,
          JenisPilihan: "radio",
          FullPath: "Path",
          CreatedBy: "admin",
          ListJawaban: [
            { UUID: "ans-rd1", Jawaban: "Pilihan Radio 1", Nilai: 1, IsFreeText: 0 },
            { UUID: "ans-rd2", Jawaban: "Pilihan Radio 2", Nilai: 2, IsFreeText: 0 },
          ],
        }
      );

      render(<TemplateQuestionPreview />);

      // Click rating option
      const ratingBtn = screen.getByRole("button", { name: "1" });
      fireEvent.click(ratingBtn);

      // Click multiple option (select)
      const multBtn1 = screen.getByRole("button", { name: "Pilihan 1" });
      fireEvent.click(multBtn1);

      // Click multiple option again (deselect)
      fireEvent.click(multBtn1);

      // Click different multiple option
      const multBtn2 = screen.getByRole("button", { name: "Pilihan 2" });
      fireEvent.click(multBtn2);

      // Click radio option
      const radioBtn = screen.getByRole("button", { name: "Pilihan Radio 1" });
      fireEvent.click(radioBtn);

      expect(screen.getByText("Pertanyaan Rating?")).toBeInTheDocument();
    });

    it("should render Lanjut ke Prodi submit label when prodi questions exist but no fakultas questions", () => {
      mockPreviewData.length = 0;
      mockPreviewData.push(
        {
          UUID: "q-admin",
          Pertanyaan: "Pertanyaan Admin?",
          Required: 1,
          JenisPilihan: "radio",
          FullPath: "Path Admin",
          CreatedBy: "admin",
          ListJawaban: [{ UUID: "ans-a1", Jawaban: "Ya", Nilai: 1, IsFreeText: 0 }],
        },
        {
          UUID: "q-prodi",
          Pertanyaan: "Pertanyaan Prodi?",
          Required: 0,
          JenisPilihan: "radio",
          FullPath: "Path Prodi",
          CreatedBy: "prodi",
          ListJawaban: [{ UUID: "ans-p1", Jawaban: "Ya", Nilai: 1, IsFreeText: 0 }],
        }
      );

      render(<TemplateQuestionPreview />);

      const submitBtn = screen.getByRole("button", { name: /Lanjut ke Prodi/i });
      expect(submitBtn).toBeInTheDocument();
    });

    it("should handle hasQuestions when CreatedBy is null", () => {
      mockPreviewData.length = 0;
      mockPreviewData.push({
        UUID: "q-1",
        Pertanyaan: "Sarana Null?",
        JenisPilihan: "radio",
        FullPath: "Path",
        CreatedBy: null,
        ListJawaban: [],
      });
      render(<TemplateQuestionPreview />);
      expect(screen.getByText("Sarana Null?")).toBeInTheDocument();
    });

    it("should handle hasQuestions when CreatedBy is admin lpm", () => {
      mockPreviewData.length = 0;
      mockPreviewData.push({
        UUID: "q-2",
        Pertanyaan: "Sarana Admin LPM?",
        JenisPilihan: "radio",
        FullPath: "Path",
        CreatedBy: "admin lpm",
        ListJawaban: [],
      });
      render(<TemplateQuestionPreview />);
      expect(screen.getByText("Sarana Admin LPM?")).toBeInTheDocument();
    });

    it("should handle edit mode submit when no rating values are missing", async () => {
      mockQuestionQuery.banksoal = { value: "bank-1", label: "Bank 1" };
      mockQuestionState.selected = {
        uuid: "q-rating-edit",
        tipe: "rating",
        judul: "Rating Pertanyaan?",
        kategori: { uuid: "kat-1", kategori: "Pedagogik" },
        bobot: 1,
        require: true,
      };
      mockAnswerState.data = [
        { UUID: "ans-r1", Nilai: 1, Jawaban: "1", IsFreeText: 0 },
        { UUID: "ans-r2", Nilai: 2, Jawaban: "2", IsFreeText: 0 },
        { UUID: "ans-r3", Nilai: 3, Jawaban: "3", IsFreeText: 0 },
        { UUID: "ans-r4", Nilai: 4, Jawaban: "4", IsFreeText: 0 },
        { UUID: "ans-r5", Nilai: 5, Jawaban: "5", IsFreeText: 0 },
      ];
      actionQuestionMock.mockResolvedValueOnce("q-rating-edit");

      render(<TemplateQuestionFormWrapper />);

      const submitBtn = screen.getByRole("button", { name: /Update Pertanyaan/ });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      await waitFor(() => {
        expect(mockApiCall.post).not.toHaveBeenCalled();
      });

      mockQuestionState.selected = null;
      mockAnswerState.data = [];
    });

    it("should handle edit mode selected setup fallbacks", () => {
      mockQuestionQuery.banksoal = null;
      mockQuestionState.selected = {
        uuid: "q-rating-edit",
        tipe: undefined,
        judul: undefined,
        kategori: null,
        bobot: undefined,
        require: undefined,
      };

      render(<TemplateQuestionFormWrapper />);
      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });

    it("should handle empty or null answerState.data", () => {
      mockAnswerState.data = null as any;
      render(<TemplateQuestionFormWrapper />);
      // Should not throw or inject anything
    });

    it("should throw error if uuid is missing on submit", async () => {
      actionQuestionMock.mockResolvedValueOnce(null);

      render(<TemplateQuestionFormWrapper />);

      // Fill form values to pass validation
      const textarea = screen.getByPlaceholderText(/Masukkan teks pertanyaan/i);
      fireEvent.change(textarea, { target: { value: "Pertanyaan baru kuesioner?" } });

      const bankSelect = screen.getByTestId("select-el-bank-soal");
      fireEvent.change(bankSelect, { target: { value: "bank-1" } });

      const katSelect = screen.getByTestId("select-el-kategori");
      fireEvent.change(katSelect, { target: { value: "kat-1" } });

      const tipeSelect = screen.getByTestId("select-el-tipe-pilihan");
      fireEvent.change(tipeSelect, { target: { value: "radio" } });

      const submitBtn = screen.getByRole("button", { name: /Simpan Pertanyaan/ });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      await waitFor(() => {
        expect(pushToastMock).toHaveBeenCalledWith("Server error");
      });
    });

    it("should handle option rating payload Nilai fallback mapping", async () => {
      mockQuestionQuery.banksoal = { value: "bank-1", label: "Bank 1" };
      mockQuestionState.selected = {
        uuid: "q-rating-edit",
        tipe: "rating",
        judul: "Rating Pertanyaan?",
        kategori: { uuid: "kat-1", kategori: "Pedagogik" },
        bobot: 1,
        require: true,
      };
      // Test Nilai in payload, and completely missing Nilai (falls back to 0)
      mockAnswerState.data = [
        { UUID: "ans-r1", payload: { Nilai: 1 }, Jawaban: "1", IsFreeText: 0 },
        { UUID: "ans-r2", Nilai: undefined, payload: undefined, Jawaban: "2", IsFreeText: 0 }, // falls back to 0
        { UUID: "ans-r3", Nilai: 3, Jawaban: "3", IsFreeText: 0 },
        { UUID: "ans-r4", Nilai: 4, Jawaban: "4", IsFreeText: 0 },
        { UUID: "ans-r5", Nilai: 5, Jawaban: "5", IsFreeText: 0 },
      ];
      actionQuestionMock.mockResolvedValueOnce("q-rating-edit");
      mockApiCall.post.mockResolvedValue({});

      render(<TemplateQuestionFormWrapper />);

      const submitBtn = screen.getByRole("button", { name: /Update Pertanyaan/ });
      await act(async () => {
        fireEvent.click(submitBtn);
      });

      await waitFor(() => {
        // Since Nilai=1 (nested), Nilai=3,4,5 (direct) are present, only 2 is missing (since ans-r2 fell back to 0).
        // So it should call POST once for value 2!
        expect(mockApiCall.post).toHaveBeenCalledTimes(1);
      });

      mockQuestionState.selected = null;
      mockAnswerState.data = [];
    });
  });
});
