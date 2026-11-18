# Plan — Clustering and fan-out

Status: synthetic grouping, zoom and fan-out integrated; physical-device review remains open.

## Testable demo checkpoint (2026-11-17)

`src/cluster/screen.ts` groups screen-space connected components with deterministic
ID ordering and a spatial hash. It supplies a spaced square-spiral fan-out.
Cluster selection zooms toward the group and opens its complete member list;
maximum-zoom fan-out uses bounded pages. Explicit small-group and 500-maker Bangkok
datasets are available. See [test guide](../testing.md) and HANDOFF.md for checks.

## Steps

### Firefly treatment (2026-11-17)

Keep the deterministic clustering and bounded square-spiral fan-out unchanged.
Accessible keyed buttons now contain decorative inner spans; count labels and
hit areas stay still while lights drift. Newly revealed fan-out lights travel
from the group's screen position for 240ms using WAAPI transform/opacity.
Reduced motion skips this movement. Focus resolves after camera travel ends,
keyboard expansion stays immediate, and fan-out announcements reset on collapse.
The complete member list and paged access remain available.

1. Define pure input/output types for projected pins, cluster membership, and fan-out positions.
2. Choose a screen-space grouping threshold and stable ordering; document how resize and camera changes trigger recomputation.
3. Implement count markers and a deterministic cluster-to-member mapping.
4. Connect cluster selection to bounded camera movement and recompute groups after zoom.
5. At the camera limit, fan out overlapping members while preserving the underlying province-anchor positions.
6. Connect individual fanned-out targets to package 04's selection API. Reset fan-out predictably on camera changes or dismissal.
7. Add a dense Bangkok fixture explicitly for testing; the current 500-record generator spreads extra students across provinces.
8. Register pure logic tests with the project's test command.

## Validation

Test empty/single inputs, threshold boundaries, identical positions, stable output, count conservation, and maximum-zoom fan-out. In the browser, open every member of a dense cluster and repeat after resize and camera movement.

Run tests, type checking, and the build. Pass dense-fixture measurements to package 08.

## Handoff

Document grouping parameters, camera dependencies, fan-out reset behavior, and evidence that dense groups remain fully reachable.
