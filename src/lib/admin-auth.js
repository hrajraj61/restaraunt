import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readSessionFromCookies } from "./admin-store.js";

export async function requireAdminPageSession() {
  const cookieStore = await cookies();
  return readSessionFromCookies(cookieStore);
}

export async function requireAdminApiSession() {
  const cookieStore = await cookies();
  const session = readSessionFromCookies(cookieStore);

  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    };
  }

  return { ok: true, session };
}
