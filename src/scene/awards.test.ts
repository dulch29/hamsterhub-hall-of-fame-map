import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createAwards, SAMPLE_AWARDS, summarizeAwards } from "./awards";

test("only explicit sample IDs have award artwork", () => {
  assert.equal(Object.keys(SAMPLE_AWARDS).length, 3);
  assert.equal(SAMPLE_AWARDS["mock-2a-0001"], "trophy");
  assert.equal(SAMPLE_AWARDS["real-student"], undefined);
});

test("explicit preview artwork supports independent student IDs and excludes unassigned IDs", () => {
  const artwork = { 'local-test-student': ['silver', 'bronze'] as const };
  assert.deepEqual(summarizeAwards(['local-test-student', 'local-test-student', 'unknown'], artwork), {
    primary: 'silver', leadId: 'local-test-student', companions: [{ style: 'bronze', count: 1 }], makerCount: 1, awardCount: 2,
  });
  assert.equal(summarizeAwards(['mock-2a-0001'], artwork), null);
});

test("sculpted award set keeps eight batches and a bounded, finite mesh budget", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  const meshes = scene.children as THREE.InstancedMesh[];
  assert.equal(meshes.length, 8);
  assert.equal(scene.getObjectByName("award-gold-metal") instanceof THREE.InstancedMesh, true);
  assert.equal((scene.getObjectByName("award-gold-metal") as THREE.InstancedMesh).geometry,
    (scene.getObjectByName("award-silver-metal") as THREE.InstancedMesh).geometry);
  let triangles = 0;
  const geometries = new Set(meshes.map((mesh) => mesh.geometry));
  assert.equal(geometries.size, 4);
  for (const geometry of geometries) {
    const position = geometry.getAttribute("position");
    const normal = geometry.getAttribute("normal");
    assert.ok([...position.array, ...normal.array].every(Number.isFinite));
    assert.equal(position.count, normal.count);
    triangles += (geometry.index?.count ?? position.count) / 3;
    geometry.computeBoundingBox();
    const size = geometry.boundingBox!.getSize(new THREE.Vector3());
    assert.ok(size.z > 0.05, "models should retain physical depth");
    assert.ok(size.x < 0.85 && size.y < 0.9 && size.z < 0.65, "models fit their existing map envelope");
  }
  assert.ok(triangles < 8000, `${triangles} stored triangles should stay within the model budget`);
  awards.dispose();
});

test("medal enamel sits above the metal body and its reverse stays solid", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  const metal = scene.getObjectByName("award-gold-metal") as THREE.InstancedMesh;
  const enamel = scene.getObjectByName("award-gold-enamel") as THREE.InstancedMesh;
  const surfaces = [metal, enamel].map((batch) => {
    const mesh = new THREE.Mesh(batch.geometry, batch.material);
    mesh.name = batch.name;
    mesh.updateMatrixWorld();
    return mesh;
  });
  const front = new THREE.Raycaster(new THREE.Vector3(.175, .04, 1), new THREE.Vector3(0, 0, -1));
  assert.equal(front.intersectObjects(surfaces)[0]?.object.name, "award-gold-enamel");
  const back = new THREE.Raycaster(new THREE.Vector3(.175, .04, -1), new THREE.Vector3(0, 0, 1));
  assert.equal(back.intersectObjects(surfaces)[0]?.object.name, "award-gold-metal");
  awards.dispose();
});

test("trophy seal remains visible against the curved cup above and below its center", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  const surfaces = ["metal", "enamel"].map((name) => {
    const batch = scene.getObjectByName(`award-trophy-${name}`) as THREE.InstancedMesh;
    const mesh = new THREE.Mesh(batch.geometry, batch.material);
    mesh.name = name;
    mesh.updateMatrixWorld();
    return mesh;
  });
  for (const y of [.12, .24]) {
    const ray = new THREE.Raycaster(new THREE.Vector3(.035, y, 1), new THREE.Vector3(0, 0, -1));
    assert.equal(ray.intersectObjects(surfaces)[0]?.object.name, "enamel", `the seal is visible at y=${y}`);
  }
  awards.dispose();
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
    assert.ok(up.y > 0.96 && up.y < 0.98, "resting awards lean around 15 degrees");
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
    assert.ok(new THREE.Vector3(0, 1, 0).transformDirection(main).y > 0.96);
  }
  assert.ok(Math.max(...mainHeights) - Math.min(...mainHeights) > 0.08);
  assert.ok(Math.min(...depths) < -0.2 && Math.max(...depths) > 0.2);
  assert.equal(gold.material instanceof THREE.Material && gold.material.depthTest, true);
  awards.dispose();
});

test("selected award fronts and every companion face the viewer without turning other provinces", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  const camera = new THREE.OrthographicCamera();
  const matrix = new THREE.Matrix4();
  const restingFront = new THREE.Vector3(0, 0, 1);
  for (const position of [[-10, 19, 12], [14, 12, -8]]) {
    camera.position.set(...position as [number, number, number]);
    camera.lookAt(0, 0, 0);
    const viewer = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
    awards.update([
      { id: "mock-2a-0001", position: new THREE.Vector3(0, 0.75, 0) },
      { id: "mock-2a-0002", position: new THREE.Vector3(1, 0.75, 0), faceViewer: true },
      { id: "mock-2a-0003", position: new THREE.Vector3(3, 0.75, 0), faceViewer: false },
    ], 30, "mock-2a-0001", 2500, camera.quaternion);
    for (const object of scene.children) {
      const mesh = object as THREE.InstancedMesh;
      for (let i = 0; i < mesh.count; i++) {
        mesh.getMatrixAt(i, matrix);
        const front = new THREE.Vector3(0, 0, 1).transformDirection(matrix);
        const unrelated = mesh.name.includes("bronze") && i === mesh.count - 1;
        assert.ok(front.dot(unrelated ? restingFront : viewer) > 0.9999,
          `${mesh.name} should face its intended direction`);
      }
    }
  }
  awards.update([{ id: "mock-2a-0001", position: new THREE.Vector3(0, 0.75, 0) }], 30, null, 2500, camera.quaternion);
  const trophy = scene.getObjectByName("award-trophy-metal") as THREE.InstancedMesh;
  trophy.getMatrixAt(0, matrix);
  assert.ok(new THREE.Vector3(0, 0, 1).transformDirection(matrix).dot(restingFront) > 0.9999,
    "clearing selection restores the fixed world direction");
  awards.dispose();
});

test("floating award geometry stays above its province at overview and selected sizes", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  const camera = new THREE.OrthographicCamera();
  camera.position.set(-10, 19, 12);
  camera.lookAt(0, 0, 0);
  for (const selected of [null, "mock-2a-0001"]) {
    for (const time of [0, 1000, 2500, 4000, 6000, 8000]) {
      const placements = [{ id: "mock-2a-0001", position: new THREE.Vector3(0, 0.75, 0) }];
      awards.update(placements, 20, selected ? null : placements[0]!.id, time, camera.quaternion);
      for (const facingTime of [0, 70, 140, 210, 280]) {
        awards.update(placements, 20, selected, time, camera.quaternion, facingTime);
        for (const object of scene.children) {
          const mesh = object as THREE.InstancedMesh;
          mesh.geometry.computeBoundingBox();
          for (let i = 0; i < mesh.count; i++) {
            const transform = new THREE.Matrix4();
            mesh.getMatrixAt(i, transform);
            assert.ok(mesh.geometry.boundingBox!.clone().applyMatrix4(transform).min.y > 0.25,
              `${mesh.name} should clear the province surface throughout its turn`);
          }
        }
      }
    }
  }
  awards.dispose();
});

test("attention turns main and companion fronts gradually and reverses from their current pose", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  const camera = new THREE.OrthographicCamera();
  camera.position.set(-10, 19, 12);
  camera.lookAt(0, 0, 0);
  const placement = { id: "mock-2a-0001", position: new THREE.Vector3(0, 0.75, 0), faceViewer: false };
  const matrix = new THREE.Matrix4();
  const front = (style: string) => {
    (scene.getObjectByName(`award-${style}-metal`) as THREE.InstancedMesh).getMatrixAt(0, matrix);
    return new THREE.Vector3(0, 0, 1).transformDirection(matrix);
  };
  const viewer = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
  awards.update([placement], 30, null, 0, camera.quaternion, 0);
  const resting = front("trophy");
  placement.faceViewer = true;
  assert.equal(awards.update([placement], 30, null, 0, camera.quaternion, 100), true);
  assert.ok(front("trophy").distanceTo(resting) < 1e-6, "first frame must not snap");
  awards.update([placement], 30, null, 0, camera.quaternion, 200);
  const halfway = front("trophy");
  assert.ok(halfway.dot(viewer) > resting.dot(viewer) + 0.1);
  assert.ok(halfway.dot(viewer) < 0.999, "turn has intermediate poses");
  assert.ok(front("gold").distanceTo(halfway) < 1e-6, "companions turn with the main");
  placement.faceViewer = false;
  awards.update([placement], 30, null, 0, camera.quaternion, 200);
  assert.ok(front("trophy").distanceTo(halfway) < 1e-6, "reversal must not jump");
  assert.equal(awards.update([placement], 30, null, 0, camera.quaternion, 500), false);
  assert.ok(front("trophy").distanceTo(resting) < 1e-6);
  placement.faceViewer = true;
  awards.update([placement], 30, placement.id, 0, camera.quaternion, 600);
  assert.equal(awards.update([placement], 30, placement.id, 0, camera.quaternion, 900), false);
  assert.ok(front("trophy").dot(viewer) > 0.9999);
  placement.faceViewer = false;
  awards.update([placement], 30, null, 0, camera.quaternion);
  assert.ok(front("trophy").distanceTo(resting) < 1e-6, "reduced motion can settle immediately");
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
