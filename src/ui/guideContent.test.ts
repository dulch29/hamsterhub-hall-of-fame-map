import assert from "node:assert/strict";
import { test } from "node:test";
import { createDiscoveryDemo } from "../mock/discovery";
import { guideChoices, provinceNarration, studentNarration } from "./guideContent";

test("Guide recommendations contain only visible province recipient unions", () => {
  const { groups } = createDiscoveryDemo(true);
  assert.deepEqual(guideChoices(groups), [{ id: "TH-10", label: "Bangkok", count: 8 }]);
  for (const award of groups[0]!.awards) for (const kid of award.recipients) kid.showOnMap = false;
  assert.deepEqual(guideChoices(groups), []);
});

test("provinceNarration summarizes catalog-only province name and recipient count concisely", () => {
  const { groups } = createDiscoveryDemo();
  const bangkok = groups.find((group) => group.province === "TH-10")!;
  const chiangMai = groups.find((group) => group.province === "TH-50")!;
  const phuket = groups.find((group) => group.province === "TH-83")!;

  assert.equal(
    provinceNarration(bangkok),
    "Bangkok มีน้องที่ได้รับรางวัลถึง 1 คนเลยนะ!\nเลือกคนที่สนใจได้เลย",
  );
  assert.equal(
    provinceNarration(chiangMai),
    "Chiang Mai มีน้องที่ได้รับรางวัลถึง 1 คนเลยนะ!\nเลือกคนที่สนใจได้เลย",
  );
  assert.equal(
    provinceNarration(phuket),
    "Phuket มีน้องที่ได้รับรางวัลถึง 1 คนเลยนะ!\nเลือกคนที่สนใจได้เลย",
  );
});

test("provinceNarration counts group fixture recipients and handles hidden recipients", () => {
  const { groups } = createDiscoveryDemo(true);
  const group = groups[0]!;
  assert.equal(
    provinceNarration(group),
    "Bangkok มีน้องที่ได้รับรางวัลถึง 8 คนเลยนะ!\nเลือกคนที่สนใจได้เลย",
  );

  // 0 visible recipients fallback
  for (const award of group.awards) for (const kid of award.recipients) kid.showOnMap = false;
  assert.equal(provinceNarration(group), "Bangkok ยังไม่มีข้อมูลผู้ได้รับรางวัล");
});

test("studentNarration introduces student concisely in one line and handles fallbacks", () => {
  const { groups } = createDiscoveryDemo();
  const bangkok = groups.find((group) => group.province === "TH-10")!;
  const [mali] = bangkok.awards[0]!.recipients;

  const intro = studentNarration(bangkok, mali!.id);
  assert.equal(intro, 'นี่คือ Mock Mali! เจ้าของผลงาน "Hamster Maze"');

  // Competition without linked project
  const noProject = {
    ...bangkok,
    competitionEntries: (bangkok.competitionEntries ?? []).map((e) => ({ ...e, projectId: undefined })),
    projects: [],
  };
  const compOnly = studentNarration(noProject, mali!.id);
  assert.equal(compOnly, "นี่คือ Mock Mali! จากรายการ Creative Coding Award");

  // Missing or hidden student falls back
  assert.equal(studentNarration(bangkok, "missing-id"), "เลือกรายการเพื่อดูผลงานได้เลย");
});
