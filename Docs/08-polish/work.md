# 08 — Visual polish and performance

Milestone: M5. Owner: lead; Codex owns assigned UI changes.

## Scope

Apply confirmed HamQuest/Hamsterhub tokens and refine map, card, list, loading, error, and empty states across desktop and mobile. Measure realistic synthetic load cases, including dense Bangkok groups.

Task 024 adds the user's reference-led floating portrait bubbles and reversible
bubble-to-project-card transition on desktop and phones. Keep the accepted
navy/mint/gold scene and all pause/reduced-motion/camera behavior. This replaces
the first Phase 2 side preview/mobile sheet proposal; see the task packet.

Provisional targets from Project.md:

- 500+ pins without noticeable lag.
- Approximately 60 fps on desktop and 30+ fps on a mid-range phone.
- Initial load under approximately three seconds on the agreed connection, excluding thumbnails.
- Project thumbnails load only when a card opens.

These targets require an agreed measurement setup and may be adjusted based on recorded results.

## Dependencies

Package 01 supplies final visual tokens and target-device decisions. Packages 02, 04, 05, and 06 provide the core interactions.

## Completion criteria

- [ ] Visual treatment matches the confirmed host style.
- [ ] Desktop and phone layouts keep controls, content, and touch targets usable.
- [ ] Performance evidence includes device/browser, dataset, connection, and scenario.
- [ ] Confirmed targets are met or deviations are explicitly resolved in Project.md.
- [ ] Visual/performance changes preserve keyboard access and fallback behavior.

Continue with [the implementation plan](plan.md).
