# Task 035 — main deployment source and Phase 2 merge

User request, 2026-11-19. Starting branch `codex/phase-2`, base `bc96439`.
Configure `main` as the Vercel production source before merging the current
branch into `main`. Codex is sole writer for bounded review-build configuration,
deployment integration and coordinated task/project/handoff documentation.
Preserve the Phase 2 commits, the public owner-record review, its media and
existing production/member-data boundaries. Keep media/credentials out of Git.

Inspect current Git/Vercel source and remote state; prepare cloud review builds
that can resolve the six approved media/data files without ignored local input.
Set the production branch to `main`, merge without squashing and push without
rewriting history. Verify source settings and the resulting live review. Preserve
the default fictional build and existing rollback snapshot. Record auth/Git-app
prerequisites and actual verification. Browser jobs remain sequential.

Before merge, Vercel is linked to `dulch29/hamsterhub-hall-of-fame-map` with
`link.productionBranch = main`. Project build command is `npm run build:review`,
output `.review-build`, Node 24 and `npm ci`. `REVIEW_SOURCE_URL` points to
https://hamsterhub-review-assets.vercel.app in production/preview environments.
That separate static Vercel project preserves only the six approved prepared
data/media files, so Git builds do not need ignored local input or depend on a
moving UI deployment. The build accepts HTTPS sources, fails on unavailable
files, validates/prepares the record and preserves the default local workflow.
Normal builds still use fictional students. Headers are now shared through the
root `vercel.json`, which is also copied into the standalone review output.

An unused protected alias `hamsterhub-map-review-assets.vercel.app` was created
for the original UI snapshot during source setup. It is not the media source.
The CLI requires separate approval to remove that alias, so it was left intact;
it does not affect the public review or main deployment branch.

Pre-merge checks: remote-source `npm run build:review`, browser typecheck,
104/104 unit tests and normal `npm run build` pass. All six published media/data
files match the review output by SHA-256. Sequential compiled Edge checks at
320/390/1440 × 844 pass identity/images/logo/PDF, complete description, layered
Escape/focus, keyboard directory and missing-data state; zero page errors.
Normal build retains three fictional markers and excludes supplied values and
local-data requests. The existing large scene-chunk warning remains.
