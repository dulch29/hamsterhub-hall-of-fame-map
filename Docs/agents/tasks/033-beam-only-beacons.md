# Task 033 — beam-only award beacons

User correction, 2026-11-19. Branch `codex/phase-2`, base `2278d55`.
Codex is sole writer for `src/scene/awardBeacon.ts`, its existing test,
`src/ui/discovery.css` and coordinated project/package/handoff documentation.

Remove the beacon's ground pool and expanding circles, including their DOM,
CSS animation and unused ground-plane projection. Keep only the gold beam
between each award and the land, following existing camera/landing updates.
Preserve selection, return, pause and cleanup behavior. No new render loop.

Verify existing tests, typechecks and production build; inspect the rendered
beam under zoom/reset and confirm no ground-circle DOM/animations remain.
Keep browser checks sequential. Do not claim measured speed gains without
performance evidence. Physical-phone acceptance remains separate.

Completed: `npm test` passes **104/104**; `npm run typecheck:browser` and
`npm run build` (including application typecheck) pass. Existing scene-chunk
size warning remains. Sequential Edge inspection with
`node .agent-exchanges/033-beam-only/inspect.mjs` passes at 320/390/1440 × 844:
three beams, zero ground-circle elements/animations, zoom/reset alignment,
Profile opening/layered Escape and saved camera return; zero page errors.
Screenshots/scripts/report stay ignored in that folder. The inspection compares
beam positions independently of DOM order after marker regrouping. No physical
phone or FPS measurement was performed.
