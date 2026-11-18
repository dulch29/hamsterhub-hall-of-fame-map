# Task 022 — Matching sculpted award models

User approval, 2026-11-18: replace the simple award models with a cohesive,
chunky and playful set: rounded gold trophy, navy enamel medals with beveled
rims, embossed symbols and shaped ribbon tails. Prioritize silhouettes at map
size and lightweight rendering. Custom original geometry is permitted.

Codex is sole writer on `codex/premium-award-models`, base `cd479b9`.
Scope: award geometry/materials, existing geometry tests, focused preview
verification and project/package/handoff notes. Reviewers remain read-only.

Keep the current four sample styles and three fictional students; no new
production award policy or student fields. Retain the eight instanced batches,
15-degree lean, smooth hover/tap turns, real companion orbits, sky fall and
province batching. No new dependency or purchased asset. Original modeling
avoids importing an asset whose redistribution license cannot be verified.

Verify finite normals/positions, geometry budget and disposal, ground clearance
through all turns/orbits, browser interaction and responsive visual quality.
Compare before/after at overview and focused size. Record measured rendering
cost; do not claim physical-device FPS from headless checks.

## Completion

Implemented the original matching set. Final checks: 82 unit tests, both
typechecks, build, 18 production-preview cases spanning the last refinement and
six focused cases against the final build. Refreshed model/desktop captures and
live narrow overview/selected awards were inspected. Source recheck found no
remaining concrete findings. See the
[review record](../exchanges/2026-11-18-premium-award-models.md) for exact coverage
and the unresolved Claude/device/visual-acceptance limits.
