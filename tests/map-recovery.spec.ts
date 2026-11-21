import { expect, test } from "@playwright/test";

test("temporary WebGL loss restores the same map and selected profile", async ({ page }) => {
  await page.addInitScript(() => {
    const original = WebGL2RenderingContext.prototype.drawElements;
    const counters = window as Window & { mapDraws?: number };
    counters.mapDraws = 0;
    WebGL2RenderingContext.prototype.drawElements = function (...args: Parameters<typeof original>) {
      counters.mapDraws!++;
      return original.apply(this, args);
    };
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await page.locator(".recipient-bubble[data-recipient-id]").first().press("Enter");
  await expect(page.locator(".student-preview")).toHaveAttribute("data-morph", "open");
  const canvas = await page.locator("canvas").elementHandle();
  await canvas!.evaluate((node) => {
    if (!(node instanceof HTMLCanvasElement)) throw new Error("Expected map canvas");
    const gl = node.getContext("webgl2")!;
    const extension = gl.getExtension("WEBGL_lose_context")!;
    if (!extension) throw new Error("Context-loss test extension unavailable");
    (window as Window & { restoreMapContext?: () => void }).restoreMapContext = () => extension.restoreContext();
    extension.loseContext();
  });
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "recovering", { timeout: 5000 });
  await expect(page.locator(".student-preview")).toHaveAttribute("data-morph", "open");
  const drawsWhileLost = await page.evaluate(() => (window as Window & { mapDraws?: number }).mapDraws!);
  await page.evaluate(() => (window as Window & { restoreMapContext?: () => void }).restoreMapContext!());
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "ready");
  await expect.poll(() => page.evaluate(() => (window as Window & { mapDraws?: number }).mapDraws!)).toBeGreaterThan(drawsWhileLost);
  expect(await canvas!.evaluate((node) => node instanceof HTMLCanvasElement
    && node.isConnected && !node.getContext("webgl2")!.isContextLost())).toBe(true);
  await canvas!.evaluate((node) => {
    if (!(node instanceof HTMLCanvasElement)) throw new Error("Expected map canvas");
    node.getContext("webgl2")!.getExtension("WEBGL_lose_context")!.loseContext();
  });
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "recovering");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await page.evaluate(() => (window as Window & { restoreMapContext?: () => void }).restoreMapContext!());
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "ready");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await expect(page.locator(".recipient-bubble[data-recipient-id]")).toHaveCount(1);
});

test("a failed scene download can reload the page into a working map", async ({ page }) => {
  const sceneModule = /\/(?:assets\/ThailandMap-[^/]+\.js|src\/scene\/ThailandMap\.tsx)(?:\?.*)?$/;
  await page.route(sceneModule, (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("main")).toHaveAttribute("data-map-failure", "scene");
  await expect(page.locator(".map-failure__province")).toHaveCount(3);
  await page.unroute(sceneModule);
  await page.getByRole("button", { name: "ลองโหลดแผนที่อีกครั้ง" }).press("Enter");
  await expect(page.getByRole("button", { name: "Mock Mali", exact: true })).toBeVisible();
});

test("unrestored context falls back after a bounded wait and a user can retry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Mock Mali", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await page.locator("canvas").evaluate((node) => {
    if (!(node instanceof HTMLCanvasElement)) throw new Error("Expected map canvas");
    const extension = node.getContext("webgl2")!.getExtension("WEBGL_lose_context");
    if (!extension) throw new Error("Context-loss test extension unavailable");
    extension.loseContext();
  });
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "recovering");
  await expect(page.locator("main")).toHaveAttribute("data-map-failure", "context-timeout");
  await expect(page.locator(".map-failure__province")).toHaveCount(3);
  await expect(page.locator(".province-recipient")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.locator(".map-failure__province").first()).toBeFocused();
  await page.getByRole("button", { name: "ลองโหลดแผนที่อีกครั้ง" }).press("Enter");
  await expect(page.getByRole("button", { name: "Mock Mali", exact: true })).toBeVisible();
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "ready");
  await expect(page.locator(".guide-launcher")).toBeFocused();
});

test("WebGL initialization failure has a retry when context creation becomes available", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    (window as Window & { blockMapContext?: boolean }).blockMapContext = true;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.includes("webgl") && (window as Window & { blockMapContext?: boolean }).blockMapContext) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator("main")).toHaveAttribute("data-map-failure", "webgl-init");
  await page.evaluate(() => { (window as Window & { blockMapContext?: boolean }).blockMapContext = false; });
  await page.getByRole("button", { name: "ลองโหลดแผนที่อีกครั้ง" }).press("Enter");
  await expect(page.getByRole("button", { name: "Mock Mali", exact: true })).toBeVisible();
});

test("repeated map failure and retry disposes old contexts and keeps discovery usable", async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (let attempt = 0; attempt < 3; attempt++) {
    await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
    await page.locator(".recipient-bubble[data-recipient-id]").first().press("Enter");
    await expect(page.locator(".student-competition").first()).toContainText("Creative Coding");
    const canvas = await page.locator("canvas").elementHandle();
    await canvas!.evaluate((node) => {
      if (!(node instanceof HTMLCanvasElement)) throw new Error("Expected map canvas");
      node.getContext("webgl2")!.getExtension("WEBGL_lose_context")!.loseContext();
    });
    await expect(page.locator("main")).toHaveAttribute("data-map-failure", "context-timeout", { timeout: 15000 });
    expect(await canvas!.evaluate((node) => node instanceof HTMLCanvasElement
      && !node.isConnected && node.getContext("webgl2")!.isContextLost())).toBe(true);
    await page.getByRole("button", { name: "ลองโหลดแผนที่อีกครั้ง" }).press("Enter");
    await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "ready");
  }
  await expect(page.getByRole("button", { name: "Mock Mali", exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("one transient geometry response does not permanently remove the map", async ({ page }) => {
  let attempts = 0;
  await page.route("**/data/thailand-provinces.geojson", (route) => ++attempts === 1
    ? route.fulfill({ status: 503, body: "" }) : route.continue());
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Mock Mali", exact: true })).toBeVisible({ timeout: 15000 });
  expect(attempts).toBe(2);
  await expect(page.locator(".map-failure")).toHaveCount(0);
});

test("persistent geometry failure keeps recipients accessible and can be retried", async ({ page }) => {
  await page.route("**/data/thailand-provinces.geojson", (route) => route.fulfill({ status: 503, body: "" }));
  await page.goto("/");
  await expect(page.locator(".map-failure")).toContainText("แผนที่ไม่พร้อมใช้งาน");
  await page.locator(".map-failure__province").first().press("Enter");
  await page.locator(".province-recipient").first().press("Enter");
  await expect(page.locator(".student-competition").first()).toContainText("Creative Coding");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await page.unroute("**/data/thailand-provinces.geojson");
  await page.getByRole("button", { name: "ลองโหลดแผนที่อีกครั้ง" }).press("Enter");
  await expect(page.getByRole("button", { name: "Mock Mali", exact: true })).toBeVisible();
  await expect(page.locator(".map-failure")).toHaveCount(0);
});
