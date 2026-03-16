import { NextResponse } from "next/server";
import { clearSessionCookie } from "../../../../lib/admin-store";

export async function POST() {
  const cookie = clearSessionCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
