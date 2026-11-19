import { test } from "node:test";
import assert from "node:assert/strict";
import { bubbleFootprint, bubbleLayout, previewLayout, profileLayout, profileObstacles, spreadBubbles, thoughtTrail } from "./bubbleLayout";

for (const [width, height] of [[320, 844], [390, 844], [900, 600], [1440, 900]]) {
  test(`five floating targets fit, remain separate and preserve the award at ${width}x${height}`, () => {
    const points = bubbleLayout({ width: width!, height: height! }, { x: width! / 2, y: height! / 2 }, 8);
    assert.equal(points.length, 5);
    for (const [index, point] of points.entries()) {
      assert.ok(point.x - point.size / 2 >= 14);
      assert.ok(point.x + point.size / 2 <= width! - 14);
      assert.ok(point.y - point.size / 2 >= 150);
      assert.ok(point.y + point.size / 2 <= height! - 120);
      assert.ok(Math.hypot(point.x - width! / 2, point.y - height! / 2) > point.size / 2 + 32);
      for (const other of points.slice(index + 1)) {
        assert.ok(Math.hypot(point.x - other.x, point.y - other.y) >= (point.size + other.size) / 2);
      }
      const card = previewLayout({ width: width!, height: height! }, { x: point.x - point.size / 2, y: point.y - point.size / 2, width: point.size, height: point.size });
      assert.ok(card.x >= 14 && card.x + card.width <= width! - 14);
      assert.ok(card.y >= 130 && card.y + card.height <= height! - 20);
      assert.equal(card.portraitX, card.width / 2);
      assert.ok(card.y + card.portraitY - card.portraitSize / 2 >= 30);
      assert.ok(card.portraitSize >= 110);
    }
  });
}

test("high and low bubble sources both reveal a fitted, enlarged portrait above the card", () => {
  for (const y of [170, 700]) {
    const source = { x: 280, y, width: 80, height: 80 };
    const card = previewLayout({ width: 390, height: 844 }, source);
    assert.equal(card.portraitX, card.width / 2);
    assert.ok(card.portraitSize > source.width);
    assert.ok(card.y + card.portraitY - card.portraitSize / 2 > 60);
    assert.ok(card.height >= 300);
  }
});

test("thought bubbles stay clear of the award and floating portrait instead of hiding behind either", () => {
  const origin = { x: 720, y: 450 };
  for (const point of bubbleLayout({ width: 1440, height: 900 }, origin, 5)) {
    const trail = thoughtTrail(origin, point);
    for (const dot of trail) {
      assert.ok(Math.hypot(dot.x - origin.x, dot.y - origin.y) - dot.size / 2 >= 43.9);
      assert.ok(Math.hypot(dot.x - point.x, dot.y - point.y) - dot.size / 2 >= point.size / 2 + 19.9);
    }
  }
  assert.deepEqual(thoughtTrail(origin, { ...origin, size: 100 }), []);
});

test("opened profiles keep every peer clear of the card, identity, logo and each other", () => {
  const intersects = (a: { x: number; y: number; width: number; height: number }, b: typeof a) =>
    a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  for (const [width, height] of [[320, 844], [390, 740], [686, 977], [737, 842], [900, 600], [1440, 844]]) {
    const viewport = { width: width!, height: height! };
    const original = bubbleLayout(viewport, { x: width! * .52, y: height! * .48 }, 5);
    const snapshot = structuredClone(original);
    for (const selected of [-1, 0, 1, 2, 3, 4]) {
      const source = original[Math.max(0, selected)]!;
      const layout = profileLayout(viewport, { x: source.x - source.size / 2, y: source.y - source.size / 2,
        width: source.size, height: source.size }, true, true);
      const targets = spreadBubbles(viewport, original, selected, layout);
      const peers = targets.filter((_, index) => index !== selected);
      for (const [index, point] of peers.entries()) {
        const footprint = bubbleFootprint(point);
        const context = `${width}x${height}, selected ${selected}, peer ${index}`;
        assert.ok(point.size >= 44, context);
        assert.ok(footprint.x >= 8 && footprint.x + footprint.width <= width! - 8, context);
        assert.ok(footprint.y >= 48 && footprint.y + footprint.height <= height! - 24, context);
        for (const obstacle of profileObstacles(layout)) assert.equal(intersects(footprint, obstacle), false, context);
        for (const other of peers.slice(index + 1)) assert.equal(intersects(footprint, bubbleFootprint(other)), false, context);
      }
    }
    assert.deepEqual(original, snapshot);
  }
});

test("single-student previews retain their framing; peer rail reserves phone space only when needed", () => {
  const viewport = { width: 390, height: 844 };
  const source = { x: 200, y: 340, width: 84, height: 84 };
  const normal = profileLayout(viewport, source, true);
  const shared = profileLayout(viewport, source, true, true);
  assert.equal(normal.y, previewLayout(viewport, source).y);
  assert.ok(shared.y > normal.y);
  const one = [{ x: 200, y: 340, size: 84 }];
  assert.deepEqual(spreadBubbles(viewport, one, 0, normal), one);
});
