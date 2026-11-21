import assert from "node:assert/strict";
import { test } from "node:test";
import { createDiscoveryDemo } from "../mock/discovery";
import { guideChoices, provinceNarration } from "./guideContent";

test("Guide recommendations contain only visible province recipient unions", () => {
  const { groups } = createDiscoveryDemo(true);
  assert.deepEqual(guideChoices(groups), [{ id: "TH-10", label: "Bangkok", count: 8 }]);
  for (const award of groups[0]!.awards) for (const kid of award.recipients) kid.showOnMap = false;
  assert.deepEqual(guideChoices(groups), []);
});

test("provinceNarration summarizes catalog-only province name, recipient count, and visible award titles", () => {
  const { groups } = createDiscoveryDemo();
  const bangkok = groups.find((group) => group.province === "TH-10")!;
  const chiangMai = groups.find((group) => group.province === "TH-50")!;
  const phuket = groups.find((group) => group.province === "TH-83")!;

  assert.equal(
    provinceNarration(bangkok),
    "จังหวัดBangkok มีผู้ได้รับรางวัล 1 คน จากรายการ Creative Coding Award · Young Makers Challenge · Digital Explorers Competition เลือกคนที่สนใจได้เลย",
  );
  assert.equal(
    provinceNarration(chiangMai),
    "จังหวัดChiang Mai มีผู้ได้รับรางวัล 1 คน จากรายการ Digital Explorers Competition · Ocean Innovation Challenge เลือกคนที่สนใจได้เลย",
  );
  assert.equal(
    provinceNarration(phuket),
    "จังหวัดPhuket มีผู้ได้รับรางวัล 1 คน จากรายการ Ocean Innovation Challenge เลือกคนที่สนใจได้เลย",
  );
});

test("provinceNarration counts group fixture recipients, deduplicates award titles, and filters hidden or other-province recipients", () => {
  const { groups } = createDiscoveryDemo(true);
  const group = groups[0]!;
  assert.equal(
    provinceNarration(group),
    "จังหวัดBangkok มีผู้ได้รับรางวัล 8 คน จากรายการ Creative Coding Award · Young Makers Challenge · Digital Explorers Competition เลือกคนที่สนใจได้เลย",
  );

  // Duplicate award title should only appear once
  group.awards.push({ ...group.awards[0]! });
  assert.equal(
    provinceNarration(group),
    "จังหวัดBangkok มีผู้ได้รับรางวัล 8 คน จากรายการ Creative Coding Award · Young Makers Challenge · Digital Explorers Competition เลือกคนที่สนใจได้เลย",
  );

  // Award whose recipients are hidden or in another province must be excluded
  group.awards[2] = {
    ...group.awards[2]!,
    recipients: group.awards[2]!.recipients.map((kid) => ({ ...kid, showOnMap: false })),
  };
  group.awards[1] = {
    ...group.awards[1]!,
    recipients: group.awards[1]!.recipients.map((kid) => ({ ...kid, province: "TH-50" })),
  };
  const filtered = provinceNarration(group);
  assert.match(filtered, /จังหวัดBangkok มีผู้ได้รับรางวัล 8 คน/);
  assert.match(filtered, /Creative Coding Award/);
  assert.doesNotMatch(filtered, /Young Makers Challenge/);
  assert.doesNotMatch(filtered, /Digital Explorers Competition/);

  // 0 visible recipients fallback
  for (const award of group.awards) for (const kid of award.recipients) kid.showOnMap = false;
  assert.equal(provinceNarration(group), "จังหวัดBangkok มีผู้ได้รับรางวัล 0 คนในข้อมูลนี้");
});
