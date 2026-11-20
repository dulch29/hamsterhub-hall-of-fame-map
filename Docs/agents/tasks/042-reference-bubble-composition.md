# Task 042 — match the bubble-entry composition

2026-11-20. Status: complete locally; ready for user review. Sole writer Codex
on `codex/phase-3`, base `b6c5be9`.
The user supplied a visual reference and requested this composition.
No deployment is assigned.

## Scope

- Focus the award toward the left, leaving room on its right for four visible
  recipient portraits of varied sizes and a fifth circular See all control below.
- Keep the existing soap-film material, real portrait/fallback content, nickname
  labels and thought dots from the award to the nearest portrait. Black labeled
  circles in the reference serve as layout placeholders.
- See all opens the existing province list. Recipients beyond four remain
  reachable there. Keep the province union, manual featured choices and directory.
- Fit the same composition to phones with accessible touch targets and usable
  map controls. Preserve pop/morph, peer spread, sound/mute, reform/recall, saved
  camera return, keyboard, reduced motion, hidden tabs and renderer recovery.

## Serialized write set

`src/ui/AwardDiscovery.tsx`, `src/ui/bubbleLayout.ts` and its existing tests,
`src/ui/discovery.css`, bounded focus framing in `src/scene/ThailandMap.tsx`,
affected browser/markup tests and coordinated requirements/plans/handoff/Graphify.
Reuse existing motion/audio helpers. No data contract, artwork, dependency or
private input changes. The supplied reference is saved with the other sketches.

## Verification

Add a failing layout regression for four portraits plus a circular See all,
award placement on the left, separated circles and reachable controls. Check
320/390/1010/1440 widths, list navigation, peer switching, recall and camera
return. Run meaningful unit/type/build checks and affected sequential Edge
browser checks with one worker and tracing off. Refresh the targeted graph.
Competition/presentation/characters remain subsequent work.

## Result

Implemented left-framed award focus, four portrait slots, circular See all and
reference-sized thought dots using the existing layout/motion/material helpers.
The province list retains all recipients; student selection still uses the
existing preview while competition/presentation work remains subsequent.

Source review identified a compact-height overlap, reproduced by failing pure
checks at 320/390 × 480. A two-row compact portrait layout fixes these cases.
Re-review found no new blocking regression. Very short viewports below roughly
435px height and tiny landscape remain limited; no full orientation support or
physical-device/GPU/FPS acceptance is claimed.

118 unit tests, both typechecks and normal/hosted-source review builds pass.
The first affected compiled browser run had one Edge process crash; its isolated
retry passed. The fresh final affected run passes **38/38**, including the five
composition sizes, complete eight-person list, focus, peer switching, sound,
pop/morph/re-form/recall, saved camera return, interrupted selection and actual
context recovery. Sequential installed Edge, one worker, tracing off.

The compiled seven-profile review passes at 320/390/1440 × 844: all seven
profiles reachable once, four Bangkok recipients, correct media/PDF isolation,
pointer controls, keyboard focus and actual WebGL loss/restoration; zero page
errors. Captures were inspected. Evidence/scripts are outside Git in
`%TEMP%/hamsterhub-phase3-042/`. The existing large scene-chunk warning remains.
Subjective visual, physical-device/GPU/FPS and designated lead acceptance remain
open. No publishing occurred. Very short/landscape limits are recorded above.

Commands: `npm run typecheck`, `npm run typecheck:browser`, `npm test`,
`npm run build`, and `npm run build:review` with the existing approved
`REVIEW_SOURCE_URL`. Browser command: installed Edge through
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, then
`node node_modules/@playwright/test/cli.js test tests/bubble-composition.spec.ts tests/bubble-province.spec.ts tests/discovery.spec.ts tests/province-entry.spec.ts tests/map-recovery.spec.ts --config playwright.preview.config.ts --workers=1 --trace=off --reporter=json`.
The external review script serves `.review-build` explicitly on port 4175.

Graphify refresh follows the verified application commit. Current source AST,
this complete task packet and the supplied seventh reference are refreshed;
other document semantics remain historical. Private records/media, build output,
dependencies and verification screenshots are excluded from its corpus.
