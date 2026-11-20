# Task 039 — recover from intermittent map failures

User priority, 2026-11-20. Base main `2b9cc90`; branch
`codex/map-failure-recovery`. Codex is the sole writer for bounded scene
context lifecycle, map loading/fallback/retry, focused browser tests and
coordinated docs. The Phase 3 interview continues separately; camera controls,
province discovery, mascots and medal design are not part of this fix.

The reported failure is random, with no device/trigger identified. Preserve
that uncertainty. Reproduce recovery defects with actual WEBGL_lose_context
and transient geometry failure; do not identify either as the original
hardware/network trigger without evidence. Record a bounded failure category
without student data so future occurrences are distinguishable.

Allow a temporarily lost context to restore in place, suspending rendering
while lost. Retain the accessible directory when recovery fails and provide
an explicit retry. Retry one transient geometry request, cancel stale work,
and keep retries bounded. Preserve the current scene/UI/art/data and all
discovery, focus, reduced-motion and pause behavior.

Validate actual context loss/restoration, recovery timeout and user retry,
transient/permanent data failure, render/init fallback and repeated browsing.
Run unit tests, both typechecks, production/review builds and sequential Edge
browser checks (one worker, tracing off). Integrate the checked fix through
main and verify the existing public review. Physical-phone/GPU acceptance
and the original random trigger remain open until observed.

## Findings and implementation

Actual `WEBGL_lose_context` reproduced permanent fallback: the old loss handler
unmounted the renderer immediately, preventing restoration. A compiled-production
503 geometry response also permanently removed the map; dev StrictMode's second
effect request masked that defect. Persistent failure had no retry button.
These are verified recovery defects, not proof of the original random trigger.

Keep the renderer/profile mounted during context loss, suspend rendering, and
resume on restoration. After eight seconds offer the directory and map retry.
Retry one geometry load and abort stale requests. Reload the page on a rejected
lazy scene import; other retries remount the map without stale dismissal state.
Report only bounded failure categories in the console/root attribute, no records.

## Verification

- Red checks reproduced actual loss, missing retry and production transient
  geometry failure before implementation.
- 109 unit tests, both typechecks, normal and hosted-source review builds pass.
- All seven final recovery browser checks pass, including resumed rendering,
  closing discovery during loss, failed-module retry and repeated cleanup.
  The close-while-lost regression exposed a stuck camera moving flag; camera
  changes now settle without rendering while the context is unavailable.
- Thirteen existing failure, peer-switching and recall browser checks pass.
- Compiled seven-profile review passes at 390/1440 for actual context recovery,
  retained profiles and direct switching, three map/list cycles each and geometry/
  context timeout retries. Zero page errors; zero console errors before deliberate
  request faults. Captures inspected.
- Merged through main at `0f2fd35` from `018b5b5`; checked and merged trees
  match. Vercel Git deployment `dpl_Cvjsivib1pTrVUMdsk5RsGwfJ7g3` is READY
  from main/0f2fd35 at https://hamsterhub-map-review.vercel.app. The same live
  checks pass at 390/1440 for actual context recovery, retained profiles/direct
  switching, repeated browsing and transient/permanent geometry/context timeout
  retries; zero page errors, zero console errors before deliberate request faults.
  Deployed capture inspected. Original random trigger and physical-device/GPU
  acceptance remain open.
  Evidence/scripts stay outside Git at `%TEMP%/hamsterhub-recovery-039/`.
