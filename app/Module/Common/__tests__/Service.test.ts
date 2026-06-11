import { mockAxios } from "./mocks/apiMocks";
import apiCall from "../External/APICall";
import { describe, it, expect, vi } from "vitest";
import { isEmpty, toNumber, cn } from "../Service/utility";
import { clipCreatedBy } from "../Service/clipData";
import getTokenExpiry from "../Service/tokenExpiry";
import { handleCloudflareError, isHtmlResponse, isHtmlResponseByHeader } from "../Error/axiosErrorHandler";

describe("Utility services - isEmpty", () => {
  it("should detect null and undefined as empty", () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it("should detect uuid zeroes as empty", () => {
    expect(isEmpty("00000000-0000-0000-0000-000000000000")).toBe(true);
  });

  it("should detect empty or whitespace strings as empty", () => {
    expect(isEmpty("")).toBe(true);
    expect(isEmpty("   ")).toBe(true);
    expect(isEmpty("John")).toBe(false);
  });

  it("should detect zero or negative numbers as empty", () => {
    expect(isEmpty(0)).toBe(true);
    expect(isEmpty(-5)).toBe(true);
    expect(isEmpty(10)).toBe(false);
  });

  it("should detect empty arrays as empty", () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([1])).toBe(false);
  });

  it("should detect empty objects as empty", () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});

describe("Utility services - toNumber", () => {
  it("should parse standard string numbers", () => {
    expect(toNumber("123")).toBe(123);
    expect(toNumber(55)).toBe(55);
  });

  it("should fallback to 0 for invalid numbers", () => {
    expect(toNumber(NaN)).toBe(0);
    expect(toNumber("not-a-number")).toBe(0);
    expect(toNumber(undefined)).toBe(0);
  });
});

describe("Utility services - cn", () => {
  it("should merge and resolve tailwind classnames", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
    expect(cn("p-4 p-2")).toBe("p-2"); // tailwind-merge resolves overlaps
  });
});

describe("clipData service", () => {
  it("should format created info for prodi role", () => {
    const data = { Role: "prodi", NamaFakultas: "Teknik", NamaProdi: "Ilmu Komputer" };
    expect(clipCreatedBy(data)).toBe("Fakultas Teknik | Prodi Ilmu Komputer");
  });

  it("should format created info for fakultas role", () => {
    const data = { Role: "fakultas", NamaFakultas: "Teknik" };
    expect(clipCreatedBy(data)).toBe("Fakultas Teknik");
  });

  it("should fallback to Admin LPM for other roles", () => {
    const data = { Role: "admin", NamaFakultas: "Teknik" };
    expect(clipCreatedBy(data)).toBe("Admin LPM");
  });
});

describe("tokenExpiry service", () => {
  it("should decode standard JWT tokens and parse expiration", () => {
    const testHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    const testPayload = "eyJleHAiOjE4MTIzNDU2NzgsInVzZXIiOiJ0ZXN0In0"; // exp = 1812345678
    const testSignature = "sig";
    const token = `${testHeader}.${testPayload}.${testSignature}`;

    const exp = getTokenExpiry(token);
    expect(exp).toBe(1812345678 * 1000);
  });

  it("should handle missing padding corrections inside payload base64url decoding", () => {
    // payload without standard base64 padding (length % 4 != 0)
    const testHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    // base64: "eyJleHAiOjE4MTIzNDU2Nzh9" has length 24, padding % 4 == 0. Let's make a payload that needs padding
    // {"exp":1} -> "eyJleHAiOjF9" (length 12)
    // {"exp":10} -> "eyJleHAiOjEwfQ" (length 14, needs 2 padding characters '==')
    const testPayload = "eyJleHAiOjEwfQ"; // no padding
    const token = `${testHeader}.${testPayload}.sig`;

    const exp = getTokenExpiry(token);
    expect(exp).toBe(10 * 1000);
  });

  it("should return null for empty/invalid token layouts", () => {
    expect(getTokenExpiry("")).toBeNull();
    expect(getTokenExpiry("not.valid")).toBeNull();
    expect(getTokenExpiry("invalid-format-total")).toBeNull();
  });

  it("should handle payloads that do not require base64 padding", () => {
    const testHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    // base64 of {"exp":1000000} -> length 20 (no padding needed)
    const testPayload = "eyJleHAiOjEwMDAwMDB9";
    const token = `${testHeader}.${testPayload}.sig`;
    const exp = getTokenExpiry(token);
    expect(exp).toBe(1000000 * 1000);
  });

  it("should return null if exp property is missing in payload", () => {
    const testHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
    // base64 of {"user":"test"} -> length 20 (no padding needed)
    const testPayload = "eyJ1c2VyIjoidGVzdCJ9";
    const token = `${testHeader}.${testPayload}.sig`;
    const exp = getTokenExpiry(token);
    expect(exp).toBeNull();
  });

  it("should catch base64 decode errors and return null", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = getTokenExpiry("header.invalidBase64!!@@.signature");
    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe("axiosErrorHandler helper", () => {
  it("should map Cloudflare status codes to strings", () => {
    expect(handleCloudflareError(520)).toContain("520");
    expect(handleCloudflareError(521)).toContain("Web Server Down");
    expect(handleCloudflareError(522)).toContain("Connection Timed Out");
    expect(handleCloudflareError(523)).toContain("Origin Unreachable");
    expect(handleCloudflareError(524)).toContain("Timeout Occurred");
    expect(handleCloudflareError(525)).toContain("SSL Handshake Failed");
    expect(handleCloudflareError(526)).toContain("Invalid SSL Certificate");
  });

  it("should return null for standard HTTP codes", () => {
    expect(handleCloudflareError(404)).toBeNull();
    expect(handleCloudflareError(500)).toBeNull();
  });

  it("should identify text response formats", () => {
    expect(isHtmlResponse("<html>")).toBe(true);
    expect(isHtmlResponse({})).toBe(false);
  });

  it("should examine headers content-type", () => {
    expect(isHtmlResponseByHeader({ "content-type": "text/html" })).toBe(true);
    expect(isHtmlResponseByHeader({ "content-type": "application/json" })).toBe(false);
    expect(isHtmlResponseByHeader(null)).toBeFalsy();
    expect(isHtmlResponseByHeader(undefined)).toBeFalsy();
    expect(isHtmlResponseByHeader({})).toBeFalsy();
  });
});

describe("APICall interceptors", () => {
  it("should setup interceptors and handle request success/error callbacks", async () => {
    expect(apiCall).toBeDefined();
    const [requestSuccess, requestError] = mockAxios.interceptors.request.use.mock.calls[0];

    // 1. Success callback without token and without abort signal
    const config1: any = { headers: {} };
    sessionStorage.clear();
    const res1 = requestSuccess(config1);
    expect(res1.headers.Authorization).toBeUndefined();
    expect(res1.signal).toBeDefined();
    expect(res1.__abortController).toBeDefined();

    // 2. Success callback with token
    sessionStorage.setItem("access_token", "test-token-123");
    const config2: any = { headers: {} };
    const res2 = requestSuccess(config2);
    expect(res2.headers.Authorization).toBe("Bearer test-token-123");

    // 3. Success callback when signal is already defined
    const dummySignal = {} as any;
    const config3: any = { headers: {}, signal: dummySignal };
    const res3 = requestSuccess(config3);
    expect(res3.signal).toBe(dummySignal);
    expect(res3.__abortController).toBeUndefined();

    // 4. Error callback
    const dummyError = new Error("request error");
    await expect(requestError(dummyError)).rejects.toThrow("request error");
  });
});
