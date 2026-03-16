import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../lib/admin-auth";
import { createItem } from "../../../../lib/admin-store";

export async function POST(request) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    await createItem(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to create item" }, { status: 400 });
  }
}
