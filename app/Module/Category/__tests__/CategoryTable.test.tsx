import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
// Import mock first
import { mockApiCall } from "./mocks/apiMocks";
import { CategoryTable } from "../Organisms/CategoryTable";

const mockContextValue = {
  setState: vi.fn(),
  actionCategory: vi.fn(),
  loadData: vi.fn(),
};

vi.mock("../Context/CategoryProvider", () => ({
  useCategoryContext: () => mockContextValue,
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
  default: ({ children, className }: any) => <span className={className}>{children}</span>,
}));

describe("CategoryTable Component", () => {
  const mockCategories = [
    {
      ID: 1,
      UUID: "uuid-1",
      NamaKategori: "Evaluasi Dosen",
      UuidSubKategori: "",
      NamaSubKategori: "",
      DeletedAt: null,
    },
    {
      ID: 2,
      UUID: "uuid-2",
      NamaKategori: "Seksi 1",
      UuidSubKategori: "uuid-1",
      NamaSubKategori: "Evaluasi Dosen",
      DeletedAt: null,
    },
  ];

  const mockOpenDelete = vi.fn();
  const mockOpenForceDelete = vi.fn();
  const mockOnCopy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render table and correct action buttons", () => {
    render(
      <CategoryTable
        data={mockCategories}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    // Evaluasi Dosen is rendered twice (once as category name, once as subcategory parent name)
    expect(screen.getAllByText("Evaluasi Dosen")).toHaveLength(2);
    expect(screen.getByText("Seksi 1")).toBeInTheDocument();

    const actionWrapper = screen.getAllByTestId("mock-action-buttons");
    expect(actionWrapper[0]).toHaveTextContent("copy");
    expect(actionWrapper[0]).toHaveTextContent("edit");
    expect(actionWrapper[0]).toHaveTextContent("delete");
  });

  it("should trigger openDelete callback", () => {
    render(
      <CategoryTable
        data={mockCategories}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    const deleteBtn = screen.getAllByTestId("action-btn-delete")[0];
    fireEvent.click(deleteBtn);

    expect(mockOpenDelete).toHaveBeenCalled();
  });
});
