# Phase 3 — Province discovery and hamster guides

Draft delivery plan, 2026-11-20, Asia/Bangkok. Accepted product direction is
recorded below; milestone acceptance and remaining details must be settled in
the new session. No Phase 3 application implementation is complete. Read the
[entry handoff](../agents/handoffs/2026-11-20-phase-3.md) for the verified base,
source map, interview corrections and continuation instructions.

## Intended journey

Guide welcomes the visitor and introduces the map. Selecting a province's medal
starts Explainer travel and narration, opening that province's award recipients.
Student rows show portrait, nickname/full name and featured competition. Selecting
a student opens their competition list, manually featured-first. Selecting a
competition opens its associated project/presentation and description, with the
student taking the Explainer's position beside the panel. Presentation arrows
probably advance slides; exact media handling is still open.

Guide remains available in a minimized chat control. Explainer's speech and
movement may overlap; input should remain interruptible. Both roles are distinct.
Spoken narration starts after a user gesture; text remains available. The user
accepted temporary artwork while official character assets are requested.

Use the saved [reference sketches](phase-3-references/README.md) for composition
and retain navy/mint/gold glass styling. The white/black sketch boxes and sample
copy are layout references, not new color tokens or product data.

## Proposed milestones

| ID | Deliverable | Dependencies and review evidence |
|---|---|---|
| P3.0 — complete | Reliable map recovery (Task 039), deployed from main | Seven recovery checks and live review checks passed; original random trigger still unknown |
| P3.1 | Fixed-center rotation and a clear province entry | Settle medal/land hit targets and focus/return behavior. Drag changes horizontal angle, never pans or relocates pivot; wheel/pinch remain bounded. Check pointer/touch/keyboard, reset, rotation after selection and small screens |
| P3.2 | Three-panel province/student/competition journey | Province deduplicates only visible award recipients. Student shows manually prioritized competitions. Detail resolves its explicitly associated project/presentation. Review all list entries, Back/Escape/focus, empty media, long names/text and overflow |
| P3.3 | Guide/Explainer movement, narration and student handoff | Temporary character art accepted; reviewed Thai province text and narration source still needed. Show Guide welcome, minimized/listening state, Explainer travel while speaking, student replacing Explainer and correct reverse transitions. Check interruption, mute/skip, text fallback, pause/reduced motion and hidden tabs |
| P3.4 | More glorious award models | Approve a bounded visual option before model work. Keep clear fronts, strong depth/metal detailing and the current palette; numeral reference must not invent placement data. Compare appearance and render/geometry cost on desktop/phone |
| P3.5 | Live conversational Guide and navigation actions | No chatbot/API exists yet. Agree provider, server integration, credentials, costs, content boundaries and allowed navigation actions. Text chat first; verify recommendations open only supplied student/project IDs and ordinary manual browsing survives service failure |

The user accepted P3.1–P3.3 as the next review focus with live AI separate. Boss's
requested date was 2026-11-20. This is a priority, not an estimate or promise that
all milestones fit that day. P3.4 can be reviewed independently after scope/art
agreement. Keep incomplete milestones visibly incomplete.

## Contract work before P3.2/P3.3

- Reuse prepared/opted-in records and existing province/award IDs. A province is
  the union of its explicit award recipients; a student with several memberships
  appears once there, with all their authorized competitions reachable.
- Add manual featured competition and ordering metadata through a documented
  demo/preparation contract. Do not infer priority from array accident, title,
  artwork, date, AI response or award rank.
- Current award associations reference students, while featured projects are
  selected independently. Define competition-to-project/presentation linkage
  explicitly before presenting work as belonging to that competition. Do not
  imply the current featured project won a selected award without source data.
- Keep presentation order, image/PDF representation and missing-media behavior
  explicit. The existing review has one supplied PDF link; it has no slide data
  model or in-card page viewer. Do not assume the arrows are already supported.
- Use one shared selection state for map, directory, characters and later chat.
  Define states such as overview, province, student and competition detail, with
  selected IDs and interrupted transitions. Final component boundaries remain
  an implementation choice; avoid locking an unreviewed framework/API here.
- Define automatic focus/return with a fixed rotation pivot. Existing award zoom
  translates camera and controls target, so simply disabling pan does not satisfy
  fixed-center rotation. Do not silently preserve the old pivot-changing travel.

## Review gates and verification

Before source changes, confirm the selection/camera contract, presentation format,
reviewed province narration and first delivery slice. Record exact file ownership
in a task packet; Codex has been sole writer, and shared/scene edits stay serialized.

Use meaningful pure tests for province unions, deduplication, opt-out exclusion,
multiple competitions, manual priority and missing/stale association targets.
Run both typechecks, units, normal and explicit review builds. Browser tests run
sequentially with one worker/tracing off; cover at least 320, 390 and 1440 widths.
Check the complete three-panel journey, switching/interrupting travel, keyboard
and focus, slide controls/empty media, voice/text/mute, reduced motion, pause,
hidden tabs and WebGL recovery/fallback/retry. Preserve Task 039 regressions.

Physical-phone/GPU/FPS and subjective motion/audio acceptance are separate from
desktop emulation. Publish only checked slices through main; preserve the existing
meeting review until each replacement is reviewable. Do not claim live AI from
scripted dialogue or listen animation alone.

## Boundaries and next decisions

Normal builds still contain exactly three fictional students; public review
keeps its explicit seven-profile dataset. Owner data/media remain outside Git.
Only province-level locations and strict opt-in are permitted. Production
authentication, data integration, Profile editing and live Profile destinations
are unresolved; this demo does not supply them. Ocean decoration remains held.

Settle three dependent decisions in the new session: medal-only versus additional
land hit targets and camera framing; PDF/image slides with explicit competition/
project links; narration/content source and the first complete review slice.
Use the sketches to confirm staged character placement, Back/Escape and mobile
layout. Already answered choices (award recipients only, two roles, manual
featured-first order, temporary art) should not be reopened without new evidence.
