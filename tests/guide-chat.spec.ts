import { expect, test, type Page } from '@playwright/test';
import { createDiscoveryDemo } from '../src/mock/discovery';
import { createReviewScaleFixture } from '../src/mock/reviewScale';

// The hamster is the only visible entry point; tapping it opens the chat bar.
const openGuide = async (page: Page) => {
  const launcher = page.getByRole('button', { name: 'เปิด Guide', exact: true });
  if (await launcher.count()) await launcher.click();
  await expect(page.locator('.guide-panel')).toBeVisible();
};
// Clicking empty map space (right edge, clear of the hamster and the chat) closes the chat.
const closeByEmptyClick = async (page: Page) => {
  const { width } = page.viewportSize()!;
  await page.mouse.click(width - 40, 120);
  await expect(page.locator('.guide-panel')).toHaveCount(0);
};

for (const width of [320, 390, 1440]) {
  test(`Guide chat and explicit result navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const requests: Record<string, unknown>[] = [];
    await page.route('**/api/guide', async (route) => {
      requests.push(route.request().postDataJSON());
      await route.fulfill({ json: { text: '<img src=x onerror=alert(1)> ผลงานตัวอย่าง', actions: [
        { kind: 'project', id: 'mock-2a-0002-project', label: 'untrusted label' },
        { kind: 'student', id: 'not-visible', label: 'Hidden' },
      ] } });
    });
    await page.goto('/');
    await expect(page.locator('.guide-panel')).toHaveCount(0);
    await openGuide(page);
    const input = page.getByLabel('อยากรู้เกี่ยวกับผลงานไหน?');
    await input.fill('แนะนำผลงาน');
    await input.press('Enter');
    const log = page.getByRole('log');
    await expect(log).toContainText('<img src=x onerror=alert(1)>');
    await expect(log).toContainText('ให้ฉันเปิดหน้านี้ให้เลยไหม?');
    await expect(log.locator('img')).toHaveCount(0);
    await expect(page.locator('.student-preview')).toHaveCount(0);
    await expect(log.locator('button')).toHaveCount(1);
    expect(requests[0]).toEqual({ dataset: 'default', message: 'แนะนำผลงาน', history: [] });
    await input.fill('เล่าเพิ่ม');
    await page.getByRole('button', { name: 'ส่งคำถาม', exact: true }).click();
    await expect(log.locator('.guide-chat__turn')).toHaveCount(4);
    expect((requests[1]!.history as unknown[]).length).toBe(2);
    await page.screenshot({ path: test.info().outputPath(`guide-chat-${width}.png`) });
    await log.locator('button').last().click();
    await expect(page.locator('.student-preview')).toHaveAttribute('data-stage', 'competition');
    await expect(page.locator('.student-preview')).not.toContainText('untrusted label');
    await page.keyboard.press('Escape');
    await expect(page.locator('.student-preview')).toHaveAttribute('data-stage', 'student');
    await page.getByRole('button', { name: 'กลับไปรายชื่อ', exact: true }).press('Enter');
    await expect(page.locator('.province-recipients h2')).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await page.keyboard.press('Escape');
    await openGuide(page);
    await expect(log.locator('.guide-chat__turn')).toHaveCount(4);
    await closeByEmptyClick(page);
    await openGuide(page);
    await expect(log.locator('.guide-chat__turn')).toHaveCount(4);
  });
}

test('Guide failure, retry, Stop and closing keep manual browsing usable', async ({ page }) => {
  let calls = 0;
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/api/guide', async (route) => {
    calls++;
    if (calls === 1) await route.fulfill({ status: 503, json: { error: { code: 'NOT_CONFIGURED' } } });
    else if (calls === 2) await route.fulfill({ status: 429, json: { error: { code: 'RATE_LIMIT' } } });
    else await held.then(() => route.fulfill({ json: { text: 'Late answer', actions: [] } }).catch(() => {}));
  });
  await page.goto('/');
  await openGuide(page);
  const input = page.getByLabel('อยากรู้เกี่ยวกับผลงานไหน?');
  await input.fill('hello');
  await page.getByRole('button', { name: 'ส่งคำถาม', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('ยังไม่ได้เชื่อมต่อ');
  await expect(input).toHaveValue('hello');
  await page.getByRole('button', { name: 'ลองถามอีกครั้ง', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('รอสักครู่');
  await page.getByRole('button', { name: 'ลองถามอีกครั้ง', exact: true }).click();
  await page.getByRole('button', { name: 'หยุดคำตอบ', exact: true }).click();
  await expect(input).toBeEnabled();
  await page.getByRole('button', { name: 'ส่งคำถาม', exact: true }).click();
  await closeByEmptyClick(page);
  await openGuide(page);
  release();
  await expect(page.getByRole('log')).not.toContainText('Late answer');
  // Manual browsing still works with the chat open: a medal tap closes the chat and opens the bubbles.
  await page.getByRole('button', { name: 'Mock Mali', exact: true }).click();
  await expect(page.locator('.guide-panel')).toHaveCount(0);
  await expect(page.locator('.recipient-bubble[data-recipient-id]')).toHaveCount(1);
});

test('Guide province and student results cross provinces with bounded history', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/guide', async (route) => {
    calls++;
    expect(route.request().postDataJSON().history.length).toBeLessThanOrEqual(6);
    await route.fulfill({ json: { text: 'Fictional sample', actions: [
      { kind: 'province', id: 'TH-50', label: 'province' },
      { kind: 'student', id: 'mock-2a-0003', label: 'student' },
    ] } });
  });
  await page.goto('/');
  await openGuide(page);
  for (let i = 0; i < 5; i++) {
    await page.getByLabel('อยากรู้เกี่ยวกับผลงานไหน?').fill(`question ${i}`);
    await page.getByRole('button', { name: 'ส่งคำถาม', exact: true }).click();
    await expect(page.getByLabel('อยากรู้เกี่ยวกับผลงานไหน?')).toHaveValue('');
  }
  expect(calls).toBe(5);
  await expect(page.locator('.guide-chat__turn')).toHaveCount(8);
  await page.locator('[data-guide-target="province:TH-50"]').last().click();
  await expect(page.locator('.province-recipients')).toContainText('Chiang Mai', { timeout: 8000 });
  await page.keyboard.press('Escape');
  await openGuide(page);
  await page.locator('[data-guide-target="student:mock-2a-0003"]').last().click();
  await expect(page.locator('.student-preview__name')).toContainText('Mock Ploy', { timeout: 8000 });
});

test('Guide action button zooms map into award and walks through bubble, student list, and card', async ({ page }) => {
  await page.route('**/api/guide', async (route) => {
    await route.fulfill({ json: { text: 'เปิดผลงานตัวอย่างให้แล้ว', actions: [
      { kind: 'student', id: 'mock-2a-0002', label: 'Mock Mali' },
    ] } });
  });
  await page.goto('/');
  await openGuide(page);
  await page.getByLabel('อยากรู้เกี่ยวกับผลงานไหน?').fill('Mock Mali');
  await page.getByRole('button', { name: 'ส่งคำถาม', exact: true }).click();
  await page.locator('[data-guide-target="student:mock-2a-0002"]').last().click();
  await expect(page.locator('.province-recipients')).toHaveCount(0);
  await expect(page.locator('.recipient-bubble[data-recipient-id]')).toHaveCount(1);
  await expect(page.locator('.mascot-loser[data-crying="true"]')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('.province-recipients')).toBeVisible({ timeout: 8000 });
  await expect(page.locator('.map-marker[aria-pressed="true"]')).toHaveCount(1);
  await expect(page.locator('.student-preview__name')).toContainText('Mock Niran', { timeout: 8000 });
});

test('review chat excludes owner context and targets while opening visible fictional work', async ({ page }) => {
  test.skip(process.env.PLAYWRIGHT_REVIEW_BUILD !== '1', 'Requires the explicit compiled review build');
  const demo = createDiscoveryDemo();
  const owner = demo.kids[0]!;
  const fixture = createReviewScaleFixture(owner, demo.groups[0]!.awards[0]!);
  await page.route('**/__local-preview/**', (route) => route.fulfill({ status: 404, body: '' }));
  await page.route('**/__local-preview/data.json', (route) => route.fulfill({ json: fixture }));
  let submitted: Record<string, unknown> | undefined;
  await page.route('**/api/guide', async (route) => {
    submitted = route.request().postDataJSON();
    await route.fulfill({ json: { text: 'ข้อมูลสมมติเท่านั้น', actions: [
      { kind: 'student', id: owner.id, label: 'owner' },
      { kind: 'project', id: 'review-fictional-1-project', label: 'sample' },
    ] } });
  });
  await page.goto('/?fixture=local');
  await openGuide(page);
  await page.getByLabel('อยากรู้เกี่ยวกับผลงานไหน?').fill('ข้อมูลสมมติ');
  await page.getByRole('button', { name: 'ส่งคำถาม', exact: true }).click();
  await expect(page.getByRole('log')).toContainText('ข้อมูลสมมติเท่านั้น');
  expect(submitted).toEqual({ dataset: 'review', message: 'ข้อมูลสมมติ', history: [] });
  await expect(page.locator('.guide-chat__turn button')).toHaveCount(1);
  await page.locator('[data-guide-target="project:review-fictional-1-project"]').click();
  await expect(page.locator('.student-preview')).toContainText('LeafLoop');
  await expect(page.locator('.student-preview__name')).toContainText('Arun');
});
