import { expect, test, type Page } from "@playwright/test";

for (const width of [320, 390, 1440]) {
  test(`bubbles precede the full province list and restore the overview at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?fixture=group");
    const map = page.locator(".map-canvas");
    const medal = page.getByRole("button", { name: "Mock Mali", exact: true });
    await expect(medal).toBeVisible();
    const target = (await map.getAttribute("data-camera-target"))!;
    const zoom = (await map.getAttribute("data-camera-zoom"))!;
    await medal.press("Enter");
    await expect(page.locator(".recipient-bubble[data-recipient-id]")).toHaveCount(4);
    await expect(page.locator(".province-recipients")).toHaveCount(0);
    await expect(map).not.toHaveAttribute("data-camera-target", target);
    expect(await page.locator(".map-controls button").evaluateAll((buttons) => buttons.every((button) => {
      const rect = button.getBoundingClientRect();
      return button.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
    }))).toBe(true);
    await page.getByRole("button", { name: /ดูผู้ได้รับรางวัลทั้งหมด/ }).click();
    const rows = page.locator(".province-recipient");
    await expect(rows).toHaveCount(8);
    await rows.last().scrollIntoViewIfNeeded();
    await rows.last().press("Enter");
    await expect(page.locator(".student-preview")).toHaveAttribute("data-morph", "open");
    await page.keyboard.press("Escape");
    await expect(rows.last()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: /ดูผู้ได้รับรางวัลทั้งหมด/ })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator(".award-discovery")).toHaveCount(0);
    await expect(map).toHaveAttribute("data-camera-target", target);
    await expect(map).toHaveAttribute("data-camera-zoom", zoom);
    await expect(medal).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

test("bubble pointer interaction morphs, reforms and recalls before camera return", async ({ page }) => {
  await page.goto("/?fixture=group");
  const map = page.locator(".map-canvas");
  await expect(map).toHaveAttribute("data-landing", "settled");
  const target = (await map.getAttribute("data-camera-target"))!;
  await page.getByRole("button", { name: "Mock Mali", exact: true }).click();
  await expect(map).toHaveAttribute("data-moving", "false");
  const bubble = page.locator(".recipient-bubble[data-recipient-id]").first();
  await bubble.click();
  await expect(page.locator(".student-preview")).toHaveAttribute("data-morph", "open");
  await page.getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).click();
  await expect(page.locator(".student-preview")).toHaveCount(0);
  await expect(bubble).toBeFocused();
  await expect(bubble).toBeVisible();
  await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).click();
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await expect(map).toHaveAttribute("data-moving", "false");
  await expect(map).toHaveAttribute("data-camera-target", target);
  await expect(page.getByRole("button", { name: "ปิดเสียงฟองสบู่" })).toBeVisible();
});

const recipients = (page: Page) => page.getByRole("region", { name: "ผู้ได้รับรางวัล", exact: true });
const preview = (page: Page) => page.getByRole("region", { name: "โปรไฟล์เบื้องต้น", exact: true });

test("peer selection interrupts full Close without retaining its pending exit", async ({ page }) => {
  await page.goto("/?fixture=group");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  const bubbles = page.locator(".recipient-bubble[data-recipient-id]");
  await bubbles.first().click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await page.evaluate(() => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof original>) {
      const animation = original.apply(this, args);
      if (this.closest('.student-preview[data-morph="closing"]')) animation.pause();
      return animation;
    };
  });
  await page.locator(".province-journey__close").click();
  await expect(preview(page)).toHaveAttribute("data-morph", "closing");
  await bubbles.nth(1).click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await page.keyboard.press("Escape");
  await expect(preview(page)).toHaveCount(0);
  await expect(page.locator(".award-discovery")).toHaveAttribute("data-state", "open");
  await expect(bubbles.nth(1)).toBeFocused();
});

test("keyboard Close from View all returns to its bubbles without camera travel", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  const target = (await page.locator(".map-canvas").getAttribute("data-camera-target"))!;
  const zoom = (await page.locator(".map-canvas").getAttribute("data-camera-zoom"))!;
  await page.getByRole("button", { name: /ดูผู้ได้รับรางวัลทั้งหมด/ }).press("Enter");
  await page.evaluate(() => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof original>) {
      const animation = original.apply(this, args);
      if (this.closest(".is-closing")) animation.pause();
      return animation;
    };
  });
  await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).press("Enter");
  await expect(page.locator(".province-recipients")).toHaveCount(0);
  await expect(page.locator(".award-discovery")).toHaveAttribute("data-state", "open");
  await expect(page.locator(".discovery-all")).toBeFocused();
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-camera-target", target);
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-camera-zoom", zoom);
});

test("context loss during an animated camera return still restores the overview", async ({ page }) => {
  await page.goto("/");
  const map = page.locator(".map-canvas");
  await expect(map).toHaveAttribute("data-landing", "settled");
  const home = (await map.getAttribute("data-camera-target"))!;
  await page.getByRole("button", { name: "Mock Mali", exact: true }).click();
  await expect(map).toHaveAttribute("data-moving", "false");
  const time = new Date();
  await page.clock.install({ time });
  await page.clock.pauseAt(new Date(time.getTime() + 1000));
  await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).dispatchEvent("click", { detail: 1 });
  await page.locator(".award-discovery").evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => {
    if (Number.isFinite(animation.effect?.getComputedTiming().endTime)) animation.finish();
  }));
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await expect(map).toHaveAttribute("data-moving", "true");
  await page.clock.runFor(64);
  await expect(map).not.toHaveAttribute("data-camera-target", home);
  await page.locator("canvas").evaluate((element) => {
    const canvas = element as HTMLCanvasElement;
    const extension = canvas.getContext("webgl2")!.getExtension("WEBGL_lose_context")!;
    Object.assign(window, { restoreBubbleMap: () => extension.restoreContext() });
    extension.loseContext();
  });
  await expect(map).toHaveAttribute("data-context", "recovering");
  await page.evaluate(() => (window as Window & { restoreBubbleMap?: () => void }).restoreBubbleMap!());
  await expect(map).toHaveAttribute("data-context", "ready");
  await page.clock.runFor(300);
  await expect(map).toHaveAttribute("data-camera-target", home);
  await expect(map).toHaveAttribute("data-camera-zoom", "1.00000");
  await expect(map).toHaveAttribute("data-moving", "false");
});

test("switching provinces retains the first overview and Reset cancels a recalling group", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const map = page.locator(".map-canvas");
  const mali = page.getByRole("button", { name: "Mock Mali", exact: true });
  await expect(mali).toBeVisible();
  const homeTarget = (await map.getAttribute("data-camera-target"))!;
  const homeAngle = (await map.getAttribute("data-camera-angle"))!;
  await mali.press("Enter");
  for (let index = 0; index < 3; index++) await page.getByRole("button", { name: "Zoom out", exact: true }).press("Enter");
  await page.getByRole("button", { name: "Mock Ploy", exact: true }).press("Enter");
  await expect(page.locator(".recipient-context")).toContainText("Phuket");
  await page.keyboard.press("Escape");
  await expect(map).toHaveAttribute("data-camera-target", homeTarget);
  await expect(map).toHaveAttribute("data-camera-angle", homeAngle);
  await expect(map).toHaveAttribute("data-camera-zoom", "1.00000");
  await mali.press("Enter");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof original>) {
      const animation = original.apply(this, args);
      if (this.closest(".is-closing")) animation.pause();
      return animation;
    };
  });
  await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).click();
  await expect(page.locator(".award-discovery")).toHaveAttribute("data-state", "recalling");
  await page.getByRole("button", { name: "Reset map view" }).press("Enter");
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await expect(map).toHaveAttribute("data-moving", "false");
  await expect(map).toHaveAttribute("data-camera-target", homeTarget);
  await mali.press("Enter");
  await expect(page.locator(".award-discovery")).toHaveAttribute("data-state", "open");
  await expect(page.locator(".recipient-bubble[data-recipient-id]")).toHaveCount(1);
});

for (const width of [320, 390, 1440]) {
  test(`peer bubbles remain reachable while switching an open profile at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?fixture=group");
    await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
    const bubbles = recipients(page).locator(".recipient-bubble[data-recipient-id]");
    await expect(bubbles).toHaveCount(4);
    const original = await bubbles.evaluateAll((items) => items.map((item) => {
      const rect = item.getBoundingClientRect(); return { x: rect.x, y: rect.y };
    }));
    await bubbles.first().press("Enter");
    const card = preview(page);
    await expect(card).toHaveAttribute("data-morph", "open");
    const placement = await card.boundingBox();
    for (const index of [1, 3, 0]) {
      const peer = bubbles.nth(index);
      await expect(peer).toBeVisible();
      const reachable = await peer.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)?.closest("button") === element;
      });
      expect(reachable).toBe(true);
      await peer.press("Enter");
      await expect(peer).toHaveAttribute("aria-pressed", "true");
      await expect(card).toHaveAttribute("data-morph", "open");
      expect(await card.boundingBox()).toEqual(placement);
    }
    await page.keyboard.press("Escape");
    await expect(card).toHaveCount(0);
    await expect(bubbles.first()).toBeFocused();
    const returned = await bubbles.evaluateAll((items) => items.map((item) => {
      const rect = item.getBoundingClientRect(); return { x: rect.x, y: rect.y };
    }));
    expect(returned).toEqual(original);
    await page.keyboard.press("Escape");
    await expect(page.locator(".award-discovery")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Mock Mali", exact: true })).toBeFocused();
  });
}

test("closing gathers small outside bubbles into one face and settles when motion is reduced", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Mock Mali", exact: true }).press("Enter");
  const face = recipients(page).locator(".recipient-bubble[data-recipient-id]").first();
  await face.click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await page.evaluate(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      const animation = animate.apply(this, args);
      if (this.closest('.bubble-burst[data-kind="form"], [data-reforming="true"], .student-preview[data-morph="closing"]')) animation.pause();
      return animation;
    };
  });
  await preview(page).getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).click();
  await expect(preview(page)).toHaveAttribute("data-morph", "closing");
  const burst = page.locator('.bubble-burst[data-kind="form"]');
  await expect(burst).toHaveCount(1);
  await expect(burst.locator(".bubble-burst__drop").first()).toHaveCSS("opacity", "0.7");
  await burst.evaluate((element) => element.setAttribute("data-test-continuity", "started"));
  await preview(page).evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
  await expect(preview(page)).toHaveCount(0);
  await expect(burst).toHaveCount(1);
  await expect(burst).toHaveAttribute("data-test-continuity", "started");
  await expect(face).toBeFocused();
  await expect(face.locator(".bubble-arrival")).toHaveCSS("opacity", "0");
  const travel = await burst.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const distances = (time: number) => Array.from(element.querySelectorAll<HTMLElement>(".bubble-burst__drop")).map((drop) => {
      drop.getAnimations().forEach((animation) => { animation.currentTime = time; });
      const bounds = drop.getBoundingClientRect();
      return Math.hypot(bounds.x + bounds.width / 2 - rect.x - rect.width / 2, bounds.y + bounds.height / 2 - rect.y - rect.height / 2);
    });
    return { radius: rect.width / 2, outside: distances(100), merging: distances(450), center: distances(619) };
  });
  expect(travel.outside.length).toBeGreaterThan(4);
  travel.outside.forEach((distance, index) => {
    expect(distance).toBeGreaterThan(travel.radius * 1.5);
    expect(travel.merging[index]).toBeLessThan(distance / 2);
    expect(travel.center[index]).toBeLessThan(1);
  });
  await burst.locator(".bubble-burst__ring").evaluate((element) => element.getAnimations().forEach((animation) => { animation.currentTime = 440; }));
  await face.locator(".bubble-arrival").evaluate((element) => element.getAnimations().forEach((animation) => { animation.currentTime = 440; }));
  const membrane = (await burst.locator(".bubble-burst__ring").boundingBox())!;
  const faceRim = (await face.locator(".recipient-orb").boundingBox())!;
  for (const coordinate of ["x", "y", "width", "height"] as const)
    expect(Math.abs(membrane[coordinate] - faceRim[coordinate]), "the merging film and face must share one rim").toBeLessThan(1);
  await face.locator(".bubble-arrival").evaluate((element) => element.getAnimations().forEach((animation) => { animation.currentTime = 560; }));
  expect(Number(await face.locator(".bubble-arrival").evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThan(.95);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(burst).toHaveCount(0);
  await expect(face).not.toHaveAttribute("data-reforming");
  await expect(face.locator(".bubble-arrival")).toHaveCSS("opacity", "1");
  await face.press("Enter");
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await page.keyboard.press("Escape");
  await expect(face).toBeFocused();
  await expect(page.locator(".bubble-burst")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await face.click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await preview(page).getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).click();
  await expect(burst).toHaveCount(1);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(burst).toHaveCount(0);
  await expect(face).not.toHaveAttribute("data-reforming");
  await expect(face.locator(".bubble-arrival")).toHaveCSS("opacity", "1");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await face.click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await preview(page).getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).click();
  await expect(burst).toHaveCount(1);
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  await expect(page.locator(".award-discovery")).toHaveCount(0);
  await expect(burst).toHaveCount(0);
});

test("province exit gathers bubbles into its award before restoring the camera", async ({ page }) => {
  await page.goto("/?fixture=group");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-landing", "settled");
  const pin = page.getByRole("button", { name: "Mock Mali", exact: true });
  const before = (await pin.boundingBox())!;
  await pin.press("Enter");
  await page.getByRole("button", { name: "Pause starlight" }).click();
  await recipients(page).locator(".recipient-bubble[data-recipient-id]").first().click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await page.evaluate(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      const animation = animate.apply(this, args);
      if (this.closest(".is-closing")) animation.pause();
      return animation;
    };
  });
  // Trigger the group callback directly so OrbitControls' pointer takeover does
  // not bypass the paused recall being measured below.
  await page.locator(".province-journey__close").dispatchEvent("click", { detail: 1 });
  const discovery = page.locator(".award-discovery");
  await expect(discovery).toHaveAttribute("data-state", "recalling");
  await expect(pin).toHaveAttribute("aria-pressed", "true");
  const recall = await discovery.evaluate((element) => {
    const target = { x: Number((element as HTMLElement).dataset.anchorX), y: Number((element as HTMLElement).dataset.anchorY) };
    const animations = element.getAnimations({ subtree: true }).filter((animation) => animation.playState === "paused"
      && (animation.effect as KeyframeEffect).target?.classList.contains("bubble-arrival"));
    return { target, centers: animations.map((animation) => {
      const effect = animation.effect as KeyframeEffect;
      animation.currentTime = Number(effect.getComputedTiming().endTime);
      const rect = (effect.target as Element).getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    }) };
  });
  expect(recall.centers).toHaveLength(5);
  for (const center of recall.centers) {
    expect(Math.abs(center.x - recall.target.x)).toBeLessThan(1);
    expect(Math.abs(center.y - recall.target.y)).toBeLessThan(1);
  }
  await discovery.evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => {
    if (animation.playState === "paused" && Number.isFinite(animation.effect?.getComputedTiming().endTime)) animation.finish();
  }));
  await expect(discovery).toHaveCount(0);
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
  const after = (await pin.boundingBox())!;
  expect(Math.abs(after.x - before.x)).toBeLessThan(1);
  expect(Math.abs(after.y - before.y)).toBeLessThan(1);
  await pin.press("Enter");
  await page.getByRole("button", { name: "ปิดรายชื่อผู้ได้รับรางวัล", exact: true }).click();
  await expect(discovery).toHaveAttribute("data-state", "recalling");
  await expect(pin).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(discovery).toHaveCount(0);
  await expect(pin).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".map-canvas")).toHaveAttribute("data-moving", "false");
});

test("bubble pop and re-form have quiet optional sound, a burst and a rim-free enlarged student", async ({ page }) => {
  await page.addInitScript(() => {
    const feedback = { sounds: 0, pops: 0, forms: 0, decoded: 0, oscillators: 0 };
    Object.assign(window, { bubbleFeedback: feedback });
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (...args: Parameters<typeof start>) { feedback.sounds++; return start.apply(this, args); };
    const oscillator = OscillatorNode.prototype.start;
    OscillatorNode.prototype.start = function (...args: Parameters<typeof oscillator>) { feedback.oscillators++; return oscillator.apply(this, args); };
    const decode = BaseAudioContext.prototype.decodeAudioData;
    BaseAudioContext.prototype.decodeAudioData = function (...args: Parameters<typeof decode>) {
      return decode.apply(this, args).then((buffer) => { feedback.decoded++; return buffer; });
    };
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<typeof animate>) {
      const burst = this.closest(".bubble-burst");
      if (this.classList.contains("bubble-burst__ring")) {
        if ((burst as HTMLElement).dataset.kind === "pop") feedback.pops++; else feedback.forms++;
      }
      return animate.apply(this, args);
    };
  });
  const counts = () => page.evaluate(() => (window as unknown as { bubbleFeedback: { sounds: number; pops: number; forms: number; decoded: number; oscillators: number } }).bubbleFeedback);
  await page.goto("/");
  await expect.poll(async () => (await counts()).decoded).toBe(2);
  await page.getByRole("button", { name: "Mock Mali", exact: true }).click();
  const face = recipients(page).locator(".recipient-bubble[data-recipient-id]").first();
  const original = (await face.boundingBox())!;
  await face.click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await expect(preview(page).locator(".recipient-orb")).toHaveCount(0);
  await expect(face).toHaveCSS("visibility", "hidden");
  const portrait = (await preview(page).locator(".student-preview__identity").boundingBox())!;
  expect(portrait.width).toBeGreaterThan(original.width);
  expect(await counts()).toMatchObject({ sounds: 1, pops: 1, oscillators: 0 });
  const award = (await preview(page).locator(".competition-list h3").boundingBox())!;
  const image = (await preview(page).locator(".student-competition").first().boundingBox())!;
  expect(award.y).toBeLessThan(image.y);
  await preview(page).getByRole("button", { name: "กลับไปรายชื่อ", exact: true }).click();
  await expect(preview(page)).toHaveCount(0);
  await expect(face).toBeVisible();
  expect(await counts()).toMatchObject({ sounds: 2, forms: 1 });
  await page.getByRole("button", { name: "ปิดเสียงฟองสบู่", exact: true }).click();
  await face.click();
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await page.keyboard.press("Escape");
  expect((await counts()).sounds).toBe(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await face.press("Enter");
  await expect(preview(page)).toHaveAttribute("data-morph", "open");
  await expect(page.locator(".bubble-burst")).toHaveCount(0);
});
