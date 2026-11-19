# Task 034 — public owner-record review on Vercel

User request, 2026-11-19. Branch `codex/phase-2`, base `06dfd6b`.
The user identifies the supplied local record as their own and explicitly
authorizes a public Vercel test version using that record and selected media.
This supersedes the local-only restriction for this review deployment only.
Keep record values/media out of tracked source and documentation; normal builds
retain the fictional demo and exclude the supplied media. Other students and
the production member-only integration remain outside this authorization.

Codex is sole writer for a bounded review-build script, MapPreview source
selection/copy, ignored output settings and coordinated documentation. No other
writer or merge is assigned. Publish a compiled static snapshot, with the
owner-record preview selected by default, existing card/PDF/logo behavior,
explicit review loading/error states and map attribution. Copy only the six
existing allowlisted data/media files into an ignored review artifact; exclude
the original portrait, local README, source, dependencies and local evidence.

Use the user's Vercel account. Complete build and sequential rendered checks
before uploading. Verify normal build exclusion, default review selection,
portrait/logo/PDF routes, mobile/desktop interaction and deployed HTTP behavior.
Keep credentials out of source/logs. Account authentication is an external
prerequisite if this host is not signed in. Record actual outcome and URL.

Prepared: `npm run build:review`, `npm run typecheck:browser`, `npm test`
(104/104), and normal `npm run build` pass. The review script exports prepared
opted-in fields/award memberships rather than copying raw source JSON, and
includes only the six allowlisted files. Original portrait/local notes excluded.
Sequential compiled Edge inspection at 320/390/1440 × 844 passes default owner
record, nickname/full name, image decode, logo, PDF response, complete description
scrolling, Escape/focus and keyboard directory. Missing review data shows the
retry message. Normal build retains three fictional markers and does not request
or bundle supplied values/media. Zero page errors. Evidence/scripts stay ignored
in `.agent-exchanges/034-public-review/`. Physical-phone acceptance is separate.

Vercel CLI 66.2.0 is available from npm's local command cache; no project
dependency was added. Upload awaits the user's Vercel device-flow sign-in.
