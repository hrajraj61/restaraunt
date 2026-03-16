import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../../lib/admin-auth";
import { deleteUser, updateUser } from "../../../../../lib/admin-store";

export async function PATCH(request, context) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await request.json();
    await updateUser(context.params.id, body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to update user" }, { status: 400 });
  }
}

export async function DELETE(_request, context) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    await deleteUser(context.params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to delete user" }, { status: 400 });
  }
}
