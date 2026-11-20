# Plan — Pin Card and links

## Competition presentations (2026-11-20, Task 045)

StudentPreview now retains its existing shell/pop/morph while showing the
student's manually ordered competition list. Detail resolves only an explicit
association with that student's visible project, ordered image slides and optional
PDF. Back/Escape restores the competition button, then the visible province row
or portrait bubble. Wide detail places the student beside the panel; phones use
the existing current sheet. Review export preserves explicit owner curation.
Task 044 shares the glossy film across every bubble while retaining varied sizes.
See [Task 045](../agents/tasks/045-competition-presentations.md) for actual checks
and open acceptance; character/narration work remains separate.

## Bubbles-first province journey (2026-11-20, Task 041)

Restore the existing portrait bubbles, peer spread, pop/morph and re-form/recall
with sound/mute. Use the deduplicated province union. View all always opens the
province list; list Back returns to bubbles. The featured-project preview remains
an intermediate destination and returns to its source row/bubble. Competition
and slide panels follow. See [Task 041](../agents/tasks/041-bubbles-first-province-journey.md).

## Province panel and intermediate preview (2026-11-20, Task 040)

`ProvinceRecipients` replaces the preview's award choices/floating-recipient
stage with the first sketch's scrollable province rows. Rows show portrait or
initials, supplied nickname/full name and explicitly featured competition.
Desktop uses a navy/mint glass panel; phones use one bottom sheet. Selecting a
row opens the existing `StudentPreview` with its manual featured project or empty
state. Back/Escape restores the row, then the medal/directory invoker; Close exits
directly. The competition list and slide/character journey remain later work.
The explorer still uses `PinCard`. See
[Task 040](../agents/tasks/040-phase-3-province-entry.md) for verification.

Status: shared modal integrated with map/list (2026-11-17); live destinations
and physical-device/assistive-technology review remain open.

## Visible peers while previewing (2026-11-20, Task 038)

Discovery shares pure profile geometry with StudentPreview and places other
recipients clear of the card, identity/name and logo. Phones reserve a row above
the identity; other widths choose nearby free side positions. Peer faces and
nicknames remain visible/clickable. A 260ms transform transition moves them out
and back; keyboard/reduced motion/hidden tabs settle immediately. Direct
switching retains card placement and snapshots the tapped face before moving it.
Recall accounts for the outer scale; the original saved camera/focus flow stays.
See [Task 038](../agents/tasks/038-profile-bubble-spread.md) for actual checks.

## Calmer project composition (2026-11-19, Task 037)

The user accepts project-first hierarchy inside the existing floating identity:
left-aligned light project title above the image, small muted competition label,
darker borderless navy glass and soft shadow. Keep portrait/image dimensions,
fade, no visible featured/province rows and existing bubble/exit motions. Long
descriptions use a four-line introduction with a Thai read-more/read-less button
and retained full text; each student starts collapsed. Close/Profile and the expansion control stay fixed;
the supplied PDF has a separate project action. Stable scrollbar space keeps
image widths consistent across short/long content. See
[Task 037](../agents/tasks/037-calm-project-card.md) for verification.

## Immediate return feedback (2026-11-19, Task 029)

Start the outside-bubble formation on the close action alongside the outgoing
card, preserving one formation instance across card unmount. Reveal the face
as coalescence completes; focus and layered Escape still follow preview state.
Pop trajectories clear the fitted card bounds and remain above the card without
blocking pointer input. See [Task 029](../agents/tasks/029-immediate-bubble-feedback.md)
for verification. Ocean decoration is deferred by the user.

## Previous soap-bubble handoff (2026-11-19, Task 028)

Preserve the Task 027 glass Profile card. Replace the reversed pop on close with
small bubbles merging from outside into the face bubble. Reveal the face only
as the growing membrane reaches it, rather than flashing the full face first.
Focus still returns immediately; subsequent selection interrupts the decorative
handoff. Remove the redundant preview ring. See
[Task 028](../agents/tasks/028-soap-bubble-polish.md) for actual verification.

## Previous borderless glass and portrait fade (2026-11-19, Task 027)

The user's latest refinement removes the visible featured-label and province
rows from `StudentPreview`; the manual project and hidden award/project
distinction remain. Navy frost, 20px corners and a soft shadow replace the
outlined 40px surface. A bottom gradient mask blends image and fallback
portraits into the card. The morph reads the shared corner token when settling.
See [Task 027](../agents/tasks/027-frosted-profile-card.md) for verification.

## Previous enlarged portrait and pop/return (2026-11-19, Task 026)

The newest sketch supersedes the fixed circular portrait below. Opening pops
the bubble and reveals a larger, rim-free student above the card, with name
above, gold award title, project media/title/Thai description and the sole
bottom-left Profile text link. Two local fictional SVG cutouts share the bubble
portraits' appearance; missing/broken images use an initials silhouette.
The project body scrolls independently of Close and Profile. Mobile surrounding
controls clear long names. Safe links and the manual featured distinction remain.

Closing reverses the reveal and re-forms the bubble, restoring recipient focus.
Escape can interrupt a pointer close immediately. Group switches reset stale
exit state. Province/background close finishes the preview, then recalls bubbles
before requesting camera return. See [Task 026](../agents/tasks/026-bubble-pop-and-return.md)
and its verification record for actual results; physical-device acceptance is open.

## Previous portrait-anchored project preview (2026-11-18, Task 025)

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

Task 032 removes the logo bubble's solid fill override so its film/rim/blur match
student bubbles. The native Profile scrollbar uses a rounded mint thumb on a
subtle navy rail, with CSS for Chromium/WebKit and Firefox. Content scrolling
remains native; logo reveal/float/exit are unchanged.

Task 031 stacks optional supplied nickname/full name above the portrait and adds
an optional award-logo soap bubble. It emerges from behind the card using the
existing finite morph, then floats with CSS. Desktop uses available side space;
phones use the upper corner, clear of the portrait and close target. Pause,
hidden tabs, reduced motion, interruption and cleanup remain supported.

Task 030 adds optional presentation/portrait overrides to the nonmodal Phase 2
preview. A supplied safe presentation URL makes the project image an accessible
PDF link; it does not add another Profile action. Missing Profile destinations
retain the existing unavailable state. The complete local test description is
scrollable; the production short-description contract is unchanged.

Record the shared card API, link behavior, accessibility checks, and any remaining production URL dependency.
