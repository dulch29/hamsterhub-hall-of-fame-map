# Plan — Visual polish and performance

Status: brand-informed synthetic demo implemented; device/performance acceptance remains open.

## Testable demo checkpoint (2026-11-17)

The palette follows CSS recorded in [site-inspection.md](site-inspection.md).
The layout supports desktop and narrow viewports; scene loading is deferred,
pixel ratio capped at 2, and rendering on demand. No remote fonts/images are
required. See [test guide](../testing.md). No FPS, typical-network load,
physical-phone or real-GPU acceptance claim is made.

## Steps

### Motion checkpoint (2026-11-17)

Preserve the simple 3D land and existing palette. Marker hit areas remain fixed;
inner stars have warm halos and three drifting lights. CSS transform/opacity
loops provide ambient movement without rendering the Three.js scene continuously.
Only the first 30 visible markers animate; additional lights remain static.
Pause sparkles freezes decoration; reduced motion removes it. Hidden tabs pause
decoration and cancel camera travel.

Pointer zoom/reset and group travel take 240ms and can be interrupted by map
gestures, resize or filtering. Keyboard camera actions are immediate. Cards use
240ms entrance / 140ms exit, retaining native modal focus until exit completes.
Controls provide brief press feedback; rows and view changes use restrained
feedback. Filtering text and 500-row list relayout remain immediate.

No new animation dependency. GPU/FPS measurements and physical-device motion
feel remain pending. Use the motion walkthrough in [testing](../testing.md).

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
