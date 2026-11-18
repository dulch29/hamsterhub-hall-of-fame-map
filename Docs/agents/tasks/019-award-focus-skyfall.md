# Task 019 — Award tilt, selected fronts and sky landing

User direction, 2026-11-18: give resting awards a subtle 5-degree lean, hide
the province landing start above the viewport, and face the selected province's
whole award set toward the viewer. Continuous 360-degree rotation is an opinion
request only; do not implement it.

Codex is the sole writer on `codex/award-focus-skyfall`, base `e5c1cd6`.
Write scope: `src/scene/awards.ts`, `provinceLanding.ts`, `ThailandMap.tsx`,
their existing tests, the fan-out test's trace setting, and focused
project/package/handoff/Graphify records.
Preserve the oblique home, compact real 3D orbits, gentle bob, mint provinces,
2.2-second total entrance, three fictional students, explorer and fallback.
No dependencies, student contract edits, merge or deployment.

| Element | Starts | Duration | Relationship |
|---|---|---|---|
| Province and outline | 0–900ms | 1300ms | Overlapping wave; straight world-Y fall from above viewport |
| Main award and companions | With province | Existing bob/orbit | Carried by land; fixed 5-degree lean at rest |
| Selected award set | On activation | With existing 240ms camera travel | Fronts follow camera while selected |
| Starlight | Existing | Existing | Preserve shared pause/reduced-motion behavior |

Verify camera-derived hidden starts at desktop/narrow aspects and final settle;
selected main/companion fronts and unselected world orientation; pause, reset,
keyboard and reduced motion. Browser runs remain sequential, one worker,
trace off. Inspect screenshots and actual interactions. Record lead review
availability and physical-device limitations honestly.

## Result

Implemented all requested changes. 75/75 unit tests, both typechecks and build
passed. All 17 preview behaviors and 19 explorer/fan-out behaviors passed
across main runs and focused reruns; see the
[review record](../exchanges/2026-11-18-award-focus-skyfall.md) for exact evidence.
The read-only near-plane finding was reproduced and fixed; final recheck found
no actionable issues. Computer Use inspected selected fronts, pause and reset.
Claude review timed out. Physical-device/FPS and boss/lead acceptance remain
open. No spin, merge or deployment was added.
