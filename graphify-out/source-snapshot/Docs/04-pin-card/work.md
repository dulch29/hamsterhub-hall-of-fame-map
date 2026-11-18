# 04 — Pin Card and links

Milestone: M2. Owner: Codex; scene selection wiring belongs to the lead.

## Scope

Show the selected student's avatar or initials, approved display name, province, and one resolved featured project. The project shows its title, short description, and thumbnail when present.

Provide "View project" and "See more" actions using the project's URL and the student's Profile URL. Missing projects show "No featured project yet" and omit the unavailable project action. Keep the Profile action available.

Support closing with Escape, the close button, and map-background clicks. Load project thumbnails only when the card opens. Share the selected-student behavior with the accessible list.

Proposed files: `src/ui/PinCard.*`, `src/ui/links.*`, and focused UI tests where supported.

## Dependencies

Package 03 resolves featured data; package 02 supplies selection events. Production URL formats and final styling depend on package 01. `.invalid` mock links remain synthetic.

## Completion criteria

- [ ] Pin selection opens the correct student's card.
- [ ] The card shows exactly one resolved project or the empty state.
- [ ] Missing/broken images and long names keep the content usable.
- [ ] Both actions use the correct destination.
- [ ] Close behavior and focus restoration work for map and list entry points.

Continue with [the implementation plan](plan.md).
