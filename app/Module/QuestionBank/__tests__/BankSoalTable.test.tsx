import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
// Import mock before the component to ensure Vitest hoisting resolves the mocked Axios client
import { mockApiCall } from "./mocks/apiMocks";
import { BankSoalTable } from "../Organisms/BankSoalTable";

const mockContextValue = {
  setState: vi.fn(),
  actionBankSoal: vi.fn(),
  loadData: vi.fn(),
  setOpenTime: vi.fn(),
};

vi.mock("../Context/QuestionBankProvider", () => ({
  useQuestionBankContext: () => mockContextValue,
}));

vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: vi.fn(),
  }),
}));

vi.mock("../../Common/Components/Template/AdminPanelTemplate", () => ({
  useAdminPanel: () => ({
    userProfile: { ID: "user-1", Name: "Admin", Level: "admin" },
  }),
}));

vi.mock("../../Common/Components/Molecules/ActionButtons", () => ({
  ActionButtons: ({ items }: any) => (
    <div data-testid="mock-action-buttons">
      {items.map((item: any) => (
        <button
          key={item.name}
          data-testid={`action-btn-${item.name.replace(/\s+/g, "-")}`}
          onClick={item.onClick}
        >
          {item.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../../Common/Components/Atoms/Badge", () => ({
  default: ({ children }: any) => <span>{children}</span>,
}));

vi.mock("../Atoms/BadgeIndicator", () => ({
  default: ({ children }: any) => <span>{children}</span>,
}));

describe("BankSoalTable Component", () => {
  const mockTableData = [
    {
      Id: 1,
      UUID: "uuid-active-owner",
      Judul: "Soal Pemrograman",
      Semester: "202601",
      Status: "active",
      TanggalMulai: "2026-06-01 00:00:00",
      TanggalAkhir: "2026-06-30 23:59:59",
      CreatedByRef: "user-1",
      CreatedBy: "Owner Admin",
      CreatedAt: "2026-06-01 00:00:00",
      ListExt: [],
    },
  ];

  const mockOpenDelete = vi.fn();
  const mockOpenForceDelete = vi.fn();
  const mockOnCopy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render list items and action buttons", () => {
    render(
      <BankSoalTable
        data={mockTableData}
        loading={false}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    expect(screen.getByText("Soal Pemrograman")).toBeInTheDocument();
    expect(screen.getByText("202601")).toBeInTheDocument();

    const actionWrapper = screen.getByTestId("mock-action-buttons");
    expect(actionWrapper).toHaveTextContent("time");
    expect(actionWrapper).toHaveTextContent("edit");
    expect(actionWrapper).toHaveTextContent("delete");
  });

  it("should dispatch REST triggers on action button click", async () => {
    render(
      <BankSoalTable
        data={mockTableData}
        loading={false}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    const deleteBtn = screen.getByTestId("action-btn-delete");
    fireEvent.click(deleteBtn);
    expect(mockOpenDelete).toHaveBeenCalled();
  });
});
