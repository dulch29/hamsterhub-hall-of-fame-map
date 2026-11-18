# Task 016 — Combined award landscape

User approved one combined design on 2026-11-18: navy map, enamel detail and true
3D gold/silver/bronze/trophy artwork, with individual click-to-award zoom.

Codex is the single implementation writer on `codex/sculpted-award-map`, based on
`5d81367`. Exact write scope: `src/scene/ThailandMap.tsx`, new `src/scene/awards.ts`
and `src/scene/awardView.ts` with their tests, `src/ui/MapPreview.tsx`,
`src/styles.css`, `tests/map-preview.spec.ts`, test registration in `package.json`,
and the related project/package/testing/handoff documentation. No shared `Kid`
contract or production award data changes. Read-only review workers may inspect
the stable diff; they must not run browsers or edit production files.

Three fictional students remain. Explicit fixture artwork maps stable demo IDs
to gold/silver/bronze; the gold fixture is a trophy, silver and bronze are medals.
These are artwork samples, not real earned awards. The integrated explorer keeps
its original marker/card/list behavior. No avatar or new application panels.

Use shared low-poly instanced geometry, on-demand rendering, the current camera
travel and existing cluster/fan-out behavior. Selected members must survive
regrouping; unknown/opted-out IDs cannot be targeted. Reduced motion and keyboard
activation move immediately. Background/Escape clear selection; reset restores
the overview. Repeated activation must not compound zoom.

Validation: meaningful pure geometry/framing tests, application and browser
typechecks/build, preview interactions and explorer regressions. Browser checks
run sequentially with one worker and tracing off. No installs, parallel render
servers, merge or deployment. Record actual validation and the Claude review
outcome without claiming lead approval from a failed bridge.

## Result

Implemented and verified in feature commit `1c09675`. Three local instanced samples, navy/enamel map,
cancelable award framing, responsive overview, selection/reset and accessible
DOM targets are in place. The existing explorer remains available.

66 unit tests, both typechecks and build passed. Development browser suite:
30/30 before the final preview-only collision fix. The focused collision test
failed against the old placement and passed after it; all 11 production-preview
checks passed afterward. Visual overview/trophy/silver checks and desktop/mobile
screenshots passed inspection. Read-only review findings were fixed and rechecked.
Claude returned ECONNREFUSED; lead review and physical-device/FPS checks remain
open. See [review record](../exchanges/2026-11-18-sculpted-awards.md).
