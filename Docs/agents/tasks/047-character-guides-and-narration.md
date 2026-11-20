# Task 047 — Guide, Explainer and narration

2026-11-20. User authorizes automatic continuation to P3.3 after Task 046.
Sole writer Codex on `codex/phase-3`, following Task 046; no deployment assigned.
The user approves the saved short Thai narration scripts for this demo.

Implement the agreed two distinct roles using original temporary hamster art.
Guide welcomes on entry, minimizes to an available help control, answers bounded
navigation questions and opens only visible existing province/student choices.
This is local scripted help; live conversational AI remains P3.5. No microphone
or listening/recording claim. Explainer travels toward the selected province,
remains beside province/competition panels and yields to the student's existing
identity at presentation detail. Phones use a compact character/header and one
current sheet. Reverse/switch/Close/Reset remain interruptible.

Speech starts only after an explicit tap. Use Thai device speech when available;
no wrong-language or network voice substitution. Text stays visible on no voice,
unsupported API or error. One utterance at a time. New selection cancels stale
speech; Back, Close, Reset, mute, pause and hidden tabs stop it. Showing the tab
again must not replay it. Reduced motion settles placement immediately; finite
DOM transforms and CSS ambient motion share existing pause/visibility behavior.
Narration may begin during travel and never gates browsing. Add Skip/stop control.

Write set: new `src/ui/{CharacterGuides,useNarration,guideContent,guides.css}*`,
`public/demo/` original character artwork, bounded `MapPreview`, AwardDiscovery,
StudentPreview/profile layout integration if needed, focused units/browser checks,
test registration and coordinated docs/Graphify outputs. Preserve production
contracts, default three fictional students, explicit competition associations,
private owner media, WebGL recovery and existing bubble/camera behavior.

Verify scripted actions use visible IDs, narration selection/cancellation/error
fallback with controlled browser speech, no automatic initial speech, character
handoff/reverse, switching during travel, mute/skip/pause/hidden/reduced motion,
directory/recovery and pointer/keyboard layouts at 320/390/1440. Run units, both
typechecks, normal/review builds and serial installed Edge jobs, one worker and
tracing off. Actual device Thai voices/pronunciation and physical-phone/GPU
acceptance remain separate. Update handoff and targeted Graphify after checks.

## Implementation checkpoint

Implemented original SVG characters, bounded visible-record Guide choices,
interruptible Explainer travel and student handoff, and opt-in local Thai speech
with visible fallback. Source review fixes preserve in-flight transforms and
return current-person/current-province Guide choices to the intended level.
Phone captions clear student identity. No microphone, external AI or deployment.

127 units, both typechecks and normal/review builds pass. All nine character
browser checks pass in compiled installed Edge, one worker/tracing off, including
320/390/1440 staging, speech error/unavailable fallback, pause/hidden/skip/mute,
travel interruption and actual graphics restoration. Fifty checks
passed in the preceding broad run; its travel failure was corrected
and rerun. Screenshots inspected at desktop and 320px. Device Thai voices,
physical phones/GPU/FPS and subjective acceptance remain unverified.
