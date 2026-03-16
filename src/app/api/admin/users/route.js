import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../lib/admin-auth";
import { createUser } from "../../../../lib/admin-store";

export async function POST(request) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    await createUser(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to create user" }, { status: 400 });
  }
}
