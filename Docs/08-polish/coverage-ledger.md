# Whole-project polish — coverage ledger

Opened 2026-11-20 on `claude/whole-project-polish` (base `ba8edf0`, tree clean).
Scope and gates: [polish handoff](../agents/handoffs/2026-11-20-claude-polish.md).
Status words: `pending` (not yet inspected), `source-read` (code read, nothing
rendered), `verified` (command or capture evidence recorded), `deferred` (reason + owner).
Never read `pending` or `source-read` as passed.

## Baseline (P0), this checkout

| Check | Result |
|---|---|
| `npm test` | 135/135 pass |
| `npm run typecheck`, `npm run typecheck:browser` | clean |
| `npm run build` | passes; known scene-chunk warning (ThailandMap 629.94 kB raw / 161.21 kB gzip) |
| Static scan of `src`, `server`, `api` (non-test) | no TODO/FIXME, `any`, `@ts-ignore`, `console.log/debug` |
| Compiled-preview Playwright suite (Edge, 1 worker, trace off, 20.3 min) | 101 passed, 1 skipped, 2 failed (B-01, B-02 below) |

## Baseline failures

| ID | Status | Note |
|---|---|---|
| B-01 | flake, unconfirmed cause | `bubble-province.spec.ts:111` timed out at 15s waiting for `.map-canvas` while the page still showed the map-loading message. Passed when rerun alone. Likely slow scene-chunk load late in a 20-minute serial run; not reproduced as a defect |
| B-02 | fixed in test, verified | `map-preview.spec.ts:3` compared whole-page canvas captures byte for byte. The open Guide panel (frosted, backdrop blur) overlaps the map and differs by about 9 pixels (max channel delta 4) near its top-right corner. Failed 4 of 5 unmodified runs; after hiding `.character-guides` in the capture it passed 5 of 5. Cause inferred from the diff location, not proven. No application code changed |

## Coverage

| Area | Status | Findings / evidence |
|---|---|---|
| First load and global shell | partly verified | Captured at 320, 390, 1440 wide (844 high), plus 1440x700 and 1024x768: no page errors, no horizontal overflow. P-01, P-02 fixed; P-03 open. Loading/retry captures and entrance-time controls still pending |
| Geography and 3D scene | pending | `ThailandMap.tsx` (988 lines) not yet inspected |
| Camera and input | pending | covered by existing specs; baseline run pending |
| Bubble system | pending | |
| Recipients and navigation | source-read | `MapPreview` focus-restore logic read; no defect confirmed |
| Student and competitions | source-read | `StudentPreview`, `CompetitionContent` read; no defect confirmed |
| Projects and media | source-read | slide error/loading states present; PDF URL uses `safeImageUrl` (name misleading, behavior ok) |
| Characters and narration | source-read | `useNarration` cancel/generation guards look sound |
| Gemini Guide | source-read | `server/guide.ts`, `useGuideChat`, `GuideChat` read; see F-01 |
| Visual system | pending | `styles.css` 1135 lines, `discovery.css`, `guides.css` unread |
| Motion and sound | pending | |
| Responsive and touch | pending | needs 320/390/1440 captures |
| Accessibility | source-read | see F-02 |
| Loading/error/empty/recovery | source-read | see F-03 |
| Data and privacy | pending | contract tests pass (135); catalog boundary read only partly |
| Performance and lifecycle | pending | no measurement yet |
| Code and API quality | source-read | clean static scan; see F-01 |
| Tests and tooling | source-read | `npm test` hand-lists 23 files; 14 browser specs |
| Docs and release readiness | pending | |

## Findings

| ID | Sev | Status | Note |
|---|---|---|---|
| F-01 | low | open, unverified | `useGuideChat` reads the whole response body before the 32,000 length check; server already bounds output at 32 KiB, so impact is small |
| F-02 | low | open, unverified | Slide prev/next use `aria-disabled` while staying clickable; clamped in handler, so no wrong state, only a hint mismatch |
| P-01 | medium | fixed, verified | Sound toggle (36px), Pause starlight (30px), narration toggle (40px) and the credit disclosure (16px) were under the 44px phone target. All four now measure 44px or more at 320, 390 and 1440 wide (DOM measurement of every visible button, link, select, input and summary; none left under 44px). Files: `discovery.css`, `guides.css`, `styles.css` |
| P-02 | medium | fixed, verified | At desktop heights near 844px the open Guide panel started at y=30 and covered the page heading. Panel max height is now `100% - 260px`, so it starts at y=130 below the subtitle at 1440x844, 1440x700 and 1024x768. Heading captured readable at 1440x700. Panel content scrolls inside it |
| P-03 | high, owner decision | open, not changed | On first load at 320 and 390 wide the open Guide panel (490px of an 844px screen) covers the map and all three awards until it is minimized. The welcome-on-entry behavior is accepted: Task 047 states it and `character-guides.spec.ts` asserts it. A smaller or collapsed-by-default phone welcome would change that accepted behavior, so it needs the owner's choice |
| F-03 | low | open, unverified | `AwardDirectory` shows "ไม่พบรายชื่อ ลองเปลี่ยนคำค้นหา" even when the dataset has zero recipients (no search active) |
