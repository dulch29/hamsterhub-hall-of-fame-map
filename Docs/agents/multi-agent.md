# Subagent and multi-agent execution plan

Status: planned roles only, 2026-11-17. No implementation subagents were started for this documentation task.

The subsequent CLI communication setup is recorded in [cli-communication.md](cli-communication.md). Review conversations through that bridge do not activate implementation workers or change the ownership table.

## Coordination model

The lead owns scope, shared interfaces, task assignment, integration, and final acceptance. A subagent receives one bounded task from its accountable owner. Multi-agent work means two or more independent tasks progress concurrently with disjoint write sets.

Use at most the coordinator plus two workers as the initial scheduling limit. This is a project default, not a statement about runtime capacity. Use fewer when work is tightly coupled or tools do not provide isolated workers.

Before delegation, the coordinator identifies the immediate critical-path task and does it locally when waiting for a worker would block the very next action. Delegate useful independent work, not a duplicate of the coordinator's task.

Keep the model/provider inherited from the active runtime unless the user specifies otherwise. Role names do not select a model or launch Claude Code from Codex.

## Role and file assignments

All paths below are proposed except the existing scaffold files. A task must claim exact writable paths before work starts. Shared files remain with the coordinator.

| Role | Accountable owner | Packages | Assigned write set | Required result |
|---|---|---|---|---|
| Coordinator/integrator | Lead | All | Shared files listed in Agent.md; top-level status/requirements docs | Task assignments, stable interfaces, integrated checks, milestone handoff |
| Discovery researcher | Lead with project owner | 01 | `Docs/01-discovery/` | Evidence and unresolved decisions; proposed changes for lead to record in Project.md |
| Geometry worker | Lead | 02 | Proposed `src/geo/`, `public/geometry/`, `Docs/02-map/geometry-source.md` | Licensed/attributed province assets, 77-code mapping, anchors, pure coordinate helpers/tests |
| Scene worker | Lead | 02, scene portion of 04/05/06 | `src/scene/` | Scene lifecycle, camera, instanced pins/picking, selection/failure events |
| Data worker | Lead | 03, adapter portion of 07/09 | `src/data/`, `Docs/03-data/` | Validated, opt-in-filtered, featured-resolved data and focused tests |
| Fixture worker | Codex | 00, fixtures for 05 | `src/mock/`, `scripts/generate-mock.ts`, `Docs/00-scaffold/` | Reproducible defaults, separate edge/dense fixtures, export behavior/tests |
| Card/link worker | Codex | 04 | `src/ui/PinCard.*`, `src/ui/links.*`, `Docs/04-pin-card/` | Card states, destinations, thumbnail timing, dismiss/focus behavior |
| Clustering worker | Lead | 05 | `src/cluster/`, `Docs/05-clustering/` | Pure grouping/fan-out with count/identity/reachability tests |
| List/accessibility worker | Codex | 06 | `src/ui/ListView.*`, `Docs/06-accessibility/` | Search/filter, keyboard flow, direct list route, shared card selection |
| Host integration worker | Lead | 07, 09 | Confirmed host/backend paths: TBD; `Docs/07-integration/`, `Docs/09-real-data/` | Protected member endpoint and source wiring after discovery |
| Measurement/review worker | Lead; relevant implementation owner fixes findings | 08, cross-package review | Read-only code; task-specific evidence file under `Docs/08-polish/` | Reproduction steps, measurements/findings, commands/results, file references |

The fixture worker alone changes generator test/fixture files; clustering workers consume them. The geometry worker owns `src/geo/` while the scene worker consumes it. The card worker owns link helpers; list workers import them rather than editing them.

Styles for card/list work should stay in their assigned component files until the lead integrates global styles. Shared UI utilities, province-name mappings, and selection types require a separate exact assignment; no worker implicitly owns all of `src/ui/`.

## Parallel work prerequisites

1. Verify actual repository state. Inspection on 2026-11-17 found no Git repository in this workspace.
2. Before concurrent code writers, establish the Project.md branch/worktree workflow, including a usable base revision, while preserving current files. This plan does not initialize or commit the workspace.
3. Assign one branch/worktree per worker, for example `agent/02-geometry` and `agent/04-card`. Branch names are examples, not existing branches.
4. Record the worker's task, base revision, exact write set, dependencies, and validation in a task packet.
5. Ensure concurrent tasks have disjoint writes and agreed interfaces. Give workers their own dev-server port if they need simultaneous servers.

If isolation is unavailable, keep one code writer and use read-only research/review tasks. Do not simulate worktrees by allowing multiple workers to edit the same directory concurrently.

## Execution waves

These are scheduling options, not a requirement to launch every named role.

| Wave | Coordinator's immediate work | Independent workers (up to two) | Gate before the next dependent task |
|---|---|---|---|
| A: baseline/discovery | Confirm scope, repository setup, and shared contracts | Fixture follow-up; discovery evidence | Default mocks preserved; unanswered decisions recorded |
| B: M1 | Build scene lifecycle/camera against agreed geometry/data inputs | Geometry assets/anchors; shared data preparation | Geometry license and 77-code coverage; stable adapters; map ready to consume |
| C: M2 | Integrate instanced pin picking and selected-student state | Card/links; scene/data interface review | Correct card opens; links and dismissal work |
| D: M3/M4 | Integrate camera/failure callbacks and shared selection | Pure clustering; accessible list | Every dense member reachable; keyboard and WebGL fallback work |
| E: integration/M5 | Implement confirmed host/member boundary, or continue scene fixes if host decisions are blocked | UI polish; read-only browser/performance measurement | Protected endpoint verified before real data; measured UI checks |
| F: M6 | Integrate production adapter and release evidence | Data/consent-path review; end-to-end acceptance verification | Organization decisions/review and all acceptance evidence complete |

Wave B's scene work can start with typed placeholders without claiming the geometry or data implementation. Integrate their returned outputs once ready. Waves D/E start only when shared interfaces are settled. Worker review must target a stable snapshot, not files another worker is changing.

## Interface coordination

Agree these behavior contracts before parallel implementation; their exact TypeScript signatures remain lead-owned:

- Data → views: same validated, opted-in `Kid` collection and resolved featured project.
- Geometry → scene: province-code lookup, anchor/jitter transformation, projection conventions, and asset lifecycle.
- Scene → application: student-ID hover/select events, map-background dismissal, readiness/failure/context-loss signals.
- Application → card/list: selected student, open/dismiss controls, invoking element for focus restoration.
- Scene → clustering: projected screen positions, viewport/camera limits, zoom request, and stable IDs.
- Backend → adapter: member session requirements, allowed fields, opt-out filtering, errors, and cache/logout behavior.

Do not treat these descriptions as new shared type declarations. Update Project.md alongside `src/types.ts` when the agreed data contract changes.

## Dispatch and return protocol

1. Use the [task packet template](templates/task.md) with one concrete deliverable, exact write set, relevant source/plan pointers, and test instructions.
2. Identify genuine dependencies. Do not hand off urgent blocking work and then wait idle.
3. Workers edit only their assigned files and return the [handoff template](templates/handoff.md), listing all changed paths.
4. The coordinator continues non-overlapping work. Wait for a worker only when its result is needed for the next dependent action.
5. Review returned changes and ownership boundaries. Integrate serially, including shared-file wiring and test-command changes.
6. Run the relevant combined checks after integration. Close completed worker sessions when supported.

Stop a worker's dependent path when its interface changes or a required decision is missing; redirect independent work if useful. Never infer that a worker's code is merged, deployed, or verified merely because its task ended.

## Review and completion

Review concrete risks for the changed package: student visibility, contract consistency, picking IDs, count conservation, focus/closing behavior, resource cleanup, protected responses, or actual performance.

A reviewer reports findings with file references and evidence. Fixes return to the owning worker or lead. Complete a package only after the integrated code satisfies its plan and validation. Record unavailable tooling or external decisions as limitations, not passed checks.
