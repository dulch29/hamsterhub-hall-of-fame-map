# Task 026 verification — pop and return

2026-11-19, `codex/phase-2`, base `4195727`. Codex is the sole writer.

Latest reference: larger student portrait without its bubble rim, name above,
gold selected-award title, project image/title/Thai description and the sole
bottom-left Profile link. A short pop/re-form SFX/VFX connects preview changes.
Province close gathers bubbles into the award before restoring the saved view.

## Commands and actual results

The full `package.json` test file list was run with the direct tsx CLI and
again as final `npm.cmd test`: **96/96 passed**.

```powershell
npm.cmd test
node node_modules/typescript/bin/tsc -b
node node_modules/typescript/bin/tsc -p tests/tsconfig.json
node node_modules/vite/bin/vite.js build
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
node node_modules/@playwright/test/cli.js test --config playwright.preview.config.ts tests/discovery.spec.ts --trace off --workers 1
```

Both typechecks/build passed. Discovery: **14/14 passed in 45.2s**. Headless
Edge, software WebGL, one worker and tracing off, production port 4174.
Build: main 268.45 kB / 83.80 kB gzip, scene 625.28 / 159.63; existing >500 kB
scene warning remains. No package/lockfile changes.

Sequential camera regression command:

```powershell
node node_modules/@playwright/test/cli.js test --config playwright.preview.config.ts tests/map-preview.spec.ts --grep 'closing .* award restores|award return travel|manual map movement' --trace off --workers 1
```

Three award return cases and manual takeover/reset passed. Interrupted return
initially caught a real focus gap: making recall controls inert could move focus
outside the main Escape handler. Recall now focuses the invoker first. The test
also needed to finish the new finite WAAPI recall before testing camera RAF;
its timer clock does not drive that timeline. Intermediate travel uses screen
distance on both axes rather than requiring a vertical path.

After the final source fix, this affected command passed its three discovery
cases (recall/Escape, immediate close/group switch, background/reset/visibility):

```powershell
node node_modules/@playwright/test/cli.js test --config playwright.preview.config.ts tests/map-preview.spec.ts tests/discovery.spec.ts --grep 'province exit|Escape interrupts|background dismissal|award return travel' --trace off --workers 1
```

The interrupted-return check then passed its focused final run (12.6s total):

```powershell
node node_modules/@playwright/test/cli.js test --config playwright.preview.config.ts tests/map-preview.spec.ts --grep 'award return travel' --trace off --workers 1
node node_modules/typescript/bin/tsc -p tests/tsconfig.json
git diff --check
```

**19 distinct browser cases passed across these runs**; no claim that an entire
repository browser suite ran. The final focus fix is covered by the three
affected discovery checks and interrupted-camera check.

## Evidence and remaining acceptance

Inspected desktop preview, floating group, mobile preview and long-name/empty-
image captures at 320/390/1440px. Copies are in ignored
`.agent-exchanges/026-bubble-pop-and-return/`. The ring-free cutout, gold award
title, centered project title and bottom-left Profile link follow the reference.
The narrow view clears context and the directory toggle around the name.

Pop/re-form checks instrument actual Web Audio oscillator starts and DOM burst
animations; mute suppresses sound. This does not establish subjective audio
quality. The visibility test simulates `document.hidden` plus its event.
Physical-phone touch/motion, real GPU/FPS, screen-reader and user/lead acceptance
remain pending. Demo students/awards/artwork/destinations remain fictional.
No production integration, merge, push or deployment was performed.
