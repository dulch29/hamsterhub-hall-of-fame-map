import { parseArgs } from 'node:util';
import { writeFile } from 'node:fs/promises';
import { generateMockKids } from '../src/mock/generate';

try {
  const { values } = parseArgs({
    options: {
      count: { type: 'string', default: '3' },
      seed: { type: 'string', default: '42' },
      out: { type: 'string' },
    },
  });
  const kids = generateMockKids({ count: Number(values.count), seed: Number(values.seed) });
  const json = `${JSON.stringify(kids, null, 2)}\n`;

  if (values.out) {
    await writeFile(values.out, json, { encoding: 'utf8', flag: 'wx' });
    console.error(`Wrote ${kids.length} mock students to ${values.out}.`);
  } else {
    process.stdout.write(json);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
