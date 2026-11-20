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
| Compiled-preview Playwright suite (Edge, 1 worker, trace off) | running; result recorded below when finished |

## Coverage

| Area | Status | Findings / evidence |
|---|---|---|
| First load and global shell | source-read | `MapPreview.tsx` read; renders loading/failure messages. Rendered capture pending |
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
| F-03 | low | open, unverified | `AwardDirectory` shows "ไม่พบรายชื่อ ลองเปลี่ยนคำค้นหา" even when the dataset has zero recipients (no search active) |
