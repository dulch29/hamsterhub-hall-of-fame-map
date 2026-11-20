# Task 041 targeted graph update

Current application, script and test AST plus complete Task 041 semantic extraction. Task 041 supersedes Task 040 entry and camera decisions; other document semantics remain historical.

Other document/image semantics remain historical from the existing graph; this is a targeted update, not a full corpus refresh.

Private review input/media and build/test output are excluded. Local source hashes and complete task coverage are recorded in task041-sources.json and task041-semantic.json. Host token usage/cost are unknown. Graph links support navigation; application verification is recorded in Task 041.

Graph health and extraction limits: Some code files have file-only extraction; existing tests/tsconfig.json BOM is unsupported by the extractor. Actual TypeScript checks pass. One self-loop represents the recursive permutations test helper. Parallel relations are preserved in JSON and collapse only in simple undirected analysis. No missing or dangling endpoints were found.

# Graph Report - Map Project Showcase  (2026-11-20)

## Corpus Check
- 67 files · ~685 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 407 nodes · 1067 edges · 19 communities (10 shown, 9 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.86)
- Token cost: unknown input · unknown output

## Graph Freshness
- Built from commit: `9e259749`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ThailandMap.tsx / awards.ts / ThailandMap()
- Project: Hamsterhub Hall of Fame Map / Work packages and implementation plans / 03 — Shared data and featured projects
- AwardDiscovery.tsx / demoAwards.ts / StudentPreview.tsx
- App.tsx / generate.ts / StudentPreview.test.tsx
- provinces.ts / provinces.test.ts / types.ts
- package.json / devDependencies / scripts
- MapPreview.tsx / MapPreview() / Task 041: bubbles before the province list
- Agent guide — Hamsterhub Hall of Fame Map / claude-review.mjs / Subagent and multi-agent execution plan
- localPreview.ts / parseLocalPreview() / reviewScale.ts
- compilerOptions / tsconfig.json / isolatedModules
- Task 001 — Claude/Codex communication and M1 readiness review
- Task 002 — Continue the Claude/Codex review conversation

## God Nodes (most connected - your core abstractions)
1. `Project: Hamsterhub Hall of Fame Map` - 44 edges
2. `Work packages and implementation plans` - 28 edges
3. `ThailandMap()` - 19 edges
4. `compilerOptions` - 17 edges
5. `Kid` - 17 edges
6. `react` - 16 edges
7. `AwardDiscovery()` - 16 edges
8. `generateMockKids()` - 15 edges
9. `MapPreview()` - 15 edges
10. `03 — Shared data and featured projects` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Three default fictional students` --conceptually_related_to--> `DEFAULT_MOCK_COUNT`  [INFERRED]
  Project.md → src/mock/generate.ts
- `ThailandMap()` --implements--> `Fixed center, fixed tilt, bounded zoom, medal-only entry`  [INFERRED]
  src/scene/ThailandMap.tsx → Docs/agents/tasks/040-phase-3-province-entry.md
- `ThailandMap()` --implements--> `Temporary award focus and saved overview return`  [INFERRED]
  src/scene/ThailandMap.tsx → Docs/agents/tasks/041-bubbles-first-province-journey.md
- `Manual featured-project selection` --conceptually_related_to--> `generateMockKids()`  [INFERRED]
  Project.md → src/mock/generate.ts
- `Three default fictional students` --conceptually_related_to--> `generateMockKids()`  [INFERRED]
  Project.md → src/mock/generate.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Same prepared data across map, card and list** — docs_03_data_work_prepared_collection, project_instanced_scene, project_pin_card, project_accessible_list [EXTRACTED 1.00]
- **Membership, consent and approved production release** — project_member_api, project_guardian_consent, project_organization_review, project_real_data_release [EXTRACTED 1.00]
- **Stable identity through jitter, grouping and selection** — project_deterministic_jitter, project_clusters_fanout, docs_04_pin_card_plan_selection_focus [INFERRED 0.85]

## Communities (19 total, 9 thin omitted)

### Community 0 - "ThailandMap.tsx / awards.ts / ThailandMap()"
Cohesion: 0.07
Nodes (45): three, clusterPoints(), compareIds(), fanOut(), ScreenCluster, ScreenPoint, members(), permutations() (+37 more)

### Community 1 - "Project: Hamsterhub Hall of Fame Map / Work packages and implementation plans / 03 — Shared data and featured projects"
Cohesion: 0.11
Nodes (56): Project agent entry point, Plan — Scaffold and synthetic fixtures, 00 — Scaffold and synthetic fixtures, Separate opt-out and long-name fixtures, Plan — Discovery and decisions, 01 — Discovery and decisions, Plan — Province data and 3D map, Scene failure and context-loss signals (+48 more)

### Community 2 - "AwardDiscovery.tsx / demoAwards.ts / StudentPreview.tsx"
Cohesion: 0.14
Nodes (32): react, AwardGroup, RecipientAward, ProvinceRecipient, provinceRecipients(), provinceNames, AwardDiscovery(), Props (+24 more)

### Community 3 - "App.tsx / generate.ts / StudentPreview.test.tsx"
Cohesion: 0.11
Nodes (23): react-dom, App(), Explorer(), Mode, ThailandMap, DEMO_AWARDS, resolveAwardGroups(), duplicateIds() (+15 more)

### Community 4 - "provinces.ts / provinces.test.ts / types.ts"
Cohesion: 0.10
Nodes (32): Kid Project MapPin contracts, encoder, hashId(), derivePins(), mixedFraction(), ProvinceAnchor, anchor, anchors (+24 more)

### Community 5 - "package.json / devDependencies / scripts"
Cohesion: 0.06
Nodes (34): Historical generator-only test discovery, dependencies, react, react-dom, three, devDependencies, tsx, @types/node (+26 more)

### Community 6 - "MapPreview.tsx / MapPreview() / Task 041: bubbles before the province list"
Cohesion: 0.11
Nodes (20): Task 040: province entry complete locally, Fixed center, fixed tilt, bounded zoom, medal-only entry, Layered Back, offscreen focus fallback and WebGL recovery, P3.2 competitions and explicit project-media links, Visible province recipient union and explicit featured competition, 114 units, production browser suite and seven-profile checks, Temporary award focus and saved overview return, Pop morph, re-formation, recall and optional sound (+12 more)

### Community 7 - "Agent guide — Hamsterhub Hall of Fame Map / claude-review.mjs / Subagent and multi-agent execution plan"
Cohesion: 0.11
Nodes (16): Agent guide — Hamsterhub Hall of Fame Map, Lead-serialized shared files, Coordinator-driven Claude review bridge, Codex ↔ Claude Code CLI communication, Explicit review context snapshots, Project context engineering protocol, Claude Code / Codex exchange: M1 readiness, Recorded M1 readiness findings (+8 more)

### Community 8 - "localPreview.ts / parseLocalPreview() / reviewScale.ts"
Cohesion: 0.21
Nodes (16): assets, files, output, root, AwardAssociation, DemoAward, association(), award() (+8 more)

### Community 9 - "compilerOptions / tsconfig.json / isolatedModules"
Cohesion: 0.11
Nodes (18): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+10 more)

## Knowledge Gaps
- **15 isolated node(s):** `tsx`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/three` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 120 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Project: Hamsterhub Hall of Fame Map` connect `Project: Hamsterhub Hall of Fame Map / Work packages and implementation plans / 03 — Shared data and featured projects` to `provinces.ts / provinces.test.ts / types.ts`, `Agent guide — Hamsterhub Hall of Fame Map / claude-review.mjs / Subagent and multi-agent execution plan`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ThailandMap()` (e.g. with `Fixed center, fixed tilt, bounded zoom, medal-only entry` and `Temporary award focus and saved overview return`) actually correct?**
  _`ThailandMap()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `tsx`, `@types/node`, `@types/react` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ThailandMap.tsx / awards.ts / ThailandMap()` be split into smaller, more focused modules?**
  _Cohesion score 0.07291666666666667 - nodes in this community are weakly interconnected._
- **Why does `react` connect `AwardDiscovery.tsx / demoAwards.ts / StudentPreview.tsx` to `ThailandMap.tsx / awards.ts / ThailandMap()`, `App.tsx / generate.ts / StudentPreview.test.tsx`, `package.json / devDependencies / scripts`, `MapPreview.tsx / MapPreview() / Task 041: bubbles before the province list`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Should `Project: Hamsterhub Hall of Fame Map / Work packages and implementation plans / 03 — Shared data and featured projects` be split into smaller, more focused modules?**
  _Cohesion score 0.10629296668429403 - nodes in this community are weakly interconnected._
- **Why does `Agent guide — Hamsterhub Hall of Fame Map` connect `Agent guide — Hamsterhub Hall of Fame Map / claude-review.mjs / Subagent and multi-agent execution plan` to `Project: Hamsterhub Hall of Fame Map / Work packages and implementation plans / 03 — Shared data and featured projects`, `package.json / devDependencies / scripts`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
