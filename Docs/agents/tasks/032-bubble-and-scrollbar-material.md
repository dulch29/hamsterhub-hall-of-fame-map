# Task 032 — shared bubble material and glass scrollbar

User correction, 2026-11-19. Branch `codex/phase-2`, base `57ac4b2`.
Codex is sole writer for discovery CSS and coordinated task/package/handoff docs.

Remove the competition bubble's pale solid background override so it inherits
the same transparent soap-film surface, rim, reflections and blur as recipient
bubbles. Preserve the complete contained logo and existing reveal/float/exit.
Restyle the Profile content scrollbar with a narrow rounded mint thumb, quiet
navy track and no white arrow buttons; keep native scrolling and Firefox support.
No scene/data/markup or motion changes. Supplied media stay local; ocean remains
on hold.

Validation: production build; sequential rendered checks at 320/390/1440px for
shared bubble material, scrollbar styling/scrolling, complete content and close
behavior. Inspect screenshots, record actual results and physical-phone limits.

Completed: `npm run build` passes. Sequential Edge inspection with
`node .agent-exchanges/032-bubble-scrollbar/inspect.mjs` passes at
320/390/1440 × 740: identical transparent bubble material, rounded mint scrollbar,
wheel and thumb-drag scrolling, and Escape focus restoration; zero page errors.
Final screenshots show the actual scrollbar with Playwright's default
`--hide-scrollbars` argument disabled. Evidence stays ignored in that folder.
Unit tests were not repeated for this CSS-only change. Physical-phone, Safari
and Firefox rendering remain unverified.
