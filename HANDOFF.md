# Development handoff

Updated: 2026-11-18. Workspace: `D:\Projects\Hamsterhub\Map Project Showcase`.

## Current checkpoint: selected award fronts and skyfall (2026-11-18)

Task 019 feature commit `201da64` is on `codex/award-focus-skyfall`, base `e5c1cd6`. Codex is the sole
writer. The private remote is unchanged; no merge or deployment.

- Resting awards have a fixed 5-degree local Z lean and retain their gentle bob.
- Selecting a province faces all its main/companion fronts toward the camera.
  Orbit positions remain in real 3D; clearing selection restores world orientation.
- Camera-derived lift hides every landing start above the fitted sky edge.
  The camera retreats along its viewing axis and fits clipping depth to the
  full fall, preserving the orthographic XY view on tall/narrow screens.
- The 2.2s wave, mint provinces, home direction, three fictional students,
  explorer, pause/reduced motion and visibility/disposal behavior remain.
- Continuous 360-degree main-award spin was discussed only, without implementation.

Current checks: 75/75 unit tests, application/browser typechecks and production
build passed. Lazy scene: 618.20 kB raw / 157.22 kB gzip; existing chunk warning
remains. All 17 production-preview behaviors passed across the main run and
focused sky-frame rerun; all 19 explorer/fan-out behaviors passed across the
main run and trace-free dense rerun. The read-only reviewer
identified near-plane popping on tall screens; a failing trajectory test
reproduced it and now passes after depth fitting. Final source recheck found
no actionable issues. Computer Use inspected narrow/desktop overview, selected
trophy/companion fronts and pause/reset; the browser is back at overview with
motion playing and its temporary viewport reset. One Claude bridge call timed
out after four minutes. Physical-phone/GPU/FPS and lead acceptance remain open.

See [Task 019](Docs/agents/tasks/019-award-focus-skyfall.md) for scope and
the [review record](Docs/agents/exchanges/2026-11-18-award-focus-skyfall.md) for
exact run limits and evidence. The dense fan-out file had overridden CLI trace
settings, causing a 90s timeout; its trace setting is now off and the unchanged
500-ID traversal passed in 48.6s. Captures are in ignored
`.agent-exchanges/019-award-focus-review/`. All checked local Markdown links passed.
Local preview: http://127.0.0.1:5173/ .

## Previous checkpoint: upright floating awards and 3D orbits (2026-11-18)

Task 018 feature commit `e9ba743` is on `codex/award-orbit-view`, base `38b6286`, with Codex as sole
writer. Private remote remains
https://github.com/dulch29/hamsterhub-hall-of-fame-map . No merge or deployment.

Latest user feedback supersedes the Task 017 camera-facing companion-image
design and the intermediate 3s entrance trial:

- Initial/reset view is oblique, from offset `(-10, 19, 12)` around land center,
  fitted responsively with north-west upper left and south lower right.
- Main awards use zero world rotation with gentle 5.2s floating motion.
- Small real 3D medals orbit on differently inclined 10s paths, at 34% scale,
  close to the main award. They pass through front/back depth and are occluded
  by the main award. Grouped repeated awards retain distinct instances.
- Province blocks/outlines fall in a 0–900ms wave with 1300ms falls, complete
  by 2200ms. Gesture/keyboard/resize/reduced motion/hidden tabs settle entrance;
  reset does not replay it.
- Award province top surfaces are mint with restrained emissive light. Blue
  provinces retain their appearance; all three samples keep warm constellations.
- One renderer/context handles geometry. The explicitly requested idle motion
  uses cached placements and updates mesh matrices, without idle DOM projection.
  Pause starlight, reduced motion, hidden tabs and disposal stop that loop.
  Companion images and CSS orbit code have been removed.

Exactly three fictional students remain; sample artwork never claims earned
ranks. No production `Kid` contract, location/privacy policy, dependency or
downloaded model changed. The explorer remains at `?view=explorer`.

Final verification: 72/72 unit tests, both typechecks and final build passed.
All 15 development preview cases passed before the last geometry clearance/count
fixes, and all 19 explorer/fan-out cases passed afterward, including every one of
the 500 IDs. The pure regressions failed before both fixes and pass afterward.
Read-only review rechecked them and found no actionable issues. Final production
preview passed 15/15 cases after both fixes. All browser runs used installed
Edge, one worker, tracing off, sequentially. A temporary direct-Vite runner
avoided slow npm startup; details are in the exchange record.

Computer Use inspected final desktop/narrow overview, trophy selection,
pause/resume and reset. The final browser was left at overview with motion
playing and temporary viewport overrides cleared. Production screenshots at
1440px/320px, tilted award sides and early landing were visually inspected.
Durable captures stay in ignored `.agent-exchanges/018-award-orbit-review/`.

Build: main JS 244.04 kB raw / 76.89 kB gzip; lazy scene 617.44 kB raw / 156.95 kB
gzip. Existing >500 kB warning remains; phone/GPU/FPS acceptance is unmeasured.
One Claude review attempt timed out after four minutes without response, so
lead review remains open. See the
[review record](Docs/agents/exchanges/2026-11-18-award-orbits.md) and
[Task 018](Docs/agents/tasks/018-award-orbit-view.md).

Local preview is http://127.0.0.1:5173/ . Next: boss visual feedback, physical
phone/GPU measurement and Claude lead review when available. Production access,
consent/API and live destination requirements remain pending.

## Previous checkpoint: award constellations and falling provinces (2026-11-18)

Task 017 is implemented on `codex/award-constellations`, feature commit
`3285c25`, based on `1ed5e4f`.
Codex is the sole writer. The private remote remains
https://github.com/dulch29/hamsterhub-hall-of-fame-map . No merge or deployment.

- Primary 3D awards follow the camera quaternion through orbit and tilt.
- Warm star luster, constellation lines and halos replace the preview fireflies.
  Every sample keeps a warm baseline; more sample artwork increases the capped
  density. These lights do not represent real participant totals.
- Highest-value sample artwork leads: trophy > gold > silver > bronze.
  Bangkok has a trophy with smaller gold/silver companions; Chiang Mai has
  silver with bronze; Phuket has bronze. Companions use local snapshots of the
  same geometry and CSS float, without an additional WebGL context or idle loop.
- All parts and outlines of each province fall together in a north-to-south
  wave, settled within 1200ms. Main awards follow their province's elevation.
  Interaction, resize, hidden tabs or reduced motion settle the entrance;
  reset does not replay it. Pause starlight freezes decorative loops.

Exactly three fictional students remain. Extra awards are sample artwork only.
The `Kid` contract, province-only location policy, strict opt-in, explorer at
`?view=explorer`, keyboard access and fallback remain in scope as regressions.

Final evidence:

- 70/70 unit tests, application/browser typechecks and production build passed.
- 33/33 development browser tests passed, including all 19 explorer/fan-out
  checks and every one of the 500 IDs. Production preview passed all 14 map
  preview checks. The full explorer suite was not repeated against production.
- Installed Edge, one worker, tracing off, sequential runs; no browser installs.
  See [testing](Docs/testing.md) for exact commands.
- Computer Use inspected narrow overview, trophy/companions, zoom and reset.
  Production captures at 1440px/320px, tilted award facing, and early/settled
  landing were visually inspected. Artifacts stay in ignored
  `.agent-exchanges/017-award-constellations-review/`.
- Final build after the label-copy adjustment: main JS 244.04 kB raw / 76.89 kB
  gzip; lazy scene 617.34 kB raw / 156.87 kB gzip. Existing >500 kB warning
  remains. Browser checks preceded that final text-only adjustment.
- Read-only review found an elevated-province award occlusion issue, fixed with
  a failing/passing reprojection regression. Recheck found no remaining findings.
  Claude bridge returned ECONNREFUSED; no lead approval. See the
  [review record](Docs/agents/exchanges/2026-11-18-award-constellations.md).
- Graphify records the compact continuation. Its original graph/source snapshot
  remain frozen historical data; current source and this handoff take precedence.

Local preview: http://127.0.0.1:5173/ . Next: boss feedback, Claude lead review
when available, and physical-phone/GPU motion/FPS measurements. Production
integration prerequisites remain pending. See
[Task 017](Docs/agents/tasks/017-award-constellations.md) for the final write scope.

## Previous checkpoint: combined sculpted awards (2026-11-18)

User approved one combined navy/enamel/3D design. Task 016 is implemented on
`codex/sculpted-award-map`, feature commit `1c09675`, based on research commit
`5d81367`. Private remote:
https://github.com/dulch29/hamsterhub-hall-of-fame-map . Codex is the sole writer.
No merge or deployment has occurred.

Default `/` is the navy Thailand map with locally generated, instanced sample
artwork: Mock Mali's gold trophy (Bangkok), Mock Niran's silver medal (Chiang
Mai), and Mock Ploy's bronze medal (Phuket). These are fictional samples,
not earned ranks. No student/award contract, dependency or model download changed.
Avatars, cat and application panels remain deferred. The integrated explorer
continues at `?view=explorer`.

Activation frames the province-derived award with existing cancelable 240ms
travel. Keyboard and reduced motion are immediate; repeated activation does
not compound zoom. Escape/background clear selection and reset restores the
responsive overview. Selected members survive regrouping; neighboring groups
and temporary fan-out targets reserve space around them. Camera projection is
refreshed before DOM/mesh placement. Escape includes sibling controls. Rendering
remains on demand, with no idle WebGL loop.

Final evidence:

- 66/66 unit tests; application and browser typechecks; production build passed.
- 30/30 development browser checks passed, including all 19 explorer/fan-out
  regressions, before the final preview-only collision refinement. Its focused
  pure regression and all 11 production-preview checks passed afterward.
- Sequential installed-Edge runs, one worker, tracing off. No browser installs.
  Bundled Playwright Chromium is unavailable; set the executable path documented
  in [testing](Docs/testing.md).
- Overview and trophy/silver zoom inspected through Computer Use; reset to
  overview. Production screenshots inspected at 1440px and 320px, with bounds
  also checked at 390px. Local screenshots retained in ignored
  `.agent-exchanges/016-award-map-review/`.
- Main bundle 243.97 kB raw / 76.85 kB gzip; lazy scene 612.80 kB raw / 155.30 kB
  gzip. Existing >500 kB warning remains. No FPS/load-time acceptance claim.
- Read-only review findings fixed; final reviewer found no further substantive
  issue within the three-sample scope. Claude bridge returned ECONNREFUSED;
  no lead approval. [Review record](Docs/agents/exchanges/2026-11-18-sculpted-awards.md).
- Graphify stores a compact Task 016 continuation note. Original graph and
  source snapshot remain frozen historical data; live files are authoritative.

The normal dev server is http://127.0.0.1:5173/ . Keep future browser work
sequential and small. Next: boss visual feedback, Claude lead review when its
connection returns, and physical-phone/GPU measurements. Production member
authentication, consent, protected API and live destinations remain pending.

## Previous checkpoint: map-first medal pins (2026-11-18)

The user prioritized the map and achievement-style pins, deferring avatars,
walking cat and application UI. Default `/` now renders a full-viewport Thailand
map with three decorative gold star medals and blue ribbon tails. Hover/focus
shows names; click/Enter toggles a selected badge and Escape clears it. No
award ranks or earned-achievement claims were added. The integrated synthetic
explorer, cards, datasets and accessible list remain at `?view=explorer`.
An unobtrusive keyboard skip link and failure link reach that list. Map credits
remain available. Narrow viewports fit the map; geometry, province-only pin
placement, strict opt-in and reduced motion remain unchanged.

Git and GitHub were explicitly requested. Private remote:
https://github.com/dulch29/hamsterhub-hall-of-fame-map . `main` has three imports
of the current snapshot, without fabricated dates or historical intermediate code:

- `41f236e`: working demo, tests and geometry attribution.
- `7f68a89`: requirements, plans, task packets and coordination bridge.
- `f23ebd7`: frozen Graphify graph, snapshot and provenance.

Task 015 implementation is on `feat/map-first-badges`; feature commit `125be15`.
One coordinator edits
scene/shared files serially. Claude review failed twice with `ECONNREFUSED`;
no lead approval is claimed. A read-only reviewer handle was lost after the
user interrupted the turn; no independent result is claimed. Coordinator
source review and browser verification are recorded in
[exchange](Docs/agents/exchanges/2026-11-18-map-first.md).

Verification on this slice:

- `npm.cmd test`: 61/61 passed.
- `npm.cmd run typecheck:browser`: passed. `npm.cmd run build`: passed, including
  application typecheck. Lazy scene: 599.89 kB raw / 151.21 kB gzip; the existing
  >500 kB warning remains. Main bundle: 243.86 kB raw / 76.81 kB gzip.
- Development browser tests: six map-preview checks and all 19 explorer/fan-out
  checks passed, including every one of the 500 IDs across paged fan-out.
  Runs used installed Edge via `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, one worker,
  tracing off, sequential suites. Bundled Playwright Chromium was unavailable.
- Production-preview browser run: all six map-preview checks passed against the
  final built files with the same single-worker Edge setup. The full explorer
  suite was not repeated against production in this slice.
- Desktop and 320px screenshots were visually inspected; 390px bounds were
  also checked. No real-GPU, physical-phone or production acceptance claim.
- Older Computer Use still failed with Windows error 3. The newer unified
  Computer Use connection succeeded, and the reference screenshot was visually
  inspected. [Reference notes](Docs/08-polish/reference-inspection.md) distinguish
  still observation from untested character motion and animation timing.
- Graphify Q&A saved the user direction and current repo state in
  `graphify-out/memory/`. The original graph and source snapshot remain frozen
  and stale; no full graph rebuild is claimed.

User requested avoiding overload. After the interruption, the process inventory
showed no lingering browser tests and only the normal Vite server on 5173. Keep
future browser runs sequential, one worker, tracing off. No software installs,
system setting changes or broad cleanup were performed.

Next: get boss feedback on the map/pins and Claude's lead review when its API
connection returns. Award definitions/data and avatar work remain future scope.
Production authentication, consent, protected API and release acceptance remain
pending. No deployment or merge to main has occurred.

## Previous checkpoint: firefly interaction pass (2026-11-17)

User accepted the simple 3D Thailand land and requested firefly/star clusters
with restrained interaction animation. That pass is implemented:

- Fixed accessible pin buttons contain warm star cores, soft halos and three
  drifting lights. Only the first 30 visible markers animate.
- Pause/Resume sparkles is before the canvas in keyboard order. Reduced motion
  removes loops and fan-out travel; hidden tabs pause ambient effects.
- Pointer zoom/reset and cluster travel take 240ms. Direct gestures interrupt;
  keyboard camera actions are immediate. Resize/preference/visibility changes
  finish travel; filtering stops it and preserves the camera position.
- Fan-out uses a 240ms transform/opacity entrance from the group position.
  Page changes update the DOM overlay without redrawing static province geometry.
- Cards enter in 240ms and exit in 140ms, retaining the native modal until
  transitions finish. A fallback timer and guarded native close event handle
  interruption and StrictMode. Focus restoration and backdrop drag guard remain.
- Buttons, row arrows and Map/List changes have brief feedback. No dependency
  was added and no real records were introduced.

Claude Code reviewed Task 013 in session
`48545807-0b52-412a-b2d1-083631e09f24`: no P0/P1; its P2 refinements were applied.
Task 014's recheck timed out without a response. See
[exchange](Docs/agents/exchanges/2026-11-17-motion.md).
The MapTiler page HTML was retrieved; visual playback was not inspected.

Final verification: 61/61 unit tests; application and browser typechecks; final
production build; development browser suite 19/19 with `--trace off`;
production-preview browser suite 19/19 with `--trace off`.
Both browser runs traversed every one of the 500 IDs across 21 fan-out pages.
Motion checks cover pause/resume, fixed hit areas, dynamic reduced motion,
camera interruption, modal exit and focus continuity through pointer cluster travel.
The demo server on 5173 returned HTTP 200 and remains running.
Build output: lazy scene 599.30 kB raw / 151.06 kB gzip, main 242.05 kB raw /
76.51 kB gzip. The existing >500 kB scene warning remains.
Earlier attempts exposed and fixed a StrictMode dialog event race. Full trace
recording and concurrent dev/preview suites overloaded software rendering, so
final runs use `--trace off`, 15s readiness assertions and a 90s exhaustive
500-maker case. These settings do not satisfy product load-time/FPS targets.
Physical-phone/GPU motion feel and visual approval remain unverified.

## Previous checkpoint: testable synthetic demo (2026-11-17)

The demo is available at `http://127.0.0.1:5173/` while its local Vite server
is running. Restart with `npm run dev` from this workspace if needed.
This checkpoint supersedes the historical foundation notes below.

- All 77 licensed provinces render in an extruded Three.js scene.
- Default data remains exactly three fictional makers. Explicit selectors
  provide spread/dense 500-maker modes, a small group and edge fixtures.
- Search, province filtering, cards, map/list toggle, group zoom and paged
  fan-out are connected. Every dense-group member is reachable.
- Filtering updates pins/materials while preserving the renderer and camera.
  Keyed markers, modal focus return and a skip link support keyboard flows.
- Geometry/module/renderer/context failures retain the searchable list.
- Province placement uses deterministic interior anchors and bounded ID jitter.
  Independent containment tests cover real boundaries, holes and multipart areas.
- Brand colors follow the supplied public Hamsterhub site. No copied remote
  fonts, logos or student images are needed.

Verification completed during final integration:

- `npm test`: 61/61 passed.
- `npm run typecheck` and `npm run typecheck:browser`: passed.
- `npm run build`: passed. Lazy scene bundle is about 597 kB raw / 150 kB gzip;
  Vite reports the expected >500 kB chunk warning.
- `npm run test:browser`: 15/15 passed against a fresh development server.
  Coverage includes all 500 IDs across 21 fan-out pages, camera persistence,
  modal focus/dismissal, opt-out, fallback and 320/390px viewport bounds.
- `npm run test:browser:preview`: 15/15 passed on the final production build.

Before the final keyboard refinement, production-preview browser checks also
passed 15/15. Claude's final source review requested focus continuity through
cluster zoom/fan-out and page announcements. These were added with Enter-key
assertions after every expansion. Final rerun results are recorded below.

CSS review: map-stage height is explicitly 580px, 640px or 480px according to
viewport; list length cannot resize the map. Marker overlay has
`pointer-events: none`, individual buttons `pointer-events: auto`.
The canvas consumes one-finger pan gestures; users scroll outside it.
Physical-phone usability remains an explicit unverified item.

Browser checks use isolated headless cached Chromium with software rendering.
Screenshots are generated but were not visually inspected. No physical-phone,
Safari/Firefox, real-GPU FPS or typical-network acceptance is established.

Claude Code review continues through session
`48545807-0b52-412a-b2d1-083631e09f24`, tasks 009–012. Codex integrates shared
files; scoped workers supplied geometry, clustering and scene lifecycle fixes.
See `Docs/agents/exchanges/2026-11-17-demo.md` and `Docs/testing.md`.

The user can test this synthetic demo now. Production still needs member
authentication, protected data, consent ownership, approved names and real
profile/project routes. Current links intentionally use `.invalid`.
Do not connect real student records until those contracts are resolved.

Final patch verification: `npm test` again passed 61/61; both typecheck commands
and `npm run build` passed. Updated build: scene 597.49 kB raw / 150.31 kB gzip;
main 241.01 kB raw / 76.15 kB gzip. The updated development browser run passed
15/15, including keyboard group expansion at every step.
Claude's Task 012 confirms the focus P1 is addressed and finds no remaining
P0/P1 in that patch. Optional follow-up: clear the page announcement on collapse
so reopening the same page can announce again. Screen-reader output is unverified.

Final production-preview rerun: `npm run test:browser:preview` passed 15/15
after rebuilding the final source. Both complete browser suites pass after the
keyboard patch. Local demo HTTP check returned 200 at
`http://127.0.0.1:5173/`; its Vite server remains running for the user.

## Historical implementation: fixtures, shared preparation, and Pin Card

This section supersedes the historical M0 state below (2026-11-17).

- Added fresh `createOptedOutKid()` and `createLongNameKid()` factories in
  `src/mock/fixtures.ts`; the long name is 244 ASCII characters.
- Added `src/data/prepareKids.ts` and ten tests. App consumes this adapter.
  Strict opt-in, duplicate rejection, province/ID/timestamp checks, contract
  field allowlisting, manual featured resolution and fresh nested copies are
  implemented. Unset/invalid featured selection stays null, provisionally.
- The source provides already-visible projects. Hidden/deleted projects,
  membership and consent must be filtered server-side before production data
  arrives. Untrusted JSON and production field constraints remain unimplemented.
- Added `src/ui/links.ts`: HTTPS or loopback HTTP, no credentials, no relative
  paths. Production profile paths need confirmation once the host URL is known.
- Added native modal `src/ui/PinCard.tsx`, scoped CSS, and five markup tests.
  Starter buttons open by selected student ID. Source implements close, Escape,
  backdrop dismissal, focus restoration, initials and image-error placeholders.
  The modal/panel choice must be revisited alongside scene controls.
- Exactly three default synthetic students remain. No scene, clustering,
  finished filter/search list, auth, real records, or production branding yet.

Claude Code reviewed the actual fixtures and adapter and delegated the adapter
and card integrations through session
`48545807-0b52-412a-b2d1-083631e09f24`. It has no tools through the review
bridge; Codex is the sole application writer. Task packets 004–006 and
`Docs/agents/exchanges/2026-11-17-data-implementation.md` record decisions.
The graph worker owns `graphify-out/` only. The workspace still has no Git
repository; no concurrent application writers or worktrees were started.

Further work in the same session:

- Claude's Task 006 review accepted the adapter and card source with one
  dismissal correction. Codex added a pointer-start check so dragging from
  inside the card onto the backdrop does not trigger dismissal.
- Claude delegated pure pin derivation. Added `src/geo/hash.ts`, `pins.ts`,
  and four tests. UTF-8 FNV-1a seeds stable per-ID disc jitter with longitude
  correction. Missing/invalid anchors fail without student identifiers.
  Only synthetic anchors are used in tests; the app has no map yet.
- Task 007 sends the actual geo code and corrected card to Claude for review.

Latest local checks:

- `npm test`: 30/30 passed across the explicitly listed generator, adapter,
  link, card-markup, pin and projection suites.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Direct exports through the installed tsx CLI, count 3 and count 500 with
  seed 42: byte-identical to pre-change baselines in
  `.agent-exchanges/fixture-baseline/`.
- Browser runtime setup found no connected browsers. Keyboard interaction,
  focus restoration under StrictMode, image-error behavior and 320px layout
  remain unverified. No phone, assistive-technology or performance checks ran.

Combined test dataset correction: 500 generated records plus both fixtures
is 502 inputs; excluding the opted-out fixture leaves 501 outputs.

Next: finish browser verification when a browser is connected, then select a licensed 77-province geometry source and
implement the map package. Obtain the Hamsterhub site URL for actual styling,
profile formats and host integration. Production backend/session and guardian
consent decisions remain unresolved. No Project.md acceptance criterion has
been marked complete.

### Foundation closeout

Task 007 accepted synthetic pin derivation. Its hardening is now implemented:
strict opt-in in `derivePins`, own-property anchor lookup, positive radii,
salted radius/angle hashes, and documented latitude-degree units. Five pin
tests include broad quadrant distribution bounds. The source also checks
pointer release on the backdrop before card dismissal.

Added `src/geo/project.ts` with a parameterized local equirectangular projection
and inverse, plus two grid/error tests. Placeholder origin/reference/scale
must be replaced from the selected geometry. These files are not called by
App yet. Final `npm test` (30/30), type checking and build all passed.
Task 008 requests a closing source review, not more implementation scope.

Graph worker finished `graphify-out/graph.html`, `graph.json`, and
`GRAPH_REPORT.md`: 191 nodes, 459 preserved relationships, 11 communities.
The snapshot is frozen at 21:52:20 Bangkok on 2026-11-17, predating geo work
and later card/docs changes. Consult `final-drift.json` and `provenance.json`;
the graph is useful navigation, not current verification. Worker is closed.

Next concrete milestone: select and document licensed geometry covering all
77 provinces, establish containment-safe anchors/radii, fit the projection,
then build and browser-verify the scene. Browser interaction, real geometry
containment, production authentication, consent and branding remain pending.

### Closing review correction

Task 008 caught correlated radius/angle values from its earlier salted-FNV
recommendation. Quadrant coverage missed this joint defect. Codex added
4 equal-area annuli × 4 quadrants, with fixed cell bounds 10–53 for 500 IDs.
It failed before the fix with counts
`[91,13,16,0,22,105,0,15,0,16,15,89,13,0,87,18]`.
Murmur3 avalanche mixing now runs on both salted hash values. The unchanged
distribution bounds and original FNV vectors pass.

## Read first

- `Project.md` is the source of truth for scope, privacy requirements, data contracts, ownership, and unresolved decisions.
- `README.md` contains installation, development, testing, and mock-export commands.
- This file records the implementation state at the end of M0 setup. Inspect the workspace for any later changes before continuing.

## Implemented

- Standalone React + Vite + TypeScript development scaffold with strict type checking.
- Three.js and its TypeScript types installed for M1; no scene code yet.
- `src/types.ts` implements Kid, Project, MapPin, and the 77 province codes.
- `src/mock/generate.ts` provides reproducible synthetic records with configurable count and seed.
- The default dataset contains exactly three opted-in students: Mock Mali (Bangkok), Mock Niran (Chiang Mai), and Mock Ploy (Phuket).
- All avatars are null; the third student has no projects or featured project. Profile/project URLs use `.invalid` domains.
- `scripts/generate-mock.ts` exports JSON to stdout or a new file, rejects invalid counts, and refuses to overwrite existing files.
- `src/App.tsx` renders a minimal starter with three student rows and filters on `showOnMap`. This is not the finished accessible list view.
- `index.html` contains a noindex/nofollow tag. This does not enforce authentication.
- `package-lock.json` records installed dependencies. `.gitignore` excludes dependencies, build output, environment files, and the default mock export.

The generator defaults to count 3 and seed 42. Keep three students in the default preview; larger counts are for explicit load tests. Exporting a JSON file does not change the app's dataset.

## Verified during setup

Checks passed on 2026-11-17 using Node.js 24.16.0 and npm 12.2.0:

- `npm run build`: TypeScript checking and production bundling passed.
- `npm test`: all four generator tests passed, covering defaults, reproducibility, 500 records, contract consistency, and invalid options.
- CLI smoke checks: default export contains three records, `--count 500` produces 500, invalid counts fail, JSON file export works, and existing files are protected.
- React server-rendering smoke check: exactly three student rows, the expected names/provinces, and the missing-project message were present.
- The built-in browser reached the local dev server and reported the expected page title. Browser interaction, mobile layout, WebGL, and performance testing have not been completed.

These checks establish scaffold behavior only. The full acceptance criteria in Project.md remain unchecked.

## Not implemented

- Thailand geometry, province anchors/jitter, camera controls, instanced pins, picking, clustering, or fan-out.
- Pin Card, production profile/project links, search/filter list view, keyboard flows, or WebGL failure handling.
- HamQuest/Hamsterhub branding. The current styling is a plain development starter.
- Backend, member sessions, protected data API, real student data, or guardian-consent collection.
- Featured-project selection settings or the unconfirmed most-recent-project fallback.
- Dedicated long-name and opted-out fixture tests; all three default records intentionally remain opted in.

The visual reference in Project.md has not been reviewed. No geometry dataset or license has been selected.

## Next work

1. Inspect the existing scaffold and confirm the next task against Project.md. M1, the static 3D map, is the next implementation milestone.
2. Obtain the Hamsterhub/HamQuest site URL before choosing final branding and integration details.
3. Select and document a province geometry source and license, then establish province anchors.
4. Build the Thailand scene and constrained camera controls, then place the three default students using province anchors plus deterministic jitter.
5. Continue through interaction, clustering, accessibility, and performance milestones. Real data requires server-enforced member authentication and consent filtering first.

The ownership table in Project.md still assigns scene/clustering to the lead and UI/mock work to Codex. No parallel agents have been started. No Git repository, commits, branches, or worktrees have been created in this directory; the branch/worktree policy remains to be established before multi-agent work.

## Resume locally

Dependencies are already installed in this workspace. On a clean checkout, run `npm ci` first.

```sh
npm run dev
```

The setup session used `http://127.0.0.1:5173/`. A new session may need to restart the server; use the address Vite prints.

Suggested starting prompt for the next session:

> Read Project.md, README.md, and HANDOFF.md, inspect the existing M0 scaffold, and continue with M1 using exactly three default mock students. Keep unresolved branding, geometry licensing, and production authentication requirements explicit.
