# Hamsterhub Hall of Fame — project overview and intended output

Prepared 2026-11-20 for Claude Code. Scope: this entire repository. The user
emphasized **ALL / EVERYTHING**: the handoff must cover the complete project,
not just the award artwork or visible landing screen.

## Purpose and experience

Create a polished, playful Hall of Fame where people explore student work across
Thailand's 77 provinces. The navy/mint/gold 3D map makes achievements discoverable;
portrait bubbles and clear project presentations make the students and their
work the focus. Keep manual browsing usable even when graphics, audio, speech,
network access or AI is unavailable.

The main journey is:

`Map → province award → portrait bubbles → student → competitions → linked project → image slides / optional PDF`.

View all branches from bubbles into the full province recipient list. The
accessible directory offers another entry. Guide assists navigation and answers
from fictional records through Gemini; Explainer explains the experience using
approved scripts and optional device Thai speech.

## Built baseline

- React + TypeScript + Vite + Three.js; Node 24; no application framework migration needed.
- Province selection, focus/return animation, adjustable two-axis orbit, bounded zoom, Reset and no panning.
- Glossy portrait/thought/logo/View all bubbles; pop/re-form/recall effects and sound with mute.
- Deduplicated province recipients, student competitions, explicit project associations, slide arrows and optional PDF.
- Guide/Explainer characters, opt-in Thai device narration with readable text fallback.
- Original direction B — Laurel enamel trophy and gold/silver/bronze medals.
- Vercel Gemini server function with local Vite support, validated text replies and click-only result navigation.
- Accessible directory, loading/error/empty states and actual WebGL loss/restoration handling.

Live review: https://hamsterhub-map-review.vercel.app.
Application merge baseline: `e3b9ed0`; release/graph checkpoint: `6228e9f` on main.
These identify historical evidence; inspect the actual checkout before editing.
The handoff itself is prepared on `codex/claude-polish-handoff`.

## Intended final polish output

A coherent, responsive, accessible and reliable version of the **whole existing
experience**, with deliberate composition, readable Thai/English content,
consistent materials and controls, satisfying motion/sound, and measured
performance. Existing features should feel like one product across every state.

Deliver working code in small reviewed commits, before/after captures, a complete
coverage ledger, relevant automated checks, device/performance evidence where
available, and an honest list of unresolved external dependencies. Complete the
full plan in the [polish handoff](2026-11-20-claude-polish.md); one attractive
screenshot is insufficient evidence of completion.

## Review data versus eventual production

Default demo: exactly three fictional students. Group fixture: eight. The explicit
public review has seven profiles: an authorized owner and six fictional people.
Keep those modes distinct. Do not copy private fixture inputs or owner media into
tracked files. Gemini receives only its server-owned fictional catalog.

The eventual production product needs the actual Hamsterhub host, server-enforced
membership, protected opted-in records and real Profile/project destinations.
Those contracts remain unresolved. Audit and document their readiness, but do
not invent authentication, consent, backend or links to declare polish finished.
Province-level positions only; opt-out must exclude records from map, list and
counts. Featured projects remain explicit manual associations or null.

## Evidence and limits

Task 050 records 135 unit tests, both TypeScript checks, normal/review builds,
seven-profile journeys at 320/390/1440px, live Gemini navigation, controlled
failure and real WebGL recovery checks. These are prior checks, not fresh results
for future polish. Physical-phone/GPU/FPS acceptance and subjective final polish
remain open. See [HANDOFF.md](../../../HANDOFF.md) and
[Task 050](../tasks/050-phase-3-review-release.md).

Actual host brand tokens and target-device measurement setup are not fully
confirmed. Preserve the accepted style and label provisional measurements.
