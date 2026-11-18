# Plan — Scaffold and synthetic fixtures

Status: scaffold and fixture follow-up complete (2026-11-17).

## Steps

1. Read the existing generator and its four tests before changing fixtures.
2. Add a small fixture module under `src/mock/` with an opted-out student and a very long approved display name. Keep each fixture synthetic and typed as `Kid`.
3. Reuse valid generated project/province data where appropriate; keep `generateMockKids()` at exactly three visible students.
4. Add targeted assertions for the new fixture cases. Actual map/list exclusion is verified by packages 03 and 06.
5. When adding tests outside the current generator test file, update `npm test` to discover them; it currently runs only `src/mock/generate.test.ts`.
6. Update HANDOFF.md after the code follow-up is complete.

## Validation

- Run `npm test`, `npm run typecheck`, and `npm run build` after implementation.
- Check default and 500-student exports with `npm run mock` and `npm run mock -- --count 500 --seed 42`.
- Verify the default preview still has three students and the new fixtures are used only in explicit tests.

## Handoff

Packages 03, 04, 05, and 06 can import `createOptedOutKid` and
`createLongNameKid` from `src/mock/fixtures.ts`. Both factories return fresh
nested data. All six generator/fixture tests, type checking, and build passed;
3- and 500-student exports were byte-identical before and after implementation.
Consumer filtering and long-name rendering checks remain in their packages.
