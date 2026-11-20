# Plan — Discovery and decisions

Status: public site URL/CSS inspected; host integration and organization decisions remain open.

## Bubbles-first correction (2026-11-20, Task 041)

The user confirmed bubbles first, with the province list via View all. Restore
controlled award focus, pop/morph, re-form/recall and sound/mute; preserve the
visible province union, directory and recovery. This supersedes Task 040's
immediate list and no-camera-travel choices. Competition/media and character
milestones remain separate. See [Task 041](../agents/tasks/041-bubbles-first-province-journey.md).

## Phase 3 continuation (2026-11-20)

Use the [Phase 3 plan](phase-3-plan.md),
[saved sketches](phase-3-references/README.md) and
[entry handoff](../agents/handoffs/2026-11-20-phase-3.md) to resume the user
interview. Award recipients only, two hamster roles and manual featured-first
competition order are accepted. Resumed planning confirmed medal-only entry,
fixed-center rotation/fixed tilt/no pan, bounded zoom, no selection camera travel,
Back preserving the view and Reset returning home. Image slides use arrows, with
an optional Open PDF action and explicit competition/project/media associations.
Draft Thai scripts for review, device Thai speech when available and visible
text fallback are confirmed. Back/Escape returns one level at a time; Close exits
directly. Desktop follows the sketches; mobile uses one bottom sheet with a compact
character/identity header. The first slice is agreed:
[Task 040](../agents/tasks/040-phase-3-province-entry.md), fixed-center controls
and province recipient panel, temporarily retaining the featured-project preview.
Task 040 is complete locally by Codex on `codex/phase-3`; verification is in its
task packet and HANDOFF.md. Script
approval remains pending for the later character milestone and does not block
Task 040. The user subsequently approved the saved Thai scripts for the Task 047
demo; its task packet records the character/narration implementation and checks.

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
