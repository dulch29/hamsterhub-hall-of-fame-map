# Task 029 — immediate return, natural sound and visible splash

User follow-up, 2026-11-19. Branch `codex/phase-2`, base `b394d9c`.
Codex is sole writer for discovery motion, audio, bounded splash styling,
affected existing browser checks, audio provenance and coordinated docs.

## Scope

- Begin bubble formation on the close action, concurrently with the card exit;
  remove the serial 240ms exit wait. Preserve one continuous formation across
  card unmount, keyboard/reduced-motion settling, focus and province recall.
- Replace the conspicuous oscillator sweep with a locally bundled, licensed
  bubble sound. Preload/decode before selection; audio must never delay input.
  Preserve mute, hidden-tab cleanup and graceful missing-audio behavior.
- Make pop droplets and film fragments reach beyond the Profile card footprint,
  drawing above it with a brief readable hold before fading. Scale to phones.
- Preserve the accepted glass card, camera and default three-student fixture.

The ocean contour/ripple recommendation is **on hold**. The user said
"Wait, no, dont do it yet" after discussing it. No ocean implementation belongs
to this task.

## Verification

Step the finite close while its shell is paused and assert that formation has
already begun. Verify continuity through card unmount, interruptions, hidden tabs,
reduced motion, layered Escape, province recall and focus. Check pop particles
outside the real card bounds, topmost/noninteractive effects and cleanup at
320/390/1440px. Verify sample playback/mute and missing asset behavior.
Run unit tests, both typechecks, build and sequential browser checks, one worker,
tracing off. Physical-device sound/motion acceptance remains separate.

## Result

Discovery starts the formation on `previewClosing`, concurrently with the
240ms shell exit. It retains that single formation through card unmount rather
than restarting it. Small bubbles and the growing membrane are visible from
the first frame; the restored face still joins at coalescence. Explicit handles
cancel/settle on selection changes, group exit, reduced motion, hidden tabs and
unmount. Stale completion cannot clear a newer formation.

The pop now sends eighteen droplets beyond the actual fitted card bounds,
holds them briefly at 85% opacity and fades over 480ms. Four larger membrane
fragments disperse over 380ms. Phone trajectories redirect above the card when
viewport edges prevent lateral clearance. Effects stay in the fixed,
noninteractive layer above the preview; only transforms and opacity animate.

Locally bundled `bubble-pop.wav` and `bubble-form.wav` replace oscillators.
The files total **66,854 bytes**, are preloaded/decoded on mount and never block
input while unready. Playback skips approximately 34/26ms of leading silence,
uses restrained gain and a tail fade, with mute/visibility/disposal cleanup.
Missing assets fall back to silent visual feedback. Both samples come from
BMacZero / Brian MacIntosh's CC0 *Bubble Sound Effects* collection; source,
license and optional credit are in [audio provenance](../../../public/audio/README.md).

Verification on 2026-11-19:

- `npm.cmd test`: **96/96 passed**.
- `node node_modules/typescript/bin/tsc -b` and
  `node node_modules/typescript/bin/tsc -p tests/tsconfig.json`: passed.
- `node node_modules/vite/bin/vite.js build`: passed; main **270.92 kB / 84.60 kB
  gzip**, scene **625.72 / 159.74**, existing scene chunk warning.
- `node node_modules/@playwright/test/cli.js test --config playwright.preview.config.ts tests/discovery.spec.ts --trace off --workers 1`:
  **19/19 passed** in sequential installed Edge/software WebGL. Four new cases
  live in the existing registered discovery suite. They check at least six
  visible droplets outside the card at 320/390/1440px and missing audio.
- Updated sound check confirms both WAVs decode, sample sources play, mute
  works and oscillator starts remain zero. Formation is already visible while
  the closing shell is paused, retains the same node through unmount and
  settles on reduced motion/visibility/Escape. Existing province recall,
  switching, touch, overflow and WebGL failure checks pass.
- After the final stale-completion/dependency refinement, four affected
  formation/interrupt/recall cases passed again. No scene/camera code changed;
  the prior camera suite was not repeated.
- Sequential visual script `.agent-exchanges/029-immediate-bubble-feedback/inspect.mjs`
  captured 320/390/1440px splash at the card and the first 80ms of closing. All
  three reports show eight gathering bubbles while the card is still `closing`,
  zero remaining effects after Escape and zero page errors. Captures visually
  inspected; ignored evidence stays local.
- WAV headers, mono PCM sample rates/durations and leading silence verified;
  subjective sound quality needs listening acceptance, not inferred from tests.
- `git diff --check`: passed. No dependency, map, fixture or ocean changes.

Physical-phone/Safari, actual speakers/headphones and subjective motion/sound
acceptance remain open. No merge, push or deployment. Ocean work remains on hold.
