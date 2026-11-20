# Task 043 — award navigation, centering and orbit correction

2026-11-20. Sole writer Codex on `codex/phase-3`, base `4d4f28b`.
The user requests corrections to Task 042. No deployment is assigned.

## Scope and decisions

- Closing View all on the map returns to its award bubbles, retaining camera
  position/zoom and focus on See all. Directory/fallback Close returns to its
  invoker, since those entries have no underlying map bubble view.
- Center the complete award/bubble composition on wide screens, accounting for
  the visible portrait count. Keep the award left of its portraits, preserve
  phone fitting and avoid large unused space on the right.
- Restore horizontal and vertical orbit with adjustable tilt using the existing
  safe polar limits. Keep bounded zoom, no free pan, Reset and saved overview
  return. This supersedes Task 040's fixed tilt choice.
- A click/tap on empty map space exits the full award journey and restores the
  saved overview. A rotation drag, pinch or click inside a bubble/panel/control
  must not trigger that exit.
- Retain bubble pop/morph, peer spread, re-formation, recall, optional sound,
  province recipient union and context recovery. Competition/characters follow.

## Serialized write set

`src/ui/{MapPreview,AwardDiscovery}.tsx`, `src/ui/bubbleLayout.ts` and its tests,
bounded `src/scene/ThailandMap.tsx`, affected existing browser suites plus
`tests/award-navigation.spec.ts`, and coordinated requirements/plans/handoff
and targeted Graphify outputs. Reuse existing camera/motion helpers and
province union. No dependencies, production data contracts or media changes.

## Verification

Reproduce list Close/full exit, wide-screen composition bias, locked vertical
orbit and ignored canvas tap before fixes. Verify one/four portraits at wide
widths, pointer/keyboard list Close, complete empty-space exit from bubbles/list/
project, pointer/touch orbit versus tap, saved tilt/zoom on return, Reset,
directory/fallback and actual context loss/restoration. Run both typechecks,
units, normal/review builds and sequential installed Edge checks with one worker
and tracing off. Record physical-device and visual acceptance separately.

## Result

Complete locally; ready for user review. No deployment performed.

The map list's Close now shares its Back callback, returning to bubbles and
focusing See all without camera travel. Directory/fallback Close retains its
invoker return. The camera uses the visible portrait count to balance the award
and bubble bounds, and the layout clamps only those visible circles. This also
fixes the one-recipient left bias at 900px found in source review.

Removed the preview's fixed polar angle while retaining the existing safe
limits, no pan and bounded zoom. Preview canvas taps request the existing full
card/recall exit. Pointer movement beyond six pixels, cancellation and a second
contact invalidate a tap so ordinary rotation and pinch preserve selection.
The existing saved view restores position, target, zoom and tilt.

Evidence: the pre-fix browser run reproduced nine expected failures covering
centering, empty-space exit, list Close and vertical orbit. The final application
passes 119 unit tests, both typechecks and normal/hosted-source review builds.
The first broad browser run passed 35 checks and failed three stale list-Close
assertions. Those tests now assert the user's corrected return-to-bubbles
behavior. The final affected run passes 12/12, including a real emulated phone
tap closing an animated project and restoring an adjusted overview. Together
with the unchanged orbit/bubble/recovery checks, all 39 distinct affected browser
checks pass. Installed Edge, one worker, tracing off.

The compiled seven-profile review passes at 320/390/1440 × 844: pointer list
Close, empty-map exit, controls, all seven profiles and media/PDF isolation,
keyboard focus and actual context loss/restoration; zero page errors. Narrow
overview clustering correctly returns focus to the containing cluster when the
individual medal is no longer rendered. Captures were inspected. A read-only
source review found no unresolved actionable defect; this is not designated
lead acceptance.

Evidence is outside Git in `%TEMP%/hamsterhub-phase3-043/` and ignored
`test-results/`. Physical-phone/GPU/FPS and subjective visual acceptance remain
open. The existing large scene-chunk warning remains. Graphify records the
current task and source relationships separately; private inputs/media and
verification captures remain excluded.
