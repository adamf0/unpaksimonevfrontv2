import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
// Import mock before the component to ensure Vitest hoisting resolves the mocked Axios client
import { mockApiCall } from "./mocks/apiMocks";
import { BankSoalTimeForm } from "../Molecules/BankSoalTimeForm";

const mockContextValue = {
  state: {
    selected: null as any,
  },
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
    userProfile: { ID: "user-1", Name: "Admin" },
  }),
}));

// Mock calendar picker
vi.mock("@/components/ui/calendar", () => ({
  Calendar: ({ onSelect }: any) => (
    <div>
      <button
        type="button"
        data-testid="btn-select-clean"
        onClick={() => {
          onSelect({
            from: new Date("2026-06-20"),
            to: new Date("2026-06-25"),
          });
        }}
      >
        Select 20-25 June
      </button>
      <button
        type="button"
        data-testid="btn-select-overlap"
        onClick={() => {
          onSelect({
            from: new Date("2026-06-05"),
            to: new Date("2026-06-09"),
          });
        }}
      >
        Select 5-9 June
      </button>
    </div>
  ),
}));

describe("BankSoalTimeForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockContextValue.state.selected = {
      uuid: "bs-uuid-1",
      tanggalmulai: "2026-06-03 00:00:00",
      tanggalakhir: "2026-06-07 23:59:59",
      createdby: "Admin",
      createdbyref: "user-1",
      listextend: [],
    };
  });

  it("should prevent adding schedule if overlaps occur", () => {
    render(<BankSoalTimeForm />);

    const overlapBtn = screen.getByTestId("btn-select-overlap");
    fireEvent.click(overlapBtn);

    const addBtn = screen.getByRole("button", { name: /Tambahkan Jadwal/i });
    fireEvent.click(addBtn);

    expect(screen.getByText("Jadwal bertabrakan")).toBeInTheDocument();
  });

  it("should save clean schedule choice", async () => {
    render(<BankSoalTimeForm />);

    const cleanBtn = screen.getByTestId("btn-select-clean");
    fireEvent.click(cleanBtn);

    const addBtn = screen.getByRole("button", { name: /Tambahkan Jadwal/i });
    mockApiCall.put.mockResolvedValueOnce({ data: { uuid: "bs-1" } });

    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(mockApiCall.put).toHaveBeenCalledWith("/banksoal/bs-uuid-1/schedule", expect.any(FormData));
    });
  });
});
