# Project: Hamsterhub Hall of Fame Map

> Status: DRAFT v0.4; synthetic test demo implemented as of 2026-11-17. Production integration remains pending. Items marked **[ASSUMPTION]** are guesses to confirm. Items under **Open Questions** block or change the build.
>
> **Decisions so far:** use exactly **3 fictional kids for initial testing**; initial real-data scale remains ~100 kids; featured project is **picked manually**; the map is **member-only (login required)**; visuals match the HamQuest/Hamsterhub look; 3D.

For the current implementation, verification results, and next-session starting point, read [HANDOFF.md](HANDOFF.md). Local commands are in [README.md](README.md).

Agent responsibilities, skill selection, parallel-work planning, and context handoffs are in [Agent.md](Agent.md). The tool-facing entry point is [AGENTS.md](AGENTS.md).

## Work breakdown and plans

The work is split into ten packages in [Docs/README.md](Docs/README.md). Each package has a scope document and a separate implementation plan with dependencies, ordered steps, and validation. This file remains the source of truth for requirements and shared contracts.

| Work package | Scope | Implementation plan |
|---|---|---|
| 00: Scaffold and synthetic fixtures (M0) | [Work](Docs/00-scaffold/work.md) | [Plan](Docs/00-scaffold/plan.md) |
| 01: Discovery and decisions | [Work](Docs/01-discovery/work.md) | [Plan](Docs/01-discovery/plan.md) |
| 02: Province data and 3D map (M1) | [Work](Docs/02-map/work.md) | [Plan](Docs/02-map/plan.md) |
| 03: Shared data and featured projects (M1–M2) | [Work](Docs/03-data/work.md) | [Plan](Docs/03-data/plan.md) |
| 04: Pin Card and links (M2) | [Work](Docs/04-pin-card/work.md) | [Plan](Docs/04-pin-card/plan.md) |
| 05: Clustering and fan-out (M3) | [Work](Docs/05-clustering/work.md) | [Plan](Docs/05-clustering/plan.md) |
| 06: Accessible list and WebGL fallback (M4) | [Work](Docs/06-accessibility/work.md) | [Plan](Docs/06-accessibility/plan.md) |
| 07: Member authentication and site integration | [Work](Docs/07-integration/work.md) | [Plan](Docs/07-integration/plan.md) |
| 08: Visual polish and performance (M5) | [Work](Docs/08-polish/work.md) | [Plan](Docs/08-polish/plan.md) |
| 09: Real data, consent, and release (M6) | [Work](Docs/09-real-data/work.md) | [Plan](Docs/09-real-data/plan.md) |

Documentation split completed on 2026-11-17. The synthetic demo now includes the map, edge fixtures, cards, filters, clustering and fallback. Production integration and release acceptance remain pending. See the Docs index for package status and HANDOFF.md for actual verification.

## 1. Overview

An interactive **3D map of Thailand** for the Hamsterhub website. Each student ("kid") appears as a pin at their location. Clicking a pin shows their **featured project** and a **"See more"** link to their Profile page, where all their work lives. It works as a member-only **Hall of Fame** for student work.

Reference (visual/interaction inspiration only): https://www.maptiler.com/showcase/xmas/
**[SOURCE AND STILL VISUAL REVIEWED; INTERACTION TIMING PENDING]** On 2026-11-17
the page HTML was retrieved. On 2026-11-18 the newer Computer Use connection
rendered the live page and a screenshot was visually inspected. See
[reference inspection](Docs/08-polish/reference-inspection.md). No claim of
matching its animation timing is made. The user's accepted direction preserves
the simple extruded Thailand land and adds firefly/star-like clusters, restrained
interaction feedback and optional ambient motion.

**Current review slice (2026-11-18):** the default page is a full-viewport map
with sculpted achievement-style sample pins. No avatar, walking cat, sidebar, search or
Pin Card appears in this slice. Badges are decorative Hall of Fame markers;
they do not represent earned awards, ranks or victory records. The user approved
one combined navy/enamel/3D direction on 2026-11-18. Three explicit fictional IDs
show gold trophy, silver medal and bronze medal artwork. No award fields are
added to the student contract. Hover/focus identifies a student; activation
centers and zooms toward its province-derived anchor without opening a card.
Repeated activation keeps framing stable. Escape/background click clears
selection and restores the view from before the first award opened; switching
awards retains that return view. Manual map pan/orbit/wheel takes over and
discards the saved view. Reset restores the overview. Keyboard and reduced-motion travel is
immediate. Award geometry uses shared instanced batches by shape/material;
DOM targets provide names, selection and focus. Groups retain
their counts and zoom/fan-out behavior. The integrated synthetic explorer stays
available at `?view=explorer` for the later card/list workflow and accessible
fallback. This review sequence does not remove the full v1 requirements below.

**Current award models (2026-11-18, Task 022):** a matching original sculpted
set replaces the simpler geometry. The trophy has a curved cup, rounded lip,
shaped handles, navy star seal and rounded navy plinth. Gold/silver/bronze
medals use thick beveled bodies, double rims, raised stars, navy enamel and
folded notched ribbon tails, with solid modeled backs. Three metal variants
share the same geometry; eight instanced shape/material batches remain.
There are no external model/texture downloads or new dependencies.

**Laurel enamel direction (2026-11-20, Task 048):** the user selected option B
from the original comparison. The matching set adds raised beveled laurel leaves
around a smaller central star on medal fronts and the curved trophy seal, with
deeper medal rims and retained navy enamel. It keeps eight instanced batches,
four unique geometries, the current motion/size envelope and sample assignments.
Measured stored geometry is 7,776 triangles versus 7,024 before, below the existing
8,000 limit. The four-style isolated render retains eight calls; no placement
numerals or new award policy are inferred. See Task 048 for final verification.

**Current award motion (2026-11-18, Task 020):** resting awards lean about
15 degrees. Mouse hover or tap turns the province's main/companion fronts
toward the viewer over 280ms; leaving/clearing selection turns them back unless
the province is still hovered or selected. Interrupted turns continue from
their current pose. The preview has no award text box or native tooltip;
accessible names/descriptions remain. Ambient pause freezes bob/orbit/twinkle
while finite interaction turns remain available. Reduced motion is immediate.

**Landing performance refinement (2026-11-18, Task 021):** each province batches
its islands into one land mesh and one segmented outline. Cap/side materials,
all original triangles, holes and province transforms remain intact. The
province fall keeps its 2.2-second timing and hidden sky origin. An instrumented
1440px desktop run reduced peak WebGL draws from 1464 to 240 per frame;
physical-phone/GPU performance acceptance remains pending.

**Previous award refinement (2026-11-18, Task 019):** resting awards have a fixed
5-degree local lean. Activating an award turns every main/companion award in
that province toward the camera; other provinces keep their world orientation.
Clearing selection restores the resting direction. The orbit paths stay in
real 3D. Province landing starts entirely above the fitted viewport and falls
straight along world Y, retaining the 2.2-second overlapping wave. Continuous
360-degree main-award rotation was discussed only and is not implemented.

**Previous award refinement (2026-11-18, Task 018):** initial/reset view uses
the user's oblique reference, with the north-west upper left and south lower
right. Main awards stay upright at zero world rotation and gently float.
Smaller companion medals use actual 3D meshes on inclined atom-like orbits,
passing in front of and behind the main award with normal depth occlusion.
Companions are 34% of the main size and remain close to its center; repeated
sample awards retain individual instances. Award provinces have a brighter
mint surface and restrained emissive light; other provinces keep their blue.

The province entrance lasts at most 2.2 seconds, balancing the first fast
1.2s version and the slower 3s trial. Pause starlight stops floating, orbit
and twinkle. Reduced motion shows a static composition; hidden tabs stop the
award loop. Real 3D idle motion uses the existing WebGL renderer/context and
cached instance placements, with no idle DOM layout/projection work. This
explicit user request supersedes Task 017's camera-facing/sprite-only design
and idle-WebGL restriction. No dependencies or student contracts changed.

**Previous award refinement (2026-11-18, Task 017):** award fronts followed the
camera during orbit/tilt. The preview displays the highest-value sample large
(trophy > gold > silver > bronze) and smaller companion medals around it.
Bangkok demonstrates a trophy with gold/silver companions; Chiang Mai has
silver/bronze and Phuket bronze. These combinations are fictional artwork,
with no change to `Kid` or a production award policy. Group artwork combines
the visible members' samples without losing individual zoom/fan-out access.

Visible warm star luster and constellation lines replace the faint preview
fireflies. Each award has a celebration; extra samples add bounded light
density rather than making sparse provinces look unsuccessful. Density and
sample counts are decorative, never invented people or real achievement data.
Province meshes and outlines arrive together in a one-shot falling wave of
at most 1.2 seconds. Controls remain usable; interaction, reduced motion or a
hidden tab settles the landing immediately. Pause starlight freezes companion
float and twinkle. Main geometry draws on demand; companion artwork is rendered
locally once from the same 3D geometry and moved with CSS. The explorer retains
its existing firefly motion and Pause sparkles control.

## 2. Goals

### Phase 2 approved scope — 2026-11-18

The user approved award-to-student discovery on the default navy map:
award group → named award → its recipients in that province → student preview →
existing Hamsterhub Profile. This supersedes the default-page avatar/card deferral
above. English project/competition titles, Thai UI/descriptions, supplied names.
The initial approval used up to five stable face bubbles, an all-recipient list
and a side preview, with a bottom sheet on phones. The visual correction below
replaces those layouts. Companion medals share the group target.
Preview close returns to recipients; group close returns to the saved camera;
Escape closes one layer, background closes all, manual camera/reset clears it.

Demo award definitions (`id`, English `title`, artwork `style`) and explicit
student/award associations are separate from `Kid`. Province comes from the
visible student, with duplicate/unknown/opted-out recipients excluded. These are
fictional examples, not a production award eligibility contract. Featured work
does not imply the project won the selected award. Default remains three fictional
students; a separate group fixture verifies overflow. Full Profile, real data,
authentication and live destinations remain outside this phase. See
[Task 024](Docs/agents/tasks/024-award-profile-discovery.md).

**Visual correction (same day):** the user's sketch supersedes the panel/side
preview layout above. Thought-bubble dots connect the award to scattered portrait
circles floating directly on the map. A tapped circle expands into a rounded
project card at its position and collapses back on close. Phones fit the same
floating bubbles and expanding card to the viewport. CSS float follows pause,
hidden-tab and reduced-motion settings; keyboard expansion is immediate.

**Portrait/card refinement (Task 025):** the portrait stays at its tapped screen
position during expansion and collapse. The supplied sketch places the name
above it, with the portrait overlapping a rounded card containing the project
image, centered title and Thai description. Recipient bubbles use translucent
frosted surfaces, outlined rims and gentle floating. Thought dots fit between the
award and face edges. The two large action buttons are replaced by one underlined
Profile link at the card's bottom left with a northeast arrow; no secondary
project action. Card placement fits the viewport around the portrait anchor.

**Pop/return refinement (2026-11-19, Task 026):** the latest reference replaces
the fixed circular preview portrait with an enlarged student portrait centered
above the card, without the bubble rim. The bubble pops with small SFX/VFX;
closing re-forms it. Gold award title appears above the project image. Profile
remains the sole bottom-left text action. Closing a province gathers bubbles
into its award, then restores the saved camera; an open preview closes first.
Manual takeover/reset and reduced motion settle safely. Local synthesized sounds
follow user interaction and have a visible mute control. No production data or
new media/player/dependency is implied.

**Glass refinement (2026-11-19, Task 027):** remove the visible featured-label
and province rows from `StudentPreview`. Use a borderless frosted navy card with
20px corners and a soft shadow; fade the portrait's bottom into the card. The
manual featured selection and hidden award/project distinction remain. Solid
material fallbacks preserve readability. Existing pop/return motion is retained.

- Showcase student work in a way that is fun to explore.
- Make every opted-in kid findable on the map, linking to their Profile.
- Stay usable with many pins, especially the dense Bangkok cluster.
- Run acceptably on mid-range phones (most viewers are likely on mobile **[ASSUMPTION]**).

**Soap-bubble refinement (2026-11-19, Task 028):** the supplied references guide
clear soap films with pearly cyan/rose rims and curved reflections. Closing a
preview gathers smaller bubbles from outside into one face bubble, with a
continuous reveal at coalescence. Pop feedback uses membrane fragments and fine
droplets. Province recall and saved camera return remain. The initial/Reset map
composition follows the third reference, centering the visible silhouette while
retaining its north-upper-left/south-lower-right angle. See
[Task 028](Docs/agents/tasks/028-soap-bubble-polish.md).

**Immediate feedback refinement (2026-11-19, Task 029):** begin formation on
preview close concurrently with the outgoing card. Replace the tonal synth
effect with locally bundled licensed bubble audio, and spread pop particles
beyond the Profile card so the splash remains visible. Preserve mute, pause,
reduced motion and camera return. Ocean contours/ripples were recommended;
the user explicitly deferred implementation. See
[Task 029](Docs/agents/tasks/029-immediate-bubble-feedback.md).

**Identity/beacon refinement (2026-11-19, Task 031):** stack optional `nickname`
and `fullName` above the portrait while preserving `displayName` for search and
accessible identity. Floating student bubbles show only the supplied nickname,
falling back to display name when none is supplied. Award definitions may supply optional `logoUrl`; show that
mark in a floating soap bubble emerging from behind the Profile card, adapting
to phone bounds. Replace preview ground spheres with gold beams and expanding
ground auras. Preserve existing lifecycle/accessibility/local-data restrictions.
The supplied logo remains ignored local media. See
[Task 031](Docs/agents/tasks/031-profile-identity-and-beacon.md).

**Local test refinement (2026-11-19, Task 030):** the user authorized testing one
supplied record and media locally, with the nickname included. Use an explicit
development-only preview backed by ignored local files; no personal data/media
in tracked fixtures, documentation, logs or production output. The default demo
remains three fictional students. Keep the supplied description complete for this
preview, without changing the production short-description contract. The PDF is
presentation media, not a video. No prize rank or Profile URL is inferred.
Lower bubble audio approximately 3 dB. Production/member/consent work and ocean
decoration remain pending. See [Task 030](Docs/agents/tasks/030-local-student-preview.md).

**Bubble/scrollbar correction (2026-11-19, Task 032):** the competition logo
bubble shares the recipients' transparent soap-film material, with no pale
solid fill. Profile scrolling uses a narrow rounded mint thumb and subtle navy
track matching the glass card, with native scrolling retained. See
[Task 032](Docs/agents/tasks/032-bubble-and-scrollbar-material.md).

**Beam-only correction (2026-11-19, Task 033):** remove the gold ground pool
and expanding beacon circles, keeping only the beam from each award to the land.
Remove their animation and unused projection work. See
[Task 033](Docs/agents/tasks/033-beam-only-beacons.md).

**Public owner-review exception (2026-11-19, Task 034):** the user identifies
the supplied test record as their own and authorizes a public Vercel review
including its selected portrait/logo/project/PDF. An explicit review build
selects this record by default and publishes only prepared fields and the six
allowlisted files from ignored local input. Normal builds retain three fictional
students and exclude these files. This does not authorize other student records
or change the production member-only contract. See
[Task 034](Docs/agents/tasks/034-public-review-deployment.md).

**Main deployment source (2026-11-19, Task 035):** the user authorizes selecting
`main` as the review site's Git source before merging Phase 2. Vercel builds the
review from that branch; approved owner media are supplied by a separate static
asset deployment via `REVIEW_SOURCE_URL`, outside Git. The normal fictional build
and production member-only contract remain unchanged. See
[Task 035](Docs/agents/tasks/035-main-deployment-source.md).

**Seven-profile review (2026-11-19, Task 036):** extend only the public review
build with six explicitly fictional people: three in Bangkok and one each in
Chiang Mai, Khon Kaen and Phuket. Including the authorized owner gives seven
profiles across four provinces. Use distinct original illustrated cutouts and
project covers at the owner's source dimensions and unchanged rendered scale;
Thai descriptions stay within 15 percent of the owner's full description length.
Each profile selects its own portrait/document metadata, separate from `Kid`;
only the owner keeps the supplied presentation PDF. Metadata is validated and
filtered to prepared visible students. Fictional identities and competition
assignments are labeled test content, with no fabricated Profile/project URLs.
The regular demo remains three fictional students. This review does not change
production access/data requirements or establish physical-phone performance.
See [Task 036](Docs/agents/tasks/036-seven-profile-review.md).

**Card composition refinement (2026-11-19, Task 037):** the user accepts a
calmer student-focused card. Keep floating identity/logo and existing image
scale; lead with project title, quieter competition metadata, darker borderless
glass and soft shadow. Long descriptions start with a four-line introduction
and keyboard-accessible read-more/read-less control; retain full text. Supplied
presentation action sits with the project, Profile stays in the fixed footer.
See [Task 037](Docs/agents/tasks/037-calm-project-card.md).

**Peer-bubble spread (2026-11-20, Task 038):** opening a student pushes the other
visible recipients clear of the card, identity and competition logo. Keep peers
readable/clickable for direct switching, preserve the first card placement, and
capture each tapped face's actual position for the portrait/pop origin. Wider
screens use free space beside the card; phones reserve a row above the identity.
Closing returns peers to their original positions; award recall and camera
return remain. Finite transform transitions retarget on interruption, with
immediate keyboard/reduced-motion/hidden-tab settling. No new animation loop or
dependency. See [Task 038](Docs/agents/tasks/038-profile-bubble-spread.md).

**Phase 3 direction (2026-11-20):** the province's medal opens
award recipients only. The user wants two separate hamsters: a welcoming/Q&A
Guide and a province Explainer that travels while speaking. Latest sketches
show province student rows → selected student's manually featured-first
competition list → competition/project presentation, where the student takes
the Explainer's position. Nickname is primary with full name below. Temporary
character art and a tap to enable narration are accepted. The user's later
correction restores **bubbles first; province list via View all**. Medal selection
temporarily focuses its award and forms up to four floating recipient portraits,
using the province's deduplicated visible recipient union. View all is available
for every province and opens the sketched list. Overview rotation uses the fitted
Thailand center, adjustable tilt, bounded zoom and no pan. Award focus is a deliberate
temporary translation; leaving the province restores the saved overview view.
Back inside the journey preserves focus; Reset closes discovery and restores home.
Presentation arrows advance ordered image slides,
with an Open PDF action when supplied. Each student's competition entry must
explicitly reference its project/media; absent associations show an empty state.
The user chose drafted Thai scripts for review, device Thai speech when available
and visible text fallback, with speech enabled by a tap. The user approved the
saved Thai scripts for the Task 047 demo, which uses original temporary hamster
art, local scripted navigation help and Thai device speech with text fallback. There is no
chatbot/API yet; live AI is a later checkpoint. Back/Escape returns project to
competitions, then the originating province bubbles/list. List Back returns to
bubbles; exiting bubbles recalls them and restores the saved map. Map View all
Close returns to bubbles. Other Close controls and empty-map taps exit the full
journey through existing card/recall transitions, returning to the saved map
(or the invoking directory when WebGL is unavailable). Desktop follows the
sketches; phones use one bottom sheet with a compact character/identity header.
Explainer remains for province/competition lists; the student replaces it at
project detail. The user agreed
[Task 040](Docs/agents/tasks/040-phase-3-province-entry.md) as the first milestone:
fixed-center controls, province recipient panel and directory/recovery checks,
temporarily retaining the existing featured-project preview. Competition panels,
slide/PDF controls and characters follow in subsequent slices. Task 040's
fixed-center controls and province panel are implemented locally on
`codex/phase-3`; verification is recorded in Task 040. The user's correction is
implemented in [Task 041](Docs/agents/tasks/041-bubbles-first-province-journey.md),
restoring award focus, floating portraits, pop/morph, re-form/recall and sound/mute.
The intermediate preview returns to its originating bubble/list. Directory and
fallback entries open the province list directly and return to their invoker.
The later competition step is implemented in
[Task 045](Docs/agents/tasks/045-competition-presentations.md), with verification
recorded in its task packet. Characters/narration remain the next slice.
The user's next [entry sketch](Docs/01-discovery/phase-3-references/07-bubble-entry-layout.png)
refines this composition: trophy toward the left, four varied portrait bubbles
to its right, thought dots toward the nearest portrait and a circular See all
below. Black labeled circles are placeholders; retain the soap-film material,
supplied portraits/fallbacks and nickname labels. See all opens the complete
province recipient list, including recipients beyond the four portrait slots.
Pop/morph, peer spread, re-formation, recall, optional sound and saved camera
return remain part of the journey. See
[Task 042](Docs/agents/tasks/042-reference-bubble-composition.md).
The user's subsequent correction in
[Task 043](Docs/agents/tasks/043-award-navigation-and-orbit.md) centers the
complete visible award/bubble composition on wide screens. View all Close on
the map returns to its bubbles with the focused camera unchanged; directory
Close returns to its invoking list. An empty-map click/tap exits the full award
journey and restores the saved overview. Rotation drags and pinches retain
selection. Horizontal and vertical orbit with adjustable tilt replace the
fixed-tilt decision; existing safe polar limits, bounded zoom, no pan, Reset and
saved overview return remain.
The user accepted that interaction and confirmed one shared glossy glass finish
for portraits, thought dots, See all, logo bubbles and transient films, retaining
their varied sizes ([Task 044](Docs/agents/tasks/044-shared-bubble-finish.md)).
Task 045 replaces the temporary featured-project preview with the student's
competition list and selected competition presentation. Optional demo association
metadata contains a finite nonnegative integer `priority`, `projectId`, ordered
`slides` (`url`, `alt`) and `presentationUrl` for PDF. Explicit featured competition
comes first, then manual ascending priority, with stable ID ties. Only that
student's visible projects can resolve; missing or conflicting links stay empty.
PDF-only entries remain usable, and no preview PDF/thumbnail establishes a link.
The public review export retains supplied owner curation across competitions.
Back/Escape returns detail to competitions without replaying the shell morph;
leaving the student returns to its visible row/bubble. The student stands beside
detail on wide screens; phones keep one current sheet. No deployment is assigned.
Grander medals do not establish new placement rules. See the
[Phase 3 plan](Docs/01-discovery/phase-3-plan.md) and
[entry handoff](Docs/agents/handoffs/2026-11-20-phase-3.md). These record the next
direction and the current milestone's verification limits.

## 3. Non-Goals (v1)

- Exact home addresses or precise GPS (see Privacy).
- Editing profiles or projects from the map.
- Real-time updates (a refresh or periodic fetch is enough).
- Native mobile app.

## 4. Privacy and Safety (hard requirements)

The users are minors. The map is **member-only (decided)**: only logged-in Hamsterhub members can see it. That lowers the risk compared to a public page, but it does not remove it, because every member can still see every other member's name, avatar and province. Therefore:

0. **Authentication is enforced on the data API, not just in the UI.** A request without a valid member session gets no kid data. Hiding the page in the front end is not enough. The page should also be excluded from search engine indexing.

1. **Province-level location only.** Never store or display street, district-level, or GPS coordinates.
2. **Opt-in only.** A kid appears only if `showOnMap === true`. Default is `false`.
3. **Jittered pin positions.** The pin is placed at the province anchor plus a deterministic offset (seeded by `id`) so pins don't stack exactly and don't point to a real address.
4. **The data API never returns raw coordinates beyond province-anchor + jitter.**
5. **Parental/guardian consent** for minors is collected before the kid is added. **[OPEN: who collects it?]**
6. Thailand's PDPA likely applies to this data. Get the school/organization's legal review before launch. (This document is not legal advice.)

## 5. Data Contract

This is the contract both agents build against. **Do not change it without updating this file.**

```ts
type Kid = {
  id: string;               // stable, opaque id (not a personal identifier)
  displayName: string;      // as the kid/guardian approved it
  nickname?: string;       // optional supplied nickname, shown on its own line
  fullName?: string;       // optional supplied full name below the nickname
  avatarUrl: string | null; // null -> render initials placeholder
  province: ProvinceCode;   // one of the 77 provinces incl. Bangkok
  showOnMap: boolean;       // consent flag; false = never rendered
  profileUrl: string;       // link to the kid's Hamsterhub Profile page
  projects: Project[];      // the kid's projects (so featuredProjectId can be validated)
  featuredProjectId: string | null; // MANUALLY chosen by the kid; must be one of projects[].id
  featuredProject: Project | null;  // resolved from featuredProjectId by the data layer
                                    // null -> card shows "No featured project yet"
};

type Project = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  shortDescription: string; // <= 120 chars
  url: string;              // live project link
  createdAt: string;        // ISO date (used by the fallback rule below)
};

type MapPin = {
  kidId: string;
  position: { lng: number; lat: number }; // province anchor + jitter (computed, not stored)
};
```

**Featured project rule (decided: manual):** the kid chooses one of their own projects as featured (`featuredProjectId`). The data layer resolves it into `featuredProject`, so the map and the list view always agree.
- If the chosen project is later deleted or hidden, the data layer treats `featuredProjectId` as unset.
- **Fallback when unset [ASSUMPTION]:** show the kid's most recent project (`createdAt`), or "No featured project yet" if they have none. Confirm this.
- **Scope note:** manual picking needs somewhere for the kid to set it (e.g. a Profile setting). Whether that already exists on Hamsterhub or is part of this assignment is an open question.

**Mock data (until real data is collected):**
- Exactly 3 placeholder kids for initial testing, generated by a seeded script (reproducible). Default the generator to 3 kids; keep it configurable (`--count`) so we can test 500+ for headroom.
- Place the 3 placeholder kids in Bangkok, Chiang Mai, and Phuket; other provinces remain empty.
- Fake names and fake URLs only. No real student data in the repo.
- The 3 default placeholders include missing avatars and a missing featured project. Very long names and `showOnMap: false` (must not render) are separate test cases, keeping the default preview at 3 visible kids.

**Province geometry:**
- Needs province boundary GeoJSON (77 provinces) from an open dataset. **[OPEN: confirm source and license.]**
- Province anchor = centroid (or a hand-picked point for odd shapes).

## 6. Behavior

### Map
- 3D Thailand with orbit/pan/zoom, constrained to a sensible camera range so users can't get lost.
- Subtle visual treatment of the provinces (hover highlight is optional).

### Pins
- Rendered as **instanced** meshes (one draw call for all pins), not one object per kid.
- Hover/focus shows the kid's name as a label. Labels are only drawn for hovered or nearby pins, not all at once.
- Clicking a pin opens the Pin Card.

### Clustering (Bangkok and other dense areas)
- Pins close together on screen merge into a **cluster marker** showing a count.
- Clicking a cluster zooms in and **splits it**; at max zoom, remaining overlapping pins **fan out** in a ring or spiral.
- Cluster logic is independent of rendering so it can be unit tested.

### Pin Card
- Shows: avatar (or initials), display name, province, **one featured project** (thumbnail, title, short description).
- Actions: **"View project"** (opens `featuredProject.url`) and **"See more"** (opens `profileUrl`, where all of the kid's work lives).
- Closes with Esc, a close button, or clicking the map background.

### Fallback
- If WebGL is unavailable or fails, show a **list view** with a province filter and search by name.
- The list view is also the **accessible path**: fully keyboard navigable, same data, same Pin Card content.

## 7. Tech

- **Rendering:** Three.js installed for the map milestone; the 3D scene is not implemented in M0.
- **Development scaffold:** React + Vite for local development, pending confirmation of the Hamsterhub integration stack.
- **Hamsterhub site stack / where this mounts / backend:** **[UNKNOWN. Plan: inspect the live Hamsterhub site to find out (framework, styling, fonts, colors, how Profile URLs are built). Needs the site URL.]**
- **Visual style (decided):** match HamQuest/Hamsterhub (colors, fonts, UI components). Exact tokens come from inspecting the site.
- **Data source:** mock JSON now; real source later (possibly a Supabase table **[ASSUMPTION]**).
- **Language:** TypeScript (development scaffold).

## 8. Performance Targets **[ASSUMPTION, adjust after testing]**

- 500+ pins without noticeable lag.
- ~60 fps on desktop, 30+ fps on a mid-range phone.
- Initial load under ~3 s on a typical connection, excluding thumbnails.
- Thumbnails lazy-loaded, only when a card opens.

## 9. Architecture and Ownership

One owner per file to avoid merge conflicts.

| Area | Files (proposed) | Owner |
|---|---|---|
| 3D scene, camera, picking | `src/scene/*` (planned) | **Claude Code (lead)** |
| Clustering + fan-out logic (+ tests) | `src/cluster/*` (planned) | **Claude Code (lead)** |
| Data types / contract | `src/types.ts` | Lead (changes require updating this doc) |
| Pin Card component | `src/ui/PinCard.*` (planned) | Codex |
| Mock data generator | `src/mock/*`, `scripts/generate-mock.ts` | Codex |
| Profile/project link wiring | `src/ui/links.*` (planned) | Codex |
| List/2D fallback + search/filter | `src/ui/ListView.*` (planned) | Codex |
| Integration into Hamsterhub site | TBD | Lead |

Rules:
- Each agent works on its **own branch/worktree**. The lead reviews diffs before merge.
- Neither agent edits files it doesn't own without asking.
- This file is the source of truth. If the code and this doc disagree, fix one of them.

## 10. Milestones

The M0 scaffold uses React + Vite, shared types at `src/types.ts`, a seeded generator with 3 default students, and development/build/test commands. The current page is a minimal synthetic-data starter; branding, authentication, and the 3D scene remain future work.

1. **M0 – Setup:** **Scaffold complete (2026-11-17):** React + Vite, `src/types.ts`, seeded 3-student mock generator, and verified build/test/export commands. Open decisions below remain unresolved.
2. **M1 – Static map:** Thailand renders in 3D, camera controls work, pins from mock data appear.
3. **M2 – Interaction:** hover labels, click to open Pin Card, links work.
4. **M3 – Clustering:** Bangkok cluster, click-to-split, fan-out at max zoom.
5. **M4 – Fallback + a11y:** list view, keyboard navigation, WebGL failure handling.
6. **M5 – Polish + perf:** visual pass, mobile testing, performance tuning.
7. **M6 – Real data:** swap mock for real data, consent flag enforced, privacy review.

## 11. Acceptance Criteria

- [ ] A kid with `showOnMap: false` never appears anywhere (map, list, network response).
- [ ] A logged-out request to the map page or its data API returns no kid data.
- [ ] No exact coordinates are exposed by the data source.
- [ ] Bangkok's dense cluster is usable: every pin can be reached and opened.
- [ ] Pin Card shows one featured project and a working "See more" link to the Profile.
- [ ] Missing avatar / missing featured project are handled without errors.
- [ ] Works on a mid-range phone and on desktop, and degrades to the list view without WebGL.
- [ ] Core flows are keyboard accessible via the list view.

## 12. Open Questions

Resolved: scale (~100 first, with only 3 placeholder kids for initial testing), featured-project rule (manual), audience (members only), visual style (match HamQuest).

1. **Hamsterhub site URL and stack:** https://www.hamsterhub.co/ supplied and public CSS inspected on 2026-11-17. Host repository, authenticated mount point and session/API integration remain unconfirmed.
2. **Where does the kid pick their featured project?** Does Hamsterhub already have a place for it (Profile settings?), or do we need to build it? Is the fallback when unset (most recent project) OK?
3. **Real data:** where will it live (Supabase table, other), and who collects province + consent from the kids?
4. **Province geometry source and license:** GeoThai 77-province geometry selected. Boundary license: CC BY 3.0 IGO; names/codes: CC BY 4.0. Source, attribution and transformations are in Docs/02-map/geometry-source.md.
5. **Who counts as a member?** All logged-in accounts, including other kids and any adults/parents? Are guardians/the organization OK with every member seeing each kid's name, avatar and province? Consider a "first name or nickname only" rule.

## Synthetic test demo checkpoint (2026-11-17)

The demo includes 77-province 3D geometry, contained province-anchor jitter,
instanced pins, cluster zoom/fan-out, shared cards, combined search/filter and
a list fallback. See [testing guide](Docs/testing.md) and [HANDOFF.md](HANDOFF.md)
for exact evidence and limits. Historical scaffold/pending descriptions above
refer to earlier milestones. No production acceptance box has changed.

Claude Task 009 delegated scene/shared integration to Codex for this bounded demo.
Geometry and clustering workers used disjoint scopes; the coordinator serializes
shared changes. Git was initialized on 2026-11-18 and the current baseline was
pushed as three snapshot commits to the private repository
https://github.com/dulch29/hamsterhub-hall-of-fame-map . No deployment exists. Production
authentication, protected API, consent and live destinations remain required.
