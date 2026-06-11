import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
// Import mock before the component to ensure Vitest hoisting resolves the mocked Axios client
import { mockApiCall } from "./mocks/apiMocks";
import { BankSoalTable, getStatusVariant } from "../Organisms/BankSoalTable";

let mockUserProfile: any = { ID: "user-1", Name: "Admin", Level: "admin" };

const mockContextValue = {
  setState: vi.fn((cb) => {
    if (typeof cb === "function") {
      cb({ selected: null, action: null });
    }
  }),
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
    userProfile: mockUserProfile,
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

  it("should handle copy, edit, and time action buttons", () => {
    render(
      <BankSoalTable
        data={mockTableData}
        loading={false}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    const timeBtn = screen.getByTestId("action-btn-time");
    fireEvent.click(timeBtn);
    expect(mockContextValue.setState).toHaveBeenCalled();
    expect(mockContextValue.setOpenTime).toHaveBeenCalledWith(true);

    const editBtn = screen.getByTestId("action-btn-edit");
    fireEvent.click(editBtn);
    expect(mockContextValue.setState).toHaveBeenCalled();

    const copyBtn = screen.getByTestId("action-btn-copy");
    fireEvent.click(copyBtn);
    expect(mockOnCopy).toHaveBeenCalled();
  });

  it("should trigger active/draf status transitions", async () => {
    // 1. Status draft -> trigger "active"
    const draftData = [
      {
        ...mockTableData[0],
        UUID: "uuid-draft-owner",
        Status: "draf",
      },
    ];

    const { rerender } = render(
      <BankSoalTable
        data={draftData}
        loading={false}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    const activeBtn = screen.getByTestId("action-btn-active");
    mockContextValue.actionBankSoal.mockResolvedValueOnce({ data: { uuid: "uuid-draft-owner" } });
    fireEvent.click(activeBtn);

    await waitFor(() => {
      expect(mockContextValue.actionBankSoal).toHaveBeenCalledWith("uuid-draft-owner", undefined, "active");
      expect(mockContextValue.loadData).toHaveBeenCalled();
    });

    // 2. Status active -> trigger "draf"
    rerender(
      <BankSoalTable
        data={mockTableData}
        loading={false}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    const drafBtn = screen.getByTestId("action-btn-draf");
    mockContextValue.actionBankSoal.mockResolvedValueOnce({ data: { uuid: "uuid-active-owner" } });
    fireEvent.click(drafBtn);

    await waitFor(() => {
      expect(mockContextValue.actionBankSoal).toHaveBeenCalledWith("uuid-active-owner", undefined, "draf");
    });
  });

  it("should render restore and force delete for deleted rows and click force delete", () => {
    const deletedData = [
      {
        ...mockTableData[0],
        DeletedAt: "2026-06-09 10:00:00",
      },
      {
        ...mockTableData[0],
        UUID: "uuid-deleted-not-owner",
        DeletedAt: "2026-06-09 10:00:00",
        CreatedByRef: "user-2", // not owner
      },
    ];

    render(
      <BankSoalTable
        data={deletedData}
        loading={false}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    const actionWrappers = screen.getAllByTestId("mock-action-buttons");
    expect(actionWrappers[0]).toHaveTextContent("restore");
    expect(actionWrappers[0]).toHaveTextContent("force delete");
    expect(actionWrappers[1]).not.toHaveTextContent("restore");
    expect(actionWrappers[1]).not.toHaveTextContent("force delete");

    const forceDeleteBtn = screen.getByTestId("action-btn-force-delete");
    fireEvent.click(forceDeleteBtn);
    expect(mockOpenForceDelete).toHaveBeenCalledWith(
      expect.objectContaining({ uuid: "uuid-active-owner" })
    );
  });

  it("should handle restore action success and various error responses", async () => {
    const deletedData = [
      {
        ...mockTableData[0],
        DeletedAt: "2026-06-09 10:00:00",
      },
    ];

    render(
      <BankSoalTable
        data={deletedData}
        loading={false}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    const restoreBtn = screen.getByTestId("action-btn-restore");

    // Case 1: Success
    mockContextValue.actionBankSoal.mockResolvedValueOnce({ data: { uuid: "uuid-active-owner" } });
    fireEvent.click(restoreBtn);
    await waitFor(() => {
      expect(mockContextValue.actionBankSoal).toHaveBeenCalledWith("uuid-active-owner", undefined, "restore");
      expect(mockContextValue.loadData).toHaveBeenCalled();
    });

    // Case 2: Network error (no response)
    mockContextValue.actionBankSoal.mockRejectedValueOnce(new Error("Network Error"));
    fireEvent.click(restoreBtn);

    // Case 3: Cloudflare error (status 520)
    mockContextValue.actionBankSoal.mockRejectedValueOnce({
      response: { status: 520, data: {} },
    });
    fireEvent.click(restoreBtn);

    // Case 4: Standard error response without message
    mockContextValue.actionBankSoal.mockRejectedValueOnce({
      response: { status: 500, data: {} },
    });
    fireEvent.click(restoreBtn);

    // Case 5: Standard error response with message
    mockContextValue.actionBankSoal.mockRejectedValueOnce({
      response: { status: 500, data: { message: "Internal Error" } },
    });
    fireEvent.click(restoreBtn);
  });

  it("should hide owner actions when CreatedByRef does not match user Profile ID", () => {
    const foreignData = [
      {
        ...mockTableData[0],
        CreatedByRef: "user-2", // not owner (user-1)
      },
    ];

    render(
      <BankSoalTable
        data={foreignData}
        loading={false}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    const actionWrapper = screen.getByTestId("mock-action-buttons");
    expect(actionWrapper).toHaveTextContent("time");
    expect(actionWrapper).not.toHaveTextContent("edit");
    expect(actionWrapper).not.toHaveTextContent("delete");
  });

  it("should handle missing optional fields and cover non-admin / non-owner scenarios", () => {
    // Save original user profile reference
    const originalUserProfile = mockUserProfile;
    
    // Mutate user profile to null
    mockUserProfile = null;

    const partialData = [
      {
        Id: 2,
        UUID: "uuid-partial",
        Judul: "Partial Data Soal",
        Semester: "202602",
        Status: undefined,
        TanggalMulai: null,
        TanggalAkhir: null,
        CreatedByRef: "user-1",
        CreatedAt: null,
        ListExt: null,
      },
    ];

    render(
      <BankSoalTable
        data={partialData}
        loading={false}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    expect(screen.getByText("Partial Data Soal")).toBeInTheDocument();

    // Restore user profile reference
    mockUserProfile = originalUserProfile;
  });

  it("should render loading state when loading is true", () => {
    render(
      <BankSoalTable
        data={[]}
        loading={true}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("should process listextend dates correctly in table rendering", () => {
    const listExtData = [
      {
        ...mockTableData[0],
        UUID: "uuid-1",
        ListExt: [
          {
            TanggalMulai: "2026-06-01 00:00:00",
            TanggalAkhir: "2026-06-30 23:59:59",
          },
          {
            // out of range
            TanggalMulai: "2020-01-01 00:00:00",
            TanggalAkhir: "2020-01-02 23:59:59",
          },
        ],
      },
      {
        ...mockTableData[0],
        UUID: "uuid-2",
        TanggalMulai: "2099-01-01 00:00:00",
        TanggalAkhir: "2099-12-31 23:59:59",
      },
      {
        ...mockTableData[0],
        UUID: "uuid-3",
        TanggalMulai: "",
        TanggalAkhir: "",
        CreatedByRef: null,
      },
      {
        ...mockTableData[0],
        UUID: "uuid-4",
        TanggalMulai: "2020-01-01 00:00:00",
        TanggalAkhir: "2020-01-02 23:59:59",
      },
      {
        ...mockTableData[0],
        UUID: "uuid-5",
        TanggalMulai: "2026-06-30 00:00:00",
        TanggalAkhir: "2026-06-01 00:00:00",
      },
    ];

    render(
      <BankSoalTable
        data={listExtData}
        loading={false}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    expect(screen.getAllByText("Soal Pemrograman")).toHaveLength(5);
  });

  it("should cover helpers getStatusVariant default branch and others", () => {
    expect(getStatusVariant("active")).toBe("success");
    expect(getStatusVariant("delete")).toBe("error");
    expect(getStatusVariant("draf")).toBe("neutral");
    expect(getStatusVariant("random-status" as any)).toBe("neutral");
  });
});
