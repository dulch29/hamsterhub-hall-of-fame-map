import type { AwardGroup } from "../data/demoAwards";
import { provinceNames, provinceNamesTh } from "../geo/provinces";
import { provinceRecipients } from "../data/provinceRecipients";
import { studentCompetitions } from "../data/studentCompetitions";

export const GUIDE_WELCOME = "เลือกตึกบนแผนที่เพื่อดูผลงานน้องๆ ได้เลย!";
export const GUIDE_MAP_HELP = "ลากหมุนแผนที่ได้ และแตะตึกเพื่อดูรายชื่อน้องๆ";
export const GUIDE_COMPETITIONS = "เลือกรายการเพื่อดูผลงานได้เลย";
export const GUIDE_PRESENTATION = "เลื่อนดูสไลด์หรือเปิด PDF ได้เลย";

export function provinceNarration(group: AwardGroup) {
  const province = provinceNamesTh[group.province];
  const count = provinceRecipients(group).length;
  if (!count) {
    return `${province} ยังไม่มีข้อมูลผู้ได้รับรางวัล`;
  }
  return `${province} มีน้องที่ได้รับรางวัลถึง ${count} คนเลยนะ!\nเลือกคนที่สนใจได้เลย`;
}

export function provinceNarrationHighlights(group: AwardGroup): Array<{ text: string; className: string }> {
  const province = provinceNamesTh[group.province];
  const count = provinceRecipients(group).length;
  if (!count) {
    return [{ text: province, className: "explainer__hl-province" }];
  }
  return [
    { text: province, className: "explainer__hl-province" },
    { text: `${count} คน`, className: "explainer__hl-count" },
  ];
}

export function studentNarration(group: AwardGroup, studentId: string) {
  const row = provinceRecipients(group).find((item) => item.kid.id === studentId);
  if (!row) return GUIDE_COMPETITIONS;
  const name = row.kid.nickname?.trim() || row.kid.displayName;
  const competitions = studentCompetitions(group, studentId);
  const featured = competitions.find((entry) => entry.project) ?? competitions[0];
  if (featured?.project) {
    return `นี่คือ ${name}! เจ้าของผลงาน "${featured.project.title}"`;
  }
  if (competitions.length) {
    const title = competitions[0]?.award.title.trim();
    if (title) {
      return `นี่คือ ${name}! จากรายการ ${title}`;
    }
  }
  return `นี่คือ ${name}! เลือกดูผลงานได้เลย`;
}

export function guideChoices(groups: readonly AwardGroup[]) {
  return groups.flatMap((group) => {
    const rows = provinceRecipients(group);
    return rows.length ? [{ id: group.id, label: provinceNames[group.province], count: rows.length }] : [];
  });
}
