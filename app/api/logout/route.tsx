import { NextResponse } from "next/server";

function clearAuthCookies(res: NextResponse) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };

  res.cookies.set("access_token", "", cookieOptions);
  res.cookies.set("refresh_token", "", cookieOptions);
}

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/login", req.url));

  clearAuthCookies(res);

  return res;
}