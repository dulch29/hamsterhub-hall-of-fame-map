---
type: "query"
date: "2026-11-18T07:05:48.145325+00:00"
question: "Make main awards float upright, use smaller atom-like medals orbiting in front and behind, balance landing timing, highlight award provinces, and preserve the reference oblique home view."
contributor: "graphify"
outcome: "useful"
source_nodes: ["Instanced 3D map and picking", "Agent guide — Hamsterhub Hall of Fame Map"]
---

# Q: Make main awards float upright, use smaller atom-like medals orbiting in front and behind, balance landing timing, highlight award provinces, and preserve the reference oblique home view.

## Answer

Task 018 continuation, verified 2026-11-18. Feature commit e9ba743 on codex/award-orbit-view, based on38b6286, private remote dulch29/hamsterhub-hall-of-fame-map. Latest user direction implemented: main awards zero world rotation with gentle5.2s bob; smaller actual3D companion meshes at34percent scale on inclined10s atom-like orbits with real front/back depth; province award surfaces highlighted mint+restrained emissive; entrance complete2200ms (0-900ms spread,1300ms cubic ease-in-out falls); initial/reset oblique offset(-10,19,12), responsive fit north-west upper left/south lower right. Three fictional students and sample awards only; strict opt-in, province-only placement, Kid contract, explorer, accessibility and fallback preserved. No dependencies/downloaded models. Companions now share instanced geometry and renderer; sprite/CSS orbit removed. Explicit user request supersedes Task017 no-idle-WebGL rule: idle loop updates mesh matrices from cached placements without DOM projection, with pause/reduced/hidden/disposal cancellation. Camera/landing draw carry current awards. Reviewer Heisenberg found clipped bases/lowest arc at large scales and discarded repeated companion counts. Failing regressions reproduced both; fix lifts center for complete scaled clearance and expands all counted instances. Final source recheck no actionable issues. Final72 unit tests, both typechecks, build passed. Development15 preview passed before last clearance/count refinements;19 explorer/fan-out passed afterward including500 IDs. Final production-preview15/15 after both fixes. Edge one worker traceoff sequential. npm Vite startup timed out; ignored task configs invoke local Vite directly with cwd/project and120s startup allowance, no product performance claim. Earlier redgreen source reached devserver; discarded attempt, restored before clean verification. Final build main244.04kB raw76.89gzip, lazy scene617.44/156.95; existing chunkwarning. Computer Use inspected final overview/trophy/pause/resume/reset, viewport cleared and left overview playing; saved desktop320px/1440px, tilt and landing captures inspected. One Claude bridge attempt timed out4minutes no response, no lead approval/retry/globalconfigchange. Physicalphone/GPU/FPS/boss acceptance pending, no merge/deploy. Read HANDOFF.md, Docs/agents/tasks/018-award-orbit-view.md, Docs/agents/exchanges/2026-11-18-award-orbits.md. Graph query expanded using actual vocabulary[instanced,map,picking,province,scene,agent,guide] returned historical orientation; frozen graph/source snapshot not rebuilt and live source authoritative. Useful result is verified continuation.

## Outcome

- Signal: useful

## Source Nodes

- Instanced 3D map and picking
- Agent guide — Hamsterhub Hall of Fame Map