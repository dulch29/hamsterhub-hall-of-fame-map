import { expect, test } from "@playwright/test";

for (const [width, height] of [[320, 480], [320, 844], [390, 844], [1010, 692], [1440, 844]]) {
  test(`reference bubble composition fits and opens the province list at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width: width!, height: height! });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?fixture=group");
    const medal = page.getByRole("button", { name: "Mock Mali", exact: true });
    await medal.press("Enter");
    const portraits = page.locator(".recipient-bubble[data-recipient-id]");
    await expect(portraits).toHaveCount(4);
    const all = page.getByRole("button", { name: /ดูผู้ได้รับรางวัลทั้งหมด/ });
    await expect(page.locator(".thought-trail > span")).toHaveCount(3);
    const circles = await portraits.evaluateAll((buttons) => buttons.map((button) => {
      const rect = button.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }));
    const action = (await all.boundingBox())!;
    expect(Math.abs(action.width - action.height)).toBeLessThan(1);
    const award = (await medal.boundingBox())!;
    expect(award.x + award.width / 2).toBeLessThan(width! * .35);
    for (const rect of [...circles, action]) {
      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.x).toBeGreaterThanOrEqual(8);
      expect(rect.x + rect.width).toBeLessThanOrEqual(width! - 8);
    }
    const targets = [...circles, action];
    for (const [index, rect] of targets.entries()) {
      for (const other of targets.slice(index + 1)) {
        expect(Math.hypot(rect.x + rect.width / 2 - other.x - other.width / 2,
          rect.y + rect.height / 2 - other.y - other.height / 2))
          .toBeGreaterThan((rect.width + other.width) / 2 + 2);
      }
    }
    expect(action.y).toBeGreaterThan(circles[0]!.y + circles[0]!.height);
    expect(await page.locator(".map-controls button").evaluateAll((buttons) => buttons.every((button) => {
      const rect = button.getBoundingClientRect();
      return button.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
    }))).toBe(true);
    await page.screenshot({ path: test.info().outputPath(`bubble-composition-${width}.png`) });
    await all.click();
    await expect(page.locator(".province-recipient")).toHaveCount(8);
    await page.keyboard.press("Escape");
    await expect(all).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(medal).toBeFocused();
  });
}
