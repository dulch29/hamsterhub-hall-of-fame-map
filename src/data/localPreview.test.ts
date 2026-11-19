import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateMockKids } from '../mock/generate';
import { parseLocalPreview } from './localPreview';
import { createReviewScaleFixture } from '../mock/reviewScale';

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

test('seven-person review isolates provinces and each profile media while preserving the owner', () => {
  const owner = generateMockKids()[0]!;
  const original = structuredClone(owner);
  const fixture = createReviewScaleFixture(owner, { id: 'review', title: 'Example Test Competition', style: 'trophy', logoUrl: '/demo/project-1.svg' });
  const { kids, groups, previews } = parseLocalPreview(fixture);
  assert.equal(kids.length, 7);
  assert.deepEqual(groups.map((group) => [group.province, group.awards[0]!.recipients.length]),
    [['TH-10', 4], ['TH-50', 1], ['TH-40', 1], ['TH-83', 1]]);
  assert.deepEqual(owner, original);
  assert.deepEqual(kids[0]!.projects, owner.projects);
  assert.equal(previews[owner.id]!.presentationUrl, '/__local-preview/presentation.pdf');
  assert.equal(Object.values(previews).filter((media) => media.fictional).length, 6);
  assert.equal(new Set(Object.values(previews).map((media) => media.portraitUrl)).size, 7);
  assert.equal(new Set(kids.map((kid) => kid.avatarUrl)).size, 7);
  for (const kid of kids.slice(1)) {
    assert.equal(previews[kid.id]!.presentationUrl, undefined);
    assert.match(kid.displayName, /^Mock /);
    assert.equal(kid.featuredProject?.id, kid.featuredProjectId);
    assert.equal(kid.profileUrl, '');
    assert.ok(kid.featuredProject!.shortDescription.length >= 294 && kid.featuredProject!.shortDescription.length <= 396);
  }
  fixture.kids[1]!.showOnMap = false;
  fixture.previews['missing'] = { portraitUrl: '/demo/project-1.svg' };
  const filtered = parseLocalPreview(fixture);
  assert.equal(filtered.kids.length, 6);
  assert.equal(filtered.previews[fixture.kids[1]!.id], undefined);
  assert.equal(filtered.previews['missing'], undefined);
  assert.equal(filtered.groups[0]!.awards[0]!.recipients.length, 3);
});

test('review metadata rejects malformed media records', () => {
  const fixture = { kids: generateMockKids(), awards: [], associations: [] };
  for (const previews of [[], null, { sample: [] }, { sample: null }, { sample: { portraitUrl: 7 } }, { sample: { fictional: 'yes' } }]) {
    assert.throws(() => parseLocalPreview({ ...fixture, previews }), { message: 'Invalid local preview' });
  }
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
