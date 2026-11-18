---
type: "query"
date: "2026-11-18T03:05:14.146802+00:00"
question: "Brainstorm gold, silver, bronze and trophy awards: make the map striking first, then click an award to zoom toward it; browse asset and UI references."
contributor: "graphify"
outcome: "useful"
source_nodes: ["Instanced 3D map and picking", "Agent guide — Hamsterhub Hall of Fame Map"]
---

# Q: Brainstorm gold, silver, bronze and trophy awards: make the map striking first, then click an award to zoom toward it; browse asset and UI references.

## Answer

Expanded against the frozen graph vocabulary: map, pins, camera, motion, scene. The graph is historical; live source and Docs/08-polish/research/2026-11-18-award-map-references.md are authoritative for this study. Recommendation for review: navy Thailand landscape with softly lit extruded land, gold/silver/bronze medal artwork and a trophy silhouette for an explicit demo variant. Alternatives are daylight enamel and actual 3D trophy geometry. Browsed MapTiler Xmas, 21st Spark Badge, IconScout medal grid and Bronze Medal 14056580, IconScout Digital License, Lucide trophy and ISC license, and Magic UI Shine Border. No assets purchased, downloaded, copied or installed. The 21st preview was unsuitable; IconScout candidate needs subscription and has source-redistribution restrictions. Lucide requires preserving its license notice if copied. Reuse existing cancelable 240ms camera travel, translate camera and target together, apply orthographic zoom and viewport-aware framing. Individual pin click currently selects only. DOM badge size does not grow with map zoom. Preserve selected identity through fan-out collapse, keyboard focus, reduced motion, province-derived coordinates and strict opt-in. Keep exactly three fictional students; presentation variants are not real ranks and no production award field was added. Source review is Docs/08-polish/research/2026-11-18-camera-feasibility.md. Branch research/award-map-direction. This is research only; no app tests, servers, production changes, merge, deployment or successful Claude review. Present the short design for approval before implementation. Use one browser task at a time and sequential single-worker checks on this host. No graph rebuild was run.

## Outcome

- Signal: useful

## Source Nodes

- Instanced 3D map and picking
- Agent guide — Hamsterhub Hall of Fame Map