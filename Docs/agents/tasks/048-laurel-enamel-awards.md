# Task 048 — Laurel enamel award set

2026-11-20. The user authorizes the next build and selects **B — Laurel enamel**
from the saved comparison: deeper metal rims, navy enamel, raised central emblem
and a matching laurel wreath across trophy and gold/silver/bronze medals.
Sole writer Codex on `codex/phase-3`, base `03c8bc8`; no deployment assigned.

Write set: `src/scene/awards.ts`, its existing geometry tests, focused browser
verification if needed, approved comparison under discovery references, and
coordinated Agent/Project/HANDOFF/package notes and Graphify outputs.

Use original procedural geometry with the existing eight instanced batches,
four unique geometries and fewer than 8,000 stored triangles. Keep the current
palette, compact marker envelope, finite normals, solid reverses, legible fronts,
shared medal geometry and disposal. No new dependency, downloaded assets,
placement numeral or inferred award policy. Preserve existing award picking,
hover/return, companion orbit, landing, bubble journey and character narration.

Verify geometry depth/envelope/clearance/disposal and raycast visibility of the
raised wreath against enamel. Compare baseline/final geometry cost and rendered
overview/focus at 320/390/1440. Run units, both typechecks, normal/review builds
and serial installed Edge checks with one worker/tracing off, including relevant
award/orbit/bubble/recovery behavior. Physical-phone/GPU/FPS and subjective visual
acceptance remain separate. Refresh targeted Graphify and record evidence.

## Geometry and source verification

The added wreath raycast fails against the old geometry (enamel hit where raised
metal is required) and passes against the new medal/trophy leaves. The old enamel
test point is moved clear of a new leaf to continue testing the uncovered surface.
All 13 award tests and 128 total units pass, including finite positions/normals,
shared geometry, envelope, reverse faces, ground clearance through turns/orbit and
resource disposal. Both typechecks and normal/review builds pass. Read-only source
review reports no actionable findings.

Before/after isolated renders under matching lighting show all four styles.
Stored triangles: **7,024 → 7,776** (+10.7%); four unique geometries and eight
instanced batches remain. The four-style render retains **8 calls**, with rendered
triangles **12,832 → 14,096** (+9.9%, including shared medals rendered three times).
These are measured geometry costs, not physical-device FPS. The existing large
scene chunk warning remains. Evidence: `%TEMP%/hamsterhub-phase3-048/`,
`%TEMP%/hamsterhub-048-*.log` and ignored test-results.

## Browser verification

The broad compiled Edge run passes 43/45. The two landing image comparisons
exposed an obsolete screenshot mask: the new Guide heading's antialiasing changed
when hiding the WebGL layer, even though both captures showed an empty sky.
Masking `.character-guides` alongside the existing UI restores the intended
land-only comparison. Both corrected checks pass in the final focused run.
All 45 distinct checks pass across these runs, covering award hover/orbit,
landing, pause/reduced motion, responsive bounds, bubble entry/return/recall,
View all feedback, characters/narration and actual context recovery/fallback.
Installed Edge, one worker, tracing off. Browser TypeScript passes after the mask
change. No application changes were needed for the screenshot failures.

The compiled seven-profile review also passes at **320/390/1440 × 844**: all
seven people across four provinces, explicit media, map controls, View all return,
nested focus and actual context restoration, with zero page errors. Isolated
before/after renders and final map captures were inspected. The original
comparison remains a concept; final Three.js lighting differs. Physical phones,
real GPU/FPS and subjective appearance approval remain unverified. No deployment.
