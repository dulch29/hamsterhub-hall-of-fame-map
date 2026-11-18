import assert from 'node:assert/strict';
import test from 'node:test';
import { projectLngLat, unprojectXY } from './project';

test('projection origin, axes, and geographic grid round-trip', () => {
  assert.deepEqual(projectLngLat({ lng: 101, lat: 13 }), { x: 0, y: 0 });
  assert.ok(projectLngLat({ lng: 102, lat: 13 }).x > 0);
  assert.ok(projectLngLat({ lng: 101, lat: 14 }).y > 0);
  for (const options of [
    undefined,
    { origin: { lng: 100, lat: 14 }, refLat: 15, scale: 20 },
  ]) {
    for (let lng = 97; lng <= 106; lng++) {
      for (let lat = 5; lat <= 21; lat++) {
        const result = unprojectXY(projectLngLat({ lng, lat }, options), options);
        assert.ok(Math.abs(result.lng - lng) <= 1e-9);
        assert.ok(Math.abs(result.lat - lat) <= 1e-9);
      }
    }
  }
});

test('projection rejects non-finite or out-of-range coordinates and configurations', () => {
  for (const position of [
    { lng: NaN, lat: 13 }, { lng: 101, lat: Infinity },
    { lng: 181, lat: 13 }, { lng: 101, lat: 90 },
  ]) assert.throws(() => projectLngLat(position), /Invalid geographic position/);
  assert.throws(() => unprojectXY({ x: Infinity, y: 0 }), /Invalid projected position/);
  assert.throws(() => unprojectXY({ x: 0, y: 100 }), /Invalid geographic position/);
  for (const options of [
    { origin: { lng: 101, lat: 13 }, refLat: 90, scale: 1 },
    { origin: { lng: 101, lat: 13 }, refLat: 13, scale: 0 },
    { origin: { lng: NaN, lat: 13 }, refLat: 13, scale: 1 },
  ]) {
    assert.throws(() => projectLngLat({ lng: 101, lat: 13 }, options), /Invalid projection configuration/);
    assert.throws(() => unprojectXY({ x: 0, y: 0 }, options), /Invalid projection configuration/);
  }
});
