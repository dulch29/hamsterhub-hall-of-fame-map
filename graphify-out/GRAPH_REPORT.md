# Task 049 targeted graph update

Task 049: fictional-only Gemini Guide chat, bounded server requests and click-to-navigate results. Reused public structural extraction plus complete task-packet semantics recording the bounded live Gemini result separately from controlled browser checks; earlier semantic history retained.

Token usage and cost: unknown. Full task-document line coverage and SHA-256 source hashes are saved in task049-semantic.json and task049-sources.json. Earlier document/media semantics remain historical, including superseded requirements. The Task047 character SVGs remain hashed and represented through their earlier task descriptions; their image content was not re-extracted. Environment files, private input/media, dependencies and generated test/build output are excluded before inventory classification. No chat credentials were read. Task049 separately records controlled-fetch/browser checks and one successful bounded live handler request (provider/application HTTP 200), verifying connectivity and structured reply parsing with fictional data. Actual Vercel execution and physical-phone/GPU checks remain open; no deployment occurred. This graph worker reused the AST and performed no provider/browser/test work.

Original parallel relationship records are preserved in graph.json; the undirected analytical graph collapses same-endpoint relationships and retains known self-loops. The AST merges one same-name TypeScript type/function pair into a shared identifier; 30 files expose no symbol definitions but retain file nodes. The BOM warning in browser tsconfig resolution does not prevent its config nodes from being extracted. The previously resolved guides.css file-only node is retained. Explicit node:http and node:stream imports are preserved with verified external module nodes because the extractor omitted those endpoints.

These Graphify outputs are written into the working tree for the team to share; caches and dot-prefixed sidecars are ignored.

[graphify] MultiDiGraph edge-collapse diagnostic
input: <in-memory>
input_stage: provided JSON (normal graph.json is post-build)
effective_directed: <direct-call>
nodes: 593
unverified_code_nodes: 0
raw_edges: 1605
valid_candidate_edges: 1605
missing_endpoint_edges: 0
dangling_endpoint_edges: 0
external_reference_edges: 0
self_loop_edges: 1
exact_duplicate_edges: 0
directed_unique_endpoint_pairs: 1553
directed_same_endpoint_collapsed_edges: 52
undirected_unique_endpoint_pairs: 1546
undirected_same_endpoint_collapsed_edges: 59
same_endpoint_group_count: 51
relation_variant_groups: 38
source_file_variant_groups: 0
source_location_variant_groups: 13
context_variant_groups: 0
post_build_graph_type: Graph
post_build_edges: 1546
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
- 250 files · ~130,289 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 593 nodes · 1546 edges · 27 communities (13 shown, 14 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 207 edges (avg confidence: 0.9)
- Token cost: unknown input · unknown output

## Graph Freshness
- Built from commit: `ec6ddd0d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Scene rendering and clustering
- Browser journey checks
- Work packages and coordination
- Student discovery and presentation
- Server adapters and Vite
- Guide chat and character narration
- Guide chat and character narration
- Application commands
- Data contracts and fixtures
- Gemini Guide and bounded navigation
- Reference bubble composition
- TypeScript compiler settings
- Browser compiler settings
- Deployment headers
- M1 readiness exchange
- Followup review exchange

## God Nodes (most connected - your core abstractions)
1. `Project: Hamsterhub Hall of Fame Map` - 44 edges
2. `Work packages and implementation plans` - 28 edges
3. `MapPreview()` - 24 edges
4. `ThailandMap()` - 23 edges
5. `react` - 22 edges
6. `AwardDiscovery()` - 22 edges
7. `provinceRecipients()` - 20 edges
8. `@playwright/test` - 17 edges
9. `Kid` - 17 edges
10. `compilerOptions` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Three default fictional students` --conceptually_related_to--> `DEFAULT_MOCK_COUNT`  [INFERRED]
  Project.md → src/mock/generate.ts
- `AwardDiscovery()` --implements--> `One shared glossy bubble material`  [INFERRED]
  src/ui/AwardDiscovery.tsx → Docs/agents/tasks/044-shared-bubble-finish.md
- `resolveAwardGroups()` --implements--> `Visible province recipient union and explicit featured competition`  [INFERRED]
  src/data/demoAwards.ts → Docs/agents/tasks/040-phase-3-province-entry.md
- `ThailandMap()` --implements--> `Fixed center, fixed tilt, bounded zoom, medal-only entry`  [INFERRED]
  src/scene/ThailandMap.tsx → Docs/agents/tasks/040-phase-3-province-entry.md
- `useDiscoveryMotion()` --implements--> `Pop morph, re-formation, recall and optional sound`  [INFERRED]
  src/ui/useDiscoveryMotion.ts → Docs/agents/tasks/041-bubbles-first-province-journey.md

## Import Cycles
- 1-file cycle: `server/guideMiddleware.ts -> server/guideMiddleware.ts`

## Hyperedges (group relationships)
- **Same prepared data across map, card and list** — docs_03_data_work_prepared_collection, project_instanced_scene, project_pin_card, project_accessible_list [EXTRACTED 1.00]
- **Membership, consent and approved production release** — project_member_api, project_guardian_consent, project_organization_review, project_real_data_release [EXTRACTED 1.00]
- **Stable identity through jitter, grouping and selection** — project_deterministic_jitter, project_clusters_fanout, docs_04_pin_card_plan_selection_focus [INFERRED 0.85]
- **Trophy-left entry composition with thought-dot trail, four varied portrait circles to the right, and lower circular See all control** — docs_01_discovery_phase_3_references_07_bubble_entry_layout_trophy_anchor, docs_01_discovery_phase_3_references_07_bubble_entry_layout_thought_dot_trail, docs_01_discovery_phase_3_references_07_bubble_entry_layout_portrait_circle_cluster, docs_01_discovery_phase_3_references_07_bubble_entry_layout_see_all_circle [EXTRACTED 1.00]

## Communities (27 total, 14 thin omitted)

### Community 0 - "Scene rendering and clustering"
Cohesion: 0.05
Nodes (61): Award direction comparison08, Illustrated B: Laurel enamel, Illustrated A: Sculpted enamel, Shared proposed award family, Fixed center, fixed tilt, bounded zoom, medal-only entry, Temporary award focus and saved overview return, Empty-map tap exits award journey, Adjustable horizontal and vertical orbit (+53 more)

### Community 1 - "Browser journey checks"
Cohesion: 0.07
Nodes (46): Kid Project MapPin contracts, react-dom, App(), Explorer(), Mode, ThailandMap, AwardAssociation, DEMO_AWARDS (+38 more)

### Community 2 - "Work packages and coordination"
Cohesion: 0.08
Nodes (71): Agent guide — Hamsterhub Hall of Fame Map, Lead-serialized shared files, Project agent entry point, Plan — Scaffold and synthetic fixtures, Historical generator-only test discovery, 00 — Scaffold and synthetic fixtures, Separate opt-out and long-name fixtures, Plan — Discovery and decisions (+63 more)

### Community 3 - "Student discovery and presentation"
Cohesion: 0.09
Nodes (44): Task 044: shared bubble finish, Preserved bubble sizes and journey, Task 044 local verification, Open acceptance and P3.3 boundary, Student competition entry and shell, Explicit demo presentation associations, Task 045: student competitions and presentations, Boundary focus and opening-morph completion (+36 more)

### Community 4 - "Server adapters and Vite"
Cohesion: 0.06
Nodes (36): Fictional fixtures and owner curation, Click-only existing journey navigation, Task 049: conversational Gemini Guide, Vercel entry and Vite dev/preview adapters, Deployment and device acceptance pending, Live Gemini connectivity and structured reply verified, Server and visible-client target validation, Bounded chat request contract (+28 more)

### Community 5 - "Guide chat and character narration"
Cohesion: 0.11
Nodes (34): Approved Thai demo narration scripts, Demo boundaries and original temporary artwork, Task 047: Guide, Explainer and narration, Explainer province travel and student handoff, Guide welcome and bounded help, Explicitly enabled local Thai device speech, Finite character travel without blocking browsing, Device speech and visual acceptance remain open (+26 more)

### Community 6 - "Guide chat and character narration"
Cohesion: 0.11
Nodes (26): Task 040: province entry complete locally, Layered Back, offscreen focus fallback and WebGL recovery, P3.2 competitions and explicit project-media links, Visible province recipient union and explicit featured competition, 114 units, production browser suite and seven-profile checks, Pop morph, re-formation, recall and optional sound, Task 041: bubbles before the province list, Competitions, presentations and characters remain pending (+18 more)

### Community 7 - "Application commands"
Cohesion: 0.06
Nodes (34): dependencies, react, react-dom, three, devDependencies, @playwright/test, tsx, @types/node (+26 more)

### Community 8 - "Data contracts and fixtures"
Cohesion: 0.10
Nodes (27): encoder, hashId(), derivePins(), mixedFraction(), ProvinceAnchor, anchor, anchors, generateProvincePins() (+19 more)

### Community 9 - "Gemini Guide and bounded navigation"
Cohesion: 0.09
Nodes (3): @playwright/test, SpeechProbe, Window

### Community 10 - "Reference bubble composition"
Cohesion: 0.13
Nodes (19): Bubble entry layout reference composition, Light blue regional map on a dark blue backdrop, Four portrait placeholder circles of varied sizes arranged to the right of the trophy, Large central portrait placeholder circle labeled Profile 1, Medium upper portrait placeholder circle labeled Profile 2, Small lower-right portrait placeholder circle labeled Profile 3, Largest portrait placeholder circle at the far right labeled Profile 4, Large lower circular See all control beneath the portrait cluster (+11 more)

### Community 11 - "TypeScript compiler settings"
Cohesion: 0.11
Nodes (18): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+10 more)

### Community 12 - "Browser compiler settings"
Cohesion: 0.50
Nodes (3): ../tsconfig.json, extends, include

## Knowledge Gaps
- **36 isolated node(s):** `P3.2 competitions and explicit project-media links`, `114 units, production browser suite and seven-profile checks`, `Competitions, presentations and characters remain pending`, `Restoration browser and seven-profile verification`, `Device speech and visual acceptance remain open` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 175 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Student discovery and presentation` to `Scene rendering and clustering`, `Browser journey checks`, `Guide chat and character narration`, `Guide chat and character narration`, `Application commands`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `MapPreview()` (e.g. with `Layered Back, offscreen focus fallback and WebGL recovery` and `View all opens the province list`) actually correct?**
  _`MapPreview()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `P3.2 competitions and explicit project-media links`, `114 units, production browser suite and seven-profile checks`, `Competitions, presentations and characters remain pending` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Scene rendering and clustering` be split into smaller, more focused modules?**
  _Cohesion score 0.05420054200542006 - nodes in this community are weakly interconnected._
- **Why does `Project: Hamsterhub Hall of Fame Map` connect `Work packages and coordination` to `Browser journey checks`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Should `Browser journey checks` be split into smaller, more focused modules?**
  _Cohesion score 0.07469135802469136 - nodes in this community are weakly interconnected._
- **Why does `Agent guide — Hamsterhub Hall of Fame Map` connect `Work packages and coordination` to `Application commands`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._