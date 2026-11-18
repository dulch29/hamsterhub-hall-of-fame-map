# 00 — Scaffold and synthetic fixtures

Milestone: M0. Owner: Codex; shared type changes belong to the lead.

## Current state

React, Vite, TypeScript, Three.js dependencies, shared types, the seeded generator, and JSON export command exist. The starter displays three opted-in fictional students in Bangkok, Chiang Mai, and Phuket. All avatars are null; one student has no projects. HANDOFF.md records the setup verification; those results are historical, not new checks from this documentation update.

## Scope

- Maintain reproducible synthetic data with count 3 and seed 42 as defaults.
- Keep larger datasets explicitly requested with `--count`.
- Add separate opted-out and long-name fixtures without changing the default preview.
- Preserve fake names, `.invalid` URLs, province-only records, and safe export behavior.

Existing files: `src/types.ts`, `src/mock/generate.ts`, `src/mock/generate.test.ts`, `scripts/generate-mock.ts`, and `package.json`.

## Completion criteria

- [x] Development scaffold and shared types exist.
- [x] Default generator produces the agreed three students.
- [x] Seed/count options and non-overwriting JSON export exist.
- [x] Separate opted-out and long-name fixtures are available to later packages.
- [x] Fixture tests verify their intended edge cases without changing defaults.

Implemented on 2026-11-17: `createOptedOutKid()` and `createLongNameKid()` in
`src/mock/fixtures.ts` return fresh synthetic records. The visible long-name
fixture has a 244-character ASCII name and one consistent featured project.
Neither fixture is imported by the app, generator, or exporter.

Verification: all six tests, type checking, and production build passed.
Raw exports for 3 and 500 students at seed 42 are byte-identical to the
captured pre-change baselines. These tests verify fixture shape and isolation;
they do not establish production consent filtering.

Production authentication, the map, and the finished accessible list belong to later packages.

Continue with [the implementation plan](plan.md).
