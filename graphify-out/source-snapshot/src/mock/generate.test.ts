import assert from 'node:assert/strict';
import test from 'node:test';
import { generateMockKids } from './generate';
import { PROVINCE_CODES } from '../types';
import { createLongNameKid, createOptedOutKid } from './fixtures';

test('defaults to three opted-in fictional students in the agreed provinces', () => {
  const kids = generateMockKids();
  assert.equal(kids.length, 3);
  assert.deepEqual(kids.map((kid) => kid.province), ['TH-10', 'TH-50', 'TH-83']);
  assert.ok(kids.every((kid) => kid.showOnMap && kid.displayName.startsWith('Mock ')));
  assert.ok(kids.every((kid) => kid.avatarUrl === null));
  assert.equal(kids[2]?.featuredProject, null);
});

test('same seed reproduces data and a different seed changes data', () => {
  assert.deepEqual(generateMockKids({ seed: 17 }), generateMockKids({ seed: 17 }));
  assert.notDeepEqual(generateMockKids({ seed: 17 }), generateMockKids({ seed: 18 }));
});

test('supports 500 students with valid provinces, unique IDs and consistent featured projects', () => {
  const kids = generateMockKids({ count: 500 });
  assert.equal(kids.length, 500);
  assert.equal(new Set(kids.map((kid) => kid.id)).size, 500);
  assert.equal(PROVINCE_CODES.length, 77);
  for (const kid of kids) {
    assert.ok(PROVINCE_CODES.includes(kid.province));
    assert.ok(new URL(kid.profileUrl).hostname.endsWith('.invalid'));
    assert.equal('position' in kid, false);
    assert.deepEqual(kid.featuredProject, kid.projects.find((project) => project.id === kid.featuredProjectId) ?? null);
    for (const project of kid.projects) {
      assert.ok(project.shortDescription.length <= 120);
      assert.ok(new URL(project.url).hostname.endsWith('.invalid'));
      assert.ok(Number.isFinite(Date.parse(project.createdAt)));
    }
  }
});

test('handles an empty dataset and rejects invalid generator options', () => {
  assert.deepEqual(generateMockKids({ count: 0 }), []);
  for (const count of [-1, 1.5, NaN, Infinity, 10_001]) {
    assert.throws(() => generateMockKids({ count }), /Count must/);
  }
  assert.throws(() => generateMockKids({ seed: NaN }), /Seed must/);
});

test('explicit edge-case fixtures are synthetic and absent from generated datasets', () => {
  const fixtures = [createOptedOutKid(), createLongNameKid()];
  assert.equal(fixtures[0]!.showOnMap, false);
  assert.equal(fixtures[1]!.showOnMap, true);
  assert.ok(fixtures[1]!.displayName.length >= 200);
  assert.match(fixtures[1]!.displayName, /^[\x20-\x7e]+$/);

  for (const kid of fixtures) {
    assert.ok(kid.id.startsWith('fixture-'));
    assert.ok(PROVINCE_CODES.includes(kid.province));
    assert.equal(kid.avatarUrl, null);
    assert.equal('position' in kid, false);
    assert.ok(new URL(kid.profileUrl).hostname.endsWith('.invalid'));
    assert.deepEqual(kid.featuredProject, kid.projects.find((project) => project.id === kid.featuredProjectId) ?? null);
    for (const project of kid.projects) {
      assert.ok(new URL(project.url).hostname.endsWith('.invalid'));
      assert.ok(project.shortDescription.length <= 120);
      assert.ok(Number.isFinite(Date.parse(project.createdAt)));
    }
  }
  for (const kids of [generateMockKids(), generateMockKids({ count: 500 })]) {
    assert.ok(kids.every((kid) => !fixtures.some((fixture) => fixture.id === kid.id || fixture.displayName === kid.displayName)));
  }
});

test('fixture factories are deterministic and isolate nested mutations', () => {
  for (const create of [createOptedOutKid, createLongNameKid]) {
    const original = create();
    const changed = create();
    assert.deepEqual(original, changed);
    changed.displayName = 'Changed';
    changed.projects.push({
      id: 'fixture-added',
      title: 'Changed',
      thumbnailUrl: null,
      shortDescription: '',
      url: 'https://projects.example.invalid/changed',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    if (changed.featuredProject) changed.featuredProject.title = 'Changed';
    assert.deepEqual(create(), original);
  }
});
