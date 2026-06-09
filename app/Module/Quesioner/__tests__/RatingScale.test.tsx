import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import RatingScale from "../Molecules/RatingScale";

describe("RatingScale Component", () => {
  it("should render rating labels and buttons correctly", () => {
    const mockOnChange = vi.fn();
    render(<RatingScale minLabel="BURUK" maxLabel="BAIK" max={5} onChange={mockOnChange} />);

    expect(screen.getByText("BURUK")).toBeInTheDocument();
    expect(screen.getByText("BAIK")).toBeInTheDocument();

    const scaleButtons = screen.getAllByRole("button");
    expect(scaleButtons).toHaveLength(5);

    fireEvent.click(scaleButtons[3]); // Click on rating 4
    expect(mockOnChange).toHaveBeenCalledWith(4);
  });
});
