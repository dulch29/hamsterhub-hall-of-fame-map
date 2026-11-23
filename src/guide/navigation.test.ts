import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AwardGroup } from '../data/demoAwards';
import { createDiscoveryDemo } from '../mock/discovery';
import { guideNavigation } from './navigation';

test('chat targets resolve visible explicit project associations and reject hidden, stale and owner IDs', () => {
  const { groups } = createDiscoveryDemo();
  const group = groups[0]!;
  const kid = group.awards[0]!.recipients[0]!;
  const projectId = group.competitionEntries!.find((entry) => entry.kidId === kid.id && entry.projectId)?.projectId!;
  const result = guideNavigation({ kind: 'project', id: projectId, label: 'untrusted label' }, groups, 'default');
  assert.equal(result?.kidId, kid.id);
  assert.equal(result?.competitionId, 'creative');
  assert.equal(result?.label, 'Hamster Maze');
  assert.equal(guideNavigation({ kind: 'project', id: 'stale', label: 'stale' }, groups, 'default'), null);
  assert.equal(guideNavigation({ kind: 'student', id: kid.id, label: '' }, groups, 'review'), null);
  kid.showOnMap = false;
  assert.equal(guideNavigation({ kind: 'project', id: projectId, label: '' }, groups, 'default'), null);
});

test('guideNavigation resolves provinces and review students in review dataset', () => {
  const reviewGroups: AwardGroup[] = [{
    id: 'TH-10',
    province: 'TH-10',
    leadKidId: 'local-student-1',
    awards: [{
      id: 'award-1',
      title: 'NSC 2026',
      style: 'gold',
      recipients: [{
        id: 'local-student-1',
        displayName: 'Dear',
        province: 'TH-10',
        showOnMap: true,
        profileUrl: '',
        avatarUrl: null,
        featuredProjectId: null,
        featuredProject: null,
        projects: [{
          id: 'local-project-1',
          title: 'Cati',
          shortDescription: 'Cati app',
          url: '',
          createdAt: '',
          thumbnailUrl: null,
        }],
      }],
    }],
  }];
  const provinceNav = guideNavigation({ kind: 'province', id: 'TH-10', label: 'Bangkok' }, reviewGroups, 'review');
  assert.equal(provinceNav?.group.id, 'TH-10');
  assert.equal(provinceNav?.label, 'Bangkok');

  const studentNav = guideNavigation({ kind: 'student', id: 'local-student-1', label: '' }, reviewGroups, 'review');
  assert.equal(studentNav?.kidId, 'local-student-1');
  assert.equal(studentNav?.label, 'Dear');

  const projectNav = guideNavigation({ kind: 'project', id: 'local-project-1', label: '' }, reviewGroups, 'review');
  assert.equal(projectNav?.kidId, 'local-student-1');
  assert.equal(projectNav?.label, 'Cati');
});
