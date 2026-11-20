# Plan — Accessible list and WebGL fallback

## Directory alongside bubbles (2026-11-20, Task 041)

Map entry now uses bubbles first and View all for the province list. Directory
and fallback entries open the list directly, with Back/Close restoring the
invoking directory control. Both routes share the visible province union and
preview lifecycle. Preserve keyboard focus, reduced motion, missing audio and
actual WebGL recovery/retry. See [Task 041](../agents/tasks/041-bubbles-first-province-journey.md).

## Shared province path (2026-11-20, Task 040)

`AwardDirectory` now opens the same deduplicated province panel as a map medal.
Search matches supplied names, province names and competition titles; province
filtering and direct `?view=recipients` remain available without loading WebGL.
Closing restores the directory button and its filters. Geometry/WebGL/module
failure and retry retain an accessible recipient path; context restoration keeps
an open panel/preview. Fixed-center map gestures preserve discovery instead of
dismissing it. Older award-choice/bubble and saved-camera-return descriptions
below are historical. See
[Task 040](../agents/tasks/040-phase-3-province-entry.md) for actual checks.

Status: synthetic search/list/fallback implemented; assistive-technology review remains open.

## Retryable map fallback (2026-11-20, Task 039)

Temporary context loss attempts in-place recovery before offering the directory.
The default page retries one geometry request, aborts stale loading and provides
a keyboard-accessible map retry after persistent failure. A failed scene/module
download reloads the page because React caches rejected lazy imports. Recipient
data/previews remain accessible; retry clears stale scene dismissal state and
returns focus to the map/list control. See
[Task 039](../agents/tasks/039-map-failure-recovery.md).

## Phase 2 award directory (2026-11-18, Task 024)

`?view=recipients` opens `AwardDirectory` directly without initializing WebGL.
It searches supplied student names and English award titles, combined with
province filtering. Award counts and portraits resolve from the same prepared,
opted-in recipients as the map. The explicit eight-recipient fixture uses a
scrollable full list so overflow students remain reachable by keyboard.

Geometry failure, unavailable WebGL and context loss offer this directory and
the same student/project preview. Preview Back/Escape returns focus to the
recipient; group close returns to the award invoker. Default-map camera input
clears discovery, while group dismissal restores the first saved camera view.
The explorer fallback remains supported separately. See
[Task 024](../agents/tasks/024-award-profile-discovery.md) for verification.

## Testable demo checkpoint (2026-11-17)

Map/list share one prepared filtered collection. Name search combines with province
filtering, counts and an empty-state reset. List rows open the shared modal.
A skip link bypasses map markers. Geometry, module, initialization and context-loss
failures retain the searchable list. No real-data API is connected.
See [test guide](../testing.md) and HANDOFF.md for browser evidence and limits.

## Steps

1. Consume package 03's prepared collection; agree the shared selection contract with 04.
2. Implement a labeled name-search input, province selector, results count, and empty state. Use a province-name mapping covering all supported codes.
3. Add keyboard-operable student controls and render the same card content/actions used by the map.
4. Add a clearly labeled map/list switch that remains available when the scene works.
5. Connect package 02's initialization and context-loss signals to fallback state; keep list rendering independent of Three.js initialization.
6. Provide loading/error/retry behavior appropriate to the data adapter. A WebGL failure must not trigger access to an unprotected data source.
7. Verify focus visibility, control labels, reading order, card semantics, and focus restoration.

## Validation

Test combined search/filter, no matches, long names, opted-out fixtures, and empty project data. Complete the core flow using only the keyboard. Simulate unavailable WebGL, initialization failure, and context loss; verify the list remains usable.

Run relevant tests, type checking, and the build. Record browser and assistive-technology checks actually performed.

## Handoff

Provide fallback behavior and accessibility findings to 08, plus production data/loading integration needs to 07.
