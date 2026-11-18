# Testing the map demo

Start `npm run dev`. The default http://127.0.0.1:5173/ is the combined navy
map preview. Hover/focus a sample award to see its student name; click/Enter
centers and zooms toward it. Repeating activation preserves framing. Escape or
background click clears selection; reset restores the overview. Keyboard and
reduced-motion camera travel is immediate. Cards and avatars are deferred.
The 11 `tests/map-preview.spec.ts` checks cover shell/selection, camera framing,
reset after tilt, coincident groups at 320/1440px, viewport bounds and
geometry/WebGL failure paths. The five pure award tests cover camera bounds,
neighbor collision placement, explicit sample IDs and geometry disposal.

Use http://127.0.0.1:5173/?view=explorer for the walkthrough below. This demo contains fictional
students and has no login enforcement. Profile and project links intentionally
point to placeholder `.invalid` destinations; live destination validation awaits
host integration.

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

Task 016: 66 unit tests, both typechecks and build passed. The development suite
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
