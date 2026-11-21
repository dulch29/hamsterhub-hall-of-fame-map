# Whole-project polish — coverage ledger

Opened 2026-11-20 on `claude/whole-project-polish` (base `ba8edf0`, tree clean).
Scope and gates: [polish handoff](../agents/handoffs/2026-11-20-claude-polish.md).
Status words: `pending` (not yet inspected), `source-read` (code read, nothing
rendered), `verified` (command or capture evidence recorded), `deferred` (reason + owner).
Never read `pending` or `source-read` as passed.

## Baseline (P0), this checkout

| Check | Result |
|---|---|
| `npm test` | 135/135 pass |
| `npm run typecheck`, `npm run typecheck:browser` | clean |
| `npm run build` | passes; known scene-chunk warning (ThailandMap 629.94 kB raw / 161.21 kB gzip) |
| Static scan of `src`, `server`, `api` (non-test) | no TODO/FIXME, `any`, `@ts-ignore`, `console.log/debug` |
| Compiled-preview Playwright suite (Edge, 1 worker, trace off, 20.3 min) | 101 passed, 1 skipped, 2 failed (B-01, B-02 below) |

## Baseline failures

| ID | Status | Note |
|---|---|---|
| B-01 | flake, unconfirmed cause | `bubble-province.spec.ts:111` timed out at 15s waiting for `.map-canvas` while the page still showed the map-loading message. Passed when rerun alone. Likely slow scene-chunk load late in a 20-minute serial run; not reproduced as a defect |
| B-02 | fixed in test, verified | `map-preview.spec.ts:3` compared whole-page canvas captures byte for byte. The open Guide panel (frosted, backdrop blur) overlaps the map and differs by about 9 pixels (max channel delta 4) near its top-right corner. Failed 4 of 5 unmodified runs; after hiding `.character-guides` in the capture it passed 5 of 5. Cause inferred from the diff location, not proven. No application code changed |

## Coverage

| Area | Status | Findings / evidence |
|---|---|---|
| First load and global shell | verified | Captured 320/390/1440x844 plus 1440x700, 1024x768: no page errors, no horizontal overflow, canvas renders, all three awards visible on phones. P-01, P-02, P-03, P-04 fixed. Loading/retry states exercised by `map-preview`/`map-recovery` specs |
| Geography and 3D scene | automated only | `ThailandMap.tsx` setup/teardown read: every listener, RAF, timer, ResizeObserver, geometry and renderer is released on unmount. Picking, landing, framing, north/south orientation, laurel awards covered by `map-preview`, `province-entry` specs. No new visual inspection of lighting/clipping beyond the home captures. Eight award batches and triangle budget untouched |
| Camera and input | automated only | Orbit both axes, bounded zoom, no pan, Reset, saved-camera return, drag-vs-click, pinch: `province-entry`, `award-navigation`, `bubble-province` specs. No physical touch device |
| Bubble system | automated only | Composition at 320x480 to 1440x844, shared film, pop/re-form/recall, View all SFX/VFX: `bubble-*`, `view-all-feedback` specs. P-07, P-09 fixed |
| Recipients and navigation | verified | Directory and View all at all widths; P-05, P-07, F-03 fixed. Back/Escape/Close focus return covered by `bubble-province`, `character-guides`, `guide-chat` specs |
| Student and competitions | partly verified | P-08 fixed for 568px-tall phones; long Thai name fixture covered by `character-guides` spec. At 320x568 slides still need scrolling inside the card |
| Projects and media | automated only | Slide arrows, broken/missing image, PDF action: `competition-presentations` spec (7 tests). P-09 fixed. F-02 left as is: `aria-disabled` plus clamped handler keeps focus on the button, an accepted pattern |
| Characters and narration | automated only | Tap-to-speak, Skip, pause, hidden tab, unavailable Thai voice, speech error: `character-guides` spec with a controlled speech stub. Real device Thai voices not checked |
| Gemini Guide | verified (controlled) | Controlled replies, invalid targets, HTML in text, Stop/retry/clear, failures: `guide-chat` spec. Server boundary reviewed (S-01). No live provider call made in this pass. F-01 left: server already caps the reply at 32 KiB |
| Visual system | partly verified | Tap targets, overlaps and panel layering fixed across preview, directory and explorer (P-01 to P-11). No full colour/contrast/type audit was done |
| Motion and sound | automated only | Mute, pause, reduced motion, hidden tab, interruption, finite lifecycle: `view-all-feedback`, `bubble-province`, `map-preview` specs. Subjective timing and sound feel not owner-reviewed |
| Responsive and touch | verified (emulated) | 320/390/1440x844, 390x640, 320x568, 430x932, 1440x700, 1024x768, 800x700: no overflow; overlaps fixed (P-04, P-05, P-07). Landscape phone and virtual keyboard not checked. Emulation only, no physical phone |
| Accessibility | partly verified | 44px targets on every route (P-01, P-09, P-11). Keyboard paths and focus return covered by specs. No screen-reader session was run. No contrast measurement |
| Loading/error/empty/recovery | verified | Geometry failure, WebGL init failure, context loss/restore, failed scene download, directory without WebGL: `map-recovery` and `map-preview` specs. F-03 fixed. Offline Guide covered by controlled failures |
| Data and privacy | verified | S-01. Opt-out filtering in `prepareKids`, `provinceRecipients`, `guideCatalog`. Default demo stays three fictional students. Province-level positions only. No private data in Git or `dist` |
| Performance and lifecycle | measured, not accepted | M-01. Disposal verified by reading cleanup and by `map-recovery` "repeated map/list browsing disposes old contexts" spec |
| Code and API quality | verified | Clean static scan; server/API boundary reviewed (S-01) |
| Tests and tooling | verified | `npm test` 137 files listed explicitly (new `AwardDirectory.test.tsx`); typecheck, browser typecheck, build, review build pass. Full serial browser regression: see Final regression below |
| Docs and release readiness | verified | HANDOFF checkpoint, this ledger, release/rollback notes and production blockers updated |

## Findings

| ID | Sev | Status | Note |
|---|---|---|---|
| F-01 | low | open, unverified | `useGuideChat` reads the whole response body before the 32,000 length check; server already bounds output at 32 KiB, so impact is small |
| F-02 | low | open, unverified | Slide prev/next use `aria-disabled` while staying clickable; clamped in handler, so no wrong state, only a hint mismatch |
| P-01 | medium | fixed, verified | Sound toggle (36px), Pause starlight (30px), narration toggle (40px) and the credit disclosure (16px) were under the 44px phone target. All four now measure 44px or more at 320, 390 and 1440 wide (DOM measurement of every visible button, link, select, input and summary; none left under 44px). Files: `discovery.css`, `guides.css`, `styles.css` |
| P-02 | medium | fixed, verified | At desktop heights near 844px the open Guide panel started at y=30 and covered the page heading. Panel max height is now `100% - 260px`, so it starts at y=130 below the subtitle at 1440x844, 1440x700 and 1024x768. Heading captured readable at 1440x700. Panel content scrolls inside it |
| P-03 | high | fixed by owner decision, verified | On first load at 320 and 390 wide the open Guide panel (490px of an 844px screen) covered the map and all three awards. Owner chose to collapse it by default on phones (width 700px or less). `CharacterGuides.tsx` now initialises `open` from `matchMedia("(max-width: 700px)")`. Desktop still opens it. This revises the Task 047 "welcomes on entry" wording for phones only. `character-guides.spec.ts` and `guide-chat.spec.ts` now assert the collapsed start at phone widths and open it with one tap. Captures at 320 and 390 show the map and all three awards clear |
| P-04 | medium | fixed, verified | On phones the Reset button overlapped the Guide launcher by 42x44px (seen in the 390px capture). The map control column now sits at `bottom: 126px` on phones when no province is open. After the change the capture shows them apart. Caveat: my overlap scan reports a button as overlapping even when it is scrolled out of view inside the scrolling Guide panel, so its earlier extra pairs (province buttons over the sound toggle, credit and launcher) were mostly that artifact and are not counted as defects |
| P-05 | high | fixed, verified | On desktop (701px and wider) with the Guide panel open, the province directory (`?view=recipients`) ran underneath the panel: the search box and the three province cards were hidden behind it in the 1440x844 capture. `.award-directory` now starts at left 384px when the panel is open, and the filters stack in one column between 701 and 999px wide. Measured at 1440, 1024 and 800 wide: panel right edge 362px, directory left 384px, no overlap, no horizontal overflow. Capture at 1440 shows the search, province select and three cards fully visible |
| P-07 | medium | fixed, measured | Phone View all list: the Guide launcher and sound toggle sat on top of the recipient panel (390x844: launcher y 724-774 and sound y 788-832 inside panel y 582-820; same at 320x568). On phones the panel now ends 76px above the bottom, launcher and sound sit in a strip under it, and the map controls move to a top row. Measured at 320x568, 390x844, 430x932: no control overlaps the panel. File: `discovery.css` |
| P-08 | medium | fixed, measured | Short phones (320x568): the competition card was 174px tall and showed only its title, because the phone branch forced the card top to y>=330. Top is now `min(330, height-300)`, so 568-high screens get a 236px card; heights from 630px up are unchanged. Name and portrait stay clear of the control row (name y 145-169). File: `AwardDiscovery.tsx`. Limit: at 320x568 the slides and description still need scrolling inside the card |
| P-09 | low | fixed, measured | Slide image on phones is capped at 140px so prev/next and the counter fit in the card's first view at 390x844 and 430x932 (controls bottom 690 vs visible body bottom 698). Bubbles-screen close buttons were 40px, now 44px. File: `discovery.css` |
| P-10 | note | not changed | Explainer text "จังหวัดBangkok" has no spaces around the Latin province name. It is the user-approved Thai script and three tests assert it, so I left it. Owner may want a spaced variant |
| P-11 | medium | fixed, verified | `?view=explorer` controls were 30-42px: wordmark link, Map/List switch, search, province select, Pause sparkles, map markers, zoom/reset, dataset select, footer link. All now 44px or more at 320, 390 and 1440 wide. Rules are scoped to `.explorer` so the preview route keeps its 64px award markers (measured 64px before and after). Remaining under 44px: the three attribution links inside the sentence; WCAG 2.5.8 exempts inline text links, so not changed. The 320px overlap between two attribution links is that same wrapped sentence. File: `styles.css`, commit `c269543`. `explorer`, `fanout`, `map-preview` specs: 32 passed |
| S-01 | medium | fixed, not deploy-verified | Security review: no secrets in tracked files or `dist`; only `VITE_PUBLIC_REVIEW` reaches the browser; `npm audit` 0 vulnerabilities (prod and dev); Guide request/reply validated (`contract.ts`), targets limited to catalog keys, catalog fictional-only and skips `showOnMap !== true`; server sends `no-store`/`nosniff`, origin check, 48 KiB body cap, 20s timeout, per-instance rate limit (not a global spend cap). Gap fixed: `vercel.json` sent no app security headers; added `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`. No CSP added: it needs testing against Three.js/WebAudio/speech before shipping. Headers verified as valid config only; not yet observed on a deployment. Dependency: if Hamsterhub will embed this page in an iframe, `DENY` must become a `frame-ancestors` allow-list |
| P-12 | medium | fixed, verified | Landscape phones (844x390, 568x320) are wider than 700px, so the Guide opened over the map and covered the Chiang Mai award. It now also starts collapsed when height is 500px or less, and when opened there it may cover the title (`max-height: 100% - 150px`) so its heading stays visible. Measured: both sizes start collapsed; opened panel heading visible. 1440x844 unchanged (opens). Files: `CharacterGuides.tsx`, `guides.css`. Guide/map/composition specs: 32 passed, 1 skipped |
| D-01 | medium | fixed, verified | Desktop journey walk (home, chat reply, bubbles, View all, student, competition, directory) at 1024x768 to 1920x1080, with captures inspected. Three collisions fixed: (a) View all close button sat under the sound toggle at every desktop size (y 156-200 vs 124-168); panel now starts at y=184. (b) Competition card covered the map controls at 1024, 1280 and 1366 wide; with a profile open on desktop the controls now stack in the right gutter. (c) The Explainer hint box overlapped the card below 1280 wide; it is hidden there, since the card shows the same instruction. Also the PDF action was clipped below the card fold at 1024x768, 1280x800 and 1366x768; slides are capped at 190px when height is 800px or less, so slide controls and PDF fit the first view at all five sizes (1440 and 1920 unchanged). After the fixes the desktop walk reports 0 overlaps and 0 offscreen controls. Files: `discovery.css`, `guides.css`. Affected specs: 47 passed |
| P-06 | low | open, unverified | The Guide panel at 1440x844 scrolls internally, so its province list sits below the visible fold on first view. Not a defect by itself; noting it for the visual pass |
| F-03 | low | fixed, verified | `AwardDirectory` said "no match, change your search" when the dataset had zero recipients and no search was active. It now says no recipients are available yet; the search hint only shows when a query or province filter is set. New `AwardDirectory.test.tsx` (registered in `npm test`) fails on the old component and passes now. Suite 137/137 |

## Performance measurement (M-01)

Measured 2026-11-21 on the production build (`npm run build`, `vite preview`), headless Edge 157,
1440x844, devicePixelRatio 1, local loopback (no network throttling). Host: Intel Core i5-12450H,
16 GB, WebGL renderer ANGLE D3D11 on **Intel UHD Graphics (integrated)**; the RTX 3050 was not used.
Script: `.local-preview/perf.mjs` (gitignored). Frame gap = time between `requestAnimationFrame`
callbacks during a 120-step scripted mouse drag on the canvas. Two runs each.

| Dataset | Ready (ms) | Frame p50 / p95 (ms) | JS heap (MB) |
|---|---|---|---|
| Preview, default 3 students | 7583, 4437 | 62.4 / 118.5, 62.5 / 118.2 | 110, 99 |
| Preview, group 8 | 5119, 4552 | 55.5 / 104, 62.4 / 111 | 109, 100 |
| Explorer, 3 makers | 2566, 2333 | 34.8 / 69.5, 34.7 / 69.6 | 96, 93 |
| Explorer, 500 dense Bangkok | 2953, 2670 | 13.5 / 48.8, 13.9 / 48.7 | 92, 96 |
| Explorer, 500 spread | 2798, 2800 | 41.7 / 76.3, 41.6 / 83.3 | 110, 85 |

Reading: "Ready" on the preview includes the designed 2.2s province landing. Frame gaps are
paced partly by Playwright's input events, so they are diagnostics, not FPS. Even so, the preview
drag at ~62ms p50 on this integrated GPU is far from the ~60 FPS desktop goal and slower than the
explorer on the same map. **Open**: needs a proper profile (draw calls, overdraw from the
transparent canvas and lights, award batches) before any change. No optimisation was made in
this pass. Physical phone and discrete-GPU measurements are not done; device acceptance is open.

## Final regression

Normal build, all 14 specs, installed Edge, 1 worker, trace off, 2026-11-21: **103 passed, 1 skipped, 0 failed** (12.9 min). The skipped test is the review-only Guide check; it runs under `PLAYWRIGHT_REVIEW_BUILD=1` (result below). Baseline B-01 did not recur. `explorer.spec.ts:222` failed once in an earlier partial run and passed 6 of 6 reruns; treated as a timing flake.

Review build (`npm run build:review`, `PLAYWRIGHT_REVIEW_BUILD=1`): the review-only test `guide-chat.spec.ts:104` (owner context and targets excluded, fictional work opens) **passed**, both alone and in a wider run. That wider run also pointed the normal-demo specs at the review build by mistake; their 38 failures came from the different seven-profile dataset (no "Mock Mali", four provinces), not from a regression, and are not counted. `.review-build` contains no Gemini key pattern. The seven-profile journey at 320/390/1440 was not re-walked in this pass.

## Production blockers (owner or external)

| Blocker | Needed to clear it |
|---|---|
| Production host and membership | The real Hamsterhub host stack and a server-enforced membership contract. The public review is noindex only; it is not access control |
| Real, opted-in student data | Protected data source, consent contract and `showOnMap` values from the owner |
| Real Profile and project links | Destination URL contract; current links are fictional placeholders |
| Brand tokens | Confirmed HamQuest/Hamsterhub tokens; current palette is inferred |
| Device acceptance | Physical phone and real GPU measurements; only headless Edge on an integrated GPU was measured |
| Embedding policy | Whether Hamsterhub will iframe this page (`X-Frame-Options: DENY` blocks it today) |
| CSP | A tested Content-Security-Policy; none is shipped yet |
| Gemini spend control | A durable provider-side quota; app limits are per instance (10/min, 2 concurrent) |
| Release approval | A current owner instruction to deploy. Nothing was pushed or deployed |

## Release candidate and rollback

Branch `claude/whole-project-polish`, not pushed. To release after owner approval: merge to
`main` without squashing, push, and let the existing Vercel Git integration build it (do not upload
the workspace root with the CLI; it includes ignored private files). Verify on the deployment:
root and review assets return 200 with `X-Robots-Tag: noindex`, the new security headers are
present, `POST /api/guide` with GET returns 405, and the seven-profile journey works at 320/390/1440.
Rollback: promote the previous READY deployment `dpl_54EEFSyTWmbafF1BGmPBTtyh7YCb` (main `e3b9ed0`)
in the Vercel dashboard, or revert the merge commit on `main`.
