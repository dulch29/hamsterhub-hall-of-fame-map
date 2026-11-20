# Plan — Discovery and decisions

Status: public site URL/CSS inspected; host integration and organization decisions remain open.

## Phase 3 continuation (2026-11-20)

Use the [Phase 3 plan](phase-3-plan.md),
[saved sketches](phase-3-references/README.md) and
[entry handoff](../agents/handoffs/2026-11-20-phase-3.md) to resume the user
interview. Award recipients only, two hamster roles and manual featured-first
competition order are accepted; camera selection/framing, slide associations
and narration/content remain to be settled. No Phase 3 app changes are complete.

## Testable demo checkpoint (2026-11-17)

User supplied https://www.hamsterhub.co/. Confirmed public CSS colors and framework
asset clues are in [site-inspection.md](../08-polish/site-inspection.md).
No authenticated route, profile format, backend or membership session is inferred.
The synthetic local demo can be tested independently of those remaining decisions.

## Steps

1. Review Project.md's open questions and the decision register in Docs/README.md.
2. Obtain the site URL from the project owner when starting site-specific work. Continue independent synthetic-data and geometry tasks while it is unavailable.
3. Inspect the site and linked reference. Record observed framework clues, actual visual tokens, navigation patterns, and Profile URLs; distinguish observations from guesses.
4. Confirm the mount point and backend/session integration with the site maintainer.
5. Resolve the featured-project setting and unset-selection rule before implementing fallback behavior or expanding Profile scope.
6. Confirm who can view the map, what display names are allowed, who collects consent, and where production data will live.
7. Record geometry source/license evidence through package 02.
8. Update Project.md and affected plans with confirmed answers and remaining blockers.

## Validation

Check that every open question has an answer or an explicit unresolved dependency. Include evidence for researched facts. Do not mark a decision resolved solely because a possible solution was written down.

## Handoff

Packages 02 and 03 can proceed on their independent mock-data portions. Packages 07, 08, and 09 consume the relevant confirmed decisions.
