import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { parseLocalPreview } from '../src/data/localPreview';

const root = new URL('../', import.meta.url);
const output = new URL('.review-build/', root);
const files = ['data.json', 'face.png', 'portrait.png', 'project.png', 'presentation.pdf', 'competition-logo.png'];
const media = await Promise.all(files.map((name) => readFile(new URL(`.local-preview/${name}`, root))));
try {
  const data = parseLocalPreview(JSON.parse(media[0]!.toString('utf8')));
  if (data.kids.length !== 1 || data.groups.length !== 1) throw new Error();
  media[0] = Buffer.from(JSON.stringify({
    kids: data.kids,
    awards: data.groups.flatMap((group) => group.awards.map(({ id, title, style, logoUrl }) =>
      ({ id, title, style, logoUrl }))),
    associations: data.groups.flatMap((group) => group.awards.flatMap((award) =>
      award.recipients.map((kid) => ({ kidId: kid.id, awardId: award.id })))),
  }));
} catch {
  throw new Error('Review build requires one valid, opted-in owner record and its award group.');
}

await build({
  root: fileURLToPath(root),
  define: { 'import.meta.env.VITE_PUBLIC_REVIEW': JSON.stringify('true') },
  build: { outDir: fileURLToPath(output), emptyOutDir: true },
});
const assets = new URL('__local-preview/', output);
await mkdir(assets, { recursive: true });
await Promise.all(files.map((name, index) => writeFile(new URL(name, assets), media[index]!)));
await writeFile(new URL('vercel.json', output), `${JSON.stringify({
  version: 2,
  framework: null,
  headers: [
    { source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    { source: '/__local-preview/(.*)', headers: [{ key: 'Cache-Control', value: 'no-store' },
      { key: 'X-Content-Type-Options', value: 'nosniff' }] },
  ],
}, null, 2)}\n`);
console.log('Built the public owner-record review in .review-build/. Deploy only this directory.');
