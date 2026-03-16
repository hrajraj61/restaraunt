import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../lib/admin-auth";
import { getDashboardSnapshot } from "../../../../lib/admin-store";

export async function GET() {
  const auth = await requireAdminApiSession();
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const data = await getDashboardSnapshot();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to load dashboard" }, { status: 500 });
  }
}
