import type { AwardGroup } from "../data/demoAwards";
import { provinceNames } from "../geo/provinces";
import { provinceRecipients } from "../data/provinceRecipients";

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

export function guideChoices(groups: readonly AwardGroup[]) {
  return groups.flatMap((group) => {
    const rows = provinceRecipients(group);
    return rows.length ? [{ id: group.id, label: provinceNames[group.province], count: rows.length }] : [];
  });
}
