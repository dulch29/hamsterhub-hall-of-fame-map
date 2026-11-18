# Thailand province geometry

Retrieved and verified on 2026-11-17. Geometry assignment: this note,
`public/data/thailand-provinces.geojson`, `src/geo/provinces.ts`, and the
subsequently authorized `src/geo/provinces.test.ts`.

## Source and licenses

GeoThai publishes the selected simplified province GeoJSON. Its pinned revision
is `5b0fc5e329f562152b2ffa6a3a597dd81d9a6adf`.

- Publisher: https://github.com/GeoThai/boundaries
- Download: https://raw.githubusercontent.com/GeoThai/boundaries/5b0fc5e329f562152b2ffa6a3a597dd81d9a6adf/provinces.geojson
- Publisher documentation: https://github.com/GeoThai/boundaries/blob/5b0fc5e329f562152b2ffa6a3a597dd81d9a6adf/README.md
- License: https://github.com/GeoThai/boundaries/blob/5b0fc5e329f562152b2ffa6a3a597dd81d9a6adf/LICENSE
- Provenance notice: https://github.com/GeoThai/boundaries/blob/5b0fc5e329f562152b2ffa6a3a597dd81d9a6adf/NOTICE
- Original boundary dataset identified by the publisher: https://data.humdata.org/dataset/cod-ab-tha

Geometry is Creative Commons Attribution 3.0 IGO:
https://creativecommons.org/licenses/by/3.0/igo/ .
Province codes and names come from GeoThai/data under Creative Commons
Attribution 4.0: https://github.com/GeoThai/data and
https://creativecommons.org/licenses/by/4.0/ .
Both licenses permit redistribution and adaptation with attribution and
identification of changes. This is a licensed derivative publication, not a claim
that GeoThai originally surveyed the borders. The publisher credits the Royal
Thai Survey Department, acquisition by ICRC, and publication by OCHA Field
Information Services Section through OCHA COD-AB.

Display credit when integrating the map:
**GeoThai, from OCHA COD-AB and the Royal Thai Survey Department**.
Provide the geometry and names/code license links alongside that credit.
The asset retains this attribution, the complete upstream NOTICE, both license
URIs, the pinned source URL, and a description of our changes as GeoJSON foreign
members, so these notices also accompany the distributed asset.
The integrator owns visible attribution because UI files are outside this task.

## Asset transformation

The publisher documents 2022 source boundary lines, dissolution from the
subdistrict layer, simplification to 5% of the points, four decimal place
coordinates, and retained small islands. We retain that simplified geometry
unchanged. Coordinates are WGS84 longitude/latitude degrees.

Each feature has only normalized properties `{ code: "TH-xx", name: string }`:
prefix the upstream two-digit DOPA code with `TH-`, use `name_en` as `name`,
and sort features by code. Bangkok and Bueng Kan (`TH-38`) are included.
No student data or actual student coordinates appear in the asset.

- Upstream GeoJSON SHA-256: `26741e78228724f03f39c35648027034c75faaeb4fed6db0cb0b44e517a93eac`
- Normalized GeoJSON SHA-256: `7a8c55bdbaa3ce7cf618bfc5b58be0c1cc163e8deac9af97e0f6432c0b6c71dd`
- Normalized size: 2,295,122 bytes before HTTP compression.

## Consumer interface and placement

`ProvinceFeature` exports a discriminated Polygon/MultiPolygon union using
`number[][][]` / `number[][][][]` coordinates, with `type: 'Feature'` and
`properties: { code: ProvinceCode; name: string }`.
`loadProvinces(): Promise<ProvinceFeature[]>` fetches the local asset relative to
Vite's base URL, validates finite closed nonzero-area rings, and requires exactly
the 77 unique contract codes. Failed HTTP or validation rejects the promise;
callers may retry. `provinceNames` is a frozen complete English name lookup.

`generateProvincePins(kids, features): MapPin[]` reuses `hashId` with Mulberry32.
It strictly excludes students whose `showOnMap` is not `true`, preserving input
order. First, a stream seeded only by the province code chooses an interior
anchor. For multipart provinces, component bounding boxes are weighted by box
area; sampling rejects candidates outside that component or within/on any hole.
The accepted anchor belongs to one component, shared by all students in that
province independently of student membership and ordering.

Jitter radius in latitude degrees is
`min(0.1, 0.15 * min(componentBBoxWidth * cos(anchorLatitude), componentBBoxHeight))`.
Each student's ID and province seed a separate stream: disc radius is
`jitterRadius * sqrt(random())`, angle is `2 * pi * random()`, and longitude
offset is divided by `cos(anchorLatitude)`. Candidates must remain strictly
inside the anchor's component and outside all holes and their boundaries; exterior boundaries are
also rejected. This preserves the Project.md province-anchor plus bounded
ID-seeded jitter contract, with no actual student coordinates.

Anchor selection and each student's jitter search permit at most 16,384 attempts
each. An unsuccessful search throws a province-only error. The initial anchor
is found by checked interior sampling rather than an unchecked centroid; there
is no fallback position when a student's jitter search fails.
The containment guarantee applies to returned points against the supplied
simple GeoJSON polygon rings. Runtime validation checks shape, coordinates,
closure and nonzero area; it is not a general topology repair engine.
Geometry and projection rendering remain the scene owner's responsibility.

## Initial verification on 2026-11-17 (before anchor contract alignment)

- `npm.cmd run typecheck`: passed.
- `npm.cmd test`: all 30 existing tests passed. Those tests do not discover a
  province test file; this task adds no test files outside its assigned scope.
- Dedicated assertions executed through `node --import tsx --input-type=module`
  with a stdin script: passed. Mocked `fetch` exercised the actual loader against
  the bundled asset; exact sorted coverage matched `PROVINCE_CODES`, including
  `TH-38`, with all names matching the exported lookup. The layer contains 62
  Polygon and 15 MultiPolygon features.
- Generated 100 students per province (7,700 pins). A separate winding-number
  oracle checked every pin for province containment. Repeated, reversed, and
  filtered input preserved each student's exact coordinates.
- Another 1,500 pins covered a polygon with a central hole, disjoint multipart
  geometry with a hole, and a concave L-shaped polygon. All passed the independent
  containment oracle, with 500 distinct positions in each synthetic fixture.
- Verified strict opt-out filtering, missing/duplicate province errors, and
  loader rejection of incomplete coverage, duplicate codes, empty coordinates,
  unknown codes, and HTTP 503.

These checks establish data/helper behavior. They do not establish scene
appearance, picking, visible attribution, browser networking, or phone performance.

## Durable regression suite

`src/geo/provinces.test.ts` exercises the bundled asset through the loader with
per-test restored fetch mocks. It checks exact 77-code/name coverage including
Bueng Kan, malformed geometry and incomplete/duplicate coverage rejection,
HTTP/JSON/network errors and retry. Containment uses an independent signed
winding-number oracle, with its own hole/boundary/multipart-gap fixtures.

Placement tests cover all provinces, reproducibility under student and feature
reorder/filter, strict opt-in, input immutability, the shared anchor's 0.1-degree
radius cap, a small province's proportional radius, concavity, holes, separated
islands, missing/duplicate geometry, and bounded anchor failure. Test discovery
registration is owned by the main integrator.

After anchor contract alignment, executed
`node --import tsx --test src/geo/provinces.test.ts`: all 20 tests passed,
including 2,310 real-province pins and 1,500 synthetic hole/concavity/multipart
pins. `npm.cmd run typecheck` also passed. No test registration or shared files
were edited in this follow-up.
