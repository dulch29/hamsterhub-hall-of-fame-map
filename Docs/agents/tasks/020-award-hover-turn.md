# Task 020 — Smooth award attention and clear map

User direction, 2026-11-18: remove the award text boxes (custom label and
native tooltip), turn awards smoothly toward the viewer on hover and tap,
and increase the resting lean to around 15 degrees.

Codex is the sole writer on `codex/award-hover-turn`, base `9055a24`.
Scope: `src/scene/awards.ts`, `ThailandMap.tsx`, `src/styles.css`, existing
award/preview tests and focused project/package/handoff/Graphify notes.
No concurrent writers, dependencies, student contract changes, merge or deployment.

- Preserve accessible names/descriptions and explorer labels.
- Hover or selection faces a province's full award set; departing/clearing
  turns it back unless the other attention state still applies.
- Use a 280ms eased quaternion turn; interruptions start from current rotation.
- Pause stops ambient bob/orbits while direct interaction can still turn awards.
- Reduced motion is immediate; hidden tabs/unmount stop animation frames.
- Preserve real 3D orbit paths, mint provinces, sky entrance and oblique home.

Verify turn progression, reversal, selected companions and geometry clearance
with real mesh matrices; verify hover/tap, no visible/native text boxes,
pause/reduced motion, keyboard and layout in one sequential browser worker.
Record actual checks and review gaps; inspect a final screenshot.

Implemented with Task 021. See the
[review record](../exchanges/2026-11-18-award-hover-landing.md) for the resolved
hover findings, exact checks and remaining device/lead review limits.
