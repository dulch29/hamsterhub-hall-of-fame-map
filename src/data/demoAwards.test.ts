import { test } from "node:test";
import assert from "node:assert/strict";
import { generateMockKids } from "../mock/generate";
import { createDiscoveryDemo } from "../mock/discovery";
import { DEMO_AWARDS, resolveAwardGroups } from "./demoAwards";

test("recipients are isolated by award and province and duplicate associations count once", () => {
  const kids = generateMockKids();
  const groups = resolveAwardGroups(kids, DEMO_AWARDS, [
    { kidId: kids[0]!.id, awardId: "creative" },
    { kidId: kids[0]!.id, awardId: "creative" },
    { kidId: kids[0]!.id, awardId: "maker" },
    { kidId: kids[1]!.id, awardId: "creative" },
  ]);
  assert.equal(groups.length, 2);
  assert.deepEqual(groups[0]!.awards.map((a) => [a.id, a.recipients.length]), [["creative", 1], ["maker", 1]]);
  assert.deepEqual(groups[1]!.awards.map((a) => a.recipients.map((kid) => kid.id)), [[kids[1]!.id]]);
});

test("opted-out, unknown students and unknown awards never create recipients or empty groups", () => {
  const kids = generateMockKids();
  kids[0]!.showOnMap = false;
  assert.deepEqual(resolveAwardGroups(kids, DEMO_AWARDS, [
    { kidId: kids[0]!.id, awardId: "creative" },
    { kidId: "unknown", awardId: "creative" },
    { kidId: kids[1]!.id, awardId: "unknown" },
  ]), []);
});

test("default demo keeps three students and explicit award assignments matching each province", () => {
  const { kids, groups } = createDiscoveryDemo();
  assert.equal(kids.length, 3);
  assert.deepEqual(groups.map((g) => [g.province, g.awards.map((a) => a.style)]), [
    ["TH-10", ["trophy", "gold", "silver"]], ["TH-50", ["silver", "bronze"]], ["TH-83", ["bronze"]],
  ]);
  assert.equal(kids[2]!.featuredProject, null);
});

test("group fixture covers overflow, multiple memberships, missing assets and unsafe links", () => {
  const { kids, groups } = createDiscoveryDemo(true);
  assert.equal(kids.length, 8);
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0]!.awards.map((a) => a.recipients.length), [8, 3, 1]);
  assert.equal(kids.some((kid) => kid.id === "hidden-recipient"), false);
  assert.match(kids[7]!.featuredProject!.title, /Creative Coding/);
});
