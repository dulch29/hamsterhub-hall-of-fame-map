# Task 017 — Award constellations and province landing

User request, 2026-11-18: awards face the user's camera during rotation; replace
faint fireflies with visible star luster/constellations; highest-value award is
large with smaller companion medals; provinces arrive as falling blocks.

Single writer: Codex, branch `codex/award-constellations`, base `1ed5e4f`.
Write scope: scene award/landing helpers and tests, ThailandMap.tsx, styles,
MapPreview sample credits, preview browser tests/test registration, relevant
requirements/package/testing/handoff docs and Graphify continuation.

Preserve three fictional students, province-only positions, strict opt-in,
explorer behavior, fallback and keyboard navigation. No production award schema,
dependencies, remote models or new application panels. Sample presentation order:
trophy > gold > silver > bronze, with equal celebratory warmth for every sample.
Bangkok demonstrates trophy plus smaller gold/silver medals. Grouped students preserve
their accessible zoom/fan-out path; sample artwork never implies earned awards.

Motion timeline: province blocks are the entrance lead, in an overlapping wave
with bounded delays and a single short settle. Awards/starfields arrive with
their province, controls stay static. Landing completes within about 1.2 seconds
and a gesture/keyboard action can finish it immediately. Reduced motion and
hidden tabs settle instantly. Star luster and companion float use CSS transforms/
opacity; no idle WebGL animation loop. Primary 3D artwork follows camera quaternion;
companion images are rendered locally from the same geometry using the existing
renderer, then float in the semantic DOM overlay.

Acceptance: matrix normals face camera at several azimuths/tilts; rank order and
group counts are deterministic; density is bounded and no opted-out/unknown ID
creates awards; landing settles all province parts/outline together and cancels
cleanly; pause/reduced motion affect constellation and float. Verify default and
320px overview, tilt/zoom/reset, interruption, existing clusters/explorer and
WebGL fallback. Browser runs sequential, one worker, trace off.

Read-only review may inspect the final diff without launching browsers. Record
actual evidence; Claude's connection failure is not lead approval.

## Result

Feature commit `3285c25` implements all four requests without dependencies or contract changes. Main
awards follow the camera; companion sprites come from the existing renderer;
warm constellation density is bounded; each province and its outline land as
one block within 1200ms. Every sample retains a celebratory light field.

Verification: 70 unit tests, both typechecks, final build, 33 development browser
checks and 14 production-preview checks passed. Browser runs were sequential
in installed Edge with one worker and tracing off. The last label-copy change
was build-checked after those browser runs. Desktop/narrow, tilt and landing
captures were inspected. Read-only review findings were fixed and rechecked.
Claude review remains unavailable (ECONNREFUSED); phone/GPU/FPS and boss visual
acceptance remain open. See the [exchange](../exchanges/2026-11-18-award-constellations.md)
and [current handoff](../../../HANDOFF.md) for details and continuation.
