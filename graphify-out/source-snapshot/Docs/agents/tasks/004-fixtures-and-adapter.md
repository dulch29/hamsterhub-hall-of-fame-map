# Task 004 — Review fixtures and settle the shared adapter

Date: 2026-11-17.

Resume the existing lead conversation. Review only the supplied snapshots;
do not edit files or claim to execute checks.

## Implemented

Codex added two fresh factories in `src/mock/fixtures.ts` and two tests in
the existing generator suite. The long ASCII name is 244 characters.
Default generator, exporter, App, shared types and package scripts are untouched.

Local verification: `npm test` passed 6/6, `npm run typecheck` passed,
`npm run build` passed. Raw default and 500-record exports were captured before
the change; the after comparison will be recorded separately.

## Requested lead decisions

1. Review the actual fixture implementation and tests for concrete defects.
2. Settle the shared synthetic adapter API: proposed
   `prepareKids(records: readonly Kid[]): Kid[]`, excluding records unless
   `showOnMap === true`, resolving the manual selection only from `projects`,
   clearing invalid/unset IDs and featured objects to null. No newest fallback.
3. Current `Project` has no visibility field. Confirm the adapter treats
   `projects` as the already-visible source collection; production backend must
   remove hidden projects before supplying it. Do not invent a contract field.
4. Specify practical malformed source handling without adding a schema library.
   Proposed typed synthetic boundary: skip empty/duplicate student IDs and
   invalid provinces; discard projects with empty/duplicate IDs or invalid
   timestamps; preserve input order and create fresh nested objects.
   Production JSON validation remains a separate untrusted boundary.
5. Explicitly delegate implementation of `src/data/prepareKids.ts` and its tests
   to Codex, and authorize serialized changes to App and the test script to
   integrate the adapter. No other worker edits these files.
6. Confirm a later PinCard interface `{ kid: Kid; onClose: () => void }`,
   consuming prepared data and restoring focus to the invoking control.

Return firm decisions, required corrections, and the next bounded implementation
assignment. Keep production privacy acceptance criteria unchecked.
