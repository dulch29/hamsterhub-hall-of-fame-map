# Motion follow-up

Recheck task 013's findings in the final source. Codex applied:

- Dialog 300ms close fallback, guarded native close listener, cleanup and
  try/catch/finally around computed backdrop style. The native handler ignores
  queued close events when the dialog has already reopened (React StrictMode).
- Map-host focus fallback suppressed during travel. Pending focus cleared on
  direct camera interaction/filter changes; hidden tab, resize and preference
  changes finish the tween.
- WAAPI entrances only on explicit fan-out; progress clamps 0..1.
- Changing Pause/Resume label without aria-pressed, before canvas in tab order.
- Ambient animation limited to first 30 markers. WebGL draws only when dirty;
  paging only changes the DOM overlay.

No tests were run by Claude. Local Codex testing found a trace-recording slowdown
in the 21-page/500-row traversal. Without recording it traversed all 500 IDs and
exposed the StrictMode native-close race above, now fixed. Final dev/preview
runs are ongoing; no result is assumed. This file is a source-review request.

Report any remaining concrete correctness issues. Do not redesign the feature.
