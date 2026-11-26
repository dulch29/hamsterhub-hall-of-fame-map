import { useLayoutEffect, useRef } from "react";
import type { AwardGroup } from "../data/demoAwards";
import { provinceRecipients } from "../data/provinceRecipients";
import { provinceNames } from "../geo/provinces";
import { CardImage, initialsFor } from "./PinCard";

export function ProvinceRecipients({ group, studentId, hidden = false, onStudent, onClose }: {
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
          <h2 ref={heading} tabIndex={-1}>
            <strong>{rows.length === 1 ? "A hamster" : `${rows.length} hamsters`}</strong>{" "}
            in {provinceNames[group.province]}
          </h2>
          <button
            className="province-back-pill"
            onClick={(event) => onClose(event.detail > 0)}
            aria-label="ปิดรายชื่อผู้ได้รับรางวัล"
          >
            <span className="province-back-pill__label" aria-hidden="true">Back</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
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
                <span className="visually-hidden">{featuredCompetition?.title ?? "ยังไม่เลือกการแข่งขันแนะนำ"}</span>
              </span>
              <span className="province-recipient__badge" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8.5" r="5.5" />
                  <path d="M8.5 13.2 7 21l5-2.6L17 21l-1.5-7.8" />
                </svg>
              </span>
            </button>
          </li>)}
        </ul>
        {rows.length === 0 && <p role="status">ยังไม่มีรายชื่อผู้ได้รับรางวัลที่แสดงได้</p>}
      </section>
    </div>
  );
}
