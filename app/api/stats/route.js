import { NextResponse } from "next/server";
import { read } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/stats -> the user's own activity counters (reveals nothing about others' likes)
export async function GET() {
  const db = read();
  const acts = Object.values(db.swipes);
  return NextResponse.json({
    liked: acts.filter((a) => a !== "pass").length,
    passed: acts.filter((a) => a === "pass").length,
    matches: db.matches.length,
    remaining: db.profiles.length - acts.length,
  });
}
