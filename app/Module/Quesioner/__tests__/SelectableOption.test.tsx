import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import SelectableOption from "../Molecules/SelectableOption";

vi.mock("../../Common/Components/Atoms/Chekbox", () => ({
  default: ({ id, type, checked, onChange }: any) => (
    <input
      id={id}
      type={type}
      checked={checked}
      onChange={onChange}
      data-testid="mock-input"
    />
  ),
}));

vi.mock("../../Common/Components/Atoms/Label", () => ({
  default: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
}));

describe("SelectableOption Component", () => {
  it("should render option label and fire onChange", () => {
    const mockOnChange = vi.fn();
    render(<SelectableOption id="opt-1" label="Pilihan A" onChange={mockOnChange} />);

    expect(screen.getByText("Pilihan A")).toBeInTheDocument();

    const input = screen.getByTestId("mock-input");
    fireEvent.click(input);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it("should render freetext textarea when checked and withInput are true", () => {
    const mockInputChange = vi.fn();
    render(
      <SelectableOption
        id="opt-1"
        label="Lainnya"
        checked={true}
        withInput={true}
        onInputChange={mockInputChange}
      />
    );

    const textarea = screen.getByPlaceholderText("Lainnya...");
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "Keterangan" } });
    expect(mockInputChange).toHaveBeenCalledWith("Keterangan");
  });
});
