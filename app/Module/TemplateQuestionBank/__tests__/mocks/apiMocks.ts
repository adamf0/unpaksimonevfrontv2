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

// Mock the APICall module relative to components/organisms
vi.mock("../../../Common/External/APICall", () => ({
  default: mockApiCall,
}));

// Mock the APICall module relative to sub-folders if resolved from other levels
vi.mock("../../../../Common/External/APICall", () => ({
  default: mockApiCall,
}));

// ========================================================
// SERVER-SENT EVENTS (SSE) EVENTSOURCE MOCK
// ========================================================
export class MockEventSource {
  url: string;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  readyState: number = 0; // 0 = CONNECTING, 1 = OPEN, 2 = CLOSED

  static instances: MockEventSource[] = [];

  constructor(url: string) {
    this.url = url;
    this.readyState = 0;
    MockEventSource.instances.push(this);
  }

  close() {
    this.readyState = 2;
  }

  static clear() {
    MockEventSource.instances = [];
  }

  // Simulation helpers for unit tests
  emitStart() {
    this.readyState = 1;
    if (this.onmessage) {
      this.onmessage({ data: "start" });
    }
  }

  emitData(data: any) {
    this.readyState = 1;
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) });
    }
  }

  emitDone() {
    this.readyState = 1;
    if (this.onmessage) {
      this.onmessage({ data: "done" });
    }
  }

  emitError() {
    this.readyState = 2;
    if (this.onerror) {
      this.onerror();
    }
  }
}

// Attach MockEventSource globally during test runs
global.EventSource = MockEventSource as any;
