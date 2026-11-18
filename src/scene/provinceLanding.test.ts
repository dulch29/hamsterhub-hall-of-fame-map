import { test } from "node:test";
import assert from "node:assert/strict";
import { landingHeight } from "./provinceLanding";

test("province blocks fall in an overlapping wave and all settle within 1.2 seconds", () => {
  assert.ok(landingHeight(0, 0, 77) > 5);
  assert.ok(landingHeight(300, 0, 77) < landingHeight(300, 76, 77));
  for (const index of [0, 28, 76]) {
    let previous = Infinity;
    for (let time = 0; time <= 1200; time += 20) {
      const height = landingHeight(time, index, 77);
      assert.ok(Number.isFinite(height) && height >= 0 && height <= previous);
      previous = height;
    }
    assert.equal(landingHeight(1200, index, 77), 0);
    assert.equal(landingHeight(9000, index, 77), 0);
  }
  assert.equal(landingHeight(1200, 0, 1), 0);
});
