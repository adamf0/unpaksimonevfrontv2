import { vi } from "vitest";

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

global.EventSource = MockEventSource as any;

// ========================================================
// READABLESTREAM FETCH MOCK HELPERS
// ========================================================
export function mockFetchStreamResponse(chunks: string[]) {
  let index = 0;
  const encoder = new TextEncoder();

  const mockReader = {
    read: vi.fn().mockImplementation(() => {
      if (index >= chunks.length) {
        return Promise.resolve({ value: undefined, done: true });
      }
      const val = chunks[index++];
      return Promise.resolve({ value: encoder.encode(val), done: false });
    }),
  };

  const mockStream = {
    getReader: () => mockReader,
  };

  return {
    ok: true,
    body: mockStream,
  };
}

// ========================================================
// EXCELJS LIBRARY MOCK
// ========================================================
export const mockWorksheet = {
  columns: [] as any[],
  addRow: vi.fn(),
  getRow: vi.fn().mockReturnValue({ font: {} }),
  mergeCells: vi.fn(),
  eachRow: vi.fn().mockImplementation((cb) => {
    cb({ eachCell: (cellCb: any) => cellCb({ alignment: {}, border: {} }) });
  }),
};

export const mockWorkbook = {
  addWorksheet: vi.fn().mockReturnValue(mockWorksheet),
  xlsx: {
    writeBuffer: vi.fn().mockResolvedValue(Buffer.from("mock-excel-binary")),
  },
};

// Constructible ES6 Class Mock
export class MockWorkbookClass {
  addWorksheet = mockWorkbook.addWorksheet;
  xlsx = mockWorkbook.xlsx;
}

vi.mock("exceljs", () => {
  return {
    default: {
      Workbook: MockWorkbookClass,
    },
  };
});

// Mock URL helper globals
global.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-excel-file");
global.URL.revokeObjectURL = vi.fn();
