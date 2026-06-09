import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { SubCategoryCard } from "../Molecules/SubCategoryCard";

const mockContextValue = {
  state: {
    data: [
      { NamaSubKategori: "Sub A" },
      { NamaSubKategori: "Sub B" },
      { NamaSubKategori: "Sub A" }, // duplicate unique name
      { NamaSubKategori: "" }, // empty subcategory
    ],
  },
};

vi.mock("../Context/CategoryProvider", () => ({
  useCategoryContext: () => mockContextValue,
}));

vi.mock("../../Common/Components/Atoms/Card", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe("SubCategoryCard Component", () => {
  it("should compute and render unique subcategories size", () => {
    render(<SubCategoryCard />);
    expect(screen.getByText("Total Sub Kategori")).toBeInTheDocument();
    // Unique subcategories: "Sub A", "Sub B" (Size = 2)
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
