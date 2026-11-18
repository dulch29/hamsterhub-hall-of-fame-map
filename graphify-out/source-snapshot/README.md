# Hamsterhub Hall of Fame Map

M0 development scaffold for the 3D Thailand map described in [Project.md](Project.md).

**Current status (2026-11-17):** the scaffold is ready with three fictional students. The 3D map, final visual design, and authentication are not implemented. See [HANDOFF.md](HANDOFF.md) for verified checks and the next development steps.

## Run locally

Use Node.js 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open the local address Vite prints (normally http://127.0.0.1:5173).

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

## Mock students

The starter uses exactly three fictional students in Bangkok, Chiang Mai and Phuket.
All have missing avatars; one has no projects to exercise the empty state.
Names explicitly say Mock, and all profile/project URLs use the `.invalid` domain.
No real student data or precise locations belong in this repository.

```sh
npm run mock
npm run mock -- --count 500 --seed 42 --out mock-output.json
```

Without `--out`, the generator prints JSON. Output files must not already exist.
The default count is 3 and seed is 42; identical options reproduce identical data.
Counts from 0 to 10000 are accepted. Extra students spread across province codes for load testing.
The app uses the default generator directly; exporting JSON does not change the app's dataset.
The `showOnMap: false` and long-name cases belong in separate test fixtures so the default preview retains three visible students.

## Structure

- `src/types.ts`: shared Kid, Project, MapPin and ProvinceCode contracts.
- `src/mock/`: seeded generator and its tests.
- `scripts/generate-mock.ts`: JSON export command.
- `src/App.tsx`: minimal development starter, to be replaced during map integration.
- Future `src/scene/`, `src/cluster/` and `src/ui/`: responsibilities defined in Project.md.

React, TypeScript and Vite provide the standalone development shell. Three.js is installed for the next map milestone.
Final branding, province geometry, the production backend and the site's mount point remain open in Project.md.

## Integration boundary

This scaffold serves synthetic fixtures only. Authentication and the protected data API are not implemented.
Do not connect real student data until the server enforces member sessions and consent filtering.
The noindex tag is present; it does not provide access control.
The most-recent-project fallback is still unconfirmed; the mock data always resolves an explicitly selected project or null.

## Continue development

Read [Agent.md](Agent.md) for skill selection, agent responsibilities, the multi-agent execution plan, and context handoff templates. [AGENTS.md](AGENTS.md) points tools to that guide.

Start with [Docs/README.md](Docs/README.md) for the work breakdown, dependencies, and a separate implementation plan for each package. [Project.md](Project.md) remains the requirements source of truth.

Workspace: `D:\Projects\Hamsterhub\Map Project Showcase`.
Read `Project.md` for requirements, `HANDOFF.md` for implementation status, then inspect the source before making changes.
Use `npm ci` when dependencies need installing from `package-lock.json`; they are already installed in this workspace at handoff.
Run `npm run dev` if a local server is not already available. The server from the setup session used port 5173; it may need restarting in a new session.
The directory has not been initialized as a Git repository. No commits, branches, or worktrees were created during setup.
