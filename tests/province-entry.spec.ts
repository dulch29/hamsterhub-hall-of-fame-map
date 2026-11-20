import { expect, test } from "@playwright/test";

test("province selection preserves camera and rotation keeps the panel open", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const map = page.locator(".map-canvas");
  await expect(map).toHaveAttribute("data-landing", "settled");
  const home = await map.getAttribute("data-camera-target");
  const tilt = await map.getAttribute("data-camera-tilt");
  const mali = page.getByRole("button", { name: "Mock Mali", exact: true });
  const location = await mali.boundingBox();
  await mali.press("Enter");
  await expect(page.getByRole("region", { name: "ผู้ได้รับรางวัลในจังหวัด" })).toBeVisible();
  expect(await mali.boundingBox()).toEqual(location);
  await page.getByRole("button", { name: "Rotate map left" }).press("Enter");
  await expect(mali).toHaveAttribute("aria-pressed", "true");
  await expect(map).toHaveAttribute("data-camera-target", home!);
  await expect(map).toHaveAttribute("data-camera-tilt", tilt!);
  await page.keyboard.press("Escape");
  await expect(mali).toBeFocused();
  await expect(mali).toHaveAttribute("aria-pressed", "false");
});

for (const width of [320, 390, 1440]) {
  test(`drag, wheel, pinch and resize preserve pivot and tilt at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const map = page.locator(".map-canvas");
    await expect(map).toHaveAttribute("data-landing", "settled");
    const target = (await map.getAttribute("data-camera-target"))!;
    const tilt = (await map.getAttribute("data-camera-tilt"))!;
    const angle = await map.getAttribute("data-camera-angle");
    await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
    await page.mouse.move(50, 190);
    await page.mouse.down();
    await page.mouse.move(100, 230, { steps: 5 });
    await page.mouse.up();
    await expect(map).not.toHaveAttribute("data-camera-angle", angle!);
    await expect(map).toHaveAttribute("data-selected-province", "TH-10");
    await page.mouse.wheel(0, -250);
    await expect.poll(async () => Number(await map.getAttribute("data-camera-zoom"))).toBeGreaterThan(1);
    const session = await page.context().newCDPSession(page);
    await session.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 2 });
    const beforeTouch = await map.getAttribute("data-camera-angle");
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 55, y: 190, id: 1 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 105, y: 220, id: 1 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(map).not.toHaveAttribute("data-camera-angle", beforeTouch!);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 80, y: 190, id: 1 }, { x: 130, y: 190, id: 2 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 55, y: 190, id: 1 }, { x: 155, y: 190, id: 2 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await session.detach();
    await expect(map).toHaveAttribute("data-camera-target", target);
    await expect(map).toHaveAttribute("data-camera-tilt", tilt);
    const zoom = Number(await map.getAttribute("data-camera-zoom"));
    expect(zoom).toBeGreaterThan(1);
    expect(zoom).toBeLessThanOrEqual(2.5);
    await page.setViewportSize({ width: width === 1440 ? 1200 : width + 10, height: 800 });
    await expect(map).toHaveAttribute("data-camera-target", target);
    await expect(map).toHaveAttribute("data-camera-tilt", tilt);
    await expect(page.locator(".province-recipients")).toBeVisible();
    await page.getByRole("button", { name: "Reset map view" }).press("Enter");
    await expect(map).toHaveAttribute("data-camera-zoom", "1.00000");
    await expect(map).toHaveAttribute("data-camera-angle", angle!);
    await expect(page.locator(".province-journey")).toHaveCount(0);
  });
}

test("zoom bounds and Back keep the camera fixed with a usable focus target", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const map = page.locator(".map-canvas");
  const south = page.getByRole("button", { name: "Mock Ploy", exact: true });
  await south.press("Enter");
  const target = await map.getAttribute("data-camera-target");
  for (let step = 0; step < 4; step++) await page.getByRole("button", { name: "Zoom in", exact: true }).press("Enter");
  await expect(map).toHaveAttribute("data-camera-zoom", "2.50000");
  await expect(page.locator(".province-recipients")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".province-journey")).toHaveCount(0);
  await expect(map).toBeFocused();
  await expect(map).toHaveAttribute("data-camera-target", target!);
  await expect(map).toHaveAttribute("data-camera-zoom", "2.50000");
  for (let step = 0; step < 5; step++) await page.getByRole("button", { name: "Zoom out", exact: true }).press("Enter");
  await expect(map).toHaveAttribute("data-camera-zoom", "1.00000");
});

test("medal taps enter a province once and land taps do not open a panel", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const medal = page.getByRole("button", { name: "Mock Mali", exact: true });
  await medal.click();
  await expect(page.locator(".province-recipient")).toHaveCount(1);
  await page.locator(".province-recipient").press("Enter");
  await medal.click();
  await expect(page.locator(".student-preview")).toContainText("Hamster Maze");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await page.locator("canvas").click({ position: { x: 50, y: 190 } });
  await expect(page.locator(".province-journey")).toHaveCount(0);
});
