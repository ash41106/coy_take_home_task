import { NextResponse } from "next/server";
import { read, mutate, publicProfile } from "@/lib/db";
import { parseId } from "@/lib/validate";

export const dynamic = "force-dynamic";

// GET /api/matches -> mutual matches only (newest first)
export async function GET() {
  const db = read();
  const now = Date.now();
  const matches = db.matches
    .map((m) => {
      const p = db.profiles.find((x) => x.id === m.profileId);
      const msgs = (db.messages[m.profileId] || []).filter((x) => x.at <= now);
      return { ...publicProfile(p), matchedAt: m.at, lastMessage: msgs.at(-1)?.text || null };
    })
    .sort((a, b) => b.matchedAt - a.matchedAt);
  return NextResponse.json({ matches });
}

// DELETE /api/matches?id=p01 -> unmatch (profile stays swiped, never returns to feed)
export async function DELETE(req) {
  const parsed = parseId(new URL(req.url).searchParams.get("id"));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  await mutate((db) => {
    db.matches = db.matches.filter((m) => m.profileId !== parsed.value);
    delete db.messages[parsed.value];
  });
  return NextResponse.json({ ok: true });
}
