# Development handoff

Updated: 2026-11-21. Workspace: `D:\Projects\Hamsterhub\Map Project Showcase`.

## Current checkpoint: Mascot Phases 2–3, CSP, Accessibility & Release Ready

2026-11-21. Completed Milestones 1–4 across Mascot Phases 2 & 3, plain-map control/narration removal, strict Content-Security-Policy, WCAG AA contrast, responsive/landscape/keyboard polish, and full verification. Full record: [coverage ledger](Docs/08-polish/coverage-ledger.md).

- **Mascot Phases 2 & 3 (`R1`):**
  - Step-2 card layout fix (`เปิด PDF` in `.student-preview__footer`, 2-line speech clamp with `ResizeObserver` `อ่านเพิ่มเติม`, consolidated media heights) so `.presentation-controls` and `เปิด PDF` fit the initial card view across desktop (`1024x768` to `1920x1080`), phone (`320x844`, `390x844`, `430x932`), and landscape (`844x390`).
  - Student portrait map takeover (`.student-presenter` replaces `.explainer` at the project step).
  - Explicit Guide confirmation wording (`ให้ฉันเปิดหน้านี้ให้เลยไหม?`) on target actions without auto-navigation.
  - Phase 3 Guide vs. Explainer rivalry (`data-scene="rivalry"`, `.explainer__rivalry`), random race winner on each project click (`data-winner="guide" | "explainer"`), wider 2D Guide wandering avoiding medals/UI obstacles, facing-direction fix (`faceSignForDelta`), talking micro-interaction (`data-talking`), and 14 de-fringed transparent RGBA sprites (`pet`, `walk1`, `walk2`, `talk`, `back`, `jump`, `argue`).
- **Controls, Narration & Data Scope (`R2`):**
  - Removed zoom, reset, rotate, pause, mute, and narration DOM controls from `/` while preserving `.credits-link` (`/credits.txt` CC BY attribution) and `/?view=explorer` controls.
  - Deleted `useNarration.ts` (`0` `speechSynthesis` references).
  - Locked `provinceNarration` strictly to catalog data (province name, recipient count, visible award titles); preserved server-only/fictional-only Gemini boundary.
- **Security, Contrast & Findings (`R3`):**
  - Shipped strict `Content-Security-Policy` in `vercel.json` and mirrored in `vite.config.ts` preview server (`0` CSP violations across Three.js, WebAudio, media, and `/api/guide`).
  - Fixed `F-01` (`readBoundedReply` 32 KiB streaming cap), `F-02` (slide boundary guards), `P-06`, `M-02` (single render per drag frame), and WCAG AA contrast across `/` and `/?view=explorer`.
- **Checks:** `npm test` **154/154**, `typecheck`, `typecheck:browser`, `build`, `build:review`, and serial Playwright preview suite pass. External production dependencies (Hamsterhub member auth, real opted-in student records/PDPA, real URLs, brand tokens, provider spend caps) remain separate per `R4`.

## Previous checkpoint: whole-project Claude Code polish handoff

2026-11-20. User requests a Claude Code handoff covering **ALL / EVERYTHING**
in this repository: product surfaces, interactions, quality and release readiness.
Polish is now requested; earlier deferral is superseded. Documentation prepared
on `codex/claude-polish-handoff`, application baseline unchanged from `6228e9f`.
No Claude implementation session, application edits or deployment started here.

- [Project overview and intended output](Docs/agents/handoffs/2026-11-20-claude-project-overview.md).
- [Complete polish scope, coverage ledger, execution waves and startup prompt](Docs/agents/handoffs/2026-11-20-claude-polish.md).
- [Model routing by task](Docs/agents/handoffs/2026-11-20-claude-model-routing.md).

[CLAUDE.md](CLAUDE.md) is the short entry point. Claude Code is the next polish
lead. Inspect Git state before proceeding; preserve accepted Phase 3 behavior.
Production host/member/data contracts remain unresolved and separate. Historical
release authorization does not grant a new deployment. This is a documentation
checkpoint; application test results below are historical, not rerun here.

## Previous checkpoint: Phase 3 review deployed — Task 050

2026-11-20. User authorized publishing the complete Phase 3 review and configuring
Gemini on Vercel. Stable public URL: https://hamsterhub-map-review.vercel.app.
Merged without squashing to main at `e3b9ed0`; tree matched checked codex/phase-3.
Git production deployment `dpl_54EEFSyTWmbafF1BGmPBTtyh7YCb` is READY. Current
branch main; later documentation/graph commits keep application source unchanged.
Read [Task050](Docs/agents/tasks/050-phase-3-review-release.md) for exact evidence.

Gemini key is configured as a Vercel Secret for production/preview and remains
outside Git/browser output. Server catalogs include fictional records only;
approved owner review fields/media remain separate. Startup failure in the first
preview exposed extensionless ESM imports; f3d3bf1 fixes the server dependency
closure using explicit .js specifiers. Cloud invalid-method/API startup and real
Gemini replies now pass. Temporary diagnostics were removed. One initial cloud
provider failure was followed by successful bounded checks; no automatic retry.
No root CLI upload was performed, because its dry-run inventory included ignored
private files; publishing used Git tracked source only.

135 units, browser TypeScript, normal and remote-source review builds pass. Both
build outputs contain zero configured-key matches. Local and public checks at
320/390/1440x844 reach all seven people and competition entries, bubble/View all
return, keyboard Back/focus and directory, with no page errors. A real public
browser chat request returns200 and opens fictional LeafLoop through a canonical
result button; controlled chat failure leaves manual browsing usable. Live
empty-map exit, actual context loss/restoration and WebGL-free directory pass.
Root and all six review asset routes return200/noindex; review assets are
no-store; invalid API method returns405/no-store. The390px project capture was
inspected. Browser checks serial, installed Edge/Playwright CLI, tracing off.
Physical phones/GPU/FPS and provider quota administration remain separate.

Rollback target: prior READY `dpl_5mCQ636KPAAvrxYdrEHpBvtHU76z` (main65196c9).
Owner media source/snapshot unchanged. Task050 includes rollback instructions and
ignored evidence location. At that checkpoint, next major work was Hamsterhub
host/member integration, protected opted-in data and real Profile/project links,
with polish deferred. The current handoff above supersedes that priority.
Do not claim production membership from this public review.

## Previous checkpoint: Task 049 Gemini Guide implemented locally

2026-11-20. User defers polish and chooses Google Gemini, Vercel server function
with local development support, and fictional sample records only. Sole writer
Codex on `codex/phase-3`, base `0256359`. Read [Task 049](Docs/agents/tasks/049-gemini-guide.md).

`POST /api/guide` uses bounded validated questions/history and a server-owned
fictional catalog. No owner fixture input, media or client catalog reaches Gemini.
Structured replies are validated; plain-text chat offers only visible explicit
province/student/project result buttons. Clicking enters the existing directory
journey. Chat supports Stop, minimize cancellation, clear, retry and manual
fallback; scripted help and opt-in device narration remain. Credentials stay
server-only. Dev/preview middleware and the review export's ESM server bundle
are included. No new SDK dependency or deployment.

135 units, both typechecks and both builds pass. All **15 distinct affected
compiled Edge checks pass** across final normal-build 14 and explicit review-build
1 runs. These cover 320/390/1440 chat, invalid targets/plain text, bounded history,
canonical click navigation, Back/focus, failures/Stop/minimize/clear, characters,
narration and actual graphics-context restoration. Review check uses a synthetic
owner stand-in to verify owner-context/action exclusion and fictional navigation.
Initial test failures and the real Stop-button resubmission fix are recorded in
Task 049. Captures inspected. Browser jobs serial, one worker, tracing off.
Source review found no actionable findings. Local API method/invalid input and
compiled server missing-key smoke checks pass.

**Live connection verified (2026-11-20):** after the user explicitly asked Codex
to configure the supplied credential, it was saved only in ignored `.env.local`,
without printing its value. One bounded fictional-only request through the actual
handler reached Gemini: provider HTTP 200 and application HTTP 200. The Thai
answer described Hamster Maze and returned validated Bangkok, Mock Mali and
Hamster Maze navigation targets. This verifies the configured Interactions API
and structured reply parsing; browser result navigation was checked separately
with controlled responses. No owner records/media were sent. The key remains
server-only and outside Git. Actual Vercel execution/deployment, provider quota
setup and physical phone/GPU acceptance remain open. Nothing was deployed.
Current builds retain the scene chunk warning and warn about extensionless
imports for Vite's planned future native loader.

Targeted Graphify refresh follows this checkpoint; see graph report for its
actual coverage and limitations. Earlier checkpoints below are historical.

## Previous checkpoint: Task 048 laurel enamel awards complete locally

2026-11-20. The user requested the next build and selected **B — Laurel enamel**
from the original comparison, now saved as reference 08. Sole writer Codex on
`codex/phase-3`, base `03c8bc8`. Original raised beveled laurel leaves surround
smaller central stars on gold/silver/bronze medal fronts and the curved trophy
seal. Deeper medal rims retain navy enamel, original sample assignments and
the existing compact envelope. Award/companion motion, bubble lifecycle, camera,
Guide/Explainer and narration behavior remain.

Stored triangles rise **7,024 → 7,776** (+10.7%, below the existing 8,000 limit).
Four unique geometries and eight instanced batches remain. A four-style isolated
render retains eight calls; rendered triangles rise **12,832 → 14,096** (+9.9%).
This is geometry/render cost, not physical-device FPS. Matching before/after
renders and final map captures were inspected. No assets/dependencies downloaded.

128 units, both typechecks and normal/review builds pass. The new wreath raycast
fails on the old models and passes on the new leaves. All 45 distinct affected
compiled Edge checks pass across the broad 43/45 run and corrected landing rerun.
The two original failures were Guide text antialiasing in an obsolete screenshot
mask; the mask now hides characters for land-only comparison. Award hover/orbit,
landing, pause/reduced motion, bubbles, feedback, narration and actual context
recovery/fallback pass. Compiled seven-profile review passes at 320/390/1440 for
all seven people/four provinces, explicit media, controls/focus and actual context
restoration, with zero page errors. Jobs were serial, one worker/tracing off.
Read-only source review reports no actionable findings.

Application commit: `af766e6`. Targeted Graphify refresh validates **540 nodes,
1,426 original relationship records and 31 communities**, with 87 AST sources
and 96 hashed sources. Task 048 has full semantic coverage (62/62 lines); saved
comparison 08 was fully viewed and its concept/B-selection distinction recorded.
There are no missing/dangling endpoints or exact duplicate edges. Historical
semantics and original parallel records remain; parser/analysis limitations and
unknown extraction cost are documented in the graph report.

Evidence: `%TEMP%/hamsterhub-phase3-048/`, `%TEMP%/hamsterhub-048-*.log` and ignored
test-results. Physical-phone/GPU/FPS and subjective appearance acceptance remain
open; existing large scene-chunk warning remains. No deployment assigned/performed.
Live conversational Guide is the next planned P3.5 milestone and still requires
provider/server/credentials/cost/content/navigation decisions. See Task 048.

## Previous checkpoint: Tasks 046/047 implemented locally

2026-11-20. Sole writer Codex on `codex/phase-3`. User approved the saved Thai
scripts for this demo and automatic continuation from View all feedback to P3.3.
View all now shares pop/form audio and soap-film VFX, with finite formation and
cleanup on student selection/full exit. Original temporary hamster SVGs distinguish
Guide's bounded local navigation help from Explainer's interruptible travel.
Explainer accompanies province/student lists and yields to identity at detail.
Opt-in local Thai speech retains visible text fallback; Skip/Back/Close/Reset,
mute, pause and hidden tabs stop stale speech without replay on resume.
No microphone, live conversational AI, cloud voice or deployment is introduced.

127 units, both typechecks, normal and explicit seven-profile review builds pass.
Final compiled Edge checks pass all nine character scenarios and both View all
scenarios (11 distinct checks); jobs run sequentially with one worker/tracing off.
The preceding broad run passed 50 checks and exposed a travel failure,
subsequently fixed and rerun. Source review findings for stale formation, fallback,
current-person/province navigation and interrupted transforms are fixed; final
read-only review reports no actionable findings. Desktop and 320px captures
inspected; phone caption now clears the student name. The compiled seven-profile
review passes at 320/390/1440 for all seven people across four provinces, pointer
controls, explicit media, nested focus and actual context restoration, with zero
page errors. The standalone review now waits for full exit before directory entry.
Targeted Graphify refresh passes: 526 nodes, 1,396 preserved relationship records,
31 communities, 87 AST sources and 96 hashed sources. Both task packets have
complete semantic coverage (046: 27/27 lines; 047: 53/53). No missing/dangling
endpoints or exact duplicate edges. Historical semantics remain; CSS uses a
verified file boundary node, with existing parser limitations in the graph report.

Evidence: `%TEMP%/hamsterhub-047-*`, `%TEMP%/hamsterhub-046-interruption-final.log`,
`%TEMP%/hamsterhub-phase3-047/` and ignored test-results. Physical phones/GPU/FPS,
actual Thai device voices/pronunciation and subjective acceptance remain open.
Existing scene-chunk warning remains. Next P3.4 award artwork requires a bounded
visual option agreement; live AI remains P3.5. No further implementation assigned.

## Previous checkpoint: Task 045 competition presentations complete locally

2026-11-20, Asia/Bangkok. Sole writer Codex on `codex/phase-3`, following
Task 044 commit `88cc921`. The user confirmed the same glossy finish for every
bubble with differing sizes retained, then authorized the next P3.2 milestone.
Task 044 is complete locally: shared thought-dot/transient/portrait/logo/See all
film, including contrast fallback; its material browser check, 119 units,
typechecks and build passed. No deployment is assigned or performed.

Task 045 replaces the temporary featured-project card with a student's manually
ordered competition list and selected competition/project presentation. Explicit
demo associations carry priority, own project ID, ordered image slides/alt text
and optional PDF. Missing, stale, cross-student or conflicting associations stay
empty. The review export retains supplied owner curation, including multiple
competitions, without inferring links from old preview thumbnails/PDF metadata.
Fictional fixtures explicitly demonstrate multiple projects, ordered slides,
single/zero slides, PDF-only and unsafe/broken media.

The existing shell, bubble pop/morph/re-form, peers, recall, camera and sound
remain. Detail Back/Escape restores its competition button and list scroll,
then its visible source row/bubble. Wide detail stages the student beside the
panel; phones retain one sheet with bottom controls clear. Full Close/empty-map
exit and graphics recovery retain their existing behavior. Characters/narration
remain P3.3; script wording is still unapproved.

Latest checks: **125 units**, browser TypeScript and normal/review builds pass;
normal build also runs the application TypeScript build. The first affected
compiled Edge run passed 49/52. One obsolete project assertion and a native
disabled-slide focus bug caused the three failures. The assertion is updated;
slide controls now retain focus using aria-disabled and clamped handlers. Source
review also found a shell-animation focus race and scroll-restoration ordering;
both are fixed. The final affected compiled Edge run passes **30/30**, including
rapid competition selection during the opening morph, slide failures and boundary
focus, nested Back, peers, full Close/background exit and actual context recovery
and timeout. All **55 distinct affected checks** pass across these runs. Browser
jobs were sequential in installed Edge with one worker and tracing off.

The compiled seven-profile review passes at **320/390/1440 × 844** for all seven
people across four provinces, explicit project/media isolation, owner empty links
when uncurated, pointer controls, nested focus and actual context restoration.
Zero page errors; normal/review captures inspected. Independent final source
review reports no unresolved actionable findings; designated lead acceptance
remains open. Application changes are committed at `a4387d6`.

Graphify now records **483 nodes, 1,287 original relationship records and 23
communities**, with 80 current AST sources and 86 verified source hashes. Both
task packets have full semantic coverage (044: 22/22 lines; 045: 92/92). Independent
validation finds no duplicate node IDs, missing/dangling endpoints or hash drift.
Original parallel records remain in JSON; undirected analysis collapses 56 and
retains the existing self-loop. Older document/image semantics remain historical.
One same-name TypeScript type/function shares an AST identifier; 25 files retain
file-only nodes. Token usage/cost is unknown. See
[graph report](graphify-out/GRAPH_REPORT.md) and `graphify-out/task045-*` audits.

Evidence: `%TEMP%/hamsterhub-045-*`, `%TEMP%/hamsterhub-phase3-045/`, and ignored
`test-results/`. Physical-phone/GPU/FPS, subjective visual acceptance and the
existing large scene-chunk warning remain. Preserve owner inputs/media outside
Git. Next milestone is P3.3 characters/narration, with Thai script wording still
requiring review. Do not start characters or deploy without the next scope.

## Previous checkpoint: Task 043 award navigation and orbit correction

2026-11-20, Asia/Bangkok. Sole writer Codex on `codex/phase-3`, base `4d4f28b`.
View all Close on the map returns to award bubbles with See all focused and the
camera retained. The complete visible award/bubble composition is centered on
wide screens using the actual recipient count. Horizontal and vertical orbit
now adjust tilt under existing safe limits; no pan and bounded zoom remain.
Empty-map clicks/taps exit the full award journey through existing card/recall
animations and restore the saved overview, including tilt/zoom. Drags and
pinches keep discovery open. Directory/fallback Close retains its invoker return.
No deployment is assigned or performed.

Verification: **119 unit tests**, both typechecks and normal/hosted-source
review builds pass. Nine pre-fix browser failures reproduced the requested
corrections. The broad affected run passed 35 checks and found three stale
list-Close assertions; the corrected final affected suite passes **12/12**,
including a phone tap closing an animated project and restoring an adjusted
overview. All **39 distinct affected checks** pass across those runs, with
unchanged orbit, bubble lifecycle and recovery checks included. Sequential
installed Edge, one worker, tracing off.

The compiled seven-profile review passes at 320/390/1440 × 844: pointer Close
to bubbles, empty-map exit, accessible controls, all profiles/media/PDF isolation,
focus and actual context loss/restoration, with zero page errors. Overview
clustering restores focus to the containing cluster when its individual medal
is no longer rendered. Captures were inspected. Source review found no
unresolved actionable defect; designated lead acceptance remains open.

Evidence: `%TEMP%/hamsterhub-phase3-043/` and ignored `test-results/`.
Physical-phone/GPU/FPS, subjective visual acceptance and the existing large
scene-chunk warning remain. See
[Task 043](Docs/agents/tasks/043-award-navigation-and-orbit.md).
Application commit: `4d8cd1a`. Graphify now records 453 nodes, 1,204 preserved
relationships and 20 named communities, with current AST for 75 code files and
complete Task 043 semantic coverage. All 76 recorded source hashes match; there
are no missing/dangling endpoints or duplicate node IDs. The existing recursive
test-helper self-link and 69 parallel endpoint relations remain explicit in JSON
and collapse only during simple-graph analysis. Other document/image semantics
remain historical, some files have file-only AST extraction, and the browser
tsconfig BOM remains unsupported by the extractor despite passing TypeScript
checks. Token usage/cost is unknown. See
[graph report](graphify-out/GRAPH_REPORT.md) and `graphify-out/task043-*`.
Next: review these corrections, then continue the competition/presentation
slice before characters/narration.

## Previous checkpoint: Task 042 reference bubble composition

2026-11-20, Asia/Bangkok. Sole writer Codex on `codex/phase-3`, base `b6c5be9`.
The user supplied the seventh reference and requested that composition. The
award now focuses left; up to four varied portrait bubbles sit to its right,
with thought dots and a circular See all below. The black reference circles
are placeholders; soap-film material, supplied portraits/fallbacks and nicknames
remain. See all opens the complete deduplicated province list, retaining access
to overflow recipients and the boss's list journey. No deployment is assigned.

The existing pop/morph, peer spread, re-formation, recall, optional sound,
saved overview return, keyboard and recovery paths are reused. A source review
identified overlap at 320/390 × 480; failing pure regressions reproduced it.
A compact two-row portrait arrangement fixes those cases. Very short views
below roughly 435px height and tiny landscape layouts remain limited; physical
phone/GPU/FPS and subjective visual acceptance remain open.

Verification: 118 unit tests, both typechecks and normal/hosted-source
review builds pass. The first affected browser run had one Edge process crash;
its isolated retry passed. The fresh final affected run passes **38/38**.
The compiled seven-profile review passes at 320/390/1440: all seven reachable,
individual media/PDF isolation, pointer controls, keyboard focus and actual
context restoration, with zero page errors. Captures were inspected. Source
re-review found no new blocking regression. The existing large scene-chunk
warning remains. Evidence is outside Git in
`%TEMP%/hamsterhub-phase3-042/`; private inputs/media stay excluded.

Application change is committed at `77cbbda`. Graphify now records 430 nodes,
1,170 preserved relationships and 19 communities, with current AST for 67 code
files and complete Task 042/reference-image semantics. No missing/dangling
endpoints. Its existing recursive-helper self-link and 69 parallel endpoint
relations remain explicit in JSON; simple-graph analysis collapses parallel
relations. Twenty files have file-only extraction; the extractor still cannot
parse the browser tsconfig's BOM, while both actual typechecks pass. Other
document semantics remain historical, and host token cost is unknown. See
[graph report](graphify-out/GRAPH_REPORT.md) and `task042-*` provenance/validation.

Next: continue the competition/presentation slice before characters/narration.
See [Task 042](Docs/agents/tasks/042-reference-bubble-composition.md).

## Previous checkpoint: Task 041 bubbles-first restoration

2026-11-20, Asia/Bangkok. Sole writer Codex on `codex/phase-3`, base `aa56a58`.
The user explicitly requested bubble effects/award zoom back, then confirmed
**bubbles first; province list via View all**. This supersedes Task 040's immediate
province panel and no-selection-camera-travel choices. No publishing is assigned.

Task 041 reconnects the preserved AwardDiscovery/motion/audio flow, using the
Task 040 province recipient union. Medal selection temporarily focuses the award;
up to five portraits float around it. View all always opens the sketched province
list. Directory/fallback opens that list directly. The intermediate featured
project preview returns to its source bubble/row; list Back returns to bubbles;
Close recalls bubbles and restores the first saved overview. Reset returns home.
Fixed tilt/no free pan/1–2.5 zoom and overview rotation remain. Pop/morph, peer
spread, re-formation, recall and sound/mute reuse existing helpers.

Verification: **115 units**, both typechecks and normal/hosted-source review
builds pass. Initial full compiled browser run: 57/61, with subsequent layout and
outdated-test corrections. **Final affected compiled run: 33/33** including actual
context loss during animated return, interruption by a peer, keyboard Close,
province switching and Reset during recall. All seven-profile compiled review
checks pass at 320/390/1440: all seven reachable, correct media/PDF isolation,
controls/focus and actual context restoration, with zero page errors.

Independent source review found three P2 issues: pending exit inherited after
peer switching, mid-return context loss and keyboard Close animation inconsistency.
All are fixed; re-review reports no unresolved actionable defects. Designated
lead acceptance, physical-device/FPS and subjective visual acceptance remain open.
The existing large scene-chunk warning remains. Application changes are saved
at `9e25974`. Graphify is refreshed: 407 nodes, 1,136 preserved relationships,
19 communities, current AST for 66 code files and the complete Task 041 packet.
No missing/dangling endpoints; its one self-link is the existing recursive test
helper. Parallel relations stay in JSON and collapse only for simple-graph
community analysis. Nineteen code files have file-only extraction; the extractor
cannot parse browser tsconfig's existing BOM, while actual typechecks pass.
Other document semantics remain historical. See
[graph report](graphify-out/GRAPH_REPORT.md) and `task041-*` provenance/validation
artifacts. Private inputs/media, build/test output and screenshots are excluded.

Next slice remains the competition list/presentation journey with explicit
student-project-media associations, followed by characters/narration. Thai script
wording remains unapproved; physical phone/GPU/FPS and visual acceptance are open.
See [Task 041](Docs/agents/tasks/041-bubbles-first-province-journey.md) and
[Phase 3 plan](Docs/01-discovery/phase-3-plan.md). Verification artifacts are outside
Git in `%TEMP%/hamsterhub-phase3-041/`. Private input/media remain excluded.

## Previous checkpoint: Task 040 complete locally

2026-11-20, Asia/Bangkok. Codex is the sole writer on `codex/phase-3`, base
`121a217`. The user instructed implementation after agreeing the milestone.
No push, merge or deployment is assigned; the existing public review is unchanged.

Implemented fixed-center preview rotation, fixed tilt, no pan and bounded 1–2.5
zoom. Medals highlight/open their province without camera travel. Rotation,
zoom and resize keep discovery open; Back preserves angle/zoom; Reset clears
selection and restores home. Map/directory share deduplicated visible award
recipient rows, supplied names/portraits and explicit featured competition.
Unset/conflicting/stale choices remain unset. The local parser validates the
optional boolean choice; production student/project contracts are unchanged.

Rows open the existing featured-project preview temporarily. Back/Escape returns
preview → province → map/directory, restoring focus. Offscreen medal focus falls
back to the map region without camera movement. Close exits directly. Desktop
uses the glass panel; phone previews reserve controls and identity clearance.
Competition list/detail, slides, characters and narration remain pending.

Changed code: `src/data/{demoAwards,localPreview,provinceRecipients}*`,
`src/mock/discovery.ts`, `src/scene/ThailandMap.tsx`,
`src/ui/{MapPreview,AwardDirectory,ProvinceRecipients}*`, `src/ui/discovery.css`,
explicit unit registration and affected browser suites. Preserved explorer,
recovery internals, artwork, owner inputs/media and production contracts.

Verification: **114 unit tests**, both typechecks and normal/hosted-source review
builds pass. The full compiled normal browser suite passed **50/50** before final
layout fixes; final affected discovery/camera/recovery checks passed **18/18**,
plus the combined directory filter/unsafe-link check. After the final timeout
focus correction, all 13 affected discovery/recovery checks passed. Sequential installed Edge,
one worker, tracing off. The explicit `.review-build` served on port 4175 passes
all seven profiles at 320/390/1440 × 844: four Bangkok recipients, each profile
reachable once, correct media/PDF isolation, pointer controls, keyboard focus,
rotation and actual context loss/restoration. Zero page errors. Captures inspected;
evidence/scripts remain in `%TEMP%/hamsterhub-phase3-040/` outside Git.

Self-review fixed hidden/covered map controls, offscreen focus loss and phone
identity overlap. No independent lead review is claimed. The existing scene
chunk warning remains. Physical-phone/GPU/FPS and subjective acceptance are open.
Graphify records a targeted Task 040 update over its historical graph; private
inputs, build output, dependencies and verification captures are excluded.
It contains 394 nodes/1,101 relationships/13 communities with no dangling
endpoints. Its sole self-link is the recursive permutations test helper;
file-only test nodes and browser-tsconfig BOM parsing limit AST detail.

Next concrete action: review this milestone, then define the bounded P3.2
competition/detail packet with explicit student-project-media associations.
Continue from [Task 040](Docs/agents/tasks/040-phase-3-province-entry.md),
[the Phase 3 plan](Docs/01-discovery/phase-3-plan.md) and current source. P3.3
character/narration work follows; Thai wording review remains open. No workers
or preview servers are intentionally left running.

## Previous checkpoint: resumed Phase 3 planning

Resumed from clean main `65196c9` on 2026-11-20. No Phase 3 application edits,
implementation branch, worker, browser run or deployment has started. This
checkpoint changes planning documents only; verify current Git state at execution.

Confirmed in the resumed interview:

- Medal-only province entry; highlight/open without automatic camera movement.
  Fixed Thailand rotation center, horizontal drag, fixed tilt, bounded zoom,
  no pan. Back preserves angle/zoom; Reset closes discovery and restores home.
- Ordered image slides with previous/next arrows, plus Open PDF when supplied.
  Each student's competition entry explicitly references its project/media;
  absent/stale associations show an empty state rather than inferred linkage.
- Draft Thai scripts for review; user-enabled device Thai speech where available,
  with visible text fallback. [Draft wording](Docs/01-discovery/phase-3-narration-draft.md)
  is written but not approved or implemented.
- Back/Escape: project → competitions → province recipients → map. Close exits
  directly. Desktop follows the sketches; phones use one bottom sheet with a
  compact character/identity header. Student replaces Explainer only at detail.

The [Phase 3 plan](Docs/01-discovery/phase-3-plan.md) incorporates these answers.
[Task 040](Docs/agents/tasks/040-phase-3-province-entry.md) is the agreed/planned first
implementation milestone: fixed-center controls plus province recipient panel,
with existing featured-project preview retained temporarily. Its exact write set,
tests and exclusions are written and reserved for sole writer Codex. The user
explicitly agreed scope without starting implementation. **Next action: implement
Task 040 when instructed, using the accepted packet; no repeat scope questions
are needed.** Complete P3.1–P3.3 remains the next review target. Thai script wording
still needs review before the later character slice and does not block Task 040.

Documentation validation: all 208 local links across the nine changed/new
documents resolve; `git diff --check` passes. No source, tests, scripts or build
configuration changed. Application checks are not rerun for prose.

## Previous checkpoint: Phase 3 session handoff

The user is starting a new session for Phase 3. Read the
[entry handoff](Docs/agents/handoffs/2026-11-20-phase-3.md),
[draft milestone plan](Docs/01-discovery/phase-3-plan.md) and
[saved reference sketches](Docs/01-discovery/phase-3-references/README.md).
These preserve accepted answers and the remaining dependent decisions; Phase 3
application implementation has not started. Resume scope/milestone agreement,
not the completed recovery task or the full interview from scratch.

Baseline before this documentation handoff: clean/pushed main `1d18c05`, app
merge `0f2fd35` from `018b5b5`. Latest checked Vercel deployment
`dpl_4yRWf2uHF35VZjRUJDxF9FNUsxsJ` is READY from main/1d18c05; application
tree matches the verified merge. No preview server/implementation worker is
left running. This handoff changes docs/reference copies only; application
checks below remain dated evidence for the unchanged application.

Handoff validation: 197 local documentation links resolve; six reference images
match their original attachment hashes; `git diff --check` passes and the app/
build/test configuration is unchanged. Application tests were not rerun for
this documentation-only checkpoint.

## Previous checkpoint: map failure recovery (Task 039)

The user prioritizes the random map-unavailable bug while answering Phase 3
questions, and explicitly requests pushing the fix so Vercel updates for a
meeting. Sole writer Codex on `codex/map-failure-recovery`, base main `2b9cc90`.
No camera/province/mascot/medal redesign belongs to this bug-fix task.

Actual WEBGL_lose_context reproduces the old permanent fallback: immediate
unmount prevented restoration. One compiled-production geometry 503 also
permanently removed the map; dev StrictMode's second request masked it. Neither
is confirmed as the original random trigger. The fix retains the renderer and
open discovery while lost, suspends render/award/camera work, and redraws on
restoration. An eight-second timeout offers the directory; a keyboard retry
remounts the scene, or reloads the page for a failed cached lazy-module import.
Geometry gets one automatic retry with stale-load abort. Only a bounded failure
category is logged; supplied data/media and existing controls/art are unchanged.

109 unit tests, both typechecks, normal and remote-source review builds pass.
All seven final recovery browser checks pass, covering actual loss/restoration/
render resumption, closing discovery while lost, timeout/retry, failed init/module
retry, transient/permanent geometry and six map/list cycles. The close-while-lost
check exposed a stuck moving flag; camera changes now settle without rendering
while the context is unavailable. Thirteen existing failure,
peer-switching and recall browser checks pass. Compiled seven-profile review
checks pass at 390/1440 with actual recovery, retained profiles/direct switching,
three map/list cycles each and geometry/context timeout retries; zero page errors
and zero console errors before deliberate request faults. Captures inspected.
Merged through main at `0f2fd35` from `018b5b5`; the checked feature and merge
trees match and main is pushed. Vercel Git deployment
`dpl_Cvjsivib1pTrVUMdsk5RsGwfJ7g3` is READY from main/0f2fd35 at
https://hamsterhub-map-review.vercel.app. Live checks pass at 390/1440 for actual
context recovery, retained profiles/direct switching, three map/list cycles each,
transient geometry and persistent geometry/context timeout retries. Zero page
errors and zero console errors before deliberate request faults; deployed
capture inspected. Evidence is outside Git at
`%TEMP%/hamsterhub-recovery-039/`. Physical-device/GPU acceptance and the original
random trigger remain open. The Phase 3 interview remains pending; latest
answers/sketches and remaining questions are recorded in the
[planning checkpoint](Docs/agents/handoffs/2026-11-20-phase-3-planning.md).
See [Task 039](Docs/agents/tasks/039-map-failure-recovery.md).

## Previous checkpoint: visible peers beside an open profile (Task 038)

User correction on 2026-11-20; sole writer Codex on
`codex/profile-bubble-spread`, base main `e8b88ae`. Other student bubbles now
push clear of the card/identity/name/logo and remain visible/clickable. Phones
use an upper row with at least 44px targets; wider screens choose nearby side
positions. Opening reserves phone space, while direct switching preserves the
first card placement. Each tap snapshots the actual face rectangle for pop/
portrait origin. Closing returns the peers; scaled recall still reaches the award.
Finite 260ms CSS transforms retarget smoothly, with immediate keyboard/reduced-
motion/hidden-tab handling and existing float/pause behavior. No new loop/library.

Both typechecks, 109 unit tests, normal and remote-source review builds pass.
Sequential compiled review checks pass 320/390/686/1440 × 844 for four Bangkok
recipients, peer/card/identity/logo clearance, direct switching, fixed placement,
close/focus/camera return, rapid switching, pause/reduced motion, keyboard
directory and dispatched WebGL fallback; zero page errors. Desktop/phone captures
were inspected. The full discovery regression passes 23/23; final focused push/
switching (4) and scaled recall (1) checks also pass after the label-fit change.
The final four-width review script passes, including measured recall centers
within 1px of the award. Recall geometry is measured through the group-close
callback: a real canvas pointer-down hands control to OrbitControls and clears
discovery immediately, so animated recall on that path is not claimed.
Evidence is outside Git at `%TEMP%/hamsterhub-review-038/`.
Merged without conflicts into `main` at `f08cb12` from `7042d57`; the merged
tree matches the checked feature tree. Pushed main; Vercel Git deployment
`dpl_9vfwQWTvCNED7rdwkohEN6YStpiu` is READY from main/f08cb12 at
https://hamsterhub-map-review.vercel.app. The same sequential live checks pass
at 320/390/686/1440 × 844, including clearance, direct/rapid switching, fixed
card placement, return/focus/camera, pause/reduced motion, keyboard directory,
dispatched WebGL failure and group-callback recall; zero page errors. Deployed
capture inspected. Card/data/media direction is preserved; ocean stays held.
Physical-phone/GPU and subjective motion acceptance remain open.
See [Task 038](Docs/agents/tasks/038-profile-bubble-spread.md).

## Previous checkpoint: seven-profile review and calmer cards (Tasks 036/037)

The user confirms six fictional additions to the approved owner review: three
additional Bangkok recipients and one each in Chiang Mai, Khon Kaen and Phuket.
Total seven profiles/four provinces, with four people under Bangkok's contest.
Codex is sole writer on `codex/seven-profile-review`, base `78afdfd`. The normal
three-student demo and source `main` are preserved. Ocean decoration stays held.

`createReviewScaleFixture` composes fictional identities and competition test
assignments at review build time. All six get original transparent portraits,
face crops and project covers, equal source dimensions and shared rendered
styles, with full Thai descriptions within 15 percent of the approved owner's
length. Per-student validated/filtered metadata prevents the owner portrait/PDF
from leaking into fictional cards. Fictional cards carry a visible Thai test
label and no invented destinations. Stable scrollbar space avoids thumbnail
width changing with content overflow; malformed presentation URLs omit the link.
Input/owner media stay ignored and are fetched from the existing static project.

The user also accepted Task 037: project-first title/image, quiet competition
metadata, darker glass, a four-line introduction with accessible read-more/less
and a separate presentation action. Portrait/image scale, hidden featured/
province rows and existing motion are preserved. Full description is retained; the expansion control stays in the fixed footer.

Both typechecks, 107/107 unit tests and final normal/remote-source review builds
pass. The first hosted-source attempt timed out; retry passed. Sequential
local Edge checks pass at 320/390/1440 × 844 for all seven identities,
unique decoded media/equal image scale, full text expansion/collapse/scroll,
four Bangkok bubbles, layered Escape/focus/camera return, pause/reduced motion,
background/reset, keyboard directory, dispatched WebGL failure and malformed
document fallback; zero page/console errors. Final mobile/desktop captures were
visually inspected. Normal demo exclusions and three markers pass. All 18 original PNGs match 345 × 345 faces,
690 × 780 transparent portraits and 1280 × 720 covers; all 12 cutouts have
transparent pixels, total 1,137,658 bytes. Browser evidence/scripts are outside
Git at `%TEMP%/hamsterhub-review-036/`. Merged without conflicts into `main` at `ca13ddb` from `31566cd`; merged
tree matches the checked feature tree and is pushed. Vercel Git deployment
`dpl_8TcugVKZmiv9rSVEoa6TRXTv854G` is READY from main/ca13ddb at
https://hamsterhub-map-review.vercel.app. Sequential live checks also pass at 320/390/1440 × 844 for all seven profiles,
media/scale, fixed text expansion, full scroll, Escape/focus/camera, directory,
background/reset, reduced motion, WebGL handler and malformed-document fallback;
zero page/console errors. Deployed noindex/no-store headers pass. Physical-phone/GPU/FPS, authentication/member API and production data
integration remain pending; the illustrated assets do not model photographic
network cost. See [Task 036](Docs/agents/tasks/036-seven-profile-review.md).

## Previous checkpoint: main deployment source and Phase 2 merge (Task 035)

The user requests `main` as the Vercel source before merging `codex/phase-2`.
The repository is now connected to `hamsterhub-map-review`; Vercel confirms
`link.productionBranch = main` before the merge. Cloud build uses
`npm run build:review`, output `.review-build`, Node 24 and `npm ci`.
`REVIEW_SOURCE_URL` fetches the six approved prepared files from the separate
static project https://hamsterhub-review-assets.vercel.app. This keeps owner
media outside Git and removes the cloud build's dependency on ignored local
files. HTTPS/failed-file validation and existing prepared-data checks apply.
Root `vercel.json` provides the same noindex/no-store headers for Git builds.

Remote-source review build, normal build, browser typecheck and 104/104 tests
pass. All six remote files match the review output by SHA-256. Sequential Edge
review at 320/390/1440 × 844 passes identity/images/PDF, complete description,
Escape/focus, directory and missing-data behavior; zero page errors. Normal
output exclusion and three fictional markers pass. Phase 2 is merged into
`main` at `dc971cf` with all 14 commits preserved through `ec8a230`; no conflicts,
and the merged tree matches the checked feature tree. `main` is pushed to origin
and is the current local branch. Vercel automatically deployed merge `dc971cf`
from Git branch `main` to production (`dpl_ACjDZob1s11bQmMYJbyxbpPPc6ME`); GitHub
Vercel status is successful. The stable public URL remains
https://hamsterhub-map-review.vercel.app. Sequential deployed checks at
320/390/1440 × 844 pass owner identity/images/logo/PDF, description scroll,
Escape/focus, directory and missing-data behavior with zero page errors.
Noindex/no-store headers and all asset routes pass. Physical-phone/FPS remains
open. Documentation updates on `main` also deploy automatically. See
[Task 035](Docs/agents/tasks/035-main-deployment-source.md).

## Previous checkpoint: public owner-record review preparation (Task 034)

The user identifies the supplied record as their own and authorizes a public
Vercel test including selected media. Task 034 adds `npm run build:review`:
validate one visible owner, export prepared fields/memberships, copy six
allowlisted files into ignored `.review-build/`, and generate Vercel noindex/
no-store headers. The compiled review selects that record at `/` and supports
the existing keyboard directory and PDF/card/logo flow. Normal build remains
the fictional demo with no supplied values/media. Input/media stay outside Git.

Review/normal builds, browser typecheck and 104/104 unit tests pass. Sequential
compiled Edge checks pass at 320/390/1440 × 844 for default record, identity,
images, PDF, description scroll, Escape/focus, keyboard directory and missing-data
state; zero page errors. Normal output exclusion and three default markers pass.
Evidence/scripts stay ignored in `.agent-exchanges/034-public-review/`.
Vercel CLI 66.2.0 is cached; the user completed device-flow sign-in. The compiled
snapshot is deployed to separate project `hamsterhub-map-review`, stable URL
https://hamsterhub-map-review.vercel.app, deployment
`dpl_HeU2uiz2Yx5RTUc3jaAbLhDybP6W`. The URL opens without a Vercel login; deployed
Edge checks repeat successfully at 320/390/1440 × 844 for identity/images/logo/PDF,
description scroll, Escape/focus, keyboard directory and missing-data handling;
zero page errors. All six assets return 200; noindex/no-store headers pass.
No Git integration, source upload, merge or production student integration.
Physical-phone/FPS acceptance remains open. Rebuild the review artifact and deploy
to the same Vercel project to update the stable link; deployment history supports
restoring a prior snapshot.
See [Task 034](Docs/agents/tasks/034-public-review-deployment.md).

## Previous checkpoint: beam-only award beacons (Task 033)

User correction on `codex/phase-2`, base `2278d55`, sole writer Codex. Removed
the ground glow pool and both spreading circles per beacon, their CSS animations,
and the two ground-plane basis projections. The gold beam retains its existing
award/land endpoints and camera/landing updates, with the same lifecycle cleanup.
No additional render loop. This removes work; FPS improvement is not measured.

`npm test`: **104/104 passed**. `npm run typecheck:browser` and `npm run build`
(including application typecheck) pass. Existing large scene-chunk warning
remains. Sequential Edge inspection at 320/390/1440 × 844 passes three beams,
zero ground-circle elements/animations, zoom/reset alignment, Profile opening,
layered Escape and saved camera return; zero page errors. Evidence/scripts stay
ignored in `.agent-exchanges/033-beam-only/`. Physical-phone and measured FPS
acceptance remain open.
See [Task 033](Docs/agents/tasks/033-beam-only-beacons.md).

## Previous checkpoint: shared bubble and scrollbar material (Task 032)

User correction on `codex/phase-2`, base `57ac4b2`, sole writer Codex. Removed the
competition bubble's pale fill override; it now inherits the exact transparent
soap-film background, rim, reflections, shadow and backdrop blur of recipient
bubbles. Logo containment and existing reveal/float/exit remain. Profile content
scrolling stays native with a 7px rounded mint thumb, subtle navy track, brighter
hover and no arrow buttons in Chromium/WebKit. Firefox gets thin colored native
scrollbars. No scene, data, markup or motion changes.

Production build (including application typecheck) passes. Main 274.56 kB /
85.53 kB gzip; scene 627.07 / 160.19; existing chunk warning. Actual-record Edge
checks at 320/390/1440 × 740 pass identical bubble material, transparent fill,
scrollbar styles, wheel/thumb-drag scrolling, content reaching the bottom and Escape focus
return with zero page errors. A 390 × 844 card fit its content exactly, correctly
showing no scrollbar; shorter-height checks exercise actual overflow.

Final scrollbar capture uses `ignoreDefaultArgs: ['--hide-scrollbars']` because
Playwright's headless default hides native scrollbars. Screenshots confirm the
visible mint thumb/navy track and transparent logo bubble. Evidence/scripts stay in
ignored `.agent-exchanges/032-bubble-scrollbar/`. Supplied media remain local.
Unit tests were not repeated for this CSS-only slice. Physical phone/Safari and
Firefox rendering remain unverified. Ocean work stays on hold. See
[Task 032](Docs/agents/tasks/032-bubble-and-scrollbar-material.md).

## Previous checkpoint: identity, logo bubble and gold beacon (Task 031)

User refinement on `codex/phase-2`, base `f9eb3c0`, sole writer Codex. Optional
`nickname`/`fullName` fields are prepared explicitly. Floating student bubbles
show only nickname (fallback: display name); expanded previews stack nickname
above full name. Accessible/search identity remains the supplied display name.
Optional award `logoUrl` renders in a soap-film bubble, revealing from behind
the card then floating beside it. Desktop uses available side space; phones
use the left shoulder, clearing the portrait, map controls and close target.
Closing retracts the logo behind the card. Existing pause, reduced-motion,
hidden-tab settling and interrupted exit are retained. No new dependency.

Preview ground spheres are hidden; a projected gold beam joins the award to
the ground with a soft gold pool and expanding rings. Existing camera/landing
draws project the beam and ground basis; CSS animates the rings without an
additional WebGL loop. Explorer pins are unchanged. Beacon DOM is disposed
with the scene. Supplied logo is already RGBA/transparent and remains local
with the other ignored media; the dev allowlist now serves six files.

Completed checks: **104/104** full unit run, application/browser typechecks and
production build. Actual-record Edge inspection at 320/390/1440 × 844 passes
nickname-only bubble label, stacked identity, image decode, logo bounds/clearance,
float/pause, gold aura/pause, layered Escape, focus and camera return. Zero page
errors. Stepped motion inspection passes behind-card reveal/retraction,
mid-animation reduced-motion/hidden settling and broken-logo title fallback.
The paused-frame inspection needed `Animation.finish()` at the endpoint to
resolve promises; application code did not change for that test correction.

Build scan confirms no supplied personal values/media; six allowlisted files
use `no-store`, direct ignored-folder routes remain blocked. Main 274.56 kB /
85.53 kB gzip; scene 627.07 / 160.19, existing chunk warning. Initial browser
readiness checks timed out on the busy host; 30s assertions then passed. The
in-app inspection service returned `service_info` timeout, so isolated Edge was
used. Browser teardown was interrupted after completed inspection reports.

Final production discovery **19/19 passed** (8.4m on busy host), including the
final nickname markup regression in the unit suite. Bounded camera inspection
also passes beacon zoom/reset projection, all three sample camera returns and
beacon disposal on WebGL fallback. Source-only staged privacy check passes.
Evidence/scripts are
ignored `.agent-exchanges/031-profile-beacon/`; actual records remain in ignored
`.local-preview/`. Review `http://127.0.0.1:5173/?fixture=local` after reload.
Physical phone/Safari and subjective appearance/motion acceptance remain open.
Ocean work stays on hold. See [Task 031](Docs/agents/tasks/031-profile-identity-and-beacon.md).

## Previous checkpoint: local student preview (Task 030)

User follow-up on `codex/phase-2`, base `081db98`, sole writer Codex. Both bubble
samples are approximately 3 dB quieter. `?fixture=local` loads one user-supplied
record/media from ignored `.local-preview/` through a development-only file
allowlist. Private filenames/data are not imported into source or public assets.
Direct requests into ignored data/evidence folders are blocked. Production has
no local endpoint and requests no local data. Default remains three fictional
students; group fixture remains eight.

The supplied original portrait is RGB with an opaque white background. Separate
local cutouts provide a face crop for the bubble and a transparent upper-body
portrait for the existing fade/glass card. Original preserved locally. The PDF
has one rendered slide and no embedded video; its image links accessibly to the
local PDF in a new tab. Nickname accompanies the full supplied display name,
province is the only location, the full Thai description scrolls, and no Profile
URL or prize rank is invented. Scene artwork now accepts explicit assignments
for independent IDs while preserving synthetic defaults and camera behavior.

Verification: **100/100 unit tests**, both typechecks and final production build
passed. Production discovery **19/19 passed**; two affected cases passed again
after the final local-label refinement. Sequential actual-record inspection
passed at **320/390/1440 × 844**: decoded images, card bounds, complete scrolling
description, valid PDF/new tab, bubble return, layered Escape/focus and saved
camera return. Directory keyboard/reduced motion and missing-local-data error
passed with **zero page/runtime errors**. The initial inspection sampled a
marker before landing settled; waiting for the existing settled state corrected
the camera assertion without application changes.

Boundary check: five allowlisted files served with `no-store`; original and
direct ignored-folder routes blocked; exact supplied personal values and media
absent from build; production local route shows unavailable without fetching
private data. Main 272.85 kB / 85.09 kB gzip; scene 625.81 / 159.77, existing chunk
warning. Evidence/scripts are ignored `.agent-exchanges/030-local-record/`.

Review: http://127.0.0.1:5173/?fixture=local . Personal files are local only and
will not follow a clone. Source/doc changes are committed separately from
these ignored files. Physical phone/Safari, subjective volume and cutout/motion
acceptance remain open. No deployment or production data integration. Ocean
decoration remains on hold. See [Task 030](Docs/agents/tasks/030-local-student-preview.md).

## Previous checkpoint: immediate bubble feedback (Task 029)

User refinement on `codex/phase-2`, base `b394d9c`, sole writer Codex. Formation
starts on the close action while the card exits, removing the previous 240ms
serial wait. One formation continues through card unmount; visible small bubbles
begin on its first frame. It retains focus, reduced-motion/hidden-tab settling,
interruptions and province recall. Cleanup guards against stale completion.

The pop sends eighteen droplets beyond the fitted card bounds and briefly holds
them before fading; four larger membrane fragments disperse above the card.
Phones redirect clipped trajectories above the card. Local CC0 water samples
replace oscillator sweeps, preloaded/decoded with trimmed leading silence,
quiet gain, mute and lifecycle cleanup. Missing/unready audio stays silent
without delaying interaction. Provenance: [audio notes](public/audio/README.md).

Verification: **96/96 unit tests**, both typechecks and build passed. Production
discovery **19/19 passed**; four affected cases passed after the final cleanup
refinement. Checks cover immediate formation while the closing shell is paused,
continuity through unmount, outside-card particles at 320/390/1440px, decoded
sample playback/mute with zero oscillator starts, missing audio, layered Escape,
hidden/reduced-motion cleanup, province recall, overflow and WebGL fallback.
Main: 270.92 kB / 84.60 kB gzip; scene unchanged at 625.72 / 159.74, existing warning.

Visual captures at 320/390/1440px show the wider splash and eight forming bubbles
during the first 80ms of card exit. Zero page errors, zero effects after Escape.
Ignored evidence: `.agent-exchanges/029-immediate-bubble-feedback/`. No scene or
camera edits; camera suite not repeated. Physical-phone/Safari, speakers/headphones
and subjective sound/motion acceptance remain open. No deployment. See
[Task 029](Docs/agents/tasks/029-immediate-bubble-feedback.md).

Ocean contour lines/light ripples were recommended, then the user explicitly
said "Wait, no, dont do it yet". **Ocean decoration is on hold**. Continue only
the requested bubble fixes; future ocean implementation needs renewed direction.

## Previous checkpoint: soap bubbles and inward formation (Task 028)

User refinement on `codex/phase-2`, base `92060f5`, sole writer Codex. Recipient
bubbles now have clear centers, pearly cyan/rose edges and curved reflections.
Fine soap droplets and membrane fragments replace the flat dot/ring pop.
Closing a preview gathers eight smaller outside bubbles into one membrane over
620ms, then reveals the face. The growing film and real face share the same rim
through the handoff; the redundant preview ring is removed. The frosted card,
optional local sound, province recall and saved camera return remain.

The home/Reset view keeps the reference's angle and centers the actual projected
land silhouette horizontally. A one-time mesh-vertex pass replaces the visual
left bias of the rotated bounding box; it adds no idle loop. Default remains
three fictional students, with eight only in the explicit group fixture.

Verification: **96/96 unit tests**, both typechecks and build passed. Production
discovery **15/15 passed**; **13 distinct camera/layout cases** passed across
sequential runs. Final formation/overflow/switching checks were rerun after
polish. Formation checks cover outside-to-center travel, delayed face reveal,
coincident handoff rims, reduced-motion/hidden-tab settling and Escape cleanup.
The interrupted-return test initially used centered Bangkok and failed its
intermediate displacement assertion; it now observes Chiang Mai with the same
thresholds and passes. All three awards restore their saved views; 320/390/1440px
layouts and sky starts pass. Scene: 625.72 kB / 159.74 kB gzip, existing warning.

Overview/group/card captures at 1910/1440/390/320px and stepped pop/formation
frames are in ignored `.agent-exchanges/028-soap-bubbles/`. Increased contrast
uses a solid bubble surface. No page errors in visual inspection. See
[Task 028](Docs/agents/tasks/028-soap-bubble-polish.md) for commands and evidence.
Next: user review at `http://127.0.0.1:5173/`. Physical-phone/Safari, real GPU/FPS,
screen-reader and subjective motion/sound acceptance remain open. No deployment.

## Previous checkpoint: frosted Profile card (Task 027)

User follow-up on `codex/phase-2`, base `3e3e691`, sole writer Codex. Removed the
visible `student-preview__featured` and `student-preview__province` rows. The
preview now has a borderless navy glass rectangle with 20px corners, a restrained
reflection and soft shadow. Static backdrop blur/saturation creates frost;
unsupported filters and transparency/contrast settings get solid readable
fallbacks. A bottom gradient mask blends both portrait images and fallback
silhouettes into the card. The finite morph reads the shared radius token.
Manual project selection, hidden award/project distinction, Profile link and
all Task 026 bubble/sound/recall/camera behavior remain.

Color Hunt palette HTML was retrieved (navy/lavender/green/neutral); only navy/
neutral material inspiration is applied. The browser connection timed out;
actual app inspection used isolated Edge after sequential browser checks.

Verification: three affected markup tests, both typechecks and build passed;
production discovery **14/14 passed**. Pointer-open captures at 320/390/1440px
confirmed zero border, 20px settled corners, frost and portrait fade. Increased
contrast switches to a solid surface. Normal/long-name/missing-image captures
visually inspected; ignored evidence in `.agent-exchanges/027-frosted-profile-card/`.
Full unit/camera suites were not repeated for this visual slice. See
[Task 027](Docs/agents/tasks/027-frosted-profile-card.md) for exact commands and limits.
Next: user visual review at `http://127.0.0.1:5173/`. Physical-phone/Safari,
OS reduced-transparency and GPU acceptance remain open. No merge/push/deployment.

## Previous checkpoint: bubble pop and award recall (Task 026)

Latest user reference supersedes the fixed circular preview portrait below.
On `codex/phase-2`, base `4195727`, Codex remains sole writer. Tapping a frosted
bubble pops it with brief ring/droplet VFX and a quiet local sound; it disappears
as an enlarged student portrait reveals above the project card. Name above,
gold award title, image, centered project title, Thai description and the single
bottom-left Profile link follow the sketch. Mobile controls clear long names.
Two original fictional SVG cutouts have no bubble rim; initials silhouettes
cover missing/broken portraits. Featured work remains explicitly distinguished.

Closing re-forms the source bubble with brief SFX/VFX. Province/background close
finishes an open preview first, then recalls all five visible bubbles into the
selected award before requesting the existing camera return. A bounded scene
background callback defers dismissal to React. Invoker focus stays outside inert
recall controls so Escape can finish it immediately. Manual takeover/reset,
hidden tabs, reduced motion, switching and disposal settle/cancel safely.
The visible sound toggle mutes synthesized effects; no new dependency.

Verification: **96 unit tests**, both typechecks and production build passed.
Production discovery **14/14 passed**; five camera cases passed across sequential
runs, **19 distinct browser cases** total. After the final recall-focus fix,
three affected discovery cases and interrupted camera return passed again.
Desktop/group/390px/320px captures inspected; ignored evidence is under
`.agent-exchanges/026-bubble-pop-and-return/`. Scene: 625.28 kB / 159.63 kB gzip,
with the existing chunk-size warning. See [Task 026](Docs/agents/tasks/026-bubble-pop-and-return.md)
and [verification](Docs/agents/exchanges/2026-11-19-bubble-pop-and-return.md).

Next: review the interactive result at `http://127.0.0.1:5173/` with the user;
record physical-phone and subjective sound/motion acceptance separately.
Real GPU/FPS, screen-reader, lead acceptance and production integration remain
open. No merge, push or deployment.

## Previous checkpoint: anchored glass profiles (Task 025)

The user's follow-up on `codex/phase-2`, base `1494357`, refines the discovery
UI using the second supplied sketch. Codex remains sole writer. The tapped
portrait now stays at exactly the same position/size while a rounded project
card expands behind it. Name above the face; portrait overlaps the card edge;
image precedes the centered English project title and Thai description. A low
portrait opens the card above it. Labels/card bounds adapt around the anchor.

Recipient bubbles use translucent frosted surfaces, clear rims/highlights and
stronger gentle two-axis CSS float. Thought dots stay between the award and
portrait edges with clearance for the float. Only selected/focused/hovered
bubbles pause locally; ambient pause, hidden tabs and reduced motion still
control the whole set. Other portraits keep floating in the background, with
their labels hidden while the project card is open.

Both large action buttons are removed. The sole action is an underlined
**ดูโปรไฟล์ ↗** text link at the bottom left, using the existing safe destination.
Project media is a preview; no fake video/play control was added from the sketch.
Close, Escape, focus, filtering, overflow, fallback and saved camera return remain.
No scene/data/dependency change. See
[Task 025](Docs/agents/tasks/025-anchored-glass-profiles.md) for current checks.

Verification: 96/96 unit tests, both typechecks and production build passed;
the nine affected markup/layout tests passed again after final layout changes.
The updated discovery suite passed 10/10 in sequential production-preview Edge.
After final glass/name/label CSS polish, all three affected motion/touch/320px
cases passed again. Desktop/group/390px/320px captures were visually inspected;
copies are in ignored `.agent-exchanges/025-anchored-glass-profiles/`.
Physical-phone/motion, real GPU/FPS, screen-reader, lead/user visual acceptance
and production integration remain open. No merge/deployment.

## Previous checkpoint: floating award recipients and project previews

Task 024 implements the user-approved Phase 2 on `codex/phase-2`, from base
`482fd2c`; award-data foundation: `3fcc486`. Codex is the sole writer.
The later user sketch supersedes the first side preview/mobile sheet proposal:
thought dots lead from an award to scattered floating portrait bubbles. Tapping
a face expands it into a rounded project card at its position; Back reverses
the transition. The same design fits phones. Named controls choose the award;
recipients belong to that award and province. Featured projects remain manually
chosen and are not asserted to have won that award.

Default: exactly three fictional students. `?fixture=group` provides eight
recipients, multiple awards and overflow; five bubbles are shown with every
student reachable through **ดูทั้งหมด**. `?view=recipients` opens the searchable,
province-filtered directory without WebGL. Geometry/WebGL/context-loss fallback
uses that directory and the same preview. Opted-out/missing records never enter
recipients or counts. Profile/project links remain synthetic placeholders.

Preserved: Phase 1 artwork, landing, orbit/pause, camera framing and saved return.
Escape closes preview first, then group; background dismisses all. Manual map
movement and reset clear discovery. Focus returns to the recipient/award.
CSS float pauses on hover/focus, selection, ambient pause and hidden tabs.
The finite WAAPI morph supports interrupted reversal; keyboard/reduced motion
settles immediately. No additional decorative JavaScript loop or dependency.

Verification on 2026-11-18: **94 unit tests**, both typechecks and production
build passed. **52 distinct browser cases** passed across sequential production
runs (10 discovery, 23 preview, 17 explorer, 2 fan-out). The final desktop
overflow-clearance CSS change was followed by four affected passing cases.
The prior explorer-filter/sample-zoom timeout scenarios passed in these runs.
Inspected desktop/mobile captures are under ignored
`.agent-exchanges/024-award-profile-discovery/`. Lazy scene: 625.20 kB raw /
159.61 kB gzip, with the existing chunk-size warning.

Physical-phone/GPU/FPS, screen-reader, user/boss visual acceptance, designated
lead review and production integration remain open. No merge or deployment.
Continue from [Task 024](Docs/agents/tasks/024-award-profile-discovery.md) and
its [verification record](Docs/agents/exchanges/2026-11-18-award-profile-discovery.md).
Next action: review the interactive bubble flow with the user and record actual
device acceptance separately. Do not revert to the superseded bottom-sheet flow.

## Previous checkpoint: Phase 1 integration / Phase 2 entry

Phase 1 is integrated into `main` by merge commit `944cf74`, preserving all 20
commits from `codex/award-return-view` through `6e03ead`. The continuation branch
is `codex/phase-2`, created from `main` after this documentation checkpoint.
Inspect local/upstream refs at startup. Earlier "no merge" statements below
describe the historical state when each task finished.

Start with the compact
[Phase 2 entry packet](Docs/agents/handoffs/2026-11-18-phase-2.md). It preserves
the accepted map/model/motion behavior, current Git/source pointers, exact
verification limits and the historical next-session prompt. Its original
undefined-scope statement is superseded by Task 024 above.

Latest application change: `96fc843`; Phase 1 handoff: `6e03ead`. The merge tree
exactly matches that verified source tree. All 82 unit tests passed before and
after merging; both typechecks and the production build passed before merging.
Browser checks were not repeated for this Git/documentation-only integration;
the two earlier timeout cases and acceptance gaps below remain open.
The final Playwright comparison at ignored
`.agent-exchanges/023-award-return/camera-return.png` was inspected: before and
after closing match, with the returned marker within 1px. No test/reviewer job
remains from the session. Physical-phone/motion and lead acceptance remain open.

## Previous checkpoint: return from any award to the prior view (2026-11-18)

Task 023 feature commit `96fc843` is on `codex/award-return-view`, base `7072393`,
with Codex as sole writer.
Opening any trophy/medal saves camera position, target and zoom. Escape or a
background click restores the view from before the first award opened; repeated
activation/switching keeps that origin. Background return uses the existing
240ms easing, while keyboard/reduced motion remains immediate. Interrupted
opening/closing preserves the origin until arrival. Manual pan/orbit/wheel,
reset and data replacement discard it.

All 82 unit tests, both typechecks and production build passed. Ten targeted
production-browser cases passed, including all three awards, actual background
input, smooth/interrupted travel, manual takeover and switching at 320/1440px.
Six additional explorer/layout cases passed; filtering and the older sample-zoom/
reset case reached the host's 45-second limit. Read-only source review
found no concrete correctness/lifecycle issues. Lazy scene: 624.81 kB raw /
159.44 kB gzip; existing chunk-size warning remains.

Computer Use reload/reconnect timed out; no new live inspection claim. Claude
review failed with `ECONNREFUSED`, not lead approval. Physical-phone/motion
acceptance remains open. No merge or deployment.
See [Task 023](Docs/agents/tasks/023-award-return-view.md) and the
[review record](Docs/agents/exchanges/2026-11-18-award-return-view.md).
Local preview: http://127.0.0.1:5173/ .

## Previous checkpoint: matching sculpted awards (2026-11-18)

Task 022 feature commit `4b20122` is on `codex/premium-award-models`, base `cd479b9`, with Codex as
sole writer. The user approved replacing the simpler awards with a matching
original set. Private remote remains unchanged; no merge or deployment.

- Trophy: rounded curved cup, rolled lip, shaped handles, navy star seal,
  rounded navy plinth and gold plaque. The seal follows the curved cup surface.
- Medals: beveled bodies, double rims, raised stars, navy enamel, solid modeled
  reverses and curved notched ribbon tails. Gold/silver/bronze share geometry.
- Four unique geometries store 7024 triangles; eight instanced batches remain.
  Geometry is disposed once per unique object. No external assets, textures,
  new dependencies or additional animation loops.
- The 15-degree lean, 280ms turns, floating mains, compact 3D orbits, mint
  provinces, 2.2s sky fall and province batching remain.

Final unit checks passed 82/82, including finite geometry/budget, front/back
enamel visibility and curved trophy-seal visibility. Application/browser
typechecks and build passed. Lazy scene: 624.62 kB raw / 159.36 kB gzip;
main bundle: 244.04 / 76.89. The existing chunk-size warning remains.
The production-preview run passed 18/18; it began before the last seal
refinement, and the final build completed during it. Final-build focused browser
checks passed 6/6: hover/turns, pause/reduced motion, selection and 320/390/1440px
layouts. Visual evidence is in the review below.
The explorer suite was not repeated for this model-only slice.

Final comparison and desktop overview/selected captures were refreshed and
inspected. Computer Use checked the existing narrow overview, selected trophy
and silver medal, then restored overview with motion playing. The tab remains
available, with no viewport override.

Read-only source review found and resolved an intersecting trophy seal; final
recheck found no concrete findings. Claude's bridge request timed out after four
minutes and predates the last refinements. Physical-phone/GPU/FPS, lead and
user/boss visual acceptance remain open.

See [Task 022](Docs/agents/tasks/022-premium-award-models.md),
[modeling notes](Docs/08-polish/award-models.md) and the
[review record](Docs/agents/exchanges/2026-11-18-premium-award-models.md).
Comparison/captures: ignored `.agent-exchanges/022-award-models/`.
Local preview: http://127.0.0.1:5173/ .

## Previous checkpoint: smooth award turns and batched landing (2026-11-18)

Tasks 020/021 feature commit `9bc32e9` is on `codex/award-hover-turn`, base `9055a24`, with Codex as
sole writer. Private remote remains unchanged; no merge or deployment.

- Preview text boxes and native tooltips are removed; accessible names and
  descriptions remain, and explorer labels are preserved.
- Resting awards lean 15 degrees. Hover/selection turns the province's whole
  award set toward the viewer over 280ms; return/interruption is smooth.
- Escape keeps an active hover. Group replacement/removal reconciles hover
  against current marker identity and current summary lead.
- Ambient pause freezes bob/orbits while finite interaction turns can finish.
  Reduced motion settles immediately; hidden/unmount lifecycle remains.
- Each province batches its islands into one indexed land mesh with two
  material groups and one segmented outline. All original triangles, holes,
  materials and independent province transforms remain.
- A 1440x900 headless Edge diagnostic reduced peak draw calls from 1464 to
  240 (about 84%), with unchanged peak 500792 triangles. Its single-run RAF
  p95 gap dropped from 284.7ms to 97ms. This is not a device/FPS benchmark.
- The 2.2s sky fall, mint highlights, three fictional students, real 3D orbits,
  oblique view and explorer/fallback remain.

Current checks: 79/79 unit tests, application/browser typechecks and production
build passed. Lazy scene: 619.89 kB raw / 157.76 kB gzip; existing chunk warning
remains. All 18 production-preview behaviors passed across the main run and
focused hover rerun; five targeted explorer/fan-out regressions also passed.
Read-only source review
resolved two hover findings and found no remaining actionable issues.
Computer Use inspected the narrow overview and selected trophy/companion
fronts with no text box, then restored overview with ambient motion playing.
No viewport override or browser emulation remains.

See [Task 020](Docs/agents/tasks/020-award-hover-turn.md),
[Task 021](Docs/agents/tasks/021-landing-performance.md) and the
[review record](Docs/agents/exchanges/2026-11-18-award-hover-landing.md).
Diagnostics/captures live in ignored `.agent-exchanges/020-award-hover-review/`.
Claude lead review has previously timed out; no successful lead acceptance is
claimed. Physical-phone/GPU/FPS and boss approval remain open.
Local preview: http://127.0.0.1:5173/ .

## Previous checkpoint: selected award fronts and skyfall (2026-11-18)

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
