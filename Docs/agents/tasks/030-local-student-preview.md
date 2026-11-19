# Task 030 — quieter audio and a local student preview

User follow-up, 2026-11-19. Branch `codex/phase-2`, base `081db98`.
Codex is sole writer; no concurrent workers or deployment.

## Contract and ownership

- Lower both bubble samples by approximately 3 dB; preserve sample, mute and timing.
- Add an explicit `?fixture=local` development preview. User-supplied records and
  media live only in ignored `.local-preview/`, outside `public/` and source.
  A development-server-only endpoint serves an exact file allowlist. Production
  builds and the default three-fictional-student demo contain no local records.
- Use the supplied nickname alongside the supplied full name, province only,
  exact competition title and complete Thai description. Do not infer a prize,
  live Profile destination, external video URL or production consent decision.
- Inspect portrait alpha; preserve the original, prepare a separate transparent
  cutout and a face crop. Use the PDF's rendered slide as the project image and
  provide an accessible link to the locally supplied PDF. It is a document,
  not an embedded video. No external QR destination is fetched.
- Feed explicit award artwork to the existing scene rather than reuse a fictional
  student's ID. Keep accepted camera, bubble/card motion and glass appearance.
- Ocean decoration remains on hold. Production integration remains pending.

Writable scope: `.gitignore`, `vite.config.ts`, local-preview adapter/hook,
`MapPreview.tsx`, `AwardDiscovery.tsx`, `StudentPreview.tsx`, discovery CSS,
`useBubbleSound.ts`, bounded `ThailandMap`/award-summary interface and tests,
existing markup/browser tests, ignored local media/evidence, coordinated docs.

## Verification plan

Run unit tests, application/browser typechecks and production build. Verify local
data/media never enter the build or Git; missing local records fail clearly.
Use fictional payloads for committed browser checks. Sequentially inspect the
actual local record at 320/390/1440px, long Thai description scrolling, portrait
alpha, PDF access, selection/return, keyboard/list fallback and reduced motion.
Retain real-record captures only in ignored local evidence. Record physical
phone and subjective sound acceptance separately.

## Result — 2026-11-19

- Local preview, explicit scene artwork, presentation link and quieter samples
  implemented. Default and overflow fixtures retain their existing behavior.
- Original portrait has no alpha channel; preserved locally. Transparent cropped
  portrait and face image were inspected against navy, then in the actual UI.
  The supplied PDF contains one slide, no embedded movie or attachment. Its
  rendered slide is the preview image; no QR destination is fetched.
- `npm.cmd test`: **100/100**. `npm.cmd run typecheck`,
  `npm.cmd run typecheck:browser`, `npm.cmd run build`: passed. Main 272.85 kB /
  85.09 kB gzip; scene 625.81 / 159.77, existing chunk-size warning.
- Sequential Edge production discovery: **19/19 passed**. After the final
  local-only labels, the sound/pop and desktop discovery cases passed again.
- Ignored `inspect.mjs`: actual local record at 320/390/1440 × 844, image decode,
  card bounds, complete scrollable description, PDF bytes/link, close/re-form,
  layered Escape, focus, camera return, keyboard directory, reduced motion and
  missing-source state passed. Zero runtime errors. Initial camera assertion
  captured a falling marker; awaiting settled landing fixed the inspection.
- Ignored `boundary.mjs`: all five allowed files return `no-store`; direct
  ignored-folder paths (including encoded path) return 403; original file is not
  allowlisted. PDF action opens the correct new tab. Production local route
  makes zero private-data requests; endpoint is absent. Scanning final output
  confirms no supplied personal values or local media filenames.
- `git diff --check` passes. All supplied records, media and screenshots are
  ignored and excluded from source control.

Commands for the sequential browser run (installed Edge, one worker, tracing off):

```powershell
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm.cmd run test:browser -- --config playwright.preview.config.ts tests/discovery.spec.ts --trace off --workers 1
npm.cmd run test:browser -- --config playwright.preview.config.ts tests/discovery.spec.ts --grep 'bubble pop and re-form|desktop award discovery' --trace off --workers 1
node .agent-exchanges/030-local-record/inspect.mjs
node .agent-exchanges/030-local-record/boundary.mjs
```

Next: user review at `http://127.0.0.1:5173/?fixture=local`. Physical phone/Safari,
subjective sound volume, cutout edges and visual acceptance remain open. No
deployment, live Profile route or production integration. Ocean work stays on hold.
