# Plan — Pin Card and links

Status: pending.

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
