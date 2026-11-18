import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createAwards, SAMPLE_AWARDS } from "./awards";

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
