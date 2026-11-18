# Task 003 — Review the fixture implementation slice

Date: 2026-11-17, Asia/Bangkok.

## Assignment

Review the proposed next implementation slice for the Hamsterhub map project.
This is a read-only architecture and scope review. Do not edit files, execute
commands, browse, delegate, or claim checks were run.

## Proposed change

Codex will add `src/mock/fixtures.ts` with two explicit, deterministic,
fictional `Kid` fixtures:

- an opted-out student with `showOnMap: false`;
- a student with a very long approved display name.

Codex will append focused assertions to `src/mock/generate.test.ts`. The
default `generateMockKids()` path, `src/types.ts`, `src/App.tsx`, `package.json`,
and shared data adapter remain unchanged. The fixtures will use `.invalid`
URLs, province codes, null avatars, and no real data. No newest-project
fallback behavior will be asserted.

## Review questions

1. Does this scope preserve the current contract and ownership boundaries?
2. What exact acceptance checks should run before the slice is considered done?
3. What implementation or integration risks remain?
4. Should the next slice be Pin Card/link safety or shared data preparation?

Return concise Markdown with confirmed facts, recommendations, blockers, and a
handoff to Codex. State that no files were changed and no commands were run.
