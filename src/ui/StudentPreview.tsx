import { useLayoutEffect, useRef } from "react";
import type { Kid } from "../types";
import type { RecipientAward } from "../data/demoAwards";
import { CardImage, initialsFor } from "./PinCard";
import { safeExternalUrl, safeImageUrl } from "./links";
import { previewLayout } from "./bubbleLayout";
import { useBubbleMorph } from "./useBubbleMorph";

export function StudentPreview({ kid, award, onBack, source = null, closing = false, animate = false, onClosed = () => {}, presentationUrl, portraitUrl }: {
  kid: Kid; award: RecipientAward; onBack: (animate?: boolean) => void;
  source?: HTMLElement | null; closing?: boolean; animate?: boolean; onClosed?: () => void;
  presentationUrl?: string;
  portraitUrl?: string;
}) {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const position = () => {
      const card = root.current;
      if (!card) return;
      const portrait = source?.querySelector<HTMLElement>(".recipient-orb, .recipient-portrait") ?? source;
      const origin = portrait?.getBoundingClientRect() ?? { x: innerWidth / 2 - 42, y: innerHeight / 3 - 42, width: 84, height: 84 };
      const bounds = previewLayout({ width: innerWidth, height: innerHeight }, origin);
      const logoSize = innerWidth < 600 ? 62 : 96;
      const rightFits = bounds.x + bounds.width + logoSize + 28 <= innerWidth - 14;
      const leftFits = bounds.x - logoSize - 28 >= 14;
      const logoX = rightFits ? bounds.width + 28 : leftFits ? -logoSize - 28 : innerWidth < 600 ? 4 : bounds.width - logoSize - 4;
      const logoY = rightFits || leftFits ? 12 : -76;
      if (award.logoUrl && !rightFits && !leftFits) {
        bounds.portraitSize = Math.min(140, bounds.portraitSize);
        bounds.portraitY = -bounds.portraitSize * .25;
      }
      const styles = {
        left: `${bounds.x}px`, top: `${bounds.y}px`, width: `${bounds.width}px`, height: `${bounds.height}px`,
        "--portrait-x": `${bounds.portraitX}px`, "--portrait-y": `${bounds.portraitY}px`, "--portrait-size": `${bounds.portraitSize}px`,
        "--name-x": `${bounds.nameX}px`, "--name-width": `${bounds.nameWidth}px`,
        "--logo-size": `${logoSize}px`, "--logo-x": `${logoX}px`, "--logo-y": `${logoY}px`,
        "--logo-from-x": `${bounds.width / 2 - logoX - logoSize / 2}px`, "--logo-from-y": `${64 - logoY}px`,
      };
      for (const [property, value] of Object.entries(styles)) card.style.setProperty(property, value);
    };
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [source, kid.id, award.logoUrl]);
  useBubbleMorph({ root, source, closing, animate, onClosed });
  const project = kid.featuredProject;
  const profileUrl = safeExternalUrl(kid.profileUrl);
  const documentUrl = safeExternalUrl(presentationUrl);
  const logoUrl = safeImageUrl(award.logoUrl);
  const previewPortrait = portraitUrl ?? (kid.avatarUrl === "/demo/portrait-1.svg" ? "/demo/student-1.svg"
    : kid.avatarUrl === "/demo/portrait-2.svg" ? "/demo/student-2.svg" : kid.avatarUrl);
  return (
    <section ref={root} className="student-preview" aria-label="โปรไฟล์เบื้องต้น" lang="th">
      <div className="student-preview__surface" aria-hidden="true" />
      <div className="student-preview__identity">
        <span className="student-portrait">
          <CardImage allowLocal key={previewPortrait} url={previewPortrait} initials={initialsFor(kid.displayName)} />
        </span>
      </div>
      <h2 className="student-preview__name" tabIndex={-1} aria-label={kid.displayName}>
        {kid.nickname ? <><span className="student-preview__nickname">{kid.nickname}</span>
          <span className="student-preview__fullname">{kid.fullName || kid.displayName}</span></> : kid.fullName || kid.displayName}
      </h2>
      {logoUrl && <div className="competition-bubble" role="img" aria-label={`โลโก้ ${award.title}`}>
        <div className="competition-bubble__float">
          <span className="recipient-orb competition-bubble__orb">
            <CardImage allowLocal key={logoUrl} url={logoUrl} fallback={award.title} />
          </span>
        </div>
      </div>}
      <div className="student-preview__content">
        <button className="discovery-back" aria-label="กลับไปรายชื่อ"
          onClick={(event) => onBack(event.detail > 0)}><span aria-hidden="true">×</span></button>
        <div className="student-preview__body">
          <p className="student-preview__award">{award.title}</p>
          {project ? <>
            <div className="student-preview__thumbnail">
              {documentUrl ? <a className="student-preview__media" href={documentUrl} target="_blank" rel="noopener noreferrer"
                aria-label="ดูเอกสารนำเสนอ (PDF เปิดแท็บใหม่)">
                <CardImage allowLocal key={project.thumbnailUrl} url={project.thumbnailUrl} fallback="ยังไม่มีภาพตัวอย่าง" />
                <span>ดูเอกสารนำเสนอ ↗</span>
              </a> : <CardImage allowLocal key={project.thumbnailUrl} url={project.thumbnailUrl} fallback="ยังไม่มีภาพตัวอย่าง" />}
            </div>
            <h3>{project.title}</h3>
            <p className="student-preview__description">{project.shortDescription}</p>
          </> : <div className="student-preview__empty">
            <span aria-hidden="true">✧</span>
            <p>ยังไม่ได้เลือกผลงานแนะนำ</p>
            <p className="discovery-muted">ไปทำความรู้จักและสำรวจผลงานอื่น ๆ ได้ที่โปรไฟล์</p>
          </div>}
        </div>
        <footer className="student-preview__footer">
          {profileUrl ? <a className="student-profile-link" href={profileUrl} target="_blank" rel="noopener noreferrer">
            <span>ดูโปรไฟล์</span><span aria-hidden="true">↗</span>
            <span className="visually-hidden">ของ {kid.displayName} (เปิดแท็บใหม่)</span>
          </a> : <p className="discovery-muted">ยังไม่มีลิงก์โปรไฟล์ที่ใช้งานได้</p>}
        </footer>
        <p className="visually-hidden">ผลงานแนะนำอาจเป็นคนละชิ้นกับผลงานที่ได้รับรางวัล</p>
      </div>
    </section>
  );
}
