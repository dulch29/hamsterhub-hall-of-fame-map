import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createAwards, SAMPLE_AWARDS, summarizeAwards } from "./awards";

test("only explicit sample IDs have award artwork", () => {
  assert.equal(Object.keys(SAMPLE_AWARDS).length, 3);
  assert.equal(SAMPLE_AWARDS["mock-2a-0001"], "trophy");
  assert.equal(SAMPLE_AWARDS["real-student"], undefined);
});

test("award batches retain IDs, hide omitted members, and dispose shared resources", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  awards.update([
    { id: "mock-2a-0001", position: new THREE.Vector3(1, 0.75, 2) },
    { id: "mock-2a-0002", position: new THREE.Vector3(-2, 0.75, -3) },
  ], 60, null);
  const meshes = scene.children.filter((item): item is THREE.InstancedMesh => item instanceof THREE.InstancedMesh);
  assert.equal(meshes.filter((mesh) => mesh.count > 0).length, 4);
  const matrix = new THREE.Matrix4();
  const silver = meshes.find((mesh) => mesh.name === "award-silver-metal")!;
  silver.getMatrixAt(0, matrix);
  assert.ok(Math.abs(matrix.elements[12]! + 2) < 1e-6);
  assert.ok(Math.abs(matrix.elements[14]! + 3) < 1e-6);
  awards.update([], 60, null);
  assert.ok(meshes.every((mesh) => mesh.count === 0));
  let geometriesDisposed = 0;
  for (const mesh of meshes) mesh.geometry.addEventListener("dispose", () => geometriesDisposed++);
  awards.dispose();
  assert.equal(scene.children.length, 0);
  assert.equal(geometriesDisposed, meshes.length);
});

test("award faces remain upright toward the camera through orbit and tilt", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  const camera = new THREE.PerspectiveCamera();
  for (const position of [[0, 19, 10], [14, 12, -8], [-15, 8, 4]]) {
    camera.position.set(...position as [number, number, number]);
    camera.lookAt(0, 0, 0);
    awards.update([{ id: "mock-2a-0002", position: new THREE.Vector3(0, 0.75, 0) }], 60, null, camera.quaternion);
    const mesh = scene.getObjectByName("award-silver-metal") as THREE.InstancedMesh;
    const matrix = new THREE.Matrix4();
    mesh.getMatrixAt(0, matrix);
    const normal = new THREE.Vector3(0, 0, 1).transformDirection(matrix);
    const up = new THREE.Vector3(0, 1, 0).transformDirection(matrix);
    assert.ok(normal.dot(camera.position.clone().normalize()) > 0.9999);
    assert.ok(up.dot(new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion)) > 0.9999);
  }
  awards.dispose();
});

test("a province group promotes its highest sample and preserves the smaller medals", () => {
  const summary = summarizeAwards(["mock-2a-0002", "mock-2a-0001", "mock-2a-0003"]);
  assert.equal(summary?.primary, "trophy");
  assert.equal(summary?.leadId, "mock-2a-0001");
  assert.deepEqual(summary?.companions, [{ style: "gold", count: 1 }, { style: "silver", count: 2 }, { style: "bronze", count: 2 }]);
  assert.equal(summary?.makerCount, 3);
  assert.equal(summary?.awardCount, 6);
  assert.deepEqual(summarizeAwards(["mock-2a-0003", "mock-2a-0001", "mock-2a-0002"]), summary);
  assert.deepEqual(summarizeAwards(["mock-2a-0001", "mock-2a-0001"]), summarizeAwards(["mock-2a-0001"]));
  assert.equal(summarizeAwards(["unknown", "__proto__"]), null);
});
