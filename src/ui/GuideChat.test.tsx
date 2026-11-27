import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createDiscoveryDemo } from "../mock/discovery";
import type { GuideTarget } from "../guide/contract";
import { GuideChat, isAffirmativeReply } from "./GuideChat";
import type { useGuideChat } from "./useGuideChat";

function renderChat(turns: ReturnType<typeof useGuideChat>["turns"], onTarget = () => {}, context?: string) {
  const { groups } = createDiscoveryDemo();
  const chat: ReturnType<typeof useGuideChat> = {
    turns,
    question: "",
    setQuestion() {},
    loading: false,
    error: "",
    submit: async () => {},
    stop() {},
    pushLocalTurn() {},
    clear() {},
  };
  return renderToStaticMarkup(createElement(GuideChat, { chat, groups, dataset: "default", context, onTarget }));
}

test("GuideChat shows confirmation wording only when resolved target buttons exist and never auto-navigates", () => {
  let called = 0;
  const { groups } = createDiscoveryDemo();
  const projectId = groups[0]!.competitionEntries!.find((entry) => entry.projectId)?.projectId!;
  const actions: GuideTarget[] = [
    { kind: "project", id: projectId, label: "Hamster Maze" },
    { kind: "student", id: "not-visible", label: "Hidden" },
  ];
  const html = renderChat([
    { role: "user", text: "แนะนำผลงาน" },
    { role: "assistant", text: "ลองดู Hamster Maze", actions },
  ], () => { called++; });

  assert.equal(called, 0);
  assert.ok(html.includes("ให้ฉันเปิดหน้านี้ให้เลยไหม?"));
  assert.ok(html.includes(`data-guide-target="project:${projectId}"`));
  assert.equal((html.match(/<button /g) ?? []).length, 2); // 1 target + 1 send button
});

test("GuideChat omits confirmation wording when actions are empty or rejected by guideNavigation", () => {
  const noActions = renderChat([{ role: "assistant", text: "สวัสดี", actions: [] }]);
  assert.equal(noActions.includes("ให้ฉันเปิดหน้านี้ให้เลยไหม?"), false);

  const rejectedActions = renderChat([{
    role: "assistant",
    text: "ไม่พบรายการ",
    actions: [{ kind: "student", id: "owner", label: "Owner" }],
  }]);
  assert.equal(rejectedActions.includes("ให้ฉันเปิดหน้านี้ให้เลยไหม?"), false);
  assert.equal(rejectedActions.includes("data-guide-target="), false);
});

test("isAffirmativeReply matches natural Thai and English confirmations and rejects questions or commands", () => {
  for (const text of ["ได้เลย", "ได้ครับ", "เปิดเลยครับ", "เอาเลย", "โอเค", "จัดไป", "ใช่ค่ะ", "yes", "ok!", "go ahead"]) {
    assert.equal(isAffirmativeReply(text), true, `expected affirmative for ${text}`);
  }
  for (const text of ["ไม่เอา", "มีเกมอื่นไหม", "เปิด The Last Host", "ขอรายละเอียดเพิ่ม"]) {
    assert.equal(isAffirmativeReply(text), false, `expected non-affirmative for ${text}`);
  }
});

test("GuideChat shows context-aware intro and starter chips only when conversation is empty", () => {
  const overviewHtml = renderChat([]);
  assert.ok(overviewHtml.includes("guide-chat__intro"));
  assert.ok(overviewHtml.includes("guide-chat__intro-highlight"));
  assert.ok(overviewHtml.includes("ฉันคือ Hamster Guide ของ Hall of Fame"));
  assert.equal((overviewHtml.match(/class="guide-chat__chip"/g) ?? []).length, 3);

  const projectHtml = renderChat([], () => {}, "project:project-the-last-host");
  assert.ok(projectHtml.includes("กำลังดูผลงานนี้อยู่ใช่ไหมครับ?"));
  assert.ok(projectHtml.includes("สรุปผลงานนี้สั้นๆ หน่อย"));
  assert.equal((projectHtml.match(/class="guide-chat__chip"/g) ?? []).length, 3);

  const nonEmptyHtml = renderChat([{ role: "assistant", text: "สวัสดี", actions: [] }]);
  assert.equal(nonEmptyHtml.includes("guide-chat__intro"), false);
});
