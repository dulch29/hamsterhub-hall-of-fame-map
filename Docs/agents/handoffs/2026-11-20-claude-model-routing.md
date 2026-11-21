# Claude Code model routing — whole-project polish

Prepared 2026-11-20. Local CLI verified as Claude Code 2.1.318. Account-specific
model availability was not queried. Use the installed CLI's `/model` picker to
confirm availability. Family aliases below are recommendations, not verified
version IDs, pricing, benchmark results or automatic configuration.

## Routing table

| Task | Model family | Boundary / expected result |
|---|---|---|
| Complete project audit, prioritization and final product judgment | Opus | Read references and rendered screens; preserve accepted decisions; return evidence and an ordered ledger |
| Routine React/TypeScript/UI implementation | Sonnet — default | One bounded slice with caller checks, relevant tests and inspected screenshots |
| CSS/type/spacing/material consistency | Sonnet | Apply approved direction; use Opus when visual direction or cross-surface tradeoffs are uncertain |
| Complex Three.js camera/picking/geometry/rendering defect | Opus | Diagnose from reproduction and scene invariants before editing shared code |
| Motion/audio sequencing and interruption defects | Sonnet, escalate to Opus | Preserve lifecycle, reduced motion, pause and camera return; escalate state races or ambiguous root causes |
| Accessibility, mobile and keyboard implementation | Sonnet | Verify actual controls, focus and content at affected sizes/preferences |
| Dense-scene performance or resource leak investigation | Opus | Measurements and root cause first; Sonnet may implement a settled local fix |
| Gemini trust boundary, server/API architecture, privacy review | Opus | Read-only review or explicit bounded changes; preserve fictional-only catalog and validated actions |
| Chat layout, ordinary errors and narration UI | Sonnet | Controlled responses; preserve cancellation/manual fallback; no paid load testing |
| Unit/browser regression test authoring and triage | Sonnet | Assert behavior rather than implementation; Opus for repeated unexplained failures |
| Small file inventory, link checking, formatting, concise docs edits | Haiku | Exact paths and deterministic acceptance; coordinator verifies output |
| Mechanical repeated edits with an already approved pattern | Haiku | Narrow write set, no design/security decisions; review the diff |
| Cross-cutting refactor or conflicting requirements | Opus | Explain necessity and smallest complete fix; no speculative rewrite |
| Final independent regression/code/privacy review | Opus | Reviewer does not edit concurrently; checks source plus evidence and unresolved limits |
| Release checklist and agreed configuration changes | Sonnet; Opus for unresolved risk | Requires a current release assignment; model choice does not grant deployment permission |

## Practical defaults

Start Claude Code with the Sonnet family (`claude --model sonnet`, if that alias
is offered by the installed version/account). In a session use `/model` and
select Sonnet, Opus or Haiku as needed. Do not invent versioned model strings or
silently substitute a costly model. If a family is unavailable, keep Sonnet for
routine work and explicitly report the missing review capability.

Use Opus for the initial full audit and final review, Sonnet for most build work,
and Haiku only for bounded chores. This avoids using the most expensive family
for every file while protecting judgment-heavy work. Exact prices and usage
limits depend on the account; no cost estimate is assumed here.

Escalate Sonnet work after two attempts fail to explain or resolve the same
issue, or immediately when contracts/privacy/shared scene architecture are
uncertain. Include the minimal reproduction, attempted fixes, relevant diff,
test output and acceptance criteria. Do not keep retrying blindly. Once the
decision is settled, routine implementation can return to Sonnet.

## Context and workers

Give each task: goal, relevant reference, exact allowed files, preserved
invariants, reproduction, acceptance criteria and commands. Read only the
relevant package documents beyond the common entry point. Put durable decisions
in the repository rather than relying on one long chat.

Model routing is a human/lead operating policy, not an installed automatic
router. A model switch does not create a separate worker or transfer ownership.
If using workers, follow [multi-agent.md](../multi-agent.md): one writer per file,
explicit handoff, serialized shared files, read-only independent review. Never
run concurrent browser jobs on this host. CLI aliases do not guarantee that
every worker inherits the desired model; verify the worker's configuration.

The existing `scripts/claude-review.mjs` bridge is a **tool-less review runner**,
not the implementation session. Keep it that way; run actual implementation in
the user's normal Claude Code session without bypassing permissions.

**Gemini is the app's runtime provider.** Choosing Claude coding models does not
replace Gemini, change its model, grant access to owner records or authorize
additional provider spending.
