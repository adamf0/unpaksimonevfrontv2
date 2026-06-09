import { vi } from "vitest";

// ========================================================
// ROUTER AND SEARCH PARAMS MOCK
// ========================================================
export const mockPush = vi.fn();
export const mockGet = vi.fn().mockReturnValue(null);

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// ========================================================
// API CALL AXIOS MOCK
// ========================================================
export const mockApiCall = {
  post: vi.fn(),
};

vi.mock("../../Common/External/APICall", () => ({
  default: mockApiCall,
}));

vi.mock("../../../Common/External/APICall", () => ({
  default: mockApiCall,
}));

// ========================================================
// TOKEN EXPIRY MOCK
// ========================================================
export const mockGetTokenExpiry = vi.fn().mockReturnValue(1812345678);

vi.mock("../../Common/Service/tokenExpiry", () => ({
  default: mockGetTokenExpiry,
}));

vi.mock("../../../Common/Service/tokenExpiry", () => ({
  default: mockGetTokenExpiry,
}));

// Mock window.history.replaceState
if (typeof window !== "undefined") {
  window.history.replaceState = vi.fn();
}

// Mock document.cookie
if (typeof document !== "undefined") {
  let cookies = "";
  Object.defineProperty(document, "cookie", {
    get: () => cookies,
    set: (val: string) => {
      cookies = val;
    },
    configurable: true,
  });
}
