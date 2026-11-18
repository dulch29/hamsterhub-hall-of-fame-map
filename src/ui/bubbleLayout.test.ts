import { test } from "node:test";
import assert from "node:assert/strict";
import { bubbleLayout, previewLayout } from "./bubbleLayout";

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
      const card = previewLayout({ width: width!, height: height! }, { x: point.x, y: point.y, width: point.size, height: point.size });
      assert.ok(card.x >= 14 && card.x + card.width <= width! - 14);
      assert.ok(card.y >= 130 && card.y + card.height <= height! - 20);
    }
  });
}
