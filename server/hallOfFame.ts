import { fetchSheetHallOfFame } from './sheets.js';

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

const error = (status: number, code: string) =>
  Response.json({ error: { code } }, { status, headers });

export function createHallOfFameHandler(options: {
  fetch?: typeof fetch;
  env?: Record<string, string | undefined>;
  timeoutMs?: number;
} = {}) {
  return async (request: Request): Promise<Response> => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response(null, { status: 405, headers: { ...headers, Allow: 'GET, HEAD' } });
    }
    if (request.headers.get('sec-fetch-site') === 'cross-site') {
      return error(403, 'ORIGIN');
    }
    try {
      const data = await fetchSheetHallOfFame(options);
      if (!data) return error(503, 'NOT_CONFIGURED');
      if (request.method === 'HEAD') {
        return new Response(null, { status: 200, headers });
      }
      return Response.json({ source: 'sheets', ...data }, { headers });
    } catch (failure) {
      const code = failure instanceof Error && failure.message === 'INVALID_SHEET_URL'
        ? 'NOT_CONFIGURED'
        : 'SHEET_UNAVAILABLE';
      return error(code === 'NOT_CONFIGURED' ? 503 : 502, code);
    }
  };
}

export const handleHallOfFame = createHallOfFameHandler();
