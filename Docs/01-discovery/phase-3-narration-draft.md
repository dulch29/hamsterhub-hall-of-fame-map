# Phase 3 — Thai narration draft

Prepared 2026-11-20 for content review. **Draft wording, not approved narration.**
The user chose short drafted Thai scripts, device Thai speech when available,
and a visible text fallback. No narration is implemented by this document.

Use only the currently visible, opted-in award records. These scripts describe
navigation rather than inventing province facts, competition results, student
achievements or an award-to-project relationship. `{provinceName}` below is an
intentional runtime field from the existing province-name table, not free text
from an AI response. Scripts contain no supplied personal records.

| Moment | Role | Proposed Thai text |
|---|---|---|
| Welcome | Guide | ยินดีต้อนรับสู่ Hall of Fame ของ Hamsterhub เลือกเหรียญบนแผนที่ เพื่อทำความรู้จักผู้ได้รับรางวัลในแต่ละจังหวัดได้เลย |
| Map introduction | Guide | ลากเพื่อหมุนแผนที่ และซูมเข้าออกได้ เลือกเหรียญเพื่อเปิดรายชื่อ หรือใช้ปุ่มดูรายชื่อแทนแผนที่ |
| Province selection / travel | Explainer | ไปดูผู้ได้รับรางวัลในจังหวัด{provinceName}กัน เลือกคนที่สนใจเพื่อดูการแข่งขันและผลงานได้เลย |
| Student competition panel | Explainer | หน้านี้รวมการแข่งขันของคนที่คุณเลือก เลือกการแข่งขันเพื่อดูผลงานที่เชื่อมไว้ได้เลย |
| Project detail handoff | Student position; neutral UI text | ดูภาพนำเสนอด้วยปุ่มก่อนหน้าและถัดไป หรือเปิดไฟล์ PDF หากมี |
| No associated project | Neutral UI text | ยังไม่มีผลงานที่เชื่อมกับการแข่งขันนี้ |
| No slides, PDF available | Neutral UI text | ยังไม่มีภาพสไลด์ในหน้านี้ สามารถเปิดไฟล์ PDF ได้ |
| No presentation | Neutral UI text | ยังไม่มีสื่อนำเสนอสำหรับผลงานนี้ |

The student's visual handoff does not imply a recording of their voice, their
own authored words, or synthesized impersonation. The project instruction is
ordinary interface copy. Student-specific spoken project explanations need a
later reviewed script grounded in the explicitly associated project.

## Proposed speech behavior for the character milestone

- One explicit narration toggle enables speech. Welcome text is visible without
  audio permission; no speech begins automatically on page load.
- Select a Thai device voice when available. If none exists, or synthesis fails,
  keep text visible and browsing usable. Do not substitute a wrong-language voice
  or request a cloud service implicitly.
- One utterance at a time. New province/student selection cancels stale speech;
  Back, Close, Reset and mute cancel the current utterance. Browsing never waits
  for narration or character travel to finish.
- Pause and hidden tabs stop current speech and character motion. Showing the tab
  again does not replay speech automatically. Reduced motion settles character
  placement immediately; it does not prevent user-enabled speech.
- Missing voice support is a supported text fallback. Device voice availability
  and subjective Thai pronunciation need actual-device review.

These cancellation details are the proposed implementation contract for P3.3;
they are not evidence that character/narration implementation or content approval
has occurred. See the [Phase 3 plan](phase-3-plan.md).
