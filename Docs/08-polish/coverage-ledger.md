# Whole-project polish — coverage ledger

Opened 2026-11-20 on `claude/whole-project-polish` (base `ba8edf0`); completed and verified 2026-11-21.
Scope and gates: [polish handoff](../agents/handoffs/2026-11-20-claude-polish.md) and [mascot redesign](mascot-redesign.md).
Status words: `pending` (not yet inspected), `source-read` (code read, nothing
rendered), `verified` (command or capture evidence recorded), `deferred` (reason + owner).
Never read `pending` or `source-read` as passed.

## Baseline & Current Suite Verification

| Check | Result |
|---|---|
| `npm test` | 154/154 pass (29 registered unit, data, scene, guide, and UI test files) |
| `npm run typecheck`, `npm run typecheck:browser` | clean (exit 0) |
| `npm run build`, `npm run build:review` | pass (exit 0); known scene-chunk warning (`ThailandMap` ~629 kB raw / ~161 kB gzip) |
| Static scan of `src`, `server`, `api` (non-test) | 0 matches for `speechSynthesis`, `.local-preview`, `eval`, `new Function`, TODO/FIXME, `any`, `@ts-ignore` |
| Compiled-preview Playwright suite (Edge, 1 worker, trace off) | 14 specs pass on built preview (`playwright.preview.config.ts`) |

## Coverage

| Area | Status | Findings / evidence |
|---|---|---|
| First load and global shell | verified | Plain map (`/`) shows only the 3D map, `.brand-mark` ("Hamster Hub" + logo), `.credits-link` (`ที่มาแผนที่ / Map credits` → `/credits.txt`), and the Guide hamster (`.guide-launcher`). Zoom, reset, rotate, pause, mute, and narration DOM controls are removed from `/`. Captured across 320/390/430/1024/1280/1366/1440/1920 and landscape 844x390/667x375/568x320 with zero page errors or horizontal overflow |
| Geography and 3D scene | verified | `ThailandMap.tsx` setup/teardown releases all listeners, RAFs, timers, ResizeObserver, geometry, and renderer on unmount. Picking, landing, framing, north/south orientation, laurel awards, and M-02 single-render drag fix verified by unit and Playwright specs. Eight award batches and triangle budget preserved |
| Camera and input | verified | Orbit both axes by pointer drag/touch, bounded wheel/pinch zoom (`0.75`–`2.5`), no pan, Escape/empty-map dismissal, and saved-camera return covered by `province-entry`, `award-navigation`, and `bubble-province` specs |
| Bubble system | verified | Composition at 320x480 to 1920x1080 and landscape 568x320 to 844x390, shared glossy film, pop/re-form/recall, peer spread, and View all SFX/VFX verified by `bubble-*` and `view-all-feedback` specs |
| Recipients and navigation | verified | Bubbles-first province entry, View all (`ดูทั้งหมด`) recipient panel (`.province-recipients`), selection origin, and Back/Escape/Close focus return covered by `bubble-province`, `discovery`, `character-guides`, and `guide-chat` specs. `.map-failure` provides keyboard-accessible province buttons and retry when WebGL/geometry fails |
| Student and competitions | verified | Step-2 layout (`F6`) moves `เปิด PDF` into `.student-preview__footer`, clamps speech to 2 lines with `ResizeObserver` `อ่านเพิ่มเติม` toggle, and fits `.presentation-controls` and `เปิด PDF` inside the initial card view across desktop (`1024x768`, `1280x800`, `1366x768`, `1440x844`, `1920x1080`), phone (`320x844`, `390x844`, `430x932`), and landscape (`844x390`) viewports |
| Projects and media | verified | Slide arrows (`F-02` boundary guards + `aria-disabled` focus retention), broken/missing image fallback, and footer PDF link covered by `competition-presentations` and `character-guides` specs |
| Characters and Mascots (Phases 1–3) | verified | Thai `speechSynthesis` voice narration is completely removed (`useNarration.ts` deleted, `0` `speechSynthesis` references). All 14 transparent RGBA sprites (`guide`/`explainer` × `pet`, `walk1`, `walk2`, `talk`, `back`, `jump`, `argue`) cleaned of white edge fringes (`ext_white=0`, `semi_light=0`, `cc8=1`). Phase 2 student portrait map takeover (`.student-presenter`), Phase 3 Guide vs. Explainer rivalry (`data-scene="rivalry"`, `.explainer__rivalry`), random race winner on each project click (`data-winner="guide" \| "explainer"`), facing direction (`faceSignForDelta`), talking micro-interaction (`data-talking`), and wider 2D Guide wandering avoiding medals and UI obstacles verified by unit (`mascotSprites.test.ts`, `mascotChoreography.test.ts`) and Playwright (`character-guides.spec.ts`) suites |
| Gemini Guide | verified | Server-only credentials and fictional-only catalog (`server/guide.ts`, `server/guideCatalog.ts`). `F-01` bounded stream read (`readBoundedReply`, 32 KiB UTF-8 cap) verified in `useGuideChat.test.ts`. Explicit confirmation wording (`ให้ฉันเปิดหน้านี้ให้เลยไหม?`, `F8`) rendered whenever target actions resolve, with click-only navigation (`GuideChat.test.tsx`, `guide-chat.spec.ts`) |
| Visual system & Contrast | verified | WCAG AA contrast verified across `/` (`11.92:1`–`15.77:1` on `.credits-link`, `.guide-chat__turn`, status/error pills) and `/?view=explorer` (`5.42:1`–`6.48:1` on muted slates and `#135bbb` links). `.province-journey__close` moved to top-right (`top: 18px; right: 18px`) clearing `.brand-mark` |
| Motion and sound | verified | WebAudio bubble pop/form WAVs and typewriter oscillator tick (`useBubbleSound.ts`) respect reduced motion and hidden-tab rules (`bubble-province`, `view-all-feedback` specs) |
| Responsive, landscape & virtual keyboard | verified | Verified across portrait phones (`320x844`, `390x844`, `430x932`), short screens (`320x480`, `320x568`), landscape phones (`568x320`, `667x375`, `844x390`), desktop (`1024x768` to `1920x1080`), and virtual keyboard (`interactive-widget=resizes-content` + `window.visualViewport` `--vv-height`/`--vv-keyboard` clamping at `390x480`) |
| Accessibility | verified | 44px minimum interactive targets across `/` and `/?view=explorer`. Full keyboard Tab order, `Escape` dismissal, focus return, and `.map-failure` fallback verified with zero keyboard traps |
| Loading/error/empty/recovery | verified | Geometry failure, WebGL init failure, live WebGL context loss/restore, context timeout, and offline Guide failure verified by `map-recovery`, `map-preview`, `competition-presentations`, and `guide-chat` specs |
| Data and privacy | verified | Opt-out filtering in `prepareKids`, `provinceRecipients`, and `guideCatalog`. Explainer `provinceNarration` derives strictly from catalog data (province name, recipient count, visible award titles) with zero invented trivia (`guideContent.test.ts`). Default demo stays three fictional students; province-level positions only; no private data or secrets in Git or `dist/` |
| Security & CSP | verified | Strict Content-Security-Policy (`default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https:; media-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; worker-src 'none'`) shipped in `vercel.json` and mirrored in `vite.config.ts` preview server, alongside `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, and `Permissions-Policy`. Verified with `0` `securitypolicyviolation` events across Three.js, WebAudio, images/PDFs, and `/api/guide` |
| Performance and lifecycle | verified | `M-02` fix in `ThailandMap.tsx` eliminated duplicate render during drag (cutting preview drag frame gap p50 from `62.4ms` to `20.9ms` and draw calls from `478` to `239` per frame on integrated Intel UHD). Context disposal verified by `map-recovery` spec |
| Code, Tests and Tooling | verified | `npm test` (154/154 across 29 explicit files), `typecheck`, `typecheck:browser`, `build`, `build:review`, and serial Playwright preview suite pass |
| Docs and release readiness | verified | HANDOFF checkpoint, this ledger, and release/rollback notes updated |

## Findings Ledger

| ID | Sev | Status | Note |
|---|---|---|---|
| F-01 | low | fixed, verified | `useGuideChat.ts` now streams response bodies via `readBoundedReply(response, 32 * 1024)` using `response.body.getReader()` + `TextDecoder({ stream: true })`, cancelling immediately on UTF-8 byte overflow (`INVALID_REPLY`). Verified by `src/ui/useGuideChat.test.ts` |
| F-02 | low | fixed, verified | `CompetitionContent.tsx` slide prev/next handlers now guard `index > 0` and `index < entry.slides.length - 1` on click and `ArrowLeft`/`ArrowRight` while retaining `aria-disabled` for keyboard focus stability |
| P-01 | medium | resolved by R2, verified | Plain-map zoom, reset, rotate, pause, mute, and narration controls were removed from `/` per owner decision (`R2.1`/`R2.2`). Remaining interactive targets on `/` (`.guide-launcher`, `.credits-link`, medals, bubbles, card controls) and all `/?view=explorer` controls measure `>= 44px` |
| P-02 | medium | fixed, verified | Pill-bar Guide chat panel (`guides.css`) is constrained by `--vv-height` and `anchoredPanel()` clamping so it never overlaps the top brand mark or viewport top edge |
| P-03 | high | fixed, verified | Guide starts closed (`open = false`) on initial load across all widths (`CharacterGuides.tsx`), keeping the map and all awards unobstructed until the user activates `.guide-launcher` |
| P-04 | medium | resolved by R2, verified | Map control column removed from plain map view (`/`); zero overlap with `.guide-launcher` or `.credits-link` |
| P-05 | high | obsolete, removed | The legacy `is-directory` page (`AwardDirectory`) was deleted in commit `84710f4`; failed map loads use `.map-failure` province buttons + retry |
| P-06 | low | fixed, verified | The old scrolling Guide panel with a province list below the fold was replaced by the compact pill chat bar (`GuideChat.tsx`) |
| P-07 | medium | fixed, verified | On phones, `.province-recipients` (View all) leaves bottom clearance for `.guide-launcher`, and removed sound/map controls no longer collide |
| P-08 | medium | fixed, verified | Step-2 card layout (`F6`) and `bubbleLayout.ts` fit short and landscape screens (`min(330, height-300)` on portrait phones, `isLandscapePhone` side-portrait layout on `height <= 500 && width > height`) |
| P-09 | low | fixed, verified | `เปิด PDF` moved to `.student-preview__footer`, description clamped to 2 lines with `อ่านเพิ่มเติม`, and `.presentation-media` heights consolidated so slide controls and `เปิด PDF` fit the initial card view across all 8 required desktop/phone viewports + landscape |
| P-10 | note | preserved, verified | Explainer `provinceNarration` uses catalog-only data (`จังหวัดBangkok`, recipient count, visible award titles) tested in `guideContent.test.ts` and `character-guides.spec.ts` |
| P-11 | medium | fixed, verified | `/?view=explorer` controls all measure `>= 44px` and pass WCAG AA contrast (`5.42:1`–`6.48:1`) in `styles.css` |
| P-12 | medium | fixed, verified | Landscape phones (`844x390`, `667x375`, `568x320`) use `isLandscapePhone` layout rules in `bubbleLayout.ts`, `discovery.css`, and `guides.css` with zero overflow or control collisions |
| D-01 | medium | fixed, verified | `.province-journey__close` moved to top-right (`top: 18px; right: 18px`), `.student-presenter` takes Explainer's place on the map at the project step (`F7`), and all desktop viewports (`1024x768` to `1920x1080`) have 0 overlaps and 0 offscreen controls |
| F-03 | low | obsolete, removed | `AwardDirectory` was removed in `84710f4`; `.map-failure` filters to groups with visible recipients |
| S-01 | medium | fixed, verified | `vercel.json` and `vite.config.ts` serve strict `Content-Security-Policy` plus `nosniff`, `Referrer-Policy`, `X-Frame-Options: DENY`, and `Permissions-Policy`, verified with 0 CSP violations in browser runs |
| M-01 / M-02 | medium | fixed, measured | `ThailandMap.tsx` (`212f872`) skips redundant `tickAwards` render when `draw()` is queued, reducing preview drag renders from 2 to 1 per frame (`478` → `239` draw calls, p50 frame gap `62.4ms` → `20.9ms` on Intel UHD integrated GPU) |

## Desktop & Phone Keyboard Check (K-01, verified)

Tab order through `/` (plain map view): `.credits-link` (`ที่มาแผนที่ / Map credits`), the three province award markers (`Mock Mali`, `Mock Niran`, `Mock Ploy`), and `.guide-launcher` (`เปิด Guide`). Opening `.guide-launcher` focuses the chat `textarea`; `Escape` closes the chat and returns focus to `.guide-launcher` with a visible `#ff9500` focus ring. Opening an award enters recipient bubbles + `ดูทั้งหมด`, student competitions, and project presentation (`สไลด์ก่อนหน้า`, `สไลด์ถัดไป`, `อ่านเพิ่มเติม`, `เปิด PDF ↗`, `ดูโปรไฟล์ ↗`), with `Escape` retracing each layer without traps.

## Production Blockers (External Dependencies Kept Separate per R4)

| Blocker | Needed to clear it |
|---|---|
| Production host and membership | Real Hamsterhub host stack and server-enforced membership session contract (public review uses `noindex` only) |
| Real, opted-in student data | Protected data source, guardian PDPA consent workflow, and production `showOnMap` records |
| Real Profile and project links | Destination URL contract (current demo links use `.invalid` placeholders) |
| Brand tokens & iframe policy | Confirmed HamQuest/Hamsterhub design tokens and iframe parent origin if embedded (`X-Frame-Options: DENY` and `frame-ancestors 'none'` currently block framing) |
| Gemini provider spend cap | Provider-side billing/quota cap (app enforces per-instance 10 req/min, 2 concurrent) |
