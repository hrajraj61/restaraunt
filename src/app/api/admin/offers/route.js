import { NextResponse } from "next/server";
import { requireAdminApiSession } from "../../../../lib/admin-auth";
import { getOffers, createOffer } from "../../../../lib/admin-store";

export async function GET() {
  const auth = await requireAdminApiSession();
  if (!auth.ok) return auth.response;

  try {
    const offers = await getOffers();
    return NextResponse.json({ ok: true, offers });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to load offers" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdminApiSession();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const offer = await createOffer(body);
    return NextResponse.json({ ok: true, offer });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unable to create offer" }, { status: 400 });
  }
}
