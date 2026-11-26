import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { createDiscoveryDemo } from "../mock/discovery";
import { ProvinceRecipients } from "./ProvinceRecipients";

test("province panel renders each recipient once, explicit competition and supplied names", () => {
  const { groups } = createDiscoveryDemo(true);
  const group = groups[0]!;
  const kid = group.awards[0]!.recipients[0]!;
  kid.nickname = "มะลิ";
  kid.fullName = "ชื่อสมมติ นามสกุลสมมติ";
  const html = renderToStaticMarkup(<ProvinceRecipients group={group} studentId={null}
    onStudent={() => {}} onBack={() => {}} onClose={() => {}} />);
  assert.equal((html.match(/data-recipient-id=/g) ?? []).length, 8);
  assert.match(html, /<strong>8 hamsters<\/strong> in Bangkok/i);
  assert.match(html, /มะลิ/);
  assert.match(html, /ชื่อสมมติ นามสกุลสมมติ/);
  assert.match(html, /Creative Coding Award/);
  assert.doesNotMatch(html, /Hidden Student/);
});

test("province panel displays 'A hamster' when single recipient exists", () => {
  const { groups } = createDiscoveryDemo();
  const group = { ...groups[0]!, awards: [{ ...groups[0]!.awards[0]!, recipients: [groups[0]!.awards[0]!.recipients[0]!] }] };
  const html = renderToStaticMarkup(<ProvinceRecipients group={group} studentId={null}
    onStudent={() => {}} onBack={() => {}} onClose={() => {}} />);
  assert.match(html, /<strong>A hamster<\/strong> in Bangkok/);
});

test("unset featured competition does not borrow an achievement for the project preview", () => {
  const { groups } = createDiscoveryDemo();
  const group = groups[0]!;
  group.featuredAwardIds = {};
  const html = renderToStaticMarkup(<ProvinceRecipients group={group} studentId={null}
    onStudent={() => {}} onBack={() => {}} onClose={() => {}} />);
  assert.match(html, /ยังไม่เลือกการแข่งขันแนะนำ/);
  assert.doesNotMatch(html, /Creative Coding Award/);
});
