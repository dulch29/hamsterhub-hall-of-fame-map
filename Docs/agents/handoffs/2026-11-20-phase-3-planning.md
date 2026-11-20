# Phase 3 planning — province discovery and two hamsters

Historical interview checkpoint. For a new session use the completed
[Phase 3 entry handoff](2026-11-20-phase-3.md) and
[milestone plan](../../01-discovery/phase-3-plan.md); Task 039 is now deployed.

Planning checkpoint, 2026-11-20. This records the ongoing user interview, not
authorization to implement the entire next phase. Task 039 is independently
authorized and prioritized: fix map failure and push through main so Vercel
updates the existing meeting link.

## Confirmed direction

- Remove panning; the user tentatively agrees to horizontal rotation around a
  fixed Thailand center, fixed tilt and bounded pinch/wheel zoom. Confirm the
  selection-camera behavior in the final contract.
- A medal represents its province. Keep discovery limited to award recipients;
  do not expand to students without awards. No production rank meaning is being
  introduced: "more glorious" concerns medal artwork, with stylish numerals as
  a visual reference.
- Two distinct characters: Guide welcomes/introduces the overview, handles Q&A
  and recommendations; Explainer is triggered by province selection, runs to
  the province and explains it while moving.
- Guide can minimize to a chat control while Explainer leads; user suggests a
  listening animation. That does not establish microphone input authorization
  or require voice chat in the first version. Text chat was accepted first.
- Both visible explanation and spoken narration are wanted; movement and speech
  can overlap. Do not force the user to wait before choosing a student.
- Latest sketches clarify three panels: province with student rows; selected
  student with competition list; selected competition/project with media and
  description, student replacing Explainer beside the panel. Nickname is primary,
  full name below; featured competition is prominent and others have priority.
- There is no existing chatbot/API. User can ask colleagues for character art.
- User agrees today's review should focus on stable map plus complete province/
  character/Profile journey, with live chatbot integration a separate checkpoint.
  Boss wants delivery today; do not promise unverified scope or readiness.

## Milestone outline, still a draft

1. Task 039: verified failure recovery and live review deployment.
2. Define fixed-center controls and province/medal selection semantics.
3. Implement the three-panel journey using current approved review data; support
   all recipients/competitions with keyboard, Back/Escape and mobile layouts.
4. Add the Guide/Explainer roles, interruptible travel, narration controls and
   student handoff; approve replacement art when supplied.
5. Refine grander award artwork without inventing award ranks.
6. Add actual conversational Guide service and bounded navigation actions after
   its provider, backend, credentials and costs are agreed. No fake live-AI claim.

## Pending frontier

Latest asynchronous answers:

- Detail arrows should probably change presentation slides while explaining the
  project; exact presentation handling is deferred for discussion after the fix.
- Competition priority is manually featured-first.
- Temporary character art and a user tap to enable narration are accepted while
  official assets are requested; narration can accompany movement.
- User explicitly says to finish bug fixing first and discuss the rest later.
  Do not continue the interview or implement Phase 3 in this bug-fix task.

After these answers settle, confirm the exact three-panel/back flow, production
versus demo narration source and approved province facts, camera selection/return
behavior, and today's acceptance scope. Keep the actual artwork/audio/AI external
dependencies explicit. New province narration must not invent student achievements.

The original random map-failure trigger is not yet identified. Actual context
loss and a compiled-production transient geometry failure exposed verified
recovery defects; Task 039 addresses those. Physical-phone/GPU acceptance remains
separate from software-rendered desktop browser evidence.
