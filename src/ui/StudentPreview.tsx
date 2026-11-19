import { useLayoutEffect, useRef } from "react";
import type { Kid } from "../types";
import type { RecipientAward } from "../data/demoAwards";
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
      const portrait = source?.querySelector<HTMLElement>(".recipient-orb, .recipient-portrait") ?? source;
      const origin = portrait?.getBoundingClientRect() ?? { x: innerWidth / 2 - 42, y: innerHeight / 3 - 42, width: 84, height: 84 };
      const bounds = previewLayout({ width: innerWidth, height: innerHeight }, origin);
      const styles = {
        left: `${bounds.x}px`, top: `${bounds.y}px`, width: `${bounds.width}px`, height: `${bounds.height}px`,
        "--portrait-x": `${bounds.portraitX}px`, "--portrait-y": `${bounds.portraitY}px`, "--portrait-size": `${bounds.portraitSize}px`,
        "--name-x": `${bounds.nameX}px`, "--name-width": `${bounds.nameWidth}px`,
      };
      for (const [property, value] of Object.entries(styles)) card.style.setProperty(property, value);
    };
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [source, kid.id]);
  useBubbleMorph({ root, source, closing, animate, onClosed });
  const project = kid.featuredProject;
  const profileUrl = safeExternalUrl(kid.profileUrl);
  const portraitUrl = kid.avatarUrl === "/demo/portrait-1.svg" ? "/demo/student-1.svg"
    : kid.avatarUrl === "/demo/portrait-2.svg" ? "/demo/student-2.svg" : kid.avatarUrl;
  return (
    <section ref={root} className="student-preview" aria-label="โปรไฟล์เบื้องต้น" lang="th">
      <div className="student-preview__surface" aria-hidden="true" />
      <div className="student-preview__identity">
        <span className="student-portrait">
          <CardImage allowLocal key={portraitUrl} url={portraitUrl} initials={initialsFor(kid.displayName)} />
        </span>
      </div>
      <h2 className="student-preview__name" tabIndex={-1}>{kid.displayName}</h2>
      <div className="student-preview__content">
        <button className="discovery-back" aria-label="กลับไปรายชื่อ"
          onClick={(event) => onBack(event.detail > 0)}><span aria-hidden="true">×</span></button>
        <div className="student-preview__body">
          <p className="student-preview__award">{award.title}</p>
          {project ? <>
            <div className="student-preview__thumbnail">
              <CardImage allowLocal key={project.thumbnailUrl} url={project.thumbnailUrl} fallback="ยังไม่มีภาพตัวอย่าง" />
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
