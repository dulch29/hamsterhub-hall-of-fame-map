import { createDiscoveryDemo } from '../src/mock/discovery.js';
import { fictionalReviewKids } from '../src/mock/reviewScale.js';
import { provinceNames } from '../src/geo/provinces.js';
import { studentCompetitions } from '../src/data/studentCompetitions.js';
import type { GuideDataset, GuideRecord } from '../src/guide/contract.js';

export function guideCatalog(dataset: GuideDataset): GuideRecord[] {
  const demo = dataset === 'review' ? null : createDiscoveryDemo(dataset === 'group');
  const kids = demo?.kids ?? fictionalReviewKids();
  const records = new Map<string, GuideRecord>();
  const add = (kind: GuideRecord['kind'], id: string, label: string, description: string) => {
    const key = `${kind}:${id}`;
    records.set(key, { key, kind, id, label, description });
  };
  for (const kid of kids) {
    if (kid.showOnMap !== true) continue;
    const group = demo?.groups.find((group) => group.province === kid.province);
    const competitions = group ? studentCompetitions(group, kid.id) : [];
    if (demo && !competitions.length) continue;
    const province = provinceNames[kid.province];
    add('province', kid.province, province, 'Province containing fictional award recipients.');
    add('student', kid.id, kid.nickname || kid.displayName,
      `Fictional student in ${province}. Competitions: ${competitions.map((entry) => entry.award.title).join(', ') || 'Review sample competition; no placement/rank supplied.'}`);
    const projects = demo ? competitions.flatMap((entry) => entry.project ? [entry.project] : []) : kid.projects;
    for (const project of projects) add('project', project.id, project.title,
      `Fictional project by ${kid.nickname || kid.displayName} (${kid.id}) in ${province}. ${project.shortDescription}`);
  }
  return [...records.values()];
}
