# Task 021 — Reduce province landing lag

User follow-up, 2026-11-18: the land stutters while falling. Continue on
`codex/award-hover-turn`, with Codex as sole implementation writer.

Measure the existing entrance and reduce repeated rendering work. Preserve
province-by-province world-Y falls, the hidden sky origin, 2.2s timing,
materials, mint highlights, outlines, responsive framing and interruption.
Keep hover/tap turns and the 15-degree lean from Task 020.

Scope: province scene geometry/batching, existing scene/style hooks where
measurement identifies a cost, focused geometry/browser tests and notes.
No dependency, production contract, authentication, deployment or merge changes.
Read-only reviewer may inspect source; browser work stays sequential.

Record before/after measurements with their device/browser limitations. A
software-rendered desktop run cannot establish phone or real-GPU frame rates.

Implemented: peak rendering calls fell from 1464 to 240 in the recorded
diagnostic, retaining the original triangles and independent province fall.
Three geometry tests are registered in `npm test`; browser verification includes
the full preview and five targeted explorer/fan-out cases. See the
[review record](../exchanges/2026-11-18-award-hover-landing.md).
