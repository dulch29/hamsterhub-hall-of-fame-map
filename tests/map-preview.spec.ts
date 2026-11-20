import { test, expect } from "@playwright/test";

test("hover turns awards smoothly without text boxes while ambient motion is paused", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-landing", "settled");
  await page.getByRole("button", { name: "Pause starlight" }).click();
  await page.mouse.move(10, 10);
  const pin = page.getByRole("button", { name: "Mock Mali", exact: true });
  const box = await pin.boundingBox();
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.evaluate(() => {
    const request = window.requestAnimationFrame;
    window.requestAnimationFrame = (callback) => request.call(window, (now) => {
      const root = document.documentElement;
      root.dataset.testFrames = String(Number(root.dataset.testFrames ?? 0) + 1);
      callback(now);
    });
  });
  const canvas = page.locator("canvas");
  const capture = () => canvas.screenshot({ style: ".motion-toggle, .map-controls { visibility: hidden; }" });
  const resting = await capture();
  await pin.hover();
  await page.clock.runFor(32);
  const early = await capture();
  await page.clock.runFor(100);
  const middle = await capture();
  await page.clock.runFor(300);
  const facing = await capture();
  expect(early.equals(middle)).toBe(false);
  expect(middle.equals(facing)).toBe(false);
  expect(resting.equals(facing)).toBe(false);
  await page.keyboard.press("Escape");
  await page.clock.runFor(350);
  expect((await capture()).equals(facing)).toBe(true);
  await expect(page.locator(".marker-label")).toHaveCount(0);
  await expect(pin).not.toHaveAttribute("title");
  await expect(pin).toHaveAttribute("aria-pressed", "false");
  expect(await pin.boundingBox()).toEqual(box);
  await page.mouse.move(10, 10);
  await page.clock.runFor(350);
  expect((await capture()).equals(resting)).toBe(true);
  const settled = await capture();
  const frames = await page.locator("html").getAttribute("data-test-frames");
  await page.clock.runFor(400);
  expect((await capture()).equals(settled)).toBe(true);
  await expect(page.locator("html")).toHaveAttribute("data-test-frames", frames!);
});

test("3D award motion pauses, resumes and stays still for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const trophy = page.getByRole("button", { name: "Mock Mali", exact: true });
  await expect(trophy.locator(".award-constellation svg")).toBeVisible();
  await expect(trophy).toHaveAttribute("data-award-count", "3");
  await expect(trophy).toHaveAttribute("aria-description", "Gold trophy with gold medal, silver medal sample artwork");
  await expect(page.locator(".award-satellite img")).toHaveCount(0);
  const map = page.locator(".map-canvas"), canvas = page.locator("canvas");
  await expect(map).toHaveAttribute("data-landing", "settled");
  await expect(map).toHaveAttribute("data-award-motion", "paused");
  const reduced = await canvas.screenshot();
  await page.waitForTimeout(180);
  expect((await canvas.screenshot()).equals(reduced)).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Pause starlight" }).click();
  await expect(map).toHaveAttribute("data-award-motion", "paused");
  const paused = await canvas.screenshot();
  await page.waitForTimeout(180);
  expect((await canvas.screenshot()).equals(paused)).toBe(true);
  await page.getByRole("button", { name: "Resume starlight" }).click();
  await expect(map).toHaveAttribute("data-award-motion", "playing");
  await page.waitForTimeout(400);
  expect((await canvas.screenshot()).equals(paused)).toBe(false);
  const target = await trophy.boundingBox();
  await page.waitForTimeout(180);
  expect(await trophy.boundingBox()).toEqual(target);
});

test("province landing finishes on interaction and stays settled after reset", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".map-marker")).toHaveCount(3);
  const reset = page.getByRole("button", { name: "Reset map view" });
  await reset.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-landing", "settled");
  await page.getByRole("button", { name: "Mock Niran", exact: true }).press("Enter");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  await reset.press("Enter");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-landing", "settled");
});

test("the initial oblique view places the north upper left and the south lower right", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1040 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const north = page.getByRole("button", { name: "Mock Niran", exact: true });
  const center = page.getByRole("button", { name: "Mock Mali", exact: true });
  const south = page.getByRole("button", { name: "Mock Ploy", exact: true });
  await expect(south).toBeVisible();
  const a = (await north.boundingBox())!, b = (await center.boundingBox())!, c = (await south.boundingBox())!;
  expect(b.x - a.x).toBeGreaterThan(150);
  expect(c.x - b.x).toBeGreaterThan(50);
  expect(b.y - a.y).toBeGreaterThan(100);
  expect(c.y - b.y).toBeGreaterThan(200);
  await page.screenshot({ path: "test-results/map-home-oblique.png" });
});

test("province entrance advances from falling blocks to a settled overview", async ({ page }) => {
  await page.addInitScript(() => {
    const stats = { draws: 0, max: 0 };
    (window as unknown as { testDraws: typeof stats }).testDraws = stats;
    const proto = WebGL2RenderingContext.prototype as unknown as Record<string, (...args: number[]) => unknown>;
    for (const name of ["drawArrays", "drawElements", "drawArraysInstanced", "drawElementsInstanced", "clear"]) {
      const original = proto[name]!;
      proto[name] = function (...args: number[]) {
        if (name === "clear") stats.draws = 0;
        else stats.max = Math.max(stats.max, ++stats.draws);
        return original.apply(this, args);
      };
    }
  });
  const time = new Date("2026-11-18T00:00:00Z");
  await page.clock.install({ time });
  await page.clock.pauseAt(new Date(time.getTime() + 10_000));
  await page.goto("/");
  const map = page.locator(".map-canvas");
  // Let lazy React/module scheduling advance while retaining the entrance timeline.
  await expect.poll(async () => {
    await page.clock.runFor(16);
    return map.count();
  }, { timeout: 30000, intervals: [100] }).toBe(1);
  await expect(map).toHaveAttribute("data-landing", "falling");
  await page.clock.runFor(900);
  await page.screenshot({ path: "test-results/province-landing-early.png" });
  await page.clock.runFor(700);
  await expect(map).toHaveAttribute("data-landing", "falling");
  await page.clock.fastForward(900);
  await expect(map).toHaveAttribute("data-landing", "settled");
  await expect(page.locator(".map-marker")).toHaveCount(3);
  const maxDraws = await page.evaluate(() => (window as unknown as { testDraws: { max: number } }).testDraws.max);
  expect(maxDraws).toBeGreaterThan(200);
  expect(maxDraws).toBeLessThan(300);
  await page.screenshot({ path: "test-results/province-landing-settled.png" });
});

for (const width of [320, 1440]) {
  test(`province blocks enter from beyond the sky edge at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const time = new Date("2026-11-18T00:00:00Z");
    await page.clock.install({ time });
    await page.clock.pauseAt(new Date(time.getTime() + 10_000));
    await page.goto("/");
    const canvas = page.locator("canvas");
    await expect.poll(async () => {
      await page.clock.runFor(16);
      return canvas.count();
    }, { timeout: 30000, intervals: [100] }).toBe(1);
    await expect(canvas).toBeVisible();
    await page.clock.runFor(32);
    await expect(page.locator(".map-canvas")).toHaveAttribute("data-landing", "falling");
    const clip = (await canvas.boundingBox())!;
    // Text antialiasing changes when a WebGL compositor layer is hidden.
    const style = "button, a, p, details, summary, .map-status, .discovery-intro { visibility: hidden !important; }";
    const start = await page.screenshot({ clip, style, animations: "disabled", path: test.info().outputPath("landing-start.png") });
    await canvas.evaluate((element) => { element.style.visibility = "hidden"; });
    const sky = await page.screenshot({ clip, style, animations: "disabled", path: test.info().outputPath("empty-sky.png") });
    await canvas.evaluate((element) => { element.style.visibility = ""; });
    const hasLand = await page.evaluate(async ([first, second]) => {
      const pixels = async (bytes: number[]) => {
        const bitmap = await createImageBitmap(new Blob([new Uint8Array(bytes)], { type: "image/png" }));
        const image = document.createElement("canvas");
        image.width = bitmap.width;
        image.height = bitmap.height;
        const context = image.getContext("2d")!;
        context.drawImage(bitmap, 0, 0);
        bitmap.close();
        return context.getImageData(0, 0, image.width, image.height).data;
      };
      const [left, right] = await Promise.all([pixels(first!), pixels(second!)]);
      // Allow one channel unit of GPU rounding; any land-colored pixel still fails.
      return left.some((value, index) => Math.abs(value - right[index]!) > 1);
    }, [Array.from(start), Array.from(sky)]);
    expect(hasLand, "land must start entirely above the visible sky").toBe(false);
    await page.clock.runFor(2300);
    await expect(page.locator(".map-canvas")).toHaveAttribute("data-landing", "settled");
    expect((await page.screenshot({ clip, style, animations: "disabled" })).equals(sky)).toBe(false);
  });
}

test("default preview is the map, and awards reveal recipients without a modal", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("main", { name: "Hall of Fame map preview" })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.locator(".map-marker")).toHaveCount(3);
  await expect(page.locator(".site-header, .intro, .makers-panel, .test-controls, .pin-card")).toHaveCount(0);
  const pin = page.getByRole("button", { name: "Mock Mali", exact: true });
  await pin.focus();
  await expect(pin.locator(".marker-label")).toHaveCount(0);
  await expect(pin).not.toHaveAttribute("title");
  await page.keyboard.press("Enter");
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("region", { name: "ผู้ได้รับรางวัลในจังหวัด", exact: true })).toBeVisible();
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

test("geometry failure provides the accessible award directory", async ({ page }) => {
  await page.route("**/data/thailand-provinces.geojson", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText("แผนที่ไม่พร้อมใช้งาน");
  await expect(page.getByRole("region", { name: "รายชื่อรางวัลและนักเรียน" })).toBeVisible();
  await expect(page.locator(".directory-province")).toHaveCount(3);
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
  const fallback = page.locator(".directory-award").first();
  await expect(fallback).toBeVisible();
  await fallback.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".province-recipient")).toHaveCount(1);
});
