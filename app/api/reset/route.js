import { NextResponse } from "next/server";
import { reset } from "@/lib/db";

// POST /api/reset – restore demo data (clears swipes, matches, messages)
export async function POST() {
  reset();
  return NextResponse.json({ ok: true });
}
