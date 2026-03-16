import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../../lib/admin-auth";
import { deleteItem, updateItem } from "../../../../../lib/admin-store";

export async function PATCH(request, context) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    await updateItem(context.params.id, body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to update item" }, { status: 400 });
  }
}

export async function DELETE(_request, context) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    await deleteItem(context.params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to delete item" }, { status: 400 });
  }
}
