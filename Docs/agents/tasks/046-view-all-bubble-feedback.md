# Task 046 — View all bubble feedback

2026-11-20. User requests SFX/VFX for View all, then automatic continuation
to the agreed P3.3 character milestone. Sole writer Codex on `codex/phase-3`,
base `6728042`; no deployment assigned.

Reuse local pop/form sound and soap-film burst for View all entry and return.
Opening the list pops its originating bubble immediately; Back, Close and
Escape re-form it when returning to bubbles. Preserve the current camera,
list focus and direct-directory behavior. Respect mute, reduced motion,
hidden tabs, rapid interruption and unmount cleanup. No dependency changes.

Write set: `src/ui/{AwardDiscovery,MapPreview,useAllBubbleFeedback}*`, focused
browser checks and coordinated Agent/Project/HANDOFF/package notes. Verify
sound counts, finite VFX/cleanup, pointer/keyboard return and interruption in
installed Edge sequentially, with typechecks/units/build. Continue Task 047.

## Implementation checkpoint

Implemented shared pop/form audio, finite soap-film bursts and View all formation.
Mute, reduced motion and hidden tabs retain existing feedback behavior. Formation
cancels on student selection and full exit; rapid return preserves focus/camera.
127 units, both typechecks and normal/review builds pass. Compiled Edge verifies
sound counts, entry/Back/Close/Escape, mute and finite cleanup. The focused
interruption check waits for the student morph to finish before exercising Back;
this distinguishes cancellation of View all formation from the card's own morph.
See HANDOFF.md for final browser totals. Continue Task 047 as already authorized.
