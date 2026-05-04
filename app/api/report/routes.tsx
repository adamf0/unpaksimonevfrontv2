import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("🚨 CSP VIOLATION:", JSON.stringify(body, null, 2));

    return new Response(null, { status: 204 });
  } catch (e) {
    return new Response(null, { status: 400 });
  }
}