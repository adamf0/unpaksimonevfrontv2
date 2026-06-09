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
const setQuestionStateMock = vi.fn();
const setQuestionQueryMock = vi.fn();
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
const setAnswerStateMock = vi.fn();

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
  default: ({ children, onClick, type, disabled }: any) => (
    <button type={type} onClick={onClick} disabled={disabled}>
      {children}
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
  InputField: ({ label, register, error }: any) => (
    <div data-testid={`input-${(label || "field").toLowerCase().replace(/\s+/g, "-")}`}>
      <label>{label}</label>
      <input {...register} />
      {error && <span data-testid="error-message">{error}</span>}
    </div>
  ),
}));

describe("TemplateQuestionBank - Organisms Test Suite", () => {
  beforeEach(() => {
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
  });

  describe("TemplateQuestionPreview Rendering", () => {
    it("should group and render preview list from streamed questions", () => {
      mockPreviewData.push({
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
      });

      render(<TemplateQuestionPreview />);

      expect(screen.getByTestId("questioner-layout")).toBeDefined();
      expect(screen.getByText("Fasilitas Kampus")).toBeDefined();
      expect(screen.getByText("Apakah sarana memadai?")).toBeDefined();
      expect(screen.getByText("Sangat Memadai")).toBeDefined();
      expect(screen.getByText("Cukup Memadai")).toBeDefined();
    });
  });
});
