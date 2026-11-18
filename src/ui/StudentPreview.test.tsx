import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createDiscoveryDemo } from "../mock/discovery";
import { StudentPreview } from "./StudentPreview";

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
