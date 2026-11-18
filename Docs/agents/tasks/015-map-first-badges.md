# Task 015 — Map-first achievement pins and Git baseline

Date: 2026-11-18. Coordinator: Codex. Accountable scene lead: Claude Code.

## User direction

The boss wants the map first, with no avatar or application UI yet. The user
clarified that this includes pins, styled for a Hall of Fame: awards, victory,
and badges. The user also explicitly requested creating the GitHub repository
now, with commits/pushes split into useful history.

## Concrete proposed slice

- Make a full-viewport map the default preview. Retain the integrated synthetic
  explorer at `?view=explorer` for existing card/list/fallback verification.
- Replace star/firefly pins with warm gold, enamel-style star medals and ribbon
  tails. All students use the same decorative symbol. No ranks, award records,
  winner titles, or achievement claims are added to student data.
- Clusters use the same badge family with a count. Preserve grouping, zoom,
  fan-out, keyboard focus, province-only positioning and strict opt-in.
- Keep map navigation and a motion-pause affordance discreet; no sidebar,
  cards, search, avatars or walking cat in the default preview. Map failure
  gets an accessible text fallback with a link to the existing explorer.
- Keep the simple extruded Thailand geometry and Hamsterhub palette. Use the
  installed stack, no new dependency. Keep reduced-motion and on-demand render.
- Computer Use retry still fails before window discovery with:
  `failed to launch codex app-server: The system cannot find the path specified. (os error 3)`.
  Reference visual inspection remains pending. No alternate reference browser
  tool or claimed visual matching.

## Requested lead response

Review this design against the supplied source. Confirm a bounded assignment
for Codex to serialize edits to `src/scene/ThailandMap.tsx`, `src/App.tsx`,
`src/styles.css`, a new map-preview component, affected browser tests,
Project.md, Agent.md, README.md, HANDOFF.md and packages 02/08 notes. Shared
types and data contracts should stay unchanged. No concurrent code workers.
Identify concrete blockers or risks; do not require a new human permission
gate for the actions the user already requested. You have no tools and must
not claim to execute checks.

## Verification plan

Existing unit suites, typecheck and production build. Browser checks for the
map-first shell, badge hover/focus/selection, reduced motion, dense clusters,
mobile sizing and continued explorer behavior. Record real checks separately
from unavailable reference visual review and physical-device acceptance.

## Git plan

Create Git on main, preserve the existing demo as one coherent baseline, agent
documentation as another, and portable Graphify artifacts as a third. These
are current snapshots, not reconstructed historical milestones. Exclude
dependencies, builds, environment files, exchange requests/responses, test
outputs and graph caches. Create the requested remote under the authenticated
GitHub account. Keep feature implementation in its own branch/commits.
