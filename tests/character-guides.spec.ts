import { expect, test, type Page } from "@playwright/test";

type SpeechProbe = { spoken: string[]; cancellations: number; fail: () => void; finish: () => void };
declare global { interface Window { speechProbe: SpeechProbe } }

async function installSpeech(page: Page, voice: "thai" | "other" | "unsupported" = "thai") {
  await page.addInitScript((mode) => {
    const probe: SpeechProbe = { spoken: [], cancellations: 0, fail() {}, finish() {} };
    window.speechProbe = probe;
    if (mode === "unsupported") {
      Object.defineProperty(window, "speechSynthesis", { value: undefined });
      Object.defineProperty(window, "SpeechSynthesisUtterance", { value: undefined });
      return;
    }
    const events = new EventTarget();
    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: class {
      text: string;
      constructor(text: string) { this.text = text; }
    } });
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: {
      getVoices: () => [{ lang: mode === "thai" ? "th-TH" : "en-US", localService: true, name: "Device voice" }],
      cancel: () => { probe.cancellations++; },
      speak: (utterance: SpeechSynthesisUtterance) => {
        probe.spoken.push(utterance.text);
        probe.fail = () => utterance.onerror?.({} as SpeechSynthesisErrorEvent);
        probe.finish = () => utterance.onend?.({} as SpeechSynthesisEvent);
      },
      addEventListener: events.addEventListener.bind(events),
      removeEventListener: events.removeEventListener.bind(events),
    } });
  }, voice);
}

for (const width of [320, 390, 1440]) {
  test(`Guide, Explainer and student handoff remain usable at ${width}px`, async ({ page }) => {
    await installSpeech(page);
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    const guide = page.locator(".guide-panel");
    await expect(guide).toContainText("ยินดีต้อนรับ");
    expect(await page.evaluate(() => window.speechProbe.spoken)).toEqual([]);
    await page.getByRole("button", { name: "ใช้งานแผนที่อย่างไร?", exact: true }).click();
    await expect(guide).toContainText("ลากเพื่อหมุนแผนที่");
    await page.getByRole("button", { name: "ย่อหน้าต่าง Guide", exact: true }).click();
    await expect(page.getByRole("button", { name: "เปิด Guide", exact: true })).toBeFocused();
    await page.getByRole("button", { name: "เปิด Guide", exact: true }).click();
    await expect(guide.locator("h2")).toBeFocused();
    await page.getByRole("button", { name: "เปิดเสียงบรรยาย", exact: true }).click();
    await expect.poll(() => page.evaluate(() => window.speechProbe.spoken.length)).toBe(1);
    await guide.locator(".guide-choices button").filter({ hasText: "Bangkok" }).click();
    await expect(guide).toHaveCount(0);
    await expect(page.locator(".explainer")).toHaveAttribute("data-visible", "true");
    await expect(page.locator(".explainer")).toHaveAttribute("data-traveling", "false");
    await expect.poll(() => page.evaluate(() => window.speechProbe.spoken.at(-1))).toContain("จังหวัดBangkok");
    await page.screenshot({ path: test.info().outputPath(`explainer-bubbles-${width}.png`) });
    await page.locator(".discovery-all").click();
    await expect(page.locator(".province-recipients")).toBeVisible();
    await page.screenshot({ path: test.info().outputPath(`explainer-province-${width}.png`) });
    await page.locator(".province-recipient").first().press("Enter");
    await expect(page.locator(".explainer")).toHaveAttribute("data-visible", "true");
    await expect.poll(() => page.evaluate(() => window.speechProbe.spoken.at(-1))).toContain("หน้านี้รวมการแข่งขัน");
    await page.screenshot({ path: test.info().outputPath(`explainer-student-${width}.png`) });
    await page.locator('.student-competition[data-competition-id="creative"]').press("Enter");
    await expect(page.locator(".explainer")).toHaveAttribute("data-visible", "false");
    await expect(page.locator(".student-preview__identity")).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.speechProbe.spoken.at(-1))).toContain("ดูภาพนำเสนอ");
    const spoken = await page.evaluate(() => window.speechProbe.spoken.length);
    await page.keyboard.press("Escape");
    await expect(page.locator(".explainer")).toHaveAttribute("data-visible", "true");
    expect(await page.evaluate(() => window.speechProbe.spoken.length)).toBe(spoken);
    await page.getByRole("button", { name: "เปิด Guide", exact: true }).click();
    await page.keyboard.press("Escape");
    await expect(page.locator(".guide-panel")).toHaveCount(0);
    await expect(page.locator(".student-preview")).toHaveAttribute("data-stage", "student");
    await page.getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).press("Enter");
    await expect(page.locator(".province-recipient")).toBeFocused();
    expect(await page.evaluate(() => window.speechProbe.spoken.length)).toBe(spoken);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    expect(errors).toEqual([]);
  });
}

test("speech cancels on Skip, pause, hidden, Back, Reset and mute without stale replay", async ({ page }) => {
  await installSpeech(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "เปิดเสียงบรรยาย", exact: true }).click();
  await page.getByRole("button", { name: "ข้ามเสียง", exact: true }).click();
  await expect(page.locator(".narration-controls")).toHaveAttribute("data-status", "ready");
  await page.getByRole("button", { name: "ฟังอีกครั้ง", exact: true }).click();
  await page.getByRole("button", { name: "Pause starlight", exact: true }).click();
  await expect(page.locator(".narration-controls")).toHaveAttribute("data-status", "ready");
  const before = await page.evaluate(() => window.speechProbe.spoken.length);
  await page.getByRole("button", { name: "Resume starlight", exact: true }).click();
  expect(await page.evaluate(() => window.speechProbe.spoken.length)).toBe(before);
  await page.getByRole("button", { name: "ฟังอีกครั้ง", exact: true }).click();
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect(page.locator(".character-guides")).toHaveAttribute("data-paused", "true");
  const hidden = await page.evaluate(() => window.speechProbe.spoken.length);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: false }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect(page.locator(".character-guides")).toHaveAttribute("data-paused", "false");
  expect(await page.evaluate(() => window.speechProbe.spoken.length)).toBe(hidden);
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await expect(page.locator(".narration-controls")).toHaveAttribute("data-status", "speaking");
  await page.getByRole("button", { name: "Reset map view", exact: true }).press("Enter");
  await expect(page.locator(".narration-controls")).toHaveAttribute("data-status", "ready");
  await page.getByRole("button", { name: "เปิด Guide", exact: true }).click();
  await page.getByRole("button", { name: "ปิดเสียงบรรยาย", exact: true }).click();
  await expect(page.locator(".narration-controls")).toHaveAttribute("data-status", "off");
  const muted = await page.evaluate(() => window.speechProbe.spoken.length);
  await page.getByRole("button", { name: "Mock Niran", exact: true }).press("Enter");
  expect(await page.evaluate(() => window.speechProbe.spoken.length)).toBe(muted);
});

for (const mode of ["other", "unsupported"] as const) {
  test(`no Thai device voice uses text without substituting speech (${mode})`, async ({ page }) => {
    await installSpeech(page, mode);
    await page.goto("/?view=recipients");
    await page.getByRole("button", { name: "เปิดเสียงบรรยาย", exact: true }).click();
    await expect(page.locator(".narration-controls")).toHaveAttribute("data-status", "text");
    await expect(page.getByText("อ่านคำแนะนำแทนเสียงได้", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "ย่อหน้าต่าง Guide", exact: true }).click();
    await expect(page.locator(".narration-fallback")).toContainText("ยินดีต้อนรับ");
    await expect(page.locator(".narration-fallback")).toBeVisible();
    await page.getByRole("button", { name: "เปิด Guide", exact: true }).click();
    await page.locator(".guide-choices button").filter({ hasText: "Bangkok" }).click();
    await expect(page.locator(".province-recipient")).toHaveCount(1);
    await expect(page.locator(".explainer__caption")).toContainText("จังหวัดBangkok");
    expect(await page.evaluate(() => window.speechProbe.spoken)).toEqual([]);
  });
}

test("speech errors preserve browsing and Guide opens only an available person", async ({ page }) => {
  await installSpeech(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?view=recipients&fixture=group");
  await page.getByRole("button", { name: "เปิดเสียงบรรยาย", exact: true }).click();
  await page.evaluate(() => window.speechProbe.fail());
  await expect(page.locator(".narration-controls")).toHaveAttribute("data-status", "text");
  await page.locator(".guide-choices button").filter({ hasText: "Bangkok" }).click();
  await page.getByRole("button", { name: "เปิด Guide", exact: true }).click();
  await page.locator(".guide-choices button").filter({ hasText: "Mock Student With A Very Long Display Name" }).click();
  await expect(page.locator(".student-preview__name")).toContainText("Mock Student With A Very Long Display Name");
  await page.locator(".student-competition").press("Enter");
  await expect(page.locator(".explainer")).toHaveAttribute("data-visible", "false");
});

test("Explainer travel is interruptible and speech starts before travel finishes", async ({ page }) => {
  await installSpeech(page);
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      if (this.classList.contains("explainer") && typeof options === "object") options = { ...options, duration: 3000 };
      return original.call(this, frames, options);
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "เปิดเสียงบรรยาย", exact: true }).click();
  await page.getByRole("button", { name: "Mock Mali", exact: true }).click();
  await expect(page.locator(".explainer")).toHaveAttribute("data-traveling", "true");
  await expect(page.locator(".narration-controls")).toHaveAttribute("data-status", "speaking");
  await page.locator(".discovery-all").click();
  await expect(page.locator(".province-recipients")).toBeVisible();
  await expect(page.locator(".explainer")).toHaveAttribute("data-traveling", "true");
  await page.getByRole("button", { name: "Pause starlight", exact: true }).click();
  await expect(page.locator(".explainer")).toHaveAttribute("data-traveling", "false");
  await expect(page.locator(".narration-controls")).toHaveAttribute("data-status", "ready");
  await page.getByRole("button", { name: "Reset map view", exact: true }).press("Enter");
  await expect(page.locator(".explainer")).toHaveAttribute("data-visible", "false");
});

test("Guide current-province choice returns from detail and graphics recovery stops stale speech", async ({ page }) => {
  await installSpeech(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "เปิดเสียงบรรยาย", exact: true }).click();
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  await page.locator(".recipient-bubble[data-recipient-id]").first().press("Enter");
  await page.locator('.student-competition[data-competition-id="creative"]').press("Enter");
  await page.locator("canvas").evaluate((canvas) => {
    const extension = (canvas as HTMLCanvasElement).getContext("webgl2")!.getExtension("WEBGL_lose_context")!;
    Object.assign(window, { restoreGuideContext: () => extension.restoreContext() }); extension.loseContext();
  });
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "recovering");
  await expect(page.locator(".narration-controls")).toHaveAttribute("data-status", "ready");
  const spoken = await page.evaluate(() => window.speechProbe.spoken.length);
  await page.evaluate(() => (window as unknown as { restoreGuideContext: () => void }).restoreGuideContext());
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-context", "ready");
  expect(await page.evaluate(() => window.speechProbe.spoken.length)).toBe(spoken);
  await page.getByRole("button", { name: "เปิด Guide", exact: true }).click();
  await page.locator(".guide-choices button").filter({ hasText: "Mock Mali" }).click();
  await expect(page.locator(".student-preview")).toHaveAttribute("data-stage", "student");
  await page.locator('.student-competition[data-competition-id="creative"]').press("Enter");
  const afterForward = await page.evaluate(() => window.speechProbe.spoken.length);
  await page.getByRole("button", { name: "เปิด Guide", exact: true }).click();
  await page.locator(".guide-choices button").filter({ hasText: "Bangkok" }).click();
  await expect(page.locator(".student-preview")).toHaveCount(0);
  await expect(page.locator(".recipient-bubble[data-recipient-id]")).toHaveCount(1);
  expect(await page.evaluate(() => window.speechProbe.spoken.length)).toBe(afterForward);
});
