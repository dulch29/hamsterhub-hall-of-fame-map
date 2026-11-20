import { test } from 'node:test';
import assert from 'node:assert/strict';
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
