import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { landingHeight, prepareLandingCamera } from "./provinceLanding";

test("province blocks have a visible overlapping wave and settle within 2.2 seconds", () => {
  assert.ok(landingHeight(0, 0, 77) > 5);
  assert.ok(landingHeight(300, 0, 77) < landingHeight(300, 76, 77));
  for (const index of [0, 28, 76]) {
    let previous = Infinity;
    for (let time = 0; time <= 2200; time += 20) {
      const height = landingHeight(time, index, 77);
      assert.ok(Number.isFinite(height) && height >= 0 && height <= previous);
      previous = height;
    }
    assert.equal(landingHeight(2200, index, 77), 0);
    assert.equal(landingHeight(9000, index, 77), 0);
  }
  assert.ok(landingHeight(1200, 76, 77) > 3);
  assert.ok(landingHeight(1800, 76, 77) > 0.5);
  assert.equal(landingHeight(2200, 0, 1), 0);
});

test("falling land stays inside the clipping range when it enters a tall narrow viewport", () => {
  for (const top of [10, 20, 40]) {
    const camera = new THREE.OrthographicCamera(-6, 6, top, -top, 0.1, 100);
    camera.position.set(-10, 19, 12);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const bounds = new THREE.Box3(new THREE.Vector3(-5, 0, -7), new THREE.Vector3(5, 0.25, 7));
    const settled = new THREE.Vector3(3, 0.25, 7).project(camera);
    const lift = prepareLandingCamera(camera, bounds);
    const after = new THREE.Vector3(3, 0.25, 7).project(camera);
    assert.ok(Math.abs(settled.x - after.x) < 1e-6 && Math.abs(settled.y - after.y) < 1e-6,
      "camera depth fitting must preserve the apparent POV");
    for (const z of [-7, 0, 7]) {
      for (let time = 0; time <= 2200; time += 16) {
        const point = new THREE.Vector3(3, landingHeight(time, 38, 77, lift), z).project(camera);
        if (Math.abs(point.y) <= 1) assert.ok(point.z >= -1 && point.z <= 1,
          "a visible falling block must not be clipped by camera depth");
      }
    }
  }
});

test("a viewport-sized lift starts every province above the sky edge and keeps its fall vertical", () => {
  const camera = new THREE.OrthographicCamera(-12, 12, 10, -10, 0.1, 100);
  camera.position.set(-10, 19, 12);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  for (const index of [0, 38, 76]) {
    const start = new THREE.Vector3(0, landingHeight(0, index, 77, 32), 6).project(camera);
    assert.ok(start.y > 1, "even the southernmost block starts above the viewport");
    const falling = new THREE.Vector3(0, landingHeight(1200, index, 77, 32), 6).project(camera);
    assert.ok(Math.abs(start.x - falling.x) < 1e-6, "fall has no sideways drift");
    assert.equal(landingHeight(2200, index, 77, 32), 0);
  }
});
