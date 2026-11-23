import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import {
  buildingLevelForCount,
  createAwards,
  formatPinCount,
  provincePinColor,
  SAMPLE_AWARDS,
  slotReelState,
  spinningTopState,
  summarizeAwards,
} from "./awards";

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

test("formatPinCount, provincePinColor, slotReelState, and spinningTopState behave deterministically", () => {
  assert.equal(formatPinCount(1), "01");
  assert.equal(formatPinCount(8), "08");
  assert.equal(formatPinCount(12), "12");

  const bkk = provincePinColor("TH-10");
  const cnx = provincePinColor("TH-50");
  const hkt = provincePinColor("TH-83");
  assert.notEqual(bkk.hex, cnx.hex);
  assert.notEqual(bkk.hex, hkt.hex);
  assert.notEqual(cnx.hex, hkt.hex);

  const rolling = slotReelState(8, 750, 0);
  assert.equal(rolling.settled, false);
  const landed = slotReelState(8, 2200, 0);
  assert.equal(landed.settled, true);
  assert.equal(landed.current, 8);

  const beforeSpin = spinningTopState(1000, 1, 3, false);
  assert.equal(beforeSpin.active, false);
  const duringSpin = spinningTopState(2600 + 800, 1, 3, false);
  assert.equal(duringSpin.active, true);
  assert.ok(duringSpin.spinAngle > 0 && duringSpin.glow > 0);
  assert.equal(spinningTopState(2600 + 800, 1, 3, true).active, false);
});

test("3D map pins float, face the camera, spin like a glowing top, and dispose cleanly", () => {
  const scene = new THREE.Scene();
  const awards = createAwards(scene);
  const placements = [
    { id: "mock-2a-0001", position: new THREE.Vector3(1, 0.24, 2), recipientCount: 4, province: "TH-10" },
    { id: "mock-2a-0002", position: new THREE.Vector3(-2, 0.24, -3), recipientCount: 1, province: "TH-50" },
    { id: "mock-2a-0003", position: new THREE.Vector3(0, 0.24, 0), recipientCount: 8, province: "TH-83" },
  ];

  const camera = new THREE.OrthographicCamera();
  camera.position.set(-10, 19, 12);
  camera.lookAt(0, 0, 0);

  const animatingInitial = awards.update(placements, 60, null, 0, camera.quaternion, 0);
  assert.equal(animatingInitial, false);

  const pinRoot = scene.getObjectByName("province-map-pins") as THREE.Group;
  assert.ok(pinRoot instanceof THREE.Group);
  assert.equal(pinRoot.children.length, 3);

  const pin0 = scene.getObjectByName("map-pin-mock-2a-0001") as THREE.Group;
  assert.ok(pin0);
  const y0 = pin0.position.y;
  assert.ok(y0 > 0.24, "pin floats above province surface");

  // Advance to a spinning-top burst for pin index 1
  const spinTime = 2600 + 900;
  const animatingSpin = awards.update(placements, 60, null, spinTime, camera.quaternion, spinTime);
  assert.equal(animatingSpin, true);
  const pin1 = scene.getObjectByName("map-pin-mock-2a-0002") as THREE.Group;
  assert.ok(pin1.position.y !== y0, "floating animation updates pin Y over time");
  assert.ok(Math.abs(pin1.rotation.y) > 0.1, "spinning-top pin rotates around Y");

  awards.update([], 60, null);
  assert.equal(pinRoot.children.length, 0);
  awards.dispose();
  assert.equal(scene.children.length, 0);
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
