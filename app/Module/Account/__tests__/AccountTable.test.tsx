import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
// Import mock first
import { mockApiCall } from "./mocks/apiMocks";
import { AccountTable } from "../Organisms/AccountTable";

const mockContextValue = {
  setState: vi.fn(),
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
});
