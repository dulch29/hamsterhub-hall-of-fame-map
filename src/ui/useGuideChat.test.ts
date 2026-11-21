import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readBoundedReply } from './useGuideChat';

test('readBoundedReply decodes chunked UTF-8 streams within the byte limit', async () => {
  const payload = JSON.stringify({ text: 'สวัสดี Hamsterhub', actions: [] });
  const encoded = new TextEncoder().encode(payload);
  const split = Math.floor(encoded.length / 2);
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoded.slice(0, split));
      controller.enqueue(encoded.slice(split));
      controller.close();
    },
  });
  const text = await readBoundedReply(new Response(stream));
  assert.equal(text, payload);
});

test('readBoundedReply cancels stream and throws INVALID_REPLY when byte limit is exceeded', async () => {
  let cancelled = false;
  let reads = 0;
  const chunk = new Uint8Array(16 * 1024).fill(0x61);
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      reads++;
      controller.enqueue(chunk);
    },
    cancel() {
      cancelled = true;
    },
  });
  await assert.rejects(() => readBoundedReply(new Response(stream)), /INVALID_REPLY/);
  assert.equal(cancelled, true);
  assert.equal(reads, 3);
});

test('readBoundedReply enforces UTF-8 byte limit on null-body Response fallback', async () => {
  const thai = 'ก'.repeat(11_000); // 11,000 UTF-16 chars, 33,000 UTF-8 bytes > 32 * 1024
  const stub = { body: null, text: async () => thai } as unknown as Response;
  await assert.rejects(() => readBoundedReply(stub), /INVALID_REPLY/);

  const ok = { body: null, text: async () => 'ok' } as unknown as Response;
  assert.equal(await readBoundedReply(ok), 'ok');
});
