# Task 040 targeted graph update

Current tracked/untracked application, script and test AST plus complete Task 040 semantic extraction.

Other document/image semantics remain historical from the existing graph; this is a targeted update, not a full corpus refresh.

Private review input/media and build/test output are excluded. Local source hashes and complete task coverage are recorded in task040-sources.json and task040-semantic.json. Host token usage/cost are unknown. Graph links support navigation; application verification is recorded in Task 040.

Graph health and extraction limits: 19 file-only code nodes; existing tests/tsconfig.json BOM is unsupported by the extractor. Actual TypeScript checks pass. One self-loop represents the recursive permutations test helper. Parallel relations are preserved in JSON and collapse only in simple undirected analysis. No missing or dangling endpoints were found.

# Graph Report - Map Project Showcase  (2026-11-20)

## Corpus Check
- 66 files · ~1,494 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 394 nodes · 1040 edges · 13 communities (8 shown, 5 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 119 edges (avg confidence: 0.86)
- Token cost: unknown input · unknown output

## Graph Freshness
- Built from commit: `c08900b1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- localPreview.ts / generate.ts / provinces.test.ts
- Project: Hamsterhub Hall of Fame Map / Work packages and implementation plans / 03 — Shared data and featured projects
- ThailandMap.tsx / awards.ts / ThailandMap()
- AwardDiscovery.tsx / StudentPreview.test.tsx / StudentPreview.tsx
- provinces.ts / App.tsx / MapPreview.tsx
- package.json / devDependencies / scripts
- build-review.ts / claude-review.mjs / Subagent and multi-agent execution plan
- compilerOptions / tsconfig.json / isolatedModules
- Task 001 — Claude/Codex communication and M1 readiness review
- Task 002 — Continue the Claude/Codex review conversation

## God Nodes (most connected - your core abstractions)
1. `Project: Hamsterhub Hall of Fame Map` - 44 edges
2. `Work packages and implementation plans` - 28 edges
3. `compilerOptions` - 17 edges
4. `Kid` - 17 edges
5. `react` - 16 edges
6. `ThailandMap()` - 16 edges
7. `generateMockKids()` - 15 edges
8. `03 — Shared data and featured projects` - 14 edges
9. `Agent guide — Hamsterhub Hall of Fame Map` - 13 edges
10. `prepareKids()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Three default fictional students` --conceptually_related_to--> `DEFAULT_MOCK_COUNT`  [INFERRED]
  Project.md → src/mock/generate.ts
- `ThailandMap()` --implements--> `Fixed center, fixed tilt, bounded zoom, medal-only entry`  [INFERRED]
  src/scene/ThailandMap.tsx → Docs/agents/tasks/040-phase-3-province-entry.md
- `Manual featured-project selection` --conceptually_related_to--> `generateMockKids()`  [INFERRED]
  Project.md → src/mock/generate.ts
- `Three default fictional students` --conceptually_related_to--> `generateMockKids()`  [INFERRED]
  Project.md → src/mock/generate.ts
- `resolveAwardGroups()` --implements--> `Visible province recipient union and explicit featured competition`  [INFERRED]
  src/data/demoAwards.ts → Docs/agents/tasks/040-phase-3-province-entry.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Same prepared data across map, card and list** — docs_03_data_work_prepared_collection, project_instanced_scene, project_pin_card, project_accessible_list [EXTRACTED 1.00]
- **Membership, consent and approved production release** — project_member_api, project_guardian_consent, project_organization_review, project_real_data_release [EXTRACTED 1.00]
- **Stable identity through jitter, grouping and selection** — project_deterministic_jitter, project_clusters_fanout, docs_04_pin_card_plan_selection_focus [INFERRED 0.85]

## Communities (13 total, 5 thin omitted)

### Community 0 - "localPreview.ts / generate.ts / provinces.test.ts"
Cohesion: 0.07
Nodes (49): Kid Project MapPin contracts, AwardAssociation, AwardGroup, DEMO_AWARDS, DemoAward, RecipientAward, resolveAwardGroups(), association() (+41 more)

### Community 1 - "Project: Hamsterhub Hall of Fame Map / Work packages and implementation plans / 03 — Shared data and featured projects"
Cohesion: 0.09
Nodes (62): Agent guide — Hamsterhub Hall of Fame Map, Lead-serialized shared files, Project agent entry point, Plan — Scaffold and synthetic fixtures, Historical generator-only test discovery, 00 — Scaffold and synthetic fixtures, Separate opt-out and long-name fixtures, Plan — Discovery and decisions (+54 more)

### Community 2 - "ThailandMap.tsx / awards.ts / ThailandMap()"
Cohesion: 0.07
Nodes (45): three, clusterPoints(), compareIds(), fanOut(), ScreenCluster, ScreenPoint, members(), permutations() (+37 more)

### Community 3 - "AwardDiscovery.tsx / StudentPreview.test.tsx / StudentPreview.tsx"
Cohesion: 0.11
Nodes (30): react, react-dom, provinceNames, AwardDiscovery(), Props, BUBBLE_FORM_DURATION, burstBubble(), bubbleFootprint() (+22 more)

### Community 4 - "provinces.ts / App.tsx / MapPreview.tsx"
Cohesion: 0.09
Nodes (31): Task 040: province entry complete locally, Fixed center, fixed tilt, bounded zoom, medal-only entry, Layered Back, offscreen focus fallback and WebGL recovery, P3.2 competitions and explicit project-media links, Visible province recipient union and explicit featured competition, 114 units, production browser suite and seven-profile checks, App(), Explorer() (+23 more)

### Community 5 - "package.json / devDependencies / scripts"
Cohesion: 0.06
Nodes (31): dependencies, react, react-dom, three, devDependencies, tsx, @types/node, @types/react (+23 more)

### Community 6 - "build-review.ts / claude-review.mjs / Subagent and multi-agent execution plan"
Cohesion: 0.09
Nodes (18): Coordinator-driven Claude review bridge, Codex ↔ Claude Code CLI communication, Explicit review context snapshots, Project context engineering protocol, Claude Code / Codex exchange: M1 readiness, Recorded M1 readiness findings, Subagent and multi-agent execution plan, Worker/session handoff template (+10 more)

### Community 7 - "compilerOptions / tsconfig.json / isolatedModules"
Cohesion: 0.11
Nodes (18): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+10 more)

## Knowledge Gaps
- **13 isolated node(s):** `tsx`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/three` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 114 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Project: Hamsterhub Hall of Fame Map` connect `Project: Hamsterhub Hall of Fame Map / Work packages and implementation plans / 03 — Shared data and featured projects` to `localPreview.ts / generate.ts / provinces.test.ts`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **What connects `tsx`, `@types/node`, `@types/react` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `localPreview.ts / generate.ts / provinces.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07293594964827842 - nodes in this community are weakly interconnected._
- **Why does `react` connect `AwardDiscovery.tsx / StudentPreview.test.tsx / StudentPreview.tsx` to `localPreview.ts / generate.ts / provinces.test.ts`, `ThailandMap.tsx / awards.ts / ThailandMap()`, `provinces.ts / App.tsx / MapPreview.tsx`, `package.json / devDependencies / scripts`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Should `Project: Hamsterhub Hall of Fame Map / Work packages and implementation plans / 03 — Shared data and featured projects` be split into smaller, more focused modules?**
  _Cohesion score 0.09292412617220801 - nodes in this community are weakly interconnected._
- **Why does `Agent guide — Hamsterhub Hall of Fame Map` connect `Project: Hamsterhub Hall of Fame Map / Work packages and implementation plans / 03 — Shared data and featured projects` to `package.json / devDependencies / scripts`, `build-review.ts / claude-review.mjs / Subagent and multi-agent execution plan`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Should `ThailandMap.tsx / awards.ts / ThailandMap()` be split into smaller, more focused modules?**
  _Cohesion score 0.07192460317460317 - nodes in this community are weakly interconnected._