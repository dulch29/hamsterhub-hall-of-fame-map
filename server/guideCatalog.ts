import { createDiscoveryDemo } from '../src/mock/discovery.js';
import { provinceNames } from '../src/geo/provinces.js';
import { studentCompetitions } from '../src/data/studentCompetitions.js';
import { parseLocalPreview } from '../src/data/localPreview.js';
import reviewDataRaw from '../public/__local-preview/data.json' with { type: 'json' };
import type { GuideDataset, GuideRecord } from '../src/guide/contract.js';
import type { Kid } from '../src/types.js';
import type { AwardGroup } from '../src/data/demoAwards.js';
import { fetchSheetHallOfFame } from './sheets.js';

export function buildGuideCatalog(
  kids: readonly Kid[],
  groups: readonly AwardGroup[],
  requireCompetitions = true,
): GuideRecord[] {
  const records = new Map<string, GuideRecord>();
  const add = (kind: GuideRecord['kind'], id: string, label: string, description: string) => {
    const key = `${kind}:${id}`;
    records.set(key, { key, kind, id, label, description });
  };
  for (const kid of kids) {
    if (kid.showOnMap !== true) continue;
    const group = groups.find((g) => g.province === kid.province);
    const competitions = group ? studentCompetitions(group, kid.id) : [];
    if (requireCompetitions && !competitions.length) continue;
    const province = provinceNames[kid.province];
    add('province', kid.province, province, `จังหวัด ${province} มีนักเรียน Hamsterhub ได้รับรางวัล`);
    add('student', kid.id, kid.nickname || kid.displayName,
      `นักเรียน: ${kid.displayName} (${kid.nickname || ''}) อยู่จังหวัด ${province}. การแข่งขัน/รางวัล: ${competitions.map((entry) => entry.award.title).join(', ') || 'ผลงานยอดเยี่ยม'}`);
    const projects = competitions.flatMap((entry) => entry.project ? [entry.project] : (kid.projects || []));
    for (const project of projects) {
      add('project', project.id, project.title,
        `ผลงาน: "${project.title}" โดย ${kid.nickname || kid.displayName} (${kid.id}) จังหวัด ${province}. ${project.shortDescription}`);
    }
  }
  return [...records.values()];
}

export function guideCatalog(dataset: GuideDataset): GuideRecord[] {
  const parsed = dataset === 'review' ? parseLocalPreview(reviewDataRaw) : createDiscoveryDemo(dataset === 'group');
  return buildGuideCatalog(parsed.kids, parsed.groups, dataset !== 'review');
}

export async function sheetGuideCatalog(options: {
  env?: Record<string, string | undefined>;
  fetch?: typeof fetch;
} = {}): Promise<GuideRecord[] | null> {
  const data = await fetchSheetHallOfFame(options);
  if (!data || !data.kids.length) return null;
  return buildGuideCatalog(data.kids, data.groups, false);
}
