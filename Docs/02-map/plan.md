# Plan — Province data and 3D map

Status: synthetic scene implemented; physical-device/performance acceptance remains open.

## Reference overview framing (2026-11-19, Task 028)

Keep the reference's north-upper-left/south-lower-right direction. Center the
actual projected land silhouette horizontally using province mesh vertices once
at scene setup; the rotated world bounding box previously biased it left. Move
camera and target by the same shift, so initial and Reset share the composition
without changing selection travel or the saved pre-selection return contract.
See [Task 028](../agents/tasks/028-soap-bubble-polish.md) for actual checks.

## Return from award focus (2026-11-18, Task 023)

Every individual trophy/medal selection saves the pre-selection camera position,
orbit target and zoom. Repeated activation and switching awards keep that origin.
Background click returns using the existing 240ms eased travel; Escape/reduced
motion returns immediately. Manual map changes discard the snapshot while a
stationary background pointer-down preserves it. Reset/data replacement clear
it. The origin survives interrupted opening/return travel until arrival.
See [Task 023](../agents/tasks/023-award-return-view.md) for verification scope.

## Batched province landing (2026-11-18, Task 021)

The 485 polygon pieces now share one mesh and one outline per province. Caps
and walls use two indexed material groups, preserving original attributes,
holes, triangles and bounds. Separate outline segments avoid bridges between
islands. All 77 province groups still fall independently with the same timing.
The desktop diagnostic reduced peak render calls from 1464 to 240 per frame.
See [Task 021](../agents/tasks/021-landing-performance.md) and HANDOFF.md for limits.

## Smooth award attention (2026-11-18, Task 020)

Task 020 supersedes the 5-degree lean with 15 degrees and replaces direct
quaternion assignment with a 280ms eased turn. Mouse hover and selected province
state both target the viewer; either can keep the set facing forward. Finite
turns run alongside ambient motion or on their own while ambient is paused.
Reduced motion/hidden states settle directly. Preview labels/native tooltips
are removed, preserving accessible names/descriptions and explorer labels.
See [Task 020](../agents/tasks/020-award-hover-turn.md).

## Selected award fronts and sky landing (2026-11-18, Task 019)

Resting awards retain their world direction with a fixed 5-degree local Z lean.
All placements from the selected province use the camera quaternion for their
fronts, including companion medals; orbit positions remain three dimensional.
Clearing selection restores the world direction. The fitted camera determines
the landing lift from the lowest projected land corner, with a sky-edge margin.
Provinces fall only along world Y; the existing 2.2s timing and interruption
rules remain. Continuous 360-degree rotation was discussed only.

See [Task 019](../agents/tasks/019-award-focus-skyfall.md) for scope and
[HANDOFF.md](../../HANDOFF.md) for final verification.

## Upright awards and oblique home (2026-11-18, Task 018)

The user's latest reference sets the home/reset direction to `(-10, 19, 12)`
from the map center, with responsive fitting. Main award geometry stays at
zero world rotation and bobs gently. Real instanced companions at 34% scale
follow inclined 10s orbits, with depth testing behind/in front of the main.
Grouped sample quantities retain separate instances. Elevation includes clearance
for the complete base and lowest companion arc, including selected scale.

Province landing uses 0–900ms north-to-south delays and 1300ms eased falls,
complete by 2200ms. Award provinces receive mint top surfaces and modest
emissive light. Existing province-only anchors, selection, groups, keyboard,
fallback and explorer behavior remain regression targets.

The requested idle motion uses the existing renderer/context and cached award
placements; only instance matrices change on idle frames. Camera/landing reuse
their existing rendering. Pause, visibility, reduced motion and unmount stop
the loop. This supersedes Task 017's billboarding and companion image approach.
See [Task 018](../agents/tasks/018-award-orbit-view.md) and
[HANDOFF.md](../../HANDOFF.md) for final evidence and review limits.
Final checks: 72 unit tests, both typechecks, build and 15 production-preview
cases passed. Development passed 15 preview cases before the final clearance/count
fixes and all 19 explorer/fan-out regressions afterward. Read-only recheck found
no remaining issues; physical-phone/GPU and lead acceptance remain open.

## Province landing and facing awards (2026-11-18)

Task 017 adds camera-quaternion billboarding with upright local award geometry.
Province meshes and outlines share a group, so multipart provinces land as one
block. A north-to-south overlapping wave has bounded delays (0–520ms) and 680ms
falls; all blocks settle within 1.2 seconds. Entrance work ends afterward.
Gestures, keyboard actions, resize, hidden tabs or reduced motion settle it
immediately. Award projection uses the lead province's current elevation to
avoid depth occlusion during the fall. Province-only anchors remain unchanged.

Sample groups promote trophy > gold > silver > bronze and retain smaller
medals and counts. Three fictional students remain; no production award schema
or student data changed. Companion artwork is rasterized from the same geometry
once using the existing renderer/context. CSS floats these camera-facing images;
the main instanced mesh follows orbit/tilt without an idle WebGL loop.
Validation: 70 unit tests, both typechecks, final build, 33 development browser
checks and 14 production-preview checks passed. See
[Task 017](../agents/tasks/017-award-constellations.md) and
[HANDOFF.md](../../HANDOFF.md) for evidence and remaining device/review limits.

## Combined sculpted awards (2026-11-18)

Task 016 implements the user's approved navy/enamel/3D combination. Shared
instanced local geometry provides a gold trophy, silver medal and bronze medal
for the three explicit fictional IDs. Individual activation reuses cancelable
240ms camera travel; keyboard and reduced motion are immediate. Framing does
not compound on repeated activation. Reset restores the complete fitted map.
Selection remains reachable alongside groups; nearby targets reserve space
from each other. Camera matrices refresh before DOM/mesh projection, including
after tilt/reset. Escape works while sibling map controls have focus.

No student contract or coordinate derivation changed. The integrated explorer
retains its existing behavior. Final validation: 66 unit tests, both typechecks,
build and 11 production-preview browser tests passed. All 30 development browser
tests passed before the final preview-only collision refinement; its pure
regression and the production preview suite passed afterward. See the
[review record](../agents/exchanges/2026-11-18-sculpted-awards.md). Device/FPS
acceptance remains pending.

## Map-first review (2026-11-18)

The default preview fits the complete map on narrow viewports and uses gold
star medal pins with blue ribbon tails. Hover/focus labels and selected badge
state stay in the scene overlay; the preview opens no cards. The explorer is
retained at `?view=explorer`, including count badges and max-zoom fan-out.
Geometry, instanced anchor pins, province privacy and prepared data are unchanged.
Six preview browser tests and all 19 explorer/fan-out regressions passed in
installed Edge, sequentially, one worker, tracing off. Real-device performance
and production requirements remain open. Task 015 records ownership/review limits.

## Testable demo checkpoint (2026-11-17)

The asset covers all 77 provinces. Source/license details are in
[geometry-source.md](geometry-source.md). The scene renders extruded provinces,
instanced pins, constrained orbit/pan/zoom and resizing. The loader derives
deterministic interior anchors and ID-seeded disc jitter with containment rejection.
Failures switch to the shared list. See [test guide](../testing.md) and HANDOFF.md.

## Implemented foundation (2026-11-17)

Claude delegated pure pin derivation in Task 006. `src/geo/hash.ts` implements
FNV-1a over UTF-8; `src/geo/pins.ts` accepts prepared kids and a partial
province-anchor table, returning stable ID-seeded disc jitter in input order.
Longitude offsets are corrected for anchor latitude. Invalid/missing anchors
fail with province-only messages. No actual anchors or geometry are supplied,
and the app does not call this helper yet.

Four tests pass: known hash vectors, repeat/reorder/filter stability, 500
distinct finite positions inside the corrected radius, and anchor failures.
The full 27-test suite, type checking and build passed. These tests do not
establish polygon containment, real province placement or working WebGL.
Geometry source/license selection and browser verification remain pending.

Task 007 accepted the helper and requested hardening before scene use. Codex
added a second strict opt-in check, own-property anchor lookup, positive radius,
and separately salted hashes for radius and angle. Five pin tests now include
the unchanged 75–175-per-quadrant bounds over 500 sequential IDs.

`src/geo/project.ts` adds the provisional local equirectangular projection and
inverse. Defaults (origin 101°E/13°N, reference latitude 13°, scale 1) are
placeholders; replace them from the selected geometry bounds. Two tests cover
grid round-trips, custom options, axis direction and invalid values. Final
suite: 30 tests passed; type checking and build passed.

No polygon containment is established. An anchor disc must lie wholly inside
its province, including holes and multipart boundaries, or a deterministic
polygon rejection strategy must replace the disc. Centroids can lie outside
concave provinces. No actual projection fit or default placement is verified.

Task 008 found raw salted FNV values correlated radius and angle. A joint
16-cell equal-area test reproduced the issue. Murmur3 avalanche mixing on
each salted hash fixes it without changing test thresholds. This is synthetic
distribution coverage, not proof of polygon containment.

## Steps

1. Research a province dataset and verify its license permits the intended use and redistribution. Record source, version/download date, license, and attribution before committing assets.
2. Normalize geometry identifiers to `ProvinceCode`; check complete coverage, multipart provinces, and valid geometry.
3. Choose province anchors and define a documented projection into scene coordinates. Review deterministic offsets to keep them near the province anchor.
4. Implement scene creation, resize handling, constrained camera controls, and disposal under `src/scene/`.
5. Consume package 03's visible students and derive `MapPin` positions from province anchors and ID-seeded jitter.
6. Render instanced pins and maintain an instance-to-student mapping. Surface hover and selection callbacks for package 04.
7. Wire the map into the starter with the default three mocks. Coordinate `src/App.tsx` and shared-file edits with the lead.
8. Expose initialization errors and context-loss signals for package 06. Document the render/projection inputs package 05 needs.

## Validation

- Check all 77 codes resolve to geometry and anchors.
- Verify offsets are deterministic, finite, and computed without student coordinates.
- Confirm the three default province placements, camera bounds, picking, resize, and cleanup in a browser.
- Run type checking and the production build; add focused tests for coordinate derivation.
- Check a 500-student synthetic scene as an early smoke check; full performance measurement belongs to 08.

## Handoff

Task 031 replaces only the preview's dark ground pin with a DOM gold beam and
ground-plane aura. Screen endpoints and the projected ground basis use existing
camera/landing draws; spreading rings animate with CSS. No extra WebGL loop or
student location field is added. Explorer sphere pins retain their behavior.

Record the geometry license and actual checks. Give 04 selection events, 05 projection/camera inputs, and 06 scene failure signals.
