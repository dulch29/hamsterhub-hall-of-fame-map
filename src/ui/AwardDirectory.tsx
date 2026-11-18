import { useMemo, useState } from "react";
import type { AwardGroup } from "../data/demoAwards";
import { provinceNames } from "../geo/provinces";

export function AwardDirectory({ groups, failed, onSelect }: {
  groups: AwardGroup[];
  failed: boolean;
  onSelect: (groupId: string, awardId: string, button: HTMLButtonElement) => void;
}) {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("");
  const filtered = useMemo(() => groups.filter((group) => (!province || province === group.province))
    .map((group) => ({ ...group, awards: group.awards.filter((award) =>
      [award.title, ...award.recipients.map((kid) => kid.displayName)].some((text) =>
        text.normalize("NFC").toLocaleLowerCase().includes(query.trim().normalize("NFC").toLocaleLowerCase()))) }))
    .filter((group) => group.awards.length), [groups, query, province]);
  return (
    <section className="award-directory" aria-label="รายชื่อรางวัลและนักเรียน">
      {failed && <p className="directory-status" role="status">แผนที่ไม่พร้อมใช้งาน ยังเลือกรางวัลและรู้จักนักเรียนได้จากรายชื่อนี้</p>}
      <div className="directory-filters">
        <label>ค้นหาชื่อนักเรียนหรือรางวัล<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
        <label>จังหวัด<select value={province} onChange={(e) => setProvince(e.target.value)}>
          <option value="">ทุกจังหวัด</option>
          {groups.map((group) => <option key={group.id} value={group.province}>{provinceNames[group.province]}</option>)}
        </select></label>
      </div>
      {filtered.map((group) => <section key={group.id} className="directory-province" aria-label={provinceNames[group.province]}>
        <h2>{provinceNames[group.province]}</h2>
        {group.awards.map((award) => <button key={award.id} className="directory-award"
          onClick={(event) => onSelect(group.id, award.id, event.currentTarget)}>
          <span className={`award-choice__dot award-choice__dot--${award.style}`} aria-hidden="true" />
          <span><strong>{award.title}</strong><span>{award.recipients.length} คน · {award.recipients.map((kid) => kid.displayName).join(", ")}</span></span>
          <span aria-hidden="true">→</span>
        </button>)}
      </section>)}
      {filtered.length === 0 && <p role="status">ไม่พบรายชื่อ ลองเปลี่ยนคำค้นหาหรือจังหวัด</p>}
    </section>
  );
}
