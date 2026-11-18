# Task 027 — borderless frosted profile card

User follow-up, 2026-11-19. Branch `codex/phase-2`, base `3e3e691`.
Codex is the sole writer for the existing preview markup, scoped CSS, morph
corner token, affected markup expectation and coordinated project documentation.

Remove the visible `student-preview__featured` and `student-preview__province`
rows and their unused styles/import. Preserve the manually selected project,
award title, Profile link and existing hidden explanation distinguishing the
featured project from an award-winning submission.

Give the card an Apple-inspired material: a simple rectangular silhouette with
20px corners, no outline/border, translucent navy frost, a restrained reflection
and a soft shadow. Readable text remains above the material. Provide a near-solid
fallback when backdrop filters are unsupported or transparency/contrast settings
require it. Fade the bottom of the portrait with a static gradient mask, including
the missing/broken-image silhouette. The motion must settle to the same corner
radius as the CSS surface. Keep bubble pop/re-form, sound, recall and camera flow.

Palette reference retrieved from Color Hunt on 2026-11-19:
<https://colorhunt.co/palette/1c325b6a669d9abf80e5e3d4>.
The page title confirms `#1C325B #6A669D #9ABF80 #E5E3D4`; use its navy/neutral
as material inspiration within the accepted navy/mint/gold direction. Browser
connection timed out; the public page HTML was retrieved successfully. Existing
CSS/WAAPI motion already serves this material-only change; no new motion library.

Validate existing preview markup, both typechecks, build and sequential discovery
browser checks. Visually inspect 320/390/1440px glass, portrait fade, missing image,
scrolling and the animated surface's settled corners. Record actual results below.

## Implementation and verification

Removed both visible rows, styles and the unused province import. The manual
project and hidden award/project distinction remain. The surface now uses
`#1C325B` tint, static 20px blur/140% saturation, a restrained neutral reflection,
20px corners and a soft shadow. Border is zero. Unsupported filters use a
near-solid tint; reduced transparency/increased contrast use solid navy.
The portrait's lower 32% fades through a static mask, including its fallback.
WAAPI reads the shared corner token so animated and immediate previews agree.

Checks on 2026-11-19:

- `node --import tsx --test src/ui/StudentPreview.test.tsx`: **3/3 passed**.
  Updated the existing expectation for the removed visible label. No new suite.
- `node node_modules/typescript/bin/tsc -b` and
  `node node_modules/typescript/bin/tsc -p tests/tsconfig.json`: passed.
- `node node_modules/vite/bin/vite.js build`: passed. Existing scene warning
  remains: **625.28 kB / 159.63 kB gzip**; main **268.29 / 83.78**.
- Production discovery browser suite: **14/14 passed (3.1m)**, installed
  headless Edge/software WebGL, one worker, tracing off, with
  `node node_modules/@playwright/test/cli.js test --config playwright.preview.config.ts tests/discovery.spec.ts --trace off --workers 1`.
- Sequential visual inspection script at 320/390/1440px waited for real images
  to decode and pointer-open animations to settle. Computed border was `0px`,
  radius `20px`, backdrop `blur(20px) saturate(1.4)`, both removed rows absent,
  and the portrait mask present. Increased contrast produced solid
  `rgb(28, 50, 91)` with no backdrop filter and no border. Normal and fallback
  portrait captures visually inspected. Evidence/script/material report under
  ignored `.agent-exchanges/027-frosted-profile-card/`.
- `git diff --check`: passed. No package/lockfile, scene or data changes.

The full unit and camera suites were not repeated for this bounded visual slice;
Task 026 records their prior results. Physical-phone/Safari, actual reduced-
transparency OS behavior, GPU performance and user visual acceptance remain open.
No merge, push or deployment.
