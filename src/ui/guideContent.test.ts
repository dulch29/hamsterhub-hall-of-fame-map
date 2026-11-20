import assert from "node:assert/strict";
import { test } from "node:test";
import { createDiscoveryDemo } from "../mock/discovery";
import { guideChoices, isForwardNarration, provinceNarration } from "./guideContent";

test("Guide recommendations contain only visible province recipient unions", () => {
  const { groups } = createDiscoveryDemo(true);
  assert.deepEqual(guideChoices(groups), [{ id: "TH-10", label: "Bangkok", count: 8 }]);
  for (const award of groups[0]!.awards) for (const kid of award.recipients) kid.showOnMap = false;
  assert.deepEqual(guideChoices(groups), []);
});

test("narration advances on new provinces or people and forward stages, never on Back or exit", () => {
  const province = { province: "TH-10", student: null, level: 0, key: "province" };
  const student = { ...province, student: "person", level: 2, key: "person" };
  const detail = { ...student, level: 3, key: "detail" };
  assert.equal(isForwardNarration(province, student), true);
  assert.equal(isForwardNarration(student, detail), true);
  assert.equal(isForwardNarration(detail, student), false);
  assert.equal(isForwardNarration(student, province), false);
  assert.equal(isForwardNarration(detail, { province: null, student: null, level: 0, key: "home" }), false);
  assert.equal(isForwardNarration(detail, { ...student, student: "peer" }), true);
  assert.equal(isForwardNarration(province, { ...province, province: "TH-50" }), true);
  assert.match(provinceNarration(createDiscoveryDemo().groups[0]!), /จังหวัดBangkok/);
});
