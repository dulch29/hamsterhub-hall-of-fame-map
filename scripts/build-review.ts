import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { parseLocalPreview } from '../src/data/localPreview';
import { createReviewScaleFixture } from '../src/mock/reviewScale';

const root = new URL('../', import.meta.url);
const output = new URL('.review-build/', root);
const files = ['data.json', 'face.png', 'portrait.png', 'project.png', 'presentation.pdf', 'competition-logo.png'];
const source = process.env.REVIEW_SOURCE_URL ? new URL(process.env.REVIEW_SOURCE_URL) : null;
if (source && (source.protocol !== 'https:' || source.username || source.password)) {
  throw new Error('Review source must use HTTPS without URL credentials.');
}
const media = await Promise.all(files.map(async (name) => {
  if (!source) return readFile(new URL(`.local-preview/${name}`, root));
  const response = await fetch(new URL(`/__local-preview/${name}`, source), { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Review source file unavailable: ${name}`);
  return Buffer.from(await response.arrayBuffer());
}));
try {
  const owner = parseLocalPreview(JSON.parse(media[0]!.toString('utf8')));
  if (owner.kids.length !== 1 || owner.groups.length !== 1) throw new Error();
  const fixture = createReviewScaleFixture(owner.kids[0]!, owner.groups[0]!.awards[0]!);
  const data = parseLocalPreview(fixture);
  media[0] = Buffer.from(JSON.stringify({
    kids: data.kids,
    awards: fixture.awards.map(({ id, title, style, logoUrl }) => ({ id, title, style, logoUrl })),
    associations: data.groups.flatMap((group) => group.awards.flatMap((award) =>
      award.recipients.map((kid) => ({ kidId: kid.id, awardId: award.id })))),
    previews: data.previews,
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
await writeFile(new URL('vercel.json', output), await readFile(new URL('vercel.json', root)));
console.log('Built the seven-profile public review in .review-build/. Deploy only this directory.');
