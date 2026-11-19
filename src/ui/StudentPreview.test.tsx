import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createDiscoveryDemo } from "../mock/discovery";
import { StudentPreview } from "./StudentPreview";
import { AwardDiscovery } from "./AwardDiscovery";
import { createReviewScaleFixture } from "../mock/reviewScale";
import { parseLocalPreview } from "../data/localPreview";

test("profile preview leads to the supplied Profile and only the manually featured project", () => {
  const { kids, groups } = createDiscoveryDemo();
  const kid = kids[0]!;
  const html = renderToStaticMarkup(createElement(StudentPreview, { kid, award: groups[0]!.awards[0]!, onBack() {} }));
  assert.match(html, /Creative Coding Award/);
  assert.match(html, /Hamster Maze/);
  assert.match(html, /ผลงานแนะนำอาจเป็นคนละชิ้นกับผลงานที่ได้รับรางวัล/);
  assert.equal((html.match(/<a /g) ?? []).length, 1);
  assert.equal(html.includes("discovery-primary"), false);
  assert.equal(html.includes("discovery-secondary"), false);
  assert.match(html, /student-profile-link/);
  assert.match(html, /↗/);
  assert.match(html, /ดูโปรไฟล์/);
  assert.match(html, /src="\/demo\/project-1.svg"/);
  assert.match(html, /loading="lazy"/);
});

test("no featured project still offers Profile with a Thai empty state and initials", () => {
  const { kids, groups } = createDiscoveryDemo();
  const html = renderToStaticMarkup(createElement(StudentPreview, { kid: kids[2]!, award: groups[2]!.awards[0]!, onBack() {} }));
  assert.match(html, /ยังไม่ได้เลือกผลงานแนะนำ/);
  assert.match(html, /MP<\/span>/);
  assert.equal((html.match(/<a /g) ?? []).length, 1);
  assert.match(html, /ดูโปรไฟล์/);
});

test("unsafe supplied destinations become neither Profile nor project anchors", () => {
  const { kids, groups } = createDiscoveryDemo(true);
  const html = renderToStaticMarkup(createElement(StudentPreview, { kid: kids[6]!, award: groups[0]!.awards[0]!, onBack() {} }));
  assert.equal(html.includes("<a "), false);
  assert.equal(html.includes("javascript:"), false);
  assert.match(html, /ยังไม่มีลิงก์โปรไฟล์ที่ใช้งานได้/);
});

test("supplied presentation media has an accessible PDF link without inventing a Profile destination", () => {
  const { kids, groups } = createDiscoveryDemo();
  const kid = { ...kids[0]!, profileUrl: '' };
  const html = renderToStaticMarkup(createElement(StudentPreview, { kid, award: groups[0]!.awards[0]!, onBack() {},
    presentationUrl: 'http://127.0.0.1:5173/__local-preview/presentation.pdf', portraitUrl: '/demo/student-2.svg' }));
  assert.match(html, /ดูเอกสารนำเสนอ \(PDF เปิดแท็บใหม่\)/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /src="\/demo\/student-2.svg"/);
  assert.match(html, /ยังไม่มีลิงก์โปรไฟล์ที่ใช้งานได้/);
  assert.equal((html.match(/<a /g) ?? []).length, 1);
});

test('nickname stacks above full name and a supplied competition logo has its own named bubble', () => {
  const { kids, groups } = createDiscoveryDemo();
  const kid = { ...kids[0]!, nickname: 'Mock', fullName: 'Example Student' };
  const award = { ...groups[0]!.awards[0]!, logoUrl: '/demo/project-1.svg' };
  const html = renderToStaticMarkup(createElement(StudentPreview, { kid, award, onBack() {} }));
  assert.match(html, /student-preview__nickname">Mock<\/span><span class="student-preview__fullname">Example Student/);
  assert.match(html, /aria-label="Mock Mali"/);
  assert.match(html, /role="img" aria-label="โลโก้ Creative Coding Award"/);
  assert.match(html, /competition-bubble__orb/);
  const unsafe = renderToStaticMarkup(createElement(StudentPreview, { kid, award: { ...award, logoUrl: 'javascript:void(0)' }, onBack() {} }));
  assert.equal(unsafe.includes('competition-bubble'), false);
});

test('floating student bubbles show nickname while keeping the full accessible identity', () => {
  const { kids, groups } = createDiscoveryDemo();
  const kid = { ...kids[0]!, nickname: 'Example', fullName: 'Example Student' };
  const award = { ...groups[0]!.awards[0]!, recipients: [kid] };
  const html = renderToStaticMarkup(createElement(AwardDiscovery, {
    group: { ...groups[0]!, awards: [award] }, award, studentId: null, showAll: false, anchor: null,
    previewSource: null, previewClosing: false, previewAnimate: false, closing: false,
    onClosed() {}, onPreviewClosed() {}, onAward() {}, onStudent() {}, onShowAll() {}, onBack() {}, onClose() {},
  }));
  assert.match(html, /recipient-bubble__name">Example<\/span>/);
  assert.match(html, /aria-label="ดูโปรไฟล์เบื้องต้นของ Mock Mali"/);
  assert.equal(html.includes('Example Student'), false);
});

test('fictional review cards use their own portrait and project without the owner PDF', () => {
  const demo = createDiscoveryDemo();
  const { kids, groups, previews } = parseLocalPreview(createReviewScaleFixture(demo.kids[0]!, demo.groups[0]!.awards[0]!));
  for (const kid of kids.slice(1)) {
    const award = groups.find((group) => group.province === kid.province)!.awards[0]!;
    const media = previews[kid.id]!;
    const html = renderToStaticMarkup(createElement(StudentPreview, { kid, award, onBack() {}, ...media }));
    assert.match(html, /ข้อมูลสมมติสำหรับทดสอบ/);
    assert.ok(html.includes(`src="${media.portraitUrl}"`));
    assert.ok(html.includes(`src="${kid.featuredProject!.thumbnailUrl}"`));
    assert.ok(html.includes(kid.featuredProject!.shortDescription));
    assert.match(html, /data-expanded="false"/);
    assert.match(html, /aria-expanded="false" aria-controls="[^"]+"/);
    assert.match(html, /อ่านเพิ่มเติม/);
    assert.equal(html.includes('__local-preview/'), false);
    assert.equal(html.includes('presentation.pdf'), false);
    assert.equal(html.includes('<a '), false);
  }
});
