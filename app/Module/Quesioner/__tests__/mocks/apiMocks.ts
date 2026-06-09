import { vi } from "vitest";

// ========================================================
// AXIOS / API CALL MOCK
// ========================================================
export const mockApiCall = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn(), eject: vi.fn() },
    response: { use: vi.fn(), eject: vi.fn() },
  },
};

// Mock the APICall module relative to the hooks
vi.mock("../../Common/External/APICall", () => ({
  default: mockApiCall,
}));

// Mock the APICall module relative to components
vi.mock("../../../Common/External/APICall", () => ({
  default: mockApiCall,
}));
