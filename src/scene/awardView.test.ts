import { test } from "node:test";
import assert from "node:assert/strict";
import { awardView, separateAwardGroups } from "./awardView";

test("award framing translates without changing camera angle and does not compound zoom", () => {
  const view = awardView({ x: -0.8, y: 0.75, z: -5.5 },
    { x: 0, y: 19, z: 10 }, { x: 0, y: 0, z: -0.2 }, 7.6, 1);
  assert.equal(view.target.x, -0.8);
  assert.equal(view.target.z, -5.5);
  assert.equal(view.position.y - view.target.y, 19);
  assert.ok(Math.abs(view.position.z - view.target.z - 10.2) < 1e-10);
  assert.equal(view.zoom, 2.4);
  assert.deepEqual(awardView(view.target, view.position, view.target, 7.6, view.zoom), view);
});

test("narrow framing preserves useful context and respects camera bounds", () => {
  const view = awardView({ x: 100, y: 0.75, z: -100 },
    { x: 0, y: 19, z: 10 }, { x: 0, y: 0, z: 0 }, 11.1, 8);
  assert.equal(view.target.x, 5);
  assert.equal(view.target.z, -8);
  assert.equal(view.zoom, 8);
  assert.equal(awardView(view.target, view.position, view.target, 11.1, 1).zoom, 11.1 / 3.8);
});

test("nearby award groups remain separated from selection and each other", () => {
  for (const neighbors of [[100, 220], [170, 235], [32, 90]]) {
    const selected = { id: "selected", x: 160, y: 400 };
    const groups = neighbors.map((x, i) => ({ id: String(i), ids: [String(i)], x, y: 400 }));
    const original = structuredClone(groups);
    const placed = separateAwardGroups(groups, selected, 320, 844);
    const points = [selected, ...placed];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++)
        assert.ok(Math.hypot(points[i]!.x - points[j]!.x, points[i]!.y - points[j]!.y) >= 76);
    }
    assert.ok(placed.every((p) => p.x >= 32 && p.x <= 288 && p.y >= 32 && p.y <= 812));
    assert.deepEqual(groups, original);
    assert.deepEqual(placed.map((p) => p.ids), groups.map((p) => p.ids));
  }
});
