import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGuideHandler } from './guide';

const request = (value: unknown = { dataset: 'default', message: 'เขาวงกต', history: [] }, headers = {}) =>
  new Request('http://localhost/api/guide', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(value) });
const answer = (text = 'ลองดู Hamster Maze', targets = ['project:mock-2a-0001-project-1'], openTarget = '') => Response.json({
  status: 'completed', steps: [{ type: 'model_output', content: [{ type: 'text', text: JSON.stringify({ text, targets, openTarget }) }] }],
});

test('Guide uses server catalog, structured nonstored Gemini output and header-only credentials', async () => {
  let calls = 0;
  const handle = createGuideHandler({ env: { GEMINI_API_KEY: 'test-key' }, fetch: async (url, options) => {
    calls++;
    assert.equal(String(url), 'https://generativelanguage.googleapis.com/v1beta/interactions');
    assert.equal(new Headers(options?.headers).get('x-goog-api-key'), 'test-key');
    const body = JSON.parse(String(options?.body));
    assert.equal(body.store, false);
    assert.equal(body.generation_config.max_output_tokens, 1500);
    assert.equal(body.response_format.mime_type, 'application/json');
    assert.equal(body.response_format.schema.properties.openTarget.type, 'string');
    assert.equal(body.response_format.schema.properties.targets.items.type, 'string');
    assert.ok(body.system_instruction.includes('Hamster Maze'));
    assert.ok(body.system_instruction.includes('openTarget'));
    assert.ok(body.system_instruction.includes('ให้ฉันเปิดหน้านี้ให้เลยไหม?'));
    assert.ok(!String(options?.body).includes('test-key'));
    assert.ok(!body.input.includes('student:owner'));
    return answer('ลองดู', ['student:owner', 'province:TH-10', 'province:TH-10'], 'student:owner');
  } });
  const result = await handle(request({ dataset: 'default', message: 'hello', history: [], context: 'student:owner' }));
  assert.equal(result.status, 200);
  assert.equal(result.headers.get('Cache-Control'), 'no-store');
  const json = await result.json();
  assert.deepEqual(json.actions, [{ kind: 'province', id: 'TH-10', label: 'Bangkok' }]);
  assert.equal(json.open, null);
  assert.equal(calls, 1);

  const openHandle = createGuideHandler({ env: { GEMINI_API_KEY: 'test-key' }, fetch: async () =>
    answer('กำลังเปิดหน้า Hamster Maze ให้เลยครับ', [], 'project:mock-2a-0001-project') });
  const openResult = await openHandle(request({ dataset: 'default', message: 'เปิด Hamster Maze', history: [] }));
  assert.equal(openResult.status, 200);
  const openJson = await openResult.json();
  assert.deepEqual(openJson.open, { kind: 'project', id: 'mock-2a-0001-project', label: 'Hamster Maze' });
  assert.deepEqual(openJson.actions, [{ kind: 'project', id: 'mock-2a-0001-project', label: 'Hamster Maze' }]);
});

test('Guide rejects methods, origins, malformed/oversize input and missing key without provider calls', async () => {
  let calls = 0;
  const handle = createGuideHandler({ env: {}, fetch: async () => { calls++; return answer(); } });
  assert.equal((await handle(new Request('http://localhost/api/guide'))).status, 405);
  assert.equal((await handle(request(undefined, { Origin: 'https://other.test' }))).status, 403);
  assert.equal((await handle(request(undefined, { 'Sec-Fetch-Site': 'cross-site' }))).status, 403);
  assert.equal((await handle(new Request('http://localhost/api/guide', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }))).status, 400);
  assert.equal((await handle(request({ dataset: 'owner', message: 'x', history: [] }))).status, 400);
  assert.equal((await handle(request({ dataset: 'default', message: 'x'.repeat(60000), history: [] }))).status, 413);
  assert.equal((await handle(request())).status, 503);
  assert.equal(calls, 0);
});

test('Guide keeps errors generic and does not retry rate limits, blocked or malformed provider replies', async () => {
  for (const reply of [new Response('secret provider body', { status: 429 }),
    Response.json({ status: 'failed' }), answer('', []), Response.json({ status: 'completed', steps: [] }),
    answer('x'.repeat(3000), []), new Response('x'.repeat(40000))]) {
    let calls = 0;
    const handle = createGuideHandler({ env: { GEMINI_API_KEY: 'test-key' }, fetch: async () => { calls++; return reply; } });
    const result = await handle(request());
    assert.ok([429, 502].includes(result.status));
    assert.ok(!(await result.text()).includes('secret provider body'));
    assert.equal(calls, 1);
  }
});

test('Guide aborts slow requests and bounds provider concurrency and per-instance requests', async () => {
  const timeout = createGuideHandler({ env: { GEMINI_API_KEY: 'test-key' }, deadlineMs: 5,
    fetch: async (_url, options) => new Promise((_resolve, reject) => options?.signal?.addEventListener('abort', () => reject(new Error('aborted')))) });
  assert.equal((await timeout(request())).status, 504);
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  const handle = createGuideHandler({ env: { GEMINI_API_KEY: 'test-key' }, fetch: async () => { await held; return answer('ok', []); } });
  const pending = [handle(request()), handle(request())];
  await new Promise((resolve) => setTimeout(resolve, 15));
  assert.equal((await handle(request())).status, 429);
  release(); await Promise.all(pending);
  for (let i = 0; i < 8; i++) assert.equal((await handle(request())).status, 200);
  assert.equal((await handle(request())).status, 429);
});
