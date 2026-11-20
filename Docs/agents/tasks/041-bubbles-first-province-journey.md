# Task 041 — restore bubbles before the province list

Agreed 2026-11-20. Status: complete locally; ready for user review. Sole writer: Codex on
`codex/phase-3`, base `aa56a58`. No deployment is assigned.

The user requested the bubble experience, award zoom and transitions back, then
confirmed: **bubbles first; province list via View all**. This supersedes Task
040's immediate panel and no-selection-camera-travel choices.

## This slice

- Medal selection temporarily focuses the award, preserving fixed tilt and no
  free pan. Save the overview position/target/zoom once per province journey;
  switching provinces keeps that origin. Exit restores it; Reset returns home.
  Overview horizontal rotation and bounded 1–2.5 zoom remain.
- Show up to five floating portraits from the deduplicated, opted-in union of
  the province's award recipients. Always provide View all, even for one person.
- View all opens the existing province list with supplied names and explicitly
  featured competitions. Back returns to bubbles; Close exits the journey.
  Directory/fallback entries open the list directly without needing WebGL.
- Reuse pop/morph, peer spread, sound/mute, re-formation and province recall.
  Preview close returns to its originating bubble/list; Escape steps one level.
  Retain the featured-project preview as the agreed intermediate destination.
  Do not imply that a featured project won a competition.
- Preserve reduced motion, keyboard/focus, pause, hidden-tab cleanup, switching,
  Reset and Task 039 recovery/retry. The later competition/slides/character
  slices retain their existing scope; this slice does not deliver them.

## Serialized write set

`src/ui/{MapPreview,AwardDiscovery,ProvinceRecipients}.tsx`, their existing
markup tests, `src/ui/discovery.css`, bounded scene changes in
`src/scene/ThailandMap.tsx`, relevant existing browser suites plus
`tests/bubble-province.spec.ts`, and coordinated Project/Agent/HANDOFF/package
plans and Graphify outputs. Existing motion/audio/layout helpers are reused;
change one only for a demonstrated integration defect and record it here.
No data contract, geometry, medal art, dependency or private input changes.

## Checks

- First reproduce missing bubbles/camera focus in a browser regression test.
- Verify bubbles-first, full province list, overflow, Back/Close, source focus,
  animated pop/re-form/recall, camera return and interrupted selection.
- Verify 320/390/1440 widths, keyboard/reduced motion, directory and actual
  context loss/restoration/fallback/retry; preserve explorer tests.
- Run both typechecks, units, normal/review builds and sequential installed-Edge
  browser checks with one worker and tracing off. Keep physical-device/FPS and
  subjective acceptance separate.
- Update the handoff and targeted Graphify checkpoint, excluding private media,
  build outputs and screenshots. Save meaningful local commits.

## Result

The regression test first reproduced zero bubbles after medal entry. The restored
flow reuses existing motion/audio helpers; ProvinceRecipients now supplies rows
inside AwardDiscovery so one preview lifecycle serves both entry paths.

Source review identified two interruption defects, reproduced in failing browser
regressions: selecting a peer during full Close inherited the pending exit, and
context loss during animated camera return discarded the unfinished return.
New recipient selection clears the pending close; context loss settles camera
travel before suspending rendering. Province-list Close now forwards pointer
versus keyboard activation, preserving immediate keyboard dismissal.

Verified so far: 115 unit tests, both typechecks and normal/review builds pass.
A full compiled browser pass recorded 57/61 before layout/test corrections;
subsequent affected checks fixed the covered pause/reset controls and old fixed
camera assumptions. The final 33-check compiled discovery/motion/camera/recovery run passed. It
includes the two reproduced interruption regressions, keyboard Close, province
switching and Reset during recall. Independent source re-review found no
unresolved actionable defects; designated lead acceptance remains separate.
Seven-profile compiled review passes at 320/390/1440: four Bangkok recipients,
all seven profiles reachable once, individual media/PDF isolation, usable pointer
controls, keyboard focus and actual WebGL context restoration; zero page errors.
Evidence is in `%TEMP%/hamsterhub-phase3-041/` outside Git. The existing large
scene-chunk warning remains. Physical-phone/GPU/FPS, subjective acceptance and
designated lead acceptance remain open. No publishing occurred.


Commands: `npm run typecheck`, `npm run typecheck:browser`, `npm test`,
`npm run build`, and `$env:REVIEW_SOURCE_URL='https://hamsterhub-review-assets.vercel.app'; npm run build:review`.
Browser command: installed Edge via `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, then
`node node_modules/@playwright/test/cli.js test tests/bubble-province.spec.ts tests/discovery.spec.ts tests/province-entry.spec.ts tests/map-recovery.spec.ts --config playwright.preview.config.ts --workers=1 --trace=off --reporter=line`.
The full earlier pass covered explorer, fan-out, artwork/landing and fallback;
the final affected pass covers all changed behavior. Seven-profile review serves
`.review-build` explicitly on port 4175 through the external review script.

Graphify refresh follows this verified application commit. Only current source
AST and this complete task packet are refreshed; other document semantics remain
historical. Its report/provenance identify that boundary and extraction limits.
