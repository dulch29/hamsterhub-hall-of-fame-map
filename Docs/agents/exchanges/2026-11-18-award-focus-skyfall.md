# Task 019 — Selected fronts and sky landing

Codex is the sole writer on `codex/award-focus-skyfall`, base `e5c1cd6`,
feature commit `201da64`.
The user requested a resting lean around 5 degrees, hidden landing origins,
and camera-facing main/companion awards for the selected province. A continuous
360-degree spin was an opinion request only and was not implemented.

## Implementation and review

Resting geometry uses a fixed 5-degree local Z lean. A selected province flag
applies the camera quaternion to all its main/companion fronts. Orbit positions
retain real depth; other provinces keep world orientation. Both the ordinary
draw and cached idle-matrix paths receive the current camera quaternion.

The entrance lift derives from the lowest projected land corner and the fitted
viewport. Provinces and outlines fall together along world Y with the existing
0–900ms wave and 1300ms falls. A read-only review by Dalton identified near-plane
popping on tall/narrow screens: a projected top-edge check alone misses blocks
behind the camera. A trajectory regression failed before the fix. The camera now
retreats along its existing viewing axis and fits far clipping to the complete
fall bounds, including carried awards. Home/reset tracks the retreat; the
orthographic XY projection is unchanged. Explorer/reduced-motion/hidden initial
states skip entrance camera preparation.

Focused selection and sky-origin regressions also failed against the original
implementation and passed after the changes. Main/companion ground clearance,
group counts, pause and existing lifecycle rules remain covered.
Dalton's final read-only recheck found no actionable issues; the near-plane
finding is resolved. The reviewer edited no files and ran no tests or browsers.

One Claude bridge attempt timed out after four minutes without a response.
Its request is retained in ignored `.agent-exchanges/019-award-focus-review/claude/`;
it preceded the final clipping refinement. No successful lead review is claimed.

## Verification setup

Use installed Edge through `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, one worker,
tracing off and sequential browser jobs. The existing ignored Task 018 runner
configs use direct Vite startup with a 120s host-readiness allowance.

Early sky-frame tests needed the paused clock advanced until the lazy scene
actually appeared. Hiding the WebGL layer also changes text antialiasing, so
comparison captures hide controls and text. Final pixel comparison decodes both
PNGs with the browser API and allows at most one channel unit of rounding at
each pixel. A failing desktop comparison was inspected: exactly two pixels
differed by one blue-channel unit, with no visible land. The test still rejects
any larger pixel difference; it does not compare PNG compression bytes.

Production preview: the full 17-case run passed 16/17, with only the desktop
PNG-byte comparison failure described above. After fixing that test without
product changes, the 320px and 1440px sky-entry cases both passed (2/2). Every
one of the 17 preview behaviors is covered; no claim of a single final all-green
17-case run is made. Browser typechecking passed again after this test change.

Current completed checks: 75/75 unit tests, application/browser typechecks and
production build. Main JS 244.04 kB raw / 76.89 kB gzip; lazy scene 618.20 kB raw /
157.22 kB gzip. The existing chunk-size warning remains.

Production explorer/fan-out: the main 19-case run passed 18/19. The 500-ID
21-page traversal hit its 90s limit; its file-level trace override defeated
the CLI's trace-off setting. Set that file's trace option to off, matching
the host rules, then reran only that case. It passed in 48.6s, verifying all
500 distinct IDs, every page's marker bounds and card access. No product change
or timeout relaxation was made. Browser typechecking passed after the trace edit.

Actual browser command: `node node_modules/@playwright/test/cli.js test --config
.agent-exchanges/018-award-orbit-review/playwright.preview.config.ts`, with
`--trace off --workers 1`. Main preview targets `tests/map-preview.spec.ts`;
sky-frame rerun adds `--grep "beyond the sky edge"`; explorer run targets
`tests/explorer.spec.ts tests/fanout.spec.ts --ignore-snapshots`; dense rerun
targets `tests/fanout.spec.ts --grep "dense max-zoom"`.

Computer Use inspected narrow/desktop overview, selected trophy and companion
fronts, pause/resume and reset. The initial inventory timed out once, then the
browser connection recovered; the native-app inventory remained unavailable.
Final tab is at overview with motion playing and the temporary viewport reset.
A JPEG capture is retained in ignored `.agent-exchanges/019-award-focus-review/`.
The saved desktop/narrow clear-sky frames were also visually inspected.
All checked local links in updated task/project Markdown resolved. Graphify saved
the continuation and refreshed lessons without rebuilding the historical graph.

Physical-phone/GPU/FPS and boss/lead acceptance remain unverified. No merge,
deployment, dependency, production award policy or student contract change.
