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
award. Desktop: up to five stable face bubbles near the award, all-recipient list,
and side preview. Mobile: bottom sheet and back-to-recipients action. Preview
close returns to recipients; group close restores camera. Escape closes one layer;
background closes all; manual camera/reset clears discovery without camera return.
Default remains exactly three fictional students. An explicit group fixture covers
overflow. No real data, award eligibility policy, auth, full Profile or new library.

## Implementation plan and write set

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

Implementation and verification in progress.
