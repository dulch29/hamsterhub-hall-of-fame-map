# Task 045 — student competitions and project presentations

2026-11-20. Sole writer Codex on `codex/phase-3`, following Task 044.
The user authorizes building the next agreed Phase 3 milestone (P3.2).
The accepted Phase 3 plan and saved sketches 05/06 define the design.
No deployment is assigned. Characters/narration remain P3.3.

## Contract and behavior

- Bubbles or province rows open the student's competition list, with identity
  above the glass card. Preserve peers and the existing pop/morph transition.
- Featured competition first, then explicit ascending manual priority. Unset
  ties use stable award IDs only for deterministic display, not inferred rank.
- Extend only the demo association contract with optional priority, project ID,
  ordered image slides (`url`, `alt`) and PDF URL. Group metadata retains these
  explicit associations. Production Kid/Project contracts remain unchanged.
- Resolve a project only from that student's visible prepared projects. No
  featured-project fallback or inferred owner linkage. Conflicting duplicate
  association metadata remains unset. Missing/stale links show an empty state.
- Competition detail shows competition title, its linked project/description,
  explicit image slides with arrows/page indicator, and optional Open PDF.
  Zero/one slides have no arrows. PDF-only entries remain useful. Broken/unsafe
  media keep navigation and description available. No autoplay or media fetch
  before detail selection.
- Desktop follows the sketches, with student identity above the competition
  panel and beside detail where space allows. Phones use one current sheet and
  compact identity. Back/Escape returns detail to competitions, then its source
  row/bubble. View all Close returns to bubbles. Full Close/empty map exits and
  restores the saved view. Reset, switching, pause/reduced motion, hidden tabs,
  directory/fallback and graphics recovery preserve valid selection/focus.
- Keep three default fictional people. Explicit fixtures demonstrate multiple
  competitions, ordered slides and missing associations. Review fictional
  records may be explicitly linked; owner records need actual supplied curation.

## Serialized scope and implementation steps

1. Add association/group metadata, validation and pure competition resolution
   with meaningful tests; register the suite in `package.json`.
2. Add curated demo/review fictional data and local slide artwork. Preserve
   ignored owner inputs/media. Carry curation through `scripts/build-review.ts`.
3. Reuse StudentPreview's shell/morph for the competition list and a focused
   presentation component. Wire selected competition in MapPreview, shared with
   AwardDiscovery. Keep the existing camera/recovery implementation.
4. Add panel/slide styles and focused browser coverage; update affected existing
   checks for the intentional extra navigation level. Verify the whole journey.
5. Run both typechecks, units, normal/review builds and serial Edge checks with
   one worker/tracing off. Inspect 320/390/1440 layouts and actual context recovery.
6. Record results and next milestone, commit reviewable slices, then refresh the
   targeted Graphify checkpoint. No publish, backend or dependency changes.

Writable files: `src/data/{demoAwards,localPreview,studentCompetitions}*`,
`src/mock/{discovery,reviewScale}.ts`, `src/ui/{MapPreview,AwardDiscovery,
StudentPreview,CompetitionContent,discovery.css,bubbleLayout,useBubbleMorph}*`, selected browser
suites, `public/demo/` slide artwork, `scripts/build-review.ts`, `package.json`
test registration, and coordinated Docs/Project/Agent/HANDOFF/Graphify outputs.

## Result and verification

Complete locally, following Task 044 commit `88cc921`. The list/detail uses the
existing student shell and bubble lifecycle. Wide detail puts the student beside
the panel; mobile leaves bottom controls clear. Back restores the competition
button and list scroll after applying its geometry. Boundary slide arrows retain
focus with aria-disabled and clamped handlers, so Escape continues to work.
Opening morph completion preserves focus already inside the selected detail.
Recovery that falls back to the directory returns to the corresponding visible
province row. No owner media/project/PDF association is inferred.

- `npm test`: **125/125** pass.
- `npm run typecheck:browser`: pass. Normal `npm run build` runs `tsc -b` for
  application TypeScript and builds successfully; `npm run build:review` passes.
- Initial compiled affected run: 49/52. One obsolete project-preview assertion
  and a native disabled-arrow focus bug caused three failures; these are fixed.
- Final compiled Edge run: **30/30** across competition-presentations, discovery
  and bubble-province suites, one worker, tracing off. Includes 320/390/1440,
  slides/alt text/loading failure, PDF-only/empty links, nested Back/scroll/focus,
  peer switching, rapid navigation during opening morph, full Close/background
  exit, pause controls and actual context restoration/timeout/focus recovery.
  Unchanged navigation/orbit/material/composition/recovery checks also passed
  in the initial run; all **55 distinct affected checks** pass across these runs.
- Compiled seven-profile review passes at **320/390/1440 × 844**: all seven
  reachable across four provinces, correct explicit media and owner isolation,
  pointer controls, nested focus and actual context loss/restoration. Zero page
  errors. Normal and review screenshots were inspected.
- Independent source review found the opening-focus race and scroll ordering;
  both are fixed. Final source re-review reports no unresolved actionable issue.

Evidence stays outside Git in `%TEMP%/hamsterhub-045-*`,
`%TEMP%/hamsterhub-phase3-045/` and ignored `test-results/`. Physical-phone/GPU/FPS,
subjective appearance/motion, designated lead acceptance and the existing large
scene-chunk warning remain. No deployment performed. Next is P3.3 characters and
narration, whose Thai script wording still requires review. Graphify records this
slice through its task045 provenance, hashes, semantic coverage and validation.
