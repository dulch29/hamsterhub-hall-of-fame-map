# Tasks 020/021 — Award attention and landing rendering

Codex is the sole writer on `codex/award-hover-turn`, base `9055a24`,
feature commit `9bc32e9`.
The user requested no preview text boxes, smooth hover/tap turns, a 15-degree
resting lean, then reported lag during the falling-province entrance.

## Implementation and review

The preview omits custom award labels and native titles while preserving ARIA
names/descriptions and explorer labels. Each award set interpolates its current
quaternion toward the hovered/selected target over 280ms with cubic ease-out.
Interrupted turns start from their displayed pose. Ambient pause freezes the
bob/orbit clock while finite turns remain available; reduced motion settles
immediately. The existing renderer/context and lifecycle cancellation remain.

Read-only reviewer Aquinas identified two hover edge cases: Escape erased an
active hover, and removal/replacement of a grouped marker could leave stale
hover. Regression checks reproduced both (2 failures in a 3-case focused run).
The scene now tracks hovered marker identity, resolves its current lead during
each draw and removes missing marker state. Escape clears selection while
retaining hover. Tests also sample intermediate geometry clearance and count
RAF callbacks to check that paused turns stop scheduling frames. Final read-only
source recheck found no remaining actionable issues; the reviewer made no edits
and ran no tests or browsers.

The landing used 485 separate polygon meshes and outlines. Task 021 batches
each province into one mesh and one outline. An index groups all cap triangles
and wall triangles into two material draws; vertex attributes remain unchanged.
Line segments keep exterior rings separate. Independent province transforms,
sky origin, 2.2s timing and interruptions remain intact.

## Performance evidence

Ignored `.agent-exchanges/020-award-hover-review/measure-landing.mjs` instruments
actual WebGL draw calls and RAF timestamps in installed headless Edge
157.0.4341.60 at 1440x900, without parallel browser jobs.

| Diagnostic | Before | After |
|---|---:|---:|
| Peak draw calls per frame | 1464 | 240 |
| Peak triangles per frame | 500792 | 500792 |
| Recorded landing frames | 41 | 63 |
| Median RAF gap | 34.2ms | 27.8ms |
| p95 RAF gap | 284.7ms | 97ms |

These are single-run desktop diagnostics, including offscreen entrance frames
and startup work; they do not establish stable FPS, physical-phone or real-GPU
acceptance. Geometry batching directly removes about 84% of peak draw calls.
No boundary simplification, lower-resolution canvas or timing change was used.

## Verification

All 79 pure tests, application/browser typechecks and production build passed.
The three new batching tests cover island-count-independent material groups,
cap/wall assignment, complete index coverage, holes, attributes, bounds and
separate outline rings. The preview entrance test asserts actual render calls
stay below 300 while all provinces and awards settle.

The initial Task 020 production run passed all 18 preview cases before the two
hover refinements and geometry batching. After those changes, the production
preview run passed 17/18; only the paused-hover screenshot check failed.
The paused-hover capture initially included the pause button's keyboard focus
ring when Escape was pressed. Its screenshots now hide controls to isolate
the award comparison, preserving exact image equality and the RAF assertion.
The focused production rerun passed 6/6: corrected hover plus explorer card,
context loss, filter/renderer preservation, reduced motion and small fan-out.
All 18 preview behaviors and five targeted explorer/fan-out behaviors therefore
passed; no single final all-green 18-case run is claimed.
The earlier focused 3-case development run passed before review refinements.
All browser jobs use one worker and tracing off. Slow process teardown can hold
the test server port after the last test; inspect/collect its exit before the
next job. One attempted focused run stopped at an occupied port without tests.

Final browser command: `node node_modules/@playwright/test/cli.js test --config
.agent-exchanges/018-award-orbit-review/playwright.preview.config.ts`, with
`--trace off --workers 1`. Main run targets `tests/map-preview.spec.ts`; focused
rerun adds `tests/explorer.spec.ts tests/fanout.spec.ts` and `--grep "hover turns|default map renders|filtering preserves|context loss|small max-zoom|reduced motion removes"`.

Current build: main JS 244.04 kB raw / 76.89 kB gzip; lazy scene 619.89 kB raw /
157.76 kB gzip. Existing chunk-size warning remains. No dependency, student
contract, production award policy, real data, merge or deployment change.

Computer Use inspected the narrow overview and selected trophy/companion
fronts with no preview text box, then restored overview with motion playing.
The tab remains available; no temporary viewport override or emulation remains.
JPEG captures are in ignored `.agent-exchanges/020-award-hover-review/`.
Still frames do not certify landing motion feel. The historical Graphify graph
remains frozen; continuation results and reflections are saved separately.

Claude lead review previously timed out; no successful lead approval is claimed.
Physical-phone/GPU/FPS and boss/lead acceptance remain open.
