# 04 — Pin Card and links

Milestone: M2. Owner: Codex; scene selection wiring belongs to the lead.

## Scope

Show the selected student's avatar or initials, approved display name, province, and one resolved featured project. The project shows its title, short description, and thumbnail when present.

Provide "View project" and "See more" actions using the project's URL and the student's Profile URL. Missing projects show "No featured project yet" and omit the unavailable project action. Keep the Profile action available.

Support closing with Escape, the close button, and map-background clicks. Load project thumbnails only when the card opens. Share the selected-student behavior with the accessible list.

Proposed files: `src/ui/PinCard.*`, `src/ui/links.*`, and focused UI tests where supported.

Phase 2 adds a nonmodal `StudentPreview` to the default map and award directory;
the explorer still uses `PinCard`. The latest user sketch requires portrait
bubbles to expand into the project preview and collapse on Back. See
[Task 024](../agents/tasks/024-award-profile-discovery.md).

## Implemented slice (2026-11-17)

`PinCard.tsx` and scoped CSS provide a native modal dialog, initials or avatar,
province, featured project or empty state, decorative image placeholders, and
safe project/profile anchors. The starter's three student buttons select by ID.
The card mounts only on selection, so its image elements do not exist before
opening. The source implements close, Escape, backdrop handling and focus
restoration; actual browser behavior remains unverified.

`safeExternalUrl` permits HTTPS and loopback HTTP only, rejects credentials and
relative/executable URLs, and omits unsafe actions. Final production relative
profile URL handling depends on package 07.

Five server-markup tests cover content, initials, labels, image attributes,
safe anchors and the empty state. They do not execute dialog effects or events.
The Browser runtime found no connected browser during this slice.

## Dependencies

Package 03 resolves featured data; package 02 supplies selection events. Production URL formats and final styling depend on package 01. `.invalid` mock links remain synthetic.

## Completion criteria

- [ ] Pin selection opens the correct student's card.
- [x] The card shows exactly one resolved project or the empty state.
- [ ] Missing/broken images and long names keep the content usable.
- [x] Both actions use the supplied safe destination (synthetic markup checked;
  live production destinations remain pending).
- [ ] Close behavior and focus restoration work for map and list entry points.

Continue with [the implementation plan](plan.md).
