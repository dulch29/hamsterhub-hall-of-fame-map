import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createDiscoveryDemo } from "../mock/discovery";
import { studentCompetitions } from "../data/studentCompetitions";
import { StudentPreview } from "./StudentPreview";
import { AwardDiscovery } from "./AwardDiscovery";

function preview(index = 0, competitionId?: string, unsafe = false) {
  const { kids, groups } = createDiscoveryDemo();
  const kid = kids[index]!;
  if (unsafe) kid.profileUrl = "javascript:void(0)";
  const group = groups.find((entry) => entry.province === kid.province)!;
  return renderToStaticMarkup(createElement(StudentPreview, { kid, award: group.awards[0]!,
    competitions: studentCompetitions(group, kid.id), competitionId, onCompetition() {}, onBack() {} }));
}

test("student entry lists every competition before fetching any project presentation", () => {
  const html = preview();
  assert.match(html, /data-stage="student"/);
  assert.equal(html.includes('data-portrait-on-map="true"'), false);
  for (const title of ["Creative Coding Award", "Young Makers Challenge", "Digital Explorers Competition"]) assert.ok(html.includes(title));
  assert.equal(html.includes('src="/demo/project-1.svg"'), false);
  assert.equal(html.includes("maze-notes.pdf"), false);
  assert.match(html, /student-profile-link/);
});

test("competition detail renders its own project, footer PDF action, clamped speech, and map portrait takeover state", () => {
  const html = preview(0, "creative");
  assert.match(html, /data-stage="competition"/);
  assert.match(html, /data-portrait-on-map="true"/);
  assert.match(html, /class="student-preview__identity" aria-hidden="true"/);
  assert.match(html, /data-expanded="false"/);
  assert.equal(html.includes("presentation-instructions"), false);
  assert.match(html, /Hamster Maze/);
  assert.match(html, /alt="Hamster Maze: ภาพรวมเขาวงกต"/);
  assert.ok(html.includes("สไลด์ 1 / 2"));
  const footerStart = html.indexOf('class="student-preview__footer"');
  const pdfIndex = html.indexOf('class="student-preview__document"');
  assert.ok(footerStart > 0 && pdfIndex > footerStart);
  assert.match(html, /href="\/demo\/maze-notes.pdf" target="_blank" rel="noopener noreferrer"/);
  assert.equal(html.includes('src="/demo/maze-route.svg"'), false);
  assert.match(preview(0, "maker"), /Maze Builder Journal/);
});

test("missing links and PDF-only competitions remain usable without featured-project fallback", () => {
  const missing = preview(0, "explorer");
  assert.match(missing, /ยังไม่ได้เชื่อมผลงานกับการแข่งขันนี้/);
  assert.match(missing, /ยังไม่มีสไลด์ภาพ/);
  assert.equal(missing.includes("Hamster Maze"), false);
  const pdfOnly = preview(1, "ocean");
  assert.match(pdfOnly, /เปิด PDF/);
  assert.match(pdfOnly, /ยังไม่ได้เชื่อมผลงานกับการแข่งขันนี้/);
  assert.equal(pdfOnly.includes('aria-label="สไลด์ถัดไป"'), false);
  assert.equal(preview(1, "explorer").includes('aria-label="สไลด์ถัดไป"'), false);
});

test("unsafe destinations do not become links", () => {
  const html = preview(2, "ocean", true);
  assert.equal(html.includes("javascript:"), false);
  assert.equal(html.includes("<a "), false);
  assert.match(html, /ยังไม่มีลิงก์โปรไฟล์ที่ใช้งานได้/);
});

test("portrait bubbles retain nickname, full accessible identity and deduplicated province membership", () => {
  const { groups } = createDiscoveryDemo(true);
  const group = groups[0]!;
  group.awards[0]!.recipients[0]!.nickname = "Example";
  const html = renderToStaticMarkup(createElement(AwardDiscovery, {
    group, studentId: null, showAll: false, anchor: null, previewSource: null,
    previewClosing: false, previewAnimate: false, closing: false, onClosed() {},
    onPreviewClosed() {}, onStudent() {}, onShowAll() {}, onBack() {}, onClose() {},
  }));
  assert.match(html, /recipient-bubble__name">Example<\/span>/);
  assert.match(html, /aria-label="ดูการแข่งขันของ Mock Mali"/);
  assert.equal((html.match(/data-recipient-id=/g) ?? []).length, 4);
  assert.equal(html.includes("hidden-recipient"), false);
  assert.match(html, /ดูผู้ได้รับรางวัลทั้งหมด 8 คน/);
});
