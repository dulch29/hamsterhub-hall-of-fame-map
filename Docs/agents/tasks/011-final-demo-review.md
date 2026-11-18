# Task 011: final local demo review

Continue session 48545807-0b52-412a-b2d1-083631e09f24.
User requested a finished local demo they can test.

Review attached final source for remaining P0/P1 runtime/accessibility defects.
Task 010 fixes: renderer and camera persist across filtering; keyed DOM marker
buttons preserve focus; removed-marker fallback; working skip link; opt-out test
searches Hidden; separate fresh dev/preview servers and browser typecheck.
At maximum zoom, all group sizes fan out; larger groups use pages of 24 with
viewport containment and focused paging. Full list remains available.

Codex is running 61 pure tests, application/browser typechecks, build, and a
15-test isolated Chromium suite on both dev and production preview. Do not
claim these completed unless evidence is attached. Browser tests include all
500 IDs across 21 fan-out pages, small-group collapse, repeated filtering,
modal focus/dismissal, geometry/WebGL failure and 320/390px bounds.
Software rendering only; physical-phone/performance acceptance is still open.
No authentication, real records or live profile/project links are claimed.

Return only concrete remaining blockers and a short handoff. You have no tools.
