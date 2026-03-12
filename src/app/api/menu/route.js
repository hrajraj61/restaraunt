import { NextResponse } from "next/server";
import { getMenuStore } from "../../../lib/menu-backend";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    menu: getMenuStore()
  });
}
