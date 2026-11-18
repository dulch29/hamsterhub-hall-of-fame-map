import { test, expect, type Page } from "@playwright/test";

// The 21-page traversal repeatedly inspects a 500-row accessibility tree.
// Retain action/network traces without recording every animated canvas frame
// and duplicate DOM snapshot in the software-rendered test environment.
test.use({ trace: { mode: "retain-on-failure", screenshots: false, snapshots: false, sources: true } });

async function coincidentBangkok(page: Page) {
  await page.route("**/data/thailand-provinces.geojson", async (route) => {
    const response = await route.fetch();
    const data = await response.json();
    const bangkok = data.features.find(
      (feature: { properties: { code: string } }) =>
        feature.properties.code === "TH-10",
    );
    // Tiny synthetic boundary guarantees overlap at every supported zoom.
    bangkok.geometry = {
      type: "Polygon",
      coordinates: [
        [
          [100.5, 13.7],
          [100.5001, 13.7],
          [100.5001, 13.7001],
          [100.5, 13.7001],
          [100.5, 13.7],
        ],
      ],
    };
    await route.fulfill({ response, json: data });
  });
}

async function expandGroup(page: Page, count: number) {
  const cluster = page.getByRole("button", {
    name: `Explore ${count} makers. Zoom in or choose from the group list.`,
    exact: true,
  });
  for (let i = 0; i < 5; i++) {
    await expect(cluster).toBeVisible();
    await cluster.focus();
    await page.keyboard.press("Enter");
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    await expect(page.locator(".map-markers button:focus")).toHaveCount(1);
  }
}

test("dense max-zoom fan-out pages all makers inside map", async ({ page }) => {
  test.setTimeout(90000);
  await coincidentBangkok(page);
  await page.goto("/");
  await page.getByLabel("Test dataset").selectOption("dense");
  await expandGroup(page, 500);
  const pins = page.locator(".map-marker:not(.cluster-marker)");
  const pager = page.getByRole("button", { name: /^Next makers in group/ });
  await expect(pins).toHaveCount(24);
  await expect(pager).toHaveAccessibleName(/Page 1 of 21/);
  await expect(page.locator('[aria-live="polite"].map-status')).toHaveText(
    "Showing makers 1 to 24 of 500",
  );
  const ids = new Set<string>();
  for (let i = 0; i < 21; i++) {
    for (const id of await pins.evaluateAll((els) =>
      els.map((el) => (el as HTMLElement).dataset.id!),
    ))
      ids.add(id);
    const bounds = await page.locator(".map-canvas").boundingBox();
    for (const box of await pins.evaluateAll((els) =>
      els.map((el) => {
        const b = el.getBoundingClientRect();
        return { x: b.x, y: b.y, right: b.right, bottom: b.bottom };
      }),
    )) {
      expect(box.x).toBeGreaterThanOrEqual(bounds!.x);
      expect(box.y).toBeGreaterThanOrEqual(bounds!.y);
      expect(box.right).toBeLessThanOrEqual(bounds!.x + bounds!.width);
      expect(box.bottom).toBeLessThanOrEqual(bounds!.y + bounds!.height);
    }
    await pager.click();
    await expect(pager).toBeFocused();
    await expect(pager).toHaveAccessibleName(
      new RegExp(`Page ${((i + 1) % 21) + 1} of 21`),
    );
  }
  expect(ids.size).toBe(500);
  await expect(page.locator(".maker-row")).toHaveCount(500);
  await pins.first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("small max-zoom group fans out and collapses on zoom", async ({
  page,
}) => {
  await coincidentBangkok(page);
  await page.goto("/");
  await page.getByLabel("Test dataset").selectOption("group");
  await expandGroup(page, 8);
  await expect(page.locator(".map-marker:not(.cluster-marker)")).toHaveCount(8);
  await page.getByRole("button", { name: "Zoom out", exact: true }).click();
  await expect(page.locator(".cluster-marker")).toHaveCount(1);
  await expect(page.locator(".map-marker:not(.cluster-marker)")).toHaveCount(0);
  await expect(page.locator(".maker-row")).toHaveCount(8);
});
