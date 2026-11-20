import { useLayoutEffect, useRef, useState } from "react";
import type { AwardGroup } from "../data/demoAwards";
import { provinceRecipients } from "../data/provinceRecipients";
import { provinceNames } from "../geo/provinces";
import { CardImage, initialsFor } from "./PinCard";
import { StudentPreview } from "./StudentPreview";
import { profileLayout, type BubbleRect, type ProfileLayout } from "./bubbleLayout";

export function ProvinceRecipients({ group, studentId, onStudent, onBack, onClose, portraitUrl, presentationUrl, fictional }: {
  group: AwardGroup;
  studentId: string | null;
  onStudent: (id: string | null) => void;
  onBack: () => void;
  onClose: () => void;
  portraitUrl?: string;
  presentationUrl?: string;
  fictional?: boolean;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  const selectedRow = useRef<HTMLButtonElement | null>(null);
  const sourceBounds = useRef<BubbleRect | null>(null);
  const [layout, setLayout] = useState<ProfileLayout>();
  const rows = provinceRecipients(group);
  const selected = rows.find((row) => row.kid.id === studentId);
  useLayoutEffect(() => {
    if (!studentId) (selectedRow.current?.isConnected ? selectedRow.current : heading.current)?.focus({ preventScroll: true });
  }, [group.id, studentId]);
  useLayoutEffect(() => {
    if (!studentId) return;
    const position = () => {
      const next = profileLayout({ width: innerWidth, height: innerHeight },
        sourceBounds.current ?? { x: innerWidth / 2, y: 0, width: 0, height: 0 }, Boolean(selected?.featuredCompetition?.logoUrl));
      if (innerWidth <= 700) {
        // Reserve the phone's upper controls and full identity above the card.
        next.portraitSize = Math.min(140, next.portraitSize);
        next.portraitY = -next.portraitSize * .25;
        next.y = Math.max(next.y, 330);
        next.height = innerHeight - next.y - 24;
      }
      setLayout(next);
    };
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [studentId, selected?.featuredCompetition?.logoUrl]);
  return (
    <div className={`province-journey ${selected ? "has-preview" : ""}`}>
      <section className="province-recipients" aria-label="ผู้ได้รับรางวัลในจังหวัด" hidden={Boolean(selected)}>
        <header className="province-recipients__header">
          <button className="province-back" onClick={onBack} aria-label="กลับไปแผนที่หรือรายชื่อ">‹ กลับ</button>
          <button className="discovery-close" onClick={onClose} aria-label="ปิดรายชื่อผู้ได้รับรางวัล">×</button>
          <p className="discovery-eyebrow">ผู้ได้รับรางวัล</p>
          <h2 ref={heading} tabIndex={-1}>{provinceNames[group.province]}</h2>
          <p className="discovery-muted">{rows.length} คน · เลือกเพื่อดูผลงานแนะนำ</p>
        </header>
        <ul className="province-recipients__list" aria-label="เลือกนักเรียน">
          {rows.map(({ kid, featuredCompetition }) => <li key={kid.id}>
            <button className="province-recipient" data-recipient-id={kid.id}
              onClick={(event) => {
                selectedRow.current = event.currentTarget;
                const portrait = event.currentTarget.querySelector(".recipient-portrait") ?? event.currentTarget;
                sourceBounds.current = portrait.getBoundingClientRect();
                onStudent(kid.id);
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
      {selected && <>
        <button className="province-journey__close" onClick={onClose}>ปิดกลับแผนที่หรือรายชื่อ ×</button>
        <StudentPreview key={selected.kid.id} kid={selected.kid}
          award={selected.featuredCompetition ?? { id: "unset", title: "", style: "gold", recipients: [selected.kid] }}
          source={selectedRow.current} layout={layout} onBack={() => onStudent(null)}
          portraitUrl={portraitUrl} presentationUrl={presentationUrl} fictional={fictional} />
      </>}
    </div>
  );
}
