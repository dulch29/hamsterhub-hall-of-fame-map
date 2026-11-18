import { test, expect } from "@playwright/test";

test("default preview is the map, and pins identify students without opening cards", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("main", { name: "Hall of Fame map preview" })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.locator(".map-marker")).toHaveCount(3);
  await expect(page.locator(".site-header, .intro, .makers-panel, .test-controls, .pin-card")).toHaveCount(0);
  const pin = page.getByRole("button", { name: "Mock Mali", exact: true });
  await pin.focus();
  await expect(pin.locator(".marker-label")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(pin).toHaveAttribute("aria-pressed", "false");
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 1440]) {
  test(`preview fits ${width}px with visible pins and no page overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: width > 1000 ? 900 : 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const pins = page.locator(".map-marker");
    await expect(pins).toHaveCount(3);
    for (const pin of await pins.all()) {
      const box = await pin.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(width > 1000 ? 900 : 844);
    }
    expect(await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }))).toEqual({ width, height: width > 1000 ? 900 : 844 });
    await page.screenshot({ path: `test-results/map-preview-${width}.png` });
  });
}

test("geometry failure provides a working path to the accessible explorer", async ({ page }) => {
  await page.route("**/data/thailand-provinces.geojson", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText("The map could not load");
  await page.getByRole("link", { name: "Open student list" }).click();
  await expect(page).toHaveURL(/view=explorer/);
  await expect(page.locator(".maker-row")).toHaveCount(3);
});

test("WebGL failure leaves a keyboard-accessible route to the same three students", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof getContext>) {
      if (String(args[0]).includes("webgl")) return null;
      return getContext.apply(this, args);
    } as typeof getContext;
  });
  await page.goto("/");
  const fallback = page.getByRole("link", { name: "Open student list" });
  await expect(fallback).toBeVisible();
  await fallback.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".maker-row")).toHaveCount(3);
});
