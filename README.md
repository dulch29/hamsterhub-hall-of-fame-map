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

Open http://127.0.0.1:5173/ (or the address Vite prints). Start with the three
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
`Docs/agents/`. This workspace has no Git repository and no deployment was made.
