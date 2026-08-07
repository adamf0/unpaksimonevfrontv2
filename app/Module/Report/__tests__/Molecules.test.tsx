import "./mocks/apiMocks"; // MUST BE FIRST!
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Import components under test (as default exports where applicable)
import ChartCard from "../Molecules/ChartCard";
import DistributionCard from "../Molecules/DistributionCard";
import { ReportFilterForm } from "../Molecules/ReportFilterForm";
import DistributionChart from "../Molecules/DistributionChart";
import FourYearChart from "../Molecules/FourYearChart";
import PieChart from "../Molecules/PieChart";
import RatingChart from "../Molecules/RatingChart";
import ProgramCard from "../Atoms/ProgramCard";

// Mock Recharts
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ data }: any) => <div data-testid="pie" data-data={JSON.stringify(data)} />,
  Cell: () => <div data-testid="cell" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="xaxis" />,
  YAxis: () => <div data-testid="yaxis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  CartesianGrid: () => <div data-testid="grid" />,
  LabelList: ({ content }: any) => <div data-testid="labellist">{content && typeof content === "function" ? content({ value: 5 }) : null}</div>,
}));

// Mock Icon component
vi.mock("../../Common/Components/Atoms/Icon", () => ({
  default: ({ name }: { name: string }) => <span data-testid="icon">{name}</span>,
}));

// Mock Card component
vi.mock("../../Common/Components/Atoms/Card", () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

// Mock SelectField
vi.mock("../../Common/Components/Organisms/SelectField", () => ({
  SelectField: ({ label, value, onChange, options }: any) => (
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
    </div>
  ),
}));

// Mock Context Provider values
const mockQuestionState = {
  dataFakultas: [{ KodeFakultas: "fak-1", NamaFakultas: "Fakultas Teknik" }],
  dataProdi: [{ KodeProdi: "prod-1", NamaProdi: "Informatika", KodeFakultas: "fak-1" }],
  dataBankSoal: [{ UUID: "bank-1", Judul: "Bank Soal 1", Semester: "20261" }],
};

vi.mock("../Context/KuesionerReportContext", () => ({
  useKuesionerReportContext: () => ({
    dataFakultas: mockQuestionState.dataFakultas,
    dataProdi: mockQuestionState.dataProdi,
    dataBankSoal: mockQuestionState.dataBankSoal,
  }),
}));

describe("Report - Molecules Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ChartCard", () => {
    it("should render card content and title correctly", () => {
      render(
        <ChartCard title="Grafik A" subtitle="Sub A">
          <div>Chart Content</div>
        </ChartCard>
      );
      expect(screen.getByText("Grafik A")).toBeDefined();
      expect(screen.getByText("Sub A")).toBeDefined();
      expect(screen.getByText("Chart Content")).toBeDefined();
    });
  });

  describe("DistributionCard", () => {
    it("should render distribution card study programs", () => {
      const mockFacultyItem = {
        title: "Fakultas Teknik",
        data: [{ title: "Teknik Informatika", total: 25 }],
      };
      render(<DistributionCard data={mockFacultyItem} grandTotal={25} />);
      expect(screen.getByText("Fakultas Teknik")).toBeDefined();
      expect(screen.getByText(/1 Program Studi/)).toBeDefined();
      expect(screen.getByText(/25 Responden/)).toBeDefined();
    });
  });

  describe("ReportFilterForm", () => {
    it("should render selection fields and execute callbacks", () => {
      const onChangeMock = vi.fn();
      const value = {
        kode_fakultas: "",
        nama_fakultas: "",
        kode_prodi: "",
        nama_prodi: "",
        bankSoal: [],
      };

      render(<ReportFilterForm value={value} onChange={onChangeMock} />);

      expect(screen.getByTestId("select-fakultas")).toBeDefined();
      expect(screen.getByTestId("select-prodi")).toBeDefined();

      const selectFakultas = screen.getByTestId("select-el-fakultas");
      fireEvent.change(selectFakultas, { target: { value: "fak-1" } });

      expect(onChangeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          kode_fakultas: "fak-1",
          nama_fakultas: "Fakultas Teknik",
        })
      );
    });
  });

  describe("Charts Rendering", () => {
    it("should render DistributionChart correctly", () => {
      const mockData = [
        {
          title: "Fakultas Teknik",
          data: [{ title: "Prodi A", total: 10 }],
        },
      ];
      render(<DistributionChart data={mockData} />);
      expect(screen.getByTestId("responsive-container")).toBeDefined();
      expect(screen.getByTestId("pie-chart")).toBeDefined();
    });

    it("should render FourYearChart empty state and chart correctly", () => {
      render(<FourYearChart data={[]} loading={false} />);
      expect(screen.getByText("4 Year Chart Belum Tersedia")).toBeInTheDocument();

      render(<FourYearChart data={[{ year: "2026", "Kategori A": 4.5 }]} loading={false} />);
      expect(screen.getByTestId("responsive-container")).toBeDefined();
      expect(screen.getByTestId("bar-chart")).toBeDefined();
    });

    it("should render PieChart correctly", () => {
      render(<PieChart mainData={[{ label: "Sangat Puas", value: 15 }]} />);
      expect(screen.getByTestId("responsive-container")).toBeDefined();
      expect(screen.getByTestId("pie-chart")).toBeDefined();
    });

    it("should render RatingChart correctly", () => {
      render(<RatingChart title="Rating Soal" data={[{ label: "5", value: 20 }]} />);
      expect(screen.getByText("Rating Soal")).toBeDefined();
      expect(screen.getByText("Total Responden:")).toBeDefined();
    });
  });

  describe("ProgramCard Atom Component", () => {
    it("should render title, total, and percent stats", () => {
      render(<ProgramCard title="Prodi Ilmu Komputer" total="150" percent="75%" />);
      expect(screen.getByText("Prodi Ilmu Komputer")).toBeDefined();
      expect(screen.getByText("150")).toBeDefined();
      expect(screen.getByText("75%")).toBeDefined();
    });
  });
});
