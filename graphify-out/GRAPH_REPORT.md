# Graph Report - Map Project Showcase  (2026-11-17)

## Corpus Check
- Corpus is ~18,733 words - fits in a single context window. You may not need a graph.

## Summary
- 191 nodes · 430 edges · 11 communities (8 shown, 3 thin omitted)
- Extraction: 76% EXTRACTED · 24% INFERRED · 0% AMBIGUOUS · INFERRED: 104 edges (avg confidence: 0.85)
- Token cost: unknown input · unknown output

## Community Hubs (Navigation)
- Synthetic App and Components
- Dependencies and Build Scripts
- Production Privacy and Map
- Prepared Data and Accessibility
- Agent Coordination and Evidence
- TypeScript Compiler Configuration
- Fixtures and Dense Clustering
- CLI Review and Export
- Initial Readiness Review Request
- Review Follow-up Request

## God Nodes (most connected - your core abstractions)
1. `Project: Hamsterhub Hall of Fame Map` - 44 edges
2. `Work packages and implementation plans` - 28 edges
3. `compilerOptions` - 17 edges
4. `03 — Shared data and featured projects` - 14 edges
5. `Agent guide — Hamsterhub Hall of Fame Map` - 13 edges
6. `02 — Province data and 3D map` - 12 edges
7. `04 — Pin Card and links` - 12 edges
8. `08 — Visual polish and performance` - 11 edges
9. `09 — Real data, consent, and release` - 11 edges
10. `01 — Discovery and decisions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Three default fictional students` --conceptually_related_to--> `DEFAULT_MOCK_COUNT`  [INFERRED]
  Project.md → src/mock/generate.ts
- `Coordinator-driven Claude review bridge` --conceptually_related_to--> `main()`  [INFERRED]
  Docs/agents/cli-communication.md → scripts/claude-review.mjs
- `Manual featured-project selection` --conceptually_related_to--> `generateMockKids()`  [INFERRED]
  Project.md → src/mock/generate.ts
- `Three default fictional students` --conceptually_related_to--> `generateMockKids()`  [INFERRED]
  Project.md → src/mock/generate.ts
- `Kid Project MapPin contracts` --conceptually_related_to--> `MapPin`  [INFERRED]
  Project.md → src/types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Same prepared data across map, card and list** — docs_03_data_work_prepared_collection, project_instanced_scene, project_pin_card, project_accessible_list [EXTRACTED 1.00]
- **Membership, consent and approved production release** — project_member_api, project_guardian_consent, project_organization_review, project_real_data_release [EXTRACTED 1.00]
- **Stable identity through jitter, grouping and selection** — project_deterministic_jitter, project_clusters_fanout, docs_04_pin_card_plan_selection_focus [INFERRED 0.85]

## Communities (11 total, 3 thin omitted)

### Community 0 - "Synthetic App and Components"
Cohesion: 0.12
Nodes (27): Kid Project MapPin contracts, react, react-dom, App(), duplicateIds(), prepareKids(), validId(), createLongNameKid() (+19 more)

### Community 1 - "Dependencies and Build Scripts"
Cohesion: 0.06
Nodes (32): dependencies, react, react-dom, three, devDependencies, tsx, @types/node, @types/react (+24 more)

### Community 2 - "Production Privacy and Map"
Cohesion: 0.21
Nodes (23): Plan — Discovery and decisions, 01 — Discovery and decisions, Plan — Province data and 3D map, Scene failure and context-loss signals, 02 — Province data and 3D map, Plan — Member authentication and site integration, Production backend unselected, 07 — Member authentication and site integration (+15 more)

### Community 3 - "Prepared Data and Accessibility"
Cohesion: 0.21
Nodes (20): Plan — Shared data and featured projects, Null for invalid or unset selection, 03 — Shared data and featured projects, Shared filtered and resolved collection, Project visibility adapter boundary, Plan — Pin Card and links, Accessible project and Profile anchors, Shared selection and focus restoration (+12 more)

### Community 4 - "Agent Coordination and Evidence"
Cohesion: 0.20
Nodes (16): Agent guide — Hamsterhub Hall of Fame Map, Lead-serialized shared files, Project agent entry point, Coordinator-driven Claude review bridge, Codex ↔ Claude Code CLI communication, Explicit review context snapshots, Project context engineering protocol, Claude Code / Codex exchange: M1 readiness (+8 more)

### Community 5 - "TypeScript Compiler Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+10 more)

### Community 6 - "Fixtures and Dense Clustering"
Cohesion: 0.25
Nodes (13): Plan — Scaffold and synthetic fixtures, Historical generator-only test discovery, 00 — Scaffold and synthetic fixtures, Separate opt-out and long-name fixtures, Explicit dense Bangkok fixture, Plan — Clustering and fan-out, 05 — Clustering and fan-out, Task 003 — Review the fixture implementation slice (+5 more)

### Community 7 - "CLI Review and Export"
Cohesion: 0.22
Nodes (4): defaultContext, main(), root, workspacePath()

## Knowledge Gaps
- **12 isolated node(s):** `three`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/three` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 63 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Project: Hamsterhub Hall of Fame Map` connect `Production Privacy and Map` to `Synthetic App and Components`, `Prepared Data and Accessibility`, `Agent Coordination and Evidence`, `Fixtures and Dense Clustering`?**
  _High betweenness centrality (0.248) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `03 — Shared data and featured projects` (e.g. with `Null for invalid or unset selection` and `Shared filtered and resolved collection`) actually correct?**
  _`03 — Shared data and featured projects` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `three`, `@types/node`, `@types/react` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Synthetic App and Components` be split into smaller, more focused modules?**
  _Cohesion score 0.11627906976744186 - nodes in this community are weakly interconnected._
- **Why does `Agent guide — Hamsterhub Hall of Fame Map` connect `Agent Coordination and Evidence` to `Dependencies and Build Scripts`, `Production Privacy and Map`?**
  _High betweenness centrality (0.216) - this node is a cross-community bridge._
- **Should `Dependencies and Build Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Why does `Work packages and implementation plans` connect `Agent Coordination and Evidence` to `Production Privacy and Map`, `Prepared Data and Accessibility`, `Fixtures and Dense Clustering`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._

## Build provenance and limitations

- Corpus: 57 files, 18733 detected words; 17 code and 40 documents.
- Graphify package 0.9.93; skill 0.9.100. Used the installed package's Python APIs, with no upgrade.
- Structural extraction: graphify AST. Semantic extraction: host session; no callable extraction-subagent tool was available. No API key used or requested.
- Host token usage: **unknown**. Monetary/token cost: **unknown**. AST extraction itself makes no LLM request. No usage estimate is presented as actual usage.
- All 40 detected documents were read completely. Extraction is selective and does not imply every sentence became a node.
- Source hashes and per-document line coverage are in source-snapshot.json and coverage.json. Node/edge source locations and confidence labels are preserved.
- Simple undirected analysis: 430 edges. JSON export: 459 original relationship records; parallel relationships are retained with multigraph metadata.
- Hyperedges: 3; connected components: 5; isolated nodes: 3.
- Raw directional endpoints remain in extraction.json and graph.json. Community analysis and HTML are undirected; do not read a shortest path as a causal dependency chain.
- Plan nodes, review requests, templates, historical checks, and current code have separate provenance/status attributes. A plan or historical successful check is not proof of implemented behavior.
- AST yielded file nodes but no symbols for: scripts/generate-mock.ts, src/main.tsx, src/mock/generate.test.ts, vite.config.ts, src/data/prepareKids.test.ts, src/ui/links.test.ts. These files have incomplete structural detail.
- Excluded node_modules/, dist/, .agent-exchanges/ raw source copies, graphify-out/, and .git/; no sensitive files were reported by detection.
- Code symbol extraction is not a full TypeScript compiler analysis; callback calls, dynamic behavior, and UI runtime behavior may be missing.
- No application tests, production security checks, or architecture review were performed. HTML was generated and statically validated; interactive browser behavior was not tested.
- No Git revision was available. This is a source-hash snapshot taken while other work may proceed.
- Code-origin semantic bridges are retained in extraction.json; the document-only semantic cache does not cache those bridges.

**Graph health warnings:**
- 29 relationships collapse in the undirected analysis graph.

**Final source drift audit (snapshot frozen):**
- Snapshot cutoff: 2026-11-17T14:52:20.043948+00:00.
- Checked at: 2026-11-17T14:58:32.220654+00:00.
- Changed captured files (10): `Docs/02-map/plan.md`, `Docs/03-data/plan.md`, `Docs/03-data/work.md`, `Docs/04-pin-card/plan.md`, `Docs/04-pin-card/work.md`, `Docs/README.md`, `Docs/agents/exchanges/2026-11-17-data-implementation.md`, `HANDOFF.md`, `package.json`, `src/ui/PinCard.tsx`.
- Added supported files outside snapshot (5): `Docs/agents/tasks/006-card-review.md`, `Docs/agents/tasks/007-pin-derivation-review.md`, `src/geo/hash.ts`, `src/geo/pins.test.ts`, `src/geo/pins.ts`.
- Removed captured files (0): none.
- Newly added geo sources are outside this snapshot. No extraction refresh was performed. Later edits are outside this final audit.

## Benchmark audit

- The CLI benchmark uses a 9,550-word node-count estimate by default; its reported reduction was 7.9x.
- Re-run through the installed benchmark API with the detected 18,733-word corpus: ~24,977 full-corpus tokens, ~1,616 average query tokens, 15.5x estimated reduction.
- These are text-length heuristics, not measured model usage or savings. Actual tokens and cost are unknown. See benchmark.json.
- Report terminology: the auto-generated Knowledge Gaps section calls degree-one symbols isolated; the actual graph has 3 degree-zero isolates and 5 connected components. Community detail lists omit file nodes; JSON carries full membership.
