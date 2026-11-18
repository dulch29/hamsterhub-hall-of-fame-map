import assert from 'node:assert/strict';
import test from 'node:test';
import { clusterPoints, fanOut } from './screen';
import type { ScreenPoint } from './screen';

const point = (id: string, x = 0, y = 0): ScreenPoint => ({ id, x, y });
const members = (points: readonly ScreenPoint[], radius?: number) =>
  clusterPoints(points, radius).map((cluster) => cluster.ids);
const idsOf = (points: readonly { id: string }[]) => points.map(({ id }) => id).sort();

test('empty and singleton inputs have exact counts and coordinates', () => {
  assert.deepEqual(clusterPoints([]), []);
  const clusters = clusterPoints([point('solo', -12, 4)]);
  assert.equal(clusters.length, 1);
  assert.deepEqual(clusters[0], {
    id: 'cluster:["solo"]', x: -12, y: 4, ids: ['solo'],
  });
  assert.deepEqual(fanOut([], 10, 20), []);
  assert.deepEqual(fanOut(['solo'], 10, 20), [point('solo', 10, 20)]);
});

test('threshold is inclusive and uses Euclidean distance', () => {
  assert.equal(clusterPoints([point('a'), point('b', 32)]).length, 1);
  assert.equal(clusterPoints([point('a'), point('b', 32.000001)]).length, 2);
  assert.equal(clusterPoints([point('a'), point('b', 3, 4)], 5).length, 1);
  assert.equal(clusterPoints([point('a'), point('b', 4, 4)], 5).length, 2);
  assert.equal(clusterPoints([point('a'), point('b', 0, 32)]).length, 1);
});

test('neighbor cells work across positive and negative boundaries', () => {
  assert.deepEqual(members([
    point('d', 64.1, 64.1), point('c', 63.9, 63.9),
    point('b', 0.1, 0.1), point('a', -0.1, -0.1),
  ], 1), [['a', 'b'], ['c', 'd']]);
});

test('transitive proximity merges components even when the bridge sorts last', () => {
  const clusters = clusterPoints([point('a'), point('b', 60), point('z', 30)]);
  assert.equal(clusters.length, 1);
  assert.deepEqual(clusters[0]?.ids, ['a', 'b', 'z']);
  assert.equal(clusters[0]?.x, 30);
  assert.equal(clusters[0]?.y, 0);
});

test('zero radius groups only exactly coincident points', () => {
  assert.deepEqual(members([
    point('a', -2, 3), point('b', -2, 3), point('c', -2 + 1e-9, 3),
  ], 0), [['a', 'b'], ['c']]);
});

test('output is identical across all permutations and inputs remain untouched', () => {
  const points = Object.freeze([
    Object.freeze(point('z', 100, 4)),
    Object.freeze(point('a', 0, 2)),
    Object.freeze(point('b', 10, 4)),
    Object.freeze(point('c', 200, 8)),
  ]);
  const expected = clusterPoints(points);
  function permutations<T>(items: readonly T[]): T[][] {
    if (!items.length) return [[]];
    return items.flatMap((item, index) =>
      permutations(items.filter((_, i) => i !== index)).map((rest) => [item, ...rest]));
  }
  for (const permutation of permutations(points)) {
    assert.deepEqual(clusterPoints(permutation), expected);
    assert.deepEqual(fanOut(permutation.map(({ id }) => id), 3, 7),
      fanOut(points.map(({ id }) => id), 3, 7));
  }
  assert.deepEqual(points.map(({ id }) => id), ['z', 'a', 'b', 'c']);
});

test('500 dense points retain every member and have a stable centroid and identity', () => {
  const points = Array.from({ length: 500 }, (_, i) =>
    point(`student-${i}`, 100 + i % 5, 200 + i % 10));
  const clusters = clusterPoints(points);
  assert.equal(clusters.length, 1);
  assert.deepEqual(clusters[0]?.ids, idsOf(points));
  assert.ok(Math.abs(clusters[0]!.x - 102) < 1e-10);
  assert.ok(Math.abs(clusters[0]!.y - 204.5) < 1e-10);
  assert.deepEqual(clusterPoints([...points].reverse()), clusters);
  assert.equal(clusterPoints(points.map((p) => ({ ...p, x: p.x + 10 })))[0]?.id,
    clusters[0]?.id);
});

test('mixed dense and isolated points form a partition with no duplicate or lost entries', () => {
  const points = Array.from({ length: 500 }, (_, i) =>
    point(`student-${i}`, i < 300 ? i % 3 : i * 100, i < 300 ? i % 7 : 0));
  const clusters = clusterPoints(points);
  assert.equal(clusters.length, 201);
  assert.deepEqual(clusters.flatMap(({ ids }) => ids).sort(), idsOf(points));
  assert.equal(new Set(clusters.map(({ id }) => id)).size, clusters.length);
});

test('identity encoding handles punctuation and preserves repeated ID occurrences', () => {
  const clusters = clusterPoints([
    point('a,b'), point('a', 100), point('b', 100), point('a', 100),
  ]);
  assert.equal(new Set(clusters.map(({ id }) => id)).size, 2);
  assert.deepEqual(clusters.flatMap(({ ids }) => ids).sort(), ['a', 'a', 'a,b', 'b']);
  assert.deepEqual(clusterPoints([
    point('a', 100), point('b', 100), point('a'), point('a,b'),
  ]), clusterPoints([
    point('a,b'), point('a'), point('b', 100), point('a', 100),
  ]));
});

test('500 fan-out targets occupy distinct positions at least the requested spacing apart', () => {
  const ids = Object.freeze(Array.from({ length: 500 }, (_, i) => `student-${i}`));
  for (const spacing of [40, 13.5]) {
    const points = fanOut(ids, -123.25, 456.5, spacing);
    assert.equal(points.length, 500);
    assert.deepEqual(idsOf(points), [...ids].sort());
    for (let i = 0; i < points.length; i++) {
      const a = points[i]!;
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j]!;
        assert.ok(Math.hypot(a.x - b.x, a.y - b.y) >= spacing - 1e-10,
          `targets ${a.id} and ${b.id} overlap`);
      }
    }
    assert.deepEqual(fanOut([...ids].reverse(), -123.25, 456.5, spacing), points);
  }
  assert.deepEqual(fanOut(['b', 'a'], 0, 0), [point('a'), point('b', 40)]);
});

test('invalid numeric options and coordinates fail explicitly', () => {
  for (const radius of [-1, NaN, Infinity]) {
    assert.throws(() => clusterPoints([], radius), RangeError);
  }
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.throws(() => clusterPoints([point('a', value)]), RangeError);
    assert.throws(() => clusterPoints([point('a', 0, value)]), RangeError);
    assert.throws(() => fanOut([], value, 0), RangeError);
    assert.throws(() => fanOut([], 0, value), RangeError);
  }
  for (const spacing of [0, -1, NaN, Infinity]) {
    assert.throws(() => fanOut([], 0, 0, spacing), RangeError);
  }
});
