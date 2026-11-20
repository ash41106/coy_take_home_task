import { NextResponse } from "next/server";
import { read, mutate } from "@/lib/db";
import { parseId, parseMessage } from "@/lib/validate";

export const dynamic = "force-dynamic";
const REPLIES = ["Haha, I love that 😄", "Okay you've got my attention 👀", "Tell me more!", "That made my day 💕", "Coffee this weekend?"];

const isMatch = (db, id) => db.matches.some((m) => m.profileId === id);

// GET /api/messages?id=p01
export async function GET(req) {
  const parsed = parseId(new URL(req.url).searchParams.get("id"));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const db = read();
  if (!isMatch(db, parsed.value)) return NextResponse.json({ error: "not a match" }, { status: 403 });
  const now = Date.now();
  return NextResponse.json({ messages: (db.messages[parsed.value] || []).filter((m) => m.at <= now) });
}

// POST /api/messages { profileId, text } – only allowed with mutual matches
export async function POST(req) {
  const parsed = parseMessage(await req.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { profileId, text } = parsed.value;
  const ok = await mutate((db) => {
    if (!isMatch(db, profileId)) return false;
    const list = (db.messages[profileId] ||= []);
    const now = Date.now();
    list.push({ from: "me", text, at: now });
    list.push({ from: "them", text: REPLIES[now % REPLIES.length], at: now + 1800 }); // delayed demo reply
    return true;
  });
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not a match" }, { status: 403 });
}
