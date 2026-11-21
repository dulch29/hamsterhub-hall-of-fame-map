import { expect, test } from "@playwright/test";

test("View all pops and re-forms with shared sound, mute and finite lifecycle", async ({ page }) => {
  await page.addInitScript(() => {
    const probe = { sounds: 0, pops: 0, forms: 0, decoded: 0 };
    Object.assign(window, { allFeedback: probe });
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args: Parameters<typeof start>) { probe.sounds++; return start.apply(this, args); };
    const decode = BaseAudioContext.prototype.decodeAudioData;
    BaseAudioContext.prototype.decodeAudioData = function (...args: Parameters<typeof decode>) {
      return decode.apply(this, args).then((buffer) => { probe.decoded++; return buffer; });
    };
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      if (this.classList.contains("bubble-burst__ring")) {
        if ((this.closest(".bubble-burst") as HTMLElement)?.dataset.kind === "pop") probe.pops++; else probe.forms++;
      }
      return animate.apply(this, args);
    };
  });
  const counts = () => page.evaluate(() => (window as unknown as { allFeedback: { sounds: number; pops: number; forms: number; decoded: number } }).allFeedback);
  await page.goto("/");
  await expect.poll(async () => (await counts()).decoded).toBe(2);
  await page.getByRole("button", { name: "Mock Mali", exact: true }).click();
  const bubble = page.locator(".discovery-all");
  await bubble.click();
  await expect(page.locator(".province-recipients")).toBeVisible();
  expect(await counts()).toMatchObject({ sounds: 1, pops: 1, forms: 0 });
  await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).click();
  await expect(bubble).toBeFocused();
  expect(await counts()).toMatchObject({ sounds: 2, pops: 1, forms: 1 });
  await expect(bubble).toHaveAttribute("data-reforming", "true");
  await bubble.click();
  await page.keyboard.press("Escape");
  await expect(bubble).toBeFocused();
  expect(await counts()).toMatchObject({ sounds: 4, pops: 2, forms: 2 });
  await expect(bubble).not.toHaveAttribute("data-reforming");
  await expect(page.locator(".bubble-burst")).toHaveCount(0);
  await expect(page.locator(".discovery-sound")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".bubble-burst")).toHaveCount(0);
  await bubble.press("Enter");
  await page.keyboard.press("Escape");
  await expect(bubble).toBeFocused();
  await expect(page.locator(".bubble-burst")).toHaveCount(0);
  await bubble.press("Enter");
  await page.locator("canvas").click({ position: { x: 6, y: 240 } });
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await expect(page.locator(".bubble-burst")).toHaveCount(0);
});

test("View all formation cancels when a student or full exit interrupts it", async ({ page }) => {
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      if (this.classList.contains("bubble-arrival") && typeof options === "object" && options.duration === 620) options = { ...options, duration: 6000 };
      return original.call(this, frames, options);
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).click();
  const bubble = page.locator(".discovery-all");
  await bubble.click();
  await page.keyboard.press("Escape");
  await expect(bubble).toHaveAttribute("data-reforming", "true");
  await page.locator(".recipient-bubble[data-recipient-id]").first().click();
  await expect(bubble).not.toHaveAttribute("data-reforming");
  expect(await bubble.locator(".bubble-arrival").evaluate((element) => element.getAnimations().filter((animation) => animation.effect?.getTiming().duration === 6000).length)).toBe(0);
  await expect(page.locator(".student-preview")).toHaveAttribute("data-morph", "open");
  await page.keyboard.press("Escape");
  await expect(page.locator(".student-preview")).toHaveCount(0);
  await bubble.click();
  await page.keyboard.press("Escape");
  await expect(bubble).toHaveAttribute("data-reforming", "true");
  await page.locator("canvas").click({ position: { x: 6, y: 240 } });
  await expect(page.locator(".award-discovery")).toHaveAttribute("data-state", "recalling");
  await expect(bubble).not.toHaveAttribute("data-reforming");
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await expect(page.locator(".bubble-burst")).toHaveCount(0);
});
