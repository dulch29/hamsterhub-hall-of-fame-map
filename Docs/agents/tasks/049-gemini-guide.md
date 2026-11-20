# Task 049 — Conversational Gemini Guide

2026-11-20. User explicitly defers polish and selects Google Gemini, a Vercel
server function with local support, and fictional sample records only. The
accepted scope is text chat, bounded server requests, clickable results and
graceful failure. Codex is sole writer on `codex/phase-3`, base `0256359`.
No deployment, owner-record transmission or production member integration.

## Approved design

`POST /api/guide` accepts a dataset key (default/group/review), a question,
bounded recent conversation and optional selected fictional IDs. Server-owned
catalogs come exclusively from fictional fixture code. No client catalog,
image/PDF/owner fetch, remote tools or arbitrary URL actions. Gemini receives
the fictional text catalog and typed conversation only, with server instructions
to answer from these records, acknowledge unknowns and avoid invented results.
Questions are user-submitted content, not an authorization to read private files.

Native server fetch calls Google's documented Interactions API with structured
JSON text, `store: false`, bounded output and deadline. `GEMINI_API_KEY` and
`GEMINI_MODEL` remain server-only environment variables. Default model follows
the current official cost-efficient model documentation; configurable model ID.
Model text is rendered as plain text. Returned target IDs are validated against
the server catalog, labeled by the server, then intersected with currently
visible/explicitly linked frontend records before any result button is offered.
Navigation happens only after a click, using existing map/list selection.

Guide retains scripted help and welcome. Chat has sending, Stop, failure/retry
and clear states, bounded memory in component state, abort on minimize/unmount,
and keyboard/phone support. Current narration stays separate and opt-in. A
failure never blocks map/manual browsing. Explicit fictional-data scope copy.

Request bounds, same-origin checks, no-store responses, per-instance rate/concurrency
limits and no automatic provider retries limit incidental usage. These are not a
durable global currency cap; provider quotas/billing controls remain required
before public deployment. No prompt/response/key logs or retained chat storage.

## Ownership and implementation plan

Codex owns `api/guide.ts`, new `server/guide*`, shared `src/guide/*`, new
`src/ui/GuideChat*`, bounded CharacterGuides/MapPreview/guides.css integration,
fictional review fixture extraction, Vite local middleware, package test
registration/typecheck/config/env example, focused tests and coordinated docs.
Read-only reviewers may inspect the finished slice without test/browser jobs.

1. Write catalog/request/output tests, verify failure, implement pure contracts
   and fictional catalogs. Ensure review owner data cannot enter the catalog.
2. Write handler tests with controlled fetch: secrets stay in headers, context
   filtering, malformed/oversize/method/origin, timeout/429/blocked/bad-output,
   limits and no retries. Implement native Gemini call and Vercel/local adapters.
3. Implement chat and ID navigation using current state; cover stale/cancelled
   responses, duplicate submit, plain-text rendering, empty/error, multi-turn,
   cross-province/student/project links and review-owner exclusion in browser.
4. Run units, app/browser typechecks, both builds and sequential installed Edge
   chat/journey/recovery checks at 320/390/1440, one worker/tracing off. Inspect
   captures. Review source, fix findings, update handoff and targeted Graphify.
5. If a locally configured key is supplied, make a bounded live fictional-only
   request and verify answer/actions. Otherwise record live provider verification
   as pending; never substitute controlled-fetch evidence for a live API call.

Official docs checked 2026-11-20: ai.google.dev/gemini-api/docs/structured-output,
ai.google.dev/api/interactions-api, ai.google.dev/gemini-api/docs/models and
vercel.com/docs/functions/runtimes/node-js. No new SDK dependency needed.

## Implementation and verification — 2026-11-20

Implemented server-owned default/group/review fictional catalogs, strict input
and structured-output contracts, native Gemini Interactions fetch, Vercel entry
and Vite dev/preview middleware. Review build bundles the ESM server entry into
`.review-build/api/guide.js`; no owner inputs are imported by that bundle.
Guide chat supports bounded recent turns, Stop, minimize cancellation, clear,
error/retry and plain-text replies. Result labels come from visible local data;
buttons open the existing directory/student/competition journey on click only.
Existing scripted help and opt-in narration remain separate.

135 unit checks pass. App and browser TypeScript and normal/review builds pass.
Final affected compiled Edge coverage: **15 distinct checks pass** across the
14 normal-build chat/character cases and one explicit review-build case.
The review check substitutes a fully synthetic owner stand-in; it verifies that
owner context/action IDs stay out of the request/results while fictional work
opens. It does not inspect or transmit private owner inputs. Request/history
bounds, plain HTML text, invalid targets, canonical labels, multiple turns,
Stop/minimize, errors/retry/clear, nested Back/focus, responsive widths
320/390/1440, narration and actual context restoration are covered.

The browser regression caught a real Stop-button default-action bug: React
reused the button as Submit during the click. Preventing the default before
Stop fixes it; the held-response test passes. Test corrections use the existing
`competition` stage name, explicit map readiness before province selection, and
an unambiguous recipient-row selector. The review-only test runs with
`PLAYWRIGHT_REVIEW_BUILD=1` and the preview config's `.review-build` option;
normal preview intentionally blocks development-only `fixture=local`.

320/390/1440 chat captures were inspected. Local middleware returns 405/400 with
no-store for method/invalid-body probes. Importing the compiled ESM function
returns the expected 503 NOT_CONFIGURED without credentials. Source review found
no actionable issue; final Stop follow-up assessed the described fix without
new reads/tests. Browser jobs were serial, installed Edge, one worker, tracing off.

**Live Gemini and deployed Vercel execution are not verified.** No usable locally
configured replacement key is available. A credential pasted into chat was not
used or persisted; replacement belongs only in ignored `.env.local`. No provider
request or deployment was performed. Physical-phone/GPU testing remains open.
Builds retain the existing scene-size warning and report extensionless imports
as incompatible with Vite's planned future native config loader; current builds
and middleware work. Per-instance limits are not durable global billing control.
