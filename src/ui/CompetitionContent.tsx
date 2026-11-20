import { useLayoutEffect, useRef, useState } from "react";
import type { PresentationSlide } from "../data/demoAwards";
import type { StudentCompetition } from "../data/studentCompetitions";
import { safeImageUrl } from "./links";

export function CompetitionList({ entries, onSelect }: {
  entries: StudentCompetition[];
  onSelect: (id: string, button: HTMLButtonElement) => void;
}) {
  return <div className="competition-list">
    <h3>การแข่งขันและผลงาน</h3>
    <p className="discovery-muted">เลือกการแข่งขันเพื่อดูผลงานและการนำเสนอ</p>
    <ul aria-label="การแข่งขันของนักเรียน">
      {entries.map((entry) => <li key={entry.award.id}>
        <button className="student-competition" data-competition-id={entry.award.id}
          onClick={(event) => onSelect(entry.award.id, event.currentTarget)}>
          <span><strong>{entry.award.title}</strong>
            {entry.featured && <span className="competition-featured">การแข่งขันแนะนำ</span>}
          </span><span aria-hidden="true">›</span>
        </button>
      </li>)}
    </ul>
    {!entries.length && <p role="status">ยังไม่มีการแข่งขันที่แสดงได้</p>}
  </div>;
}

function SlideImage({ slide }: { slide: PresentationSlide }) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const url = safeImageUrl(slide.url);
  if (!url || state === "error") return <div className="presentation-unavailable" role="img" aria-label={slide.alt || "ภาพนำเสนอ"}>
    <span>ภาพนำเสนอไม่พร้อมใช้งาน</span>
  </div>;
  return <>
    {state === "loading" && <span className="presentation-loading" role="status">กำลังโหลดภาพนำเสนอ…</span>}
    <img src={url} alt={slide.alt || "ภาพนำเสนอ"} referrerPolicy="no-referrer"
      onLoad={() => setState("ready")} onError={() => setState("error")} />
  </>;
}

export function CompetitionPresentation({ entry, descriptionId, expanded }: {
  entry: StudentCompetition;
  descriptionId: string;
  expanded: boolean;
}) {
  const [index, setIndex] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  const slide = entry.slides[index];
  const pdf = safeImageUrl(entry.presentationUrl);
  return <div className="competition-presentation" data-competition-id={entry.award.id}>
    <header className="student-preview__project-heading">
      <h3 ref={heading} tabIndex={-1}>{entry.award.title}</h3>
      {entry.project && <h4>{entry.project.title}</h4>}
    </header>
    {slide ? <div className="presentation-gallery" role="group" aria-label="ภาพนำเสนอ" onKeyDown={(event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      event.stopPropagation();
      setIndex((value) => Math.max(0, Math.min(entry.slides.length - 1, value + (event.key === "ArrowRight" ? 1 : -1))));
    }}>
      <figure className="presentation-media" data-slide-index={index + 1}>
        <SlideImage key={`${index}:${slide.url}`} slide={slide} />
      </figure>
      <div className="presentation-controls">
        {entry.slides.length > 1 && <button aria-label="สไลด์ก่อนหน้า" aria-disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>‹</button>}
        <p aria-live="polite" aria-atomic="true">สไลด์ {index + 1} / {entry.slides.length}</p>
        {entry.slides.length > 1 && <button aria-label="สไลด์ถัดไป" aria-disabled={index === entry.slides.length - 1} onClick={() => setIndex((value) => Math.min(entry.slides.length - 1, value + 1))}>›</button>}
      </div>
    </div> : <p className="presentation-empty" role="status">ยังไม่มีสไลด์ภาพสำหรับการแข่งขันนี้</p>}
    {pdf && <a className="student-preview__document" href={pdf} target="_blank" rel="noopener noreferrer"
      aria-label="ดูเอกสารนำเสนอ (PDF เปิดแท็บใหม่)">เปิด PDF <span aria-hidden="true">↗</span></a>}
    {entry.project ? <p id={descriptionId} className="student-preview__description"
      data-expanded={expanded || entry.project.shortDescription.length <= 120}>{entry.project.shortDescription}</p>
      : <div className="student-preview__empty"><p>ยังไม่ได้เชื่อมผลงานกับการแข่งขันนี้</p>
        <p className="discovery-muted">ดูผลงานอื่น ๆ ได้ที่โปรไฟล์ของนักเรียน</p></div>}
  </div>;
}
