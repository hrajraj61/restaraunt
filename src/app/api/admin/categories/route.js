import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../lib/admin-auth";
import { createCategory } from "../../../../lib/admin-store";

export async function POST(request) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const category = await createCategory(body);
    return NextResponse.json({ ok: true, category });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to create category" }, { status: 400 });
  }
}
