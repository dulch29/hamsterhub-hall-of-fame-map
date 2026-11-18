import { test } from "node:test";
import assert from "node:assert/strict";
import { bubbleLayout, previewLayout, thoughtTrail } from "./bubbleLayout";

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
      assert.equal(card.x + card.portraitX, point.x);
      assert.equal(card.y + card.portraitY, point.y);
      assert.equal(card.portraitSize, point.size);
    }
  });
}

test("a low portrait opens above and a high portrait opens below without relocating its center", () => {
  for (const y of [170, 700]) {
    const source = { x: 280, y, width: 80, height: 80 };
    const card = previewLayout({ width: 390, height: 844 }, source);
    assert.equal(card.placement, y === 170 ? "below" : "above");
    assert.equal(card.x + card.portraitX, 320);
    assert.equal(card.y + card.portraitY, y + 40);
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
