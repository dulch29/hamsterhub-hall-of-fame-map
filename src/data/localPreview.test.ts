import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateMockKids } from '../mock/generate';
import { parseLocalPreview } from './localPreview';

test('local preview prepares opt-in students and resolves only their explicit competition memberships', () => {
  const kids = generateMockKids();
  kids[1]!.showOnMap = false;
  kids[0]!.featuredProject = kids[1]!.projects[0]!;
  const { kids: prepared, groups } = parseLocalPreview({ kids,
    awards: [{ id: 'local-test', title: 'Example Competition', style: 'silver' }],
    associations: [kids[0], kids[0], kids[1], { id: 'missing' }].map((kid) => ({ kidId: kid!.id, awardId: 'local-test' })),
  });
  assert.equal(prepared.length, 2);
  assert.equal(groups.length, 1);
  assert.equal(groups[0]!.awards[0]!.recipients.length, 1);
  assert.equal(prepared[0]!.featuredProject?.id, prepared[0]!.featuredProjectId);
});

test('local preview rejects malformed records without returning raw input in errors', () => {
  const valid = { kids: generateMockKids(), awards: [], associations: [] };
  for (const value of [null, {}, { ...valid, kids: [{ displayName: 'Private value' }] },
    { ...valid, awards: [{ id: 'x', title: 'Example', style: 'platinum' }] },
    { ...valid, associations: [{}] }, { ...valid, kids: [{ ...valid.kids[0], projects: [null] }] }]) {
    assert.throws(() => parseLocalPreview(value), { message: 'Invalid local preview' });
  }
});

test('local preview preserves explicit name fields and competition logo without parsing display names', () => {
  const source = generateMockKids();
  source[0]!.nickname = 'Example'; source[0]!.fullName = 'Example Student';
  const awards = [{ id: 'test', title: 'Example Contest', style: 'silver', logoUrl: '/demo/project-1.svg' }];
  const { kids, groups } = parseLocalPreview({ kids: source, awards, associations: [{ kidId: source[0]!.id, awardId: 'test' }] });
  assert.equal(kids[0]!.nickname, 'Example'); assert.equal(kids[0]!.fullName, 'Example Student');
  assert.equal(kids[1]!.nickname, undefined);
  assert.equal(groups[0]!.awards[0]!.logoUrl, '/demo/project-1.svg');
  assert.throws(() => parseLocalPreview({ kids: [{ ...source[0], nickname: {} }], awards, associations: [] }));
});
