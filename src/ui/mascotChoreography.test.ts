import assert from "node:assert/strict";
import test from "node:test";
import {
  faceSignForDelta,
  facingLabel,
  pickRaceWinner,
  pickWanderTarget,
  rectsOverlap,
  selectExplainerPose,
  selectGuidePose,
} from "./mascotChoreography";

test("faceSignForDelta mirrors left-facing sprites when moving right and preserves left when moving left", () => {
  assert.equal(faceSignForDelta(40, 1), -1);
  assert.equal(facingLabel(faceSignForDelta(40, 1)), "right");
  assert.equal(faceSignForDelta(-35, -1), 1);
  assert.equal(facingLabel(faceSignForDelta(-35, -1)), "left");
  assert.equal(faceSignForDelta(0, -1), -1);
  assert.equal(faceSignForDelta(0, 1), 1);
});

test("selectGuidePose and selectExplainerPose cover walk1/walk2, jump, argue, talk, curious and pet", () => {
  assert.equal(
    selectGuidePose({ moving: false, step: 0, dx: 0, dy: 0, open: false, scene: "rivalry", arguing: true, jumping: true }),
    "jump",
  );
  assert.equal(
    selectGuidePose({ moving: true, step: 0, dx: 10, dy: -80, open: false, scene: "tour", arguing: false }),
    "walk1",
  );
  assert.equal(
    selectGuidePose({ moving: true, step: 1, dx: 80, dy: -10, open: false, scene: "tour", arguing: false }),
    "walk2",
  );
  assert.equal(
    selectGuidePose({ moving: false, step: 0, dx: 0, dy: 0, open: false, scene: "tour", arguing: false, hovered: true }),
    "curious",
  );
  assert.equal(
    selectGuidePose({ moving: false, step: 0, dx: 0, dy: 0, open: false, scene: "rivalry", arguing: true }),
    "argue",
  );
  assert.equal(
    selectGuidePose({ moving: false, step: 0, dx: 0, dy: 0, open: true, scene: "rivalry", arguing: true }),
    "talk",
  );
  assert.equal(
    selectExplainerPose({ traveling: false, step: 0, dx: 0, dy: 0, typing: true, scene: "rivalry", arguing: true }),
    "argue",
  );
  assert.equal(
    selectExplainerPose({ traveling: false, step: 1, dx: 0, dy: 0, typing: true, scene: "rivalry", arguing: true }),
    "talk",
  );
  assert.equal(
    selectExplainerPose({ traveling: false, step: 0, dx: 0, dy: 0, typing: false, scene: "tour", arguing: false, hovered: true }),
    "curious",
  );
  assert.equal(
    selectExplainerPose({ traveling: false, step: 0, dx: 0, dy: 0, typing: false, scene: "tour", arguing: false, pointing: true }),
    "point",
  );
  assert.equal(
    selectExplainerPose({ traveling: false, step: 0, dx: 0, dy: 0, typing: false, scene: "tour", arguing: false, pointing: true, startled: true }),
    "startle",
  );
  assert.equal(
    selectGuidePose({ moving: false, step: 0, dx: 0, dy: 0, open: false, scene: "tour", arguing: false, startled: true }),
    "startle",
  );
  assert.equal(
    selectExplainerPose({ traveling: true, step: 0, dx: 5, dy: -90, typing: false, scene: "rivalry", arguing: false }),
    "walk1",
  );
});

test("pickRaceWinner deterministically selects guide or explainer from rng", () => {
  assert.equal(pickRaceWinner(() => 0.12), "guide");
  assert.equal(pickRaceWinner(() => 0.87), "explainer");
});

test("pickWanderTarget widens vertical range beyond 56px and avoids medal and UI obstacles", () => {
  const baseRect = { left: 22, top: 716, right: 86, bottom: 788 };
  const viewport = { width: 1440, height: 844 };
  const obstacles = [
    { left: 16, top: 16, right: 220, bottom: 68 }, // brand mark
    { left: 680, top: 360, right: 744, bottom: 424 }, // Bangkok medal
    { left: 520, top: 180, right: 584, bottom: 244 }, // Chiang Mai medal
  ];
  let seed = 1;
  const rng = () => {
    seed = (seed * 48271) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  let sawDeepVertical = false;
  for (let i = 0; i < 16; i++) {
    const offset = pickWanderTarget({
      baseRect,
      viewport,
      obstacles,
      medals: obstacles.slice(1),
      visitMedal: i % 3 === 0,
      rng,
    });
    const placed = {
      left: baseRect.left + offset.x,
      top: baseRect.top + offset.y,
      right: baseRect.right + offset.x,
      bottom: baseRect.bottom + offset.y,
    };
    if (offset.y < -60) sawDeepVertical = true;
    for (const obs of obstacles) {
      assert.equal(rectsOverlap(placed, obs, 4), false);
    }
  }
  assert.equal(sawDeepVertical, true);
});
