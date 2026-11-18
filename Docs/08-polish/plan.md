# Plan — Visual polish and performance

Status: brand-informed synthetic demo implemented; device/performance acceptance remains open.

## Floating awards and atom-like orbits (2026-11-18, Task 018)

Latest user feedback keeps the oblique reference view, uses upright floating
main awards, and replaces companion images with real 3D medals. Small medals
orbit on differently inclined planes and move through front/back depth. Each
sample's province has a brighter mint top; the blue map and warm constellations
remain. All sample combinations remain fictional artwork.

| Element | Role | Timing | Relationship |
|---|---|---|---|
| Province and outline | Entrance lead | 0–900ms spread, 1300ms fall | One overlapping wave, complete by 2200ms |
| Main award | Support | 5.2s gentle bob | Upright zero rotation, carried by province |
| Smaller medals | Requested decoration | 10s inclined 3D orbit | 34% scale; depth-tested around main |
| Warm constellations | Decoration | Existing 3.2s opacity loop | All samples keep celebration |
| Controls and credits | Static | No entrance | Available throughout |

The 2.2s entrance balances the initial 1.2s pass and the user-rejected 3s
trial. Interaction settles entrance; reset preserves the fitted home without
replaying it. Pause starlight freezes all award motion; reduced motion is static;
hidden tabs/unmount cancel animation work. Idle 3D rendering is explicitly
requested and uses cached instance placements without DOM reprojection.
See [Task 018](../agents/tasks/018-award-orbit-view.md) and
[HANDOFF.md](../../HANDOFF.md) for actual checks and device/review limits.
Final checks: 72 unit tests, both typechecks, build and 15 production-preview
cases passed. Development preview/explorer suites passed 15/19 cases respectively,
with final clearance/count refinements covered by pure and production checks.
Desktop/narrow, tilt, landing and live trophy/pause/reset were inspected.

## Constellation celebration (2026-11-18)

Task 017 follows the user's night-light reference: warm visible glints, star
points and fine constellation lines around each award. Every sample has a light
field; more artwork increases its bounded density (at most 30 points), with no
claim of real participant totals or rank-based province quality. Bangkok shows
a trophy plus gold/silver companion medals. Smaller medals float in place while
the main award and hit target remain steady. Pause starlight, hidden tabs and
reduced motion control the decorative loops; the explorer retains its old motion.

| Element | Role | Start/duration | Relationship |
|---|---|---|---|
| Province with its outline | Entrance lead | 0–520ms delay, 680ms fall | Overlapping wave; complete by 1200ms |
| Main award and its light field | Support | Travels with province | Same projected/elevated anchor |
| Companion medals | Decoration | 4.8s CSS float | Fixed small offsets, independent of hit target |
| Star glints | Decoration | 3.2s opacity cycle | Varied negative phases; static under reduced motion |
| Controls, credits, background | Static | No entrance | Available throughout |

The entrance is a once-per-mount celebration. Interaction skips to the settled
state. No permanent WebGL animation loop, new dependency or remote asset.
The landing's early and settled frames were captured for visual inspection;
physical-phone/GPU motion feel and FPS remain separate acceptance work.
Validation: 70 unit tests, both typechecks, final build, 33 development browser
checks and 14 production-preview checks passed. Desktop/narrow, tilt and landing
captures were inspected. See the
[review record](../agents/exchanges/2026-11-18-award-constellations.md).

## Combined award landscape (2026-11-18)

The user approved one combined navy/enamel/3D design. Task 016 adds the navy
background, blue extruded provinces and sculpted metallic sample awards with
enamel centers/ribbons. Gold is represented by a trophy; silver and bronze use
medals. Artwork is generated locally, without models or dependencies. No ranks
or production award data are inferred. Hover/focus labels identify samples;
click-to-award framing and a short arrival accent provide interaction feedback.
Rendering remains on demand; reduced motion removes the accent and travel.

Overview and trophy/silver selection were visually inspected through Computer
Use. Production screenshots at 1440px and 320px were inspected; 390px bounds
also passed. Final 66 unit tests, application/browser typechecks, build and
11 production-preview checks passed. All 30 development browser checks passed
before the final preview collision helper; the focused regression and production
checks cover that refinement. The scene bundle is 612.80 kB raw / 155.30 kB gzip,
with the existing >500 kB warning. No FPS or physical-device acceptance claim.
The [review record](../agents/exchanges/2026-11-18-sculpted-awards.md) records
the independent fixes and failed Claude connection.

## Award variety research (2026-11-18)

[Reference study](research/2026-11-18-award-map-references.md) compares navy,
daylight enamel and true 3D trophy treatments using browsed sources. The proposed
direction uses varied metal artwork and individual click-to-award framing.
[Camera feasibility](research/2026-11-18-camera-feasibility.md) identifies the
existing travel helper and the fan-out/focus risks. This historical proposal
preceded the combined design approval and implementation recorded above.
Research used one browser page at a time, with no app test or
rendering jobs. Graphify stores a compact continuation record; its original
graph remains a frozen historical snapshot.

## Map-first badge review (2026-11-18)

Default page now shows the map with decorative gold medals, blue ribbon tails,
name labels and restrained sparkle feedback. No ranks or award data are added.
The integrated explorer remains at `?view=explorer`; no avatar or card appears
in the default preview. Ambient movement uses existing transform/opacity loops,
reduced motion, pause and visibility behavior. No new animation dependency.
Six preview and 19 explorer browser checks passed sequentially in installed Edge.
Desktop and 320px screenshots were inspected. Reference still visual inspection
now succeeded through the newer Computer Use connection; see
[reference-inspection.md](reference-inspection.md). Animation timing, physical
phone/GPU motion feel and boss approval remain unverified.

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
