import type { AwardGroup } from '../data/demoAwards';
import { provinceRecipients } from '../data/provinceRecipients';
import { studentCompetitions } from '../data/studentCompetitions';
import { provinceNames } from '../geo/provinces';
import type { GuideDataset, GuideTarget } from './contract';

export function guideNavigation(target: GuideTarget, groups: readonly AwardGroup[], dataset: GuideDataset) {
  const allowed = (id: string) => {
    if (dataset === 'default' || dataset === 'group') return /^mock-2a-\d{4}$/.test(id);
    return !/^mock-2a-\d{4}$/.test(id);
  };
  for (const group of groups) {
    const people = provinceRecipients(group).filter(({ kid }) => allowed(kid.id));
    if (!people.length) continue;
    if (target.kind === 'province' && (target.id === group.id || target.id === group.province)) {
      return { group, kidId: null, competitionId: null, label: target.label || provinceNames[group.province] };
    }
    for (const { kid } of people) {
      if (target.kind === 'student' && target.id === kid.id) return { group, kidId: kid.id, competitionId: null, label: kid.nickname || kid.displayName };
      if (target.kind === 'project') {
        const competition = studentCompetitions(group, kid.id).find((entry) => entry.project?.id === target.id);
        if (competition) return { group, kidId: kid.id, competitionId: competition.award.id, label: competition.project!.title };
        const project = kid.projects.find((p) => p.id === target.id);
        if (project) {
          const firstComp = studentCompetitions(group, kid.id)[0];
          return { group, kidId: kid.id, competitionId: firstComp?.award.id ?? null, label: project.title };
        }
      }
    }
  }
  return null;
}
