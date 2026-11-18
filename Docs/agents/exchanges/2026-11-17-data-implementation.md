# Claude / Codex implementation exchange

Date: 2026-11-17. Claude session:
`48545807-0b52-412a-b2d1-083631e09f24`.

## Fixture slice

Task 003 reviewed scope before coding. Codex implemented fresh opted-out and
244-character ASCII-name factories in `src/mock/fixtures.ts`, with two tests
appended to the existing generator suite. Task 004 reviewed actual code and
found no blocking defect. Its two reporting corrections were resolved:
Node measured the name as 244 characters, and both export comparisons passed.

Raw baseline SHA256 values, unchanged after implementation:

- 3 records, seed 42:
  `3dacc94a430832a9092520ef9d02f20a46b584dbeafeaa99797a78bda7081197`
- 500 records, seed 42:
  `2ccd4a9dba792444df4da9626eb5b653af24a699551128215e40d3f5390d0eb7`

Baselines and immutable review snapshots are under ignored
`.agent-exchanges/fixture-baseline/`, `fixture-review/`, and
`fixtures-and-adapter/`.

## Shared adapter delegation

Task 004 delegated `src/data/prepareKids.ts`, its tests, the App adapter call,
and explicit test discovery to Codex. Accepted rules are recorded in
[the data plan](../../03-data/plan.md).

Codex also implemented its owned safe-link helper and tests. Test discovery
includes those tests in addition to the two suites requested by Claude.
Task 005 sends all changed code to Claude for review and proposes the next
card slice. Its snapshots are under `.agent-exchanges/adapter-review/`.

## Local verification

- `npm test`: 16/16 passed.
- `npm run typecheck`: passed after adding an explicit `Kid` annotation to a
  test local that initially triggered TS7022.
- `npm run build`: passed.
- Direct exporter invocation through the installed tsx CLI: both raw byte
  comparisons against captured baselines passed.

Claude's review bridge has no tools and does not independently run checks.
These are local Codex execution results. No browser interaction or production
authentication checks are claimed for this data slice.

## Card review and geo follow-up

Task 005 accepted the adapter with cheap malformed-container guards, a
read-only output-alias note, and an order test. It restricted HTTP links to
loopback hosts and delegated card integration plus documentation updates.
Codex implemented these and the card; 23 tests, type checking and build passed.

Task 006 reviewed the actual card. Claude identified drag-release dismissal;
Codex now requires pointer-down and click both on the backdrop. Browser
verification remains unavailable: runtime discovery and its troubleshooting
list found no connected browser.

Claude then delegated pure pin derivation using synthetic anchors. Codex added
FNV-1a UTF-8 hashing, deterministic disc jitter and four tests. The complete
27-test suite, type checking and build passed. Task 007 submits those files
for review under `.agent-exchanges/pins-review/`. Real anchors, licensed
geometry, containment and the scene remain pending.

Task 007 accepted synthetic derivation with pre-scene hardening. Codex added
strict opt-in, own anchor lookup, positive radius, salted hashes and a fixed
distribution test, plus a provisional projection/inverse and two tests.
Task 008 requests closing review of these actual files under
`.agent-exchanges/foundation-closeout/`. Final local suite: 30/30 passed;
type checking and build passed. No browser claims were added.

Closing review found correlation in the raw salted hashes recommended by the
earlier review. Codex reproduced it with a joint 16-cell distribution test,
then added avalanche mixing to each salted value. Original FNV vectors and
unchanged distribution thresholds pass. No geometry/browser coverage is implied.
