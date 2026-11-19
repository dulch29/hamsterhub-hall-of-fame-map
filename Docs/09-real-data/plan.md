# Plan — Real data, consent, and release

Status: pending; production prerequisites unresolved.

Task 030 is a user-authorized local UI test only. The explicit development
preview reads ignored local files; default fixtures, Git and production output
contain no supplied personal record/media. No live Profile link, award rank,
production adapter, membership or consent policy is inferred. Production work
and all release acceptance criteria below remain pending.

## Steps

1. Confirm the data source, consent collector, permitted audience, display-name policy, featured-selection location, and required organization review from 01.
2. Require package 07's verified member endpoint before connecting student records. Keep synthetic development fixtures available as a separate source.
3. Map approved production fields into the shared contract; default missing consent to false and reject unsupported province/location data.
4. Resolve featured projects through the agreed visible-project source and confirmed fallback rule.
5. Exercise opt-in, withdrawal, project deletion/hiding, and session transitions. Specify how refreshes and caches reflect these changes.
6. Validate production Profile and project destinations using authorized test records; keep private data out of repository examples and evidence.
7. Complete the organization review required by Project.md and record its outcome without adding sensitive records.
8. Run the complete acceptance checklist across map, dense clusters, card, accessible list, mobile, protected responses, and location exposure.
9. Prepare release configuration and rollback instructions, identify ongoing owners, and update Project.md, README.md, and HANDOFF.md with the actual state.

## Validation

Include direct unauthenticated API checks, opted-out response inspection, province-only location inspection, member-visible card/link flows, withdrawal behavior, keyboard flows, mobile checks, and WebGL failure recovery. Reuse current evidence from earlier packages where applicable.

Record actual commands, environment, date, outcomes, and remaining issues. A written plan does not satisfy a release criterion.

## Handoff

Document the release result, protected source configuration, monitoring/support owner, and rollback procedure. Keep unresolved acceptance items unchecked.
