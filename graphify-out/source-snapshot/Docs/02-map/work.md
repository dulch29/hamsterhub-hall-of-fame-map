# 02 — Province data and 3D map

Milestone: M1. Owner: Claude Code (lead).

## Scope

- Select licensed Thailand province GeoJSON covering all 77 province codes and record attribution.
- Establish province anchors, with reviewed alternatives for shapes where a centroid is unsuitable.
- Compute deterministic pin offsets from opaque student IDs. Never use a student's actual coordinates.
- Render a 3D Thailand map with constrained orbit, pan, and zoom.
- Draw student pins using instanced meshes and expose picking/selection events for package 04.
- Keep the rendering interface compatible with clustering and WebGL fallback.

Proposed files: `src/scene/*`, province geometry/anchor assets, and a geometry provenance note in this folder. Shared contract changes require updating Project.md and `src/types.ts` together.

## Dependencies

Geometry source/license selection is unresolved. Package 03 supplies filtered student data. Final brand tokens depend on package 01; a synthetic-data map can precede the visual polish pass.

## Completion criteria

- [ ] Licensed geometry maps correctly to all 77 province codes.
- [ ] Thailand renders in 3D with useful camera bounds and resize behavior.
- [ ] Three default students appear near the agreed province anchors with repeatable offsets.
- [ ] Instanced pin IDs map correctly to student IDs when picked.
- [ ] Scene cleanup and an initialization/failure signal are available to the application.

Continue with [the implementation plan](plan.md).
