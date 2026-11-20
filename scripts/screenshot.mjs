// Usage: node scripts/screenshot.mjs <outDir>   (server must be running)
import { chromium } from "@playwright/test";
import fs from "fs";
const out = process.argv[2] || "shots";
fs.mkdirSync(out, { recursive: true });
const base = process.env.BASE || "http://localhost:3000";
const b = await chromium.launch();
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 412, height: 860 }]]) {
  const page = await (await b.newContext({ viewport: vp })).newPage();
  await page.goto(base);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/${name}-home.png` });
  await page.getByRole("tab", { name: "Discover" }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/${name}-discover.png` });
}
await b.close();
