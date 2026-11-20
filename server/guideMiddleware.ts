import type { IncomingMessage, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import { createGuideHandler } from './guide';

export function guideMiddleware(env: Record<string, string | undefined>) {
  const handle = createGuideHandler({ env });
  return async (request: IncomingMessage, response: ServerResponse) => {
    const controller = new AbortController();
    const abort = () => { if (!response.writableEnded) controller.abort(); };
    response.on('close', abort);
    try {
      const host = request.headers.host ?? '127.0.0.1';
      const headers = new Headers();
      for (const [key, value] of Object.entries(request.headers)) {
        if (Array.isArray(value)) value.forEach((part) => headers.append(key, part));
        else if (value !== undefined) headers.set(key, value);
      }
      const init: RequestInit & { duplex: 'half' } = { method: request.method, headers,
        signal: controller.signal, duplex: 'half' };
      if (!['GET', 'HEAD'].includes(request.method ?? 'GET')) init.body = Readable.toWeb(request) as ReadableStream<Uint8Array>;
      const result = await handle(new Request(`http://${host}/api/guide`, init));
      response.statusCode = result.status;
      result.headers.forEach((value, key) => response.setHeader(key, value));
      response.end(await result.text());
    } catch { if (!response.destroyed) { response.statusCode = 400; response.end(); } }
    finally { response.removeListener('close', abort); }
  };
}
