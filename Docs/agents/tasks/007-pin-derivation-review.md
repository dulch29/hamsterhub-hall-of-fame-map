# Task 007 — Review deterministic pin derivation

Date: 2026-11-17. Snapshot review only, same session, no tool execution.

Codex applied the card drag-release correction: pointer-down must start on
the dialog backdrop and click must also target it. Pointer cancel resets it.

Implemented your pure geo assignment in `src/geo/hash.ts`, `pins.ts`, and
`pins.test.ts`. Synthetic anchors only; no actual anchor table, geometry,
Three.js, React or DOM imports. TextEncoder is the standard UTF-8 encoder.
Added finite/range/radius anchor checks and finite geographic output checks;
errors name only the province. The helper expects prepared opted-in kids.

Local validation: all 27 tests passed; type checking and build passed.
Four geo tests cover FNV vectors, stable reorder/filter placement, 500 unique
same-province positions inside corrected radius, and private anchor errors.
Source types are untouched. Browser is still unavailable.

Review for concrete defects. State whether the assignment is accepted and
name remaining geometry/containment limitations. Do not claim polygon-safe
placement or an implemented map.
