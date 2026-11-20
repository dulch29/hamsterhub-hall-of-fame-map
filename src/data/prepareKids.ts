import { PROVINCE_CODES } from '../types.js';
import type { Kid, Project } from '../types.js';

function validId(id: string): boolean {
  return typeof id === 'string' && id.trim().length > 0;
}

function duplicateIds(records: readonly { id: string }[]): Set<string> {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const record of records) {
    if (!record || typeof record !== 'object') continue;
    const { id } = record;
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return duplicates;
}

// The source supplies visible projects. Production still needs server-side consent and JSON validation.
// Treat output as read-only: featuredProject aliases its entry in the fresh projects array.
export function prepareKids(records: readonly Kid[]): Kid[] {
  const duplicates = duplicateIds(records);
  const kids: Kid[] = [];
  for (const kid of records) {
    if (!kid || typeof kid !== 'object' || !Array.isArray(kid.projects)) continue;
    if (kid.showOnMap !== true || !validId(kid.id) || duplicates.has(kid.id) || !PROVINCE_CODES.includes(kid.province)) continue;
    const duplicateProjects = duplicateIds(kid.projects);
    const projects: Project[] = [];
    for (const project of kid.projects) {
      if (!project || typeof project !== 'object') continue;
      if (!validId(project.id) || duplicateProjects.has(project.id) || !Number.isFinite(Date.parse(project.createdAt))) continue;
      projects.push({
        id: project.id,
        title: project.title,
        thumbnailUrl: project.thumbnailUrl,
        shortDescription: project.shortDescription,
        url: project.url,
        createdAt: project.createdAt,
      });
    }
    const featuredProject = projects.find((project) => project.id === kid.featuredProjectId) ?? null;
    kids.push({
      id: kid.id,
      displayName: kid.displayName,
      ...(typeof kid.nickname === 'string' && kid.nickname.trim() ? { nickname: kid.nickname.trim() } : {}),
      ...(typeof kid.fullName === 'string' && kid.fullName.trim() ? { fullName: kid.fullName.trim() } : {}),
      avatarUrl: kid.avatarUrl,
      province: kid.province,
      showOnMap: true,
      profileUrl: kid.profileUrl,
      projects,
      featuredProjectId: featuredProject?.id ?? null,
      featuredProject,
    });
  }
  return kids;
}
