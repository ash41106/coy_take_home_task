import { NextResponse } from "next/server";
import { mutate, publicProfile } from "@/lib/db";
import { parseSwipe } from "@/lib/validate";

// POST /api/swipe { profileId, action: "like" | "pass" | "super" }
export async function POST(req) {
  const body = await req.json().catch(() => null);
  const parsed = parseSwipe(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { profileId, action } = parsed.value;

  // Serialised transaction: concurrent swipes cannot lose updates or double-match.
  const result = await mutate((db) => {
    const p = db.profiles.find((x) => x.id === profileId);
    if (!p) return { status: 404, body: { error: "profile not found" } };

    // Idempotent: a profile can only be swiped once (never reappears, never double-matches).
    if (db.swipes[p.id]) {
      const existing = db.matches.some((m) => m.profileId === p.id);
      return { status: 200, body: { recorded: false, match: existing, profile: existing ? publicProfile(p) : undefined } };
    }
    db.swipes[p.id] = action;
    const match = action !== "pass" && p.likedMe;
    if (match) db.matches.push({ profileId: p.id, at: Date.now() });
    // Only a mutual like discloses anything about the other side.
    return { status: 200, body: { recorded: true, match, profile: match ? publicProfile(p) : undefined } };
  });
  return NextResponse.json(result.body, { status: result.status });
}
