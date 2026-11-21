import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { guideMiddleware } from './server/guideMiddleware.js';

const previewCsp =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https:; media-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; worker-src 'none'";

const localFiles: Record<string, string> = {
  'data.json': 'application/json',
  'portrait.png': 'image/png',
  'face.png': 'image/png',
  'project.png': 'image/png',
  'presentation.pdf': 'application/pdf',
  'competition-logo.png': 'image/png',
};

export default defineConfig(({ mode }) => {
  const loaded = loadEnv(mode, process.cwd(), '');
  const guide = guideMiddleware({ GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? loaded.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL ?? loaded.GEMINI_MODEL });
  return {
  plugins: [react(), {
    name: 'local-student-preview',
    apply: 'serve',
    configurePreviewServer(server) {
      server.middlewares.use((_, response, next) => {
        response.setHeader('Content-Security-Policy', previewCsp);
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        response.setHeader('X-Frame-Options', 'DENY');
        response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        next();
      });
      server.middlewares.use('/api/guide', (request, response) => { void guide(request, response); });
    },
    configureServer(server) {
      server.middlewares.use('/api/guide', (request, response) => { void guide(request, response); });
      server.middlewares.use((request, response, next) => {
        let path: string;
        try { path = decodeURIComponent(request.url?.split('?')[0] ?? ''); }
        catch { response.statusCode = 400; response.end(); return; }
        if (path.split(/[\\/]/).some((part) => ['.local-preview', '.agent-exchanges'].includes(part.toLowerCase()))) {
          response.statusCode = 403;
          response.end();
          return;
        }
        next();
      });
      server.middlewares.use('/__local-preview', (request, response) => {
        const filename = request.url?.split('?')[0]?.slice(1) ?? '';
        response.setHeader('Cache-Control', 'no-store');
        response.setHeader('X-Content-Type-Options', 'nosniff');
        if (!Object.hasOwn(localFiles, filename) || !['GET', 'HEAD'].includes(request.method ?? '')) {
          response.statusCode = 404;
          response.end();
          return;
        }
        const path = fileURLToPath(new URL(`./.local-preview/${filename}`, import.meta.url));
        void readFile(path).then((bytes) => {
          response.setHeader('Content-Type', localFiles[filename]!);
          response.end(request.method === 'HEAD' ? undefined : bytes);
        }, () => {
          response.statusCode = 404;
          response.end();
        });
      });
    },
  }],
  };
});
