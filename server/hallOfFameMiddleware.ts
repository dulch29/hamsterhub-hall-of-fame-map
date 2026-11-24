import type { IncomingMessage, ServerResponse } from 'node:http';
import { createHallOfFameHandler } from './hallOfFame.js';

export function hallOfFameMiddleware(env: Record<string, string | undefined>) {
  const handle = createHallOfFameHandler({ env });
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
      const result = await handle(new Request(`http://${host}/api/hall-of-fame`, {
        method: request.method,
        headers,
        signal: controller.signal,
      }));
      response.statusCode = result.status;
      result.headers.forEach((value, key) => response.setHeader(key, value));
      response.end(request.method === 'HEAD' ? undefined : await result.text());
    } catch {
      if (!response.destroyed) { response.statusCode = 500; response.end(); }
    } finally {
      response.removeListener('close', abort);
    }
  };
}
