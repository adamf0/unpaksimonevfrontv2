import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { CategoryCard } from "../Molecules/CategoryCard";

const mockContextValue = {
  state: {
    data: [1, 2, 3, 4],
  },
};

vi.mock("../Context/CategoryProvider", () => ({
  useCategoryContext: () => mockContextValue,
}));

vi.mock("../../Common/Components/Atoms/Card", () => ({
  default: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

describe("CategoryCard Component", () => {
  it("should render correct total categories count", () => {
    render(<CategoryCard />);
    expect(screen.getByText("Total Kategori")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
