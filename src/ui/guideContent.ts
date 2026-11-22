import type { AwardGroup } from "../data/demoAwards";
import { provinceNames } from "../geo/provinces";
import { provinceRecipients } from "../data/provinceRecipients";
import { studentCompetitions } from "../data/studentCompetitions";

export const GUIDE_WELCOME = "ยินดีต้อนรับสู่ Hall of Fame ของ Hamsterhub เลือกเหรียญบนแผนที่ เพื่อทำความรู้จักผู้ได้รับรางวัลในแต่ละจังหวัดได้เลย";
export const GUIDE_MAP_HELP = "ลากเพื่อหมุนแผนที่ และซูมเข้าออกได้ เลือกเหรียญเพื่อเปิดรายชื่อ หรือใช้ปุ่มดูรายชื่อแทนแผนที่";
export const GUIDE_COMPETITIONS = "หน้านี้รวมการแข่งขันของคนที่คุณเลือก เลือกการแข่งขันเพื่อดูผลงานที่เชื่อมไว้ได้เลย";
export const GUIDE_PRESENTATION = "ดูภาพนำเสนอด้วยปุ่มก่อนหน้าและถัดไป หรือเปิดไฟล์ PDF หากมี";

export function provinceNarration(group: AwardGroup) {
  const province = provinceNames[group.province];
  const count = provinceRecipients(group).length;
  const titles = [...new Set(
    group.awards
      .filter((award) => award.recipients.some((kid) => kid.showOnMap === true && kid.province === group.province))
      .map((award) => award.title.trim())
      .filter(Boolean),
  )];
  if (!count || !titles.length) {
    return `จังหวัด${province} มีผู้ได้รับรางวัล ${count} คนในข้อมูลนี้`;
  }
  return `จังหวัด${province} มีผู้ได้รับรางวัล ${count} คน จากรายการ ${titles.join(" · ")} เลือกคนที่สนใจได้เลย`;
}

function trimSnippet(raw: string | undefined, maxLength = 84) {
  const clean = raw?.replace(/\s+/g, " ").trim() ?? "";
  if (!clean) return "";
  if (clean.length <= maxLength) return clean;
  const cut = clean.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  const boundary = lastSpace > maxLength * 0.55 ? lastSpace : maxLength;
  return `${cut.slice(0, boundary).trimEnd()}…`;
}

export function studentNarration(group: AwardGroup, studentId: string) {
  const row = provinceRecipients(group).find((item) => item.kid.id === studentId);
  if (!row) return GUIDE_COMPETITIONS;
  const name = row.kid.nickname?.trim() || row.kid.displayName;
  const competitions = studentCompetitions(group, studentId);
  const featured = competitions.find((entry) => entry.project) ?? competitions[0];
  if (featured?.project) {
    const snippet = trimSnippet(featured.project.shortDescription);
    const header = `นี่คือ ${name}!\nเจ้าของผลงาน "${featured.project.title}" (${featured.award.title})`;
    return snippet ? `${header}\n${snippet}` : header;
  }
  if (competitions.length) {
    const titles = [...new Set(competitions.map((entry) => entry.award.title.trim()).filter(Boolean))];
    if (titles.length) {
      return `นี่คือ ${name}!\nผู้ได้รับรางวัลจาก ${titles.join(" · ")}`;
    }
  }
  return `นี่คือ ${name}!\n${GUIDE_COMPETITIONS}`;
}

export function guideChoices(groups: readonly AwardGroup[]) {
  return groups.flatMap((group) => {
    const rows = provinceRecipients(group);
    return rows.length ? [{ id: group.id, label: provinceNames[group.province], count: rows.length }] : [];
  });
}
