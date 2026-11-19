# Task 031 — stacked identity, competition bubble and gold beacon

User reference refinement, 2026-11-19. Branch `codex/phase-2`, base `f9eb3c0`.
Codex is sole writer; all scene/shared edits and browser checks are serialized.

## Contract

- Stack supplied nickname above full name, centered above the portrait. Preserve
  `displayName` as the accessible/search identity; add optional `nickname` and
  `fullName` fields rather than splitting arbitrary display-name strings.
  Floating student bubbles show only the supplied nickname; records without one
  retain their supplied display name. The expanded card shows both name lines.
- Add optional award `logoUrl`. The supplied competition mark stays in ignored
  local media, served by the existing dev allowlist. No inferred award rank.
- Show the logo inside a readable soap-film bubble beside the Profile card.
  Reveal from behind the card and retract on close, with a gentle independent
  CSS float. Fit desktop/phone bounds; preserve name, portrait and close target.
  Keyboard/reduced motion settle immediately; pause/hidden tabs stop float.
- Replace the preview's dark ground sphere with a vertical gold light beam and
  spreading gold ground aura. Reuse camera/landing updates and existing motion
  lifecycle; no extra decorative WebGL rendering loop. Explorer pins remain.
- Preserve current card material, portrait fade, pop/return, saved camera,
  local-data boundary, default three fictional students and group fixture.
  Ocean work remains on hold.

Writable scope: shared types/preparation/local parser, award definition, preview
markup/morph/layout/CSS, Vite allowlist, bounded scene beacon integration, adjacent
tests, ignored media/evidence, and coordinated project/package/handoff docs.

## Verification

Unit tests, both typechecks, production build. Sequential browser inspection at
320/390/1440px: stacked identity, logo reveal/float/exit, broken logo fallback,
pause, hidden/reduced motion, bounds, keyboard/list fallback, beacon under camera
movement/landing, camera return and disposal. Check local assets/data stay absent
from Git and build. Physical-phone and subjective motion acceptance stay open.

## Verification completed — 2026-11-19

- `npm.cmd test`: **104/104 passed** (includes the final nickname-only bubble
  regression). `npm.cmd run typecheck`, `npm.cmd run typecheck:browser`,
  `npm.cmd run build`: passed. Main 274.56 kB / 85.53 kB gzip; scene 627.07 /
  160.19; existing chunk-size warning.
- Sequential production discovery: **19/19 passed**, installed Edge, one worker,
  tracing off. This busy host took 8.4 minutes including slow teardown. Command:
  `npm.cmd run test:browser -- --config playwright.preview.config.ts tests/discovery.spec.ts --trace off --workers 1`
  with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` set to installed Edge.
- Actual local record at 320/390/1440 × 844: nickname-only face label, stacked
  name lines, decoded transparent logo/portrait, logo inside bounds and clear of
  portrait/map controls, float/pause, beacon waves/pause, layered Escape, focus
  and saved camera return pass. Zero page errors. Final captures inspected.
- Finite motion stepping: logo begins at the card center behind its surface,
  emerges to the side and retracts on close. Reduced-motion changes and tab
  hiding settle an in-progress reveal; logo float pauses. Broken logo shows the
  competition title. The inspection script must call `Animation.finish()` at an
  endpoint to resolve a deliberately paused animation's completion promise.
- Build scan contains no supplied personal values/media. All six local files
  are served with `no-store`; direct ignored-folder access remains blocked.
- Bounded scene inspection passes beacon zoom/reset projection, all three sample
  camera returns and removal of beacon DOM on WebGL fallback.
- Logo source already has RGBA transparency; it is copied unchanged to ignored
  local media. No supplied personal values/images are added to tracked files.

Inspection scripts/reports/captures remain ignored under
`.agent-exchanges/031-profile-beacon/`. The in-app browser service returned
`service_info` timeout; isolated Playwright Edge supplied visual evidence.
Initial 5s readiness checks timed out; properly configured 30s assertions pass.
Some isolated-browser teardown needed interruption after all assertions and
reports completed. No phone/GPU/FPS or subjective acceptance claim is made.
