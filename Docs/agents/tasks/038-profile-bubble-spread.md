# Task 038 — keep fellow students visible beside an open profile

User correction, 2026-11-20. Base main `e8b88ae`; branch
`codex/profile-bubble-spread`. Codex is sole writer for discovery layout/motion,
bounded preview geometry/source snapshots, focused tests and coordinated docs.
The user sketch guides recipient placement, not a card redesign.

Opening a student gently pushes the other visible recipients clear of the card,
portrait/name and competition logo. Keep their faces/nicknames readable and
clickable for direct switching. Preserve the first card placement while switching
students; animate each new portrait from its actual tapped location. Closing the
preview returns peers to their original positions. At narrow phone widths use a
compact row above the identity/card, with at least 44px targets. Keep overflow
list access, layered Escape/focus, pop/re-form, award recall and camera return.

Use a finite transform transition with smooth interruption; no layout-property
animation, new dependency or decorative JavaScript loop. Reduced motion and
hidden tabs settle immediately; ambient pause still permits finite interaction
feedback. Preserve all data/media and the approved card styling.

Validate pure collision/viewport geometry, actual four-person review and five/
overflow fixture, direct switching/interruptions, close/recall, phone/desktop,
keyboard/directory, pause/reduced motion and WebGL fallback. Run units, both
typechecks, normal and review builds; browser runs sequentially with tracing off.
Merge checked changes into main and update the existing Vercel review. Physical
phone/GPU and visual acceptance remain separate.

## Verification

- 109 unit tests, both typechecks, normal and hosted-source review builds pass.
- Sequential discovery regression: 23/23 pass. After final label fit, focused
  push/switching (4) and scaled-recall (1) checks pass.
- Final compiled review script passes 320/390/686/1440 × 844: four Bangkok
  students remain clear of card/portrait/name/logo and each other, directly
  clickable with fixed card placement; close restores positions/focus/camera.
  Rapid switching, pause/reduced motion, keyboard directory and dispatched
  WebGL failure pass; zero page errors. Captures inspected.
- Recall geometry uses the group-close callback and confirms centers within
  1px of the award. Existing canvas pointer-down triggers OrbitControls
  takeover/immediate dismissal; animated recall on that path is not claimed.
- Merged through `main` at `f08cb12` from `7042d57`; checked and merged trees
  match. Vercel Git deployment `dpl_9vfwQWTvCNED7rdwkohEN6YStpiu` is READY
  from main/f08cb12 at https://hamsterhub-map-review.vercel.app. The same
  sequential four-width live checks pass, including group-callback recall;
  zero page errors. Deployed capture inspected.
- Evidence/scripts stay outside Git at `%TEMP%/hamsterhub-review-038/`.
  Physical-phone/GPU and subjective motion acceptance remain open.
