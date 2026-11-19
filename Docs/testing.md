# Testing the map demo

Task 030: **100/100 unit tests**, both typechecks and production build passed.
Production discovery **19/19**, plus two final affected cases passed sequentially
in installed Edge with one worker/tracing off. The actual ignored local record
was checked at 320/390/1440 × 844 for transparent portrait, complete description
scrolling, linked PDF/new tab, bubble/card transitions, keyboard directory,
layered Escape/focus and saved camera return; zero runtime errors. Missing local
source shows an error. The five-file dev allowlist, direct-folder denial and
absence of supplied personal values/media in the final build passed. The local
route is unavailable in production and makes no private-data requests there.
See [Task 030](agents/tasks/030-local-student-preview.md). Physical-phone/Safari
and subjective audio/visual acceptance remain separate.

Start `npm run dev`. The default http://127.0.0.1:5173/ is the combined navy
map preview. Hover turns a province's award set toward the viewer; click/Enter
selects, centers and zooms toward it. Screen-reader names remain, with no preview
text box or native tooltip. Repeating activation preserves framing. Escape or
background click clears selection and restores the camera from before the first
award opened. Switching award groups keeps that return view; manual pan/orbit/wheel
discards it. Reset restores the overview. Keyboard and reduced-motion camera
travel is immediate. Phase 2 adds named award choices, floating recipient
portraits and a project preview; Escape closes the preview before the group.
The 23 `tests/map-preview.spec.ts` checks cover shell/selection, camera framing,
reset after tilt, coincident groups at 320/1440px, viewport bounds,
constellation artwork, actual canvas pause/resume and reduced motion, oblique
home view, hidden sky starts at 320/1440px, landing completion/interruption,
smooth hover/return, finite paused turns, regrouping hover cleanup,
all three awards returning to an adjusted prior view, interrupted return travel,
manual camera takeover, switching awards, and geometry/WebGL failure paths.
Eighteen pure award/landing tests
cover camera bounds/facing, neighbor collision placement, raised-province
projection, sample hierarchy/rendered counts, explicit IDs, disposal, upright
bobbing, front/back 3D orbit, selected province fronts, interruption/reversal,
geometry clearance throughout turns, finite mesh/triangle budgets,
front/back medal enamel depth and curved trophy-seal visibility,
bounded falling and clipping throughout tall/narrow entrances.

For the default preview: reload to see the falling provinces, then right-drag
to orbit/tilt. Resting awards keep a fixed 15-degree lean as their sides come
into view; hovering or selecting a province turns its main/companion fronts
toward you over 280ms. Leaving/clearing selection restores world orientation
unless that province is still hovered or selected. Bangkok shows
the main trophy plus smaller gold/silver medals; Chiang Mai shows silver with
bronze and Phuket bronze. Small medals should circle on inclined atom-like
paths, with actual depth behind/in front of the floating main award. The award
province land is mint; every sample retains warm constellation light. The
landing starts above the sky edge and settles within 2.2 seconds. Pause starlight
freezes bob/orbit/twinkle without moving targets; hover/tap can still finish a
finite turn. OS reduced motion makes turns immediate and shows a settled
map and static lights. Zoom/reset, keyboard actions or dragging during landing
settle it immediately and do not replay it afterward.

Use http://127.0.0.1:5173/?view=explorer for the walkthrough below. This demo contains fictional
students and has no login enforcement. Profile and project links intentionally
point to placeholder `.invalid` destinations; live destination validation awaits
host integration.

## Phase 2 bubble walkthrough

1. Tap a sample award. Choose its named award controls; only recipients of that
   award in the selected province appear. Thought dots connect the award to its
   portrait bubbles; each circle has a visible student name.
2. Tap a face: its bubble pops with a short ring/droplet burst and quiet sound;
   an enlarged rim-free student reveals above the rounded card. Verify the name
   above the portrait, gold award title above the project image, centered title
   and description. Verify identity,
   award title, manually featured project image/English title/Thai description,
   one underlined **ดูโปรไฟล์ ↗** link at the bottom left. The two action buttons
   and secondary project link are removed. The visible featured/province rows
   are also removed. Check the borderless navy frost, soft shadow, smaller
   corners and portrait-bottom fade, including missing/broken portraits.
   Increased contrast or reduced transparency uses a solid readable surface.
3. Press the preview close control while opening, or after it settles. The card
   closes; smaller soap bubbles immediately gather from outside while the card
   is still exiting, into one growing membrane,
   then reveal the face. There should be no full-face flash before the merge.
   Check the clear center, cyan/rose rim and curved reflections; pop should
   break into rim fragments and fine droplets visibly beyond the card edges.
   On phones, droplets can clear the top where side space is limited. The
   local water samples should replace the tonal synth. Mute sound, then
   reopen/close: visual effects remain and sound stops. Escape closes immediately,
   including during a pointer close, and restores recipient focus,
   then closes the group and returns to the previous camera view. Pointer group
   close gathers bubbles into the award before camera return. Background click
   closes the preview first, then gathers bubbles. Pan/orbit/wheel/reset clears
   it consistently; hiding the tab or enabling reduced motion settles recall.
4. Open `?fixture=group`: five varied-size bubbles, eight total recipients,
   multiple awards. **ดูทั้งหมด** opens the scrollable full list. Try the long
   name/title, missing/broken images, no featured project and unavailable links.
   Check all recipients with keyboard and that desktop overflow leaves map
   controls unobstructed.
5. Check 320/390/1440px. The same expanding card fits phones, with a scrollable
   project body and reachable close/Profile actions. High/low/overflow sources
   reveal the same fitted portrait/card composition. Check thought dots staying
   clear of both the award and face. Hover/focus freezes that bubble;
   Pause starlight freezes all bubbles. Reduced motion and keyboard expansion
   are immediate; hiding the tab pauses float and settles the finite morph.
6. Open `?view=recipients` directly. Search by name/award and combine with
   province filtering; open/close the same preview by keyboard. Block geometry,
   disable WebGL or dispatch context loss: the directory remains available.

Task 029 verification: **96/96 unit tests**, both typechecks and build passed;
production discovery **19/19 passed**. Four new cases cover visible splash
outside the card at 320/390/1440px and unavailable audio. Existing checks verify
decoded sample playback/mute without oscillators, formation concurrent with a
paused closing card, continuity through unmount, hidden/reduced-motion cleanup,
layered Escape, overflow, province recall and fallback. Final cleanup refinement
was followed by four affected passing checks. Visual captures were inspected at
320/390/1440px; physical-phone/listening acceptance remains separate. See
[Task 029](agents/tasks/029-immediate-bubble-feedback.md). Ocean decoration is deferred.

Task 028 (previous) verification: **96/96 unit tests**, both typechecks and build passed.
Production discovery **15/15 passed**; **13 distinct camera/layout cases** passed
across sequential runs. Final coalescence, switching and overflow checks passed
again after the last polish. The formation test steps inward travel and delayed
face reveal, then checks reduced-motion, hidden-tab and Escape cleanup. The
interrupted-return check now observes Chiang Mai: centered Bangkok no longer
moves enough to demonstrate intermediate travel. See
[Task 028](agents/tasks/028-soap-bubble-polish.md) for commands and acceptance limits.

Task 027 (previous) verification: three affected markup tests, both typechecks and build
passed; production discovery **14/14 passed**. Sequential pointer-open visual
inspection at 320/390/1440px confirms zero border, 20px settled corners, frost,
absent featured/province rows and portrait-bottom fade. Increased contrast uses
a solid surface. See [Task 027](agents/tasks/027-frosted-profile-card.md) for
commands and physical-device/OS transparency limits. No new test suite.

Task 026 (previous) verification: **96/96 unit tests**, both typechecks and build passed.
The production discovery suite passed **14/14**, including pop/re-form SFX/VFX,
mute, five recall endpoints, hidden-tab settling and rapid exit/group switching.
Five camera cases passed across sequential runs (**19 distinct browser cases**).
After the final recall-focus fix, its three affected discovery cases and the
interrupted camera return passed again. Desktop/group/390px/320px captures were
inspected. See [verification](agents/exchanges/2026-11-19-bubble-pop-and-return.md)
for commands, earlier test failures and physical-device/subjective-audio limits.

Task 025 (previous) verification: **96/96 unit tests**, both typechecks and build passed;
nine affected markup/layout tests passed again after the final layout change.
The updated discovery suite passed **10/10** in production Edge. Three affected
motion/touch/320px cases passed again after final glass/name CSS polish.
The test observes real float/pause and steps only the finite card morph to
compare portrait coordinates. Desktop/phone captures were inspected; see
[Task 025](agents/tasks/025-anchored-glass-profiles.md).

Task 024 (previous) verification: **94/94 unit tests**, both typechecks and build passed.
Sequential production-browser runs passed **52 distinct cases**: 10 discovery,
23 preview, 17 explorer and 2 fan-out. Four affected cases passed again after
the final desktop control-clearance CSS change. Desktop/mobile captures were
inspected. See the [verification record](agents/exchanges/2026-11-18-award-profile-discovery.md).
Physical-phone touch/motion, real GPU/FPS, screen-reader and lead/user acceptance
are separate pending checks.

## Quick walkthrough

1. Confirm three makers: Mock Mali (Bangkok), Mock Niran (Chiang Mai), Mock Ploy
   (Phuket). Select each map marker and each list row. Ploy has no featured project.
2. Close cards with Close, Escape and a true backdrop click. Dragging from card
   content onto the backdrop should keep the card open. Focus returns to the
   invoker, or its list row if the marker disappeared.
3. Search `Mali`. Combine this with Chiang Mai: no results. Clear filters.
4. Switch Map/List. Use only the keyboard to reach the list, open a card and close
   it. Use Skip to student list to bypass map markers.
5. Pan, tilt, zoom and reset. Search while zoomed: filtering should preserve the
   camera and canvas. Resize the window and confirm one canvas remains.
6. Select the eight-maker dataset and the dense 500-maker Bangkok dataset. Click
   a cluster repeatedly to reach maximum zoom, then inspect paged fan-out and the
   full group list. Every group member remains selectable in the list.
   Activate clusters with Enter too: focus should follow the expanded group.
   Paged groups announce the visible member range through a polite live region.
7. Select 500 across Thailand and filter provinces. Select edge cases: four
   students should remain visible, the long name should wrap, and searching
   `Hidden` should find nothing.
8. Disable WebGL or block `data/thailand-provinces.geojson`: the same searchable
   list should remain available with a clear status message.

## Motion walkthrough

1. Watch the three stars: their small lights drift while each clickable target
   stays fixed. Pause sparkles should freeze ambient movement; Resume restarts it.
2. Click zoom/reset and a dense cluster. Camera travel should settle promptly.
   Drag during travel to take control immediately. Keyboard camera actions remain
   immediate. Filter or resize during travel and confirm the scene remains usable.
3. Reach max zoom with the eight-maker fixture. Newly revealed stars should spread
   from the cluster center; all eight remain selectable. Dense mode pages through
   all 500 makers.
4. Open/close a card, including closing during entrance or pressing Close repeatedly.
   Focus must stay inside until exit finishes, then return to the invoker. Test
   Escape, backdrop click and dragging from the content onto the backdrop.
5. Enable OS/browser reduced motion, including while a card is closing. Decorative
   loops stop; camera and dismissal become immediate. Switch away from the tab:
   ambient lights pause without a continuous WebGL render loop.
6. Review the feel on a physical phone and real GPU. Screenshots and headless
   tests cannot approve motion feel or establish frame-rate targets.

## Automated commands

`npm test` runs generator, adapter, safe links, modal markup, deterministic pin,
projection, province geometry/containment, clustering, fan-out and award suites.
`npm run typecheck` checks application source. `npm run typecheck:browser` checks
the browser test/config source.

`npm run test:browser` runs isolated headless Chromium against a fresh Vite server
on port 5174. `npm run test:browser:preview` first builds, then runs the same suite
against production preview on port 4174. Install its browser using
`npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.
On this Windows host, the final 2026-11-18 runs used the installed Edge browser:

```powershell
$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
npm.cmd run test:browser -- --trace off --workers 1
```

Run development and production-preview suites sequentially to avoid overloading
software rendering. Do not start a second suite while the first is running.
For a preview-only production check after building:

```powershell
npm.cmd run test:browser -- --config playwright.preview.config.ts tests/map-preview.spec.ts --trace off --workers 1
```

Task 023 (previous): 82 unit tests, both typechecks and build passed. Ten targeted
production-browser cases passed, including all three awards returning after
Escape/background click, prior pan/orbit/zoom, switching awards, smooth return,
opening/closing interruptions, manual takeover and reset. Six extra layout/explorer
cases passed; filtering and the old sample-zoom/reset case hit 45-second timeouts.
Coverage limits and capture evidence are in the
[review record](agents/exchanges/2026-11-18-award-return-view.md).

Task 022 (previous): 82/82 unit tests, both typechecks and production build passed.
The original model set keeps four unique geometries, 7024 stored triangles and
eight instanced batches. A production-preview run passed 18/18, starting before
the final curved-seal refinement; the final build completed during that run.
Final-build focused checks passed 6/6 for hover/turns, pause/reduced motion,
selection and 320/390/1440px layouts. Visual evidence is detailed in the
[review record](agents/exchanges/2026-11-18-premium-award-models.md).
The explorer suite was not repeated for this model-only slice. Physical-phone
performance and user/boss visual acceptance remain pending.

Tasks 020/021 (previous): 79 unit tests, both typechecks and production build
passed. Province batching has three pure geometry regressions, and the entrance
browser check caps actual WebGL draw calls below 300 per render. Hover tests
check intermediate/return poses, Escape, regrouping and RAF termination during
ambient pause. All 18 production-preview behaviors passed across the main run
and focused hover rerun; five targeted explorer/fan-out cases also passed. See the
[review record](agents/exchanges/2026-11-18-award-hover-landing.md).

Task 019 (previous): 75 unit tests, both typechecks and production build passed.
All 17 preview and 19 explorer/fan-out behaviors passed across main runs and
focused reruns. The sky comparison allows one channel unit of GPU rounding;
dense fan-out tracing is now off to match this host's load rules. Read-only
recheck found no actionable issues; Computer Use checked selected fronts and
restored overview. See the [review record](agents/exchanges/2026-11-18-award-focus-skyfall.md)
for exact evidence and rerun limits. Phone/GPU and lead acceptance remain open.

Task 018 (previous): 72 unit tests, both typechecks and final build passed.
Development checks passed 15 preview cases and all 19 explorer/fan-out cases,
including all 500 IDs. The preview development run preceded the final geometry
clearance/count refinements; their pure regressions and production checks cover
those refinements. Final read-only source review found no remaining findings.
Final production preview passed 15/15 after both fixes. Computer Use checked
overview, trophy selection, pause/resume and reset; production desktop/narrow,
tilt and landing captures were inspected. No physical-phone/FPS claim is made.
See the [review record](agents/exchanges/2026-11-18-award-orbits.md) for exact
direct-CLI commands and host startup workarounds. Phone/GPU/FPS and Claude lead
review remain open; no production access/integration claim is made.

Task 017 (historical): 70 unit tests, both typechecks and build passed. Development
browser checks passed 33/33, including all 19 explorer/fan-out cases and all
500 IDs. The production-preview command above passed 14/14 map-preview checks;
the explorer suite was not repeated against production. Runs used installed
Edge sequentially with one worker and tracing off. Final label wording was
build-checked after the browser runs. Computer Use and saved production captures
verified narrow/desktop overview, companions, tilt, reset and early/settled
landing. Phone/GPU/FPS acceptance and Claude lead review remain open. See the
[review record](agents/exchanges/2026-11-18-award-constellations.md).

Task 016 (historical): 66 unit tests, both typechecks and build passed. The development suite
passed 30/30 before its final preview-only collision refinement; the new pure
collision regression and production preview passed afterward (11/11). All 19
explorer/fan-out cases are included in that development run. The full explorer
suite was not repeated against production for this slice.

The normal testable server on 5173 is independent and remains available.
The shared software-rendered host allows 15 seconds for readiness assertions;
this does not establish the product's load-time performance target. The exhaustive
21-page fan-out case allows 90 seconds and omits DOM/screenshot trace snapshots.
Use `npm run test:browser -- --trace off` to reduce recording overhead when
checking motion here. Run dev and preview suites sequentially.

The current environment uses standalone headless Chromium with software rendering.
Viewport checks at 320px and 390px establish layout bounds and interaction in
emulation. They do not establish physical touch behavior, real GPU performance,
Safari/Firefox behavior, screen-reader quality or the provisional FPS/load targets.
A dispatched `webglcontextlost` event verifies the fallback handler; it does not
simulate hardware context loss and recovery. Current screenshots were visually
inspected at 1440px and 320px; Computer Use also checked the narrow overview,
trophy/silver selection and reset.
The map has a fixed responsive height independent of list length. Its canvas
uses one-finger pan and consumes gestures inside the map; scroll the page from
outside the canvas. Physical-phone gesture usability still needs review.

## Production prerequisites

Authenticated member API, consent collection/ownership, approved member audience,
real project/profile routes, production field validation and host integration are
still required before connecting real student records. Project acceptance boxes
remain unchecked; local synthetic testing does not satisfy those release gates.
