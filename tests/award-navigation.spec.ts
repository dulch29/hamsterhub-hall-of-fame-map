import { expect, test } from "@playwright/test";

for (const fixture of ["", "?fixture=group"]) {
  test(`award and visible bubble composition are centered on wide screens ${fixture || "single"}`, async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1040 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${fixture}`);
    const medal = page.getByRole("button", { name: "Mock Mali", exact: true });
    await medal.press("Enter");
    await expect(page.locator(".recipient-bubble[data-recipient-id]")).toHaveCount(fixture ? 4 : 1);
    const rectangles = await page.locator('.recipient-bubble, .map-marker[aria-pressed="true"]').evaluateAll((elements) =>
      elements.map((element) => { const rect = element.getBoundingClientRect(); return { left: rect.left, right: rect.right }; }));
    const center = (Math.min(...rectangles.map((rect) => rect.left)) + Math.max(...rectangles.map((rect) => rect.right))) / 2;
    expect(Math.abs(center - 960)).toBeLessThan(20);
    await page.screenshot({ path: test.info().outputPath(`centered-${fixture ? "group" : "single"}.png`) });
  });
}

for (const level of ["bubbles", "list", "project"]) {
  test(`empty map click exits ${level} and restores the saved overview`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const map = page.locator(".map-canvas");
    const medal = page.getByRole("button", { name: "Mock Mali", exact: true });
    await expect(medal).toBeVisible();
    const target = (await map.getAttribute("data-camera-target"))!;
    const tilt = (await map.getAttribute("data-camera-tilt"))!;
    await medal.press("Enter");
    if (level === "list") await page.locator(".discovery-all").click();
    if (level === "project") await page.locator(".recipient-bubble[data-recipient-id]").click();
    await page.locator("canvas").click({ position: { x: 40, y: 600 } });
    await expect(page.locator(".award-discovery")).toHaveCount(0);
    await expect(map).toHaveAttribute("data-camera-target", target);
    await expect(map).toHaveAttribute("data-camera-tilt", tilt);
    await expect(map).toHaveAttribute("data-camera-zoom", "1.00000");
    await expect(medal).toBeFocused();
  });
}

test("phone tap exits an animated project and restores the user's adjusted overview", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const map = page.locator(".map-canvas");
  await expect(map).toHaveAttribute("data-landing", "settled");
  await page.mouse.move(35, 600);
  await page.mouse.down();
  await page.mouse.move(85, 630, { steps: 5 });
  await page.mouse.up();
  await page.mouse.wheel(0, -180);
  const saved = await map.evaluate((element) => ({
    target: element.getAttribute("data-camera-target")!,
    angle: element.getAttribute("data-camera-angle")!,
    tilt: element.getAttribute("data-camera-tilt")!,
    zoom: element.getAttribute("data-camera-zoom")!,
  }));
  const medal = page.getByRole("button", { name: "Mock Mali", exact: true });
  await medal.press("Enter");
  await page.locator(".discovery-all").click();
  await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).click();
  await expect(page.locator(".discovery-all")).toBeFocused();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator(".recipient-bubble[data-recipient-id]").click();
  await expect(page.locator(".student-preview")).toHaveAttribute("data-morph", "open");
  expect(await page.evaluate(() => document.elementFromPoint(6, 240)?.tagName)).toBe("CANVAS");
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 2 });
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 6, y: 240, id: 1 }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await session.detach();
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await expect(map).toHaveAttribute("data-moving", "false");
  for (const [key, value] of Object.entries(saved)) await expect(map).toHaveAttribute(`data-camera-${key}`, value);
  await expect(medal).toBeFocused();
});
