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
  assert.equal(meshes.filter((mesh) => mesh.count > 0).length, 8);
  const matrix = new THREE.Matrix4();
  const silver = meshes.find((mesh) => mesh.name === "award-silver-metal")!;
  const silverPositions = Array.from({ length: silver.count }, (_, index) => {
    silver.getMatrixAt(index, matrix);
    return new THREE.Vector3().setFromMatrixPosition(matrix);
  });
  assert.ok(silverPositions.some((p) => Math.abs(p.x + 2) < 1e-6 && Math.abs(p.z + 3) < 1e-6));
  awards.update([], 60, null);
  assert.ok(meshes.every((mesh) => mesh.count === 0));
  let geometriesDisposed = 0;
  for (const mesh of meshes) mesh.geometry.addEventListener("dispose", () => geometriesDisposed++);
  awards.dispose();
  assert.equal(scene.children.length, 0);
  assert.equal(geometriesDisposed, meshes.length);
});

test("award orientation stays fixed in the world and reveals depth during camera orbit", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  const camera = new THREE.PerspectiveCamera();
  let initial: THREE.Vector3 | null = null;
  const viewDots: number[] = [];
  for (const position of [[-10, 19, 12], [14, 12, -8], [-15, 8, 4]]) {
    camera.position.set(...position as [number, number, number]);
    camera.lookAt(0, 0, 0);
    awards.update([{ id: "mock-2a-0002", position: new THREE.Vector3(0, 0.75, 0) }], 60, null);
    const mesh = scene.getObjectByName("award-silver-metal") as THREE.InstancedMesh;
    const matrix = new THREE.Matrix4();
    mesh.getMatrixAt(0, matrix);
    const normal = new THREE.Vector3(0, 0, 1).transformDirection(matrix);
    const up = new THREE.Vector3(0, 1, 0).transformDirection(matrix);
    initial ??= normal.clone();
    assert.ok(normal.distanceTo(initial) < 1e-6);
    assert.ok(up.distanceTo(new THREE.Vector3(0, 1, 0)) < 1e-6, "main awards have zero tilt");
    viewDots.push(normal.dot(camera.position.clone().normalize()));
  }
  assert.ok(viewDots[0]! > 0.4 && viewDots[0]! < 0.9, "home view should show the face and its depth");
  assert.ok(Math.max(...viewDots) - Math.min(...viewDots) > 0.3);
  awards.dispose();
});

test("main awards bob upright while small 3D companions orbit through front and back", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  const trophy = scene.getObjectByName("award-trophy-metal") as THREE.InstancedMesh;
  const gold = scene.getObjectByName("award-gold-metal") as THREE.InstancedMesh;
  const view = new THREE.Vector3(-10, 19, 12).normalize();
  const mainHeights: number[] = [], depths: number[] = [];
  for (let time = 0; time <= 12000; time += 500) {
    awards.update([{ id: "mock-2a-0001", position: new THREE.Vector3(0, 0.75, 0) }], 60, null, time);
    const main = new THREE.Matrix4(), satellite = new THREE.Matrix4();
    trophy.getMatrixAt(0, main);
    gold.getMatrixAt(0, satellite);
    assert.equal(gold.count, 1);
    const center = new THREE.Vector3().setFromMatrixPosition(main);
    const offset = new THREE.Vector3().setFromMatrixPosition(satellite).sub(center);
    depths.push(offset.dot(view));
    mainHeights.push(center.y);
    const primarySize = new THREE.Vector3().setFromMatrixScale(main).x;
    assert.ok(new THREE.Vector3().setFromMatrixScale(satellite).x <= primarySize * 0.36);
    assert.ok(offset.length() < primarySize * 0.7);
    assert.ok(new THREE.Vector3().setFromMatrixPosition(satellite).y > 0.25);
    assert.ok(new THREE.Vector3(0, 1, 0).transformDirection(main).y > 0.9999);
  }
  assert.ok(Math.max(...mainHeights) - Math.min(...mainHeights) > 0.08);
  assert.ok(Math.min(...depths) < -0.2 && Math.max(...depths) > 0.2);
  assert.equal(gold.material instanceof THREE.Material && gold.material.depthTest, true);
  awards.dispose();
});

test("floating award geometry stays above its province at overview and selected sizes", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  for (const selected of [null, "mock-2a-0001"]) {
    for (const time of [0, 1000, 2500, 4000, 6000, 8000]) {
      awards.update([{ id: "mock-2a-0001", position: new THREE.Vector3(0, 0.75, 0) }], 20, selected, time);
      for (const object of scene.children) {
        const mesh = object as THREE.InstancedMesh;
        mesh.geometry.computeBoundingBox();
        for (let i = 0; i < mesh.count; i++) {
          const transform = new THREE.Matrix4();
          mesh.getMatrixAt(i, transform);
          assert.ok(mesh.geometry.boundingBox!.clone().applyMatrix4(transform).min.y > 0.25,
            `${mesh.name} should clear the province surface`);
        }
      }
    }
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
  assert.ok(summary);
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  awards.update([{ id: summary.leadId, position: new THREE.Vector3(0, 0.75, 0), summary }], 60, null);
  const metalMeshes = scene.children.filter((object) => object.name.endsWith("-metal")) as THREE.InstancedMesh[];
  assert.equal(metalMeshes.reduce((total, mesh) => total + mesh.count, 0), 6);
  assert.equal(metalMeshes.find((mesh) => mesh.name === "award-silver-metal")!.count, 2);
  assert.equal(metalMeshes.find((mesh) => mesh.name === "award-bronze-metal")!.count, 2);
  awards.dispose();
  assert.deepEqual(summarizeAwards(["mock-2a-0003", "mock-2a-0001", "mock-2a-0002"]), summary);
  assert.deepEqual(summarizeAwards(["mock-2a-0001", "mock-2a-0001"]), summarizeAwards(["mock-2a-0001"]));
  assert.equal(summarizeAwards(["unknown", "__proto__"]), null);
});
