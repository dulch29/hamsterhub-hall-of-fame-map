# Task 025 — anchored glass bubbles and project cards

User follow-up, 2026-11-18. Branch `codex/phase-2`, base `1494357`.
Codex remains the sole writer; source and browser work stay serialized.

The supplied sketch is the visual reference: the tapped portrait stays fixed
while the card expands behind it. Put the name above the portrait, overlap the
portrait with the card edge, then show the project image, centered English title
and Thai description. Replace both large action buttons with a single underlined
Profile text link at the bottom left, followed by a northeast arrow. No separate
project action is requested. Keep award/province context, featured labeling,
safe-link/image fallbacks, Back/Escape/focus, overflow and camera behavior.

Make recipient circles transparent/frosted with a visible bubble rim and readable
portraits. Strengthen gentle CSS floating without moving a selected portrait.
Place thought dots in the gap between the award and portrait edges, with enough
clearance for floating, rather than behind the face. Preserve pause, hidden-tab
and reduced-motion handling. Card bounds adapt around the fixed portrait; when
there is too little room below, expand above it. No scene/data/dependency change.

Write set: `src/ui/StudentPreview.tsx`, `useBubbleMorph.ts`, `bubbleLayout.ts`,
`AwardDiscovery.tsx`, `discovery.css`, their existing tests, and coordinated
Project/Agent/package/testing/handoff documentation. No other writer is assigned.

Verify portrait centers before/during/after expansion and interrupted close,
glass/rim/float, thought-dot clearance, reference layout and the sole Profile
text action at 320/390/1440px. Include lower/edge/overflow recipients, empty work,
broken images, unsafe links, keyboard/reduced motion/pause and directory fallback.
Run unit tests, both typechecks, build and sequential affected browser checks.
Physical-phone/motion and user visual acceptance remain separate.

## Implementation and verification

Updated `StudentPreview`, `useBubbleMorph`, `bubbleLayout`, `AwardDiscovery` and
scoped CSS. The portrait has no translation/scale animation: the surface uses
its center as transform origin, and the body/name fade separately. Card height
and above/below placement fit around the fixed portrait. The name follows the
portrait within viewport bounds; the close control uses the opposite corner
when needed. The sole Profile text link stays at the bottom left. No video or
project action was invented from the sketch's illustrative play symbol.

Frosted circles have transparent rims with portraits inset inside them. Thought
dots now use edge clearances, not center-to-center percentage positions. Gentle
CSS float moves 18px vertically / 9px horizontally over 5.8–8.6s; background
bubbles keep floating during preview. Hover/focus/selection, ambient pause,
hidden tabs and reduced motion remain supported. Background names and mobile
award controls clear the open preview; close restores the recipient controls.

Checks run:

- `npm.cmd test`: **96/96 passed**. Added anchor-placement and thought-dot
  clearance coverage; updated markup asserts the sole safe Profile link.
- Both application/browser typechecks passed, including direct final checks:
  `node node_modules/typescript/bin/tsc -b` and
  `node node_modules/typescript/bin/tsc -p tests/tsconfig.json`.
- `npm.cmd run build` and final direct `node node_modules/vite/bin/vite.js build`
  passed. Existing lazy-scene warning remains: 625.20 kB / 159.61 kB gzip.
- Final affected tests: `node --import tsx --test src/ui/bubbleLayout.test.ts
  src/ui/StudentPreview.test.tsx`: **9/9 passed** after geometry/name refinements.
- Updated production discovery browser suite: **10/10 passed** (2.2m), headless
  installed Edge/software WebGL, one worker, tracing off. Includes actual fixed
  portrait bounds during expansion, interruption and reduced-motion reopening;
  touch anchoring, 320/390/1440px overflow and edge recipients, long/missing
  content, sole safe Profile action, layered Escape/focus, fallback and camera
  synchronization.

The first browser attempt caught a genuine mobile style assignment bug; custom
CSS properties now use `style.setProperty`, and the touch anchor check passes.
It also exposed a test timing issue: Playwright's timer clock did not reliably
freeze browser animations on this host. The finite morph is now paused/stepped
directly in the test. A later assertion incorrectly compared a second opening
after reduced motion had changed the source bubble's pose; it now compares the
portrait at that opening. These failures were fixed and are not counted as passes.

For the later runs, ignored `.agent-exchanges/025-preview.config.ts` preserves
the standard production config but launches Vite directly with the workspace as
cwd, avoiding this host's slow npm startup. Its first launch had an incorrect
cwd and failed before any test ran; corrected before the passing run.

```powershell
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
node node_modules/@playwright/test/cli.js test --config .agent-exchanges/025-preview.config.ts tests/discovery.spec.ts --trace off --workers 1
```

After final glass/name/label CSS polish, the three affected motion/touch/320px
cases passed again. The float test now observes its real computed transform and
Pause playback state: manually playing the CSS animation in the old test could
override stylesheet pause and cause a small source-position drift between calls.
The final test leaves float playback under product control, and only pauses the
finite card morph to inspect its intermediate geometry.

```powershell
node node_modules/@playwright/test/cli.js test --config .agent-exchanges/025-preview.config.ts tests/discovery.spec.ts --grep 'floating bubbles|touch discovery|at 320px' --trace off --workers 1
```

Final desktop/group/390px/320px screenshots inspected: clear glass rims and
thought-dot gap, stationary face overlapping the card, name aligned to the face,
project image/title/description and bottom-left Profile text link. Captures are
copied to ignored `.agent-exchanges/025-anchored-glass-profiles/`.
No unrelated browser suite was repeated for this bounded UI change; Task 024 retains the prior 52-case
baseline. Physical-phone/motion, GPU/FPS, screen-reader and lead/user acceptance
remain unverified. No deployment or merge.
