# Task 005 — Review adapter and links; assign the next UI slice

Date: 2026-11-17. Review only supplied snapshots. No commands or file writes.

## Completed by Codex

- Added `prepareKids` with your Task 004 rules and eight focused tests.
- Integrated only the adapter call in App.
- Added `safeExternalUrl` and two link tests within Codex's owned UI scope.
- Test discovery explicitly lists generator, adapter and link suites.
- `npm test`: 16/16 passed. The first typecheck reported TS7022 on one test
  local; an explicit `Kid` annotation fixed it. Subsequent typecheck and build
  passed. Both 3- and 500-record raw exports remain byte-identical to baseline.
- Measured the long name with Node: 244 characters. Task 004's local packet was
  corrected after submission; its immutable request snapshot retains 234.

Your prior combined-count requirement contained an arithmetic error:
500 generated + 2 fixtures = 502 inputs, with the opted-out fixture excluded
and long-name fixture kept = 501 outputs. The test checks 501.

## Review

Review implementation and tests for defects, not just agreement with the plan.
Confirm the typed synthetic boundary and remaining production validation scope.
State any blocking fixes before integration can be considered done.

## Next task decision

Authorize the next bounded UI slice: Codex implements a PinCard with the agreed
API and keyboard-accessible open controls in the current three-student list.
Native modal dialog, Escape and close handling, focus restoration, long-name
wrapping, avatar/thumbnail failure placeholders, safe project/profile anchors.
App handles selection and background dismissal. Card mounts only when selected.
Temporary styles inherit the current palette until actual brand tokens arrive.
No scene, no map/list toggle without a scene, no auth claims.

Please delegate App integration, card styles, explicit test discovery, and
coordinator updates to package notes/HANDOFF/Docs index for this slice.
You remain review-only in this bridge; Codex must persist actual accepted
decisions and verification so future workers can resume.

Return required fixes, accepted decisions, and next concrete assignment.
