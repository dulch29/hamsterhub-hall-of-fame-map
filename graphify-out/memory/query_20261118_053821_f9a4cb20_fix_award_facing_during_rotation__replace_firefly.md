---
type: "query"
date: "2026-11-18T05:38:21.478927+00:00"
question: "Fix award facing during rotation, replace firefly VFX with star luster or constellations, float smaller medals around the highest-value award, and land the map province block by province block."
contributor: "graphify"
outcome: "useful"
source_nodes: ["Instanced 3D map and picking", "Agent guide — Hamsterhub Hall of Fame Map"]
---

# Q: Fix award facing during rotation, replace firefly VFX with star luster or constellations, float smaller medals around the highest-value award, and land the map province block by province block.

## Answer

Task 017 continuation, verified 2026-11-18. Feature commit 3285c25 on codex/award-constellations, based on 1ed5e4f, private remote dulch29/hamsterhub-hall-of-fame-map. All four requested changes implemented: primary award geometry follows the camera quaternion, warm constellation luster replaces preview fireflies, highest-value sample leads with smaller floating companion medals, and province blocks/outlines arrive in an overlapping north-to-south fall settled within 1200ms. Every sample retains a warm baseline; light density is bounded at 30 points and decorative. Main awards follow province elevation during landing, with a failing/passing reprojection regression for occlusion. Interaction, resize, hidden tabs and reduced motion settle entrance; reset does not replay it. Pause starlight freezes float/twinkle. Main scene remains on demand after entrance; companion PNGs are generated once from existing local geometry/context and animated by CSS. Exactly three fictional students remain: Bangkok trophy plus gold/silver companions, Chiang Mai silver/bronze, Phuket bronze. Sample artwork only, no earned ranks, production award schema, Kid contract, dependencies or model downloads. Province-only placement, strict opt-in, explorer at ?view=explorer and accessibility/fallback preserved. 70 unit tests, application/browser typechecks and final build passed. 33 development browser checks including all 19 explorer/fan-out cases and all 500 IDs passed; 14 production-preview checks passed. Installed Edge, single worker, trace off, sequential. Final label-copy adjustment was build-checked after browser runs. Main JS 244.04kB raw/76.89kB gzip; scene 617.34/156.87, existing chunk warning remains. Computer Use and saved captures verified desktop/narrow overview, companions, tilt, reset and early/settled landing. Read-only reviewer Kepler found elevation occlusion, fixed and rechecked with no remaining findings. One Claude bridge attempt returned ECONNREFUSED, no lead approval or global config change. Physical-phone/GPU motion/FPS and boss feedback remain open. No merge or deployment. Read HANDOFF.md, Docs/agents/tasks/017-award-constellations.md and Docs/agents/exchanges/2026-11-18-award-constellations.md. Original graph/source snapshot remain frozen historical data, live code is authoritative. The earlier vocabulary-expanded query returned historical scene/agent orientation only. Useful continuation is the live verified result, not a graph rebuild.

## Outcome

- Signal: useful

## Source Nodes

- Instanced 3D map and picking
- Agent guide — Hamsterhub Hall of Fame Map