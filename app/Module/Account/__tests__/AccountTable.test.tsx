import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
// Import mock first
import { mockApiCall } from "./mocks/apiMocks";
import { AccountTable } from "../Organisms/AccountTable";

const mockContextValue = {
  setState: vi.fn((cb) => {
    if (typeof cb === "function") {
      cb({ selected: null });
    }
  }),
  actionAccount: vi.fn(),
  loadData: vi.fn(),
};

vi.mock("../Context/AccountProvider", () => ({
  useAccountContext: () => mockContextValue,
}));

vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: vi.fn(),
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

describe("AccountTable Component", () => {
  const mockUsers = [
    {
      UUID: "usr-active",
      Username: "activeuser",
      Level: "admin",
      Name: "Active User",
      Email: "active@test.com",
      RefFakultas: "",
      Fakultas: "",
      RefProdi: "",
      Prodi: "",
      DeletedAt: null,
    },
  ];

  const mockOpenDelete = vi.fn();
  const mockOpenForceDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render table headers and row fields correctly", () => {
    render(
      <AccountTable
        data={mockUsers}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
      />
    );

    expect(screen.getByText("Active User")).toBeInTheDocument();
    expect(screen.getByText("active@test.com")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();

    const actionWrapper = screen.getByTestId("mock-action-buttons");
    expect(actionWrapper).toHaveTextContent("edit");
    expect(actionWrapper).toHaveTextContent("delete");
  });

  it("should trigger openDelete callback", () => {
    render(
      <AccountTable
        data={mockUsers}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
      />
    );

    const deleteBtn = screen.getByTestId("action-btn-delete");
    fireEvent.click(deleteBtn);

    expect(mockOpenDelete).toHaveBeenCalled();
  });

  it("should trigger edit callback by updating state selected user", () => {
    render(
      <AccountTable
        data={mockUsers}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
      />
    );

    const editBtn = screen.getByTestId("action-btn-edit");
    fireEvent.click(editBtn);

    expect(mockContextValue.setState).toHaveBeenCalled();
  });

  it("should render restore and force delete for deleted users and click force delete", () => {
    const deletedUsers = [
      {
        ...mockUsers[0],
        Email: "",
        DeletedAt: "2026-06-09 10:00:00",
      },
    ];

    render(
      <AccountTable
        data={deletedUsers}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
      />
    );

    const actionWrapper = screen.getByTestId("mock-action-buttons");
    expect(actionWrapper).toHaveTextContent("restore");
    expect(actionWrapper).toHaveTextContent("force delete");

    const forceDeleteBtn = screen.getByTestId("action-btn-force-delete");
    fireEvent.click(forceDeleteBtn);
    expect(mockOpenForceDelete).toHaveBeenCalledWith(
      expect.objectContaining({ UUID: "usr-active" })
    );
  });

  it("should handle restore action success and various error responses", async () => {
    const deletedUsers = [
      {
        ...mockUsers[0],
        DeletedAt: "2026-06-09 10:00:00",
      },
    ];

    const { rerender } = render(
      <AccountTable
        data={deletedUsers}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
      />
    );

    const restoreBtn = screen.getByTestId("action-btn-restore");

    // Case 1: Success
    mockContextValue.actionAccount.mockResolvedValueOnce({ data: { uuid: "usr-active" } });
    fireEvent.click(restoreBtn);
    await waitFor(() => {
      expect(mockContextValue.actionAccount).toHaveBeenCalledWith("usr-active", undefined, "restore");
      expect(mockContextValue.loadData).toHaveBeenCalled();
    });

    // Case 2: Network error (no response)
    mockContextValue.actionAccount.mockRejectedValueOnce(new Error("Network Error"));
    fireEvent.click(restoreBtn);
    // wait for async handleAccountAction to settle

    // Case 3: Cloudflare error
    mockContextValue.actionAccount.mockRejectedValueOnce({
      response: { status: 520, data: {} },
    });
    fireEvent.click(restoreBtn);

    // Case 4: Standard error response
    mockContextValue.actionAccount.mockRejectedValueOnce({
      response: { status: 500, data: { message: "Internal Server Error" } },
    });
    fireEvent.click(restoreBtn);

    // Case 5: Standard error response without message
    mockContextValue.actionAccount.mockRejectedValueOnce({
      response: { status: 500, data: {} },
    });
    fireEvent.click(restoreBtn);
  });

  it("should render loading and empty data states correctly", () => {
    // 1. Loading state
    const { rerender } = render(
      <AccountTable
        data={[]}
        loading={true}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
      />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // 2. Empty data state
    rerender(
      <AccountTable
        data={[]}
        loading={false}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
      />
    );
    expect(screen.getByText("No Data")).toBeInTheDocument();
  });

  it("should handle getDepartment details accurately", () => {
    const userWithProdi = [
      {
        ...mockUsers[0],
        Fakultas: "FT",
        Prodi: "Informatika",
      },
    ];
    const userWithFakultas = [
      {
        ...mockUsers[0],
        Fakultas: "FT",
        Prodi: "",
      },
    ];
    const userNoDept = [
      {
        ...mockUsers[0],
        Fakultas: "",
        Prodi: "",
      },
    ];

    const { rerender } = render(
      <AccountTable
        data={userWithProdi}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
      />
    );
    expect(screen.getByText("Informatika")).toBeInTheDocument();

    rerender(
      <AccountTable
        data={userWithFakultas}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
      />
    );
    expect(screen.getByText("FT")).toBeInTheDocument();

    rerender(
      <AccountTable
        data={userNoDept}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
      />
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("should handle default prop values when they are omitted", () => {
    render(
      <AccountTable
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
      />
    );
    expect(screen.getByText("No Data")).toBeInTheDocument();
  });
});
