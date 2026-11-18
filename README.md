# Hamsterhub Hall of Fame Map

A testable synthetic demo of the 3D Thailand maker map in [Project.md](Project.md).

The demo includes all 77 provinces, map controls, student cards, name search,
province filtering, a keyboard-accessible list, WebGL fallback, and explicit
stress datasets. It uses fictional students only. Profile/project destinations
are placeholders. Production login and the protected data API are not connected.

## Try it locally

Use Node.js 24 and npm. Dependencies are installed in this workspace.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173/ (or the address Vite prints) for the map-first review:
three sculpted sample awards on a navy Thailand map: a gold trophy, silver medal
and bronze medal. Hover smoothly turns awards toward you; click/Enter centers and zooms toward
the award and reveals its named award choices. Thought-bubble dots lead to
floating student portraits. Tap a portrait: the bubble pops with a brief visual
burst and quiet sound, revealing an enlarged student above a rounded project
card. Name above the portrait, gold award title, project image/title/description
and one bottom-left **ดูโปรไฟล์ ↗** text link follow the supplied sketch.
Close re-forms the bubble. The visible sound control mutes the local effects.
Escape closes the preview first, then returns to the prior camera view;
pointer dismissal gathers the bubbles into the award before camera return.
Background click closes the whole flow in that order. Reset returns to the full map.
Awards and recipients are explicitly fictional demo assignments.
The initial/reset view uses an oblique angle. Main awards float with a
15-degree lean; hovering or selecting a province turns its whole award set toward you.
Preview text boxes and native tooltips are removed; accessible names remain.
The custom trophy and medals share a sculpted metal/navy enamel style, with
rounded rims, raised stars and shaped ribbon tails. No model downloads are needed.
Land islands share rendering batches within each province to reduce fall stutter;
the province-by-province sky entrance keeps its 2.2-second timing.
Smaller 3D medals orbit them on inclined paths with real front/back depth. Warm
constellations and mint province highlights celebrate the samples. Provinces fall
straight down from above the viewport over 2.2 seconds; interaction or reduced
motion settles them immediately.
Pause starlight freezes floating, orbit and twinkle. Artwork is generated locally, with no downloaded
models or new dependency.

The default stays exactly three fictional students. Open
http://127.0.0.1:5173/?fixture=group to try eight recipients, multiple awards,
five visible bubbles and a scrollable **ดูทั้งหมด** list. The same expanding
preview fits phones. Translucent frosted bubbles have clear outlined rims and
gently drift. Float freezes on hover/focus, pause and hidden tabs;
reduced motion and keyboard preview changes are immediate.
http://127.0.0.1:5173/?view=recipients opens the accessible award directory
without WebGL. Geometry/WebGL failures automatically offer that directory.

Open http://127.0.0.1:5173/?view=explorer for the integrated demo. Start with the three
fictional students. Select a pin or a maker in the list. Close the card with
Escape, Close, or the backdrop. Search names and filter provinces together.

Drag to pan, scroll/pinch to zoom, right-drag/two-finger drag to tilt. Map controls
also provide zoom and reset. A cluster opens its full member list and zooms in.
At maximum zoom, members fan out in pages, with the full group still in the list.
The List button and Skip to student list link provide the keyboard path.

Use **Test dataset** below the explorer for 500 makers across Thailand, 500 in
Bangkok, an eight-maker group, or long-name/opt-out fixtures. The edge mode has
four visible students: the hidden fixture is excluded. The default stays three.

See [the test guide](Docs/testing.md) and [latest handoff](HANDOFF.md).

## Checks

```sh
npm test
npm run typecheck
npm run typecheck:browser
npm run build
npm run preview
```

Browser regression tests use isolated headless Chromium, with a separate server
on port 5174 (development) or 4174 (production preview):

```sh
npx playwright install chromium
npm run test:browser
npm run test:browser:preview
```

If using an already installed compatible Chromium, set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable. Browser tests never use a
user profile or signed-in browser. Screenshots/traces are under ignored
`test-results/`; these are synthetic demo artifacts, not visual approval.

## Synthetic exports

```sh
npm run mock
npm run mock -- --count 500 --seed 42 --out mock-output.json
```

Output files must not already exist. Counts 0 through 10000 are accepted by the
export CLI; the UI exposes only its named test datasets. Generator output is
unchanged by map integration. All avatar URLs are null and profile/project URLs
use `.invalid`. No real student data belongs in this repository.

## Structure and attribution

- `src/data/`: strict opt-in and manual featured-project preparation.
- `src/mock/`: deterministic fixtures and JSON generator.
- `src/geo/`: licensed province loader, anchors and contained deterministic jitter.
- `src/scene/`: Three.js map, instanced pins, controls and marker interaction.
- `src/cluster/`: deterministic screen grouping and fan-out.
- `src/ui/`: shared modal, safe link handling and scene error boundary.
- `tests/`: browser interaction and fallback checks.

Province boundaries: GeoThai, from OCHA COD-AB and the Royal Thai Survey
Department; geometry CC BY 3.0 IGO, names/codes CC BY 4.0. The app displays
attribution. The bundled asset retains notices. See [source and transformations](Docs/02-map/geometry-source.md).

Colors follow observed Hamsterhub CSS; typography uses local/system fallbacks.
No remote fonts, logos or student images are fetched. [Site observations](Docs/08-polish/site-inspection.md)
distinguish confirmed styling from unknown host integration.

## Production boundary

This demo has no login enforcement. Do not connect real records until member
authentication, server-side consent/project visibility filtering, approved names,
and guardian-consent ownership are confirmed and implemented. Noindex is present;
it is not access control. Featured project remains explicit manual selection or
null; an automatic newest-project fallback is unconfirmed.

Read [Agent.md](Agent.md), [Docs/README.md](Docs/README.md), and the relevant package
plan before editing. Claude Code review continues in session
`48545807-0b52-412a-b2d1-083631e09f24`; task packets and recorded decisions are in
`Docs/agents/`. The private GitHub repository is
[dulch29/hamsterhub-hall-of-fame-map](https://github.com/dulch29/hamsterhub-hall-of-fame-map).
The initial commits preserve the demo, workflow documents and frozen Graphify
snapshot separately. No deployment was made.
