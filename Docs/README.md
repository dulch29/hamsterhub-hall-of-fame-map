# Work packages and implementation plans

Updated: 2026-11-18.

[Project.md](../Project.md) remains the source of truth for requirements, contracts, ownership, and decisions. These documents break its work into executable packages. [HANDOFF.md](../HANDOFF.md) records the current implementation and historical milestones; [README.md](../README.md) contains local commands.

Each numbered folder contains `work.md` (scope and completion criteria) and `plan.md` (ordered implementation and verification steps). Planned file paths are proposals, not files that already exist. An unchecked task is pending; documenting a task does not implement it.

Agent workflow: [main guide](../Agent.md), [skill selection](agents/skills.md), [multi-agent responsibilities and execution waves](agents/multi-agent.md), and [context engineering](agents/context.md). The `agents/` folder contains coordination guidance rather than an additional numbered work package.

| ID | Work | Plan | Milestone | Status | Owner |
|---|---|---|---|---|---|
| 00 | [Scaffold and synthetic fixtures](00-scaffold/work.md) | [Plan](00-scaffold/plan.md) | M0 | Scaffold and explicit fixtures complete | Codex; shared contracts: lead |
| 01 | [Discovery and decisions](01-discovery/work.md) | [Plan](01-discovery/plan.md) | M0 follow-up; supports M1–M6 | Public site inspected; host/backend decisions open | Lead, with project owner |
| 02 | [Province data and 3D map](02-map/work.md) | [Plan](02-map/plan.md) | M1 | 77-province synthetic scene integrated; device checks open | Lead; delegated integration: Codex |
| 03 | [Shared data and featured projects](03-data/work.md) | [Plan](03-data/plan.md) | M1–M2; reused in M6 | Synthetic adapter implemented; production boundary pending | Lead; mock fixtures: Codex |
| 04 | [Pin Card and links](04-pin-card/work.md) | [Plan](04-pin-card/plan.md) | M2 | Map/list modal integrated; placeholder destinations | Codex; scene wiring delegated |
| 05 | [Clustering and fan-out](05-clustering/work.md) | [Plan](05-clustering/plan.md) | M3 | Grouping, zoom and paged fan-out integrated | Lead; delegated integration: Codex |
| 06 | [Accessible list and WebGL fallback](06-accessibility/work.md) | [Plan](06-accessibility/plan.md) | M4 | Search/list and failure fallback integrated | Codex |
| 07 | [Member authentication and site integration](07-integration/work.md) | [Plan](07-integration/plan.md) | Before M6 | Pending; host stack and member policy unresolved | Lead |
| 08 | [Visual polish and performance](08-polish/work.md) | [Plan](08-polish/plan.md) | M5 | Brand-informed demo; device/performance acceptance open | Lead; UI changes: Codex |
| 09 | [Real data, consent, and release](09-real-data/work.md) | [Plan](09-real-data/plan.md) | M6 | Pending; production prerequisites unresolved | Lead with organization; UI support: Codex |

## Execution order

1. Preserve the completed M0 baseline in 00 and finish its targeted fixture follow-up.
2. Start 01 to resolve decisions. Geometry selection in 02 can proceed while the site URL is unavailable.
3. Implement 03's shared mock-data preparation and 02's static map. Use exactly three visible fictional students by default.
4. Connect 04 to map selection, then implement 05 and 06 using the same prepared data.
5. Complete 07 once the host stack and session mechanism are known. It can progress alongside synthetic-data UI work, but must finish before real data is connected.
6. Complete 08 after the main interactions exist and visual tokens are confirmed.
7. Complete 09 after 03 and 07, the consent/member decisions, and the applicable release checks are satisfied.

These dependencies describe scheduling; they do not authorize additional agents.
Follow Project.md's ownership rules. The private Git repository is established;
Task 023 uses `codex/award-return-view` with one implementation writer and
read-only review. See Agent.md and HANDOFF.md for current coordination.

## Decision register

Record answers and their date in Project.md, then update affected plans. Do not silently turn an assumption into a requirement.

| Decision | Needed by | Current state |
|---|---|---|
| Hamsterhub/HamQuest URL, stack, mount point, brand tokens | 01, 07, 08 | URL/public CSS inspected; authenticated integration unknown |
| Featured-project setting location and ownership | 03, 07, 09 | Unknown |
| Most-recent-project fallback when selection is unset | 03, 04, 06 | Assumption; unconfirmed |
| Geometry dataset, redistribution license, attribution | 02 | GeoThai selected; attribution/license recorded in 02 |
| Production data source and consent collector | 07, 09 | Unknown; Supabase is only an assumption |
| Member audience and approved display-name policy | 07, 09 | Unknown |
| Target phone, connection, and performance measurement setup | 08 | Targets are provisional |

## Acceptance coverage

All of Project.md's acceptance criteria remain pending. M0 does not satisfy the production acceptance criteria.

| Project acceptance criterion | Responsible packages |
|---|---|
| Opted-out students absent from map, list, and API | 03, 06, 07, 09 |
| Logged-out page/API requests expose no student data | 07, 09 |
| No exact student coordinates exposed | 02, 03, 07, 09 |
| Every student in dense Bangkok clusters reachable | 05 |
| One featured project and working Profile link | 03, 04 |
| Missing avatar/project handled | 00, 03, 04, 06 |
| Desktop/mobile support and WebGL fallback | 02, 06, 08 |
| Core flows accessible by keyboard through the list | 04, 06 |

For each completed package, record the files changed, actual verification results, unresolved limitations, and next action in its plan. Update HANDOFF.md after implementation milestones.
