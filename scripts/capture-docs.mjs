// Usage: node scripts/capture-docs.mjs   (server must be running on :3000)
// Writes README screenshots to docs/ and GIF frames to docs/frames/.
import { chromium } from "@playwright/test";
import fs from "fs";
const base = process.env.BASE || "http://localhost:3000";
fs.mkdirSync("docs/frames", { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 412, height: 860 }, deviceScaleFactor: 2, hasTouch: false });
const page = await ctx.newPage();
await page.request.post(`${base}/api/reset`);
let n = 0;
const frame = async (count = 1, gap = 120) => { for (let i = 0; i < count; i++) { await page.screenshot({ path: `docs/frames/f${String(n++).padStart(3, "0")}.png` }); await page.waitForTimeout(gap); } };

await page.goto(base); await page.waitForTimeout(2500);
await page.screenshot({ path: "docs/home.png" });
await frame(6);
const tab = (name) => page.getByRole("tab", { name: new RegExp("^" + name) }).click();
await tab("Discover"); await page.waitForTimeout(1500);
await page.screenshot({ path: "docs/discover.png" });
await frame(5);

// drag a card to the right to show the LIKE stamp
const card = page.getByTestId("card");
const box = await card.boundingBox();
const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
await page.mouse.move(cx, cy); await page.mouse.down();
for (let s = 1; s <= 6; s++) { await page.mouse.move(cx + s * 30, cy - s * 3); await frame(1, 40); }
await page.screenshot({ path: "docs/like-stamp.png" });
await page.mouse.up(); await frame(4);

// tap info
const info = page.getByLabel(/info|details/i).first();
if (await info.count()) { await info.click().catch(() => {}); await page.waitForTimeout(700); await page.screenshot({ path: "docs/profile-info.png" }); await frame(4); await info.click().catch(() => {}); }

// like until a match
for (let i = 0; i < 35; i++) {
  if (await page.getByTestId("match").isVisible()) break;
  await page.getByLabel("Like", { exact: true }).click();
  await page.waitForTimeout(350); if (i < 6) await frame(1, 0);
}
await page.waitForTimeout(900);
await page.screenshot({ path: "docs/match.png" });
await frame(10, 150);

await page.getByRole("button", { name: /Say hello/ }).click(); await page.waitForTimeout(1000); await frame(3); const box2 = page.getByRole("textbox").first(); await box2.fill("Hey! Chai or coffee? ☕"); await box2.press("Enter"); await page.waitForTimeout(2600); await page.screenshot({ path: "docs/chat.png" }); await frame(6); await page.getByLabel("Back").click(); await page.waitForTimeout(800);
await page.waitForTimeout(400);
await page.screenshot({ path: "docs/matches.png" }); await frame(6);
await tab("Me"); await page.waitForTimeout(1200);
await page.screenshot({ path: "docs/me.png" }); await frame(6);

// desktop hero
const d = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await d.goto(base); await d.waitForTimeout(2500);
await d.screenshot({ path: "docs/desktop-home.png" });
await d.getByRole("tab", { name: "Discover" }).click(); await d.waitForTimeout(1500);
await d.screenshot({ path: "docs/desktop-discover.png" });
await page.request.post(`${base}/api/reset`);
await b.close();
console.log("frames:", n);
