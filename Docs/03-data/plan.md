# Plan — Shared data and featured projects

Status: synthetic preparation pipeline implemented (2026-11-17);
map/list integration and production boundary remain pending.

## Explicit competition presentations (2026-11-20, Task 045)

Demo associations retain optional nonnegative integer priority, own project ID,
ordered image slides/alt text and PDF URL through grouping and review export.
`studentCompetitions` orders an explicitly featured competition first, then manual
priority and deterministic ID ties. It resolves projects only from that student's
prepared visible projects. Identical duplicate memberships agree; conflicting
curation, missing/stale or another student's project ID stays unset. Preview-level
PDFs and featured thumbnails do not imply competition media. The review builder
preserves supplied owner memberships/curation across competitions; fictional
records declare their own associations. Production contracts remain unchanged.
The registered resolver/parser tests and actual verification are recorded in
[Task 045](../agents/tasks/045-competition-presentations.md).

## Province recipient resolution (2026-11-20, Task 040)

`provinceRecipients` supplies map/directory rows from the union of explicit
visible award memberships, deduplicated by student ID and isolated by province.
The demo association adds optional boolean `featured`; exactly one distinct valid
choice populates `AwardGroup.featuredAwardIds`. Conflicting, missing or stale
choices stay unset. The local-preview parser validates this optional flag;
existing review input without it shows the unset state. No featured project or
competition/project link is inferred. Production `Kid`/`Project` types remain
unchanged. Focused unit suites are explicitly registered in `package.json`.
See [Task 040](../agents/tasks/040-phase-3-province-entry.md) for checks.

Task 036 adds optional per-student `previews` metadata to the explicit review
parser: portrait URL, presentation URL and fictional marker. Reject malformed
containers/fields, copy only supported metadata and discard unknown/opted-out
student entries after preparation. React selects media by the opened student;
only the legacy single-owner preview uses its original global media fallback.
The review builder composes six fictional people with the approved owner before
the same preparation/award resolution. Each fictional profile has distinct
media and no owner PDF or invented destination. `Kid` and default demo stay
unchanged. The production validation/authentication boundary remains pending.

Task 030 adds an explicit development-only local preview parser using the same
preparation and award resolution. It validates local record containers, requires
explicit opt-in and preserves full descriptions for UI testing. Data/media stay
in ignored `.local-preview/`, with an exact dev-server file allowlist; no real
record is added to fixtures or builds. The production boundary is still pending.

## Accepted synthetic adapter interface

Claude delegated this implementation in Task 004, session
`48545807-0b52-412a-b2d1-083631e09f24`.
`prepareKids(records: readonly Kid[]): Kid[]` copies only contract fields,
requires strict boolean opt-in, rejects all occurrences of duplicate student IDs,
and skips empty IDs and invalid provinces. It cleans project IDs/timestamps,
rejects duplicate project IDs within each student, and resolves the manual
selection from that student's cleaned projects. Incoming featured objects are
ignored. Invalid/unset selections become null; no newest-project fallback.

The source must supply already-visible projects. This typed synthetic adapter
does not validate arbitrary JSON, URLs, display names, or description lengths.
Production source validation, description constraints, hidden-project removal,
membership and consent filtering belong to packages 07/09.

App now consumes the adapter for its three synthetic students. Eight adapter
tests cover filtering, duplicate handling, selection resolution, extra-field
removal and nested-copy isolation. Together with generator and link tests,
the current suite includes ten adapter tests. Type checking and build passed.
Basic malformed record/project containers are skipped. Consumers must treat
the fresh output as read-only because its featured object aliases the
corresponding project entry.

## Steps

1. Preserve the current `Kid`, `Project`, `MapPin`, and `ProvinceCode` contracts while defining a shared adapter under `src/data/`.
2. Validate mock/source records and exclude `showOnMap !== true` before exposing them to UI consumers.
3. Resolve `featuredProjectId` from that student's visible projects. Specify handling for invalid dates/fields rather than allowing malformed records to break the view.
4. Use null for unset/invalid selections until package 01 confirms a different fallback. If approved, implement newest-project selection with deterministic handling of date ties.
5. Feed the same prepared collection to the scene, card selection, search, and province filtering.
6. Add opt-out, invalid-selection, empty-project, and long-name tests using package 00's fixtures.
7. Coordinate the production adapter with 07: client filtering cannot replace server-side member and consent enforcement.
8. Extend test discovery when needed; the existing npm test command only selects the generator test file.

## Validation

Run focused data tests, the existing generator suite, type checking, and the build. Verify the default collection still contains three fictional students and the missing-project case stays visible.

## Handoff

Document the adapter interface and final featured-project rule. Packages 02, 04, and 06 use it; 07 and 09 implement its protected production source.
