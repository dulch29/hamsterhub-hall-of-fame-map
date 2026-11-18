# Task 016 review and verification

User approved one combined navy/enamel/3D award design on 2026-11-18. Codex is
the sole writer on `codex/sculpted-award-map`, based on `5d81367`. There are
exactly three fictional students and no production award-contract change.

## Review

The existing Claude bridge resumed session
`48545807-0b52-412a-b2d1-083631e09f24` with Task 016 context. It returned
`API Error: Connection refused — a firewall or proxy may be blocking it (ECONNREFUSED)`.
The local request/response is in ignored `.agent-exchanges/016-award-map-review/`.
No lead approval was received. No global configuration changes or repeated
connection retries were made for this map slice.

Read-only reviewer Singer inspected the diff without edits, browser or test
runs. Findings and fixes:

- Camera matrices were stale before projection: update the world matrix at the
  start of drawing, before DOM positions and award unprojection.
- Escape missed sibling controls: listen on the map-stage parent and remove
  that listener on cleanup. Browser test covers Escape from Zoom in.
- Two groups could move into the same slot beside selection: `separateAwardGroups`
  now reserves selection and every other target before choosing the nearest free
  slot. A pure regression failed on the previous placement, then passed for
  opposite-side, same-side and edge-neighbor cases.

Coordinator testing also found selected/group overlap in the coincident fixture.
Selection survives regrouping, and expanded peers are offset from the selected
award. Browser regressions cover this at 320px and 1440px. Singer's final source
review reported no further substantive findings within the exact three-sample
scope. This is independent source review, not Claude's lead approval.

## Final validation

- `npm.cmd test`: 66/66 passed, including five pure award/framing tests.
- `npm.cmd run typecheck` and `npm.cmd run typecheck:browser`: passed.
- `npm.cmd run build`: passed. Main JS 243.97 kB raw / 76.85 kB gzip; lazy
  scene 612.80 kB raw / 155.30 kB gzip. The existing >500 kB warning remains.
- Development: `npm.cmd run test:browser -- --trace off --workers 1`: 30/30
  passed, including 19 explorer/fan-out checks. This preceded the final
  preview-only collision helper.
- After that helper, all 66 pure tests and the build passed again. Production:
  `npm.cmd run test:browser -- --config playwright.preview.config.ts tests/map-preview.spec.ts --trace off --workers 1`:
  11/11 passed. The explorer suite was not repeated against production here.
- Browser commands used installed Edge through
  `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`; bundled Chromium is absent. One worker,
  tracing off, sequential runs. Expected forced-WebGL-failure logs are covered
  by fallback tests.
- Computer Use inspected the narrow overview, trophy and silver zoom, then
  reset. Saved production overview screenshots at 1440px and 320px were
  inspected; bounds also passed at 390px. Local evidence is in ignored
  `.agent-exchanges/016-award-map-review/overview-1440.png` and `overview-320.png`.

Physical-phone, real-GPU/FPS and boss approval remain open. Production member
authentication, consent, protected API and live routes remain outside this
synthetic slice. No merge or deployment was performed. Graphify's compact
continuation record describes this implementation; the original graph and
source snapshot remain historical.
