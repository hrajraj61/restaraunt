import { NextResponse } from "next/server";
import { authenticateAdmin, buildSessionCookie } from "../../../../lib/admin-store";

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await authenticateAdmin(body.username || "", body.password || "");

    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const cookie = buildSessionCookie(user);
    const response = NextResponse.json({ ok: true, user: { id: user.id, username: user.username, role: user.role } });
    response.cookies.set(cookie.name, cookie.value, cookie.options);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
  }
}
