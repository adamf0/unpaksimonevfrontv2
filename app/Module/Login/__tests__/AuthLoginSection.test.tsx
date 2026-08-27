import "./mocks/apiMocks"; // MUST BE FIRST!
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import AuthLoginSection from "../Organisms/AuthLoginSection";
import { mockApiCall, mockPush, mockGet, mockGetTokenExpiry } from "./mocks/apiMocks";

// Hoisted mock variables allowed inside vi.mock callbacks
let mockIcon: any = null;
let mockAnimatedButton: any = null;
let mockSocialButton: any = null;
let mockDivider: any = null;
let mockInputField: any = null;

// Mock next/dynamic to resolve dynamically imported components synchronously
vi.mock("next/dynamic", () => {
  return {
    default: (loader: any) => {
      const str = loader.toString();
      return (props: any) => {
        const React = require("react");
        if (str.includes("InputField") && mockInputField) {
          return React.createElement(mockInputField, props);
        }
        if (str.includes("Icon") && mockIcon) {
          return React.createElement(mockIcon, props);
        }
        if (str.includes("AnimatedButton") && mockAnimatedButton) {
          return React.createElement(mockAnimatedButton, props);
        }
        if (str.includes("SocialButton") && mockSocialButton) {
          return React.createElement(mockSocialButton, props);
        }
        if (str.includes("Divider") && mockDivider) {
          return React.createElement(mockDivider, props);
        }
        return null;
      };
    },
  };
});

// Mock child components to render synchronously in JSDOM
vi.mock("../../Common/Components/Atoms/Icon", () => ({
  default: ({ name, className }: any) => (
    <span data-testid="icon" className={className}>
      {name}
    </span>
  ),
}));

vi.mock("../../Common/Components/Molecules/AnimatedButton", () => ({
  default: ({ children, disabled, type, onClick, className }: any) => (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      data-testid="animated-button"
    >
      {children}
    </button>
  ),
}));

vi.mock("../Molecules/SocialButton", () => ({
  default: ({ label, onClick, icon, customIcon }: any) => (
    <button
      onClick={onClick}
      data-testid={`social-btn-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {customIcon || icon} {label}
    </button>
  ),
}));

vi.mock("../../Common/Components/Molecules/Divider", () => ({
  default: ({ children }: any) => <div data-testid="divider">{children}</div>,
}));

vi.mock("../Molecules/InputField", () => {
  const React = require("react");
  return {
    default: React.forwardRef(
      (
        { id, label, type = "text", placeholder, icon, labelAction, ...props }: any,
        ref: any
      ) => (
        <div data-testid={`field-${id}`}>
          <div className="flex justify-between">
            <label htmlFor={id}>{label}</label>
            {labelAction}
          </div>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            ref={ref}
            data-testid={`input-${id}`}
            {...props}
          />
        </div>
      )
    ),
  };
});

// Import the components statically (so Vitest resolves their mocks)
import Icon from "../../Common/Components/Atoms/Icon";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import SocialButton from "../Molecules/SocialButton";
import Divider from "../../Common/Components/Molecules/Divider";
import InputField from "../Molecules/InputField";

// Assign components to the hoisted mock variables
mockIcon = Icon;
mockAnimatedButton = AnimatedButton;
mockSocialButton = SocialButton;
mockDivider = Divider;
mockInputField = InputField;

// Mock Toast context
const pushToastMock = vi.fn();
vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: pushToastMock,
  }),
}));

// Mock Cloudflare error handler
vi.mock("../../Common/Error/axiosErrorHandler", () => ({
  handleCloudflareError: vi.fn().mockImplementation((status: number) => {
    if (status === 502) return "CF Bad Gateway";
    return null;
  }),
}));

const mockStartSSOLogin = vi.fn();
vi.mock("../../Common/Service/keycloak", () => ({
  default: () => ({}),
  startSSOLogin: (...args: any[]) => mockStartSSOLogin(...args),
}));

describe("AuthLoginSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    mockGet.mockReturnValue(null);
    if (typeof document !== "undefined") {
      document.cookie = "";
    }
  });

  it("should trigger keycloak login when clicking SSO Unpak button", async () => {
    render(<AuthLoginSection />);

    const ssoBtn = await screen.findByTestId("social-btn-sso-unpak");
    fireEvent.click(ssoBtn);

    expect(mockStartSSOLogin).toHaveBeenCalledWith(
      expect.stringContaining("/callback_sso")
    );
  });

  it("should render credentials input fields and submit button", async () => {
    render(<AuthLoginSection />);

    expect(await screen.findByTestId("field-username")).toBeDefined();
    expect(await screen.findByTestId("field-password")).toBeDefined();
    expect(await screen.findByTestId("animated-button")).toBeDefined();
  });

  it("should show validation errors when submitting empty inputs", async () => {
    render(<AuthLoginSection />);

    const submitBtn = await screen.findByTestId("animated-button");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Username wajib diisi")).toBeDefined();
      expect(screen.getByText("Password wajib diisi")).toBeDefined();
    });

    expect(mockApiCall.post).not.toHaveBeenCalled();
  });

  it("should successfully authenticate, save tokens/cookies, and navigate to dashboard", async () => {
    mockApiCall.post.mockResolvedValueOnce({
      data: {
        access_token: "valid-jwt-token",
        refresh_token: "valid-refresh-token",
      },
    });

    render(<AuthLoginSection />);

    const userInput = await screen.findByTestId("input-username");
    const passInput = await screen.findByTestId("input-password");

    fireEvent.change(userInput, { target: { value: "academic-user" } });
    fireEvent.change(passInput, { target: { value: "password123" } });

    const submitBtn = await screen.findByTestId("animated-button");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });

    expect(mockApiCall.post).toHaveBeenCalledWith(
      "/login",
      expect.any(FormData)
    );

    // Verify localStorage / sessionStorage saves
    expect(sessionStorage.getItem("access_token")).toBe("valid-jwt-token");
    expect(sessionStorage.getItem("refresh_token")).toBe("valid-refresh-token");
    expect(sessionStorage.getItem("access_token_exp")).toBe("1812345678");

    // Verify Cookie set call
    expect(document.cookie).toContain("access_token=valid-jwt-token");
  });

  it("should handle invalid credentials error response", async () => {
    mockApiCall.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { code: "Account.InvalidCredential" },
      },
    });

    render(<AuthLoginSection />);

    const userInput = await screen.findByTestId("input-username");
    const passInput = await screen.findByTestId("input-password");

    fireEvent.change(userInput, {
      target: { value: "user" },
    });
    fireEvent.change(passInput, {
      target: { value: "wrong" },
    });

    const submitBtn = await screen.findByTestId("animated-button");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(pushToastMock).toHaveBeenCalledWith("username / password tidak valid");
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should render dynamic validation errors returned from the server", async () => {
    mockApiCall.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          code: "User.Validation",
          message: {
            username: "Username tidak terdaftar di database",
            password: "Kata sandi salah",
          },
        },
      },
    });

    render(<AuthLoginSection />);

    const userInput = await screen.findByTestId("input-username");
    const passInput = await screen.findByTestId("input-password");

    fireEvent.change(userInput, {
      target: { value: "user" },
    });
    fireEvent.change(passInput, {
      target: { value: "wrong" },
    });

    const submitBtn = await screen.findByTestId("animated-button");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Username tidak terdaftar di database")).toBeDefined();
      expect(screen.getByText("Kata sandi salah")).toBeDefined();
    });
  });

  it("should handle offline connection/missing error response safely", async () => {
    mockApiCall.post.mockRejectedValueOnce(new Error("Network Error"));

    render(<AuthLoginSection />);

    const userInput = await screen.findByTestId("input-username");
    const passInput = await screen.findByTestId("input-password");

    fireEvent.change(userInput, {
      target: { value: "user" },
    });
    fireEvent.change(passInput, {
      target: { value: "pass" },
    });

    const submitBtn = await screen.findByTestId("animated-button");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(pushToastMock).toHaveBeenCalledWith("Ada masalah pada server");
    });
  });

  it("should handle Cloudflare status blocking exceptions", async () => {
    mockApiCall.post.mockRejectedValueOnce({
      response: {
        status: 502,
        data: {},
      },
    });

    render(<AuthLoginSection />);

    const userInput = await screen.findByTestId("input-username");
    const passInput = await screen.findByTestId("input-password");

    fireEvent.change(userInput, {
      target: { value: "user" },
    });
    fireEvent.change(passInput, {
      target: { value: "pass" },
    });

    const submitBtn = await screen.findByTestId("animated-button");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(pushToastMock).toHaveBeenCalledWith("CF Bad Gateway");
    });
  });

  describe("Session expirations and reasons alerts via query parameters", () => {
    const testCases = [
      { code: "Ex", message: "Sesi login berakhir" },
      { code: "E0", message: "Terjadi masalah pada session Anda." },
      { code: "E1", message: "Tidak dapat mengambil informasi akun." },
      { code: "F0", message: "Akun Anda tidak memiliki akses ke sistem ini." },
    ];

    testCases.forEach(({ code, message }) => {
      it(`should display "${message}" when parameter r is "${code}"`, async () => {
        mockGet.mockReturnValueOnce(code);
        sessionStorage.setItem("dummy", "value");

        render(<AuthLoginSection />);

        // Wait for rendering to settle
        await screen.findByTestId("animated-button");

        expect(pushToastMock).toHaveBeenCalledWith(message);
        expect(sessionStorage.getItem("dummy")).toBeNull(); // Storage cleared
        expect(window.history.replaceState).toHaveBeenCalled();
      });
    });
  });
});
