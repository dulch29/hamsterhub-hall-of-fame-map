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

test("sample awards zoom to their anchors and repeated activation stays stable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const pin = page.getByRole("button", { name: "Mock Niran", exact: true });
  await expect(pin).toHaveAttribute("aria-description", "Silver medal sample artwork");
  const before = await pin.boundingBox();
  await pin.click();
  const map = page.locator(".map-canvas");
  await expect(map).toHaveAttribute("data-moving", "false");
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  const after = await pin.boundingBox();
  const viewport = page.viewportSize()!;
  expect(Math.abs(after!.x + after!.width / 2 - viewport.width / 2)).toBeLessThan(4);
  expect(Math.abs(after!.y + after!.height / 2 - viewport.height / 2)).toBeLessThan(4);
  expect(Math.abs(after!.y - before!.y)).toBeGreaterThan(50);
  await pin.click();
  expect(await pin.boundingBox()).toEqual(after);
  await page.getByRole("button", { name: "Reset map view" }).click();
  await expect(pin).toHaveAttribute("aria-pressed", "false");
  const reset = await pin.boundingBox();
  expect(Math.abs(reset!.x - before!.x)).toBeLessThan(1);
  expect(Math.abs(reset!.y - before!.y)).toBeLessThan(1);
});

for (const groupWidth of [320, 1440]) {
test(`a selected award remains reachable beside its coincident group at ${groupWidth}px`, async ({ page }) => {
  await page.setViewportSize({ width: groupWidth, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/data/thailand-provinces.geojson", async (route) => {
    const response = await route.fetch();
    const data = await response.json();
    for (const feature of data.features) {
      if (["TH-10", "TH-50", "TH-83"].includes(feature.properties.code))
        feature.geometry = { type: "Polygon", coordinates: [[[100.5, 13.7], [100.5001, 13.7],
          [100.5001, 13.7001], [100.5, 13.7001], [100.5, 13.7]]] };
    }
    await route.fulfill({ response, json: data });
  });
  await page.goto("/");
  for (let i = 0; i < 5; i++) {
    const group = page.getByRole("button", { name: "Explore 3 makers. Zoom in or choose from the group list.", exact: true });
    await expect(group).toBeVisible();
    await group.focus();
    await page.keyboard.press("Enter");
  }
  const pin = page.getByRole("button", { name: "Mock Ploy", exact: true });
  await expect(pin).toBeVisible();
  await pin.focus();
  await page.keyboard.press("Enter");
  await expect(pin).toBeFocused();
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  const group = page.getByRole("button", { name: "Explore 2 makers. Zoom in or choose from the group list.", exact: true });
  await expect(group).toBeVisible();
  const selectedBox = await pin.boundingBox(), groupBox = await group.boundingBox();
  expect(Math.hypot(selectedBox!.x + selectedBox!.width / 2 - groupBox!.x - groupBox!.width / 2,
    selectedBox!.y + selectedBox!.height / 2 - groupBox!.y - groupBox!.height / 2)).toBeGreaterThan(64);
  await group.click();
  await expect(page.getByRole("button", { name: "Mock Mali", exact: true })).toBeVisible();
  const other = await page.getByRole("button", { name: "Mock Mali", exact: true }).boundingBox();
  expect(Math.hypot(other!.x + other!.width / 2 - selectedBox!.x - selectedBox!.width / 2,
    other!.y + other!.height / 2 - selectedBox!.y - selectedBox!.height / 2)).toBeGreaterThan(64);
});
}

test("pointer selection travels and reset restores marker alignment after a tilt", async ({ page }) => {
  await page.goto("/");
  const pin = page.getByRole("button", { name: "Mock Niran", exact: true });
  await expect(pin).toBeVisible();
  const before = await pin.boundingBox();
  const moving = await pin.evaluate((button) => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    return document.querySelector(".map-canvas")?.getAttribute("data-moving");
  });
  expect(moving).toBe("true");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  await page.mouse.move(600, 500);
  await page.mouse.down({ button: "right" });
  await page.mouse.move(700, 560, { steps: 4 });
  await page.mouse.up({ button: "right" });
  const reset = page.getByRole("button", { name: "Reset map view" });
  await reset.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  const after = await pin.boundingBox();
  expect(Math.abs(after!.x - before!.x)).toBeLessThan(1);
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(1);
});

test("background click clears selection and keyboard zoom moves immediately", async ({ page }) => {
  await page.goto("/");
  const pin = page.getByRole("button", { name: "Mock Mali", exact: true });
  await pin.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  await page.locator("canvas").click({ position: { x: 15, y: 100 } });
  await expect(pin).toHaveAttribute("aria-pressed", "false");
  await pin.focus();
  await page.keyboard.press("Enter");
  const zoom = page.getByRole("button", { name: "Zoom in", exact: true });
  await zoom.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");
  await expect(pin).toHaveAttribute("aria-pressed", "false", { timeout: 1000 });
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
