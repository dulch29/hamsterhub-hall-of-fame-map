import { test, expect, type Page } from "@playwright/test";
import { tmpdir } from "node:os";
import { join } from "node:path";

const recipients = (page: Page) => page.getByRole("region", { name: "ผู้ได้รับรางวัล", exact: true });
const preview = (page: Page) => page.getByRole("region", { name: "โปรไฟล์เบื้องต้น", exact: true });

test("bubble pop and re-form have quiet optional sound, a burst and a rim-free enlarged student", async ({ page }) => {
  await page.addInitScript(() => {
    const feedback = { sounds: 0, pops: 0, forms: 0 };
    Object.assign(window, { bubbleFeedback: feedback });
    const start = OscillatorNode.prototype.start;
    OscillatorNode.prototype.start = function (...args: Parameters<typeof start>) { feedback.sounds++; return start.apply(this, args); };
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      const burst = this.closest(".bubble-burst");
      if (this.classList.contains("bubble-burst__ring")) {
        if ((burst as HTMLElement).dataset.kind === "pop") feedback.pops++; else feedback.forms++;
      }
      return animate.apply(this, args);
    };
  });
  const counts = () => page.evaluate(() => (window as unknown as { bubbleFeedback: { sounds: number; pops: number; forms: number } }).bubbleFeedback);
  await page.goto("/?view=recipients");
  await page.locator(".directory-award").first().click();
  const face = recipients(page).locator(".recipient-bubble").first();
  const original = (await face.boundingBox())!;
  await face.click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await expect(preview(page).locator(".recipient-orb")).toHaveCount(0);
  await expect(face).toHaveCSS("visibility", "hidden");
  const portrait = (await preview(page).locator(".student-preview__identity").boundingBox())!;
  expect(portrait.width).toBeGreaterThan(original.width);
  expect(await counts()).toMatchObject({ sounds: 1, pops: 1 });
  const award = (await preview(page).locator(".student-preview__award").boundingBox())!;
  const image = (await preview(page).locator(".student-preview__thumbnail").boundingBox())!;
  expect(award.y).toBeLessThan(image.y);
  await preview(page).getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).click();
  await expect(preview(page)).toHaveCount(0);
  await expect(face).toBeVisible();
  expect(await counts()).toMatchObject({ sounds: 2, forms: 1 });
  await page.getByRole("button", { name: "ปิดเสียงฟองสบู่", exact: true }).click();
  await face.click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await page.keyboard.press("Escape");
  expect((await counts()).sounds).toBe(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await face.press("Enter");
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await expect(page.locator(".bubble-burst")).toHaveCount(0);
});

test("province exit gathers bubbles into its award before restoring the camera", async ({ page }) => {
  await page.goto("/?fixture=group");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-landing", "settled");
  const pin = page.getByRole("button", { name: "Mock Mali", exact: true });
  const before = (await pin.boundingBox())!;
  await pin.press("Enter");
  await page.getByRole("button", { name: "Pause starlight" }).click();
  await page.evaluate(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      const animation = animate.apply(this, args);
      if (this.closest(".is-closing")) animation.pause();
      return animation;
    };
  });
  await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).click();
  const discovery = page.locator(".award-discovery");
  await expect(discovery).toHaveAttribute("data-state", "recalling");
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  const recall = await discovery.evaluate((element) => {
    const target = { x: Number((element as HTMLElement).dataset.anchorX), y: Number((element as HTMLElement).dataset.anchorY) };
    const animations = element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "paused"
      && (animation.effect as KeyframeEffect).target?.classList.contains("bubble-arrival"));
    return { target, centers: animations.map((animation) => {
      const effect = animation.effect as KeyframeEffect;
      animation.currentTime = Number(effect.getComputedTiming().endTime);
      const rect = (effect.target as Element).getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    }) };
  });
  expect(recall.centers).toHaveLength(5);
  for (const center of recall.centers) {
    expect(Math.abs(center.x - recall.target.x)).toBeLessThan(1);
    expect(Math.abs(center.y - recall.target.y)).toBeLessThan(1);
  }
  await discovery.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => {
    if (animation.playState === "paused" && Number.isFinite(animation.effect?.getComputedTiming().endTime)) animation.finish();
  }));
  await expect(discovery).toHaveCount(0);
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  const after = (await pin.boundingBox())!;
  expect(Math.abs(after.x - before.x)).toBeLessThan(1);
  expect(Math.abs(after.y - before.y)).toBeLessThan(1);
  await pin.press("Enter");
  await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).click();
  await expect(discovery).toHaveAttribute("data-state", "recalling");
  await expect(pin).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(discovery).toHaveCount(0);
  await expect(pin).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
});

test("Escape interrupts a pointer close immediately and group switching does not inherit its exit state", async ({ page }) => {
  await page.goto("/?view=recipients");
  await page.locator(".directory-award").first().press("Enter");
  const face = recipients(page).locator(".recipient-bubble").first();
  await face.click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await page.evaluate(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      const animation = animate.apply(this, args);
      if (this.closest('.student-preview[data-morph="closing"]')) animation.pause();
      return animation;
    };
  });
  await preview(page).getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).click();
  await expect(preview(page)).toHaveAttribute("data-morph", "closing");
  await page.keyboard.press("Escape");
  await expect(preview(page)).toHaveCount(0);
  await expect(face).toBeFocused();
  await expect(page.locator(".bubble-burst")).toHaveCount(0);
  await face.click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await preview(page).getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).click();
  await page.locator('.directory-province').nth(1).locator('.directory-award').first().press("Enter");
  await recipients(page).locator(".recipient-bubble").first().press("Enter");
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await expect(preview(page)).toContainText("Space Garden");
});

test("background dismissal closes the student before recall; manual reset cancels an in-flight recall", async ({ page }) => {
  await page.goto("/?fixture=group");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Pause starlight" }).click();
  await recipients(page).locator(".recipient-bubble").first().click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await page.locator("canvas").click({ position: { x: 20, y: 400 } });
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await page.evaluate(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      const animation = animate.apply(this, args);
      if (this.closest(".is-closing")) animation.pause();
      return animation;
    };
  });
  await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).click();
  await expect(page.locator(".award-discovery")).toHaveAttribute("data-state", "recalling");
  await page.getByRole("button", { name: "Reset map view", exact: true }).press("Enter");
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).click();
  await expect(page.locator(".award-discovery")).toHaveAttribute("data-state", "recalling");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await expect(page.locator(".bubble-burst")).toHaveCount(0);
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
});

test("floating bubbles follow pause and expand from a circle with an interruptible reverse", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?fixture=group");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-landing", "settled");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  const face = recipients(page).locator(".recipient-bubble").first();
  await expect(recipients(page).locator(".recipient-bubble")).toHaveCount(5);
  const float = face.locator(".bubble-float");
  const start = await float.evaluate((element) => getComputedStyle(element).transform);
  await expect.poll(() => float.evaluate((element) => getComputedStyle(element).transform)).not.toBe(start);
  await page.getByRole("button", { name: "Pause starlight" }).click();
  await expect(float).toHaveCSS("animation-play-state", "paused");
  await expect.poll(() => float.evaluate((element) => element.getAnimations()[0]?.playState)).toBe("paused");
  await page.screenshot({ path: join(tmpdir(), "hamsterhub-phase2-floating-group.png") });
  const originalPortrait = (await face.locator(".recipient-orb").boundingBox())!;
  await page.evaluate(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (this: Element, ...args: Parameters<typeof animate>) {
      const animation = animate.apply(this, args);
      if (this.closest(".student-preview")) animation.pause();
      return animation;
    };
  });
  await face.evaluate((element) => element.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
  await expect(preview(page)).toHaveAttribute("data-morph", "opening");
  const shell = preview(page).locator(".student-preview__surface");
  await shell.evaluate((element) => { for (const animation of element.getAnimations()) { animation.pause(); animation.currentTime = 90; } });
  const middle = await shell.evaluate((element) => getComputedStyle(element).transform);
  expect(middle).not.toBe("none");
  await expect(face).toHaveCSS("visibility", "hidden");
  await expect(preview(page).locator(".recipient-orb")).toHaveCount(0);
  await expect(preview(page).locator(".student-portrait img")).toHaveAttribute("src", "/demo/student-1.svg");
  await preview(page).getByRole("button", { name: "กลับไปรายชื่อ", exact: true })
    .evaluate((element) => element.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })));
  await expect(preview(page)).toHaveAttribute("data-morph", "closing");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(preview(page)).toHaveCount(0);
  await expect(face).toBeFocused();
  await expect(face).toHaveAttribute("aria-pressed", "false");
  await face.press("Enter");
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  const settledPortrait = (await preview(page).locator(".student-preview__identity").boundingBox())!;
  expect(settledPortrait.width).toBeGreaterThan(originalPortrait.width);
  const card = (await preview(page).boundingBox())!;
  expect(Math.abs(settledPortrait.x + settledPortrait.width / 2 - card.x - card.width / 2)).toBeLessThan(1);
  await page.screenshot({ path: join(tmpdir(), "hamsterhub-phase2-anchored-card.png") });
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
  await expect(preview(page).getByRole("link")).toHaveCount(1);
  await expect(preview(page).getByRole("link", { name: /ดูโปรไฟล์/ })).toHaveAttribute("target", "_blank");
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
    const face = recipients(page).getByRole("button", { name: "ดูโปรไฟล์เบื้องต้นของ Mock Mali", exact: true });
    const before = (await face.locator(".recipient-orb").boundingBox())!;
    await face.tap();
    const after = (await preview(page).locator(".student-preview__identity").boundingBox())!;
    expect(after.width).toBeGreaterThan(before.width);
    expect(after.y).toBeGreaterThan(0);
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
    await page.getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).tap();
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
    await last.scrollIntoViewIfNeeded();
    await last.click();
    await expect(preview(page).getByRole("heading", { name: longName, exact: true })).toBeInViewport();
    const selectedPortrait = (await preview(page).locator(".student-preview__identity").boundingBox())!;
    expect(selectedPortrait.width).toBeGreaterThan(100);
    await expect(preview(page).getByText("ยังไม่มีภาพตัวอย่าง", { exact: true })).toBeVisible();
    await expect(preview(page).locator(".student-portrait .pin-card__placeholder")).toHaveText("MS");
    const bounds = (await preview(page).boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    await page.screenshot({ path: join(tmpdir(), `hamsterhub-phase2-${width}.png`) });
    await page.getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).click();
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
