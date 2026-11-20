# Task 043 targeted graph update

Task 043 navigation, centering, orbit and empty-map exit; current AST plus complete Task 043 semantics. Prior semantic history retained. Other document and image semantics remain historical. Token usage and cost are unknown. Private inputs, owner media and test/build outputs are excluded. These graph outputs are written into the working tree for the team to share.

[graphify] MultiDiGraph edge-collapse diagnostic
input: <in-memory>
input_stage: provided JSON (normal graph.json is post-build)
effective_directed: <direct-call>
nodes: 453
unverified_code_nodes: 0
raw_edges: 1204
valid_candidate_edges: 1204
missing_endpoint_edges: 0
dangling_endpoint_edges: 0
external_reference_edges: 0
self_loop_edges: 1
exact_duplicate_edges: 0
directed_unique_endpoint_pairs: 1142
directed_same_endpoint_collapsed_edges: 62
undirected_unique_endpoint_pairs: 1135
undirected_same_endpoint_collapsed_edges: 69
same_endpoint_group_count: 54
relation_variant_groups: 35
source_file_variant_groups: 0
source_location_variant_groups: 19
context_variant_groups: 0
post_build_graph_type: Graph
post_build_edges: 1135
producer_suppression_sites: 12
producer_suppression_examples:
  - L1813 seen_ids arity=unknown
  - L2377 seen_ids arity=unknown
  - L2379 seen_doc_refs arity=unknown
  - L3046 seen_ids arity=unknown
  - L3193 seen_ids arity=unknown
  - L4203 seen_keys arity=unknown
  - L4389 seen_keys arity=unknown
  - L7641 seen_ids arity=unknown
examples:
  - src_ui_studentpreview_test -> src_ui_studentpreview_test_onback edges=9 relations=['contains'] locations=['L108', 'L14', 'L30', 'L39', 'L48', 'L61', 'L66', 'L77', 'L94'] contexts=['']
  - src_scene_awards -> ref_three edges=3 relations=['imports_from'] locations=['L1', 'L2', 'L3'] contexts=['import']
  - docs_00_scaffold_work_document -> docs_00_scaffold_work_edge_fixtures edges=2 relations=['conceptually_related_to', 'references'] locations=['L1', 'L13'] contexts=['']
  - docs_09_real_data_work_document -> docs_09_real_data_work_consent_withdrawal edges=2 relations=['conceptually_related_to', 'references'] locations=['L1', 'L14'] contexts=['']
  - docs_04_pin_card_plan_document -> docs_04_pin_card_plan_selection_focus edges=2 relations=['conceptually_related_to', 'references'] locations=['L1', 'L7'] contexts=['']
note: normal graph.json is post-build; raw producer loss must be measured earlier.

# Graph Report - Map Project Showcase  (2026-11-20)

## Corpus Check
- 227 files · ~204,351 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 453 nodes · 1135 edges · 20 communities (10 shown, 10 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 135 edges (avg confidence: 0.87)
- Token cost: unknown input · unknown output

## Graph Freshness
- Built from commit: `4d8cd1a9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Work packages and coordination
- Discovery and map recovery
- Scene rendering and clustering
- Data contracts and fixtures
- Dependencies and build tooling
- Province geometry and placement
- Reference bubble composition
- TypeScript compiler settings
- Application commands
- Browser compiler settings
- Deployment headers
- M1 readiness exchange
- Followup review exchange

## God Nodes (most connected - your core abstractions)
1. `Project: Hamsterhub Hall of Fame Map` - 44 edges
2. `Work packages and implementation plans` - 28 edges
3. `ThailandMap()` - 23 edges
4. `AwardDiscovery()` - 18 edges
5. `Kid` - 17 edges
6. `MapPreview()` - 17 edges
7. `compilerOptions` - 17 edges
8. `react` - 16 edges
9. `generateMockKids()` - 15 edges
10. `Task 041: bubbles before the province list` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Three default fictional students` --conceptually_related_to--> `DEFAULT_MOCK_COUNT`  [INFERRED]
  Project.md → src/mock/generate.ts
- `resolveAwardGroups()` --implements--> `Visible province recipient union and explicit featured competition`  [INFERRED]
  src/data/demoAwards.ts → Docs/agents/tasks/040-phase-3-province-entry.md
- `ThailandMap()` --implements--> `Fixed center, fixed tilt, bounded zoom, medal-only entry`  [INFERRED]
  src/scene/ThailandMap.tsx → Docs/agents/tasks/040-phase-3-province-entry.md
- `ThailandMap()` --implements--> `Temporary award focus and saved overview return`  [INFERRED]
  src/scene/ThailandMap.tsx → Docs/agents/tasks/041-bubbles-first-province-journey.md
- `Manual featured-project selection` --conceptually_related_to--> `generateMockKids()`  [INFERRED]
  Project.md → src/mock/generate.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Same prepared data across map, card and list** — docs_03_data_work_prepared_collection, project_instanced_scene, project_pin_card, project_accessible_list [EXTRACTED 1.00]
- **Membership, consent and approved production release** — project_member_api, project_guardian_consent, project_organization_review, project_real_data_release [EXTRACTED 1.00]
- **Stable identity through jitter, grouping and selection** — project_deterministic_jitter, project_clusters_fanout, docs_04_pin_card_plan_selection_focus [INFERRED 0.85]
- **Trophy-left entry composition with thought-dot trail, four varied portrait circles to the right, and lower circular See all control** — docs_01_discovery_phase_3_references_07_bubble_entry_layout_trophy_anchor, docs_01_discovery_phase_3_references_07_bubble_entry_layout_thought_dot_trail, docs_01_discovery_phase_3_references_07_bubble_entry_layout_portrait_circle_cluster, docs_01_discovery_phase_3_references_07_bubble_entry_layout_see_all_circle [EXTRACTED 1.00]

## Communities (20 total, 10 thin omitted)

### Community 0 - "Work packages and coordination"
Cohesion: 0.08
Nodes (68): Agent guide — Hamsterhub Hall of Fame Map, Lead-serialized shared files, Project agent entry point, Plan — Scaffold and synthetic fixtures, 00 — Scaffold and synthetic fixtures, Separate opt-out and long-name fixtures, Plan — Discovery and decisions, 01 — Discovery and decisions (+60 more)

### Community 1 - "Discovery and map recovery"
Cohesion: 0.08
Nodes (52): Task 040: province entry complete locally, Layered Back, offscreen focus fallback and WebGL recovery, P3.2 competitions and explicit project-media links, Visible province recipient union and explicit featured competition, 114 units, production browser suite and seven-profile checks, Pop morph, re-formation, recall and optional sound, Task 041: bubbles before the province list, Competitions, presentations and characters remain pending (+44 more)

### Community 2 - "Scene rendering and clustering"
Cohesion: 0.07
Nodes (49): Fixed center, fixed tilt, bounded zoom, medal-only entry, Temporary award focus and saved overview return, Empty-map tap exits award journey, Adjustable horizontal and vertical orbit, three, clusterPoints(), compareIds(), fanOut() (+41 more)

### Community 3 - "Data contracts and fixtures"
Cohesion: 0.08
Nodes (39): react-dom, assets, files, output, root, App(), Explorer(), Mode (+31 more)

### Community 4 - "Dependencies and build tooling"
Cohesion: 0.05
Nodes (31): dependencies, react, react-dom, three, devDependencies, @playwright/test, tsx, @types/node (+23 more)

### Community 5 - "Province geometry and placement"
Cohesion: 0.10
Nodes (32): Kid Project MapPin contracts, encoder, hashId(), derivePins(), mixedFraction(), ProvinceAnchor, anchor, anchors (+24 more)

### Community 6 - "Reference bubble composition"
Cohesion: 0.13
Nodes (19): Bubble entry layout reference composition, Light blue regional map on a dark blue backdrop, Four portrait placeholder circles of varied sizes arranged to the right of the trophy, Large central portrait placeholder circle labeled Profile 1, Medium upper portrait placeholder circle labeled Profile 2, Small lower-right portrait placeholder circle labeled Profile 3, Largest portrait placeholder circle at the far right labeled Profile 4, Large lower circular See all control beneath the portrait cluster (+11 more)

### Community 7 - "TypeScript compiler settings"
Cohesion: 0.11
Nodes (18): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+10 more)

### Community 9 - "Application commands"
Cohesion: 0.17
Nodes (13): Historical generator-only test discovery, Explicit generator adapter and link test suites, scripts, build, build:review, dev, mock, preview (+5 more)

### Community 10 - "Browser compiler settings"
Cohesion: 0.50
Nodes (3): ../tsconfig.json, extends, include

## Knowledge Gaps
- **27 isolated node(s):** `P3.2 competitions and explicit project-media links`, `114 units, production browser suite and seven-profile checks`, `Competitions, presentations and characters remain pending`, `Restoration browser and seven-profile verification`, `Recorded 118 unit tests, typechecks and builds` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 147 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Discovery and map recovery` to `Scene rendering and clustering`, `Data contracts and fixtures`, `Dependencies and build tooling`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ThailandMap()` (e.g. with `Fixed center, fixed tilt, bounded zoom, medal-only entry` and `Temporary award focus and saved overview return`) actually correct?**
  _`ThailandMap()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `P3.2 competitions and explicit project-media links`, `114 units, production browser suite and seven-profile checks`, `Competitions, presentations and characters remain pending` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Work packages and coordination` be split into smaller, more focused modules?**
  _Cohesion score 0.07963089542036911 - nodes in this community are weakly interconnected._
- **Why does `Project: Hamsterhub Hall of Fame Map` connect `Work packages and coordination` to `Province geometry and placement`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Should `Discovery and map recovery` be split into smaller, more focused modules?**
  _Cohesion score 0.07531531531531531 - nodes in this community are weakly interconnected._
- **Why does `Agent guide — Hamsterhub Hall of Fame Map` connect `Work packages and coordination` to `Dependencies and build tooling`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._