# Task 036 — seven-profile production review

User request, 2026-11-19. Base `78afdfd`, working branch
`codex/seven-profile-review`. Codex is sole writer for a six-person fictional
review fixture and original demo media, review build composition, bounded
per-student preview media selection, focused tests and coordinated documentation.
The user confirms fictional people. Preserve the approved owner record; add
three fictional people in Bangkok and one each in Chiang Mai, Khon Kaen and
Phuket. Review total: seven people across four provinces, four in Bangkok.

Use distinct names, original illustrated portraits and project images. Match
the owner's rendered portrait/project-image scale and full Thai description
length (within 15 percent). Each student gets their own media; the owner's
portrait/PDF must not be reused for fictional profiles. Clearly identify the
fictional additions and competition assignments as test content. This is a
review-scale test; production authentication/data integration remains pending.

Keep the regular three-person fictional demo unchanged. Compose the six-person
fixture only for the explicit public review build. Retain approved owner media
outside Git. Verify filtering/memberships and media isolation with meaningful
unit tests; run all units, both typechecks, normal and review builds. Browser
checks are sequential: all seven profiles, four Bangkok bubbles, switching,
complete descriptions/media, directory, layered Escape/focus, camera return,
pause/reduced motion and WebGL fallback at 320/390/1440. Record physical-phone
acceptance separately. Merge checked work into main and verify Vercel's same
public test link after deployment.

Verification: 107/107 unit tests, both typechecks, normal and hosted-source
review builds pass. Sequential final Edge checks pass all seven profiles at
320/390/1440 × 844, equal media scale, full text expansion/scroll, layered
Escape/focus/camera return, keyboard directory, reduced motion/pause, background/
reset, WebGL handler and malformed-document fallback; zero page/console errors.
Default demo remains three fictional people and excludes owner values/requests.
Final screenshots inspected; physical-phone/GPU/performance remains open.
Merged at main `ca13ddb` (feature `31566cd`), pushed and deployed READY as
`dpl_8TcugVKZmiv9rSVEoa6TRXTv854G`. Same live-site checks pass at all three
widths, including fixed expansion controls, with zero page/console errors.
Deployed headers pass. Evidence: %TEMP%/hamsterhub-review-036/.
