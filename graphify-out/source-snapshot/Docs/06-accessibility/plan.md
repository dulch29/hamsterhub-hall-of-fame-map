# Plan — Accessible list and WebGL fallback

Status: pending.

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
