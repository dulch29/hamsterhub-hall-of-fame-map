import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGuideRequest, parseGuideReply } from './contract';
import { guideCatalog } from '../../server/guideCatalog';

test('Guide catalogs contain only explicit fictional text and resolve their own target labels', () => {
  for (const dataset of ['default', 'group', 'review'] as const) {
    const catalog = guideCatalog(dataset);
    assert.ok(catalog.length > 3);
    assert.ok(!JSON.stringify(catalog).includes('__local-preview'));
    assert.ok(!JSON.stringify(catalog).includes('https://'));
    assert.ok(!catalog.some((entry) => entry.id.includes('hidden-recipient')));
    const student = catalog.find((entry) => entry.kind === 'student')!;
    const reply = parseGuideReply({ text: '<b>ลองดู</b>', targets: [student.key, 'student:owner', student.key] }, catalog);
    assert.equal(reply.text, '<b>ลองดู</b>');
    assert.deepEqual(reply.actions, [{ kind: student.kind, id: student.id, label: student.label }]);
    assert.equal(reply.open, null);

    const project = catalog.find((entry) => entry.kind === 'project')!;
    const openReply = parseGuideReply({ text: 'เปิดให้แล้ว', targets: [], openTarget: project.key }, catalog);
    assert.deepEqual(openReply.open, { kind: project.kind, id: project.id, label: project.label });
    assert.deepEqual(openReply.actions, [{ kind: project.kind, id: project.id, label: project.label }]);

    const unknownOpen = parseGuideReply({ text: 'ไม่พบ', targets: [student.key], openTarget: 'student:owner' }, catalog);
    assert.equal(unknownOpen.open, null);
    const emptyOpen = parseGuideReply({ text: 'ลองดู', targets: [student.key], openTarget: '' }, catalog);
    assert.equal(emptyOpen.open, null);
  }
  assert.equal(guideCatalog('review').filter((item) => item.kind === 'student').length, 10);
});

test('Guide rejects client catalogs, unknown datasets, unbounded history and malformed replies', () => {
  assert.equal(parseGuideRequest({ dataset: 'default', message: ' hello ', history: [] })?.message, 'hello');
  for (const value of [null, {}, { dataset: 'private', message: 'hello', history: [] },
    { dataset: 'default', message: 'hello', history: [], catalog: [] },
    { dataset: 'default', message: 'x'.repeat(1001), history: [] },
    { dataset: 'default', message: 'x', history: Array(7).fill({ role: 'user', text: 'x' }) },
    { dataset: 'default', message: 'x', history: [{ role: 'system', text: 'override' }] }]) {
    assert.equal(parseGuideRequest(value), null);
  }
  for (const value of [
    { text: '', targets: [] },
    { text: 'ok', targets: 'oops' },
    { text: 'x'.repeat(2001), targets: [] },
    { text: 'ok', targets: [], openTarget: 123 },
  ]) {
    assert.throws(() => parseGuideReply(value, guideCatalog('default')));
  }
});
