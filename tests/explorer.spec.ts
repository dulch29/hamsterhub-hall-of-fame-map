import { test, expect } from "@playwright/test";
test("default map renders three makers and opens a pin card", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".map-marker")).toHaveCount(3);
  await expect(page.locator(".maker-row")).toHaveCount(3);
  await page.locator(".map-marker").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close student card" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(errors).toEqual([]);
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
});
test("combined filters, no results, reset and missing project", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Filter by province").selectOption("TH-50");
  await expect(page.locator(".maker-row")).toHaveCount(1);
  await page.getByRole("searchbox").fill("mali");
  await expect(page.getByText("No makers found")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".maker-row")).toHaveCount(3);
  await page.getByRole("button", { name: /Mock Ploy Phuket/ }).click();
  await expect(
    page.getByRole("dialog").getByText("No featured project yet"),
  ).toBeVisible();
});
test("keyboard list opens modal and Escape restores focus", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "☷ List", exact: true }).click();
  const row = page.locator(".maker-row").first();
  await row.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close student card" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(row).toBeFocused();
});
test("500 dense makers stay reachable through cluster list", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Test dataset").selectOption("dense");
  await expect(page.locator(".maker-row")).toHaveCount(500);
  const cluster = page.locator(".cluster-marker").first();
  await expect(cluster).toBeVisible();
  await cluster.click();
  await expect(
    page.getByRole("heading", { name: "Makers in this group" }),
  ).toBeVisible();
  const count = await page.locator(".maker-row").count();
  expect(count).toBeGreaterThan(1);
  await page.locator(".maker-row").last().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Show all results" }).click();
  await expect(page.locator(".maker-row")).toHaveCount(500);
  await page.getByRole("button", { name: "Reset map view" }).click();
  await expect(page.locator(".maker-row")).toHaveCount(500);
});
test("spread stress mode and edge fixture opt-out", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Test dataset").selectOption("spread");
  await expect(page.locator(".maker-row")).toHaveCount(500);
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.getByLabel("Test dataset").selectOption("edges");
  await expect(page.locator(".maker-row")).toHaveCount(4);
  expect(await page.content()).not.toContain("fixture-opted-out");
  await expect(page.locator('.map-marker[aria-label*="Hidden"]')).toHaveCount(
    0,
  );
  await page.getByRole("searchbox").fill("Hidden");
  await expect(page.locator(".maker-row")).toHaveCount(0);
});
test("WebGL unavailable automatically falls back to list", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes("webgl")) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("/");
  await expect(
    page.getByText(
      "3D is unavailable in this browser. Explore the same students in the list.",
    ),
  ).toBeVisible();
  await expect(page.locator(".maker-row")).toHaveCount(3);
  await page.locator(".maker-row").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
test("context loss switches to list without losing data", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".map-marker")).toHaveCount(3);
  await page
    .locator("canvas")
    .evaluate((canvas) =>
      canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
    );
  await expect(page.locator(".is-list")).toBeVisible();
  await expect(page.locator(".maker-row")).toHaveCount(3);
});
test("geometry failure retains searchable list and province names", async ({
  page,
}) => {
  await page.route("**/data/thailand-provinces.geojson", (route) =>
    route.fulfill({ status: 503, body: "" }),
  );
  await page.goto("/");
  await expect(
    page.getByText(
      "Map data could not load. You can still explore every student below.",
    ),
  ).toBeVisible();
  await page.getByLabel("Filter by province").selectOption("TH-83");
  await expect(page.locator(".maker-row")).toHaveCount(1);
});
for (const width of [320, 390])
  test(`mobile ${width}px has no overflow and cards work`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".map-marker")).toHaveCount(3);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator(".maker-row").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    expect(
      await page
        .getByRole("dialog")
        .evaluate((el) => el.getBoundingClientRect().width),
    ).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
    await page.screenshot({
      path: `test-results/mobile-${width}.png`,
      fullPage: true,
    });
  });

test("filtering preserves the renderer, zoom and marker location", async ({
  page,
}) => {
  await page.goto("/");
  const marker = page.locator('.map-marker[aria-label="Mock Mali"]');
  await expect(marker).toBeVisible();
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  await page
    .locator("canvas")
    .evaluate((el) => (el.dataset.identity = "original-renderer"));
  const before = await marker.boundingBox();
  await page.getByRole("searchbox").fill("Mali");
  await expect(page.locator(".maker-row")).toHaveCount(1);
  await expect(page.locator("canvas")).toHaveAttribute(
    "data-identity",
    "original-renderer",
  );
  const after = await marker.boundingBox();
  expect(Math.abs(before!.x - after!.x)).toBeLessThan(1);
  expect(Math.abs(before!.y - after!.y)).toBeLessThan(1);
  for (let i = 0; i < 10; i++) {
    await page.getByRole("searchbox").fill(i % 2 ? "Mali" : "");
  }
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(page.locator("canvas")).toHaveAttribute(
    "data-identity",
    "original-renderer",
  );
});
test("firefly decoration pauses without moving the clickable target", async ({ page }) => {
  await page.goto("/");
  const pin = page.locator(".map-marker").first();
  await expect(pin).toBeVisible();
  const before = await pin.boundingBox();
  await expect(pin.locator(".marker-spark")).toHaveCount(3);
  await page.getByRole("button", { name: "Pause sparkles" }).click();
  await expect(page.locator(".map-stage")).toHaveAttribute("data-motion", "paused");
  expect(await pin.locator(".marker-spark").first().evaluate(
    (el) => getComputedStyle(el).animationPlayState,
  )).toBe("paused");
  expect(await pin.boundingBox()).toEqual(before);
  await page.getByRole("button", { name: "Resume sparkles" }).click();
  expect(await pin.locator(".marker-spark").first().evaluate(
    (el) => getComputedStyle(el).animationPlayState,
  )).toBe("running");
});

test("reduced motion removes ambient loops and uses immediate camera controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".map-marker")).toHaveCount(3);
  expect(await page.locator(".marker-spark").first().evaluate(
    (el) => getComputedStyle(el).animationName,
  )).toBe("none");
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  await page.locator(".maker-row").first().click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".maker-row").first()).toBeFocused();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  expect(await page.locator(".marker-spark").first().evaluate(
    (el) => getComputedStyle(el).animationName,
  )).toBe("firefly-drift");
});

test("camera travel can be interrupted and card exit retains the modal until finished", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".map-marker")).toHaveCount(3);
  await page.getByRole("button", { name: "Zoom in", exact: true }).evaluate(
    (el) => el.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 })),
  );
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "true");
  await page.locator("canvas").dispatchEvent("pointerdown", {
    pointerId: 1, pointerType: "mouse", button: 0, clientX: 300, clientY: 500,
  });
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  await page.locator("canvas").dispatchEvent("pointerup", { pointerId: 1, pointerType: "mouse" });
  await page.locator(".maker-row").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.getByRole("button", { name: "Close student card" }).evaluate(
    (el) => (el as HTMLButtonElement).click(),
  );
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".maker-row").first()).toBeFocused();
});

test("pointer cluster travel restores marker focus without focusing the map host", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Test dataset").selectOption("dense");
  const cluster = page.locator(".cluster-marker").first();
  await expect(cluster).toBeVisible();
  await page.locator(".map-canvas").evaluate((el) => {
    el.dataset.focusCount = "0";
    el.addEventListener("focus", () => {
      el.dataset.focusCount = String(Number(el.dataset.focusCount) + 1);
    });
  });
  await cluster.click();
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-focus-count", "0");
  await expect(page.locator(".map-markers button:focus")).toHaveCount(1);
});
test("skip link reaches list and removed map invoker restores to its list row", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".map-marker")).toHaveCount(3);
  const skip = page.getByRole("link", { name: "Skip to student list" });
  await skip.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#student-list")).toBeFocused();
  const marker = page.locator('.map-marker[aria-label="Mock Mali"]');
  await marker.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await marker.evaluate((el) => el.remove());
  await page.keyboard.press("Escape");
  await expect(
    page.locator(".maker-row").filter({ hasText: "Mock Mali" }),
  ).toBeFocused();
});
test("card ignores drag out and dismisses a true backdrop click", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".maker-row").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const heading = await dialog.getByRole("heading", { level: 2 }).boundingBox();
  await page.mouse.move(heading!.x + 10, heading!.y + 10);
  await page.mouse.down();
  await page.mouse.move(5, 5);
  await page.mouse.up();
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dialog).toHaveCount(0);
});
