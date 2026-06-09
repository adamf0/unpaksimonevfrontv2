import "./mocks/apiMocks"; // MUST BE FIRST!
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import LoginPage from "../Page/LoginPage";

// Mock child components to isolate the page component
vi.mock("../Organisms/AuthHeroSection", () => ({
  default: () => <div data-testid="auth-hero" />,
}));

vi.mock("../Organisms/AuthLoginSection", () => ({
  default: () => <div data-testid="auth-login" />,
}));

describe("LoginPage Component", () => {
  it("should render page layout and children components", () => {
    render(<LoginPage />);

    expect(screen.getByRole("main")).toBeDefined();
    expect(screen.getByTestId("auth-hero")).toBeDefined();
    expect(screen.getByTestId("auth-login")).toBeDefined();
  });
});
