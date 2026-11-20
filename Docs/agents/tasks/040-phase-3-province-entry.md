# Task 040 — fixed-center province entry and recipient panel

Agreed 2026-11-20. **Status: complete locally; ready for user review.**
The user subsequently instructed implementation. Codex is the sole writer on
`codex/phase-3`, base `121a217`. The accepted source write set below is active.
No deployment is assigned.

## Assignment

- Packages: 01 discovery, 02 map, 03 data, 04 panel and 06 accessibility.
- Deliverable: fixed-center preview controls and the first sketch's province
  recipient panel, reachable from both map medals and the accessible directory.
- Sole assigned writer/integrator for this milestone: Codex. Scene/shared edits are serialized;
  no concurrent implementation writers are assigned.
- Workspace: `D:\Projects\Hamsterhub\Map Project Showcase`.
- Implementation branch: `codex/phase-3`, from the accepted planning commit
  `121a217`. Earlier main `65196c9` is the historical handoff base.

This slice is part of the accepted P3.1–P3.3 complete-journey review target. It
does not deliver the full competition/presentation/character journey by itself.
The current public review remains the baseline while this slice is developed.

## Agreed behavior for this milestone

1. Preview mouse/one-finger horizontal drag rotates around the fixed Thailand
   center. Keep fixed tilt, disable pan and retain bounded wheel/pinch/button
   zoom. Add labeled keyboard rotation controls. Gestures and resize must not
   relocate the pivot. Bounds must leave the map usable without pan.
2. Only medals open a province. Highlight/open its panel with no automatic
   camera movement. Different medals/companions for the same province resolve
   to the same province selection. Rotation/zoom retain the open panel rather
   than implicitly closing it. Reset clears selection and restores fitted home.
3. Province rows are the union of that province's explicit visible award
   recipients, deduplicated by ID. Show portrait/fallback, nickname with approved
   full name below when supplied, and an explicitly featured competition when
   supplied. Unset featured competition stays unset; do not infer it from title,
   date, award rank or array order. Existing displayName remains a fallback.
4. **Accepted intermediate behavior:** selecting a row
   opens the existing manually featured-project preview. It does not imply that
   project belongs to or won any competition. Back/Escape from that preview
   returns to the province panel and restores row focus; Back/Escape from the
   province returns to the map/directory invoker. Close exits directly to the
   map/directory. Preserve angle/zoom throughout; Reset restores home.
5. Desktop uses the first sketch's navy/mint/gold glass panel. Phones use one
   scrollable bottom sheet, with the map and essential controls still reachable.
   Reserve the compact identity/header composition for subsequent panels;
   characters are not part of this first slice.
6. Map/directory share province selection and recipient resolution. Keep search,
   filtering, direct `?view=recipients`, retry and no-WebGL browsing usable.
   A failed renderer must not remove the usable panel/recipient path.

## Reserved source ownership

Read each file before editing. These are bounded permissions, not a requirement
to change every file. Additions use the named paths; record a scope adjustment
before editing a different shared file.

- Scene: `src/scene/ThailandMap.tsx`; new `src/scene/provinceCamera.ts` and
  `src/scene/provinceCamera.test.ts` only if a pure camera helper is useful.
- Data: `src/data/demoAwards.ts`, `src/data/demoAwards.test.ts`,
  `src/data/localPreview.ts`, `src/data/localPreview.test.ts`,
  `src/mock/discovery.ts`; new `src/data/provinceRecipients.ts` and
  `src/data/provinceRecipients.test.ts` for union/manual selection resolution.
- UI: `src/ui/MapPreview.tsx`, `src/ui/AwardDirectory.tsx`,
  `src/ui/discovery.css`; new `src/ui/ProvinceRecipients.tsx` and
  `src/ui/ProvinceRecipients.test.tsx`.
- Checks: `package.json` only for explicit unit-test registration;
  `tests/discovery.spec.ts`, `tests/map-preview.spec.ts`,
  `tests/map-recovery.spec.ts`; new `tests/province-entry.spec.ts`.
- Documentation: `Project.md`, `Agent.md`, `HANDOFF.md`, `Docs/README.md`,
  the plans for packages 01/02/03/04/06, the Phase 3 plan, and this task packet.

Read but preserve the existing explorer, production `src/types.ts` contracts,
scene recovery module/geometry/artwork, existing StudentPreview/Bubble motion
internals, build-review script, owner assets and ignored input records. If this
slice needs edits there, identify the bounded reason and update the packet first.

## Verification and acceptance

- Pure tests: province union/deduplication; multiple awards for one person;
  strict opt-out exclusion; other-province isolation; explicit versus unset/stale
  featured competition. Register new suites in the explicit test script.
- Run `npm run typecheck`, `npm run typecheck:browser`, `npm test`,
  `npm run build` and `npm run build:review` using the existing approved source.
- Sequential installed-Edge browser checks, one worker and tracing off, at
  320/390/1440 widths: fixed pivot/tilt, drag versus tap, bounded pinch/wheel and
  buttons, keyboard rotation, same/different province selection, Reset,
  resize, scrolling, focus return, long names and missing portraits.
- Check the ordinary three-person demo, explicit group fixture and compiled
  seven-profile review (four Bangkok recipients, each reachable once).
- Preserve actual context loss/restoration, selection/close during loss,
  timeout/fallback/retry, transient/permanent geometry, failed module/init retry
  and repeated cleanup. Update old camera-return assertions only where the
  approved Phase 3 behavior deliberately supersedes Phase 2.
- Recheck explorer behavior because the scene file is shared. Keep reduced
  motion, pause and hidden-tab/disposal behavior intact.

Use `rg --files tests` to select actual existing regression filenames. The
production-preview config starts the normal `dist` server on port 4174; explicitly
serve `.review-build` for seven-profile checks and record the command. Never
report a normal-build run as seven-profile review evidence.

Physical-phone/GPU/FPS and subjective motion acceptance are separate. See the
implementation results below for actual commands and outcomes.

## Exclusions and continuation

Competition list/detail, slide/PDF UI, Guide/Explainer art/travel/narration,
grander medals, live AI, production membership/data integration and ocean
decoration are subsequent work. Narration wording approval does not block this
first slice. Keep private owner records/media outside Git.

Milestone scope and the reserved write set are accepted. The user subsequently
instructed implementation. Actual results are recorded below and in HANDOFF.md
using the [handoff template](../templates/handoff.md). Publishing is a later
explicitly reviewed action; no deployment is assigned.

References: [Project](../../../Project.md), [Phase 3 plan](../../01-discovery/phase-3-plan.md),
[first sketch](../../01-discovery/phase-3-references/04-province-students-sketch.png),
[map plan](../../02-map/plan.md), [data plan](../../03-data/plan.md),
[panel plan](../../04-pin-card/plan.md), [accessibility plan](../../06-accessibility/plan.md).

## Execution checklist

- [x] Inspect source, callers, tests and accepted contracts; create implementation branch.
- [x] Add recipient union/explicit featured-competition resolution and focused tests.
- [x] Integrate fixed-center preview controls and province panel with retained project preview.
- [x] Verify responsive/keyboard/directory/recovery/explorer flows and builds.
- [x] Review the diff against scope and project standards; resolve findings.
- [x] Record verification and update the persistent Graphify graph, excluding private inputs.

## Implementation result (2026-11-20, Asia/Bangkok)

Codex implemented the reserved scene/data/UI paths and new `provinceRecipients`
and `ProvinceRecipients` modules, with registered unit suites and
`tests/province-entry.spec.ts`. Existing preview tests were revised where Phase 3
supersedes award travel, floating-recipient discovery and bubble recall. Explorer,
award geometry, recovery internals and production contracts remain unchanged.

Preview controls use fixed tilt/center, no pan and zoom 1–2.5. Medal selection
does not move the camera; pointer/one-finger drag, wheel/pinch/buttons, keyboard
rotation and resize preserve the pivot and open panel. Close/Back restore the
invoker; an offscreen medal falls back to map-region focus. Reset clears all
selection and restores fitted home. Province/directory rows share strict visible
recipient union/deduplication and explicit featured-competition resolution.
Public review input without featured choices deliberately shows the unset state.

The self-review and browser checks found and fixed hidden Reset controls,
offscreen focus loss, desktop controls covered by the panel, and phone identity/
controls overlap. Controls are now tested with actual pointer hit targets;
phone previews reserve their header and capture row bounds before hiding it.
No dependency was added. No independent lead review is claimed.

| Verification | Actual outcome |
|---|---|
| `npm run typecheck`; `npm run typecheck:browser` | Passed; the final builds also run `tsc -b` |
| `npm test` | 114 passed, including explicit flag validation and province/markup suites |
| `npm run build` | Passed; existing large scene chunk warning remains |
| `$env:REVIEW_SOURCE_URL='https://hamsterhub-review-assets.vercel.app'; npm run build:review` | Passed; approved owner source and output remain outside Git |
| Installed Edge, full compiled normal suite | 50 passed with one worker/tracing off, covering explorer/fan-out, discovery, landing/motion, camera and recovery |
| Final affected compiled checks after layout fixes | 18 discovery/camera/recovery passed, plus 1 directory filter/unsafe-link check; pointer hit testing added |
| Final MapPreview focus correction | 13 compiled discovery/recovery checks passed; a timeout retains province browsing and Close restores a usable directory button |
| Explicit `.review-build` on port 4175 | All seven profiles reachable once across four provinces at 320/390/1440 × 844, including four Bangkok rows, supplied media/PDF isolation, keyboard focus, rotation and actual context loss/restoration; zero page errors |
| Diff/document checks | `git diff --check` passed; local documentation links checked at closeout |

Graphify's targeted update includes 65 current code files and this complete task
packet: 394 nodes, 1,101 preserved relationships and 13 communities. Older
document semantics remain historical. No dangling/missing endpoints were found;
one self-link is the real recursive permutations test helper. Parallel relations
are retained in JSON while community analysis uses a simple undirected graph.
The extractor reports 19 file-only code nodes and cannot parse the existing
BOM in browser tsconfig; the actual TypeScript checks pass. See the graph report
and `task040-*` provenance/validation artifacts; no private review input is indexed.

Browser commands use `node node_modules/@playwright/test/cli.js test --config
playwright.preview.config.ts --workers=1 --trace=off --reporter=line`, selecting
the relevant files for the final affected run. The review was served explicitly
with `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4175
--strictPort --outDir .review-build`, launched by the external verification script.
Evidence/scripts are in `%TEMP%/hamsterhub-phase3-040/`; screenshots were inspected.
Normal/demo builds retain three fictional students. Personal input/media, build
output and screenshots are excluded from source and Graphify.

Physical-phone/GPU/FPS and subjective appearance/motion acceptance remain open.
No deployment or push occurred. Next: the bounded P3.2 competition/detail slice,
with explicit student-project-media associations; then P3.3 characters/narration.
