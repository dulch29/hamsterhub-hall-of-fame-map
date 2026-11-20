# Task 042 targeted graph update

Current application, script and test AST plus complete Task 042 and reference-image semantics. Four varied portrait slots plus circular See all refine Task 041 composition; its list and bubble lifecycle are retained. Other document semantics remain historical.

Other document/image semantics remain historical from the existing graph; this is a targeted update, not a full corpus refresh.

Private review input/media and build/test output are excluded. Local source hashes and complete task/reference coverage are recorded in task042-sources.json and task042-semantic.json. Host token usage/cost are unknown; semantic extraction used two bounded host subagent chunks. Graph links support navigation; application verification is recorded in Task 042.

Graph health and extraction limits: Some code files have file-only extraction; existing tests/tsconfig.json BOM is unsupported by the extractor. Actual TypeScript checks pass. One self-loop represents the recursive permutations test helper. Parallel relations are preserved in JSON and collapse only in simple undirected analysis. No missing or dangling endpoints were found.

# Graph Report - Map Project Showcase  (2026-11-20)

## Corpus Check
- 69 files · ~561 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 430 nodes · 1101 edges · 19 communities (10 shown, 9 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 129 edges (avg confidence: 0.87)
- Token cost: unknown input · unknown output

## Graph Freshness
- Built from commit: `77cbbda6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Data contracts and fixtures
- Work packages and roadmap
- Scene rendering and awards
- Discovery layout and previews
- Dependencies and commands
- Map recovery and navigation
- Province geometry and pins
- Bubble composition reference
- Agent coordination and handoffs
- TypeScript compiler settings
- M1 readiness exchange
- Followup review exchange

## God Nodes (most connected - your core abstractions)
1. `Project: Hamsterhub Hall of Fame Map` - 44 edges
2. `Work packages and implementation plans` - 28 edges
3. `ThailandMap()` - 20 edges
4. `compilerOptions` - 17 edges
5. `Kid` - 17 edges
6. `AwardDiscovery()` - 17 edges
7. `react` - 16 edges
8. `generateMockKids()` - 15 edges
9. `MapPreview()` - 15 edges
10. `Task 041: bubbles before the province list` - 14 edges

## Surprising Connections (you probably didn't know these)
- `ThailandMap()` --implements--> `Fixed center, fixed tilt, bounded zoom, medal-only entry`  [INFERRED]
  src/scene/ThailandMap.tsx → Docs/agents/tasks/040-phase-3-province-entry.md
- `ThailandMap()` --implements--> `Temporary award focus and saved overview return`  [INFERRED]
  src/scene/ThailandMap.tsx → Docs/agents/tasks/041-bubbles-first-province-journey.md
- `Three default fictional students` --conceptually_related_to--> `DEFAULT_MOCK_COUNT`  [INFERRED]
  Project.md → src/mock/generate.ts
- `ProvinceRecipients()` --implements--> `Layered Back, offscreen focus fallback and WebGL recovery`  [INFERRED]
  src/ui/ProvinceRecipients.tsx → Docs/agents/tasks/040-phase-3-province-entry.md
- `resolveAwardGroups()` --implements--> `Visible province recipient union and explicit featured competition`  [INFERRED]
  src/data/demoAwards.ts → Docs/agents/tasks/040-phase-3-province-entry.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Same prepared data across map, card and list** — docs_03_data_work_prepared_collection, project_instanced_scene, project_pin_card, project_accessible_list [EXTRACTED 1.00]
- **Membership, consent and approved production release** — project_member_api, project_guardian_consent, project_organization_review, project_real_data_release [EXTRACTED 1.00]
- **Stable identity through jitter, grouping and selection** — project_deterministic_jitter, project_clusters_fanout, docs_04_pin_card_plan_selection_focus [INFERRED 0.85]
- **Trophy-left entry composition with thought-dot trail, four varied portrait circles to the right, and lower circular See all control** — docs_01_discovery_phase_3_references_07_bubble_entry_layout_trophy_anchor, docs_01_discovery_phase_3_references_07_bubble_entry_layout_thought_dot_trail, docs_01_discovery_phase_3_references_07_bubble_entry_layout_portrait_circle_cluster, docs_01_discovery_phase_3_references_07_bubble_entry_layout_see_all_circle [EXTRACTED 1.00]

## Communities (19 total, 9 thin omitted)

### Community 0 - "Data contracts and fixtures"
Cohesion: 0.06
Nodes (51): Kid Project MapPin contracts, react-dom, assets, files, output, root, App(), Explorer() (+43 more)

### Community 1 - "Work packages and roadmap"
Cohesion: 0.09
Nodes (62): Agent guide — Hamsterhub Hall of Fame Map, Lead-serialized shared files, Project agent entry point, Plan — Scaffold and synthetic fixtures, Historical generator-only test discovery, 00 — Scaffold and synthetic fixtures, Separate opt-out and long-name fixtures, Plan — Discovery and decisions (+54 more)

### Community 2 - "Scene rendering and awards"
Cohesion: 0.07
Nodes (45): three, clusterPoints(), compareIds(), fanOut(), ScreenCluster, ScreenPoint, members(), permutations() (+37 more)

### Community 3 - "Discovery layout and previews"
Cohesion: 0.14
Nodes (32): react, AwardGroup, RecipientAward, ProvinceRecipient, provinceRecipients(), provinceNames, AwardDiscovery(), Props (+24 more)

### Community 4 - "Dependencies and commands"
Cohesion: 0.06
Nodes (31): dependencies, react, react-dom, three, devDependencies, tsx, @types/node, @types/react (+23 more)

### Community 5 - "Map recovery and navigation"
Cohesion: 0.11
Nodes (20): Task 040: province entry complete locally, Fixed center, fixed tilt, bounded zoom, medal-only entry, Layered Back, offscreen focus fallback and WebGL recovery, P3.2 competitions and explicit project-media links, Visible province recipient union and explicit featured competition, 114 units, production browser suite and seven-profile checks, Temporary award focus and saved overview return, Pop morph, re-formation, recall and optional sound (+12 more)

### Community 6 - "Province geometry and pins"
Cohesion: 0.14
Nodes (20): generateProvincePins(), inPolygon(), inRing(), interiorAnchor(), isFeature(), isPolygon(), isRecord(), isRing() (+12 more)

### Community 7 - "Bubble composition reference"
Cohesion: 0.13
Nodes (19): Bubble entry layout reference composition, Light blue regional map on a dark blue backdrop, Four portrait placeholder circles of varied sizes arranged to the right of the trophy, Large central portrait placeholder circle labeled Profile 1, Medium upper portrait placeholder circle labeled Profile 2, Small lower-right portrait placeholder circle labeled Profile 3, Largest portrait placeholder circle at the far right labeled Profile 4, Large lower circular See all control beneath the portrait cluster (+11 more)

### Community 8 - "Agent coordination and handoffs"
Cohesion: 0.13
Nodes (13): Coordinator-driven Claude review bridge, Codex ↔ Claude Code CLI communication, Explicit review context snapshots, Project context engineering protocol, Claude Code / Codex exchange: M1 readiness, Recorded M1 readiness findings, Subagent and multi-agent execution plan, Worker/session handoff template (+5 more)

### Community 9 - "TypeScript compiler settings"
Cohesion: 0.11
Nodes (18): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+10 more)

## Knowledge Gaps
- **23 isolated node(s):** `P3.2 competitions and explicit project-media links`, `114 units, production browser suite and seven-profile checks`, `Competitions, presentations and characters remain pending`, `Restoration browser and seven-profile verification`, `tsx` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 130 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Project: Hamsterhub Hall of Fame Map` connect `Work packages and roadmap` to `Data contracts and fixtures`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `ThailandMap()` (e.g. with `Fixed center, fixed tilt, bounded zoom, medal-only entry` and `Temporary award focus and saved overview return`) actually correct?**
  _`ThailandMap()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `P3.2 competitions and explicit project-media links`, `114 units, production browser suite and seven-profile checks`, `Competitions, presentations and characters remain pending` to the rest of the system?**
  _23 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Data contracts and fixtures` be split into smaller, more focused modules?**
  _Cohesion score 0.06388888888888888 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Discovery layout and previews` to `Data contracts and fixtures`, `Scene rendering and awards`, `Dependencies and commands`, `Map recovery and navigation`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Should `Work packages and roadmap` be split into smaller, more focused modules?**
  _Cohesion score 0.09292412617220801 - nodes in this community are weakly interconnected._
- **Why does `Agent guide — Hamsterhub Hall of Fame Map` connect `Work packages and roadmap` to `Agent coordination and handoffs`, `Dependencies and commands`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._