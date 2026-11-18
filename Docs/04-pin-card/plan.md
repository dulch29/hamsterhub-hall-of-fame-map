# Plan — Pin Card and links

Status: shared modal integrated with map/list (2026-11-17); live destinations
and physical-device/assistive-technology review remain open.

## Portrait-anchored project preview (2026-11-18, Task 025)

The user's second sketch keeps the portrait stationary at its tapped location.
The card surface expands behind it, with a name above, portrait overlapping its
edge, project image before the centered title and Thai description. Near the
bottom, the card opens above the anchor. The body scrolls independently of the
close control and single underlined Profile link with a northeast arrow at the
bottom left. The previous primary/secondary buttons and project action are
removed. Data, safe links/images, focus/Escape and camera contracts are preserved.
See [Task 025](../agents/tasks/025-anchored-glass-profiles.md) for verification.

## Previous Phase 2 project preview (2026-11-18, Task 024)

The default map now uses `StudentPreview`, a labeled nonmodal region shared
with the award directory. Selecting a floating portrait expands a rounded
project card at that portrait, fitted to the viewport. Its body scrolls while
Back, Profile and the optional project action remain accessible. Back reverses
the morph and restores the invoking bubble/list button; Escape closes the
preview immediately before the group. The explorer retains its native modal.

The preview reuses `CardImage`, initials, safe destinations and the prepared
manual featured project. Local fictional SVG portraits/project images are
allowed explicitly; broken images fall back safely. Featured work is labeled
as a recommendation and is not asserted to have won the selected award.
See [Task 024](../agents/tasks/024-award-profile-discovery.md) and
[testing](../testing.md) for actual checks and remaining acceptance limits.

## Testable demo checkpoint

Map pins, fan-out and list rows select the same prepared student ID. Cards use
the full province-name table, handle missing avatar/project, trap focus natively,
and restore focus to a matching list row when the marker invoker is removed.
Browser regression covers keyboard, backdrop and missing-project flows.
See [test guide](../testing.md) and HANDOFF.md for exact evidence.

### Motion checkpoint (2026-11-17)

Native modal entrance uses opacity, 10px translation and scale .97 over 240ms;
dismissal returns along the same path over 140ms. Backdrop opacity follows it.
Exit retains the native modal until transitions settle, with a 300ms fallback.
Repeated dismissals call the parent once. Cleanup restores invoker focus.
Reduced motion closes immediately, including when preference changes mid-exit.
Native close handling ignores stale events from a StrictMode reopen.

## Historical foundation interface and checks

Claude delegated the implementation and App integration in Tasks 005/006,
session `48545807-0b52-412a-b2d1-083631e09f24`.
`PinCard({ kid, onClose })` consumes prepared data. App owns selected student
ID and conditionally mounts the keyed card. Native modal behavior currently
handles background dismissal in the card because the page becomes inert.
Revisit modal versus panel behavior when the map is integrated.

CSS is imported by App, keeping the component importable by the tsx markup
tests. No dependencies were added. The original temporary styling and absence of
animation described here are superseded by the demo and motion checkpoints above.

All 23 automated tests, type checking and production build passed. Browser
runtime discovery returned no browser. The next verification must exercise
Enter/Space, Tab containment, Escape, close button, backdrop, focus restoration
under StrictMode, image failures, and 320px long-name wrapping. Do not infer
those results from server markup.

## Steps

1. Agree the selected-student and dismiss interface with the lead, using prepared records from 03.
2. Implement the card's name/province/avatar and featured-project/empty states.
3. Centralize link handling in `src/ui/links.*`; use normal accessible anchors and define behavior for absent or invalid destinations.
4. Start thumbnail loading on card open and provide image failure handling.
5. Implement close-button, Escape, and background dismissal without dismissing clicks inside the card.
6. Choose appropriate dialog or panel semantics. For a modal, manage focus trapping and restoration; for a nonmodal panel, provide a predictable keyboard route back to the invoking control.
7. Connect map picking through the lead and list selection through 06. Use temporary styling until brand tokens are confirmed.

## Validation

Exercise each default student, the no-project case, long names, missing/broken images, project/Profile destinations, and all dismissal paths. Test opening and closing through keyboard-accessible list controls and verify focus returns. Check that thumbnails are not fetched before opening.

Run type checking and the build after integration. Mock destinations are intentionally non-live; actual production destinations are verified in 09.

## Handoff

Record the shared card API, link behavior, accessibility checks, and any remaining production URL dependency.
