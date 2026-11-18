# Plan — Visual polish and performance

Status: brand-informed synthetic demo implemented; device/performance acceptance remains open.

## Pop, re-form and province recall (2026-11-19, Task 026)

The latest reference replaces the stationary circular preview with a larger
student cutout. Finite WAAPI transforms reveal it over 360ms and return it over
240ms. A 280ms ring/droplet burst marks the pop; closing re-forms the source
bubble. The selected bubble itself disappears during preview. Existing CSS float
continues on other bubbles, following pause/visibility/reduced-motion settings.

Province dismissal gathers up to five bubbles into the selected award over
280ms, staggered by 20ms. React retains the group until these effects finish,
then requests the existing saved camera return. The scene's bounded background
dismiss request follows the same sequence. Manual takeover/reset cancel it;
keyboard, reduced motion and hidden tabs settle immediately. There is no new
decorative JavaScript loop or animation dependency.

Quiet 130ms sine sweeps are synthesized through Web Audio after interaction,
with a visible mute control, node cleanup and hidden-tab silence. Audio failure
does not block discovery. See [Task 026](../agents/tasks/026-bubble-pop-and-return.md)
for browser evidence; physical-phone/GPU and subjective sound/motion acceptance
remain open.

## Previous frosted bubbles and anchored expansion (2026-11-18, Task 025)

Portrait bubbles now use translucent frosted surfaces, an outlined double rim
and small highlights; the portrait sits within the clear outer ring. Thought
dots are sized/positioned in the actual award-to-portrait gap, with clearance
for floating. Float follows an 18px vertical / 9px horizontal CSS path over
5.8–8.6 seconds with staggered phases. Only the selected/focused/hovered bubble
freezes locally; other bubbles continue floating unless paused/hidden/reduced.

The portrait itself never animates during expansion/collapse. The surface
transforms from its circle around the portrait anchor, while project content
and name fade. Open remains 360ms, close 240ms, with interrupted reversal and
immediate keyboard/reduced-motion/hidden-tab settling. The reference card uses
an overlapping portrait, image above centered project title, Thai description
and one bottom-left Profile text link. No scene/data/dependency change.
See [Task 025](../agents/tasks/025-anchored-glass-profiles.md).

## Previous floating portrait discovery (2026-11-18, Task 024)

The user's reference guides an on-map thought-bubble trail and varied-size
portrait circles. Up to five bubbles spread from the selected award over 360ms
with 45ms staggering, then gently float over 5–8.2 seconds. Float uses nested
CSS transforms so hit targets stay fixed, and pauses on hover/focus, selection,
ambient pause and hidden tabs. Reduced motion removes the loops/arrival.

Selecting a face morphs a separate card shell from the circle into a rounded
rectangle over 360ms; Back reverses it over 240ms. A moving portrait and fading
content connect the states without scaling the text. The finite WAAPI morph
uses transforms/opacity, with rounded-corner paint confined to the shell.
Closing during expansion retargets from its current pose. Keyboard/reduced
motion/hidden-tab changes settle immediately. No new dependency, decorative
JavaScript loop, scene rebuild or per-frame React float update is introduced.

`bubbleLayout` fits the circles and card to desktop/phone viewports. The existing
Three.js camera draw reports selection anchors only when they change. Preserve
the Phase 1 award models, landing, companion orbits and camera return. See
[Task 024](../agents/tasks/024-award-profile-discovery.md) for actual test results;
physical-phone animation feel, GPU measurements and user acceptance remain open.

## Matching sculpted award set (2026-11-18, Task 022)

Original lightweight models replace the simpler cup/disks. The trophy uses a
smooth curved bowl, rolled lip, shaped handles, navy star seal, rounded plinth
and gold plaque. Medals have beveled bodies, double rims, raised stars, navy
enamel, modeled backs and folded notched ribbons. Metal variants share the
same geometry. Four unique geometries use 7024 stored triangles and eight
instanced batches; there are no textures, external model loads or dependencies.
The current 15-degree lean, turns, real 3D orbits and batched landing remain.
See [Task 022](../agents/tasks/022-premium-award-models.md).
Final unit checks passed 82/82; both typechecks and production build passed.
See the [review record](../agents/exchanges/2026-11-18-premium-award-models.md)
for browser/visual evidence and its final-build coverage limits.

## Landing rendering cost (2026-11-18, Task 021)

User-reported falling-land lag prompted actual WebGL call instrumentation.
Batching islands per province reduced peak draws from 1464 to 240, retaining
500792 peak triangles. The single-run 1440x900 headless Edge diagnostic recorded
RAF p95 gaps of 284.7ms before and 97ms after; these are diagnostic samples,
not a controlled FPS benchmark or device acceptance. Original land geometry,
surface/side materials, mint provinces and the 2.2s fall remain.
See [Task 021](../agents/tasks/021-landing-performance.md).

## Smooth turns and clear map (2026-11-18, Task 020)

Task 020 adds a 280ms eased front-facing turn on mouse hover or activation,
including smooth interruption and return. The user increased the resting lean
to 15 degrees and requested removal of preview text boxes/native tooltips.
Labels remain accessible through names/descriptions. Ambient pause still stops
bob/orbit/twinkle; finite interaction turns remain available. Reduced motion
settles immediately. See [Task 020](../agents/tasks/020-award-hover-turn.md).

## Resting lean and selected fronts (2026-11-18, Task 019)

The user's latest correction gives resting awards a subtle fixed 5-degree lean.
On activation, all main/companion fronts in that province face the camera while
their compact 3D orbits continue. Other provinces retain their world direction.
Province blocks now start above the fitted viewport, preserving the 0–900ms
spread and 1300ms falls. Controls, selection clearing, pause and reduced motion
keep their existing behavior. No continuous main-award spin is added.

See [Task 019](../agents/tasks/019-award-focus-skyfall.md) and
[HANDOFF.md](../../HANDOFF.md) for verification and remaining device limits.

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
