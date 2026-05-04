import { NextRequest, NextResponse } from "next/server";

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

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-chip", nonce);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // CSP header with nonce
  res.headers.set(
    "Content-Security-Policy",
    `
      default-src 'self';
      script-src 'nonce-${nonce}' 'strict-dynamic';
      style-src 'nonce-${nonce}' https://fonts.googleapis.com;
      font-src https://fonts.gstatic.com;
      img-src 
        'self'
        data:
        blob:
        https:;
      connect-src 'self' https://stagging-api-simonev-lpm.unpak.ac.id;
      object-src 'none';
      base-uri 'none';
      form-action 'self';
      manifest-src 'self';
      media-src 'self';
      worker-src 'self' blob:;
      frame-ancestors 'none';
      require-trusted-types-for 'script';
      upgrade-insecure-requests;
      report-uri /api/report;
      trusted-types nextjs;
    `
      .replace(/\s{2,}/g, " ")
      .trim()
  );

  const url = req.nextUrl;
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  // ❌ 1. Block sensitive routes
  if (BLOCKED_PATHS.some((p) => url.pathname.startsWith(p))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // ❌ 2. Block fuzzing tools (UA)
  if (BLOCKED_UA_PATTERNS.some((r) => r.test(ua))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // ❌ 3. Missing browser fingerprint (basic bot indicator)
  const secFetchSite = req.headers.get("sec-fetch-site");
  const secFetchMode = req.headers.get("sec-fetch-mode");

  if (!secFetchSite || !secFetchMode) {
    return new NextResponse("Blocked", { status: 403 });
  }

  const suspicious =
    (req.headers.get("transfer-encoding") || "")
      .toLowerCase()
      .includes("chunked") && req.headers.get("content-length") !== null;

  if (suspicious) {
    return new NextResponse("Smuggling Blocked", {
      status: 400,
    });
  }

  // ❌ 4. CSRF / Origin validation (non-GET only)
  if (req.method !== "GET") {
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return new NextResponse("CSRF Blocked", { status: 403 });
    }
  }

  // ❌ 5. RSC abuse protection (_rsc fuzzing)
  if (url.searchParams.has("_rsc")) {
    const isSameOrigin =
      (referer && referer.startsWith(`http://${url.host}`)) ||
      (referer && referer.startsWith(`https://${url.host}`));

    if (!isSameOrigin) {
      return new NextResponse("Blocked", { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
