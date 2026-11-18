# Agent guide — Hamsterhub Hall of Fame Map

Updated: 2026-11-18.

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
- Default review page is the navy map with three sculpted sample awards and individual zoom. The integrated synthetic explorer remains at `?view=explorer`; see Tasks 015/016. Avatars and cards are deferred in the default page.
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

## Skills

Use [the local skill selection](Docs/agents/skills.md). First inspect project `.agents/` or `.agent/` skills if present, then `C:/Users/NCS/.agents/skills/`. Read the actual `SKILL.md` before applying it. Use the session's available skill catalog to confirm plugin skills.

For this documentation work, `find-skills` and `context-engineering` were applied. Implementation skills are assigned by task; do not load the entire catalog. Skill examples do not replace actual project commands, dependencies, requirements, or the user's existing authorization.

## Local commands and validation

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
