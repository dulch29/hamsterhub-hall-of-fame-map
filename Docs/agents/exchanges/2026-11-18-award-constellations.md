# Task 017 review and verification

The user requested camera-facing awards, visible constellation light, a main
award with smaller floating medals, and province blocks falling into place.
Codex is the sole writer on `codex/award-constellations`, base `1ed5e4f`,
feature commit `3285c25`.
Three fictional students remain. No production data/award schema changed.

## Review and fixes

Read-only reviewer Kepler inspected the diff without tests, browsers or edits.
It found that landing projected the DOM marker at its province's raised height,
but unprojected the main mesh onto a fixed ground plane. Depth testing could
then hide the main award behind the block while stars/companions stayed visible.
The fix passes the lead province's elevation to `awardAtScreenPoint`. A pure
regression failed with the old plane and passes for elevations 0/3/8. Kepler's
follow-up found no remaining issues in those paths.

Runtime checks found CSS specificity let the float animation override reduced
motion. The pause/reduced-motion selectors now override the animation rules.
The focused browser check passes, including actual local image decoding,
static reduced motion, paused float, and resumed float.

The camera-facing regression failed against the original fixed orientation.
The scene now passes camera quaternion into instance transforms and keeps local
award geometry upright. Hierarchy/count tests preserve all six sample artworks
across the three IDs, deduplicate repeated IDs, and ignore unknown IDs. The
landing test verifies an overlapping wave, finite nonnegative heights and an
exact settled position by 1200ms.

One Claude bridge attempt resumed session
`48545807-0b52-412a-b2d1-083631e09f24` with Task 017 context. It returned
`API Error: Connection refused — a firewall or proxy may be blocking it (ECONNREFUSED)`.
The ignored `.agent-exchanges/017-award-constellations-review/` contains the
request/response. No successful lead review, configuration change or repeated
connection retry is claimed.

## Verified final state

- `npm.cmd test`: 70/70 passed, including nine award/landing tests.
- `npm.cmd run typecheck` and `npm.cmd run typecheck:browser`: passed.
- `npm.cmd run build`: passed. Main JS 244.04 kB raw / 76.89 kB gzip; lazy scene
  617.34 kB raw / 156.87 kB gzip. Existing >500 kB warning remains.
- `npm.cmd run test:browser -- --trace off --workers 1`: 33/33 passed, including
  all 19 explorer/fan-out regressions and all 500 IDs across paged fan-out.
- All browser runs use installed Edge through
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, one worker, tracing off, sequentially.
- `npm.cmd run test:browser -- --config playwright.preview.config.ts tests/map-preview.spec.ts --trace off --workers 1`:
  14/14 passed against the production build. The explorer suite was not repeated
  against production in this slice.
- The landing capture uses Playwright's virtual clock after advancing lazy React
  scheduling; early/settled frames were inspected. Province meshes/outlines and
  main awards remain attached. The clock setup was corrected after it initially
  paused React loading and then attempted to pause at a past time.
- Computer Use inspected narrow overview, main trophy/companion medals, zoom
  and reset; left the preview at overview. Production screenshots at 1440px and
  320px, tilted camera facing, and both landing frames were visually inspected.
- Final text-only label adjustment uses "+ N more" for extra artwork. The final
  build passed afterward; no behavior changed and browser tests were not repeated.

Local screenshots stay in ignored `.agent-exchanges/017-award-constellations-review/`.
Physical-phone/GPU motion feel and FPS are unmeasured. Boss visual acceptance and
Claude lead review remain open; production prerequisites are unchanged. No merge
or deployment is authorized by this slice.
