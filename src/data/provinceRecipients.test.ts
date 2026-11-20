import { test } from "node:test";
import assert from "node:assert/strict";
import { generateMockKids } from "../mock/generate";
import { DEMO_AWARDS, resolveAwardGroups } from "./demoAwards";
import { provinceRecipients } from "./provinceRecipients";

test("province rows deduplicate memberships and exclude hidden and other-province people", () => {
  const kids = generateMockKids({ count: 3 });
  const groups = resolveAwardGroups(kids, DEMO_AWARDS, [
    { kidId: kids[0]!.id, awardId: "creative" },
    { kidId: kids[0]!.id, awardId: "creative" },
    { kidId: kids[0]!.id, awardId: "maker" },
    { kidId: kids[1]!.id, awardId: "creative" },
  ]);
  const group = groups.find((g) => g.province === "TH-10")!;
  assert.deepEqual(provinceRecipients(group).map((r) => [r.kid.id, r.featuredCompetition]), [[kids[0]!.id, null]]);
  group.awards[0]!.recipients.push({ ...kids[1]!, province: "TH-10", showOnMap: false }, kids[2]!);
  assert.equal(provinceRecipients(group).length, 1);
});

test("featured competition requires one explicit valid selection; stale or conflicting selections stay unset", () => {
  const kids = generateMockKids({ count: 3 });
  const associations = [
    { kidId: kids[0]!.id, awardId: "creative" },
    { kidId: kids[0]!.id, awardId: "maker", featured: true },
  ];
  assert.equal(provinceRecipients(resolveAwardGroups(kids, DEMO_AWARDS, associations)[0]!)[0]!.featuredCompetition?.id, "maker");
  const conflict = [...associations, { kidId: kids[0]!.id, awardId: "creative", featured: true }];
  assert.equal(provinceRecipients(resolveAwardGroups(kids, DEMO_AWARDS, conflict)[0]!)[0]!.featuredCompetition, null);
  const stale = [...associations.map((a) => ({ ...a, featured: false })), { kidId: kids[0]!.id, awardId: "deleted", featured: true }];
  assert.equal(provinceRecipients(resolveAwardGroups(kids, DEMO_AWARDS, stale)[0]!)[0]!.featuredCompetition, null);
});
