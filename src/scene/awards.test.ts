import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { buildingLevelForCount, createAwards, SAMPLE_AWARDS, summarizeAwards } from "./awards";

test("only explicit sample IDs have award artwork", () => {
  assert.equal(Object.keys(SAMPLE_AWARDS).length, 3);
  assert.equal(SAMPLE_AWARDS["mock-2a-0001"], "trophy");
  assert.equal(SAMPLE_AWARDS["real-student"], undefined);
});

test("explicit preview artwork supports independent student IDs and excludes unassigned IDs", () => {
  const artwork = { "local-test-student": ["silver", "bronze"] as const };
  assert.deepEqual(summarizeAwards(["local-test-student", "local-test-student", "unknown"], artwork), {
    primary: "silver", leadId: "local-test-student", companions: [{ style: "bronze", count: 1 }], makerCount: 1, awardCount: 2,
  });
  assert.equal(summarizeAwards(["mock-2a-0001"], artwork), null);
});

test("buildingLevelForCount maps recipient count to 4 progressive architectural tiers", () => {
  assert.equal(buildingLevelForCount(0), 1);
  assert.equal(buildingLevelForCount(1), 1);
  assert.equal(buildingLevelForCount(2), 2);
  assert.equal(buildingLevelForCount(3), 2);
  assert.equal(buildingLevelForCount(4), 3);
  assert.equal(buildingLevelForCount(7), 3);
  assert.equal(buildingLevelForCount(8), 4);
  assert.equal(buildingLevelForCount(25), 4);
});

test("tiered 3D building set keeps eight batches, finite geometry, and strictly increasing heights", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  const meshes = scene.children as THREE.InstancedMesh[];
  assert.equal(meshes.length, 8);

  const heights: number[] = [];
  let triangles = 0;
  for (const level of [1, 2, 3, 4] as const) {
    const structMesh = scene.getObjectByName(`building-${level}-structure`) as THREE.InstancedMesh;
    const winMesh = scene.getObjectByName(`building-${level}-windows`) as THREE.InstancedMesh;
    assert.ok(structMesh instanceof THREE.InstancedMesh);
    assert.ok(winMesh instanceof THREE.InstancedMesh);

    for (const mesh of [structMesh, winMesh]) {
      const position = mesh.geometry.getAttribute("position");
      const normal = mesh.geometry.getAttribute("normal");
      assert.ok([...position.array, ...normal.array].every(Number.isFinite));
      assert.equal(position.count, normal.count);
      triangles += (mesh.geometry.index?.count ?? position.count) / 3;
      mesh.geometry.computeBoundingBox();
      assert.ok(mesh.geometry.boundingBox!.min.y >= -1e-6, `${mesh.name} base must rest at or above y=0`);
    }

    structMesh.geometry.computeBoundingBox();
    const size = structMesh.geometry.boundingBox!.getSize(new THREE.Vector3());
    assert.ok(size.x < 0.7 && size.z < 0.7, `building-${level} fits within map footprint`);
    heights.push(size.y);
  }

  assert.ok(triangles < 4000, `${triangles} stored triangles should stay well within budget`);
  assert.ok(heights[0]! < heights[1]! && heights[1]! < heights[2]! && heights[2]! < heights[3]!,
    `building heights must increase strictly by tier: ${heights.join(" < ")}`);
  awards.dispose();
});

test("buildings remain static, upright, and grounded on their province without bobbing or spinning", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  const placements = [
    { id: "mock-2a-0001", position: new THREE.Vector3(1, 0.24, 2), recipientCount: 4 },
    { id: "mock-2a-0002", position: new THREE.Vector3(-2, 0.24, -3), recipientCount: 1 },
    { id: "mock-2a-0003", position: new THREE.Vector3(0, 0.24, 0), recipientCount: 8 },
  ];

  const camera = new THREE.OrthographicCamera();
  camera.position.set(-10, 19, 12);
  camera.lookAt(0, 0, 0);

  const turningFirst = awards.update(placements, 60, null, 0, camera.quaternion, 0);
  assert.equal(turningFirst, false);

  const level1 = scene.getObjectByName("building-1-structure") as THREE.InstancedMesh;
  const level3 = scene.getObjectByName("building-3-structure") as THREE.InstancedMesh;
  const level4 = scene.getObjectByName("building-4-structure") as THREE.InstancedMesh;
  assert.equal(level1.count, 1);
  assert.equal(level3.count, 1);
  assert.equal(level4.count, 1);

  const m0 = new THREE.Matrix4();
  level3.getMatrixAt(0, m0);
  const pos0 = new THREE.Vector3().setFromMatrixPosition(m0);
  assert.ok(Math.abs(pos0.x - 1) < 1e-6 && Math.abs(pos0.y - 0.24) < 1e-6 && Math.abs(pos0.z - 2) < 1e-6);
  const up0 = new THREE.Vector3(0, 1, 0).transformDirection(m0);
  assert.ok(up0.y > 0.9999, "building must stand straight upright");

  // Advance time and orbit camera; static buildings should not bob or rotate
  camera.position.set(14, 12, -8);
  camera.lookAt(0, 0, 0);
  const turningLater = awards.update(placements, 60, null, 5000, camera.quaternion, 5000);
  assert.equal(turningLater, false);

  const m1 = new THREE.Matrix4();
  level3.getMatrixAt(0, m1);
  assert.ok(m0.elements.every((val, idx) => Math.abs(val - m1.elements[idx]!) < 1e-6),
    "static building transform must remain identical over time and camera orbit");

  awards.update([], 60, null);
  const meshes = [...scene.children] as THREE.InstancedMesh[];
  assert.ok(meshes.every((mesh) => mesh.count === 0));
  let geometriesDisposed = 0;
  for (const mesh of meshes) mesh.geometry.addEventListener("dispose", () => geometriesDisposed++);
  awards.dispose();
  assert.equal(scene.children.length, 0);
  assert.equal(geometriesDisposed, meshes.length);
});

test("summarizeAwards orders styles deterministically and ignores unknown IDs", () => {
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
