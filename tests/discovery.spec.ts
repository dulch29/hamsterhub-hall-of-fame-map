import { expect, test } from "@playwright/test";

for (const width of [320, 390, 1440]) {
  test(`province rows and student competitions remain usable at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?fixture=group");
    await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
    await page.getByRole("button", { name: /ดูผู้ได้รับรางวัลทั้งหมด/ }).press("Enter");
    const panel = page.locator(".province-recipients");
    await expect(panel).toBeVisible();
    const controlsReachable = () => page.locator(".map-controls button").evaluateAll((buttons) => buttons.every((button) => {
      const box = button.getBoundingClientRect();
      return button.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
    }));
    expect(await controlsReachable()).toBe(true);
    await expect(panel).toContainText("8 คน");
    const rows = panel.locator(".province-recipient");
    await expect(rows).toHaveCount(8);
    expect(await rows.evaluateAll((buttons) => new Set(buttons.map((b) => b.getAttribute("data-recipient-id"))).size)).toBe(8);
    await expect(panel).not.toContainText("Hidden Student");
    const box = (await panel.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(box.y + box.height).toBeLessThanOrEqual(844);
    await rows.last().scrollIntoViewIfNeeded();
    await expect(rows.last().locator(".pin-card__placeholder")).toBeVisible();
    await rows.last().press("Enter");
    await expect(page.locator(".student-preview")).toHaveAttribute("data-morph", "open");
    expect(await controlsReachable()).toBe(true);
    await expect(page.locator(".student-competition")).toHaveCount(1);
    await page.locator(".student-competition").press("Enter");
    await expect(page.locator(".competition-presentation h3")).toContainText("Creative Coding");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("link", { name: /ดูโปรไฟล์/ })).toBeVisible();
    await page.screenshot({ path: test.info().outputPath(`profile-${width}.png`) });
    await page.keyboard.press("Escape");
    await expect(rows.last()).toBeFocused();
    await rows.first().press("Enter");
    await expect(page.locator(".student-competition").first()).toContainText("Creative Coding");
    await page.getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).press("Enter");
    await expect(rows.first()).toBeFocused();
    await page.screenshot({ path: test.info().outputPath(`province-${width}.png`) });
    await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).press("Enter");
    await expect(panel).toHaveCount(0);
    await expect(page.locator(".discovery-all")).toBeFocused();
    await expect(page.locator(".recipient-bubble[data-recipient-id]")).toHaveCount(4);
    await page.keyboard.press("Escape");
    await expect(page.locator(".award-discovery")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Mock Mali", exact: true })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    expect(errors).toEqual([]);
  });
}

test("direct directory uses the same deduplicated province panel without loading WebGL", async ({ page }) => {
  const sceneRequests: string[] = [];
  page.on("request", (request) => {
    if (/ThailandMap.*\.(js|tsx)/.test(request.url())) sceneRequests.push(request.url());
  });
  await page.goto("/?view=recipients&fixture=group");
  await expect(page.locator(".directory-province")).toHaveCount(1);
  await expect(page.locator(".directory-award")).toContainText("8 คน");
  await page.getByRole("searchbox").fill("not-a-person");
  await expect(page.locator(".directory-award")).toHaveCount(0);
  await page.getByRole("searchbox").fill("Mali");
  const province = page.locator(".directory-award");
  await province.press("Enter");
  await expect(page.locator(".province-recipient")).toHaveCount(8);
  await page.locator(".province-recipient").first().press("Enter");
  await expect(page.locator(".student-competition").first()).toContainText("Creative Coding");
  await page.getByRole("button", { name: "ปิดกลับแผนที่หรือรายชื่อ ×", exact: true }).press("Enter");
  await expect(province).toBeFocused();
  expect(sceneRequests).toEqual([]);
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("province switching, project empty state, Reset and reduced-motion changes discard stale content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await page.locator(".recipient-bubble[data-recipient-id]").first().press("Enter");
  await expect(page.locator(".student-competition").first()).toContainText("Creative Coding");
  await page.getByRole("button", { name: "☷ ดูรายชื่อ", exact: true }).press("Enter");
  await page.locator(".directory-award").filter({ hasText: "Phuket" }).press("Enter");
  await expect(page.locator(".student-preview")).toHaveCount(0);
  await expect(page.locator(".province-recipient")).toHaveCount(1);
  await page.locator(".province-recipient").press("Enter");
  await page.locator(".student-competition").press("Enter");
  await expect(page.locator(".student-preview")).toContainText("ยังไม่ได้เชื่อมผลงานกับการแข่งขันนี้");
  await page.getByRole("button", { name: "ปิดกลับแผนที่หรือรายชื่อ ×", exact: true }).press("Enter");
  await page.getByRole("button", { name: "◈ ดูแผนที่", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Reset map view" }).press("Enter");
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-camera-zoom", "1.00000");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Pause starlight" }).press("Enter");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-award-motion", "paused");
  await page.getByRole("button", { name: "Mock Niran", exact: true }).press("Enter");
  await expect(page.locator(".recipient-bubble[data-recipient-id]")).toHaveCount(1);
});

test("directory combines name and province filters and the preview rejects unsafe links", async ({ page }) => {
  await page.goto("/?view=recipients");
  const search = page.getByRole("searchbox");
  const province = page.getByRole("combobox", { name: "จังหวัด", exact: true });
  await search.fill("Niran");
  await expect(page.locator(".directory-award")).toHaveCount(1);
  await province.selectOption("TH-10");
  await expect(page.locator(".directory-award")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("ไม่พบรายชื่อ");
  await province.selectOption("TH-50");
  const entry = page.locator(".directory-award");
  await entry.press("Enter");
  await page.keyboard.press("Escape");
  await expect(entry).toBeFocused();
  await expect(search).toHaveValue("Niran");
  await expect(province).toHaveValue("TH-50");
  await page.goto("/?view=recipients&fixture=group");
  await page.locator(".directory-award").press("Enter");
  await page.locator(".province-recipient").nth(6).press("Enter");
  await expect(page.locator(".student-preview")).toContainText("ยังไม่มีลิงก์โปรไฟล์ที่ใช้งานได้");
  await expect(page.locator('.student-preview a[href^="javascript:"]')).toHaveCount(0);
});
