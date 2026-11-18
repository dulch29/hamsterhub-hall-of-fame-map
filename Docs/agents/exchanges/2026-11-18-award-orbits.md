# Task 018 — Award orbit review and verification

Codex is the sole writer on `codex/award-orbit-view`, base `38b6286`,
feature commit `e9ba743`.
The latest user direction requires upright floating main awards, smaller real
3D atom-like companions with front/back depth, a balanced landing, brighter
award province land, and the supplied oblique initial/reset view.

## Implementation

- Home offset `(-10, 19, 12)` from land center, responsive fit and existing reset.
- Main awards use zero rotation and a gentle 5.2s bob. Real companion instances
  are 34% scale on inclined 10s orbits, with standard depth testing/writing.
- Province wave uses 0–900ms delays and 1300ms eased falls: complete by 2200ms.
- Award province surfaces are mint with restrained emissive light. Other blue
  provinces retain their appearance. Three fictional students remain.
- Main/companion geometry shares existing instanced batches and renderer.
  Cached placements avoid DOM projection/layout on idle frames. Camera and
  landing renders carry the award state while active. Pause, reduced motion,
  hidden tabs and disposal stop the award loop. Companion images/CSS orbits
  were removed. This explicitly requested 3D motion supersedes Task 017's
  idle-WebGL rule, without adding a context or dependency.

## Review

Read-only reviewer Heisenberg found two P2s: scaled bases/companions could enter
the land, and grouping discarded repeated companion counts. Regressions failed
with the old geometry placement and one-instance-per-style path. The center now
includes clearance for the base/lowest orbit, and counted companions expand into
distinct instances. All seven award/landing checks then passed. Final source
recheck found no actionable issues, including loop lifecycle and pause handling.
The reviewer ran no tests or browsers and edited no files.

An earlier CSS orbit trial had reduced-motion overlap; that path was removed
when the user requested actual 3D depth. The 3s landing trial was also replaced
by the user-requested 2.2s compromise. No intermediate trial is a current result.

One Claude review bridge attempt used the existing session
`48545807-0b52-412a-b2d1-083631e09f24` and timed out after four minutes, without
a response. It received the earlier Task 018 trial snapshot, so no final lead
review is claimed. Request metadata stays in ignored `.agent-exchanges/018-claude-review/`.
No retry, configuration change or new review permission is required here.

## Verification setup

Use installed Edge through `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, one worker,
tracing off, sequential browser jobs. The first npm-launched Vite timed out
before tests; a temporary direct-CLI config initially resolved its Vite command
against the config folder. Setting its `cwd` to the project fixes that setup.
No package install or product timeout change was made.

Final checks use local Node CLIs equivalent to the package scripts. The ignored
`.agent-exchanges/018-award-orbit-review/playwright*.config.ts` configs preserve
the normal suites/options, with direct Vite startup and a 120s startup allowance.
This is a host readiness allowance, not a product load-time claim.

During an early red/green check, temporary historical source reached the dev
server and caused a missing-export error. That browser attempt was discarded.
Source was restored before clean verification; final checks use the current
files. Subsequent baseline regressions failed for intended behavior and passed
after the current implementation.

Final evidence:

- Full unit suite: 72/72 passed; direct `node node_modules/tsx/dist/cli.mjs --test`
  with the same file list as `npm test`.
- `node node_modules/typescript/bin/tsc -b` and
  `node node_modules/typescript/bin/tsc -p tests/tsconfig.json`: passed.
- `node node_modules/vite/bin/vite.js build`: passed after both review fixes.
  Main JS 244.04 kB raw / 76.89 kB gzip; lazy scene 617.44 kB raw / 156.95 kB
  gzip. Existing >500 kB warning remains.
- Development preview: 15/15 passed before the final clearance/count fixes.
  Their failing/passing unit regressions and production-preview checks cover
  those final refinements. Development explorer/fan-out: 19/19 passed afterward,
  including every one of the 500 IDs across paged fan-out.
- Browser CLI: `node node_modules/@playwright/test/cli.js test --config <ignored-task-config> --trace off --workers 1`.
  The preview run targets `tests/map-preview.spec.ts`; the explorer/fan-out run
  excludes preview test titles and found all 19 expected regressions.

- Final production preview: 15/15 passed after both review fixes, using
  `node node_modules/@playwright/test/cli.js test --config .agent-exchanges/018-award-orbit-review/playwright.preview.config.ts tests/map-preview.spec.ts --trace off --workers 1`.
- Computer Use inspected final desktop/narrow overview, trophy selection,
  pause/resume and reset. Browser left at overview with motion playing and
  temporary viewport override cleared.
- Production captures at 1440px/320px, tilted award sides and early landing
  were visually inspected. Captures are retained in ignored
  `.agent-exchanges/018-award-orbit-review/`.

Final production results and visual evidence are recorded in HANDOFF.md and Docs/testing.md.
Physical-phone/GPU motion/FPS, boss visual acceptance and Claude lead review
remain open. No merge or deployment.
