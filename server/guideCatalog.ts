import { createDiscoveryDemo } from '../src/mock/discovery.js';
import { provinceNames, provinceNamesTh } from '../src/geo/provinces.js';
import { studentCompetitions } from '../src/data/studentCompetitions.js';
import { parseLocalPreview } from '../src/data/localPreview.js';
import reviewDataRaw from '../public/__local-preview/data.json' with { type: 'json' };
import type { GuideDataset, GuideRecord } from '../src/guide/contract.js';
import type { Kid, ProvinceCode } from '../src/types.js';
import type { AwardGroup } from '../src/data/demoAwards.js';
import { fetchSheetHallOfFame } from './sheets.js';

export function buildGuideCatalog(
  kids: readonly Kid[],
  groups: readonly AwardGroup[],
  requireCompetitions = true,
): GuideRecord[] {
  const records = new Map<string, GuideRecord>();
  const provinceStats = new Map<ProvinceCode, { students: string[]; projects: string[] }>();
  const add = (kind: GuideRecord['kind'], id: string, label: string, description: string) => {
    const key = `${kind}:${id}`;
    records.set(key, { key, kind, id, label, description });
  };
  for (const kid of kids) {
    if (kid.showOnMap !== true) continue;
    const group = groups.find((g) => g.province === kid.province);
    const competitions = group ? studentCompetitions(group, kid.id) : [];
    if (requireCompetitions && !competitions.length) continue;
    const provinceEn = provinceNames[kid.province];
    const provinceTh = provinceNamesTh[kid.province] || provinceEn;
    const provinceText = `${provinceTh} (${provinceEn})`;
    const studentName = kid.nickname || kid.displayName;
    const awardTitles = competitions.map((entry) => entry.award.title).filter(Boolean);
    const projects = competitions.flatMap((entry) => entry.project ? [entry.project] : (kid.projects || []));
    const uniqueProjects = [...new Map(projects.map((project) => [project.id, project])).values()];

    let stats = provinceStats.get(kid.province);
    if (!stats) {
      stats = { students: [], projects: [] };
      provinceStats.set(kid.province, stats);
    }
    if (!stats.students.includes(studentName)) stats.students.push(studentName);
    for (const project of uniqueProjects) {
      if (!stats.projects.includes(project.title)) stats.projects.push(project.title);
    }

    add(
      'student',
      kid.id,
      studentName,
      `นักเรียน: ${kid.displayName}${kid.nickname ? ` (ชื่อเล่น ${kid.nickname})` : ''} จังหวัด ${provinceText}. ผลงาน: ${uniqueProjects.map((p) => p.title).join(', ') || '-'}. การแข่งขัน/รางวัล: ${awardTitles.join(', ') || 'ผลงานยอดเยี่ยม'}`,
    );
    for (const project of uniqueProjects) {
      const projectAwards = competitions
        .filter((entry) => entry.project?.id === project.id)
        .map((entry) => entry.award.title);
      const awardSummary = projectAwards.length ? projectAwards.join(', ') : (awardTitles.join(', ') || 'ผลงานยอดเยี่ยม');
      add(
        'project',
        project.id,
        project.title,
        `ผลงาน: "${project.title}" โดย ${studentName} (${kid.displayName}) จังหวัด ${provinceText}. รางวัล/การแข่งขัน: ${awardSummary}. รายละเอียด: ${project.shortDescription}`,
      );
    }
  }
  const ordered = new Map<string, GuideRecord>();
  for (const [code, stats] of provinceStats) {
    const provinceEn = provinceNames[code];
    const provinceTh = provinceNamesTh[code] || provinceEn;
    const key = `province:${code}`;
    ordered.set(key, {
      key,
      kind: 'province',
      id: code,
      label: provinceEn,
      description: `จังหวัด ${provinceTh} (${provinceEn}) มีผู้ได้รับรางวัล ${stats.students.length} คน: ${stats.students.join(', ')} — ผลงาน: ${stats.projects.join(', ') || '-'}`,
    });
  }
  for (const [key, record] of records) {
    ordered.set(key, record);
  }
  return [...ordered.values()];
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
