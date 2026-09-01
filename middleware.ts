import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/callback",
  "/callback_sso",
  "/action/logout",
  "/quesioner",
  "/api",
  "/_next",
  "/favicon.ico",
  "/assets",
];

const BLOCKED_UA_PATTERNS = [
  /curl/i,
  /wget/i,
  /python-requests/i,
  /sqlmap/i,
  /ffuf/i,
  /feroxbuster/i,
  /gobuster/i,
  /dirbuster/i,
  /dirb/i,
  /dalfox/i,
  /xsstrike/i,
  /nuclei/i,
  /burpsuite/i,
  /sqlninja/i,
  /httpclient/i,
  /okhttp/i,
  /headlesschrome/i,
  /phantomjs/i,
  /puppeteer/i,
  /playwright/i,
];

const BLOCKED_PATHS = ["/api/debug", "/admin/internal", "/.env", "/config"];

const ALLOWED_ORIGINS = new Set(
  [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4000",
    "http://127.0.0.1:4000",
    ...(process.env.ALLOWED_ORIGINS?.split(",") ?? []),
  ]
    .map((o) => o.trim())
    .filter(Boolean),
);

function generateNonce() {
  return Buffer.from(crypto.randomUUID()).toString("base64");
}

export function middleware(req: NextRequest) {
  const nonce = generateNonce();
  const url = req.nextUrl;
  const pathname = url.pathname;
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const origin = req.headers.get("origin");

  // ❌ 1. Block sensitive routes
  if (BLOCKED_PATHS.some((p) => pathname.startsWith(p))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // ❌ 2. Block fuzzing tools (UA)
  if (BLOCKED_UA_PATTERNS.some((r) => r.test(ua))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // ❌ 3. CSRF / Origin validation (non-GET only)
  if (req.method !== "GET") {
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return new NextResponse("CSRF Blocked", { status: 403 });
    }
  }

  // 🏠 Root URL redirect logic
  if (pathname === "/") {
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 🔒 AUTH GUARD FOR PROTECTED ADMIN ROUTES
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isPublicRoute) {
    const hasCtxParam = url.searchParams.has("ctx");
    const token = req.cookies.get("access_token")?.value;

    console.log("middleware.ctx: ",url.searchParams.get("ctx"))
    console.log("middleware.token: ",token)
    if (!token && !hasCtxParam) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("r", "Ex");
      return NextResponse.redirect(loginUrl);
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-chip", nonce);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
