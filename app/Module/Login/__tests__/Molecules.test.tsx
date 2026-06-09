import "./mocks/apiMocks"; // MUST BE FIRST!
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import InputField from "../Molecules/InputField";
import HeaderBrand from "../Molecules/HeaderBrand";
import SocialButton from "../Molecules/SocialButton";
import RememberMe from "../Molecules/RememberMe";
import QuoteBlock from "../Molecules/QuoteBlock";
import FeatureItem from "../Molecules/FeatureItem";

// Mock child components
vi.mock("../../Common/Components/Atoms/Chekbox", () => ({
  default: ({ id, className, ...props }: any) => (
    <input type="checkbox" data-testid="checkbox-el" id={id} className={className} {...props} />
  ),
}));

vi.mock("../../Common/Components/Atoms/Label", () => ({
  default: ({ children, htmlFor, className }: any) => (
    <label htmlFor={htmlFor} className={className} data-testid="label-el">
      {children}
    </label>
  ),
}));

vi.mock("../../Common/Components/Atoms/Icon", () => ({
  default: ({ name, className }: any) => (
    <span className={className} data-testid="icon-el">
      {name}
    </span>
  ),
}));

describe("Login - Molecules Test Suite", () => {
  describe("InputField", () => {
    it("should render standard text input correctly", () => {
      render(
        <InputField
          id="username"
          name="username"
          label="Username Label"
          placeholder="Enter username"
          icon="person"
        />
      );

      expect(screen.getByText("Username Label")).toBeDefined();
      const input = screen.getByPlaceholderText("Enter username") as HTMLInputElement;
      expect(input).toBeDefined();
      expect(input.type).toBe("text");
      expect(screen.getByTestId("icon-el")).toBeDefined();
      expect(screen.getByText("person")).toBeDefined();
    });

    it("should toggle visibility for password inputs", () => {
      render(
        <InputField
          id="password"
          name="password"
          type="password"
          label="Password Label"
          placeholder="••••"
        />
      );

      const input = screen.getByPlaceholderText("••••") as HTMLInputElement;
      expect(input.type).toBe("password");

      const toggleBtn = screen.getByRole("button");
      expect(toggleBtn).toBeDefined();

      // Click to show password
      fireEvent.click(toggleBtn);
      expect(input.type).toBe("text");
      expect(screen.getByText("visibility_off")).toBeDefined();

      // Click to hide password again
      fireEvent.click(toggleBtn);
      expect(input.type).toBe("password");
      expect(screen.getByText("visibility")).toBeDefined();
    });

    it("should render custom label action", () => {
      render(
        <InputField
          id="username"
          name="username"
          label="Username"
          labelAction={<span data-testid="forgot">Forgot?</span>}
        />
      );

      expect(screen.getByTestId("forgot")).toBeDefined();
    });
  });

  describe("HeaderBrand", () => {
    it("should render logo icon and brand title", () => {
      render(<HeaderBrand />);

      expect(screen.getByText("Unpak Simonev")).toBeDefined();
      expect(screen.getByText("school")).toBeDefined();
    });
  });

  describe("SocialButton", () => {
    it("should render default label and icon", () => {
      const clickSpy = vi.fn();
      render(<SocialButton label="Google" icon="google_logo" onClick={clickSpy} />);

      expect(screen.getByText("Google")).toBeDefined();
      expect(screen.getByText("google_logo")).toBeDefined();

      const btn = screen.getByRole("button");
      fireEvent.click(btn);
      expect(clickSpy).toHaveBeenCalled();
    });

    it("should render custom SVG element as icon", () => {
      render(
        <SocialButton
          label="SSO"
          customIcon={<svg data-testid="custom-svg"><path d="M0 0h24v24H0z" /></svg>}
        />
      );

      expect(screen.getByText("SSO")).toBeDefined();
      expect(screen.getByTestId("custom-svg")).toBeDefined();
    });
  });

  describe("RememberMe", () => {
    it("should render checkbox and label", () => {
      render(<RememberMe id="remember-me" label="Remember Session" />);

      expect(screen.getByTestId("checkbox-el")).toBeDefined();
      expect(screen.getByTestId("label-el")).toBeDefined();
      expect(screen.getByText("Remember Session")).toBeDefined();
    });
  });

  describe("QuoteBlock", () => {
    it("should render quote text and author", () => {
      render(<QuoteBlock quote="This is a test quote." author="Test Author" />);

      expect(screen.getByText('"This is a test quote."')).toBeDefined();
      expect(screen.getByText("— Test Author")).toBeDefined();
    });
  });

  describe("FeatureItem", () => {
    it("should render icon and feature label text", () => {
      render(<FeatureItem icon="verified" label="Secure Auth" />);

      expect(screen.getByText("verified")).toBeDefined();
      expect(screen.getByText("Secure Auth")).toBeDefined();
    });
  });
});
