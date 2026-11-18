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
selection; reset restores the overview. Keyboard and reduced-motion travel is
immediate. Award geometry uses shared instanced batches by shape/material;
DOM targets provide names, selection and focus. Groups retain
their counts and zoom/fan-out behavior. The integrated synthetic explorer stays
available at `?view=explorer` for the later card/list workflow and accessible
fallback. This review sequence does not remove the full v1 requirements below.

**Award motion refinement (2026-11-18, Task 017):** award fronts follow the
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

- Showcase student work in a way that is fun to explore.
- Make every opted-in kid findable on the map, linking to their Profile.
- Stay usable with many pins, especially the dense Bangkok cluster.
- Run acceptably on mid-range phones (most viewers are likely on mobile **[ASSUMPTION]**).

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
