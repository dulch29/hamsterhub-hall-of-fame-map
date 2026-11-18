# Project skill selection

Inspected: 2026-11-17. Discovery method: the user-invoked `find-skills` workflow, with local inspection before online gap research.

## Local discovery result

No project `.agent/` or `.agents/` directory was present during inspection. The user-level library exists at `C:/Users/NCS/.agents/skills/`. Relevant SKILL.md files were inspected, and provenance was checked against `C:/Users/NCS/.agents/.skill-lock.json`.

The lock records `vercel-labs/skills` for `find-skills`, `anthropics/skills` for `frontend-design`, and `addyosmani/agent-skills` for the other skills below. These are local provenance records, not independently verified ratings or immutable pins.

For every name in the table, the local file is:

```text
C:/Users/NCS/.agents/skills/<skill-name>/SKILL.md
```

Check that the file still exists when starting a later session. Some file-discovered skills may not appear in a session's advertised catalog; do not claim they are callable tools or that their associated MCP server is available.

## Recommended local skills

| Skill | Use when | Assigned role/packages | Limits |
|---|---|---|---|
| `find-skills` | Discovering or reassessing a capability gap | Coordinator; all packages as needed | Local first; inspect content before selection; no automatic installation |
| `context-engineering` | Starting tasks, creating worker packets, resuming or handing off | Coordinator and workers; all packages | Load relevant context progressively |
| `documentation-and-adrs` | Recording significant decisions, contracts, and milestone handoffs | Lead/discovery; 01, 03, 07, 09 | Match the existing Docs convention; add an ADR only for an actual decision |
| `incremental-implementation` | Implementing a package in small verifiable slices | All implementation roles; 00–09 | Keep each slice working; avoid unrelated changes |
| `api-and-interface-design` | Defining scene/data/UI seams and the protected response contract | Lead/data/card/list; 02–07, 09 | Shared types remain lead-owned; project contract wins over example types |
| `frontend-ui-engineering` | Building cards, controls, search/filter, responsive and keyboard flows | Codex card/list; 04, 06, 08 | Adapt to existing React/TypeScript patterns and confirmed host style |
| `frontend-design` | Applying confirmed HamQuest visual direction | Codex/lead; 01, 08 | Use actual brand references; no unrequested visual redesign |
| `browser-testing-with-devtools` | Inspecting browser interaction, console/network, focus, fallback, and profiles | Scene/UI/verification; 02, 04–08 | Requires configured DevTools MCP; otherwise use available browser tools or document manual checks |
| `code-review-and-quality` | Reviewing implementation before integration | Reviewer and lead; all changed packages | Review actual diffs and verification; no model change implied |
| `git-workflow-and-versioning` | Establishing isolated branches/worktrees and integrating changes | Coordinator; all concurrent coding | Workspace has no Git repository yet; do not assume history or discard uncommitted files |
| `debugging-and-error-recovery` | Investigating a concrete failed check or runtime defect | Responsible implementation owner | Reproduce and diagnose the failure; skill example test flags may not match this runner |
| `performance-optimization` | Measuring an identified render/load/interaction bottleneck | Lead/measurement; 05, 08 | Found on disk; verify session access. Project targets remain provisional |
| `security-and-hardening` | Designing/reviewing member sessions, protected responses, and data filtering | Lead/data/reviewer; 07, 09 | Found on disk; verify session access. Organization/legal decisions stay with their owners |

The short default task set is `context-engineering`, the relevant domain skill, and `incremental-implementation` when implementing. Load review/debugging/measurement guidance when that phase begins.

## Package routing

| Package | Domain skills to load as needed |
|---|---|
| 00 scaffold/fixtures | `incremental-implementation`; `debugging-and-error-recovery` on failures |
| 01 discovery | `find-skills`, `documentation-and-adrs`; `frontend-design` for confirmed visual references |
| 02 geometry/map | `api-and-interface-design`, `browser-testing-with-devtools`; installed Three.js source/types |
| 03 data | `api-and-interface-design`; `security-and-hardening` for production boundary design |
| 04 card/links | `frontend-ui-engineering`, `api-and-interface-design`, browser verification |
| 05 clusters | `api-and-interface-design`; pure logic tests; measurement when needed |
| 06 list/fallback | `frontend-ui-engineering`, browser verification |
| 07 member/site integration | `api-and-interface-design`, `security-and-hardening`, `documentation-and-adrs` |
| 08 polish/performance | `frontend-design`, `frontend-ui-engineering`, `performance-optimization`, browser verification |
| 09 real data/release | `security-and-hardening`, `documentation-and-adrs`, `code-review-and-quality` |

## Online gap check

The local name/content inspection found no dedicated Three.js or Thailand-province GIS skill. After local inspection, the skills.sh leaderboard and a targeted Three.js/GeoJSON search were checked.

One evaluated candidate was `cesartevisual/threejs-skills` → `threejs-geometry`. Its source discusses geometry attributes, instancing, stable instance-to-application IDs, bounds, and disposal. It is relevant to package 02 but does not solve province dataset licensing or geometry selection.

The inspected directory snapshot reported 624 installs and 24 repository stars; the live GitHub page also reported 24 stars. These are changeable snapshots, not quality guarantees. It is a community source and falls below find-skills' preferred adoption thresholds. Decision: **evaluated, not selected as a required skill; not installed**.

Sources inspected:

```text
Leaderboard: https://skills.sh/
Directory: https://www.skills.sh/cesartevisual/threejs-skills/threejs-geometry
Repository: https://github.com/cesartevisual/threejs-skills
Skill source: https://raw.githubusercontent.com/cesartevisual/threejs-skills/main/skills/threejs-geometry/SKILL.md
```

If reconsidered after source/version review, the directory provides this install command; it has not been executed:

```sh
npx skills add https://github.com/cesartevisual/threejs-skills --skill threejs-geometry
```

Use the project's installed Three.js types/source and official documentation for revision-specific APIs. Do not add React Three Fiber, a GIS backend, Supabase, or an agent framework merely because a skill mentions them. No new skill is required to start the planned M1 work.

## Future discovery procedure

1. Inspect project `.agents/skills/` and `.agent/skills/`, then the user-level `.agents/skills/` library.
2. Read relevant skill descriptions and actual content; confirm file availability and runtime prerequisites.
3. Record the concrete gap before browsing. Check the leaderboard, then a targeted search if needed.
4. Inspect source, provenance, adoption, compatibility, and dependencies before recommending an addition.
5. Record whether a candidate is required, optional, deferred, or rejected. Installation is a separate explicit action, not an outcome of writing a plan.
