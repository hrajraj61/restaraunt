import { NextResponse } from "next/server";
import { getMenuStore } from "../../../lib/menu-backend";

export async function GET() {
  const menu = await getMenuStore();
  return NextResponse.json({ menu });
}
