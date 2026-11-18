---
type: "query"
date: "2026-11-18T12:47:29.202484+00:00"
question: "This covers all awards, not just trophy"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Instanced 3D map and picking", "Agent guide — Hamsterhub Hall of Fame Map"]
---

# Q: This covers all awards, not just trophy

## Answer

Task023, 2026-11-18: codex/award-return-view from7072393, feature commit96fc843. Expanded query via graph vocabulary: Instanced 3D map picking camera selection. Historical graph identifies scene ownership; current source authoritative. All awards snapshot pre-selection camera position, target, zoom once. Escape returns immediately; background click uses existing240ms easing; reduced motion immediate. Repeated activation, switching and reopening mid-open/return preserve original view until return completion. OrbitControls start clears selection but keeps snapshot for stationary click; actual change discards on pan/orbit/wheel. Reset/data replacement clear. Sole writer Codex, no dependencies/data/model changes. Red regression confirmed cancellation left one visible marker instead of original three. Final82 unit tests, both typechecks/build pass. Lazy scene624.81kB raw159.44gzip, chunk warning. Targeted10 production browser cases pass covering all3 awards, actual background, interruptions, manual takeover, switching in coincident groups320/1440. Additional8-case run6 pass: explorer card, reduced motion, default preview,320/390/1440 layouts; filtering and old sample zoom/reset timed out45s without product assertion failure, not passes. Reviewer no concrete correctness/lifecycle issues. Live CUA reload/reconnect timed out. Claude review failed ECONNREFUSED, no lead approval. Physical phone/motion acceptance pending. Docs/agents/tasks/023-award-return-view.md and review record hold continuation. Separate code/docs commits and push authorized; no merge/deploy.

## Outcome

- Signal: useful

## Source Nodes

- Instanced 3D map and picking
- Agent guide — Hamsterhub Hall of Fame Map