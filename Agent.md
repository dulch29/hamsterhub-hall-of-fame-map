# Agent guide — Hamsterhub Hall of Fame Map

Updated: 2026-11-20.

This guide defines how agents work on this project. [Project.md](Project.md) defines product requirements and contracts. [Docs/README.md](Docs/README.md) defines the ten work packages. [HANDOFF.md](HANDOFF.md) records the implementation baseline; inspect current files before relying on its historical checks.

## Start here

1. Read this guide and the relevant sections of Project.md.
2. Read the selected package's `work.md` and `plan.md`, then the relevant HANDOFF.md entries.
3. Inspect the files, tests, and shared types involved in the task.
4. Check repository/worktree state and confirm the task's file assignment before editing.
5. Load only the skills needed for that task from the [skill map](Docs/agents/skills.md).
6. Implement one reviewable slice, run appropriate checks, and record the actual result.

Use the [multi-agent plan](Docs/agents/multi-agent.md) for delegation and the [context protocol](Docs/agents/context.md) for task packets and handoffs.

For an actual Claude Code review conversation from Codex, use the [CLI communication guide](Docs/agents/cli-communication.md). The bridge records task/context snapshots, replies, and a resumable session ID; its Claude tool set is empty.

## Project baseline and constraints

- Standalone React + TypeScript + Vite scaffold; Three.js is installed. Production host stack and backend remain unknown.
- Synthetic demo includes the 77-province scene, clustering, cards, search/list and WebGL fallback. See HANDOFF.md for current verification. Member authentication and production data remain pending.
- Default review page is the navy map with three sculpted sample award groups and individual zoom. Phase 2 adds named award choices, floating recipient portraits and expanding project previews; see Task 024. The integrated synthetic explorer remains at `?view=explorer`.
- Git now tracks this workspace; private remote: `dulch29/hamsterhub-hall-of-fame-map`. Keep changes in meaningful commits. The first three commits import current snapshots, not reconstructed historical milestones. Do not commit environment files, dependencies, build/test output, exchange payloads or Graphify caches.
- Default preview: exactly three fictional students in Bangkok, Chiang Mai, and Phuket. Larger datasets and edge cases are explicit fixtures.
- Only province-level student locations. Pin coordinates derive from province anchors plus deterministic ID-seeded jitter.
- `showOnMap` defaults to false for production records. Exclude opted-out students from the API, map, list, and counts.
- Production access requires server-enforced membership. Client route hiding and noindex metadata do not provide access control.
- Featured selection is manual and must reference the student's own visible project. The newest-project fallback remains unconfirmed; preserve explicit selection or null until decided.
- Match HamQuest/Hamsterhub once its actual tokens are known. Do not invent a replacement brand or assume a production backend.
- No real student data, secrets, or session tokens in fixtures, documentation, logs, or source control.

## Responsibility model

Claude Code is the designated lead in Project.md. Codex owns the assigned UI/mock work. These are responsibility assignments, not evidence that either tool or any worker is currently running.

| Responsibility | Accountable owner | Delegation |
|---|---|---|
| Scheduling, contracts, cross-package integration, final review | Lead | Bounded research/review support |
| Province geometry, scene, camera, picking | Lead | Geometry or scene worker with explicit file scope |
| Shared data preparation and protected source | Lead | Data worker; host implementation after discovery |
| Clustering and fan-out | Lead | Pure clustering worker |
| Mock data/export, Pin Card/links, accessible list | Codex | Separate fixture, card, or list workers |
| Visual/performance verification | Lead; UI changes by Codex | Measurement/review worker |
| Consent decisions, permitted audience, organization review | Project owner/organization | Agents document decisions and implement confirmed requirements |

Delegation preserves the accountable owner's responsibility. One worker owns each writable file during a task. The lead integrates shared files. See the detailed write-set and wave tables before starting concurrent work.

## Shared-file rules

The lead serializes changes to `src/types.ts`, `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `package.json`, `package-lock.json`, `index.html`, `tsconfig.json`, and `vite.config.ts`.

The lead also coordinates Project.md, this guide, AGENTS.md, README.md, HANDOFF.md, and Docs/README.md. Package owners may update their own package notes within an assigned task. Ask the owner to coordinate a necessary cross-owner edit rather than having competing workers modify it.

The user's request to create these agent documents authorizes this documentation change and its navigation links. It does not start implementation workers, change model assignments, initialize Git, or deploy the application.

The later user request explicitly authorized GitHub creation, split commits and
the map-first badge slice. Codex serializes Task 015 scene/shared edits on
`feat/map-first-badges`. Claude review attempts failed with `ECONNREFUSED`;
this is a recorded review gap, not a successful lead review. No concurrent
implementation writers are assigned. Run browser checks sequentially with one
worker and tracing off on this host to avoid overloading software rendering.

Task 016 is the user's approved combined navy/enamel/3D award slice. Codex is the
single writer on `codex/sculpted-award-map`; exact scope is in its task packet.
Sample award variants map only the three explicit fictional IDs. No production
award contract, dependency or downloaded model is introduced. Reviews may read
the diff; serialize all source edits and browser runs.

Task 017 extends this scene with camera-facing awards, companion medals,
constellation luster and a one-shot province landing. Codex is the sole writer
on `codex/award-constellations`, base `1ed5e4f`; see its task packet. The three
fictional students remain, with extra sample artwork only. Keep WebGL idle
after landing; continuous decorative motion uses the DOM/CSS layer. Reviewers
read source without browser/test jobs while the coordinator verifies serially.

Task 018 is the user's follow-up on `codex/award-orbit-view`, base `38b6286`.
Codex remains the sole writer. The current task packet supersedes Task 017:
upright floating primary awards, real 3D atom-like companion orbits, mint
province highlights, oblique home/reset and a 2.2s landing. The requested 3D
idle loop updates only mesh matrices using the existing renderer/context;
pause, hidden tabs, reduced motion and disposal cancel it. Keep browser runs
sequential, one worker, tracing off. No concurrent implementation writers.

Task 019 is the user's follow-up on `codex/award-focus-skyfall`, base `e5c1cd6`.
Codex remains the sole writer for scene, existing tests and task documentation.
Resting awards lean 5 degrees; all awards in the selected province face the
camera. Landing starts beyond the fitted sky edge and retains its 2.2s wave.
Continuous 360-degree rotation is an opinion request only. Keep browser runs
sequential with one worker and tracing off. See the current task packet.

Task 020 runs on `codex/award-hover-turn`, base `9055a24`, with Codex as sole
writer. It removes preview text boxes/native tooltips, adds interruptible
280ms hover/tap turns and changes the resting lean to 15 degrees. Preserve
screen-reader names, explorer labels and finite turns while ambient motion is
paused. Source, shared styles, existing tests and documentation are serialized.
See [Task 020](Docs/agents/tasks/020-award-hover-turn.md).

Task 021 is the same user's landing-lag follow-up on the same branch. Codex
continues as sole writer for province geometry batching, scene wiring,
test registration and documentation. Keep independent province transforms,
original geometry/materials and landing timing. See
[Task 021](Docs/agents/tasks/021-landing-performance.md).

Task 022 upgrades the existing award models on `codex/premium-award-models`,
base `cd479b9`. Codex is the sole writer for original geometry/materials,
existing model tests and documentation. Keep the four sample styles, eight
instanced batches, current motions and batched land. No dependency, production
award policy or real student data changes. See
[Task 022](Docs/agents/tasks/022-premium-award-models.md).

Task 023 restores the saved camera after dismissing any award on
`codex/award-return-view`, base `7072393`. Codex is sole writer for scene state,
existing preview tests and documentation. Read-only reviewers run no browser
jobs. See [Task 023](Docs/agents/tasks/023-award-return-view.md).

Phase 1 is integrated into `main` at merge `944cf74`, preserving the 20 commits
through `6e03ead`. Phase 2 is integrated into `main` at merge `dc971cf`, preserving
the commits through `ec8a230`. Continue from updated `main`; earlier feature/task
branch assignments are historical. Codex remains the single writer for this
integration/handoff. Vercel's production branch was set to `main` before merging.
See Task 035 for deployment details and the
[Phase 2 handoff](Docs/agents/handoffs/2026-11-18-phase-2.md).

## Skills

Task 024 implements the user-approved Phase 2 on `codex/phase-2`, base `482fd2c`.
Codex is sole writer for discovery data/UI, bounded scene callbacks, shared test
registration and project documentation. The user's implementation instruction
authorizes this integration; no concurrent writer or deployment is assigned.
See [Task 024](Docs/agents/tasks/024-award-profile-discovery.md). Earlier default
avatar/card deferrals are superseded for this task. Keep browser jobs sequential.
The user's later sketch supersedes the side preview/mobile sheet: portrait
bubbles float directly on the map and expand into project cards. Use CSS float
and a finite, reversible WAAPI morph; preserve keyboard, pause, reduced motion,
hidden-tab behavior and the existing saved camera return. Default still has
three fictional students; `?fixture=group` explicitly exercises eight recipients.
Task 025 is the user's refinement on the same branch, base `1494357`. Codex is
sole writer for the discovery UI, adjacent tests and coordinated documentation:
stationary portrait anchor, reference-led project card, frosted floating bubbles,
clear thought-dot placement and one inline Profile link. No scene/data changes.
See [Task 025](Docs/agents/tasks/025-anchored-glass-profiles.md).
Task 026 (2026-11-19) is a user refinement, base `4195727`, same branch
and sole writer. It adds a reference-led enlarged portrait, local pop/re-form
SFX/VFX, and bubble recall before camera return. Codex owns the bounded scene
background-dismiss request callback as well as UI/audio/fixtures/tests/docs.
See [Task 026](Docs/agents/tasks/026-bubble-pop-and-return.md).
Task 027 is the user's material refinement on the same branch, base `3e3e691`.
Codex remains sole writer for preview markup/CSS, the settled morph corner token,
the affected markup expectation and coordinated docs. Remove visible featured/
province rows, add borderless navy frost and a soft portrait-bottom fade.
See [Task 027](Docs/agents/tasks/027-frosted-profile-card.md).
Task 028 continues on the same branch from `92060f5`, with Codex as sole writer
for soap-film CSS, finite pop/coalescence effects, bounded overview framing,
affected browser tests and coordinated documentation. The user's new bubble
references supersede the reversed-burst formation. Preserve the Profile card,
award recall and saved camera return. See
[Task 028](Docs/agents/tasks/028-soap-bubble-polish.md).
Task 029 continues from `b394d9c` on the same branch, sole writer Codex:
immediate formation concurrent with card exit, locally bundled bubble audio,
visible splash outside the card and affected browser/docs verification. Ocean
decoration is on hold per the user's latest instruction. See
[Task 029](Docs/agents/tasks/029-immediate-bubble-feedback.md).

Use [the local skill selection](Docs/agents/skills.md). First inspect project `.agents/` or `.agent/` skills if present, then `C:/Users/NCS/.agents/skills/`. Read the actual `SKILL.md` before applying it. Use the session's available skill catalog to confirm plugin skills.

For this documentation work, `find-skills` and `context-engineering` were applied. Implementation skills are assigned by task; do not load the entire catalog. Skill examples do not replace actual project commands, dependencies, requirements, or the user's existing authorization.

## Local commands and validation

Task 039 prioritizes the user's random map failure while Phase 3 planning
continues. Sole writer Codex on `codex/map-failure-recovery`, base main
`2b9cc90`, owns bounded scene recovery, preview loading/fallback/retry, focused
browser checks and coordinated docs. Keep new camera/province/mascot/artwork
work outside this fix; preserve data and current discovery behavior. Verify
and update the existing review through main. See
[Task 039](Docs/agents/tasks/039-map-failure-recovery.md).

Task 038 is the user's peer-bubble spread correction, sole writer Codex on
`codex/profile-bubble-spread`, base main `e8b88ae`. Own bounded discovery/preview
layout and finite transform transitions, source snapshots, collision/switching
tests and coordinated docs. Preserve card styling/data/camera/pop flows; keep
peers visible/clickable beside the card or in a narrow-screen row. Verify and
update the existing review through main. See
[Task 038](Docs/agents/tasks/038-profile-bubble-spread.md).

Task 037 is the user's accepted calmer-card refinement during Task 036, same
branch/sole writer. Own StudentPreview styles/markup, focused checks and docs:
project-first hierarchy, quiet competition metadata, darker glass, full text
behind accessible expansion and existing image/motion scale. Deploy the combined
checked review from main. See [Task 037](Docs/agents/tasks/037-calm-project-card.md).

Task 036 extends the public review on `codex/seven-profile-review`, base
`78afdfd`, with six user-approved fictional people: three additional Bangkok
recipients and one each in Chiang Mai, Khon Kaen and Phuket. Codex is sole writer
for the explicit fixture/media, review composition, per-student preview metadata,
focused tests and coordinated docs. Preserve the authorized owner outside Git,
the normal three-person demo and main as the deployment source. See
[Task 036](Docs/agents/tasks/036-seven-profile-review.md). Browser checks remain
sequential; physical-phone and production integration acceptance remain open.

Task 035 configures Vercel's production source as `main` before merging Phase 2.
Codex is sole writer for review-build cloud input, Vercel headers and coordinated
merge/handoff docs. The owner-authorized media remain outside Git on a separate
static asset deployment. See
[Task 035](Docs/agents/tasks/035-main-deployment-source.md).

Task 034 continues from `06dfd6b`, sole writer Codex, for an explicitly public
Vercel review of the user's own supplied record. The user authorizes publishing
that record/media for this test. Keep input and review output ignored; normal
builds still exclude supplied records. See
[Task 034](Docs/agents/tasks/034-public-review-deployment.md).

Task 033 continues from `2278d55`, sole writer Codex, for beam-only award
beacons. Remove ground circles, their CSS animation and unused plane projection;
preserve beam/camera/discovery behavior. See
[Task 033](Docs/agents/tasks/033-beam-only-beacons.md).

Task 032 continues from `57ac4b2`, sole writer Codex, for shared transparent
logo-bubble material and a navy/mint native Profile scrollbar. CSS/docs only;
motion, scene, data and local media boundaries are preserved. See
[Task 032](Docs/agents/tasks/032-bubble-and-scrollbar-material.md).

Task 031 continues from `f9eb3c0`, sole writer Codex, for stacked profile identity,
an optional competition-logo bubble and replacement of preview ground spheres
with gold beacons. Bounded scene/shared/data/UI edits are serialized. Supplied
media remain ignored/local; ocean work remains on hold. See
[Task 031](Docs/agents/tasks/031-profile-identity-and-beacon.md).

Task 030 continues from `081db98`, sole writer Codex, for quieter bubble audio
and an explicit development-only local-record preview. User-supplied data/media
stay in ignored `.local-preview/`, outside public assets and production builds.
The default fictional demo is unchanged. See
[Task 030](Docs/agents/tasks/030-local-student-preview.md). Ocean work stays on hold.

Use the scripts in [package.json](package.json):

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
npm run mock
npm run mock -- --count 500 --seed 42
```

Use `npm ci` when installing the locked dependencies is needed. There is no lint script. `npm test` explicitly lists its pure/data/markup suites; adding a test file does not automatically register it. `npm run test:browser` and `npm run test:browser:preview` run isolated Chromium checks. See Docs/testing.md.

For implementation, run checks appropriate to the change and document test discovery changes. Use real browser checks for map picking, clusters, focus, WebGL fallback, and layout. Record physical-phone checks separately from emulation. Measure performance against the provisional targets in Project.md.

For documentation-only changes, verify file references, links, ownership consistency, and task coverage; application tests are not evidence about prose.

## Completion and continuation

Workers return changed paths, results with exact commands, unresolved issues, and the next action using the [handoff template](Docs/agents/templates/handoff.md). A review checks the resulting diff and evidence; a worker's success message alone is insufficient.

Update the package plan after implementation and HANDOFF.md at milestone boundaries. Keep pending acceptance criteria unchecked. Preserve current user changes and state clearly when checks were skipped or blocked.

Before ending or compacting a session, persist enough state to resume from files: objective, accepted decisions, current file ownership, changes, latest verification, blockers, and next action. Continue independent authorized work when an external decision blocks only part of the project.
