import { expect, test } from "@playwright/test";

test("thought dots and content bubbles share the glossy film and contrast fallback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?fixture=group");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  const dots = page.locator(".thought-trail > span");
  await expect(dots.first()).toBeVisible();
  const film = async (selector: string) => page.locator(selector).first().evaluate((element) => {
    const base = getComputedStyle(element);
    return [base.backgroundImage, base.backgroundColor, base.backdropFilter,
      getComputedStyle(element, "::before").backgroundImage, getComputedStyle(element, "::after").backgroundImage];
  });
  const portrait = await film(".recipient-orb");
  expect(portrait[0]).not.toBe("none");
  expect(portrait[3]).not.toBe("none");
  expect(await film(".thought-trail > span")).toEqual(portrait);
  expect(await film(".discovery-all .recipient-orb")).toEqual(portrait);
  const sizes = await dots.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().width));
  expect(new Set(sizes).size).toBeGreaterThan(1);
  await page.screenshot({ path: test.info().outputPath("shared-glossy-film.png") });
  await page.emulateMedia({ contrast: "more" });
  expect(await film(".thought-trail > span")).toEqual(await film(".recipient-orb"));
});
