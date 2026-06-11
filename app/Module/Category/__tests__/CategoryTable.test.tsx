import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
// Import mock first
import { mockApiCall } from "./mocks/apiMocks";
import { CategoryTable } from "../Organisms/CategoryTable";

const mockContextValue = {
  setState: vi.fn((cb) => {
    if (typeof cb === "function") {
      cb({ selected: null });
    }
  }),
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

  it("should render loading text when loading is true", () => {
    render(
      <CategoryTable
        data={[]}
        loading={true}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );
    expect(screen.getByText("Loading")).toBeInTheDocument();
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

  it("should trigger copy and edit action buttons", () => {
    render(
      <CategoryTable
        data={mockCategories}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    const copyBtn = screen.getAllByTestId("action-btn-copy")[0];
    fireEvent.click(copyBtn);
    expect(mockOnCopy).toHaveBeenCalled();

    const editBtn = screen.getAllByTestId("action-btn-edit")[0];
    fireEvent.click(editBtn);
    expect(mockContextValue.setState).toHaveBeenCalled();
  });

  it("should render restore and force delete for deleted categories and click force delete", () => {
    const deletedCategories = [
      {
        ...mockCategories[0],
        DeletedAt: "2026-06-09 10:00:00",
      },
    ];

    render(
      <CategoryTable
        data={deletedCategories}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    const actionWrapper = screen.getByTestId("mock-action-buttons");
    expect(actionWrapper).toHaveTextContent("restore");
    expect(actionWrapper).toHaveTextContent("force delete");

    const forceDeleteBtn = screen.getByTestId("action-btn-force-delete");
    fireEvent.click(forceDeleteBtn);
    expect(mockOpenForceDelete).toHaveBeenCalledWith(
      expect.objectContaining({ uuid: "uuid-1" })
    );
  });

  it("should handle restore action success and various error responses", async () => {
    const deletedCategories = [
      {
        ...mockCategories[0],
        DeletedAt: "2026-06-09 10:00:00",
      },
    ];

    render(
      <CategoryTable
        data={deletedCategories}
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );

    const restoreBtn = screen.getByTestId("action-btn-restore");

    // Case 1: Success
    mockContextValue.actionCategory.mockResolvedValueOnce({ data: { uuid: "uuid-1" } });
    fireEvent.click(restoreBtn);
    await waitFor(() => {
      expect(mockContextValue.actionCategory).toHaveBeenCalledWith("uuid-1", undefined, "restore");
      expect(mockContextValue.loadData).toHaveBeenCalled();
    });

    // Case 2: Network error (no response)
    mockContextValue.actionCategory.mockRejectedValueOnce(new Error("Network Error"));
    fireEvent.click(restoreBtn);

    // Case 3: Cloudflare error (status 520)
    mockContextValue.actionCategory.mockRejectedValueOnce({
      response: { status: 520, data: {} },
    });
    fireEvent.click(restoreBtn);

    // Case 4: Standard error response without message
    mockContextValue.actionCategory.mockRejectedValueOnce({
      response: { status: 500, data: {} },
    });
    fireEvent.click(restoreBtn);

    // Case 5: Standard error response with message
    mockContextValue.actionCategory.mockRejectedValueOnce({
      response: { status: 500, data: { message: "Internal Error" } },
    });
    fireEvent.click(restoreBtn);
  });

  it("should handle default prop values when they are omitted", () => {
    const { container } = render(
      <CategoryTable
        openDelete={mockOpenDelete}
        openForceDelete={mockOpenForceDelete}
        onCopy={mockOnCopy}
      />
    );
    const tbody = container.querySelector("tbody");
    expect(tbody?.children.length).toBe(0);
  });
});
