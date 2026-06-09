import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { QuickInfoCard } from "../Molecules/QuickInfoCard";

vi.mock("../../Common/Components/Atoms/Icon", () => ({
  default: ({ name }: any) => <span data-testid="mock-icon">{name}</span>,
}));

vi.mock("../../Common/Components/Atoms/Card", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe("QuickInfoCard Component", () => {
  it("should render skeleton loader when loading", () => {
    const { container } = render(<QuickInfoCard data={[]} loading={true} />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("should render data size count when done loading", () => {
    render(<QuickInfoCard data={[1, 2, 3]} loading={false} />);
    expect(screen.getByText("Total Bank Soal")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
