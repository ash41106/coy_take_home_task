import { test, expect } from "@playwright/test";
import fs from "fs";

const SHOTS = process.env.SHOTS_DIR;

test.beforeEach(async ({ page, request }) => {
  await request.post("/api/reset");
  await page.route("**/i.pravatar.cc/**", (r) => r.abort()); // also exercises the local SVG fallback
  await page.goto("/");
  await page.getByRole("tab", { name: "Discover" }).click();
  await expect(page.getByTestId("card")).toBeVisible();
});

test.afterAll(async ({ request }) => { await request.post("/api/reset"); }); // leave a fresh demo behind

const topId = (page) => page.getByTestId("card").getAttribute("data-profile");

test("Home landing page renders and its CTA opens Discover", async ({ page }) => {
  await page.getByRole("tab", { name: "Home" }).click();
  await expect(page.getByTestId("card")).toHaveCount(0);
  await expect(page.getByTestId("home")).toContainText("Love, but make it");
  if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.waitForTimeout(1500); await page.screenshot({ path: `${SHOTS}/home.png` });
    for (const [i, y] of [[2, 780], [3, 1500], [4, 2300], [5, 99999]]) { await page.getByTestId("home").evaluate((el, v) => { el.style.scrollBehavior = "auto"; el.scrollTop = v; }, y); await page.waitForTimeout(900); await page.screenshot({ path: `${SHOTS}/home${i}.png` }); }
    await page.getByTestId("home").evaluate((el) => (el.scrollTop = 0)); }
  await page.getByRole("button", { name: /Start discovering/ }).click();
  await expect(page.getByTestId("card")).toBeVisible();
  await page.getByRole("tab", { name: "Home" }).click();
  await page.getByRole("tab", { name: "Discover" }).click();
  await expect(page.getByTestId("card")).toBeVisible();
  if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: `${SHOTS}/discover.png` }); }
});

test("button swipe advances, and swiped profile never returns after reload", async ({ page }) => {
  const first = await topId(page);
  await page.getByLabel("Pass", { exact: true }).click();
  await expect.poll(() => topId(page)).not.toBe(first);
  await page.reload();
  await page.getByRole("tab", { name: "Discover" }).click();
  await expect(page.getByTestId("card")).toBeVisible();
  const seen = [];
  for (let i = 0; i < 5; i++) { seen.push(await topId(page)); await page.getByLabel("Pass", { exact: true }).click(); await expect.poll(() => topId(page)).not.toBe(seen[i]); }
  expect(seen).not.toContain(first);
});

test("drag gesture right likes the card", async ({ page }) => {
  const first = await topId(page);
  const box = await page.getByTestId("card").boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 220, box.y + box.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect.poll(() => topId(page), { timeout: 5000 }).not.toBe(first);
  const stats = await (await page.request.get("/api/stats")).json();
  expect(stats.liked + stats.matches).toBeGreaterThan(0);
});

test("match flow: It's a match screen, Matches list, persists after reload", async ({ page }) => {
  for (let i = 0; i < 35; i++) {
    if (await page.getByTestId("match").isVisible()) break;
    await page.getByLabel("Like", { exact: true }).click();
    await page.waitForTimeout(600);
  }
  await expect(page.getByTestId("match")).toBeVisible();
  await expect(page.getByText("It's a match!")).toBeVisible();
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/match.png` });
  await page.getByText("Keep swiping").click();
  await page.getByRole("tab", { name: /Matches/ }).click();
  await expect(page.locator(".mlist li")).toHaveCount(1);
  await page.reload();
  await page.getByRole("tab", { name: /Matches/ }).click();
  await expect(page.locator(".mlist li")).toHaveCount(1);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/matches.png` });
});

test("chat: sending a message renders it and the reply without crashing", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (let i = 0; i < 35; i++) {
    if (await page.getByTestId("match").isVisible()) break;
    await page.getByLabel("Like", { exact: true }).click();
    await page.waitForTimeout(600);
  }
  await page.getByRole("button", { name: /Say hello/ }).click();
  const box = page.getByPlaceholder(/Message/);
  await box.fill("Chai or coffee?");
  await box.press("Enter");
  await expect(page.locator(".msg.mine")).toHaveText("Chai or coffee?");
  await expect(page.locator(".msg.theirs")).toHaveCount(1, { timeout: 6000 });
  expect(errors).toEqual([]);
});

test("empty state when no profiles left", async ({ page, request }) => {
  for (let i = 1; i <= 35; i++) await request.post("/api/swipe", { data: { profileId: `p${String(i).padStart(2, "0")}`, action: "pass" } });
  await page.reload();
  await page.getByRole("tab", { name: "Discover" }).click();
  await expect(page.getByTestId("empty")).toBeVisible();
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/empty.png` });
});

test("filters narrow the deck", async ({ page }) => {
  await page.getByLabel("Filters").click();
  await page.locator("select").selectOption("Delhi");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByTestId("card")).toBeVisible();
  await expect(page.locator(".card .place").first()).toContainText("Delhi");
});
