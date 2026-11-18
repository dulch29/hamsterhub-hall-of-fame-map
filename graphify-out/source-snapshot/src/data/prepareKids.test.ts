import assert from 'node:assert/strict';
import test from 'node:test';
import type { Kid, Project } from '../types';
import { generateMockKids } from '../mock/generate';
import { createLongNameKid, createOptedOutKid } from '../mock/fixtures';
import { prepareKids } from './prepareKids';

test('preserves the default three students, order, and missing project', () => {
  const source = generateMockKids();
  assert.deepEqual(prepareKids(source), source);
  assert.deepEqual(prepareKids([]), []);
});

test('requires strict opt-in even for students with projects', () => {
  const visible = createLongNameKid();
  for (const showOnMap of [false, undefined, null, 'true', 1]) {
    const source = { ...visible, showOnMap } as unknown as Kid;
    assert.deepEqual(prepareKids([source]), []);
  }
  assert.deepEqual(prepareKids([createOptedOutKid()]), []);
  const result = prepareKids([...generateMockKids({ count: 500 }), createOptedOutKid(), visible]);
  assert.equal(result.length, 501);
  assert.equal(result.at(-1)?.displayName, visible.displayName);
});

test('manual resolution ignores stale featured objects and cross-student selections', () => {
  const [one, two] = generateMockKids();
  assert.ok(one && two);
  const stale = { ...one, featuredProject: two.featuredProject };
  assert.deepEqual(prepareKids([stale])[0]?.featuredProject, one.projects[0]);
  for (const featuredProjectId of ['missing', two.projects[0]!.id]) {
    const result: Kid = prepareKids([{ ...one, featuredProjectId }])[0]!;
    assert.equal(result.featuredProjectId, null);
    assert.equal(result.featuredProject, null);
  }
});

test('provisional unset selection stays null pending the package 01 fallback decision', () => {
  const source = { ...createLongNameKid(), featuredProjectId: null };
  const result = prepareKids([source])[0]!;
  assert.equal(result.projects.length, 1);
  assert.equal(result.featuredProjectId, null);
  assert.equal(result.featuredProject, null);
});

test('drops all duplicate students including opted-in and opted-out collisions', () => {
  const one = createLongNameKid();
  assert.deepEqual(prepareKids([one, { ...one }]), []);
  assert.deepEqual(prepareKids([one, { ...one, showOnMap: false }]), []);
  assert.deepEqual(prepareKids([{ ...one, showOnMap: false }, one]), []);
  assert.equal(prepareKids([{ ...one, id: '__proto__' }]).length, 1);
});

test('skips invalid student IDs and provinces without changing valid IDs', () => {
  const one = createLongNameKid();
  for (const id of ['', ' ', null, 123]) {
    assert.deepEqual(prepareKids([{ ...one, id } as unknown as Kid]), []);
  }
  assert.deepEqual(prepareKids([{ ...one, province: 'TH-00' } as unknown as Kid]), []);
  assert.equal(prepareKids([{ ...one, id: ' valid ' }])[0]?.id, ' valid ');
});

test('removes duplicate, empty-ID, and invalid-date projects before resolving selection', () => {
  const one = createLongNameKid();
  const project = one.projects[0]!;
  for (const projects of [
    [project, { ...project }],
    [{ ...project, createdAt: 'not a date' }],
    [{ ...project, id: '' }],
    [{ ...project, id: ' ' }],
    [{ ...project, id: 123 } as unknown as Project],
  ]) {
    const result = prepareKids([{ ...one, projects }])[0]!;
    assert.deepEqual(result.projects, []);
    assert.equal(result.featuredProjectId, null);
    assert.equal(result.featuredProject, null);
  }
  const valid = { ...project, id: '__proto__' };
  assert.deepEqual(prepareKids([{ ...one, projects: [valid], featuredProjectId: valid.id }])[0]?.featuredProject, valid);
});

test('copies only contract fields and isolates all nested output mutations', () => {
  const one = createLongNameKid();
  const source = [{
    ...one,
    position: { lat: 1, lng: 2 },
    contact: 'synthetic-only',
    projects: [{ ...one.projects[0]!, lat: 1 }],
  }];
  const before = structuredClone(source);
  const result = prepareKids(source);
  const kid = result[0]!;
  assert.deepEqual(Object.keys(kid).sort(), Object.keys(one).sort());
  assert.deepEqual(Object.keys(kid.projects[0]!).sort(), Object.keys(one.projects[0]!).sort());
  assert.deepEqual(source, before);
  kid.displayName = 'Changed';
  kid.projects[0]!.title = 'Changed';
  kid.featuredProject!.shortDescription = 'Changed';
  kid.projects.push({ ...one.projects[0]!, id: 'added' });
  assert.deepEqual(source, before);
});

test('skips malformed record containers and project entries', () => {
  const one = createLongNameKid();
  const records = [null, undefined, 1, 'invalid', { ...one, projects: null }, { ...one, projects: {} }] as unknown as Kid[];
  assert.deepEqual(prepareKids(records), []);
  const projects = [null, 1, ...one.projects] as unknown as Project[];
  assert.deepEqual(prepareKids([{ ...one, projects }])[0], one);
});

test('keeps surviving records in source order when others are skipped', () => {
  const source = generateMockKids();
  source[1]!.showOnMap = false;
  assert.deepEqual(prepareKids(source).map((kid) => kid.id), [source[0]!.id, source[2]!.id]);
});
