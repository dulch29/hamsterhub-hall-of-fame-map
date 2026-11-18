---
type: "query"
date: "2026-11-18T09:38:38.304125+00:00"
question: "How do Tasks 020 and 021 smooth award attention and reduce landing render cost?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Instanced 3D map and picking", "Agent guide — Hamsterhub Hall of Fame Map"]
---

# Q: How do Tasks 020 and 021 smooth award attention and reduce landing render cost?

## Answer

Live source is authoritative; historical graph remains frozen. Branch codex/award-hover-turn, base9055a24, sole writer Codex. Task020 removes preview marker labels/native titles, retains ARIA and explorer labels, uses interruptible280ms quaternion turns on hover/selection,15degree lean, finite paused turns. Track hovered marker key and resolve current lead each draw; Escape preserves hover. Task021 batches485islands into77province meshes with2indexed cap/wall groups and77segmented outlines; original attributes/holes/triangles/materials preserved. Diagnostic Edge1571440x900 peak WebGL draws1464to240 with unchanged500792triangles; p95RAFgap284.7to97ms single run, not phone/FPS acceptance. All79puretests, both typechecks/build pass. Full final preview17of18passed; hovered-Escape capture includes control focus ring, now isolated by hiding controls; focused production rerun plus5explorer/fanout regressions running. Readonly final review no remaining findings. See HANDOFF and Docs/agents/exchanges/2026-11-18-award-hover-landing.md for final results and unresolved realdevice/Claude lead review.

## Outcome

- Signal: useful

## Source Nodes

- Instanced 3D map and picking
- Agent guide — Hamsterhub Hall of Fame Map