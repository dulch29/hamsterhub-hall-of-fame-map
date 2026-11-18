# Development handoff

Updated: 2026-11-17. Workspace: `D:\Projects\Hamsterhub\Map Project Showcase`.

## Read first

- `Project.md` is the source of truth for scope, privacy requirements, data contracts, ownership, and unresolved decisions.
- `README.md` contains installation, development, testing, and mock-export commands.
- This file records the implementation state at the end of M0 setup. Inspect the workspace for any later changes before continuing.

## Implemented

- Standalone React + Vite + TypeScript development scaffold with strict type checking.
- Three.js and its TypeScript types installed for M1; no scene code yet.
- `src/types.ts` implements Kid, Project, MapPin, and the 77 province codes.
- `src/mock/generate.ts` provides reproducible synthetic records with configurable count and seed.
- The default dataset contains exactly three opted-in students: Mock Mali (Bangkok), Mock Niran (Chiang Mai), and Mock Ploy (Phuket).
- All avatars are null; the third student has no projects or featured project. Profile/project URLs use `.invalid` domains.
- `scripts/generate-mock.ts` exports JSON to stdout or a new file, rejects invalid counts, and refuses to overwrite existing files.
- `src/App.tsx` renders a minimal starter with three student rows and filters on `showOnMap`. This is not the finished accessible list view.
- `index.html` contains a noindex/nofollow tag. This does not enforce authentication.
- `package-lock.json` records installed dependencies. `.gitignore` excludes dependencies, build output, environment files, and the default mock export.

The generator defaults to count 3 and seed 42. Keep three students in the default preview; larger counts are for explicit load tests. Exporting a JSON file does not change the app's dataset.

## Verified during setup

Checks passed on 2026-11-17 using Node.js 24.16.0 and npm 12.2.0:

- `npm run build`: TypeScript checking and production bundling passed.
- `npm test`: all four generator tests passed, covering defaults, reproducibility, 500 records, contract consistency, and invalid options.
- CLI smoke checks: default export contains three records, `--count 500` produces 500, invalid counts fail, JSON file export works, and existing files are protected.
- React server-rendering smoke check: exactly three student rows, the expected names/provinces, and the missing-project message were present.
- The built-in browser reached the local dev server and reported the expected page title. Browser interaction, mobile layout, WebGL, and performance testing have not been completed.

These checks establish scaffold behavior only. The full acceptance criteria in Project.md remain unchecked.

## Not implemented

- Thailand geometry, province anchors/jitter, camera controls, instanced pins, picking, clustering, or fan-out.
- Pin Card, production profile/project links, search/filter list view, keyboard flows, or WebGL failure handling.
- HamQuest/Hamsterhub branding. The current styling is a plain development starter.
- Backend, member sessions, protected data API, real student data, or guardian-consent collection.
- Featured-project selection settings or the unconfirmed most-recent-project fallback.
- Dedicated long-name and opted-out fixture tests; all three default records intentionally remain opted in.

The visual reference in Project.md has not been reviewed. No geometry dataset or license has been selected.

## Next work

1. Inspect the existing scaffold and confirm the next task against Project.md. M1, the static 3D map, is the next implementation milestone.
2. Obtain the Hamsterhub/HamQuest site URL before choosing final branding and integration details.
3. Select and document a province geometry source and license, then establish province anchors.
4. Build the Thailand scene and constrained camera controls, then place the three default students using province anchors plus deterministic jitter.
5. Continue through interaction, clustering, accessibility, and performance milestones. Real data requires server-enforced member authentication and consent filtering first.

The ownership table in Project.md still assigns scene/clustering to the lead and UI/mock work to Codex. No parallel agents have been started. No Git repository, commits, branches, or worktrees have been created in this directory; the branch/worktree policy remains to be established before multi-agent work.

## Resume locally

Dependencies are already installed in this workspace. On a clean checkout, run `npm ci` first.

```sh
npm run dev
```

The setup session used `http://127.0.0.1:5173/`. A new session may need to restart the server; use the address Vite prints.

Suggested starting prompt for the next session:

> Read Project.md, README.md, and HANDOFF.md, inspect the existing M0 scaffold, and continue with M1 using exactly three default mock students. Keep unresolved branding, geometry licensing, and production authentication requirements explicit.
