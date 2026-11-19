# 06 — Accessible list and WebGL fallback

Milestone: M4. Owner: Codex; scene failure signals belong to the lead.

## Scope

Build a finished list view with province filtering and name search using the same prepared students and Pin Card as the map. Keep it available as an explicit accessible route even when WebGL works.

Automatically offer the list when WebGL is unavailable, initialization fails, or the rendering context is lost. Preserve meaningful search, filter, and selection state where practical.

Proposed files: `src/ui/ListView.*`, shared selection/search utilities if needed, and application fallback wiring.

Phase 2 extends the default page with `AwardDirectory`, a direct accessible
award/recipient route at `?view=recipients`, automatically offered on scene
failure. It shares the map's recipient resolution and expanding student preview.
The original searchable student explorer remains at `?view=explorer`.

## Completion criteria

- [ ] Search and province filter work together with a clear empty state.
- [ ] Core browse, open, follow-link, and close flows work by keyboard.
- [ ] Opted-out students never appear in results or counts.
- [ ] Missing WebGL, initialization errors, and context loss lead to a usable list.
- [ ] Map and list show the same student/project information.
- [ ] The list is reachable directly without causing a WebGL failure.

Synthetic browser coverage is recorded in the plan; production and
assistive-technology acceptance remain open.

Continue with [the implementation plan](plan.md).
