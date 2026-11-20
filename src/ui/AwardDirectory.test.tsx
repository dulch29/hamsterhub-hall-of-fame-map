import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createDiscoveryDemo } from "../mock/discovery";
import { AwardDirectory } from "./AwardDirectory";

test("directory says nothing is available, not 'no match', when there are no recipients", () => {
  const html = renderToStaticMarkup(<AwardDirectory groups={[]} failed={false} onSelect={() => {}} />);
  assert.match(html, /ยังไม่มีผู้ได้รับรางวัลที่แสดงได้/);
  assert.doesNotMatch(html, /ลองเปลี่ยนคำค้นหา/);
});

test("directory lists every demo province and no empty-state message", () => {
  const { groups } = createDiscoveryDemo(false);
  const html = renderToStaticMarkup(<AwardDirectory groups={groups} failed={false} onSelect={() => {}} />);
  assert.equal((html.match(/directory-province-entry/g) ?? []).length, groups.length);
  assert.doesNotMatch(html, /ยังไม่มีผู้ได้รับรางวัล|ไม่พบรายชื่อ/);
});
