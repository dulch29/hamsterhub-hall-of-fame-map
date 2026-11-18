# Plan — Visual polish and performance

Status: pending.

## Steps

1. Record confirmed brand tokens and agree the desktop, phone, browser, connection, and measurement procedure.
2. Apply tokens to map materials, typography, controls, cards, and list states, coordinating file ownership.
3. Review narrow/wide layouts, touch controls, camera gestures, long content, and loading/error/empty states.
4. Measure initial load and interaction frame rates using explicit 3-, approximately 100-, and 500+-student synthetic datasets, including a dense Bangkok scenario.
5. Inspect render work, geometry/assets, cluster recomputation, and image requests. Optimize measured bottlenecks and keep instanced pins.
6. Verify unopened cards do not fetch project thumbnails. Consider deferred scene loading if measurements justify it.
7. Repeat only affected measurements after changes, then record results and any agreed target adjustments.

## Validation

Run desktop/mobile browser checks, keyboard flows, WebGL fallback, tests, type checking, and the production build. Record actual device versus emulation; emulation alone does not establish physical-phone performance.

## Handoff

Add measurement evidence under this folder and summarize remaining limitations for package 09's release decision.
