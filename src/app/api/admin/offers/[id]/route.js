import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../../lib/admin-auth";
import { updateOffer, deleteOffer } from "../../../../../lib/admin-store";

export async function PATCH(request, context) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { id } = await context.params;
    await updateOffer(id, body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to update offer" }, { status: 400 });
  }
}

export async function DELETE(_request, context) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await context.params;
    await deleteOffer(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to delete offer" }, { status: 400 });
  }
}
