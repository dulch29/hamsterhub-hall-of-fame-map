# 03 — Shared data and featured projects

Milestones: M1–M2, reused in M6. Owner: lead for contracts/data; Codex for mock fixtures.

## Current state and scope

`src/types.ts` defines the agreed contracts. `src/data/prepareKids.ts` now
provides the shared typed synthetic preparation path and the starter consumes
it. Production server filtering and untrusted JSON validation are pending.

Build one data-preparation path consumed by map and list:

- Enforce opt-in filtering for synthetic application data and define the production server boundary with package 07.
- Resolve manual featured selections against the student's own visible projects.
- Treat deleted, hidden, or invalid selections as unset.
- Apply the most-recent fallback only if confirmed. Until then, preserve explicit selection or null.
- Validate province codes, IDs, project timestamps, and basic record containers
  at the typed synthetic boundary. Production validation enforces required
  fields and the 120-character description contract; this adapter does not
  truncate names or descriptions.
- Keep `MapPin` coordinates derived from province anchors, separate from student records.

Proposed files: `src/data/*` and focused tests. The current `Project` type has no visibility field; resolve visibility in the source adapter or agree a contract change rather than inventing one silently.

## Completion criteria

- [ ] Map and list consume the same filtered, resolved records.
- [ ] An opted-out fixture cannot enter either view's input.
- [x] Invalid featured selections produce null, provisionally pending package 01.
- [ ] Missing avatars, empty projects, and invalid records have defined handling.
- [x] Production server filtering responsibilities are specified for 07.

The remaining view criteria require the actual scene/list consumers. The
adapter tests establish synthetic filtering and field allowlisting, not the
network-response or authentication acceptance criteria in Project.md.

Continue with [the implementation plan](plan.md).
