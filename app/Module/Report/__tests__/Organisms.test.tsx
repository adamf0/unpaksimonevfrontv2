import "./mocks/apiMocks"; // MUST BE FIRST!
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Import components under test (as default exports where applicable)
import FiltersSection from "../Organisms/FiltersSection";
import DistributionSection from "../Organisms/DistributionSection";
import ChartQuestionSection from "../Organisms/ChartQuestionSection";
import TopQuestionsSection from "../Organisms/TopQuestionsSection";

// Mocks
const setQueryMock = vi.fn();
const resetFiltersMock = vi.fn();
const loadDataDetailMock = vi.fn();
const resetDataDetailMock = vi.fn();

const mockContextValue = {
  query: {
    kode_fakultas: "",
    nama_fakultas: "",
    kode_prodi: "",
    nama_prodi: "",
    bankSoal: [] as any[],
  },
  setQuery: setQueryMock,
  resetFilters: resetFiltersMock,
  data: [] as any[],
  dataDetail: [] as any[],
  dataBankSoal: [] as any[],
  dataFakultas: [] as any[],
  dataProdi: [] as any[],
  yearlyStats: [
    { year: "2026", mahasiswa: 10, dosen: 5, tendik: 2 },
  ],
  topQuestions: [
    { title: "Pertanyaan A", category: "Pedagogik", score: 9.5 },
    { title: "Pertanyaan B", category: "Profesional", score: 8.0 },
  ],
  groupedByFullPath: [
    {
      fullPath: "Kategori A",
      pertanyaan: [
        {
          title: "Soal A?",
          jenispilihan: "rating", // Change to rating so it renders the question title
          jawaban: [
            { label: "5", total: 15 },
          ],
        },
      ],
    },
  ],
  loadingDetail: false,
  loadDataDetail: loadDataDetailMock,
  resetDataDetail: resetDataDetailMock,
  filteredDetail: [] as any[],
};

vi.mock("../Context/KuesionerReportContext", () => ({
  useKuesionerReportContext: () => mockContextValue,
}));

// Mock molecules or icons
vi.mock("../Molecules/ReportFilterForm", () => ({
  ReportFilterForm: ({ value, onChange }: any) => (
    <div data-testid="filter-form">
      <button onClick={() => onChange({ ...value, kode_fakultas: "fak-new" })}>
        Trigger Change
      </button>
    </div>
  ),
}));

vi.mock("../../Common/Components/Atoms/Icon", () => ({
  default: ({ name }: { name: string }) => <span data-testid="icon">{name}</span>,
}));

vi.mock("../../Common/Components/Atoms/Button", () => ({
  default: ({ children, onClick, type, disabled, className }: any) => (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}));

vi.mock("../Molecules/FourYearChart", () => ({
  default: () => <div data-testid="four-year-chart" />,
}));

vi.mock("../Molecules/PieChart", () => ({
  default: () => <div data-testid="pie-chart" />,
}));

vi.mock("../Molecules/DistributionChart", () => ({
  default: () => <div data-testid="distribution-chart" />,
}));

vi.mock("../Service/ReportExport", () => ({
  exportRekapKuesioner: vi.fn(),
  exportDetailKuesioner: vi.fn(),
}));

describe("Report - Organisms Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("FiltersSection", () => {
    it("should render filters trigger buttons and detail actions", () => {
      render(
        <FiltersSection
          bankSoalOptions={[]}
          semesterOptions={[]}
          onApply={vi.fn()}
        />
      );

      expect(screen.getByText(/Terapkan Filter/i)).toBeDefined();
    });

    it("should load detail when onApply triggers", () => {
      const onApplyMock = vi.fn();
      render(
        <FiltersSection
          bankSoalOptions={[]}
          semesterOptions={[]}
          onApply={onApplyMock}
        />
      );

      const applyBtn = screen.getByText(/Terapkan Filter/i);
      fireEvent.click(applyBtn);

      expect(onApplyMock).toHaveBeenCalled();
    });
  });

  describe("DistributionSection", () => {
    it("should render data distribution header and charts", () => {
      const mockFacultyStats = [
        {
          title: "Fakultas Teknik",
          data: [{ title: "Prodi A", total: 10 }],
        },
      ];
      render(
        <DistributionSection
          data={mockFacultyStats}
          loading={false}
          onReload={vi.fn()}
        />
      );

      expect(screen.getByText("Data Distribution")).toBeDefined();
      expect(screen.getByText("Fakultas Teknik")).toBeDefined();
      expect(screen.getByTestId("distribution-chart")).toBeDefined();
    });
  });

  describe("ChartQuestionSection", () => {
    it("should group questions under fullPath headers and render answers distribution", () => {
      render(
        <ChartQuestionSection
          full_path="Kategori A"
          data={mockContextValue.groupedByFullPath[0].pertanyaan}
        />
      );

      expect(screen.getByText("Kategori A")).toBeDefined();
      expect(screen.getByText("Soal A?")).toBeDefined();
    });
  });

  describe("TopQuestionsSection", () => {
    it("should render lists of highest average scoring questions", () => {
      render(
        <TopQuestionsSection
          data={mockContextValue.topQuestions}
          loading={false}
          onReload={vi.fn()}
        />
      );

      expect(screen.getByText(/Top 10 High-Engagement Questions/i)).toBeDefined();
      expect(screen.getByText("Pertanyaan A")).toBeDefined();
      expect(screen.getByText(/Pedagogik/i)).toBeDefined();
      expect(screen.getByText("9.5")).toBeDefined();
    });
  });
});
