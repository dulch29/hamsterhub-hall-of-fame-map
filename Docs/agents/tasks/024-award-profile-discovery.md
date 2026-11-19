# Task 024 — Award recipients and profile discovery

Approved 2026-11-18. Branch `codex/phase-2`, base `482fd2c`.
Codex is the sole writer, including the bounded scene/shared integration below.
The user's explicit implementation request authorizes this assignment. No other
implementation workers, production integration, deployment or merge is assigned.

## Approved contract

Tap a province's award group, choose a named award, reveal that award's recipients
in that province, select a student, preview their manually featured project, then
follow their existing Profile URL. English competition/project titles; Thai UI
and descriptions. Student names remain supplied. Explicit fictional associations
are separate from Kid and are never inferred from decorative artwork.

Preserve Phase 1 geometry, artwork, landing, orbit/pause, reduced motion and saved
camera return. Companion medals share the main target; named controls choose the
award. The user's later sketch refines desktop and phones to up to five floating
portrait bubbles near the award, an all-recipient list and an expanding project
card at the selected bubble. Its Back action reverses the morph. Preview
close returns to recipients; group close restores camera. Escape closes one layer;
background closes all; manual camera/reset clears discovery without camera return.
Default remains exactly three fictional students. An explicit group fixture covers
overflow. No real data, award eligibility policy, auth, full Profile or new library.

## Implementation plan and write set

### User visual correction — 2026-11-18

The user's attached sketch supersedes the recipient panel and separate side-card
layout: small thought-bubble dots lead from the selected award into scattered,
different-size portrait circles directly on the map. Circles enter from the award
and gently float. Tapping one expands that circle into a rounded rectangular
project card at its location; closing shrinks it back. Preserve filters, overflow,
focus, camera return and fallback. Phones also use free-floating circles with a
viewport-fitted expanding card, rather than a recipient sheet. Float uses CSS
transforms, freezes for hover/focus, pause, hidden tabs and reduced motion; card
morph is finite WAAPI, with cleanup and an interrupted close from the current pose.
No new library or continuous JavaScript animation loop.

1. **Award data:** add `src/data/demoAwards.ts`, `src/mock/discovery.ts` and a
   focused data test. Definitions have ID, English title and artwork style;
   associations reference student/award IDs. Resolve visible prepared recipients,
   deduplicate associations, group by province, omit invalid/empty relationships.
   Register the suite in package.json. Verify data tests before UI integration.
2. **Scene seam:** extend `src/scene/ThailandMap.tsx` with optional selection/anchor
   notifications and dismissal requests. Reuse camera draw updates; synchronize
   background, manual takeover, reset and data changes. Preserve explorer defaults.
3. **Discovery UI:** update `src/ui/MapPreview.tsx`; add scoped discovery components,
   CSS, and shared image fallback export from PinCard. React owns selected group,
   award, student and overflow. Nonmodal labeled regions, visible focus, stable
   recipient buttons, focus return, mobile safe areas and bounded scrolling.
   Accessible list uses identical data/preview and remains available without WebGL.
4. **Verification:** add `tests/discovery.spec.ts`, update relevant preview assertions
   only for intentional Phase 2 behavior, run both typechecks/full unit suite/build,
   then sequential production browser checks with one worker, tracing off.
   Inspect desktop/phone screenshots, return/reset/manual controls and fallbacks.
5. **Handoff:** update packages 04/06/08, testing guide, Agent.md, Docs index and
   HANDOFF.md with actual results and remaining production/device limits.

## Acceptance

- Correct award + province recipients/counts; opted-out and missing IDs absent.
- Every recipient reachable with keyboard, touch and WebGL unavailable.
- Preview has portrait/initials, identity, award title, featured project or Thai
  empty state, primary Profile and optional project links using existing safety.
- English long titles and Thai copy wrap at 320/390/1440px; images fail safely.
- Selection/switch/overflow/focus/Escape/background/manual/reset/camera return
  work without another animation loop or a scene rebuild for UI state changes.
- Record physical-phone, lead review and production integration as unverified
  unless actually performed; existing host timeouts are not passes.

## Results

Implemented the approved flow and visual correction. Award recipients are
resolved from visible prepared records; the default keeps three fictional
students and `?fixture=group` covers eight recipients, multiple memberships,
missing/broken assets, unavailable links and overflow. React owns discovery;
the scene reports selection anchors without rebuilding for UI changes.

The reference-led thought trail, scattered portrait circles, CSS float and
interruptible 360ms open / 240ms close morph work on desktop and phones. The
scrollable project body keeps Profile/Back available; names, award/project titles
and Thai descriptions wrap. Desktop overflow controls leave the map controls
clear. The direct award directory at `?view=recipients` shares the same preview
and remains available on geometry/WebGL/context-loss failures.

- `npm.cmd test`: **94/94 passed**.
- `npm.cmd run typecheck` and `npm.cmd run typecheck:browser`: passed.
- `npm.cmd run build`: passed; existing >500 kB lazy-scene warning remains
  (625.20 kB raw / 159.61 kB gzip).
- Sequential production-preview browser runs in headless Edge, one worker,
  tracing off: **52 distinct cases passed** (10 discovery, 23 map preview,
  17 explorer, 2 fan-out). Four affected discovery/morph/overflow cases passed
  again after the final desktop control-clearance CSS change.
- Captures inspected at 320/390/1440px, including the five-bubble group,
  expanded desktop/mobile projects and missing/broken image fallbacks.

Physical-phone/motion/GPU/FPS acceptance, screen-reader review, user/boss visual
acceptance, designated lead review and production integration remain open.
No deployment, merge, new dependency or real student record was introduced.
See the [verification record](../exchanges/2026-11-18-award-profile-discovery.md).
