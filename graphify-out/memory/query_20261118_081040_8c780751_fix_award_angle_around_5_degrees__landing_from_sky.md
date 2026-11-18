---
type: "query"
date: "2026-11-18T08:10:40.509070+00:00"
question: "Fix award angle around 5 degrees, landing from sky and selected province awards face forward; 360 degree rotation opinion only"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Instanced 3D map and picking", "Agent guide — Hamsterhub Hall of Fame Map"]
---

# Q: Fix award angle around 5 degrees, landing from sky and selected province awards face forward; 360 degree rotation opinion only

## Answer

Expanded from graph vocab: province scene instanced map picking selection. Historical graph establishes scene ownership and constraints; live Task019 source authoritative. On codex/award-focus-skyfall base e5c1cd6, resting award meshes lean5deg localZ; selected province main/companions face camera with cached idle matrices and real3D orbit positions. Landing keeps2.2s, derives lift above fitted sky edge and retreats orthographic camera along viewing axis to avoid nearplane popping in narrow fits, preserving XY.75unit tests, both typechecks/build passed.17productionpreview behaviors passed across main16/17 run plus corrected2/2 skyframe run. Reviewer caught nearclip issue reproduced red/green. Claude review timedout. Continuous360spin not implemented. Final explorer/CUA checks and durable evidence in HANDOFF.md and Docs/agents/exchanges/2026-11-18-award-focus-skyfall.md.

## Outcome

- Signal: useful

## Source Nodes

- Instanced 3D map and picking
- Agent guide — Hamsterhub Hall of Fame Map