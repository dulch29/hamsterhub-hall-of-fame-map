# Plan — Province data and 3D map

Status: pending. Next map implementation milestone.

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

Record the geometry license and actual checks. Give 04 selection events, 05 projection/camera inputs, and 06 scene failure signals.
