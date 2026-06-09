import { vi } from "vitest";
import React from "react";

// ========================================================
// ROUTER & NAVIGATION MOCK
// ========================================================
export const mockPush = vi.fn();
export const mockGet = vi.fn().mockReturnValue(null);
export const mockPathname = vi.fn().mockReturnValue("/");
export const mockRedirect = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
  usePathname: () => mockPathname(),
  redirect: (url: string) => mockRedirect(url),
}));

export const mockGetCookie = vi.fn();
vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockGetCookie,
  }),
}));

vi.mock("next/image", () => ({
  default: (props: any) => {
    const { fill, ...rest } = props;
    return <img {...rest} />;
  },
}));

// ========================================================
// WINDOW.LOCATION REDIRECT MOCK
// ========================================================
const mockLocation = {
  href: "",
};
if (typeof window !== "undefined") {
  const originalLocation = window.location;
  delete (window as any).location;
  window.location = {
    ...originalLocation,
    set href(val: string) {
      mockLocation.href = val;
    },
    get href() {
      return mockLocation.href;
    },
  } as any;
}
export { mockLocation };

// ========================================================
// CKEDITOR MOCK
// ========================================================
vi.mock("@ckeditor/ckeditor5-react", () => {
  return {
    CKEditor: ({ data, onChange, placeholder }: any) => {
      return (
        <textarea
          data-testid="mock-ckeditor"
          placeholder={placeholder}
          value={data || ""}
          onChange={(e) => {
            if (onChange) {
              onChange(null, {
                getData: () => e.target.value,
              });
            }
          }}
        />
      );
    },
  };
});

vi.mock("ckeditor5", () => {
  return {
    ClassicEditor: {},
    Bold: {},
    Italic: {},
    Essentials: {},
    Paragraph: {},
    List: {},
    BlockQuote: {},
    Undo: {},
  };
});

// ========================================================
// CLIPBOARD API MOCK
// ========================================================
export const mockWriteText = vi.fn().mockResolvedValue(undefined);
if (typeof navigator !== "undefined") {
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: mockWriteText,
    },
    writable: true,
    configurable: true,
  });
}

// ========================================================
// COOKIE MOCK
// ========================================================
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

// ========================================================
// AXIOS MOCK
// ========================================================
export const mockAxios = {
  create: vi.fn().mockReturnThis(),
  interceptors: {
    request: { use: vi.fn(), eject: vi.fn() },
    response: { use: vi.fn(), eject: vi.fn() },
  },
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock("axios", () => ({
  default: mockAxios,
}));
