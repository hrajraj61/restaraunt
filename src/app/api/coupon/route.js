import { NextResponse } from "next/server";
import { validateCoupon } from "../../../lib/admin-store";

export async function POST(request) {
  try {
    const body = await request.json();
    const code = String(body.code || "").trim();
    if (!code) {
      return NextResponse.json({ valid: false, error: "Please enter a coupon code." }, { status: 400 });
    }
    const result = await validateCoupon(code);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ valid: false, error: "Unable to validate coupon." }, { status: 500 });
  }
}
