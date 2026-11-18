import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { PROVINCE_CODES, type Kid, type MapPin, type ProvinceCode } from '../types';
import {
  generateProvincePins, loadProvinces, provinceNames, type ProvinceFeature,
} from './provinces';

const assetText = readFileSync(
  new URL('../../public/data/thailand-provinces.geojson', import.meta.url), 'utf8',
);
type Asset = { type: string; features: ProvinceFeature[] };
function bundledAsset(): Asset {
  return JSON.parse(assetText) as Asset;
}

function kid(id: string, province: ProvinceCode): Kid {
  return {
    id, province, displayName: 'Synthetic student', showOnMap: true,
    avatarUrl: null, profileUrl: 'https://example.invalid/profile',
    projects: [], featuredProjectId: null, featuredProject: null,
  };
}

// Independent oracle: signed winding count, rather than production's ray parity.
// Boundary points are classified separately so holes and outer edges are excluded.
function winding(point: MapPin['position'], ring: number[][]): number | 'boundary' {
  let count = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [ax, ay] = ring[i]! as [number, number];
    const [bx, by] = ring[i + 1]! as [number, number];
    const cross = (bx - ax) * (point.lat - ay) - (point.lng - ax) * (by - ay);
    if (cross === 0 && point.lng >= Math.min(ax, bx) && point.lng <= Math.max(ax, bx) &&
      point.lat >= Math.min(ay, by) && point.lat <= Math.max(ay, by)) return 'boundary';
    if (ay <= point.lat && by > point.lat && cross > 0) count++;
    if (ay > point.lat && by <= point.lat && cross < 0) count--;
  }
  return count;
}

function contains(point: MapPin['position'], feature: ProvinceFeature): boolean {
  const polygons = feature.geometry.type === 'Polygon'
    ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  return polygons.some((polygon) => {
    const exterior = winding(point, polygon[0]!);
    return exterior !== 0 && exterior !== 'boundary' &&
      polygon.slice(1).every((hole) => winding(point, hole) === 0);
  });
}

function rectangle(left: number, bottom: number, right: number, top: number): number[][] {
  return [[left, bottom], [right, bottom], [right, top], [left, top], [left, bottom]];
}

function synthetic(geometry: ProvinceFeature['geometry']): ProvinceFeature {
  return { type: 'Feature', properties: { code: 'TH-10', name: 'Synthetic' }, geometry };
}

test('loader reads the bundled asset with exactly 77 named contract codes including TH-38', async (t) => {
  const requests: unknown[] = [];
  t.mock.method(globalThis, 'fetch', async (url: unknown) => {
    requests.push(url);
    return new Response(assetText);
  });
  const features = await loadProvinces();
  assert.deepEqual(requests, ['/data/thailand-provinces.geojson']);
  assert.equal(features.length, 77);
  assert.deepEqual(features.map((feature) => feature.properties.code).sort(), [...PROVINCE_CODES].sort());
  assert.equal(new Set(features.map((feature) => feature.properties.code)).size, 77);
  assert.equal(features.find((feature) => feature.properties.code === 'TH-38')?.properties.name, 'Bueng Kan');
  for (const feature of features) {
    assert.equal(provinceNames[feature.properties.code], feature.properties.name);
    assert.deepEqual(Object.keys(feature.properties).sort(), ['code', 'name']);
  }
  assert.deepEqual(Object.keys(provinceNames).sort(), [...PROVINCE_CODES].sort());
  assert.ok(features.some((feature) => feature.geometry.type === 'MultiPolygon'));
});

const invalidAssets: [string, (asset: Asset) => void][] = [
  ['wrong collection type', (asset) => { asset.type = 'Feature'; }],
  ['missing Bueng Kan', (asset) => {
    asset.features = asset.features.filter((feature) => feature.properties.code !== 'TH-38');
  }],
  ['duplicate province', (asset) => { asset.features[1] = asset.features[0]!; }],
  ['unknown province', (asset) => { Object.assign(asset.features[0]!.properties, { code: 'TH-99' }); }],
  ['blank name', (asset) => { asset.features[0]!.properties.name = ' '; }],
  ['unsupported geometry', (asset) => { Object.assign(asset.features[0]!.geometry, { type: 'Point' }); }],
  ['empty polygon', (asset) => {
    asset.features[0]!.geometry = { type: 'Polygon', coordinates: [] };
  }],
  ['empty multipolygon', (asset) => {
    asset.features[0]!.geometry = { type: 'MultiPolygon', coordinates: [] };
  }],
  ['open ring', (asset) => {
    asset.features[0]!.geometry = { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1]]] };
  }],
  ['degenerate ring', (asset) => {
    asset.features[0]!.geometry = { type: 'Polygon', coordinates: [[[0, 0], [1, 1], [2, 2], [0, 0]]] };
  }],
  ['out-of-range coordinate', (asset) => {
    asset.features[0]!.geometry = { type: 'Polygon', coordinates: [rectangle(180, 0, 181, 1)] };
  }],
  ['non-numeric coordinate', (asset) => {
    const ring = rectangle(0, 0, 1, 1);
    Object.assign(ring[1]!, { 0: null });
    asset.features[0]!.geometry = { type: 'Polygon', coordinates: [ring] };
  }],
];

for (const [description, mutate] of invalidAssets) {
  test(`loader rejects ${description}`, async (t) => {
    const asset = bundledAsset();
    mutate(asset);
    t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify(asset)));
    await assert.rejects(loadProvinces(), /Invalid province geometry|77 unique province codes/);
  });
}

test('loader rejects HTTP, malformed JSON and network failures, then permits retry', async (t) => {
  let response: () => Promise<Response> = async () => new Response('', { status: 503 });
  t.mock.method(globalThis, 'fetch', () => response());
  await assert.rejects(loadProvinces(), /503/);
  response = async () => new Response('{broken');
  await assert.rejects(loadProvinces(), SyntaxError);
  response = async () => { throw new Error('offline'); };
  await assert.rejects(loadProvinces(), /offline/);
  response = async () => new Response(assetText);
  assert.equal((await loadProvinces()).length, 77);
});

test('bundled provinces contain every pin and keep jitter within the anchor radius cap', () => {
  const features = bundledAsset().features;
  for (const feature of features) {
    const kids = Array.from({ length: 30 }, (_, i) => kid(`${feature.properties.code}-${i}`, feature.properties.code));
    const before = structuredClone(feature);
    const pins = generateProvincePins(kids, [feature]);
    assert.equal(pins.length, kids.length);
    assert.equal(new Set(pins.map((pin) => JSON.stringify(pin.position))).size, kids.length);
    const geometryPoints = feature.geometry.type === 'Polygon'
      ? feature.geometry.coordinates.flat() : feature.geometry.coordinates.flat(2);
    const maxAbsLatitude = Math.max(...geometryPoints.map((point) => Math.abs(point[1]!)));
    const minLongitudeScale = Math.cos(maxAbsLatitude * Math.PI / 180);
    for (let i = 0; i < pins.length; i++) {
      const pin = pins[i]!;
      assert.equal(pin.kidId, kids[i]!.id);
      assert.ok(Number.isFinite(pin.position.lng) && Number.isFinite(pin.position.lat));
      assert.ok(contains(pin.position, feature), `outside ${feature.properties.code}`);
      for (const other of pins.slice(i + 1)) {
        // Both pins must lie within 0.1 latitude degrees of the same anchor.
        // Using the smallest longitude cosine in the province is conservative.
        const dx = (pin.position.lng - other.position.lng) * minLongitudeScale;
        const dy = pin.position.lat - other.position.lat;
        assert.ok(Math.hypot(dx, dy) <= 0.2 + 1e-10, `unbounded jitter ${feature.properties.code}`);
      }
    }
    assert.deepEqual(feature, before);
  }
});

test('province anchors and ID jitter reproduce under student and geometry reorder/filter', () => {
  const features = bundledAsset().features;
  const kids = features.flatMap((feature) =>
    Array.from({ length: 3 }, (_, i) => kid(`${feature.properties.code}-${i}`, feature.properties.code)));
  const before = structuredClone(kids);
  const pins = generateProvincePins(kids, features);
  assert.deepEqual(generateProvincePins(kids, features), pins);
  assert.deepEqual(generateProvincePins([...kids].reverse(), [...features].reverse()), [...pins].reverse());
  const survivors = kids.filter((_, i) => i % 5 === 0);
  assert.deepEqual(generateProvincePins(survivors, features), pins.filter((_, i) => i % 5 === 0));
  assert.deepEqual(generateProvincePins([survivors[0]!], [features[0]!]), [pins[0]!]);
  assert.deepEqual(kids, before);
});

test('independent oracle distinguishes holes, exterior boundaries and multipart gaps', () => {
  const feature = synthetic({
    type: 'MultiPolygon',
    coordinates: [
      [rectangle(0, 0, 10, 10), rectangle(2, 2, 8, 8)],
      [rectangle(20, 20, 21, 21)],
    ],
  });
  for (const [lng, lat] of [[1, 1], [20.5, 20.5]]) assert.ok(contains({ lng: lng!, lat: lat! }, feature));
  for (const [lng, lat] of [[5, 5], [0, 5], [2, 5], [15, 15]]) {
    assert.equal(contains({ lng: lng!, lat: lat! }, feature), false);
  }
});

test('anchor disc remains contained with holes, concavity and separated multipart islands', () => {
  const fixtures: ProvinceFeature[] = [
    synthetic({ type: 'Polygon', coordinates: [rectangle(0, 0, 10, 10), rectangle(2, 2, 8, 8)] }),
    synthetic({
      type: 'MultiPolygon',
      coordinates: [
        [rectangle(0, 0, 1, 1), rectangle(0.2, 0.2, 0.8, 0.8)],
        [rectangle(10, 10, 11, 11)],
      ],
    }),
    synthetic({
      type: 'Polygon',
      coordinates: [[[0, 0], [4, 0], [4, 1], [1, 1], [1, 4], [0, 4], [0, 0]]],
    }),
  ];
  const kids = Array.from({ length: 500 }, (_, i) => kid(`synthetic-${i}`, 'TH-10'));
  for (const feature of fixtures) {
    const pins = generateProvincePins(kids, [feature]);
    assert.equal(new Set(pins.map((pin) => JSON.stringify(pin.position))).size, 500);
    for (const pin of pins) assert.ok(contains(pin.position, feature));
    assert.deepEqual(generateProvincePins(kids.slice(25, 30), [feature]), pins.slice(25, 30));
  }
});

test('jitter scales down for a small province rather than using the full 0.1 cap', () => {
  const feature = synthetic({ type: 'Polygon', coordinates: [rectangle(0, 0, 0.01, 0.01)] });
  const pins = generateProvincePins(Array.from({ length: 100 }, (_, i) => kid(`small-${i}`, 'TH-10')), [feature]);
  for (const pin of pins) {
    assert.ok(contains(pin.position, feature));
    for (const other of pins) {
      assert.ok(Math.hypot(pin.position.lng - other.position.lng, pin.position.lat - other.position.lat) < 0.00301);
    }
  }
});

test('strict opt-in, missing and duplicate geometry errors, and bounded anchor failure', () => {
  const visible = kid('synthetic', 'TH-10');
  for (const showOnMap of [false, 'true', 1, undefined]) {
    assert.deepEqual(generateProvincePins([{ ...visible, showOnMap } as Kid], []), []);
  }
  assert.deepEqual(generateProvincePins([], []), []);
  assert.throws(() => generateProvincePins([visible], []), { message: 'Missing province geometry: TH-10' });
  const feature = synthetic({ type: 'Polygon', coordinates: [rectangle(0, 0, 1, 1)] });
  assert.throws(() => generateProvincePins([], [feature, feature]), /Duplicate province geometry: TH-10/);
  // A closed exterior exactly covered by a hole has no acceptable interior.
  // Exhaustion must throw rather than return a centroid, vertex, or unchecked anchor.
  const impossible = synthetic({
    type: 'Polygon', coordinates: [rectangle(0, 0, 1, 1), rectangle(0, 0, 1, 1)],
  });
  assert.throws(() => generateProvincePins([visible], [impossible]), {
    message: 'Unable to sample province anchor: TH-10',
  });
});
