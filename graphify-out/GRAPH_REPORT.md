# Tasks 046/047 targeted graph update

Tasks 046/047: View all pop/form feedback, distinct Guide/Explainer roles and explicitly enabled local Thai narration with text fallback. Current public structural extraction plus complete semantics from both task packets; earlier semantic history retained.

Token usage and cost: unknown. Full task-document line coverage and SHA-256 source hashes are saved in task047-semantic.json and task047-sources.json. Earlier document/media semantics remain historical, including superseded requirements. The two new original character SVGs are hashed and represented through task descriptions; their image content was not semantically extracted. Private input/media, dependencies and generated test/build output are excluded from this refresh.

Original parallel relationship records are preserved in graph.json; the undirected analytical graph collapses same-endpoint relationships and retains known self-loops. The AST merges one same-name TypeScript type/function pair into a shared identifier; 26 files expose no symbol definitions but retain file nodes. The BOM warning in browser tsconfig resolution does not prevent its config nodes from being extracted. The missing guides.css AST import target was resolved to a verified file-only stylesheet node without dropping the import relationship.

These Graphify outputs are written into the working tree for the team to share; caches and dot-prefixed sidecars are ignored.

[graphify] MultiDiGraph edge-collapse diagnostic
input: <in-memory>
input_stage: provided JSON (normal graph.json is post-build)
effective_directed: <direct-call>
nodes: 526
unverified_code_nodes: 0
raw_edges: 1396
valid_candidate_edges: 1396
missing_endpoint_edges: 0
dangling_endpoint_edges: 0
external_reference_edges: 0
self_loop_edges: 1
exact_duplicate_edges: 0
directed_unique_endpoint_pairs: 1346
directed_same_endpoint_collapsed_edges: 50
undirected_unique_endpoint_pairs: 1339
undirected_same_endpoint_collapsed_edges: 57
same_endpoint_group_count: 49
relation_variant_groups: 36
source_file_variant_groups: 0
source_location_variant_groups: 13
context_variant_groups: 0
post_build_graph_type: Graph
post_build_edges: 1339
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
  - src_scene_awards -> ref_three edges=3 relations=['imports_from'] locations=['L1', 'L2', 'L3'] contexts=['import']
  - docs_00_scaffold_work_document -> docs_00_scaffold_work_edge_fixtures edges=2 relations=['conceptually_related_to', 'references'] locations=['L1', 'L13'] contexts=['']
  - docs_09_real_data_work_document -> docs_09_real_data_work_consent_withdrawal edges=2 relations=['conceptually_related_to', 'references'] locations=['L1', 'L14'] contexts=['']
  - docs_04_pin_card_plan_document -> docs_04_pin_card_plan_selection_focus edges=2 relations=['conceptually_related_to', 'references'] locations=['L1', 'L7'] contexts=['']
  - docs_04_pin_card_plan_document -> docs_04_pin_card_plan_safe_links edges=2 relations=['conceptually_related_to', 'references'] locations=['L1', 'L9'] contexts=['']
note: normal graph.json is post-build; raw producer loss must be measured earlier.

# Graph Report - Map Project Showcase  (2026-11-20)

## Corpus Check
- 234 files · ~214,361 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .css 4, (none) 2, .geojson 1)

## Summary
- 526 nodes · 1339 edges · 31 communities (17 shown, 14 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 175 edges (avg confidence: 0.89)
- Token cost: unknown input · unknown output

## Graph Freshness
- Built from commit: `67280425`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Work packages and coordination
- Discovery, recovery and bubble feedback
- Scene rendering and clustering
- Province geometry and placement
- Guide roles and narration
- Province geometry and placement
- Browser journey checks
- Reference bubble composition
- Shared bubble layout and finish
- TypeScript compiler settings
- Review export and build scripts
- Package metadata
- Development dependencies
- Application commands
- Review coordination scripts
- Runtime dependencies
- Browser compiler settings
- Deployment headers
- M1 readiness exchange
- Followup review exchange

## God Nodes (most connected - your core abstractions)
1. `Project: Hamsterhub Hall of Fame Map` - 44 edges
2. `Work packages and implementation plans` - 28 edges
3. `ThailandMap()` - 23 edges
4. `AwardDiscovery()` - 22 edges
5. `MapPreview()` - 22 edges
6. `react` - 20 edges
7. `provinceRecipients()` - 18 edges
8. `Kid` - 17 edges
9. `compilerOptions` - 17 edges
10. `@playwright/test` - 16 edges

## Surprising Connections (you probably didn't know these)
- `presentationLayout()` --implements--> `Responsive student identity and detail`  [INFERRED]
  src/ui/bubbleLayout.ts → Docs/agents/tasks/045-competition-presentations.md
- `AwardDiscovery()` --implements--> `One shared glossy bubble material`  [INFERRED]
  src/ui/AwardDiscovery.tsx → Docs/agents/tasks/044-shared-bubble-finish.md
- `ThailandMap()` --implements--> `Fixed center, fixed tilt, bounded zoom, medal-only entry`  [INFERRED]
  src/scene/ThailandMap.tsx → Docs/agents/tasks/040-phase-3-province-entry.md
- `resolveAwardGroups()` --implements--> `Visible province recipient union and explicit featured competition`  [INFERRED]
  src/data/demoAwards.ts → Docs/agents/tasks/040-phase-3-province-entry.md
- `ThailandMap()` --implements--> `Temporary award focus and saved overview return`  [INFERRED]
  src/scene/ThailandMap.tsx → Docs/agents/tasks/041-bubbles-first-province-journey.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Same prepared data across map, card and list** — docs_03_data_work_prepared_collection, project_instanced_scene, project_pin_card, project_accessible_list [EXTRACTED 1.00]
- **Membership, consent and approved production release** — project_member_api, project_guardian_consent, project_organization_review, project_real_data_release [EXTRACTED 1.00]
- **Stable identity through jitter, grouping and selection** — project_deterministic_jitter, project_clusters_fanout, docs_04_pin_card_plan_selection_focus [INFERRED 0.85]
- **Trophy-left entry composition with thought-dot trail, four varied portrait circles to the right, and lower circular See all control** — docs_01_discovery_phase_3_references_07_bubble_entry_layout_trophy_anchor, docs_01_discovery_phase_3_references_07_bubble_entry_layout_thought_dot_trail, docs_01_discovery_phase_3_references_07_bubble_entry_layout_portrait_circle_cluster, docs_01_discovery_phase_3_references_07_bubble_entry_layout_see_all_circle [EXTRACTED 1.00]

## Communities (31 total, 14 thin omitted)

### Community 0 - "Work packages and coordination"
Cohesion: 0.07
Nodes (72): Agent guide — Hamsterhub Hall of Fame Map, Lead-serialized shared files, Project agent entry point, Plan — Scaffold and synthetic fixtures, Historical generator-only test discovery, 00 — Scaffold and synthetic fixtures, Separate opt-out and long-name fixtures, Plan — Discovery and decisions (+64 more)

### Community 1 - "Discovery, recovery and bubble feedback"
Cohesion: 0.07
Nodes (54): Task 040: province entry complete locally, Layered Back, offscreen focus fallback and WebGL recovery, P3.2 competitions and explicit project-media links, Visible province recipient union and explicit featured competition, 114 units, production browser suite and seven-profile checks, Pop morph, re-formation, recall and optional sound, Task 041: bubbles before the province list, Competitions, presentations and characters remain pending (+46 more)

### Community 2 - "Scene rendering and clustering"
Cohesion: 0.05
Nodes (54): Fixed center, fixed tilt, bounded zoom, medal-only entry, Temporary award focus and saved overview return, Empty-map tap exits award journey, Adjustable horizontal and vertical orbit, three, clusterPoints(), compareIds(), fanOut() (+46 more)

### Community 3 - "Province geometry and placement"
Cohesion: 0.09
Nodes (48): Explicit demo presentation associations, Kid Project MapPin contracts, react-dom, App(), Explorer(), Mode, ThailandMap, AwardAssociation (+40 more)

### Community 4 - "Guide roles and narration"
Cohesion: 0.16
Nodes (22): Approved Thai demo narration scripts, Demo boundaries and original temporary artwork, Task 047: Guide, Explainer and narration, Explainer province travel and student handoff, Guide welcome and bounded help, Explicitly enabled local Thai device speech, Finite character travel without blocking browsing, Device speech and visual acceptance remain open (+14 more)

### Community 5 - "Province geometry and placement"
Cohesion: 0.14
Nodes (19): generateProvincePins(), inPolygon(), inRing(), interiorAnchor(), isFeature(), isPolygon(), isRecord(), isRing() (+11 more)

### Community 6 - "Browser journey checks"
Cohesion: 0.09
Nodes (3): @playwright/test, SpeechProbe, Window

### Community 7 - "Reference bubble composition"
Cohesion: 0.13
Nodes (19): Bubble entry layout reference composition, Light blue regional map on a dark blue backdrop, Four portrait placeholder circles of varied sizes arranged to the right of the trophy, Large central portrait placeholder circle labeled Profile 1, Medium upper portrait placeholder circle labeled Profile 2, Small lower-right portrait placeholder circle labeled Profile 3, Largest portrait placeholder circle at the far right labeled Profile 4, Large lower circular See all control beneath the portrait cluster (+11 more)

### Community 8 - "Shared bubble layout and finish"
Cohesion: 0.20
Nodes (16): Task 044: shared bubble finish, Preserved bubble sizes and journey, Task 044 local verification, bubbleFocusX(), bubbleFootprint(), bubbleLayout(), BubblePoint, BubbleViewport (+8 more)

### Community 9 - "TypeScript compiler settings"
Cohesion: 0.11
Nodes (18): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+10 more)

### Community 10 - "Review export and build scripts"
Cohesion: 0.18
Nodes (8): Fictional fixtures and owner curation, vite, @vitejs/plugin-react, assets, files, output, root, localFiles

### Community 11 - "Package metadata"
Cohesion: 0.18
Nodes (10): name, private, type, version, tsx, @types/node, @types/react, @types/react-dom (+2 more)

### Community 12 - "Development dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, @playwright/test, tsx, @types/node, @types/react, @types/react-dom, @types/three, typescript (+2 more)

### Community 13 - "Application commands"
Cohesion: 0.20
Nodes (10): scripts, build, build:review, dev, mock, preview, test:browser, test:browser:preview (+2 more)

### Community 14 - "Review coordination scripts"
Cohesion: 0.24
Nodes (4): defaultContext, main(), root, workspacePath()

### Community 15 - "Runtime dependencies"
Cohesion: 0.50
Nodes (4): dependencies, react, react-dom, three

### Community 16 - "Browser compiler settings"
Cohesion: 0.50
Nodes (3): ../tsconfig.json, extends, include

## Knowledge Gaps
- **31 isolated node(s):** `P3.2 competitions and explicit project-media links`, `114 units, production browser suite and seven-profile checks`, `Competitions, presentations and characters remain pending`, `Restoration browser and seven-profile verification`, `Recorded 118 unit tests, typechecks and builds` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 164 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Discovery, recovery and bubble feedback` to `Province geometry and placement`, `Scene rendering and clustering`, `Package metadata`, `Guide roles and narration`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `ThailandMap()` (e.g. with `Fixed center, fixed tilt, bounded zoom, medal-only entry` and `Temporary award focus and saved overview return`) actually correct?**
  _`ThailandMap()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `P3.2 competitions and explicit project-media links`, `114 units, production browser suite and seven-profile checks`, `Competitions, presentations and characters remain pending` to the rest of the system?**
  _31 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Work packages and coordination` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Why does `Project: Hamsterhub Hall of Fame Map` connect `Work packages and coordination` to `Province geometry and placement`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `AwardDiscovery()` (e.g. with `Deduplicated province recipient bubbles` and `Circular See all and preserved province journey`) actually correct?**
  _`AwardDiscovery()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Should `Discovery, recovery and bubble feedback` be split into smaller, more focused modules?**
  _Cohesion score 0.06772151898734177 - nodes in this community are weakly interconnected._