# Task 024 — implementation and verification record

2026-11-18, Windows / Asia-Bangkok. Branch `codex/phase-2`; sole writer: Codex.
The user's implementation request and subsequent reference sketch authorize this
slice. The latest sketch replaces the first desktop side preview/mobile sheet
with on-map floating portrait circles and an expanding project card.

## Delivered behavior

Award group → named award → that award's recipients in the province → floating
portrait → expanding featured-project preview → supplied Profile/project links.
Definitions and associations are explicit fictional demo data, separate from
`Kid`. Preparation/resolution filters opt-out/missing relationships, deduplicates
memberships within an award and preserves membership in multiple awards.

Default has exactly three fictional students. `?fixture=group` adds the explicit
eight-recipient group, five visible bubbles, multiple award choices, scrollable
overflow and asset/link/content edge cases. `?view=recipients` renders a searchable
directory directly without WebGL; geometry/WebGL/context-loss fallback uses it.

DOM/CSS handles entrance and gentle floating. Float freezes on hover/focus,
selection, pause and hidden tabs. The finite 360ms shell/portrait/content morph
expands from the face; 240ms Back reverses from the current pose, even during
entrance. Keyboard, reduced motion and hidden-tab settling are immediate.
Rounded-corner paint is confined to the shell; no width/height animation,
additional decorative JavaScript loop, animation library or scene rebuild is
introduced. The final layout gives overflow controls room beside the map controls.

Existing award artwork, landing, orbit and saved camera return remain. React owns
UI state; scene notifications report changed selected anchors and synchronize
dismissal. Preview close returns focus to the face/list button. Escape closes
one layer, background closes all, and manual movement/reset clears discovery.
Safe links, image fallback and explicit manual featured selection are reused.
Featured work does not claim to have won the selected award.

## Verification

Commands run in the workspace:

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run typecheck:browser
npm.cmd run build
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
node node_modules/@playwright/test/cli.js test --config playwright.preview.config.ts tests/discovery.spec.ts --trace off --workers 1
node node_modules/@playwright/test/cli.js test --config playwright.preview.config.ts tests/map-preview.spec.ts tests/explorer.spec.ts --trace off --workers 1
node node_modules/@playwright/test/cli.js test --config playwright.preview.config.ts tests/discovery.spec.ts --grep 'floating bubbles|group overflow' --trace off --workers 1
node node_modules/@playwright/test/cli.js test --config playwright.preview.config.ts tests/fanout.spec.ts --trace off --workers 1
```

- Unit: **94/94 passed**. Covers recipient isolation/deduplication, multiple
  memberships, opt-outs/missing IDs, prepared featured data, links, preview markup,
  bubble/card bounds and existing geometry/scene pure behavior.
- Application and browser typechecks: passed.
- Production build: passed. Lazy scene **625.20 kB raw / 159.61 kB gzip**;
  existing >500 kB chunk warning remains.
- Discovery: **10/10 passed** (48.8s): normal/reversed morph and pause, desktop
  award/province isolation, focus/layered Escape/camera return, touch preview,
  320/390/1440px overflow/long text/image fallbacks, safe/missing links, keyboard
  directory filters and geometry/WebGL/context-loss/manual/reset/background flows.
- Preview + explorer: **40/40 passed** (3.3m), including the prior filtering and
  sample-zoom timeout scenarios, all three awards returning, interrupted camera
  travel, grouped awards, landing, hover, pause/reduced motion and fallback.
- After final desktop overflow button/list spacing: rebuilt; **4/4 affected
  discovery cases passed** (27.8s), including a control-clearance assertion and
  the normal/reversed morph. Other application behavior was unchanged by this CSS.
- Final-build fan-out: **2/2 passed** (26.8s), including all 500 IDs across 21
  pages and small-group collapse. Overall **52 distinct browser cases passed**
  across sequential production runs; four were repeated after the CSS refinement.

All browser runs used isolated headless installed Edge, software WebGL, one
worker and tracing off. They did not overlap. No timeout was counted as a pass.
The complete browser suite was covered across these runs, not one combined run.

## Visual evidence and remaining acceptance

Inspected production captures: five-bubble group at 1440px; desktop project;
390px recipients/project; 320/390/1440px long-name/broken-image previews. Captures
are copied to ignored `.agent-exchanges/024-award-profile-discovery/` with
`hamsterhub-phase2-*.png` names. The group capture was refreshed after the
desktop overflow spacing correction.

This is implementation/self-review and synthetic browser evidence. It is not
designated lead approval, physical-phone/touch/motion acceptance, real-GPU/FPS
measurement, screen-reader review or user/boss acceptance. Those remain open.
Production records, auth, real Profile destinations, Profile editing and
deployment remain outside the phase. No merge or deployment occurred.

Next: review the interactive floating-bubble flow with the user; record physical
device acceptance separately and keep production prerequisites explicit.
