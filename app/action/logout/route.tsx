import { NextResponse } from "next/server";

function clearAuthCookies(res: NextResponse) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  };

  res.cookies.set("access_token", "", cookieOptions);
  res.cookies.set("refresh_token", "", cookieOptions);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const reason = url.searchParams.get("r");

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:4000";

  const loginUrl = new URL("/login", baseUrl);

  if (reason) {
    loginUrl.searchParams.set("r", reason);
  }

  const res = NextResponse.redirect(loginUrl);

  clearAuthCookies(res);

  return res;
}