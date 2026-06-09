import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { GuideCard } from "../Molecules/GuideCard";

vi.mock("../../Common/Components/Atoms/Card", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe("GuideCard Component", () => {
  it("should render instructions", () => {
    render(<GuideCard />);
    expect(screen.getByText("Panduan Input")).toBeInTheDocument();
    expect(screen.getByText(/Gunakan bahasa yang baku/i)).toBeInTheDocument();
  });
});
