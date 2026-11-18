---
type: "query"
date: "2026-11-18T04:50:37.861295+00:00"
question: "One combined design"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Instanced 3D map and picking", "Agent guide — Hamsterhub Hall of Fame Map"]
---

# Q: One combined design

## Answer

Task 016 continuation, verified 2026-11-18. The user approved One combined design: navy/enamel map plus sculpted 3D sample awards and click-to-award zoom. Feature commit 1c09675 on codex/sculpted-award-map, based on 5d81367, private remote dulch29/hamsterhub-hall-of-fame-map. Exactly three fictional students remain: mock-2a-0001 gold trophy, mock-2a-0002 silver medal, mock-2a-0003 bronze medal. These are sample artwork, not earned ranks. No Kid contract, production award schema, dependencies or downloaded models changed. Default / stays map-only; integrated cards/list/clustering at ?view=explorer. New local shared instanced geometry in src/scene/awards.ts; framing and collision placement in awardView.ts; integration in ThailandMap.tsx. Camera movement reuses cancelable 240ms travel, immediate for keyboard/reduced motion. Repeated activation is stable; reset returns fitted overview. Selected member remains outside grouping; other groups reserve targets to avoid overlap. Camera matrix refresh and Escape listener scope fixed after independent review. Final reviewer found no further substantive issues within three-sample scope. Final 66 unit tests, both typechecks, build and 11 production-preview tests passed. All 30 development browser tests passed before final preview-only collision refinement; its pure regression and production checks passed afterward. Edge single worker, tracing off, all browser runs sequential. Desktop/320px screenshots and narrow overview/trophy/silver framing visually inspected; 390px bounds passed. Main JS 243.97kB raw/76.85kB gzip, scene612.80/155.30; existing chunk warning remains. Claude bridge returned ECONNREFUSED, no lead approval. No merge or deployment. Physical-phone/FPS and boss feedback remain open, as do production auth/consent/API/live routes. Read HANDOFF.md and Docs/agents/exchanges/2026-11-18-sculpted-awards.md for current evidence. The original graph and source snapshot are frozen historical data; this is a verified continuation note, not a graph rebuild. Expanded orientation terms: Instanced 3D map and picking, Agent guide, province privacy.

## Outcome

- Signal: useful

## Source Nodes

- Instanced 3D map and picking
- Agent guide — Hamsterhub Hall of Fame Map