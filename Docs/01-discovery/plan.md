# Plan — Discovery and decisions

Status: public site URL/CSS inspected; host integration and organization decisions remain open.

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
