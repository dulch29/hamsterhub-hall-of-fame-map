import { useMemo, useState } from "react";
import type { AwardGroup } from "../data/demoAwards";
import { provinceRecipients } from "../data/provinceRecipients";
import { provinceNames } from "../geo/provinces";

export function AwardDirectory({ groups, failed, onSelect, onRetry }: {
  groups: AwardGroup[];
  failed: boolean;
  onRetry?: () => void;
  onSelect: (groupId: string, button: HTMLButtonElement) => void;
}) {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("");
  const filtered = useMemo(() => groups.filter((group) => (!province || province === group.province))
    .map((group) => ({ group, recipients: provinceRecipients(group) }))
    .filter(({ group, recipients }) => recipients.length && [provinceNames[group.province],
      ...group.awards.map((award) => award.title),
      ...recipients.flatMap(({ kid }) => [kid.displayName, kid.nickname ?? "", kid.fullName ?? ""])]
      .some((text) => text.normalize("NFC").toLocaleLowerCase()
        .includes(query.trim().normalize("NFC").toLocaleLowerCase()))), [groups, query, province]);
  return (
    <section className="award-directory" aria-label="รายชื่อรางวัลและนักเรียน">
      {failed && <div className="directory-status">
        <p role="status">แผนที่ไม่พร้อมใช้งาน ยังเลือกรางวัลและรู้จักนักเรียนได้จากรายชื่อนี้</p>
        {onRetry && <button className="award-choice" onClick={onRetry}>ลองโหลดแผนที่อีกครั้ง</button>}
      </div>}
      <div className="directory-filters">
        <label>ค้นหาชื่อนักเรียนหรือรางวัล<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
        <label>จังหวัด<select value={province} onChange={(e) => setProvince(e.target.value)}>
          <option value="">ทุกจังหวัด</option>
          {groups.map((group) => <option key={group.id} value={group.province}>{provinceNames[group.province]}</option>)}
        </select></label>
      </div>
      {filtered.map(({ group, recipients }) => <section key={group.id} className="directory-province" aria-label={provinceNames[group.province]}>
        <h2>{provinceNames[group.province]}</h2>
        <button className="directory-award directory-province-entry"
          onClick={(event) => onSelect(group.id, event.currentTarget)}>
          <span className="award-choice__dot" aria-hidden="true" />
          <span><strong>ดูผู้ได้รับรางวัล · {provinceNames[group.province]}</strong><span>{recipients.length} คน · {recipients.map(({ kid }) => kid.nickname || kid.displayName).join(", ")}</span></span>
          <span aria-hidden="true">→</span>
        </button>
      </section>)}
      {filtered.length === 0 && <p role="status">ไม่พบรายชื่อ ลองเปลี่ยนคำค้นหาหรือจังหวัด</p>}
    </section>
  );
}
