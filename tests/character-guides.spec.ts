import { expect, test, type Page } from "@playwright/test";

type SpeechProbe = { spoken: string[]; cancellations: number };
declare global {
  interface Window {
    speechProbe: SpeechProbe;
    __MASCOT_RNG?: () => number;
  }
}

async function installSpeechSpy(page: Page) {
  await page.addInitScript(() => {
    const probe: SpeechProbe = { spoken: [], cancellations: 0 };
    window.speechProbe = probe;
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: class {
        text: string;
        constructor(text: string) {
          this.text = text;
        }
      },
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        getVoices: () => [{ lang: "th-TH", localService: true, name: "Device voice" }],
        cancel: () => {
          probe.cancellations++;
        },
        speak: (utterance: { text: string }) => {
          probe.spoken.push(utterance.text);
        },
        addEventListener: () => {},
        removeEventListener: () => {},
      },
    });
  });
}

const spokenCount = (page: Page) => page.evaluate(() => window.speechProbe.spoken.length);

for (const width of [320, 390, 1440]) {
  test(`Guide hamster, chat bar, rivalry and student map takeover remain usable at ${width}px`, async ({ page }) => {
    await installSpeechSpy(page);
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    const cspViolations: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      (window as Window & { __cspViolations?: string[] }).__cspViolations = [];
      document.addEventListener("securitypolicyviolation", (event) => {
        (window as Window & { __cspViolations?: string[] }).__cspViolations?.push(
          `${event.violatedDirective}:${event.blockedURI}`,
        );
      });
    });

    await page.goto("/");
    await expect(page.getByRole("button", { name: "Mock Mali", exact: true })).toBeVisible();
    // Removed DOM controls and narration controls are absent; CC BY credit link and Hamster Hub brand link remain accessible.
    await expect(page.locator(".motion-toggle, .map-controls, .discovery-sound, .narration-controls")).toHaveCount(0);
    await expect(page.locator('a.credits-link[href="/credits.txt"]')).toBeVisible();
    await expect(page.locator('a.brand-mark[href="https://www.hamsterhub.co/"]')).toBeVisible();

    const guide = page.locator(".guide-panel");
    const guidesRoot = page.locator(".character-guides");
    await expect(guide).toHaveCount(0);
    await expect(guidesRoot).toHaveAttribute("data-scene", "tour");
    expect(await spokenCount(page)).toBe(0);

    const launcher = page.getByRole("button", { name: "เปิด Guide", exact: true });
    await launcher.click();
    await expect(guide.locator("textarea")).toBeFocused();
    await expect(page.locator(".guide-launcher")).toHaveAttribute("data-pose", "talk");
    if (width >= 1000) {
      const lBox = (await page.locator(".guide-launcher").boundingBox())!;
      const pBox = (await guide.boundingBox())!;
      expect(Math.abs(lBox.y - (pBox.y + pBox.height))).toBeLessThan(40);
    }
    await page.keyboard.press("Escape");
    await expect(guide).toHaveCount(0);
    await expect(launcher).toBeFocused();

    await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
    await expect(guidesRoot).toHaveAttribute("data-scene", "rivalry");
    await expect(page.locator(".guide-launcher")).toHaveAttribute("data-hidden-in-fight", "true");
    await expect(page.locator(".explainer")).toHaveAttribute("data-visible", "true");
    await expect(page.locator(".explainer")).toHaveAttribute("data-traveling", "false");
    await expect(page.locator(".explainer__caption")).toContainText("จังหวัดBangkok");
    await expect(page.locator(".explainer__body")).toHaveAttribute("src", /explainer-/);
    await expect(page.locator('img[src*="guide-"]')).toHaveCount(0);
    await page.screenshot({ path: test.info().outputPath(`explainer-bubbles-${width}.png`) });

    await page.locator(".discovery-all").click();
    await expect(page.locator(".province-recipients")).toBeVisible();
    await page.screenshot({ path: test.info().outputPath(`explainer-province-${width}.png`) });

    await page.locator(".province-recipient").first().press("Enter");
    await expect(page.locator(".explainer")).toHaveAttribute("data-visible", "true");
    await expect(page.locator(".explainer__caption")).toContainText("Mock Mali");
    await expect(page.locator(".explainer__caption")).toContainText("Hamster Maze");
    await page.screenshot({ path: test.info().outputPath(`explainer-student-${width}.png`) });

    await page.locator('.student-competition[data-competition-id="creative"]').press("Enter");
    await expect(page.locator(".explainer")).toHaveAttribute("data-visible", "false");
    await expect(page.locator(".student-presenter")).toHaveAttribute("data-visible", "true");
    await expect(page.locator(".student-presenter")).toContainText("Mali");
    await page.screenshot({ path: test.info().outputPath(`explainer-presentation-${width}.png`) });
    await expect(guidesRoot).toHaveAttribute("data-scene", "student-solo");
    expect(["guide", "explainer"]).toContain(await guidesRoot.getAttribute("data-winner"));

    await page.keyboard.press("Escape");
    await expect(page.locator(".explainer")).toHaveAttribute("data-visible", "true");
    await expect(page.locator(".student-presenter")).toHaveCount(0);
    await expect(page.locator(".student-preview")).toHaveAttribute("data-stage", "student");
    await page.getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).press("Enter");
    await expect(page.locator(".province-recipient")).toBeFocused();
    expect(await spokenCount(page)).toBe(0);
    expect(await page.evaluate(() => (window as Window & { __cspViolations?: string[] }).__cspViolations ?? [])).toEqual(cspViolations);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    expect(errors).toEqual([]);
  });
}

test("Phase 3 rivalry races both mascots on each project click and produces both random winners", async ({ page }) => {
  await installSpeechSpy(page);
  await page.addInitScript(() => {
    const seq = [0.15, 0.85];
    let idx = 0;
    window.__MASCOT_RNG = () => seq[idx++ % seq.length]!;
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  const guidesRoot = page.locator(".character-guides");
  await expect(guidesRoot).toHaveAttribute("data-scene", "rivalry");
  await expect(page.locator(".guide-launcher")).toHaveAttribute("data-pose", "argue");
  await page.locator(".recipient-bubble[data-recipient-id]").first().press("Enter");

  await page.locator('.student-competition[data-competition-id="creative"]').press("Enter");
  await expect(guidesRoot).toHaveAttribute("data-winner", "guide");
  await expect(page.locator(".student-presenter")).toHaveAttribute("data-winner", "guide");
  await expect(page.locator(".student-presenter__rivalry")).toHaveCount(0);
  await page.keyboard.press("Escape");

  await page.locator('.student-competition[data-competition-id="maker"]').press("Enter");
  await expect(guidesRoot).toHaveAttribute("data-winner", "explainer");
  await expect(page.locator(".student-presenter")).toHaveAttribute("data-winner", "explainer");
  await expect(page.locator(".student-presenter__rivalry")).toHaveCount(0);
  await expect(guidesRoot).toHaveAttribute("data-race-count", "2");
  expect(await spokenCount(page)).toBe(0);
});

test("Step-2 card fits slide controls and PDF footer in initial view across desktop, phone and landscape viewports", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const viewports = [
    [1024, 768],
    [1280, 800],
    [1366, 768],
    [1440, 844],
    [1920, 1080],
    [320, 844],
    [390, 844],
    [430, 932],
    [844, 390],
  ] as const;

  await page.goto("/");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await page.locator(".recipient-bubble[data-recipient-id]").first().press("Enter");
  await page.locator('.student-competition[data-competition-id="creative"]').press("Enter");

  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    const card = page.locator(".student-preview");
    const body = page.locator(".student-preview__body");
    const controls = page.locator(".presentation-controls");
    const pdf = page.locator(".student-preview .student-preview__document");
    await expect(controls).toBeVisible();
    await expect(pdf).toBeVisible();
    const fit = await page.evaluate(() => {
      const cardRect = document.querySelector(".student-preview")!.getBoundingClientRect();
      const bodyRect = document.querySelector(".student-preview__body")!.getBoundingClientRect();
      const ctrlRect = document.querySelector(".presentation-controls")!.getBoundingClientRect();
      const pdfRect = document.querySelector(".student-preview .student-preview__document")!.getBoundingClientRect();
      return {
        controlsInBody: ctrlRect.top >= bodyRect.top - 1 && ctrlRect.bottom <= bodyRect.bottom + 2,
        pdfInCard: pdfRect.top >= cardRect.top && pdfRect.bottom <= cardRect.bottom + 1,
        pdfHeight: pdfRect.height,
        scrollWidth: document.documentElement.scrollWidth,
      };
    });
    expect(fit.controlsInBody, `controls in initial view at ${width}x${height}`).toBe(true);
    expect(fit.pdfInCard, `PDF in footer at ${width}x${height}`).toBe(true);
    expect(fit.pdfHeight).toBeGreaterThanOrEqual(44);
    expect(fit.scrollWidth).toBeLessThanOrEqual(width);
    void card;
    void body;
  }
});

test("Explainer travel is interruptible, pauses on hidden tab or context recovery, and never calls speechSynthesis", async ({ page }) => {
  await installSpeechSpy(page);
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      if (this.classList.contains("explainer") && typeof options === "object") options = { ...options, duration: 3000 };
      return original.call(this, frames, options);
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).click();
  await expect(page.locator(".explainer")).toHaveAttribute("data-traveling", "true");
  await page.locator(".discovery-all").click();
  await expect(page.locator(".province-recipients")).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".character-guides")).toHaveAttribute("data-paused", "true");
  await expect(page.locator(".explainer")).toHaveAttribute("data-traveling", "false");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".character-guides")).toHaveAttribute("data-paused", "false");
  await page.locator("canvas").evaluate((canvas) => {
    const extension = (canvas as HTMLCanvasElement).getContext("webgl2")!.getExtension("WEBGL_lose_context")!;
    Object.assign(window, { restoreGuideContext: () => extension.restoreContext() });
    extension.loseContext();
  });
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "recovering");
  await page.evaluate(() => (window as unknown as { restoreGuideContext: () => void }).restoreGuideContext());
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "ready");
  expect(await spokenCount(page)).toBe(0);
});

test("student portrait and name do not stack at project presentation stage", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).click();
  await expect(page.locator(".explainer[data-visible=\"true\"]")).toBeVisible();
  await expect(page.locator(".guide-launcher")).toHaveAttribute("data-hidden-in-fight", "true");
  await page.locator(".recipient-bubble[data-recipient-id]").first().click();
  await page.locator('.student-competition[data-competition-id="creative"]').click();
  await expect(page.locator(".character-guides")).toHaveAttribute("data-stage", "presentation");
  await expect(page.locator(".student-preview")).toHaveAttribute("data-portrait-on-map", "true");
  await expect(page.locator(".student-preview__identity")).toHaveCSS("visibility", "hidden");
  await expect(page.locator(".student-preview__name")).toHaveCSS("visibility", "hidden");
  await expect(page.locator(".guide-launcher")).toHaveAttribute("data-hidden-in-fight", "true");
});

test("clicking and dragging Guide rolls and moves it without opening chat", async ({ page }) => {
  await page.goto("/");
  const launcher = page.locator(".guide-launcher");
  await expect(launcher).toBeVisible();
  const before = await launcher.boundingBox();
  expect(before).not.toBeNull();
  const startX = before!.x + before!.width / 2;
  const startY = before!.y + before!.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 140, startY - 90, { steps: 6 });
  await expect(launcher).toHaveAttribute("data-dragging", "true");
  await expect(launcher).toHaveAttribute("data-pose", "roll");
  await expect(launcher.locator("img")).toHaveAttribute("src", /explainer-roll\.png$/);
  await page.mouse.up();
  await expect(page.locator(".guide-panel")).toHaveCount(0);
  const after = await launcher.boundingBox();
  expect(after).not.toBeNull();
  expect(after!.x).toBeGreaterThan(before!.x + 60);
  expect(after!.y).toBeLessThan(before!.y - 40);
});

test("only Grey Explainer appears on welcome and province stages when Orange is disabled", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".guide-launcher")).toBeVisible();
  await expect(page.locator(".guide-launcher img")).toHaveAttribute("src", /explainer-/);
  await expect(page.locator(".explainer-roam")).toHaveCount(0);
  await expect(page.locator('img[src*="guide-"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await expect(page.locator(".explainer[data-visible=\"true\"]")).toBeVisible();
  await expect(page.locator(".explainer__body")).toHaveAttribute("src", /explainer-/);
  await expect(page.locator('img[src*="guide-"]')).toHaveCount(0);
  await expect(page.locator(".guide-launcher")).toHaveAttribute("data-hidden-in-fight", "true");
});

test("hovering the hamster plays curious face and displays typing bubble", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 844 });
  await page.goto("/");
  const launcher = page.locator(".guide-launcher");
  await expect(launcher).toBeVisible();

  // Hover over the launcher
  await launcher.hover();
  await expect(launcher).toHaveAttribute("data-hovered", "true");
  await expect(launcher).toHaveAttribute("data-pose", "curious");
  await expect(launcher.locator("img")).toHaveAttribute("src", /explainer-curious\.png$/);
  const bubble = launcher.locator(".guide-hover-bubble");
  await expect(bubble).toBeVisible();
  await expect(bubble.locator(".typing-dot")).toHaveCount(3);
  await page.screenshot({ path: test.info().outputPath("hamster-hover.png") });

  // Move mouse away to clear hover
  await page.mouse.move(100, 100);
  await expect(launcher).not.toHaveAttribute("data-hovered", "true");
  await expect(bubble).toHaveCount(0);
});
