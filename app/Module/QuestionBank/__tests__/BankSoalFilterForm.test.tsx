import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { BankSoalFilterForm } from "../Molecules/BankSoalFilterForm";

const mockContextValue = {
  state: {
    sourceFakultas: [
      { KodeFakultas: "FT", NamaFakultas: "Fakultas Teknik" },
    ],
    sourceProdi: [
      { KodeProdi: "TI", NamaProdi: "Teknik Informatika", KodeFakultas: "FT" },
    ],
  },
};

vi.mock("../Context/QuestionBankProvider", () => ({
  useQuestionBankContext: () => mockContextValue,
}));

vi.mock("../../Common/Components/Molecules/InputField", () => ({
  InputField: ({ id, label, value, onChange }: any) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} data-testid={`input-${id}`} value={value} onChange={onChange} />
    </div>
  ),
}));

vi.mock("../../Common/Components/Organisms/SelectField", () => ({
  SelectField: ({ label, value, onChange, options, placeholder }: any) => (
    <div data-testid={`select-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <label>{label}</label>
      <select
        data-testid={`select-el-${label.toLowerCase().replace(/\s+/g, "-")}`}
        value={value?.value ?? ""}
        onChange={(e) => {
          const selected = options.find((opt: any) => opt.value === e.target.value);
          onChange(selected || null);
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

describe("BankSoalFilterForm Component", () => {
  it("should render selectors and fire onChange callback", () => {
    const mockOnChange = vi.fn();
    const filterValue = { level: "", kode_fakultas: "", nama_fakultas: "" };

    render(<BankSoalFilterForm value={filterValue} onChange={mockOnChange} />);

    expect(screen.getByTestId("select-created-by")).toBeInTheDocument();

    const roleSelect = screen.getByTestId("select-el-created-by");
    fireEvent.change(roleSelect, { target: { value: "admin" } });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        role: "admin",
        page: 1,
      })
    );
  });
});
