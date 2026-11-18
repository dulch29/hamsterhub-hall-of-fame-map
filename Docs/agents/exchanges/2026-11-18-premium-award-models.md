# Task 022 — Original matching award models

Codex is the sole writer on `codex/premium-award-models`, base `cd479b9`;
feature commit: `4b20122`.
The user's “Do that” approved the proposed matching stylized award set.

## Implementation

Rounded cup/lip, curved handles, navy seal and rounded plinth replace the
simple trophy. Medal bodies now have bevels, double rims, raised stars, navy
enamel, modeled reverses and folded notched ribbons. The three metal variants
share two geometries; the trophy adds two. The set stores 7024 unique triangles
and retains eight instanced batches. No external model/texture or dependency.

The studio comparison exposed an inset-depth issue; a raycast regression now
checks that navy enamel is visible ahead of the metal body and the back stays
solid. An envelope test failed for oversized handles; their curve was narrowed
without widening the existing map footprint. Read-only reviewer Newton caught
the trophy seal intersecting the curved bowl. Its vertices now follow the
same sampled outer lathe surface; a raycast regression checks upper/lower
enamel visibility. The existing clearance/turn/orbit tests remain unchanged.

Shared geometry is disposed exactly once; all instance buffers and owned
materials still have explicit disposal. The source keeps the current sample
styles, fictional students, eight rendering batches and existing interactions.

## Verification and evidence

The final full unit run passed 82/82; all 11 focused award tests passed after
the curved-seal refinement. Application/browser typechecks and production build
passed. Lazy scene: 624.62 kB raw / 159.36 kB gzip; main: 244.04 / 76.89.
The existing >500 kB scene chunk warning remains. These numbers measure bundle
size and mesh storage, not device FPS.

The production-preview suite passed 18/18 in 8.0 minutes using installed Edge,
one worker and tracing off. That run began before the final curved-seal change;
the final build completed during the run. The focused final-build check passed
6/6 in 3.7 minutes for hover/turns, pause/reduced motion, award selection and
320/390/1440px layouts.
No explorer source or student contract changed; the explorer suite was not
repeated for this model-only slice.

Commands use the existing local CLI entry points to avoid this host's npm
startup overhead: `node node_modules/tsx/dist/cli.mjs --test` with all files in
the `npm test` script; `node node_modules/typescript/bin/tsc -b`;
`node node_modules/typescript/bin/tsc -p tests/tsconfig.json`; and
`node node_modules/vite/bin/vite.js build`.
Browser command:

```powershell
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
node node_modules/@playwright/test/cli.js test --config .agent-exchanges/018-award-orbit-review/playwright.preview.config.ts tests/map-preview.spec.ts --trace off --workers 1
```

That ignored config only replaces the server command with the direct Vite CLI;
the tests/config behavior otherwise uses the repository's existing setup.
The focused rerun adds `--grep 'hover|pause|sample awards|preview fits'`.
Final read-only source recheck reported no concrete findings, with runtime
verification remaining the coordinator's responsibility.

Ignored `.agent-exchanges/022-award-models/studio.html` compares the previous
model source to the current set using the same camera/lights. The capture script
saves both sheets, desktop overview and selected trophy/medal frames. Those
captures were visually inspected, revealing the inset-depth fix above.
Final captures were refreshed after the curved-seal fix and inspected: the
complete seal, double rims, enamel faces and ribbon tails remain visible.
Computer Use also inspected the existing narrow live overview and selected
trophy/silver medal, then restored overview with motion playing. The tab is
kept available with no viewport override. The comparison is an internal review
artifact, not new UI in the product.

`git diff --check` passed. Local Markdown targets in all changed/new docs were
checked with no missing files. The historical Graphify graph stays
frozen; the final continuation result/reflections are saved separately.

One read-only Claude bridge request timed out after four minutes. Its supplied
snapshot preceded the shared-geometry/curved-seal refinements. No successful
Claude lead review is claimed. Physical-phone/GPU/FPS and user/boss visual
acceptance remain open. No merge or deployment.
