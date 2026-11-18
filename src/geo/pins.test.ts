import assert from 'node:assert/strict';
import test from 'node:test';
import { generateMockKids } from '../mock/generate';
import { hashId } from './hash';
import { derivePins } from './pins';
import type { Kid } from '../types';

const anchor = { lng: 100, lat: 15, radiusDeg: 0.01 };
const anchors = { 'TH-10': anchor, 'TH-50': anchor, 'TH-83': anchor } as const;

test('UTF-8 FNV-1a matches known vectors', () => {
  assert.equal(hashId(''), 0x811c9dc5);
  assert.equal(hashId('a'), 0xe40c292c);
  assert.equal(hashId('foobar'), 0xbf9cf968);
  assert.notEqual(hashId('มาลี'), hashId('มาลา'));
});

test('pin placement repeats and is independent of input order and membership', () => {
  const kids = generateMockKids();
  const pins = derivePins(kids, anchors);
  assert.deepEqual(derivePins(kids, anchors), pins);
  assert.deepEqual(derivePins([...kids].reverse(), anchors), [...pins].reverse());
  assert.deepEqual(derivePins(kids.slice(1), anchors), pins.slice(1));
  assert.deepEqual(derivePins([], {}), []);
});

test('500 same-province positions are finite, distinct and inside the corrected radius', () => {
  const kids = generateMockKids({ count: 500 }).map((kid) => ({ ...kid, province: 'TH-10' as const }));
  const before = structuredClone(kids);
  const pins = derivePins(kids, anchors);
  const quadrants = [0, 0, 0, 0];
  const cells = Array<number>(16).fill(0);
  assert.equal(new Set(pins.map((pin) => JSON.stringify(pin.position))).size, 500);
  for (const { position } of pins) {
    assert.ok(Number.isFinite(position.lng) && Number.isFinite(position.lat));
    const dx = (position.lng - anchor.lng) * Math.cos(anchor.lat * Math.PI / 180);
    const dy = position.lat - anchor.lat;
    assert.ok(Math.hypot(dx, dy) <= anchor.radiusDeg + 1e-12);
    const quadrant = (dx >= 0 ? 0 : 1) + (dy >= 0 ? 0 : 2);
    quadrants[quadrant]! += 1;
    const annulus = Math.min(3, Math.floor((dx * dx + dy * dy) / (anchor.radiusDeg ** 2) * 4));
    cells[annulus * 4 + quadrant]! += 1;
  }
  assert.ok(quadrants.every((count) => count >= 75 && count <= 175), JSON.stringify(quadrants));
  // 500/16 expected per equal-area cell; bounds span roughly four standard deviations.
  assert.ok(cells.every((count) => count >= 10 && count <= 53), JSON.stringify(cells));
  assert.deepEqual(kids, before);
});

test('missing or invalid anchors fail without exposing student identity', () => {
  const kids = generateMockKids().slice(0, 1);
  assert.throws(() => derivePins(kids, {}), { message: 'Missing anchor: TH-10' });
  for (const invalid of [
    { ...anchor, lat: 90 }, { ...anchor, lng: Infinity },
    { ...anchor, radiusDeg: -1 }, { ...anchor, radiusDeg: NaN },
    { ...anchor, radiusDeg: 0 },
  ]) {
    assert.throws(() => derivePins(kids, { 'TH-10': invalid }), { message: 'Invalid anchor: TH-10' });
  }
});

test('requires strict opt-in and ignores inherited anchors', () => {
  const kid = generateMockKids()[0]!;
  assert.deepEqual(derivePins([{ ...kid, showOnMap: false }], {}), []);
  assert.deepEqual(derivePins([{ ...kid, showOnMap: 'true' } as unknown as Kid], {}), []);
  assert.throws(() => derivePins([kid], Object.create(anchors)), { message: 'Missing anchor: TH-10' });
});
