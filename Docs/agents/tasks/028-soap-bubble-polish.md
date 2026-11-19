# Task 028 — soap bubbles, coalescence and reference framing

User follow-up, 2026-11-19. Branch `codex/phase-2`, base `92060f5`.
Codex is the sole writer. No concurrent implementation or browser workers.

## Agreed scope

The two supplied soap-bubble images guide a transparent center, pearlescent
cyan/rose rim and curved white reflections. Preserve readable faces and names,
the existing glass Profile card and floating motion. On preview close, smaller
bubbles travel inward from outside and merge into the restored face bubble.
Use an intentionally choreographed formation rather than reversing a pop.
Opening gets a brief membrane break, rim fragments and fine soap droplets.
Province close still recalls the recipients into the award before camera return.

Match the third image's overview: north to upper left, south to lower right,
the whole map comfortably framed and its visible silhouette centered. Initial
load and Reset share this home view; saved pre-selection camera return remains.

## Ownership and implementation

- UI: `src/ui/bubbleFeedback.ts`, `useDiscoveryMotion.ts`, `useBubbleMorph.ts`,
  `AwardDiscovery.tsx`, `discovery.css`, plus removal of any superseded preview rim.
- Scene: bounded home framing in `src/scene/ThailandMap.tsx`.
- Verification: affected existing discovery/camera browser tests; shared docs,
  package plans and handoff are serialized by Codex.
- Reuse CSS and finite WAAPI transforms/opacity, with static optical gradients.
  No decorative JavaScript loop, dependency or production-data changes.
- Reduced motion, keyboard dismissal, hidden tabs, interruptions, switching,
  reset and unmount must cancel/settle effects and restore focus correctly.

## Verification plan

Run the unit suite, both typechecks and production build. Run production browser
checks sequentially with one worker and tracing off. Step the finite formation
to verify outside-to-center travel, delayed face reveal, final handoff and cleanup;
check interrupted/reduced/hidden dismissal and existing province recall/return.
Inspect overview and bubbles at desktop, plus 320/390px layouts and fallback.
Physical-phone motion, real GPU performance and subjective visual/sound acceptance
remain separate from browser emulation.

## Result

Implemented clear soap-film surfaces with static interference gradients, curved
highlights and a light backdrop treatment. High-contrast/reduced-transparency
settings use a solid readable face surface. The pop has one breaking membrane,
four rim fragments and twelve fine droplets. Formation gathers eight differently
sized bubbles from outside over 620ms, growing one membrane before revealing the
face. The film and source have identical transforms during the final crossfade,
avoiding a doubled rim. The redundant card ring is removed. Overflow-list sources
animate their portrait alone so the wider row does not pull it off center.

Finite effects cancel on re-selection, group exit and unmount; reduced motion
and hidden tabs settle the restored face and remove temporary nodes. Existing
ambient CSS float, pause, optional sound, glass Profile card and award recall
remain. No new dependency, data contract or decorative animation loop.

The initial/Reset scene centers the real projected province silhouette using a
single setup-time mesh-vertex pass. Camera and target receive the same shift,
preserving the reference angle, responsive fit, landing and saved return.

Checks on 2026-11-19:

- `npm.cmd test`: **96/96 passed**.
- `node node_modules/typescript/bin/tsc -b` and
  `node node_modules/typescript/bin/tsc -p tests/tsconfig.json`: passed, including
  the final source/test edits.
- `node node_modules/vite/bin/vite.js build`: passed. Main **269.91 kB /
  84.22 kB gzip**, lazy scene **625.72 / 159.74**; existing chunk warning remains.
- `node node_modules/@playwright/test/cli.js test --config playwright.preview.config.ts tests/discovery.spec.ts --trace off --workers 1`:
  **15/15 passed**. Installed headless Edge/software WebGL via
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, all browser jobs sequential.
- Targeted discovery rerun after final source/list/material refinement:
  coalescence, interrupted switching and overflow at 320/390/1440px all passed.
  Final two pop/formation cases were rerun after aligning the handoff rims.
- Targeted `tests/map-preview.spec.ts` runs: **13 distinct cases passed**:
  initial home, landing interruption/reset, sky entrance at 320/1440px,
  interrupted smooth return, manual takeover/reset, tilt/reset, saved return
  for all three awards and fit at 320/390/1440px.
- The first camera run had six passes and one failure: Bangkok moved only
  0.71px at the sampled return frame because it now sits at the viewport center.
  The test now observes Chiang Mai, keeping its movement thresholds and
  interruption assertions. That case passed on rerun. Product camera behavior
  was not changed to satisfy the assertion.
- Sequential visual script `.agent-exchanges/028-soap-bubbles/inspect.mjs`
  checked default overview, eight-recipient fixture and Profile at
  1910/1440/390/320px; stepped pop and formation frames were inspected.
  Increased contrast gives solid `rgb(32, 60, 96)` with no backdrop filter.
  The script recorded zero page errors. Captures and `inspection.json` are
  ignored local evidence, not repository assets.
- `git diff --check`: passed. No new test registration is needed; the regression
  is in the existing discovery suite.

Physical-phone touch/motion, Safari, actual OS reduced transparency, GPU/FPS,
screen-reader and subjective visual/sound acceptance remain open. No merge,
push or deployment. Review the result at `http://127.0.0.1:5173/`.
