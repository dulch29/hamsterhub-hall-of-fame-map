import { useLayoutEffect, useRef } from "react";
import type { Kid } from "../types";
import type { RecipientAward } from "../data/demoAwards";
import { provinceNames } from "../geo/provinces";
import { CardImage, initialsFor } from "./PinCard";
import { safeExternalUrl } from "./links";
import { previewLayout } from "./bubbleLayout";
import { useBubbleMorph } from "./useBubbleMorph";

export function StudentPreview({ kid, award, onBack, source = null, closing = false, animate = false, onClosed = () => {} }: {
  kid: Kid; award: RecipientAward; onBack: (animate?: boolean) => void;
  source?: HTMLElement | null; closing?: boolean; animate?: boolean; onClosed?: () => void;
}) {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const position = () => {
      const card = root.current;
      if (!card) return;
      const origin = source?.getBoundingClientRect() ?? { x: innerWidth / 2, y: innerHeight / 2, width: 64, height: 64 };
      const bounds = previewLayout({ width: innerWidth, height: innerHeight }, origin);
      Object.assign(card.style, { left: `${bounds.x}px`, top: `${bounds.y}px`, width: `${bounds.width}px`, height: `${bounds.height}px` });
    };
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [source, kid.id]);
  useBubbleMorph({ root, source, closing, animate, onClosed });
  const project = kid.featuredProject;
  const profileUrl = safeExternalUrl(kid.profileUrl);
  const projectUrl = safeExternalUrl(project?.url);
  return (
    <section ref={root} className="student-preview" aria-label="โปรไฟล์เบื้องต้น" lang="th">
      <div className="student-preview__surface" aria-hidden="true" />
      <div className="preview-morph-face" aria-hidden="true">
        <CardImage allowLocal key={kid.avatarUrl} url={kid.avatarUrl} initials={initialsFor(kid.displayName)} />
      </div>
      <div className="student-preview__content">
      <button className="discovery-back" onClick={(event) => onBack(event.detail > 0)}>← กลับไปรายชื่อ</button>
      <div className="student-preview__body">
      <div className="student-preview__identity">
        <span className="recipient-portrait">
          <CardImage allowLocal key={kid.avatarUrl} url={kid.avatarUrl} initials={initialsFor(kid.displayName)} />
        </span>
        <div>
          <p className="discovery-eyebrow">รู้จักเจ้าของไอเดีย</p>
          <h2 tabIndex={-1}>{kid.displayName}</h2>
          <p className="discovery-muted">{provinceNames[kid.province]}</p>
        </div>
      </div>
      <p className="student-preview__award"><span aria-hidden="true">✦</span> {award.title}</p>
      <div className="student-preview__work">
        <p className="discovery-eyebrow">ผลงานที่เลือกมาแนะนำ</p>
        {project ? <>
          <h3>{project.title}</h3>
          <div className="student-preview__thumbnail">
            <CardImage allowLocal key={project.thumbnailUrl} url={project.thumbnailUrl} fallback="ยังไม่มีภาพตัวอย่าง" />
          </div>
          <p className="student-preview__description">{project.shortDescription}</p>
        </> : <div className="student-preview__empty">
          <span aria-hidden="true">✧</span>
          <p>ยังไม่ได้เลือกผลงานแนะนำ</p>
          <p className="discovery-muted">ไปทำความรู้จักและสำรวจผลงานอื่น ๆ ได้ที่โปรไฟล์</p>
        </div>}
      </div>
      </div>
      <div className="student-preview__actions">
        {profileUrl ? <a className="discovery-primary" href={profileUrl} target="_blank" rel="noopener noreferrer">
          ดูโปรไฟล์ <span aria-hidden="true">↗</span>
          <span className="visually-hidden">ของ {kid.displayName} (เปิดแท็บใหม่)</span>
        </a> : <p className="discovery-muted">ยังไม่มีลิงก์โปรไฟล์ที่ใช้งานได้</p>}
        {projectUrl && <a className="discovery-secondary" href={projectUrl} target="_blank" rel="noopener noreferrer">
          ดูผลงาน <span aria-hidden="true">↗</span>
          <span className="visually-hidden"> {project?.title} (เปิดแท็บใหม่)</span>
        </a>}
      </div>
      <p className="student-preview__note">ผลงานแนะนำอาจเป็นคนละชิ้นกับผลงานที่ได้รับรางวัล</p>
      </div>
    </section>
  );
}
