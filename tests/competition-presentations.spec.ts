import { expect, test } from "@playwright/test";

for (const width of [320, 390, 1440]) {
  test(`competition journey, lazy slides, nested Back and staging at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const mediaRequests: string[] = [];
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => { if (/\/demo\/(project-1|maze-route)\.svg/.test(request.url())) mediaRequests.push(request.url()); });
    await page.goto("/");
    await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
    const bubble = page.locator(".recipient-bubble[data-recipient-id]").first();
    await bubble.press("Enter");
    const card = page.locator(".student-preview");
    await expect(card).toHaveAttribute("data-stage", "student");
    expect(mediaRequests).toEqual([]);
    expect(await page.locator(".student-competition").evaluateAll((buttons) => buttons.map((b) => b.getAttribute("data-competition-id")))).toEqual(["creative", "maker", "explorer"]);
    const shell = await card.elementHandle();
    const creative = page.locator('.student-competition[data-competition-id="creative"]');
    await creative.press("Enter");
    await expect(card).toHaveAttribute("data-stage", "competition");
    await expect(page.locator(".competition-presentation h3")).toBeFocused();
    await expect(page.locator(".presentation-media img")).toHaveAttribute("alt", /Hamster Maze/);
    await expect.poll(() => page.locator(".presentation-media img").evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByRole("button", { name: "สไลด์ก่อนหน้า", exact: true })).toBeDisabled();
    await page.getByRole("button", { name: "สไลด์ถัดไป", exact: true }).click();
    await expect(page.locator(".presentation-media")).toHaveAttribute("data-slide-index", "2");
    await page.getByRole("button", { name: "สไลด์ก่อนหน้า", exact: true }).press("ArrowLeft");
    await expect(page.locator(".presentation-media")).toHaveAttribute("data-slide-index", "1");
    const pdf = page.getByRole("link", { name: /PDF เปิดแท็บใหม่/ });
    await expect(pdf).toHaveAttribute("href", "/demo/maze-notes.pdf");
    await page.getByRole("button", { name: "Pause starlight", exact: true }).press("Enter");
    await page.getByRole("button", { name: "Resume starlight", exact: true }).press("Enter");
    const response = await page.request.get("/demo/maze-notes.pdf");
    expect(response.ok()).toBe(true);
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
    if (width === 1440) {
      const portrait = (await page.locator(".student-preview__identity").boundingBox())!;
      const panel = (await card.boundingBox())!;
      expect(portrait.x + portrait.width).toBeLessThan(panel.x);
    }
    await page.screenshot({ path: test.info().outputPath(`presentation-${width}.png`) });
    await page.getByRole("button", { name: "กลับไปการแข่งขัน", exact: true }).press("Enter");
    await expect(creative).toBeFocused();
    expect(await shell!.evaluate((node) => node.isConnected)).toBe(true);
    await page.locator('.student-competition[data-competition-id="maker"]').press("Enter");
    await expect(page.locator(".competition-presentation")).toContainText("Maze Builder Journal");
    await expect(page.locator(".competition-presentation")).toContainText("ยังไม่มีสไลด์ภาพ");
    await page.keyboard.press("Escape");
    await expect(page.locator('.student-competition[data-competition-id="maker"]')).toBeFocused();
    await creative.press("Enter");
    await expect(page.locator(".presentation-media")).toHaveAttribute("data-slide-index", "1");
    await page.keyboard.press("Escape");
    await page.screenshot({ path: test.info().outputPath(`competitions-${width}.png`) });
    await page.keyboard.press("Escape");
    await expect(bubble).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator(".award-discovery")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    expect(errors).toEqual([]);
  });
}

test("unsafe and missing slides retain navigation, description and safe media", async ({ page }) => {
  await page.goto("/?fixture=group");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await page.locator(".discovery-all").press("Enter");
  await page.locator(".province-recipient").last().press("Enter");
  await page.locator(".student-competition").press("Enter");
  await expect(page.locator(".presentation-unavailable")).toBeVisible();
  await expect(page.locator('.student-preview [src^="javascript:"]')).toHaveCount(0);
  await page.getByRole("button", { name: "สไลด์ถัดไป", exact: true }).click();
  await expect(page.locator(".presentation-unavailable")).toBeVisible();
  await page.getByRole("button", { name: "สไลด์ถัดไป", exact: true }).click();
  await expect.poll(() => page.locator(".presentation-media img").evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(page.locator(".student-preview__description")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".student-competition")).toBeFocused();
});

test("PDF-only, single-slide and unlinked entries each keep their own content", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Mock Niran", exact: true }).press("Enter");
  await page.locator(".recipient-bubble[data-recipient-id]").first().press("Enter");
  await page.locator('.student-competition[data-competition-id="ocean"]').press("Enter");
  await expect(page.locator(".competition-presentation")).toContainText("ยังไม่ได้เชื่อมผลงาน");
  await expect(page.getByRole("link", { name: /PDF เปิดแท็บใหม่/ })).toBeVisible();
  await expect(page.locator(".presentation-controls button")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.locator('.student-competition[data-competition-id="explorer"]').press("Enter");
  await expect(page.locator(".competition-presentation")).toContainText("Space Garden");
  await expect(page.locator(".presentation-controls")).toContainText("1 / 1");
  await expect(page.locator(".presentation-controls button")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /PDF เปิดแท็บใหม่/ })).toHaveCount(0);
});

test("switching a peer from detail clears competition and slide selection", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?fixture=group");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  const bubbles = page.locator(".recipient-bubble[data-recipient-id]");
  await bubbles.first().press("Enter");
  await page.locator('.student-competition[data-competition-id="creative"]').press("Enter");
  await page.getByRole("button", { name: "สไลด์ถัดไป", exact: true }).click();
  await bubbles.nth(1).click();
  await expect(page.locator(".student-preview")).toHaveAttribute("data-stage", "student");
  await expect(page.locator(".competition-presentation")).toHaveCount(0);
  await expect(page.locator(".student-competition")).toHaveCount(2);
});

test("rapid detail selection keeps its focus when the opening bubble morph completes", async ({ page }) => {
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      if (this.classList.contains("student-preview__surface") && typeof options === "object") options = { ...options, duration: 4000 };
      return original.call(this, frames, options);
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).click();
  await page.locator(".recipient-bubble[data-recipient-id]").first().click();
  await expect(page.locator(".student-preview")).toHaveAttribute("data-morph", "opening");
  await page.locator('.student-competition[data-competition-id="creative"]').click();
  await expect(page.locator(".competition-presentation h3")).toBeFocused();
  await page.locator(".student-preview__surface").evaluate((surface) => surface.getAnimations().forEach((animation) => animation.finish()));
  await expect(page.locator(".student-preview")).toHaveAttribute("data-morph", "open");
  await expect(page.locator(".competition-presentation h3")).toBeFocused();
});

for (const exit of ["background", "close"]) {
  test(`${exit} from competition detail exits the full award journey`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const map = page.locator(".map-canvas");
    await expect(map).toHaveAttribute("data-landing", "settled");
    const target = (await map.getAttribute("data-camera-target"))!;
    await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
    await page.locator(".recipient-bubble[data-recipient-id]").first().press("Enter");
    await page.locator('.student-competition[data-competition-id="creative"]').press("Enter");
    if (exit === "background") await page.locator("canvas").click({ position: { x: 6, y: 240 } });
    else await page.getByRole("button", { name: "ปิดกลับแผนที่หรือรายชื่อ ×", exact: true }).click();
    await expect(page.locator(".award-discovery")).toHaveCount(0);
    await expect(map).toHaveAttribute("data-camera-target", target);
  });
}

test("detail survives actual context restoration and timeout returns focus to a visible row", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await page.locator(".recipient-bubble[data-recipient-id]").first().press("Enter");
  await page.locator('.student-competition[data-competition-id="creative"]').press("Enter");
  await page.getByRole("button", { name: "สไลด์ถัดไป", exact: true }).click();
  await page.locator("canvas").evaluate((canvas) => {
    const extension = (canvas as HTMLCanvasElement).getContext("webgl2")!.getExtension("WEBGL_lose_context")!;
    (window as Window & { restoreMap?: () => void }).restoreMap = () => extension.restoreContext();
    extension.loseContext();
  });
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "recovering");
  await page.evaluate(() => (window as Window & { restoreMap?: () => void }).restoreMap!());
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "ready");
  await expect(page.locator(".presentation-media")).toHaveAttribute("data-slide-index", "2");
  await page.locator("canvas").evaluate((canvas) => (canvas as HTMLCanvasElement).getContext("webgl2")!.getExtension("WEBGL_lose_context")!.loseContext());
  await expect(page.locator("main")).toHaveAttribute("data-map-failure", "context-timeout");
  await expect(page.locator(".presentation-media")).toHaveAttribute("data-slide-index", "2");
  await page.keyboard.press("Escape");
  await expect(page.locator('.student-competition[data-competition-id="creative"]')).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(".province-recipient")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator(".map-failure__province").first()).toBeFocused();
});
