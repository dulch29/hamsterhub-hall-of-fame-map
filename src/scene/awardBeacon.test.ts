import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { beaconProjection } from './awardBeacon';

test('beacon joins its award to the ground plane and tracks camera zoom and landing elevation', () => {
  const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, .1, 100);
  camera.position.set(5, 19, 10);
  camera.lookAt(0, 0, 0); camera.updateMatrixWorld();
  const position = new THREE.Vector3(1, .75, 2);
  const original = position.clone();
  const p = beaconProjection(position, .24, camera, 1440, 900);
  assert.deepEqual(position, original);
  assert.ok(p.length > 0 && p.length < 100);
  assert.ok(Math.abs(p.top.x + Math.cos(p.angle + Math.PI / 2) * p.length - p.ground.x) < 1e-8);
  assert.ok(Math.abs(p.top.y + Math.sin(p.angle + Math.PI / 2) * p.length - p.ground.y) < 1e-8);
  assert.ok(Math.abs(p.plane[0]! * p.plane[3]! - p.plane[1]! * p.plane[2]!) > .1);
  camera.zoom = 3; camera.updateProjectionMatrix();
  const zoomed = beaconProjection(position, .24, camera, 1440, 900);
  assert.ok(Math.abs(zoomed.length - p.length * 3) < 1e-8);
  const falling = beaconProjection(position.clone().add(new THREE.Vector3(0, 5, 0)), 5.24, camera, 1440, 900);
  assert.ok(Math.abs(falling.length - zoomed.length) < 1e-8);
  assert.notEqual(falling.ground.y, zoomed.ground.y);
});
