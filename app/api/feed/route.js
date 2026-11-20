import { NextResponse } from "next/server";
import { read, publicProfile, hash } from "@/lib/db";
import { parseFeedQuery } from "@/lib/validate";

export const dynamic = "force-dynamic";

// GET /api/feed?minAge=&maxAge=&city=  -> profiles the user has NOT swiped on
export async function GET(req) {
  const parsed = parseFeedQuery(new URL(req.url).searchParams);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { minAge, maxAge, city } = parsed.value;
  const db = read();
  const profiles = db.profiles
    .filter((p) => !db.swipes[p.id])
    .filter((p) => p.age >= minAge && p.age <= maxAge)
    .filter((p) => city === "all" || p.city === city)
    .sort((a, b) => hash("coy" + a.id) - hash("coy" + b.id))
    .map(publicProfile);
  const cities = [...new Set(db.profiles.map((p) => p.city))].sort();
  return NextResponse.json({ profiles, remaining: profiles.length, cities });
}
