# 05 — Clustering and fan-out

Milestone: M3. Owner: Claude Code (lead).

## Scope

Merge nearby pins in screen space into count markers. Selecting a cluster zooms toward it and splits it as space becomes available. At maximum zoom, remaining overlaps fan out in a ring or spiral so every student can be selected.

Keep grouping and fan-out calculations independent of Three.js rendering. Maintain stable student identity through grouping, camera changes, and selection.

Proposed files: `src/cluster/*`, pure logic tests, and scene integration under `src/scene/*`.

## Dependencies

Package 02 supplies projected pin positions and constrained camera behavior. Package 04 displays the selected student. Package 00 supplies explicit load fixtures; the default preview stays at three students.

## Completion criteria

- [ ] Cluster counts match their members without duplicates or omissions.
- [ ] Selecting a cluster zooms and splits within camera bounds.
- [ ] Maximum-zoom overlap triggers individually selectable fan-out.
- [ ] Every student in a dense Bangkok fixture can be opened.
- [ ] Camera changes, resize, and dismissal leave no stale selection targets.

Continue with [the implementation plan](plan.md).
