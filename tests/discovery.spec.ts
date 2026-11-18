import { test, expect, type Page } from "@playwright/test";
import { tmpdir } from "node:os";
import { join } from "node:path";

const recipients = (page: Page) => page.getByRole("region", { name: "ผู้ได้รับรางวัล", exact: true });
const preview = (page: Page) => page.getByRole("region", { name: "โปรไฟล์เบื้องต้น", exact: true });

test("floating bubbles follow pause and expand from a circle with an interruptible reverse", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?fixture=group");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-landing", "settled");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  const face = recipients(page).locator(".recipient-bubble").first();
  await expect(recipients(page).locator(".recipient-bubble")).toHaveCount(5);
  const float = face.locator(".bubble-float");
  const pose = await float.evaluate((element) => {
    const animation = element.getAnimations()[0]!;
    animation.pause(); animation.currentTime = 0;
    const start = getComputedStyle(element).transform;
    animation.currentTime = 1500;
    const end = getComputedStyle(element).transform;
    animation.play();
    return { start, end };
  });
  expect(pose.start).not.toBe(pose.end);
  await page.getByRole("button", { name: "Pause starlight" }).click();
  await expect(float).toHaveCSS("animation-play-state", "paused");
  await page.screenshot({ path: join(tmpdir(), "hamsterhub-phase2-floating-group.png") });
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await face.evaluate((element) => element.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
  await expect(preview(page)).toHaveAttribute("data-morph", "opening");
  const shell = preview(page).locator(".student-preview__surface");
  await shell.evaluate((element) => { for (const animation of element.getAnimations()) { animation.pause(); animation.currentTime = 90; } });
  const middle = await shell.evaluate((element) => getComputedStyle(element).transform);
  expect(middle).not.toBe("none");
  await preview(page).getByRole("button", { name: "← กลับไปรายชื่อ", exact: true })
    .evaluate((element) => element.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
  await expect(preview(page)).toHaveAttribute("data-morph", "closing");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.runFor(32);
  await expect(preview(page)).toHaveCount(0);
  await expect(face).toBeFocused();
  await expect(face).toHaveAttribute("aria-pressed", "false");
  await face.press("Enter");
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await expect(preview(page).getByRole("heading", { name: "Hamster Maze", exact: true })).toBeInViewport();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await expect(page.locator(".award-discovery")).toHaveCount(0);
});

test("desktop award discovery, province isolation, preview links and layered Escape restore the view", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.locator(".map-marker")).toHaveCount(3);
  const pin = page.getByRole("button", { name: "Mock Mali", exact: true });
  const before = (await pin.boundingBox())!;
  await page.screenshot({ path: join(tmpdir(), "hamsterhub-phase2-overview.png") });
  await pin.press("Enter");
  await expect(recipients(page)).toBeVisible();
  const recipientBox = (await recipients(page).locator(".recipient-bubble").boundingBox())!;
  const selectedBox = (await pin.boundingBox())!;
  expect(recipientBox.x).toBeGreaterThan(selectedBox.x + selectedBox.width);
  const choice = page.getByRole("button", { name: "Creative Coding Award", exact: true });
  await expect(choice).toBeFocused();
  await expect(recipients(page).locator(".recipient-bubble")).toHaveCount(1);
  await expect(recipients(page)).not.toContainText("Mock Niran");
  await page.getByRole("button", { name: "Digital Explorers Competition", exact: true }).click();
  await expect(recipients(page).locator(".recipient-bubble")).toHaveCount(1);
  await expect(recipients(page)).not.toContainText("Mock Niran");
  const face = recipients(page).getByRole("button", { name: "ดูโปรไฟล์เบื้องต้นของ Mock Mali", exact: true });
  await face.click();
  await expect(preview(page).getByRole("heading", { name: "Mock Mali", exact: true })).toBeFocused();
  await expect(preview(page).getByRole("heading", { name: "Hamster Maze", exact: true })).toBeVisible();
  await expect(preview(page).getByRole("link", { name: /ดูโปรไฟล์/ })).toHaveAttribute("href", /profile\/mock-2a-0001$/);
  await expect(preview(page).getByRole("link", { name: /ดูผลงาน/ })).toHaveAttribute("target", "_blank");
  await page.screenshot({ path: join(tmpdir(), "hamsterhub-phase2-desktop.png") });
  await page.keyboard.press("Escape");
  await expect(preview(page)).toHaveCount(0);
  await expect(face).toBeFocused();
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(recipients(page)).toHaveCount(0);
  await expect(pin).toHaveAttribute("aria-pressed", "false");
  await expect(pin).toBeFocused();
  const after = (await pin.boundingBox())!;
  expect(Math.abs(after.x - before.x)).toBeLessThan(1);
  expect(Math.abs(after.y - before.y)).toBeLessThan(1);
  expect(errors).toEqual([]);
});

test.describe("touch discovery", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });
  test("tap expands a portrait bubble and keeps Profile visible while project content scrolls", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const images: string[] = [];
    page.on("request", (request) => { if (request.url().includes("/demo/project-")) images.push(request.url()); });
    await page.goto("/");
    const pin = page.getByRole("button", { name: "Mock Mali", exact: true });
    await pin.tap();
    await expect(recipients(page)).toBeVisible();
    expect(images).toEqual([]);
    await page.screenshot({ path: join(tmpdir(), "hamsterhub-phase2-mobile-recipients.png") });
    await recipients(page).getByRole("button", { name: "ดูโปรไฟล์เบื้องต้นของ Mock Mali", exact: true }).tap();
    const profile = preview(page).getByRole("link", { name: /ดูโปรไฟล์/ });
    const buttonBounds = (await profile.boundingBox())!;
    expect(buttonBounds.y).toBeGreaterThan(0);
    expect(buttonBounds.y + buttonBounds.height).toBeLessThanOrEqual(844);
    await expect(preview(page).locator(".student-preview__thumbnail img")).toBeVisible();
    await preview(page).locator(".student-preview__body").evaluate((body) => { body.scrollTop = body.scrollHeight; });
    await expect(preview(page).getByRole("heading", { name: "Hamster Maze", exact: true })).toBeInViewport();
    expect(images.length).toBeGreaterThan(0);
    await expect(page.locator("canvas")).toHaveCount(1);
    await page.screenshot({ path: join(tmpdir(), "hamsterhub-phase2-mobile-preview.png") });
    await page.getByRole("button", { name: "← กลับไปรายชื่อ", exact: true }).tap();
    await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).tap();
    await expect(page.locator(".award-discovery")).toHaveCount(0);
    await expect(pin).toHaveAttribute("aria-pressed", "false");
  });
});

for (const width of [320, 390, 1440]) {
  test(`group overflow, image fallbacks and preview switching at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?fixture=group");
    await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
    await expect(recipients(page)).toContainText("8 คนได้รับรางวัลนี้");
    await expect(recipients(page).locator(".recipient-bubble")).toHaveCount(5);
    await expect(page.getByText("Hidden Student", { exact: true })).toHaveCount(0);
    const overflow = page.getByRole("button", { name: /ดูทั้งหมด 8 คน/ });
    if (width >= 900) {
      const overflowBounds = (await overflow.boundingBox())!;
      const controlsBounds = (await page.locator(".map-controls").boundingBox())!;
      expect(overflowBounds.x + overflowBounds.width).toBeLessThan(controlsBounds.x);
    }
    await overflow.click();
    const all = page.getByRole("list", { name: "รายชื่อทั้งหมด" });
    await expect(all.getByRole("button")).toHaveCount(8);
    if (width >= 900) {
      const listBounds = (await all.boundingBox())!;
      const controlsBounds = (await page.locator(".map-controls").boundingBox())!;
      expect(listBounds.x + listBounds.width).toBeLessThan(controlsBounds.x);
    }
    const longName = "Mock Student With A Very Long Display Name";
    const last = all.getByRole("button", { name: `ดูโปรไฟล์เบื้องต้นของ ${longName}`, exact: true });
    await last.click();
    await expect(preview(page).getByRole("heading", { name: longName, exact: true })).toBeVisible();
    await expect(preview(page).getByText("ยังไม่มีภาพตัวอย่าง", { exact: true })).toBeVisible();
    await expect(preview(page).locator(".student-preview__identity .recipient-portrait .pin-card__placeholder")).toHaveText("MS");
    const bounds = (await preview(page).boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await page.screenshot({ path: join(tmpdir(), `hamsterhub-phase2-${width}.png`) });
    await page.getByRole("button", { name: "← กลับไปรายชื่อ", exact: true }).click();
    await expect(last).toBeFocused();
    await all.getByRole("button", { name: "ดูโปรไฟล์เบื้องต้นของ Mock Student 7", exact: true }).click();
    await expect(preview(page).getByRole("link")).toHaveCount(0);
    await expect(preview(page)).toContainText("ยังไม่มีลิงก์โปรไฟล์ที่ใช้งานได้");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Young Makers Challenge", exact: true }).click();
    await expect(recipients(page).locator(".recipient-bubble")).toHaveCount(3);
    await expect(all).toHaveCount(0);
    await recipients(page).getByRole("button", { name: "ดูโปรไฟล์เบื้องต้นของ Mock Ploy", exact: true }).click();
    await expect(preview(page)).toContainText("ยังไม่ได้เลือกผลงานแนะนำ");
    await expect(preview(page).getByRole("link", { name: /ดูโปรไฟล์/ })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("direct accessible directory supports search, province filters and the same keyboard preview", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?view=recipients");
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.getByRole("searchbox").fill("Niran");
  await expect(page.locator(".directory-award")).toHaveCount(2);
  await page.getByRole("combobox", { name: "จังหวัด", exact: true }).selectOption("TH-10");
  await expect(page.getByText("ไม่พบรายชื่อ ลองเปลี่ยนคำค้นหาหรือจังหวัด")).toBeVisible();
  await page.getByRole("combobox", { name: "จังหวัด", exact: true }).selectOption("");
  const award = page.locator(".directory-award").first();
  await award.focus();
  await page.keyboard.press("Enter");
  const face = recipients(page).getByRole("button", { name: "ดูโปรไฟล์เบื้องต้นของ Mock Niran", exact: true });
  await face.focus();
  await page.keyboard.press("Enter");
  await expect(preview(page)).toContainText("Space Garden");
  await page.keyboard.press("Escape");
  await expect(face).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(award).toBeFocused();
});

for (const failure of ["geometry", "webgl"]) {
  test(`${failure} failure keeps award recipients and profile previews available`, async ({ page }) => {
    if (failure === "geometry") await page.route("**/data/thailand-provinces.geojson", (route) => route.abort());
    else await page.addInitScript(() => {
      const getContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
        if (type.includes("webgl")) return null;
        return getContext.apply(this, [type, ...args] as Parameters<typeof getContext>);
      } as typeof getContext;
    });
    await page.goto("/");
    await expect(page.getByRole("status")).toContainText("แผนที่ไม่พร้อมใช้งาน");
    await page.locator(".directory-award").first().click();
    await recipients(page).getByRole("button", { name: "ดูโปรไฟล์เบื้องต้นของ Mock Mali", exact: true }).click();
    await expect(preview(page)).toContainText("Hamster Maze");
  });
}

test("background, manual movement, reset and context loss synchronize discovery", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const pin = page.getByRole("button", { name: "Mock Mali", exact: true });
  await pin.press("Enter");
  await recipients(page).getByRole("button", { name: "ดูโปรไฟล์เบื้องต้นของ Mock Mali", exact: true }).click();
  await page.locator("canvas").click({ position: { x: 20, y: 400 } });
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await pin.press("Enter");
  await page.mouse.move(20, 400);
  await page.mouse.down({ button: "right" });
  await page.mouse.move(55, 420, { steps: 3 });
  await page.mouse.up({ button: "right" });
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await pin.press("Enter");
  await page.getByRole("button", { name: "Reset map view" }).press("Enter");
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await pin.press("Enter");
  await page.locator("canvas").dispatchEvent("webglcontextlost");
  await expect(page.getByRole("status")).toContainText("แผนที่ไม่พร้อมใช้งาน");
  await recipients(page).getByRole("button", { name: "ดูโปรไฟล์เบื้องต้นของ Mock Mali", exact: true }).click();
  await expect(preview(page)).toContainText("Hamster Maze");
});
