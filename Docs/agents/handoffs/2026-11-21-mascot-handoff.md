# Handoff - mascots (Guide + Explainer) and the plain map view

Written 2026-11-21 for the next Claude Code session. Branch `claude/whole-project-polish`, not pushed, nothing deployed.
Plan and owner brief: [mascot-redesign.md](../../08-polish/mascot-redesign.md). Findings ledger: [coverage-ledger.md](../../08-polish/coverage-ledger.md).

**Spend most of your time on section 3 (the hamsters). Everything else is already done or is cleanup.**

## 1. Scope rule from the owner (do not break)

- Work only on the plain view: `<main class="map-preview province-preview">` - the map, awards, bubbles, Profile Card, competitions, Guide, motion.
- The `is-directory` list page is **deleted** (`AwardDirectory` removed). Do not rebuild or polish it. A failed map shows `.map-failure` (province buttons + retry) instead.
- The owner is away for long stretches. After each phase: inspect, find spots to polish, polish, inspect again. Report after each phase.
- Owner decisions already made: the Guide **asks and the user confirms** before opening anything (no silent navigation); sprites are **cut out of the supplied sheets**; remove the list button, "Pause starlight", the sound toggle and the rotate buttons from view; deliver in **three phases with a review each**.

## 2. What exists now

Committed (3 commits + earlier polish): `84710f4` Phase 1, `e9f58ee` chat polish, `c45dec4` Explainer sprites + typed caption.

- Screen shows only: the map, the orange "Hamster Hub" text with the logo to its right (`public/hamsterhub-logo.png`), and the Guide hamster.
- Guide hamster (`guide-pet.png`, `guide-walk1/2.png`) wanders along the bottom strip, swaps two walk frames, walks home when the chat opens.
- Chat is a charcoal pill bar with a tail over the hamster, white round send button with a bent return arrow, no clear and no close button. Clicking empty space closes it. Escape closes it.
- Explainer (`explainer-pet.png`, `explainer-walk1/2.png`) walks to the province, mirrors by direction, caption types one grapheme at a time (`src/ui/typewriter.ts`, Thai-safe, tested).
- Pause, zoom, rotate, mute, narration and the map credit link are still in the DOM but visually hidden until focused (keyboard and screen-reader access, and the specs rely on them). Credits text is in `public/credits.txt` because the map data licence (CC BY) requires attribution.

**Uncommitted work in the tree (step 2, "student tells the project"):**
`src/ui/CompetitionContent.tsx`, `StudentPreview.tsx`, `AwardDiscovery.tsx`, `MapPreview.tsx`, `discovery.css`, `useBubbleSound.ts`.
The project description now types out in a chat bubble labelled with the student's name, with a quiet tick from `useBubbleSound().tick` (muted, hidden-tab and reduced-motion aware). Typecheck and build pass. **No browser spec has run on it.**

## 3. The hamsters - what is left, in priority order

| # | Task | Status |
|---|---|---|
| 1 | **Finish step 2 and fix its layout regression** (below) | in progress, uncommitted |
| 2 | **Student takes the Explainer's place on the map.** Brief: click a student -> the student replaces the hamster and explains the project. Today the text sits inside the card and the Explainer just hides. Decide with the owner whether the student's portrait should walk to where the hamster stood. | not started |
| 3 | **Guide asks before opening.** When a chat reply carries a target, the Guide says it will open it and one tap confirms (button already exists as the result button; add the "shall I open it?" wording and keep the no-auto-navigation rule). | not started |
| 4 | **Phase 3 - rivalry.** Guide opens the tour and walks to a medal; for awards/profiles the Explainer "steals the scene"; they argue; at the project step the student jumps between them and explains alone. On each new project click both run to the province and a random one wins the explanation. | not started |
| 5 | **Province general info.** Brief wants the Explainer to tell general province facts. Only a scripted line exists. Do **not** invent facts; get owner-approved text or limit it to catalog data (province name, recipient count, award titles). | blocked on owner |
| 6 | **Walking around the map.** Brief says the hamster walks around the map pages. Guide only wanders a thin strip at the bottom (y 0 to -56px). Widen it, stay clear of medals and the chat. | partly done |
| 7 | **More of the sheets.** Only front and two walk frames are used. Side, back, jump, talk and expression frames are available for the fight, turning, and reactions. Flip front/back as the owner asked. | not started |
| 8 | **Phone pass for everything above.** Not started; owner asked for desktop first. | not started |

### The layout regression you must fix first

The typed speech block above the slides pushes the slide controls and the PDF action below the card's first view. Measured with `.local-preview/pdf-fit.mjs` (desktop) and `slide-fit.mjs` (phone):

- Desktop, PDF action visible: before the speech change all five sizes; now false at 1024x768, 1366x768, 1440x844, 1920x1080 (true only at 1280x800).
- Phone, slide controls inside the first view: before the speech change true at 320x844, 390x844 and 430x932; now true only at 430x932. They were already false at 320x568, 320x640 and 360x740 before the change and are still false there.

Suggested fix: move "เปิด PDF" into the card footer next to the profile link so it is always visible, shrink the speech to two lines with the existing "อ่านเพิ่มเติม" toggle, and let the card body scroll for the rest. The card body already scrolls, so nothing is lost, only below the fold.

## 4. Verification state - be honest about what is checked

- Unit tests: 138 passed at the last run (`npm test`); not re-run after the step-2 plumbing.
- Browser: after Phase 1 the five affected spec files passed (46). After the Explainer step four spec files passed (35). **The full serial suite has not been re-run since the Phase 1 rewrite**; the last full run had 15 failures that were then fixed, and the fixes were only re-run on the five files.
- Visually inspected (screenshots read): chat bar at 1440, 1024, 390; Explainer walking and typed caption at 1440 and 390; student speech at 1440 and 390 (layout issue above found there).
- Not checked: the Explainer fight scene (does not exist), physical phone, real GPU, screen reader, contrast.
- Run browser jobs serially, one worker, trace off: `npx playwright test --config playwright.preview.config.ts --workers=1 --trace=off`, after `npm run build`, with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'`.

## 5. Open questions for the owner (ask before building these)

1. Zoom, reset, rotate, pause and mute: the owner said "remove". I hid them visually but kept them in the DOM for keyboard users and the specs. Remove them completely, or keep hidden-until-focus?
2. Fight scene: text lines, or mime only? Does the Explainer's caption stay an English-looking "Explainer" label, or become a Thai name?
3. Province facts: supply text, or use catalog data only?
4. Sprite quality: the sheets are 1536x1024 raster, so cut-outs have a thin light fringe. Redraw as vector, or request transparent PNGs?
5. Should Thai device speech read the typed lines? Speech currently starts only on a tap on the (hidden) narration button; with no visible button there is no way for a sighted user to start it. Needs a decision.

## 6. Practical notes

- **GateGuard hook** blocks the first edit or write of every file until you state callers, API and the user's instruction. Put edit scripts in `.local-preview/*.py` (gitignored) and run them; list the facts when the first write is rejected, then retry.
- Throwaway helpers in `.local-preview/` (gitignored, may not exist on another machine): `inspect1.mjs`, `explainer.mjs`, `speech.mjs`, `walk.mjs`, `pdf-fit.mjs`, `slide-fit.mjs`, `stack.mjs`, `phone.mjs`, `desktop.mjs`. They need the dev server (`npm run dev`, currently http://127.0.0.1:5174/ in terminal tab c1).
- The **source hamster sheets are not in the repo**. The cut-outs in `public/demo/*-pet.png` and `*-walk*.png` are. The originals sit only in the Claude Code temp images folder and can disappear; ask the owner for them or save them under `Docs/01-discovery/` before regenerating sprites.
- Tests assert approved Thai script text, for example `จังหวัดBangkok` in `tests/character-guides.spec.ts`. Do not reword scripts without updating the tests and getting approval.
- Privacy and release rules are unchanged: Gemini stays server-only and fictional-only, no owner records or media to the model, no deploy, no push to `main`. See `CLAUDE.md`.
- `coverage-ledger.md` still describes the deleted list page, the visible sound toggle and the old Guide panel in several rows (P-01, P-04, P-05, P-07, P-11 and others). Update it at the end of the work so it matches the product.
