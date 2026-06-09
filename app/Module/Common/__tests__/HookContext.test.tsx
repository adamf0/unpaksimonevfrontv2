import "./mocks/apiMocks";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { ToastProvider, useToast } from "../Context/ToastContext";
import { useTokenWatcher } from "../Hook/tokenWatcher";
import { mockLocation, mockWriteText } from "./mocks/apiMocks";
import getTokenExpiry from "../Service/tokenExpiry";

// Helper component to trigger toasts
function ToastTester() {
  const { pushToast } = useToast();
  return <button onClick={() => pushToast("Halo Dunia")} data-testid="toast-trigger">Show Toast</button>;
}

// Helper component to run TokenWatcher hook
function TokenWatcherTester() {
  useTokenWatcher();
  return <div data-testid="watcher-loaded">Watcher Active</div>;
}

// Mock tokenExpiry inside tests
vi.mock("../Service/tokenExpiry", () => ({
  default: vi.fn().mockImplementation((token: string) => {
    if (token === "valid-refresh-token") return 1812345678; // static expiry
    return null;
  }),
}));

describe("ToastContext System", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should throw error if useToast is called outside Provider", () => {
    // Suppress console.error inside testing logs
    const consoleErrSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    expect(() => render(<ToastTester />)).toThrow("useToast must be used inside ToastProvider");
    
    consoleErrSpy.mockRestore();
  });

  it("should mount and push toast to document.body, then auto-dismiss", () => {
    render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );

    const btn = screen.getByTestId("toast-trigger");
    fireEvent.click(btn);

    // Toast should be rendered in document body
    expect(screen.getByText("Halo Dunia")).toBeDefined();

    // Advance timers by 3000ms
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Toast should be dismissed
    expect(screen.queryByText("Halo Dunia")).toBeNull();
  });
});

describe("useTokenWatcher Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    mockLocation.href = "";
    if (typeof document !== "undefined") {
      document.cookie = "";
    }
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should do nothing if tokens are missing in sessionStorage", () => {
    render(<TokenWatcherTester />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockLocation.href).toBe("");
  });

  it("should do nothing if token is not close to expiry", () => {
    const farFuture = Date.now() + 60000; // 60 seconds
    sessionStorage.setItem("access_token", "active-token");
    sessionStorage.setItem("access_token_exp", farFuture.toString());

    render(<TokenWatcherTester />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockLocation.href).toBe("");
    expect(sessionStorage.getItem("access_token")).toBe("active-token");
  });

  it("should swap access_token with refresh_token if close to expiry", () => {
    const nearFuture = Date.now() + 15000; // 15 seconds in future (< 30s)
    sessionStorage.setItem("access_token", "expiring-token");
    sessionStorage.setItem("access_token_exp", nearFuture.toString());
    sessionStorage.setItem("refresh_token", "valid-refresh-token");

    render(<TokenWatcherTester />);

    // Trigger timer interval
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Verify swap
    expect(sessionStorage.getItem("access_token")).toBe("valid-refresh-token");
    expect(sessionStorage.getItem("refresh_token")).toBeNull(); // removed
    expect(sessionStorage.getItem("access_token_exp")).toBe("1812345678"); // new decoded exp
    expect(document.cookie).toContain("access_token=valid-refresh-token");
  });

  it("should clear session and redirect to logout if token swap decoding fails", () => {
    const nearFuture = Date.now() + 15000; // 15 seconds
    sessionStorage.setItem("access_token", "expiring-token");
    sessionStorage.setItem("access_token_exp", nearFuture.toString());
    sessionStorage.setItem("refresh_token", "invalid-token"); // tokenExpiry returns null for this

    render(<TokenWatcherTester />);

    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(sessionStorage.getItem("access_token")).toBeNull(); // cleared
    expect(mockLocation.href).toBe("/action/logout?r=E00");

    errSpy.mockRestore();
  });

  it("should clear session and redirect to logout if expired without a refresh token", () => {
    const pastTime = Date.now() - 5000; // 5 seconds expired
    sessionStorage.setItem("access_token", "expired-token");
    sessionStorage.setItem("access_token_exp", pastTime.toString());
    // no refresh token

    render(<TokenWatcherTester />);

    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(sessionStorage.getItem("access_token")).toBeNull(); // cleared
    expect(mockLocation.href).toBe("/action/logout?r=E00");

    warnSpy.mockRestore();
  });
});
