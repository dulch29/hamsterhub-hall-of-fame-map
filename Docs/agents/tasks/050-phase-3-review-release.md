# Task 050 — Phase 3 Vercel review release

2026-11-20. User explicitly authorizes the proposed Vercel review release with
server Gemini configuration and live journey checks. Starting branch
`codex/phase-3`, base `0e86682`; sole source writer Codex. This supersedes the
historical no-deployment assignment for this bounded review release only.

Publish the checked Phase 3 journey to the existing `hamsterhub-map-review`
project, retaining its stable public review URL, approved seven-profile export
and separate owner-media source. Normal builds retain three fictional records.
Only fictional server catalog records may be sent to Gemini. Copy the existing
ignored local server key into Vercel Secret configuration without printing it,
committing it or exposing it to browser variables. Production/member-data
integration and visual polish remain outside this release.

Verify Git/project source settings and preserve the previous deployment for
rollback. Prepare review artifact and checks, test a preview deployment where
available, then merge through main without rewriting history and verify the
stable deployment. Fix packaging/runtime issues within this task if encountered.
Keep browser jobs serial, installed Edge, one worker, tracing off. Test
320/390/1440 layouts as browser emulation; physical-phone acceptance remains
separate. Check live Gemini, canonical results, bubbles/list/Back/empty-map exit,
manual browsing through chat failure and map fallback/recovery. Bound live
provider calls and never send owner fields or log credentials/owner values.

Record actual deployment ID/source commit/URL, environment key presence only,
verification and rollback target here and in HANDOFF.md. Refresh targeted
Graphify after final documentation. No messages to other people are assigned.

## Release outcome — 2026-11-20

Published through main merge `e3b9ed093a2759950fb4e2a880e67b290bc36432`, preserving
Phase 3 history. The merged tree matches the checked feature tree. Vercel Git
production deployment `dpl_54EEFSyTWmbafF1BGmPBTtyh7YCb` is READY at
https://hamsterhub-map-review.vercel.app. Project source remains main, Node24,
`npm run build:review`, output `.review-build`. Gemini key is a Vercel Secret in
production/preview, never a client variable. Existing REVIEW_SOURCE_URL and
approved media snapshot are retained. CLI created a project Protection Bypass
for Automation secret while checking the protected preview; its value was not
printed. Public-site checks below use the ordinary URL without bypass.

The first preview reproduced startup HTTP500/ERR_MODULE_NOT_FOUND for the
extensionless server/guide import. Commit f3d3bf1 adds explicit .js specifiers
through the TS server dependency closure; Vite/TS still resolve the source TS.
Preview dpl_6fephq1Cnfwk3jSMHXUF77F6AQwi (d9cad6d) returns405/no-store for invalid
method and a successful real structured Gemini response. A temporary HTTP-status
only diagnostic was removed; no prompts, credentials or provider bodies logged.
One initial provider request failed generically, followed by successful checks;
no automatic retries were added. Total bounded cloud generation attempts in
this release: four (one failed, three successful). Root CLI dry-run detected
ignored private inputs among upload candidates, so no root CLI upload was made;
Git deployment includes tracked source only. Both built outputs were scanned
for the configured credential value: zero matches.

Preflight: 135 units, browser TypeScript and normal/remote-source review builds
pass. App TypeScript runs as part of the builds. The existing large scene chunk
warning remains; explicit imports remove the future-native-loader warnings.
Compiled review browser checks pass at320/390/1440x844 for all seven people,
competition entries, View all Close/bubble return, nested keyboard Back/focus,
directory and horizontal bounds; zero page errors. Early inspection scripts
needed scene readiness/non-cluster selection and closing Guide before clicking
under it. These were script corrections, not app changes.

The same three-width seven-person journey passes on the public deployment,
with zero page errors. One actual browser-origin Gemini request returns200 for
the fictional review catalog and opens LeafLoop via its canonical action button.
A controlled503 then verifies ordinary manual browsing still works. Separate
live checks pass empty-map full exit, actual WebGL context loss/restoration and
the directory route without WebGL. All six allowed review data/media routes
return200, no-store and noindex; root returns200/noindex and API invalid method
returns405/no-store. The390px live project capture was visually inspected.
Browser jobs were serial, installed Edge via Playwright CLI, tracing off.
Physical phones/GPU/FPS and provider quota administration are not verified.

Rollback: restore the prior READY review deployment
`dpl_5mCQ636KPAAvrxYdrEHpBvtHU76z` (main65196c9) using Vercel rollback/promote,
then check root/assets and manual browsing. No migration or owner-media update
occurred. Evidence/helpers/screenshots remain ignored under
`.agent-exchanges/050-release/`. Production membership/data integration is next;
polish remains deferred. Graphify records this release separately from Task049's
local-only checkpoint. Final documentation/graph commits keep the same app tree.
