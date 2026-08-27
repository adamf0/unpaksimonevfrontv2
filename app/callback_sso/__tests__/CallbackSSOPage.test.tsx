import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import CallbackSSOPage from "../page";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

const mockInit = vi.fn();
let mockKeycloakInstance: any = null;

vi.mock("../../Module/Common/Service/keycloak", () => ({
  default: () => mockKeycloakInstance,
}));

vi.mock("../../Module/Common/Service/tokenExpiry", () => ({
  default: vi.fn().mockReturnValue(1812345678),
}));

describe("CallbackSSOPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    if (typeof document !== "undefined") {
      document.cookie = "";
    }
  });

  it("should handle successful SSO authentication, save tokens, and redirect to dashboard", async () => {
    mockKeycloakInstance = {
      init: mockInit.mockResolvedValue(true),
      token: "sso-jwt-access-token",
      refreshToken: "sso-jwt-refresh-token",
      idToken: "sso-jwt-id-token",
    };

    render(<CallbackSSOPage />);

    expect(screen.getByText("Processing SSO Login...")).toBeDefined();

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });

    expect(sessionStorage.getItem("access_token")).toBe("sso-jwt-access-token");
    expect(sessionStorage.getItem("refresh_token")).toBe("sso-jwt-refresh-token");
    expect(sessionStorage.getItem("id_token")).toBe("sso-jwt-id-token");
    expect(sessionStorage.getItem("access_token_exp")).toBe("1812345678");
    expect(document.cookie).toContain("access_token=sso-jwt-access-token");
  });

  it("should redirect to /login?r=F0 if authentication fails or token is missing", async () => {
    mockKeycloakInstance = {
      init: mockInit.mockResolvedValue(false),
      token: null,
    };

    render(<CallbackSSOPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login?r=F0");
    });
  });

  it("should redirect to /login?r=E0 if keycloak init throws error", async () => {
    mockKeycloakInstance = {
      init: mockInit.mockRejectedValue(new Error("Init error")),
    };

    render(<CallbackSSOPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login?r=E0");
    });
  });
});
