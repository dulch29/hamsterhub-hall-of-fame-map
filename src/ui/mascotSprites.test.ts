import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { FIGHT_FRAMES, MASCOT_POSES, mascotSpritePath } from "./mascotSprites";

test("all mascot pose sprite paths resolve to existing non-empty PNG files in public/demo", () => {
  assert.deepEqual(MASCOT_POSES, ["pet", "walk1", "walk2", "talk", "back", "jump", "argue", "cry", "roll", "curious", "point"]);
  for (const mascot of ["guide", "explainer"] as const) {
    for (const pose of MASCOT_POSES) {
      const url = mascotSpritePath(mascot, pose);
      assert.equal(url, `/demo/${mascot}-${pose}.png`);
      const diskPath = resolve(process.cwd(), "public", url.slice(1));
      assert.ok(existsSync(diskPath), `Missing sprite file: ${diskPath}`);
      assert.ok(statSync(diskPath).size > 1000, `Empty/corrupt sprite file: ${diskPath}`);
    }
  }
  assert.equal(FIGHT_FRAMES.length, 3);
  for (const url of FIGHT_FRAMES) {
    const diskPath = resolve(process.cwd(), "public", url.slice(1));
    assert.ok(existsSync(diskPath), `Missing fight frame: ${diskPath}`);
    assert.ok(statSync(diskPath).size > 1000, `Empty/corrupt fight frame: ${diskPath}`);
  }
});
