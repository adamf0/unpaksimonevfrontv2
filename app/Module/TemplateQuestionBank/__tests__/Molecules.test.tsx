import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";

// Import components under test
import BannerPreview from "../Molecules/BannerPreview";
import { DeletedTime } from "../Molecules/DeletedTime";
import GuideCard from "../Molecules/GuideCard";
import { LaunchCard } from "../Molecules/LaunchCard";
import { QuickInfoCard } from "../Molecules/QuickInfoCard";
import { StatusState } from "../Molecules/StatusState";
import { TemplateFilterForm } from "../Molecules/TemplateFilterForm";
import { Toggle } from "../Atoms/Toggle";
import { CreatedByLabel } from "../Atoms/CreatedByLabel";

// Mocks
const pushToastMock = vi.fn();
const setModeMock = vi.fn();
const onChangeMock = vi.fn();

const mockQuestionState = {
  sourceFakultas: [
    { KodeFakultas: "fak-1", NamaFakultas: "Teknik" },
  ],
  sourceProdi: [
    { KodeProdi: "prod-1", NamaProdi: "Informatika", KodeFakultas: "fak-1" },
  ],
  selected: null,
};

const mockQuestionQuery = {
  banksoal: null as any,
  role: "",
  nama_fakultas: "",
  nama_prodi: "",
  judul: "",
};

vi.mock("../Context/TemplateQuestionProvider", () => ({
  useTemplateQuestionContext: () => ({
    questionState: mockQuestionState,
    questionQuery: mockQuestionQuery,
  }),
}));

vi.mock("../../Common/Components/Template/AdminPanelTemplate", () => ({
  useAdminPanel: () => ({
    setMode: setModeMock,
    userProfile: { Level: "admin" },
  }),
}));

// Mock Icon component
vi.mock("../../Common/Components/Atoms/Icon", () => ({
  default: ({ name }: { name: string }) => <span data-testid="icon">{name}</span>,
}));

// Mock Card component
vi.mock("../../Common/Components/Atoms/Card", () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

// Mock SelectField and InputField
vi.mock("../../Common/Components/Organisms/SelectField", () => ({
  SelectField: ({ label, value, onChange, options }: any) => (
    <div data-testid={`select-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <span>{label}</span>
      <select
        data-testid={`select-el-${label.toLowerCase().replace(/\s+/g, "-")}`}
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

vi.mock("../../Common/Components/Molecules/InputField", () => ({
  InputField: ({ label, value, onChange }: any) => (
    <div data-testid="input-field">
      <label>{label}</label>
      <input
        data-testid="input-el"
        value={value}
        onChange={onChange}
      />
    </div>
  ),
}));

describe("TemplateQuestionBank - Molecules Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("BannerPreview", () => {
    it("should render title and trigger back action click", () => {
      const onBackMock = vi.fn();
      render(<BannerPreview onBack={onBackMock} />);

      expect(screen.getByText("Preview Template")).toBeDefined();
      const backBtn = screen.getByRole("button");
      fireEvent.click(backBtn);
      expect(onBackMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("DeletedTime", () => {
    it("should render null if no deletedtime is present", () => {
      const { container } = render(<DeletedTime item={{ id: 1, uuid: "uuid-1" }} />);
      expect(container.firstChild).toBeNull();
    });

    it("should render relative time label and respond to mouse events", () => {
      const dateStr = new Date(Date.now() - 5000).toISOString(); // 5s ago
      const item = { id: 1, uuid: "uuid-1", deletedtime: dateStr };

      render(<DeletedTime item={item} />);
      expect(screen.getByText(/Deleted/)).toBeDefined();

      const span = screen.getByText(/Deleted/);
      fireEvent.mouseEnter(span);
      // Tooltip should appear
      expect(screen.getByText(/2026/)).toBeDefined(); // Year in localeString

      fireEvent.mouseLeave(span);
      // Tooltip should be gone
      expect(screen.queryByText(/2026/)).toBeNull();
    });
  });

  describe("GuideCard", () => {
    it("should render editor instructions list", () => {
      render(<GuideCard />);
      expect(screen.getByText("Editor Guide")).toBeDefined();
      expect(screen.getByText(/Radio types are best/)).toBeDefined();
    });
  });

  describe("LaunchCard", () => {
    it("should render preview description and disable button if banksoal is empty", () => {
      mockQuestionQuery.banksoal = null;
      render(<LaunchCard />);

      expect(screen.getByText("Preview Questionnaire Template")).toBeDefined();
      const btn = screen.getByRole("button", { name: /preview/i });
      expect(btn.hasAttribute("disabled")).toBe(true);
    });

    it("should enable preview button and trigger setMode when clicked if banksoal is set", () => {
      mockQuestionQuery.banksoal = { value: "bank-abc" };
      render(<LaunchCard />);

      const btn = screen.getByRole("button", { name: /preview/i });
      expect(btn.hasAttribute("disabled")).toBe(false);

      fireEvent.click(btn);
      expect(setModeMock).toHaveBeenCalledWith("preview");
    });
  });

  describe("QuickInfoCard", () => {
    it("should render statistics details", () => {
      render(<QuickInfoCard />);
      expect(screen.getByText("Quick Stats")).toBeDefined();
      expect(screen.getByText("Total Questions")).toBeDefined();
      expect(screen.getByText("42")).toBeDefined();
    });
  });

  describe("StatusState", () => {
    it("should render Active badge when status is active", () => {
      render(<StatusState item={{ uuid: "1", status: "active" }} />);
      expect(screen.getByText("Active")).toBeDefined();
    });

    it("should render Draft badge when status is draf", () => {
      render(<StatusState item={{ uuid: "1", status: "draf" }} />);
      expect(screen.getByText("Draft")).toBeDefined();
    });

    it("should render Deleted badge when item is deleted", () => {
      render(<StatusState item={{ uuid: "1", status: "deleted" }} />);
      expect(screen.getByText("Deleted")).toBeDefined();
    });
  });

  describe("TemplateFilterForm", () => {
    it("should populate select options and invoke onChange callbacks", () => {
      const filterVal = {
        role: "admin",
        nama_fakultas: "Teknik",
        nama_prodi: "Informatika",
        kode_fakultas: "fak-1",
        kode_prodi: "prod-1",
        judul: "Kuesioner",
      };

      render(<TemplateFilterForm value={filterVal} onChange={onChangeMock} />);

      // Verify SelectFields rendered
      expect(screen.getByTestId("select-created-by")).toBeDefined();
      expect(screen.getByTestId("select-fakultas")).toBeDefined();
      expect(screen.getByTestId("select-prodi")).toBeDefined();

      // Trigger Created By selection change
      const roleSelect = screen.getByTestId("select-el-created-by");
      fireEvent.change(roleSelect, { target: { value: "fakultas" } });

      expect(onChangeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "fakultas",
          kode_fakultas: "",
          nama_fakultas: "",
        })
      );
    });
  });

  describe("Toggle Atom Component", () => {
    it("should render and toggle active state on click", () => {
      const handleChange = vi.fn();
      const { container } = render(<Toggle value={false} onChange={handleChange} />);
      const div = container.firstChild as HTMLDivElement;
      
      expect(div.className).toContain("bg-slate-300");
      fireEvent.click(div);
      expect(div.className).toContain("bg-primary");
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("should support default value if not supplied", () => {
      const { container } = render(<Toggle />);
      const div = container.firstChild as HTMLDivElement;
      expect(div.className).toContain("bg-slate-300");
    });
  });

  describe("CreatedByLabel Atom Component", () => {
    it("should return null if no item is provided", () => {
      const { container } = render(<CreatedByLabel item={undefined} />);
      expect(container.firstChild).toBeNull();
    });

    it("should format admin with name and fallback to (LPM) if empty", () => {
      const { rerender } = render(<CreatedByLabel item={{ created: "admin", createdBy: "Rian" }} />);
      expect(screen.getByText("Rian")).toBeDefined();

      rerender(<CreatedByLabel item={{ created: "admin", createdBy: "" }} />);
      expect(screen.getByText("(LPM)")).toBeDefined();
    });

    it("should format fakultas with name and fallback to - if empty", () => {
      const { rerender } = render(<CreatedByLabel item={{ created: "fakultas", createdBy: "Teknik" }} />);
      expect(screen.getByText("(Fakultas: Teknik)")).toBeDefined();

      rerender(<CreatedByLabel item={{ created: "fakultas", createdBy: "" }} />);
      expect(screen.getByText("(Fakultas: -)")).toBeDefined();
    });

    it("should format prodi with name and fallback to - if empty", () => {
      const { rerender } = render(<CreatedByLabel item={{ created: "prodi", createdBy: "Informatika" }} />);
      expect(screen.getByText("(Prodi: Informatika)")).toBeDefined();

      rerender(<CreatedByLabel item={{ created: "prodi", createdBy: "" }} />);
      expect(screen.getByText("(Prodi: -)")).toBeDefined();
    });

    it("should fallback to createdBy or (LPM) if role is not in map", () => {
      const { rerender } = render(<CreatedByLabel item={{ created: "unknown", createdBy: "User X" }} />);
      expect(screen.getByText("User X")).toBeDefined();

      rerender(<CreatedByLabel item={{ created: "unknown", createdBy: "" }} />);
      expect(screen.getByText("(LPM)")).toBeDefined();
    });
  });
});
