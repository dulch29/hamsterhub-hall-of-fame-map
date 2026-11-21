import { useId, useLayoutEffect, useRef, useState } from "react";
import type { Kid } from "../types";
import type { RecipientAward } from "../data/demoAwards";
import { CardImage, initialsFor } from "./PinCard";
import { safeExternalUrl, safeImageUrl } from "./links";
import { profileLayout, type BubbleRect, type ProfileLayout } from "./bubbleLayout";
import { useBubbleMorph } from "./useBubbleMorph";
import type { StudentCompetition } from "../data/studentCompetitions";
import { CompetitionList, CompetitionPresentation } from "./CompetitionContent";
import { resolveStudentPortrait } from "./studentPortrait";

export function StudentPreview({ kid, award, onBack, source = null, closing = false, animate = false, onClosed = () => {}, portraitUrl, fictional = false, layout, sourceBounds, competitions, competitionId, onCompetition, onTypeTick }: {
  kid: Kid; award: RecipientAward; onBack: (animate?: boolean) => void;
  source?: HTMLElement | null; closing?: boolean; animate?: boolean; onClosed?: () => void;
  portraitUrl?: string;
  fictional?: boolean;
  layout?: ProfileLayout;
  sourceBounds?: BubbleRect;
  competitions: StudentCompetition[];
  competitionId?: string | null;
  onCompetition: (id: string | null) => void;
  onTypeTick?: () => void;
}) {
  const root = useRef<HTMLElement>(null);
  const descriptionId = useId();
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState<boolean | null>(null);
  const competitionInvoker = useRef<HTMLButtonElement | null>(null);
  const competitionScroll = useRef(0);
  const previousCompetition = useRef(competitionId);
  const competition = competitions.find((entry) => entry.award.id === competitionId);
  useLayoutEffect(() => {
    const position = () => {
      const card = root.current;
      if (!card) return;
      const portrait = source?.querySelector<HTMLElement>(".recipient-orb, .recipient-portrait") ?? source;
      const origin = portrait?.getBoundingClientRect() ?? { x: innerWidth / 2 - 42, y: innerHeight / 3 - 42, width: 84, height: 84 };
      const bounds = layout ?? profileLayout({ width: innerWidth, height: innerHeight }, origin, Boolean(award.logoUrl));
      const { logoSize, logoX, logoY } = bounds;
      const styles = {
        left: `${bounds.x}px`, top: `${bounds.y}px`, width: `${bounds.width}px`, height: `${bounds.height}px`,
        "--portrait-x": `${bounds.portraitX}px`, "--portrait-y": `${bounds.portraitY}px`, "--portrait-size": `${bounds.portraitSize}px`,
        "--name-x": `${bounds.nameX}px`, "--name-width": `${bounds.nameWidth}px`,
        "--logo-size": `${logoSize}px`, "--logo-x": `${logoX}px`, "--logo-y": `${logoY}px`,
        "--logo-from-x": `${bounds.width / 2 - logoX - logoSize / 2}px`, "--logo-from-y": `${64 - logoY}px`,
      };
      for (const [property, value] of Object.entries(styles)) card.style.setProperty(property, value);
      if (bounds.portraitX < 0) card.dataset.sidePortrait = "true";
      else delete card.dataset.sidePortrait;
    };
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [source, kid.id, award.logoUrl, layout]);
  useLayoutEffect(() => {
    setExpanded(false);
    setTruncated(null);
    const body = root.current?.querySelector(".student-preview__body");
    if (body) body.scrollTop = competitionId ? 0 : competitionScroll.current;
    if (previousCompetition.current && !competitionId) competitionInvoker.current?.focus({ preventScroll: true });
    previousCompetition.current = competitionId;
  }, [competitionId]);
  useBubbleMorph({ root, source, sourceBounds, closing, animate, onClosed });
  const project = competition?.project;
  const profileUrl = safeExternalUrl(kid.profileUrl);
  const logoUrl = safeImageUrl(award.logoUrl);
  const pdfUrl = safeImageUrl(competition?.presentationUrl);
  const previewPortrait = resolveStudentPortrait(kid, portraitUrl);
  const portraitOnMap = Boolean(competition);
  const showReadMore = Boolean(project && (expanded || (truncated ?? project.shortDescription.length > 120)));
  return (
    <section ref={root} className="student-preview" aria-label="โปรไฟล์เบื้องต้น" lang="th"
      data-stage={competition ? "competition" : "student"}
      data-side-portrait={layout && layout.portraitX < 0 ? "true" : undefined}
      data-portrait-on-map={portraitOnMap || undefined}>
      <div className="student-preview__surface" aria-hidden="true" />
      <div className="student-preview__identity" aria-hidden={portraitOnMap || undefined}>
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
        <button className="discovery-back" aria-label={competition ? "กลับไปการแข่งขัน" : "กลับไปรายชื่อ"}
          onClick={(event) => onBack(event.detail > 0)}><span aria-hidden="true">‹</span></button>
        <div className="student-preview__body">
          {fictional && <p className="student-preview__test-label">ข้อมูลสมมติสำหรับทดสอบ</p>}
          <div hidden={Boolean(competition)}><CompetitionList entries={competitions} onSelect={(id, button) => {
            competitionInvoker.current = button;
            competitionScroll.current = root.current?.querySelector(".student-preview__body")?.scrollTop ?? 0;
            onCompetition(id);
          }} /></div>
          {competition && <CompetitionPresentation key={competition.award.id} entry={competition} descriptionId={descriptionId} expanded={expanded}
            speaker={kid.nickname || kid.displayName} onTypeTick={onTypeTick} onTruncate={setTruncated} />}
        </div>
        <footer className="student-preview__footer">
          {profileUrl ? <a className="student-profile-link" href={profileUrl} target="_blank" rel="noopener noreferrer">
            <span>ดูโปรไฟล์</span><span aria-hidden="true">↗</span>
            <span className="visually-hidden">ของ {kid.displayName} (เปิดแท็บใหม่)</span>
          </a> : <p className="discovery-muted">ยังไม่มีลิงก์โปรไฟล์ที่ใช้งานได้</p>}
          {pdfUrl && <a className="student-preview__document" href={pdfUrl} target="_blank" rel="noopener noreferrer"
            aria-label="ดูเอกสารนำเสนอ (PDF เปิดแท็บใหม่)"><span>เปิด PDF</span><span aria-hidden="true">↗</span></a>}
          {showReadMore && <button className="student-preview__read-more"
            aria-expanded={expanded} aria-controls={descriptionId} onClick={() => setExpanded((value) => !value)}>
            {expanded ? "แสดงน้อยลง" : "อ่านเพิ่มเติม"} <span aria-hidden="true">{expanded ? "−" : "+"}</span>
          </button>}
        </footer>
      </div>
    </section>
  );
}
