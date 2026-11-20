import type { AwardGroup } from '../data/demoAwards';
import { provinceRecipients } from '../data/provinceRecipients';
import { studentCompetitions } from '../data/studentCompetitions';
import { provinceNames } from '../geo/provinces';
import type { GuideDataset, GuideTarget } from './contract';

export function guideNavigation(target: GuideTarget, groups: readonly AwardGroup[], dataset: GuideDataset) {
  const fictional = (id: string) => dataset === 'review' ? /^review-fictional-[1-6]$/.test(id) : /^mock-2a-\d{4}$/.test(id);
  for (const group of groups) {
    const people = provinceRecipients(group).filter(({ kid }) => fictional(kid.id));
    if (!people.length) continue;
    if (target.kind === 'province' && target.id === group.id) return { group, kidId: null, competitionId: null, label: provinceNames[group.province] };
    for (const { kid } of people) {
      if (target.kind === 'student' && target.id === kid.id) return { group, kidId: kid.id, competitionId: null, label: kid.nickname || kid.displayName };
      if (target.kind === 'project') {
        const competition = studentCompetitions(group, kid.id).find((entry) => entry.project?.id === target.id);
        if (competition) return { group, kidId: kid.id, competitionId: competition.award.id, label: competition.project!.title };
      }
    }
  }
  return null;
}
