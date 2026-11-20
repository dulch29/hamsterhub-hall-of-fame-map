import { useLayoutEffect, useRef } from "react";
import type { AwardGroup } from "../data/demoAwards";
import { provinceRecipients } from "../data/provinceRecipients";
import { provinceNames } from "../geo/provinces";
import { CardImage, initialsFor } from "./PinCard";

export function ProvinceRecipients({ group, studentId, hidden = false, onStudent, onBack, onClose }: {
  group: AwardGroup;
  studentId: string | null;
  hidden?: boolean;
  onStudent: (id: string, button: HTMLButtonElement, animate: boolean) => void;
  onBack: () => void;
  onClose: (animate: boolean) => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const selectedRow = useRef<HTMLButtonElement | null>(null);
  const rows = provinceRecipients(group);
  useLayoutEffect(() => {
    if (!studentId) (selectedRow.current?.isConnected ? selectedRow.current : heading.current)?.focus({ preventScroll: true });
  }, [group.id, studentId]);
  return (
    <div className="province-journey" id="all-recipients">
      <section className="province-recipients" aria-label="ผู้ได้รับรางวัลในจังหวัด" hidden={hidden} inert={Boolean(studentId)}>
        <header className="province-recipients__header">
          <button className="province-back" onClick={onBack} aria-label="กลับไปแผนที่หรือรายชื่อ">‹ กลับ</button>
          <button className="discovery-close" onClick={(event) => onClose(event.detail > 0)} aria-label="ปิดรายชื่อผู้ได้รับรางวัล">×</button>
          <p className="discovery-eyebrow">ผู้ได้รับรางวัล</p>
          <h2 ref={heading} tabIndex={-1}>{provinceNames[group.province]}</h2>
          <p className="discovery-muted">{rows.length} คน · เลือกเพื่อดูผลงานแนะนำ</p>
        </header>
        <ul className="province-recipients__list" aria-label="เลือกนักเรียน">
          {rows.map(({ kid, featuredCompetition }) => <li key={kid.id}>
            <button className="province-recipient" data-recipient-id={kid.id}
              onClick={(event) => {
                selectedRow.current = event.currentTarget;
                onStudent(kid.id, event.currentTarget, event.detail > 0);
              }}>
              <span className="recipient-portrait"><CardImage allowLocal key={kid.avatarUrl} url={kid.avatarUrl} initials={initialsFor(kid.displayName)} /></span>
              <span className="province-recipient__identity">
                <strong>{kid.nickname || kid.displayName}</strong>
                {kid.fullName && <span>{kid.fullName}</span>}
                <span className="province-recipient__competition">{featuredCompetition?.title ?? "ยังไม่เลือกการแข่งขันแนะนำ"}</span>
              </span>
              <span aria-hidden="true">›</span>
            </button>
          </li>)}
        </ul>
        {rows.length === 0 && <p role="status">ยังไม่มีรายชื่อผู้ได้รับรางวัลที่แสดงได้</p>}
      </section>
    </div>
  );
}
