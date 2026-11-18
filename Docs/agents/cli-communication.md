# Codex ↔ Claude Code CLI communication

Setup date: 2026-11-17. This bridge supports explicit review conversations and saved task/handoff files.

## Operation

`scripts/claude-review.mjs` sends a task packet plus selected project files to the installed Claude Code CLI through standard input, captures its JSON response, and saves the returned session ID. A later invocation can resume that exact session.

Claude receives no tools in this bridge. Safe mode disables workspace customizations, and the command supplies no MCP servers. Codex explicitly supplies project context instead of relying on Claude to discover Agent.md. No model override or permission-bypass flag is used.

This is a coordinator-driven exchange: Codex starts a turn and reads the response. It does not attach to a separately open Claude terminal, create a background chat loop, or let Claude independently message this Codex session.

## First turn

From the project directory:

```powershell
node scripts/claude-review.mjs --task Docs/agents/tasks/001-m1-review.md --out .agent-exchanges/m1-review
```

The default snapshot includes Agent.md, Project.md, M1/data plans, shared types, starter, generator, and package scripts. For a different review, specify every context file explicitly with repeatable `--context`:

```powershell
node scripts/claude-review.mjs --task Docs/agents/tasks/001-m1-review.md --context Project.md --context Docs/02-map/plan.md --out .agent-exchanges/custom-review
```

To inspect the prepared request without contacting Claude:

```powershell
node scripts/claude-review.mjs --task Docs/agents/tasks/001-m1-review.md --out .agent-exchanges/dry-run --dry-run
```

Output directories must be new and inside the workspace. Each turn records the exact context snapshot in `request.txt` and file list/options in `request.json`. A successful live turn adds `response.json`, `response.md`, and `session.json`. Failed calls retain available diagnostics and return a nonzero exit code. The bridge has a four-minute timeout.

## Follow-up in the same conversation

```powershell
$reviewSession = Get-Content .agent-exchanges/m1-review/session.json -Raw | ConvertFrom-Json
node scripts/claude-review.mjs --task Docs/agents/tasks/002-m1-follow-up.md --resume $reviewSession.sessionId --out .agent-exchanges/m1-follow-up
```

Use an explicit session ID; do not use `--continue` and accidentally resume another project's latest conversation. Resuming requires that Claude's local session history is still available.

`.agent-exchanges/` is ignored by Git because it contains duplicated source snapshots and CLI metadata. Keep durable conclusions in package plans or a reviewed exchange summary. Never add credentials or real student records to task/context files.

## Implementation workers

The bridge is intentionally a review runner. Code-writing workers require a separate explicit assignment and tool configuration, exact file ownership, and the branch/worktree workflow in [multi-agent.md](multi-agent.md). Do not change this runner to bypass permissions or permit overlapping writers.

## Verification record

Read [the exchange summary](exchanges/2026-11-17-m1-review.md) for the actual CLI result, follow-up, and remaining limitations. Authentication status alone does not prove a successful model response.
