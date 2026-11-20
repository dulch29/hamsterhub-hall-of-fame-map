# Phase 3 — Province discovery and hamster guides

Delivery plan, 2026-11-20, Asia/Bangkok. Resumed-session decisions and the first
implementation milestone (Task 040) are agreed. Task 040 is implemented locally
on `codex/phase-3`; verification is recorded in its task packet. Read the
[entry handoff](../agents/handoffs/2026-11-20-phase-3.md) for the verified base,
source map, interview corrections and continuation instructions.

## Intended journey

Guide welcomes the visitor and introduces the map. Selecting a province's medal
temporarily focuses the award and forms recipient bubbles. This restores the
user's accepted visual experience; Explainer travel/narration will accompany it
in the later character slice. Always offer View all recipients, opening the
sketched province list. Rows show portrait, nickname/full name and featured competition. Selecting
a student opens their competition list, manually featured-first. Selecting a
competition opens its associated project/presentation and description, with the
student taking the Explainer's position beside the panel. Presentation arrows
advance ordered image slides. Offer an Open PDF action when a PDF is supplied;
rendering PDF pages inside the panel is outside this agreed approach.

Guide remains available in a minimized chat control. Explainer's speech and
movement may overlap; input should remain interruptible. Both roles are distinct.
Spoken narration starts after a user gesture; text remains available. The user
accepted temporary artwork while official character assets are requested.

Use the saved [reference sketches](phase-3-references/README.md) for composition
and retain navy/mint/gold glass styling. The white/black sketch boxes and sample
copy are layout references, not new color tokens or product data.

Confirmed correction: **bubbles first; province list via View all**. Back/Escape
returns from project to competitions, then to the originating province bubbles
or list. List Back returns to bubbles; exiting the province recalls bubbles and
restores the saved overview position/target/zoom. Switching provinces preserves
that first origin. Close exits the whole journey through the existing finite
card/recall transitions. Directory/fallback entries open the province list
directly and exit to their invoker. Fixed-center overview rotation/fixed tilt,
no free pan and bounded zoom remain; award focus is a temporary camera exception.
Desktop follows the sketches. Phones show one bottom sheet for the current level,
with a compact character/identity header and visible map. Explainer stays beside
province and competition lists; the student replaces it only at project detail.

## Milestones and status

Task 041 restores award focus and the existing bubble lifecycle before the next
competition/detail slice. It retains Task 040's data union and province list;
Task 040's immediate-list/no-camera-travel behavior is superseded. Its packet
records the bounded restoration and current verification:
[Task 041](../agents/tasks/041-bubbles-first-province-journey.md).

[Task 042](../agents/tasks/042-reference-bubble-composition.md) refines that
entry using the user's seventh reference: left-framed award, four varied
portrait bubbles on its right and a circular See all below. The full province
list remains reachable through See all; existing material, transitions, sound,
peer spread and saved overview return remain. Competition and character work
still follows this bounded composition change.

| ID | Deliverable | Dependencies and review evidence |
|---|---|---|
| P3.0 — complete | Reliable map recovery (Task 039), deployed from main | Seven recovery checks and live review checks passed; original random trigger still unknown |
| P3.1 — complete locally; restoration in Task 041 | Fixed-center overview controls and bubbles-first province entry | Task 040 supplies the province union/list. Task 041 restores temporary award focus, floating recipients and View all. Overview keeps fixed tilt/no pan/bounded zoom; province exit restores the saved view and Reset returns home. Verify pointer/touch/keyboard, interrupted focus/return and small screens |
| P3.2 | Three-panel province/student/competition journey | Province deduplicates only visible award recipients. Student shows manually prioritized competitions. Detail resolves its explicitly associated project/presentation. Review all list entries, Back/Escape/focus, empty media, long names/text and overflow |
| P3.3 | Guide/Explainer movement, narration and student handoff | Temporary character art accepted; draft Thai scripts for review, device Thai voice where available and text fallback confirmed. Show Guide welcome, minimized/listening state, Explainer travel while speaking, student replacing Explainer and correct reverse transitions. Check interruption, mute/skip, unavailable voice, pause/reduced motion and hidden tabs |
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
- Each student's competition entry explicitly references its project and media.
  Resolve only that student's visible project; missing/stale associations show
  an empty state. Existing featured projects do not establish award linkage.
  Explicit curation is required for owner data; fictional fixtures may declare
  their own associations without changing the normal three-person dataset.
- Image slide order is explicit, with previous/next arrows and a page indicator.
  Keep the optional PDF action independent: PDF-only records offer Open PDF and
  no fictitious slides. Zero/one-slide records need no previous/next controls.
  Loading failures keep the description, Back and safe available links usable.
  The existing review has a PDF link but no image slide manifest yet.
- Use one shared selection state for map, directory, characters and later chat.
  Define states such as overview, province, student and competition detail, with
  selected IDs and interrupted transitions. Final component boundaries remain
  an implementation choice; avoid locking an unreviewed framework/API here.
- Preserve fixed-center overview controls, with a deliberate temporary award
  focus. Exit restores the saved overview; Reset restores fitted home. No free
  pan is introduced. Bubble and list entry share the same visible province union.

## Review gates and verification

Selection/camera, presentation format and first delivery scope are confirmed.
Task 040 records exact reserved ownership; Codex is the sole assigned writer and
shared/scene edits stay serialized. Reviewed narration is a prerequisite for the
character slice, not for Task 040, which contains no character or speech work.

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

Camera/entry, presentation format/explicit associations and narration approach
were confirmed when planning resumed on 2026-11-20. Use drafted Thai scripts for
review, device Thai speech when available and visible text fallback. The
[narration draft](phase-3-narration-draft.md) is proposed wording, not approved
content. Mobile/back staging and first-delivery scope are confirmed. Already
answered choices (award recipients only, two roles, manual
featured-first order, temporary art) should not be reopened without new evidence.

## Historical resumed planning checkpoint (2026-11-20)

Inspected clean `main` at `65196c9`, the entry handoff, all three layout sketches,
and the current scene/data/UI seams. Camera/media/narration approach, mobile/back
staging and the first implementation milestone are confirmed. No implementation
has started.

### Original Task 040 camera and province entry (superseded by Task 041)

- Medals alone open provinces; land-surface selection is outside this contract.
- Horizontal drag rotates around the fixed fitted Thailand center. Tilt stays
  fixed; pan is disabled; wheel/pinch and explicit zoom controls stay bounded.
  The final bounds must keep province entry usable without pan.
- Selection highlights the province and opens its panel without automatic camera
  movement. Back preserves the visitor's current angle/zoom; Reset closes the
  journey and restores the fitted home view. No automatic province framing.
- Directory entry must open the same province selection without needing WebGL.
  An interaction interrupted by another selection must never reopen stale content.

### Agreed first implementation milestone — Task 040

**Fixed-center province entry and recipient panel.** This is the
first working slice toward the already accepted complete P3.1–P3.3 review target;
it does not declare that complete review target delivered.
The concrete [Task 040 packet](../agents/tasks/040-phase-3-province-entry.md)
records the reserved files, accepted intermediate behavior, exclusions and checks.

Agreed deliverable: the camera behavior and the first sketch's province
panel, with portrait, nickname, full name and explicitly featured competition.
Resolve a province to the deduplicated union of its visible award recipients.
Keep every recipient reachable through both map and directory. During this
intermediate slice, selecting a recipient retains the existing featured-project
preview, clearly documented as transitional until the competition panel lands.
An unset featured competition remains unset; existing array order is not approval
to infer one. The user accepted this intermediate behavior with the milestone.

Acceptance criteria (implemented locally; verification recorded in Task 040):

- No pivot movement or tilt change from drag, zoom, selection, Back or resize;
  Reset restores the home view. Distinguish the new preview controls from the
  existing explorer controls before editing the shared scene.
- Bangkok's multi-recipient review lists each eligible person once; opted-out
  people are absent from rows and counts. No new achievements or project/award
  associations are inferred.
- Province switching, Back/Escape, focus return and scrolling work at 320, 390
  and 1440 widths. The panel uses the accepted navy/mint/gold style; no mascot
  asset is required for this first slice.
- Both typechecks, meaningful data tests, normal/review builds and sequential
  browser checks pass, including Task 039 recovery/fallback/retry regressions.
  Physical-phone/GPU acceptance remains separate.

Codex is the sole implementation writer on `codex/phase-3`, base `121a217`;
Task 040 reserves its write set. The user instructed implementation after
agreeing scope. Controls, province rows and the retained preview are implemented;
verification is recorded in its task packet. No deployment is assigned. Do not ask the settled
scope questions again.
Presentation format, explicit associations, narration approach and three-panel
mobile/back staging are confirmed. Script wording still needs review before the
character milestone; it does not block Task 040.
