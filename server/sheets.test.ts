import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, sheetCsvToHallOfFame } from './sheets.js';
import { createHallOfFameHandler } from './hallOfFame.js';

test('parseCsv handles quoted fields, commas, escaped quotes, and CRLF', () => {
  const rows = parseCsv('id,title,desc\r\n1,"Hello, ""World""","Line 1\nLine 2"\r\n2,Simple,Plain');
  assert.deepEqual(rows, [
    ['id', 'title', 'desc'],
    ['1', 'Hello, "World"', 'Line 1\nLine 2'],
    ['2', 'Simple', 'Plain'],
  ]);
});

test('sheetCsvToHallOfFame filters opted-out rows, resolves province names, and groups multiple projects per student', () => {
  const csv = [
    'kidId,nickname,fullName,province,showOnMap,awardId,awardTitle,awardStyle,featured,projectId,projectTitle,projectDescription,slides,presentationUrl',
    'stu-1,น้องมาร์ค,เด็กชายมาร์ค ใจดี,TH-10,TRUE,creative,Creative Coding Award,trophy,TRUE,proj-1,Smart Car,"รถบังคับอัจฉริยะ, หลบสิ่งกีดขวาง",https://example.com/1.png | https://example.com/demo.mp4,https://example.com/deck.pdf',
    'stu-1,น้องมาร์ค,เด็กชายมาร์ค ใจดี,TH-10,TRUE,maker,Young Makers Challenge,gold,FALSE,proj-2,Weather Box,สถานีวัดอากาศ,https://example.com/2.png,',
    'stu-2,น้องนุ่น,เด็กหญิงนุ่น,Chiang Mai,TRUE,explorer,Digital Explorers,silver,TRUE,proj-3,Lanna AR,แผนที่ท่องเที่ยว AR,,',
    'stu-hidden,ซ่อนตัว,ไม่แสดง,TH-83,FALSE,ocean,Ocean Challenge,bronze,TRUE,proj-4,Hidden Project,ต้องไม่แสดง,,',
    'stu-badprov,ผิดจังหวัด,ไม่แสดง,INVALID,TRUE,ocean,Ocean Challenge,bronze,TRUE,proj-5,Bad Prov,ต้องไม่แสดง,,',
  ].join('\n');

  const result = sheetCsvToHallOfFame(csv);
  assert.equal(result.kids.length, 2);
  assert.deepEqual(result.kids.map((k) => k.id), ['stu-1', 'stu-2']);
  assert.equal(result.kids[0]!.projects.length, 2);
  assert.equal(result.kids[0]!.featuredProjectId, 'proj-1');
  assert.equal(result.kids[1]!.province, 'TH-50');
  assert.equal(result.groups.length, 2);

  const bkk = result.groups.find((g) => g.province === 'TH-10')!;
  assert.equal(bkk.awards.length, 2);
  assert.equal(bkk.competitionEntries?.[0]?.slides?.length, 2);
  assert.equal(bkk.competitionEntries?.[0]?.slides?.[1]?.type, 'video');
  assert.equal(bkk.competitionEntries?.[0]?.presentationUrl, 'https://example.com/deck.pdf');
});

test('createHallOfFameHandler returns 503 when unconfigured, 405 for POST, and 200 with parsed Sheet data', async () => {
  const unconfigured = createHallOfFameHandler({ env: {} });
  const res503 = await unconfigured(new Request('http://127.0.0.1/api/hall-of-fame'));
  assert.equal(res503.status, 503);

  const res405 = await unconfigured(new Request('http://127.0.0.1/api/hall-of-fame', { method: 'POST' }));
  assert.equal(res405.status, 405);

  const res403 = await unconfigured(new Request('http://127.0.0.1/api/hall-of-fame', {
    headers: { 'sec-fetch-site': 'cross-site' },
  }));
  assert.equal(res403.status, 403);

  const configured = createHallOfFameHandler({
    env: { GOOGLE_SHEET_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/test/pub?output=csv' },
    fetch: async () => new Response(
      'kidId,nickname,province,showOnMap,awardTitle,projectTitle\nstu-9,น้องปริม,TH-83,TRUE,Ocean Award,Coral Saver',
      { status: 200 },
    ),
  });
  const res200 = await configured(new Request('http://127.0.0.1/api/hall-of-fame'));
  assert.equal(res200.status, 200);
  assert.equal(res200.headers.get('cache-control'), 'no-store');
  const body = await res200.json() as { source: string; kids: { id: string }[]; groups: unknown[] };
  assert.equal(body.source, 'sheets');
  assert.equal(body.kids[0]?.id, 'stu-9');
  assert.equal(body.groups.length, 1);
});
