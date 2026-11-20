// Run against a live server:  npm test   (BASE=http://localhost:3000 by default)
const BASE = process.env.BASE || "http://localhost:3000";
const raw = (p, o) => fetch(BASE + p, o);
const j = (p, o) => raw(p, o).then((r) => r.json());
const post = (p, b) => raw(p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
const postJ = (p, b) => post(p, b).then((r) => r.json());
let fails = 0;
const ok = (c, m) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; };

await postJ("/api/reset", {});

// ---------- Profile data ----------
let feed = await j("/api/feed");
ok(feed.profiles.length >= 30, `feed has ${feed.profiles.length} profiles (>=30)`);
ok(feed.profiles.every((p) => p.name && p.age && p.photo && p.bio && p.place && p.interests?.length), "profiles have name/age/photo/bio/place/interests");

// ---------- PRIVACY REGRESSION: no route may leak who liked the user ----------
const leaks = (label, obj) => ok(!JSON.stringify(obj).includes("likedMe"), `no likedMe leak: ${label}`);
leaks("GET /feed", feed);
const probe = await postJ("/api/swipe", { profileId: "p02", action: "like" }); // p02 did NOT like us
ok(probe.match === false && probe.profile === undefined, "non-mutual like reveals nothing");
leaks("POST /swipe (non-match)", probe);
const hit = await postJ("/api/swipe", { profileId: "p01", action: "like" }); // p01 DID like us
ok(hit.match === true && hit.profile?.id === "p01", "mutual like returns match + profile");
leaks("POST /swipe (match)", hit);
leaks("GET /matches", await j("/api/matches"));
leaks("GET /stats", await j("/api/stats"));
leaks("GET /messages", await j("/api/messages?id=p01"));
const none = await postJ("/api/swipe", { profileId: "p05", action: "pass" });
ok(none.match === false, "pass on someone who didn't like us: no match");
// ordering must not correlate with likedMe: seed liker ids (server-side) should not all be at the front
await postJ("/api/reset", {});
feed = await j("/api/feed");
const likers = new Set(["p01", "p03", "p06", "p09", "p12", "p15", "p18", "p21", "p24", "p27"]);
const firstTen = feed.profiles.slice(0, 10).filter((p) => likers.has(p.id)).length;
ok(firstTen < 8, `liker positions not leaked via ordering (${firstTen}/10 in first ten)`);

// ---------- No-repeat + matching rules ----------
let matches = 0;
for (const p of feed.profiles) {
  const r = await postJ("/api/swipe", { profileId: p.id, action: "like" });
  if (r.match) matches++;
}
ok(matches > 0, `${matches} mutual matches from liking everyone`);
feed = await j("/api/feed");
ok(feed.profiles.length === 0, "swiped profiles never reappear (feed empty)");
ok((await postJ("/api/swipe", { profileId: "p01", action: "like" })).recorded === false, "re-swipe is idempotent");
ok((await j("/api/matches")).matches.length === matches, "matches listed & consistent");

// ---------- Validation ----------
ok((await post("/api/swipe", { profileId: "p01", action: "nope" })).status === 400, "invalid action -> 400");
ok((await post("/api/swipe", { profileId: "../etc", action: "like" })).status === 400, "malformed profileId -> 400");
ok((await post("/api/swipe", { profileId: "p99", action: "like" })).status === 404, "unknown profile -> 404");
ok((await raw("/api/swipe", { method: "POST", body: "not json" })).status === 400, "garbage body -> 400");
ok((await raw("/api/feed?minAge=abc")).status === 400, "bad feed query -> 400");
ok((await raw("/api/feed?minAge=40&maxAge=20")).status === 400, "min>max age -> 400");
ok((await raw("/api/photo/p01")).headers.get("content-type") === "image/svg+xml", "local SVG portrait served");
ok((await raw("/api/photo/zzz")).status === 404, "photo for unknown id -> 404");

// ---------- Concurrency: parallel swipes must not lose updates ----------
await postJ("/api/reset", {});
const ids = Array.from({ length: 35 }, (_, i) => `p${String(i + 1).padStart(2, "0")}`);
await Promise.all(ids.map((id) => post("/api/swipe", { profileId: id, action: "like" })));
const st = await j("/api/stats");
ok(st.liked === 35 && st.remaining === 0, `35 parallel swipes all recorded (liked=${st.liked})`);
const mm = (await j("/api/matches")).matches;
ok(mm.length === 10 && new Set(mm.map((m) => m.id)).size === 10, `exactly 10 unique matches under concurrency (${mm.length})`);
// double-fire the same swipe in parallel -> exactly one match
await postJ("/api/reset", {});
await Promise.all(Array.from({ length: 10 }, () => post("/api/swipe", { profileId: "p01", action: "like" })));
ok((await j("/api/matches")).matches.length === 1, "10 parallel duplicate swipes -> one match");

// ---------- Pass / messages / unmatch ----------
await postJ("/api/reset", {});
ok((await postJ("/api/swipe", { profileId: "p01", action: "pass" })).match === false, "pass on a liker does not match");
ok((await post("/api/messages", { profileId: "p01", text: "hi" })).status === 403, "cannot message a non-match");
await postJ("/api/swipe", { profileId: "p03", action: "super" });
ok((await post("/api/messages", { profileId: "p03", text: "  hello  " })).status === 200, "can message a match");
ok((await post("/api/messages", { profileId: "p03", text: "   " })).status === 400, "empty message rejected");
ok((await j("/api/messages?id=p03")).messages[0].text === "hello", "message trimmed & stored");
await raw("/api/matches?id=p03", { method: "DELETE" });
ok((await j("/api/matches")).matches.length === 0, "unmatch removes match");
ok((await j("/api/feed")).profiles.every((p) => p.id !== "p03"), "unmatched profile never returns to feed");

await postJ("/api/reset", {});
console.log(fails ? `\n${fails} FAILED` : "\nAll API tests passed");
process.exit(fails ? 1 : 0);
