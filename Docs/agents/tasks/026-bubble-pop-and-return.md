# Task 026 — bubble pop, student portrait and award return

User follow-up, 2026-11-19. Branch `codex/phase-2`, base `4195727`.
Codex is sole writer for discovery UI/motion/audio, demo cutout artwork, the
bounded scene dismissal seam, adjacent tests and coordinated documentation.

The newest reference supersedes Task 025's stationary, circular preview portrait.
On activation the bubble pops with brief SFX/VFX, reveals an enlarged student
portrait without its bubble rim, and presents name above, gold award title,
project image, English project title, Thai description and the existing bottom-
left Profile text link. Use a fitted composition with portrait centered above
the card. Preserve visible award/featured distinction and image/link fallbacks.
The illustration's play icon does not authorize a fake video player.

Closing the preview reverses the portrait reveal and re-forms its bubble with
brief SFX/VFX. Closing a province gathers all face bubbles into the selected
award before the saved camera returns; background dismissal follows the same
sequence. If a preview is open, close it first. Manual camera takeover/reset,
data replacement/fallback and reduced motion settle/cancel safely. Keyboard
remains immediate. Keep pause/hidden-tab/reduced-motion support, cleanup, and
all recipients accessible. Sound is synthesized locally after interaction,
quiet, optional via a visible mute control; no autoplay/download/dependency.

Verify pop/re-form, audio/mute, enlarged rim-free portrait, overflow, preview-
then-province close, recall geometry and camera return, interruption/visibility,
keyboard/reduced motion and 320/390/1440px reference layout. Run unit tests,
both typechecks, production build and sequential relevant browser tests. Record
physical-device/subjective audio and visual acceptance separately.

## Implementation and verification

Implemented the enlarged reference composition in `StudentPreview`, fitted by
`bubbleLayout`. Original local cutouts for the two demo portraits preserve their
identity without a circular bubble backdrop. Missing/broken portraits use an
initials silhouette. Gold award title precedes project media; name sits above
the portrait. The sole Profile text link and scrollable body remain. Mobile
context/directory controls clear the preview's long names.

`useBubbleMorph` transforms the shell, fades copy and zooms the portrait from
the source bubble. `bubbleFeedback` supplies a finite ring/droplet burst.
`useDiscoveryMotion` re-forms the source on preview close and recalls all visible
bubbles into the award before `MapPreview` requests camera return. The bounded
`onAwardDismissRequest` callback lets canvas dismissal follow this sequence.
Focus moves to the invoker before recall controls become inert, so Escape still
interrupts immediately. Group switches clear exit flags. Reduced motion,
visibility, manual takeover/reset, interruption and unmount settle/cancel work.

`useBubbleSound` creates short, quiet sine sweeps after user interaction. The
visible sound control mutes them. Hidden tabs/unmount stop and clean up audio;
unavailable Web Audio never blocks the UI. No new dependency or downloaded media.

Checks, 2026-11-19:

- Full registered unit suite: **96/96 passed**.
- Application/browser typechecks and production build passed. Lazy scene
  **625.28 kB / 159.63 kB gzip**; existing chunk-size warning remains.
- Production discovery suite: **14/14 passed**, installed headless Edge,
  one worker, software WebGL, tracing off. Covers pop/re-form and audio mute,
  enlarged portrait, all five recall endpoints within 1px of the award, camera
  sequencing, interruption, layered Escape/focus, simulated hidden-tab settling,
  pause/reduced motion, 320/390/1440px, overflow/fallbacks and WebGL failure.
- Five existing camera scenarios passed across sequential runs: three award
  returns, manual takeover/reset and interrupted return. After the final focus
  fix, the three affected discovery cases and interrupted-return case passed
  again. Browser typecheck and `git diff --check` passed afterward.
- Desktop/group/390px/320px captures visually inspected; ignored copies under
  `.agent-exchanges/026-bubble-pop-and-return/`.

The first recall check included an unrelated entrance transition, then attempted
to finish an infinite float; it now selects finite recall animations. Camera
regression exposed a real focus gap during inert recall, fixed above. Its timer
helper now finishes the new finite WAAPI recall before measuring camera RAF,
and checks two-dimensional travel rather than assuming a vertical path.

Physical-phone gestures/motion, subjective audio playback, real GPU/FPS,
screen-reader and user/lead visual acceptance remain open. No merge/deployment.
See [verification record](../exchanges/2026-11-19-bubble-pop-and-return.md).
