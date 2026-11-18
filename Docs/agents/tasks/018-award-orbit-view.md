# Task 018 — Slower landing, fixed awards and orbiting medals

User direction, 2026-11-18: make the landing easier to enjoy, stop camera-facing
billboarding, shrink/bring companion medals closer, orbit them around the main
award, and use the supplied oblique Thailand view as the initial/reset view.

Codex is the sole writer on `codex/award-orbit-view`, base `38b6286`.
Scope: provinceLanding, awards, awardDecoration, ThailandMap, styles, their
tests and relevant package/requirements/testing/handoff/Graphify notes.
No concurrent implementation writers, dependencies or production contracts.

The user's follow-up replaces the initial trial with a 2.2-second overlapping
province wave (900ms spread, 1300ms fall), upright zero-rotation main awards
that gently bob, and real 3D companion medals at 34% scale on inclined atom-like
orbits. Depth testing lets companions move behind the main award. The home
camera is oblique with north-west upper left, Bangkok center and south toward
lower right. Fit and reset must work on desktop and narrow viewports.
Award provinces receive a mint top surface with restrained emissive light.

| Element | Role | Timing | Relationship |
|---|---|---|---|
| Province with outline | Lead | 0–900ms delay, 1300ms fall | Overlapping north-to-south wave |
| Main award | Support | Carried by province; 5.2s gentle bob | Upright; stable hit target |
| Companion medal | Decoration requested by user | 10s orbit in inclined 3D planes | Compact; actual front/back depth |
| Starlight | Decoration | Existing opacity cycle | Shared pause/reduced-motion rules |
| Controls and credits | Static | Always usable | No entrance |

Keep interaction/resize/hidden-tab/reduced-motion entrance settlement, no reset
replay, pause/reduced-motion orbit handling, stable hit targets, strict opt-in,
three fictional students, explorer and fallback. Verify with focused pure and
browser checks, then sequential regression suites, one worker and tracing off.
Inspect default/tilted/selected/320px views and landing frames. Record actual
evidence and review gaps; no merge or deployment.

The explicitly requested 3D idle motion supersedes Task 017's idle-WebGL rule.
Use one renderer/context, update only award instance matrices on idle frames,
and cancel the loop when paused, hidden, reduced-motion or disposed. Reuse the
camera/landing render while those run. Remove sprite/CSS companion paths.

## Result

Feature commit `e9ba743` implements the latest user direction. Two read-only
review findings (geometry/ground clearance and repeated grouped companions)
were reproduced with failing regressions, fixed and rechecked with no remaining
findings. Final unit suite passed 72/72, both typechecks and build passed.
Development checks passed 15 preview cases before the last clearance/count
fixes and 19 explorer/fan-out cases afterward. Final production preview passed
15/15 after both fixes. Every dense fixture ID remains reachable.

Desktop/narrow, tilted and early-landing captures were inspected; Computer Use
checked the final trophy motion/pause/reset and left the browser at overview.
Phone/GPU/FPS and boss acceptance remain open. Claude review timed out without
response. See the [exchange](../exchanges/2026-11-18-award-orbits.md) and
[handoff](../../../HANDOFF.md). No merge or deployment.
